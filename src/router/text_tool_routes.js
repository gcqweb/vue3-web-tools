import { h } from "vue";
import { MailOutlined } from "@ant-design/icons-vue";

const text_tool_routes = [
  // {
  //   path: "/hex",
  //   name: "hex",
  //   component: () => import("@/pages/apps/text_tools/hex_conv.vue"),
  //   meta: {
  //     label: "16进制转换",
  //     icon: h(MailOutlined),
  //     app_icon: "icon-geshitxt",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
  {
    path: "/text",
    name: "text",
    component: () => import("@/pages/apps/text_tools/char_counts.vue"),
    meta: {
      label: "字符统计",
      desc: "统计文本中字符的数字、英文字母、汉字、中英文标点、特殊字符",
      icon: h(MailOutlined),
      app_icon: "icon-geshitxt",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/base64Conv",
    name: "base64",
    component: () => import("@/pages/apps/text_tools/base64Conv.vue"),
    meta: {
      label: "base64转码/解码",
      icon: h(MailOutlined),
      desc: "base64转码/解码",
      app_icon: "icon-base64",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/ocr",
    name: "ocr",
    component: () => import("@/pages/apps/text_tools/ocr_papid.vue"),
    meta: {
      label: "图片识别ocr",
      icon: h(MailOutlined),
      desc: "图片识别ocr",
      app_icon: "icon-tupianOCR",
      go_live_time: new Date("2024-5-30"),
    },
  },
  // {
  //   path: "/test",
  //   name: "test",
  //   component: () => import("@/pages/apps/text_tools/test.vue"),
  //   meta: {
  //     label: "test",
  //     icon: h(MailOutlined),
  //     app_icon: "icon-wenjiangeshi-txt",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
];

export default text_tool_routes;
