import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { pinia } from "./store";
import router from "./router";
import "//at.alicdn.com/t/c/font_4529508_7ssi6fyh6s2.js";
import "//at.alicdn.com/t/c/font_4117996_7oazamvx2eb.js";
import "es-drager/lib/style.css";
import Drager from "es-drager";

const app = createApp(App);
app.component("Drager", Drager);
app.use(pinia);
app.use(router);
app.mount("#app");
