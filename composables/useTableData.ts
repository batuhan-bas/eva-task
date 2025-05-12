import { useAuthStore } from "~/stores/auth";
import { useChartStore } from "~/stores/chart";

interface SkuItem {
  sku: string;
  productName: string;
  qty: number;
  amount: number;
}

interface RefundResponse {
  sku: string;
  refundRate: number;
}

interface SkuListResponse {
  ApiStatus: boolean;
  Data: {
    item: {
      skuList: SkuItem[];
    };
  };
}

interface RefundListResponse {
  ApiStatus: boolean;
  Data: {
    item: RefundResponse[];
  };
}

export const useTableData = () => {
  const authStore = useAuthStore();
  const chartStore = useChartStore();

  const fetchTableData = async (pageNumber = 1, pageSize = 30) => {
    console.log("🟢 fetchTableData başladı");

    const token = authStore.token;
    const user = authStore.user?.Data?.user || authStore.user?.user;
    const dates = chartStore.selectedDates;

    console.log("🔑 Token:", token);
    console.log("👤 User:", user);
    console.log("📅 Seçili tarihler:", dates);

    const store = user?.store?.[0];
    const storeId = store?.storeId;
    const marketplace = store?.marketplaceName;

    if (!token || !storeId || !marketplace || dates.length === 0) {
      console.warn("⛔ Eksik parametreler:", {
        token,
        storeId,
        marketplace,
        dates,
      });
      return [];
    }

    const skuRequestBody = {
      isDaysCompare: dates.length === 2 ? 1 : 0,
      marketplace,
      pageNumber,
      pageSize,
      salesDate: dates[0],
      salesDate2: dates[1] ?? "",
      sellerId: storeId,
    };

    console.log("📤 SKU API body:", skuRequestBody);

    const { data: skuListRes } = await useFetch<SkuListResponse>(
      "/data/daily-sales-sku-list/",
      {
        baseURL: "https://iapitest.eva.guru",
        method: "POST",
        headers: { Authorization: `Bearer ${token.trim()}` },
        body: skuRequestBody,
      }
    );

    console.log(
      "📦 SKU API Response:",
      JSON.stringify(skuListRes.value, null, 2)
    );

    console.log("📦 SKU API Response:", skuListRes.value);

    const skuList = skuListRes.value?.Data?.item?.skuList ?? [];

    if (!skuList.length) {
      console.warn("❌ SKU listesi boş geldi.");
      return [];
    }

    console.log("🟩 Gelen SKU listesi:", skuList);

    const refundBody = {
      skuList: skuList.map((s) => s.sku),
      marketplace,
      sellerId: storeId,
      requestedDay: 0,
    };

    console.log("📤 Refund request body:", refundBody);

    const { data: refundRes } = await useFetch<RefundListResponse>(
      "/data/get-sku-refund-rate/",
      {
        baseURL: "https://iapitest.eva.guru",
        method: "POST",
        headers: { Authorization: `Bearer ${token.trim()}` },
        body: refundBody,
      }
    );

    console.log("📦 Refund API Response:", refundRes.value);

    const refundMap = new Map(
      refundRes.value?.Data?.item?.map((item: RefundResponse) => [
        item.sku,
        item.refundRate,
      ]) ?? []
    );

    const merged = skuList.map((item) => ({
      sku: item.sku,
      unitsSold: item.qty,
      revenue: item.amount,
      refundRate: refundMap.get(item.sku) ?? null,
    }));

    console.log("✅ Hazır merged tablo:", merged);
    return merged;
  };

  return {
    fetchTableData,
  };
};
