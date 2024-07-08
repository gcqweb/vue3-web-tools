import { h } from "vue";
import { MailOutlined } from "@ant-design/icons-vue";

const office_tool_routes = [
  // {
  //   path: "/zip",
  //   name: "zip",
  //   component: () => import("@/pages/apps/office_tools/zip.vue"),
  //   meta: {
  //     label: "文件压缩zip",
  //     icon: h(MailOutlined),
  //     desc: "zip文件解压",
  //     app_icon: "icon-shijianchuozhuanriqishijian",
  //   },
  // },
  // {
  //   path: "/unzip",
  //   name: "unzip",
  //   component: () => import("@/pages/apps/office_tools/unzip.vue"),
  //   meta: {
  //     label: "zip解压",
  //     icon: h(MailOutlined),
  //     desc: "zip文件解压",
  //     app_icon: "icon-shijianchuozhuanriqishijian",
  //   },
  // },
  {
    path: "/timestamp",
    name: "timestamp",
    component: () => import("@/pages/apps/office_tools/timestamp.vue"),
    meta: {
      label: "时间戳转换",
      icon: h(MailOutlined),
      desc: "日期时间、时间戳相互转换",
      app_icon: "icon-shijianchuozhuanriqishijian",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/life",
    name: "life",
    component: () => import("@/pages/apps/office_tools/life.vue"),
    meta: {
      label: "活了多久",
      desc: "你已生活了 n 天🌏",
      icon: h(MailOutlined),
      app_icon: "icon-shengmingtizheng",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/img2pdf",
    name: "img2pdf",
    component: () => import("@/pages/apps/office_tools/img2pdf.vue"),
    meta: {
      label: "图片转PDF",
      desc: "功能丰富的图片转pdf格式",
      icon: h(MailOutlined),
      app_icon: "icon-tupiangeshi-copy",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/hex",
    name: "hexconv",
    component: () => import("@/pages/apps/office_tools/hexconv.vue"),
    meta: {
      label: "进制转换",
      icon: h(MailOutlined),
      app_icon: "icon-binarycode",
      go_live_time: new Date("2024-7-8"),
    },
  },
  // {
  //   path: "/base64",
  //   name: "base64",
  //   component: () => import("@/pages/about/About.vue"),
  //   meta: {
  //     label: "文本2",
  //     icon: h(MailOutlined),
  //     app_icon: "icon-wenjiangeshi-txt",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
];

export default office_tool_routes;
