import { useAuthStore } from "~/stores/auth";

interface SalesDataItem {
  date: string;
  fbaAmount: number;
  fbmAmount: number;
  fbaShippingAmount: number;
  profit: number;
}

export const useChartData = () => {
  const authStore = useAuthStore();

  const fetchChartData = async (day: 7 | 14 | 30 | 60) => {
    if (!authStore.token || !authStore.user) {
      console.warn("⛔ authStore eksik!", {
        token: authStore.token,
        user: authStore.user,
      });
      return [];
    }

    const user = authStore.user?.Data?.user;
    const store = user?.store?.[0];
    if (!store) return [];

    const { storeId, marketplaceName } = store;

    try {
      const response = await fetch(
        "https://iapitest.eva.guru/data/daily-sales-overview/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token.trim()}`,
          },
          body: JSON.stringify({
            customDateData: null,
            day,
            excludeYoYData: true,
            marketplace: marketplaceName,
            requestStatus: 0,
            sellerId: storeId,
          }),
        }
      );

      const json = await response.json();

      if (!json?.Data?.item) return [];
      return json.Data.item;
    } catch (error) {
      console.error("fetch() error:", error);
      return [];
    }
  };

  return {
    fetchChartData,
  };
};
