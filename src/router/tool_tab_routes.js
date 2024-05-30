import { h } from "vue";
import { MailOutlined } from "@ant-design/icons-vue";
import img_tool_routes from "./img_tool_routes.js";
import text_tool_routes from "./text_tool_routes.js";
import office_tool_routes from "./office_tool_routes.js";
import Layout from "@/layout/index.vue";
import App_template from "@/pages/app_template.vue";
const tabs = [
  {
    path: "/img_tools",
    name: "img_tools",
    // component: () => import("@/pages/apps/AppsLayout.vue"),
    component: App_template,
    // component: () => import("@/pages/apps/image_tools/IDPhoto.vue"),
    meta: {
      label: "图片工具",
      icon: h(MailOutlined),
      is_tabs: true,
    },
    //
    children: img_tool_routes,
  },
  {
    path: "/text_tools",
    name: "text_tools",
    component: App_template,
    // component: () => import("@/pages/apps/Appy.vue"),
    meta: {
      label: "文本工具",
      icon: h(MailOutlined),
      is_tabs: true,
    },
    children: text_tool_routes,
  },
  {
    path: "/office_tools",
    name: "office_tools",
    component: App_template,
    // component: () => import("@/pages/apps/Appy.vue"),
    meta: {
      label: "办公工具",
      icon: h(MailOutlined),
      is_tabs: true,
    },
    children: office_tool_routes,
  },
];

export default tabs;
