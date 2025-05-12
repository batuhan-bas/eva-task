<template>
  <div
    v-if="authStore.token && authStore.user"
    class="bg-white p-6 rounded-xl shadow-md"
  >
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <h2 class="text-xl font-bold text-gray-800">📊 Sales Overview</h2>
      <select
        v-model="selectedDay"
        @change="loadData"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option :value="7">Last 7 Days</option>
        <option :value="14">Last 14 Days</option>
        <option :value="30">Last 30 Days</option>
        <option :value="60">Last 60 Days</option>
      </select>
    </div>
    <div ref="chartRef" class="overflow-x-auto"></div>
  </div>
</template>

<script setup lang="ts">
import Highcharts from "highcharts";
import { ref, onMounted, watch } from "vue";
import { useChartData } from "~/composables/useChartData";
import { useChartStore } from "~/stores/chart";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const chartStore = useChartStore();
const { fetchChartData } = useChartData();

const chartRef = ref<HTMLDivElement | null>(null);
const selectedDay = ref<7 | 14 | 30 | 60>(30);

const loadData = async () => {
  const data = await fetchChartData(selectedDay.value);
  if (!chartRef.value || !data.length) return;

  if (chartStore.selectedDates.length === 0 && data[0]?.date) {
    chartStore.toggleDate(data[0].date);
  }

  Highcharts.chart(chartRef.value, {
    chart: {
      type: "column",
    },
    title: { text: "" },
    xAxis: {
      categories: data.map((item) => item.date),
    },
    yAxis: {
      title: { text: "Sales Amount" },
    },
    tooltip: {
      formatter: function () {
        const p = this.point as any;
        const total = p.fbaAmount + p.fbmAmount;
        return `
          <b>${p.category}</b><br/>
          Total: $${total.toFixed(2)}<br/>
          FBA: $${p.fbaAmount.toFixed(2)}<br/>
          FBM: $${p.fbmAmount.toFixed(2)}<br/>
          Shipping: $${p.fbaShippingAmount.toFixed(2)}<br/>
          Profit: $${p.profit.toFixed(2)}
        `;
      },
    },
    plotOptions: {
      column: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const clicked = (this as any).category;
              chartStore.toggleDate(clicked);
            },
          },
        },
      },
    },
    series: [
      {
        name: "Total Sales",
        data: data.map((item) => ({
          y: item.fbaAmount + item.fbmAmount,
          fbaAmount: item.fbaAmount,
          fbmAmount: item.fbmAmount,
          fbaShippingAmount: item.fbaShippingAmount,
          profit: item.profit,
          category: item.date,
        })),
        color: "#3b82f6",
      },
    ],
  });
};

onMounted(loadData);
watch(selectedDay, loadData);
</script>
