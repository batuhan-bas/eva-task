import { defineStore } from "pinia";

export const useChartStore = defineStore("chart", {
  state: () => ({
    selectedDates: [] as string[], // örnek: ["2022-11-09", "2022-11-10"]
  }),
  actions: {
    toggleDate(date: string) {
      const index = this.selectedDates.indexOf(date);

      if (index !== -1) {
        // Zaten varsa → kaldır
        this.selectedDates.splice(index, 1);
      } else if (this.selectedDates.length < 2) {
        // Yoksa ve 2'den azsa → ekle
        this.selectedDates.push(date);
      } else {
        // 2 seçim varsa → ilkini çıkar, yeniyi ekle
        this.selectedDates.shift();
        this.selectedDates.push(date);
      }
    },
    resetDates() {
      this.selectedDates = [];
    },
  },
});
