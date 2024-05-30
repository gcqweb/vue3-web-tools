import { defineStore } from "pinia";
import localStorageUtil from "@/utils/localStorage.js";
export const useCurrentRouter = defineStore("routeStore", {
  state: () => ({
    currentMeunRouter: "/",
    currentTabRouter: localStorageUtil.get("currentTabRouter") || "/tools",
  }),
  // currentMeunRouter: "/",
  // currentTabRouter: "/tools",
  // currentTabRouterChild:[],
  actions: {
    setCurrentMenuRouter(currentRouter) {
      this.currentMeunRouter = currentRouter;
      localStorageUtil.set("currentMeunRouter", currentRouter);
    },
    setCurrentTabRouter(currentRouter) {
      this.currentTabRouter = currentRouter;
      localStorageUtil.set("currentTabRouter", currentRouter);
    },

    updateCurrentRouterField(field, value) {
      this.currentMeunRouter[field] = value;
    },
    updateCurrentTabRouterField(field, value) {
      this.currentTabRouter[field] = value;
    },
  },
});
