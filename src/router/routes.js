// src/router/index.js

import Home from "@/pages/Home.vue";
import App_template from "@/pages/app_template.vue";
// import Tools from "@/pages/Tools.vue";
import About from "@/pages/about/About.vue";
import Space from "@/pages/test/space_test.vue";
import Layout from "@/layout/index.vue";
import img_tool_routes from "./img_tool_routes.js";
import text_tool_routes from "./text_tool_routes.js";
// import { defineAsyncComponent } from "vue";
// const Layout = defineAsyncComponent(() => import("@/layout/index.vue"));
const Tools = () => import("@/pages/Tools.vue");

import { h } from "vue";
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import tabs from "./tool_tab_routes";

const routes = [
  {
    path: "/",
    redirect: "/tools", // 当访问根路径时，重定向到 /home
    name: "home",
    component: Layout,
    meta: {
      label: "主页",
      icon: h(HomeOutlined),
      add_menu: false,
    },
    children: [
      {
        path: "/tools",
        name: "tools",
        component: Tools,
        meta: {
          label: "工具箱",
          icon: "icon-a-yingyongmokuai2x" || h(AppstoreOutlined),

          add_menu: true,
        },
        // children: tabs,
      },
    ], // tabs,
  },
  ...tabs,
  // {
  //   path: "/space/:id",
  //   name: "space",
  //   component: Space,
  //   meta: {
  //     label: "个人空间",
  //     icon: h(UserOutlined),
  //     // icon: "icon-yonghu",
  //     add_menu: true,
  //   },
  //   // children: [],
  // },
  // {
  //   path: "/test/:app",
  //   name: "test",
  //   component: () => import("@/pages/test/testapp.vue"),
  //   meta: {
  //     label: "测试",
  //     icon: h(AppstoreOutlined),
  //     add_menu: true,
  //   },
  //   // children: [],
  // },

  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/about/About.vue"),
    meta: {
      label: "关于",
      icon: h(InfoCircleOutlined),
      add_menu: true,
    },
    children: [],
  },
];
/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("@/pages/login/Login.vue"),
  },
  // {
  //   path: "/dataCenter",
  //   name: "dataCenter",
  //   meta: {
  //     title: "大屏展示",
  //   },
  //   component: () => import("@/views/demo/dataCenter/index.vue"),
  // },
];

/**
 * 错误页面
 */
const error_router = [
  {
    path: "/401",
    name: "401",
    component: () => import("@/pages/error/401.vue"),
    meta: {
      title: "401",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      title: "404",
    },
  },
];

// 导出需要显示菜单的
// export const frameInRoutes = frameIn;

export default [...routes, ...frameOut, ...error_router];
