import { h } from "vue";
import { MailOutlined } from "@ant-design/icons-vue";

// import App_template from "@/pages/app_template.vue";
const img_tool_routes = [
  // {
  //   path: "/qr",
  //   name: "qr",
  //   component: () => import("@/pages/apps/image_tools/qr.vue"),

  //   meta: {
  //     label: "二维码制作",
  //     icon: h(MailOutlined),
  //     desc: "二维码制作",
  //     app_icon: "icon-piliangshengchenghuancun",
  //     go_live_time: new Date("2024-5-29"),
  //   },
  // },
  {
    path: "/img2base64",
    name: "img2base64",
    component: () => import("@/pages/apps/image_tools/imgToBase64.vue"),

    meta: {
      label: "图片转 Base64",
      icon: h(MailOutlined),
      desc: "图片和base64互转",
      app_icon: "icon-piliangshengchenghuancun",
      go_live_time: new Date("2024-5-30"),
    },
  },
  // {
  //   path: "/back",
  //   name: "back",
  //   component: () => import("@/pages/apps/image_tools/background.vue"),

  //   meta: {
  //     label: "背景测试",
  //     icon: h(MailOutlined),
  //     desc: "随机生成一位男/女朋友，一位比一位“好看”",
  //     app_icon: "icon-piliangshengchenghuancun",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
  {
    path: "/ugly-avatar",
    name: "ugly-avatar",
    component: () => import("@/pages/apps/image_tools/ugly-avatar.vue"),

    meta: {
      label: "ugly-avatar随机头像",
      icon: h(MailOutlined),
      desc: "随机生成一位男/女朋友，一位比一位“好看”",
      app_icon: "icon-AIlinggan",
      go_live_time: new Date("2024-5-30"),
    },
  },
  // {
  //   path: "/pixel",
  //   name: "pixel",
  //   component: () => import("@/pages/apps/image_tools/pixel.vue"),

  //   meta: {
  //     label: "像素风格转换",
  //     icon: h(MailOutlined),
  //     desc: "像素风格转换",
  //     app_icon: "icon-xiangsuhua",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
  {
    path: "/color_conv",
    name: "color_conv",
    component: () => import("@/pages/apps/image_tools/color_conv.vue"),

    meta: {
      label: "颜色转换",
      icon: h(MailOutlined),
      desc: "颜色转换",
      app_icon: "icon-piliangshengchenghuancun",
      go_live_time: new Date("2024-5-30"),
    },
  },
  // {
  //   path: "/grid2",
  //   name: "grid2",
  //   component: () => import("@/pages/apps/image_tools/宫格切图canvas.vue"),

  //   meta: {
  //     label: "宫格切图canvas",
  //     icon: h(MailOutlined),
  //     desc: "支持批量将图片分割成四宫格、九宫格、十六宫格，支持自定义行与列",
  //     app_icon: "icon-piliangshengchenghuancun",
  //   },
  // },
  {
    path: "/grid",
    name: "grid",
    component: () => import("@/pages/apps/image_tools/img_grid_cut.vue"),

    meta: {
      label: "宫格切图",
      icon: h(MailOutlined),
      desc: "多宫格切图,9宫格、6宫格、4宫格，来这就对了！",
      app_icon: "icon-jiugongge",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/dy",
    name: "douyin",
    component: () => import("@/pages/apps/douyin_parse/Douyin.vue"),

    meta: {
      label: "抖音解析",
      icon: h(MailOutlined),
      desc: "支持抖音视频解析，视频下载，图集下载，",
      app_icon: "icon-douyinkuaishouyingxiao",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/img-list-size-compress",
    name: "img-list-size-compress",
    component: () => import("@/pages/apps/image_tools/img_list_compress.vue"),

    meta: {
      label: "批量图片压缩（按大小）",
      icon: h(MailOutlined),
      desc: "将图片批量压缩到指定大小，支持jpg,png格式。",
      app_icon: "icon-filesimg",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/img-list-conv",
    name: "img-list-conv",
    component: () => import("@/pages/apps/image_tools/img_list_conv.vue"),

    meta: {
      label: "批量图片转换格式",
      icon: h(MailOutlined),
      desc: "将图片批量转换格式，支持jpg,png,gif,bmp,webp等格式。",
      app_icon: "icon-geshizhuanhuan-xuanzhong",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/idphoto",
    name: "idphoto",
    component: () => import("@/pages/apps/image_tools/IDPhoto.vue"),

    meta: {
      label: "证件照",
      icon: h(MailOutlined),
      desc: "拥有丰富的纯色背景，轻松快速制作符合要求的证件照。支持背景自定义替换，打造个性化图片，给予无限的灵感与创造空间。携AI之手，启程创意无限的奇妙旅程，将创造力的火花洒满生活每个精彩瞬间。",
      // app_icon: "icon-zhengjianzhao",
      app_icon: "icon-a-yifuxizhuanglingdaichenyi",
      go_live_time: new Date("2024-5-30"),
    },
  },
  {
    path: "/img-conv",
    name: "img-convert",
    component: () => import("@/pages/apps/image_tools/img_conv_fmt.vue"),
    meta: {
      label: "图片转换/压缩",
      icon: h(MailOutlined),
      desc: "图片格式转换，图片大小压缩，支持jpg,png,gif,bmp,webp等格式。",
      app_icon: "icon-jubugengxin",
      data: {
        label: "图片转换",
        desc: "hello,gcqweb",
        go_live_time: new Date("2024-5-30"),
        preview_img: "#",
        view: 10,
        like: 10,
        comment: 10,
        share: 10,
        // 收藏
        collect: 10,
        // 捐赠人员
        donate: ["abc", "def"],
        tag: [],
      },
    },
  },
  // {
  //   path: "/video",
  //   name: "video",
  //   component: () => import("@/pages/apps/video_tools/video_cut.vue"),

  //   meta: {
  //     label: "视频",
  //     icon: h(MailOutlined),
  //     desc: "拥有丰富的纯色背景，轻松快速制作符合要求的证件照。支持背景自定义替换，打造个性化图片，给予无限的灵感与创造空间。携AI之手，启程创意无限的奇妙旅程，将创造力的火花洒满生活每个精彩瞬间。",
  //     app_icon: "icon-zaixianyinpingeshi",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
  // {
  //   path: "/img",
  //   name: "img",
  //   component: () => import("@/pages/about/About.vue"),
  //   meta: {
  //     label: "图片压缩",
  //     icon: h(MailOutlined),
  //     app_icon: "icon-Apple",
  //     go_live_time: new Date("2024-5-30"),
  //   },
  // },
];

export default img_tool_routes;
