import { defineStore } from "pinia";
import localStorageUtil from "@/utils/localStorage.js";

export const useSiderWidth = defineStore("sider", {
  state: () => ({
    siderWidth: localStorageUtil.get("siderWidth") || 240,
    siderOpen: localStorageUtil.get("siderOpen") || true,
  }),
  actions: {
    setSider(siderWidth) {
      this.siderWidth = siderWidth;
      localStorageUtil.set("siderWidth", siderWidth);
    },
    toggleSider() {
      this.siderOpen = !this.siderOpen;
      localStorageUtil.set("siderOpen", this.siderOpen);
    },
    clearSider() {
      this.siderWidth = {};
      localStorageUtil.remove("siderWidth");
    },
    updateSiderField(field, value) {
      this.siderWidth[field] = value;
      localStorageUtil.set("siderWidth", this.siderWidth);
    },
  },
});
