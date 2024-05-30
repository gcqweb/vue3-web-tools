<template>
  <div>
    <a-menu
      v-model:selectedKeys="selectedKey"
      :items="items"
      @click="handleMenuClick"
    >
    </a-menu>
  </div>
</template>

<script setup>
import { reactive, h, ref, computed, watch } from "vue";
import {
  MailOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";

import { useSiderWidth } from "@/store/siderStore";
import { useCurrentRouter } from "@/store/routerStore";
import { useRouter, useRoute } from "vue-router";
import localStorageUtil from "@/utils/localStorage.js";
const routerStore = useCurrentRouter();
const router = useRouter();
const routes = router.getRoutes();
const currentRouter = ref(window.location.pathname); //localStorageUtil.get('currentMeunRouter') ;

const siderStore = useSiderWidth();
const siderWidth = computed(() => siderStore.siderWidth);
const selectedKey = ref([currentRouter.value]);
// console.log(selectedKey.value);
// 过滤所有顶级路由 菜单
const menuRouter = router.options.routes;
const menu = routes.filter((item) => item.meta && item.meta.add_menu);
// const items = reactive(
//   menu.map((route) => {
//     return getItem(route.meta.label, route.path, route.meta.icon);
//   })
// );

// 定义菜单项
const items = reactive(
  menu.map((route) => ({
    key: route.path,
    label: route.meta.label,
    icon: () => {
      // if (route.meta.icon.startWith("#")) {}
      if ((typeof route.meta.icon) === "string") {
       return h(
          "svg",
          { class: "icon", "aria-hidden": "true", style: { fontSize: "14px" } },
          [h("use", { "xlink:href": `#${route.meta.icon}` })]
        );
      } else {
       return route.meta.icon;
      }
    },
  }))
);


// console.log(menuRouter, 123,routes,'------',menu);
// const items = reactive(
//   menuRouter
//     .map((route) => {
//       if (route.meta && route.meta.label) {
//         // 确保路由有 meta 和 label
//         return getItem(route.meta.label, route.path, route.meta.icon);
//       }
//     })
//     .filter((item) => item !== undefined)
// ); // 过滤掉未定义 label 的路由
// console.log(items);
function getItem(label, key, icon, children, type) {
  // console.log(key,'key');
  return { key, icon, children, label, type };
}
function handleMenuClick(item) {
  router.push(item.key);
  routerStore.setCurrentMenuRouter(item.key);
}
</script>

<style scoped>
:deep() .ant-menu {
  width: unset;
}
:deep() .ant-menu-light {
  background: unset;
}
:deep() .ant-menu-light.ant-menu-root.ant-menu-inline,
.ant-menu-light.ant-menu-root.ant-menu-vertical {
  border-inline-end: unset;
}

:deep() .ant-menu-light .ant-menu-item-selected {
  color: rgb(0, 0, 0);
  background-color: #e3e3e3;
}
/* :deep() .ant-menu .ant-menu-item,
.ant-menu .ant-menu-submenu,
.ant-menu .ant-menu-submenu-title {
   border-radius:30px 30px; 
} */
:deep()
  .ant-menu-light:not(.ant-menu-horizontal)
  .ant-menu-item:not(.ant-menu-item-selected):active {
  background-color: rgba(0, 0, 0, 0.06);
}
:deep()
  .ant-menu-light:not(.ant-menu-horizontal)
  .ant-menu-item:not(.ant-menu-item-selected):hover {
  background-color: #f3f3f3;
}

:deep() .ant-menu-vertical > .ant-menu-item {
  height: 2rem !important;
  line-height: 2rem !important;
}
</style>
