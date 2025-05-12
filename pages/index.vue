<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <SalesChart />
    <SalesTable />
  </div>
</template>

<script setup lang="ts">
import SalesChart from "~/components/SalesChart.vue";
import SalesTable from "~/components/SalesTable.vue";

definePageMeta({
  middleware: async () => {
    const auth = useAuthStore();
    if (!auth.token) {
      return navigateTo("/login");
    }
  },
});
</script>
