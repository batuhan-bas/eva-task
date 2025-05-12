<template>
  <div
    v-if="pagedRows.length"
    class="mt-8 bg-white shadow-md rounded-lg overflow-x-auto"
  >
    <table class="min-w-full text-sm text-left table-auto">
      <thead class="bg-gray-100 text-xs text-gray-600 uppercase tracking-wider">
        <tr>
          <th class="px-5 py-3">SKU</th>
          <th class="px-5 py-3">Units Sold</th>
          <th class="px-5 py-3">Revenue</th>
          <th class="px-5 py-3">Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in pagedRows"
          :key="index"
          class="border-b hover:bg-gray-50 transition-colors"
        >
          <td class="px-5 py-3 font-mono text-gray-800">{{ item.sku }}</td>
          <td class="px-5 py-3 text-gray-700">{{ item.unitsSold }}</td>
          <td class="px-5 py-3 text-green-600 font-medium">
            ${{ item.revenue.toFixed(2) }}
          </td>
          <td class="px-5 py-3">
            <span v-if="item.refundRate !== null">
              {{ (item.refundRate * 100).toFixed(2) }}%
            </span>
            <span v-else class="text-gray-400 italic">N/A</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-3 px-5 py-4 border-t">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <span class="text-sm text-gray-700">Page {{ currentPage }}</span>
      <button
        @click="nextPage"
        :disabled="pagedRows.length < pageSize"
        class="px-4 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>

  <div v-else class="mt-8 text-gray-500 italic text-center">
    Veri bulunamadı veya tarih seçilmedi.
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useTableData } from "~/composables/useTableData";
import { useChartStore } from "~/stores/chart";

const { fetchTableData } = useTableData();
const chartStore = useChartStore();

const rows = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = 10;

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return rows.value.slice(start, start + pageSize);
});

const load = async () => {
  const result = await fetchTableData();
  rows.value = [...result];
  currentPage.value = 1;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (pagedRows.value.length < pageSize) return;
  currentPage.value++;
};

watch(
  () => [...chartStore.selectedDates],
  async () => {
    await load();
  },
  { immediate: true }
);
</script>
