import { defineStore } from "pinia";
import localStorageUtil from "@/utils/localStorage.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: localStorageUtil.get("userInfo") || {},
    // userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
  }),
  actions: {
    setUser(userInfo) {
      this.userInfo = userInfo;
      // localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorageUtil.set("userInfo", userInfo);
    },
    clearUser() {
      this.userInfo = {};
      // localStorage.removeItem("userInfo");
      localStorageUtil.remove("userInfo");
    },
    updateUserField(field, value) {
      this.userInfo[field] = value;
      // localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      localStorageUtil.set("userInfo", this.userInfo);
    },
  },
});
