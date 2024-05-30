import { defineStore } from "pinia";
import localStorageUtil from "@/utils/localStorage.js";
export const useSearch = defineStore("searchStore", {
  state: () => ({
    searchQuery: "",
    //   currentTabRouter: localStorageUtil.get("currentTabRouter") || "/tools",
  }),
  actions: {
    updateSearchQuery(query) {
      this.searchQuery = query;
      //   localStorageUtil.set("currentMeunRouter", currentRouter);
    },
  },
});
