<template>
  <div class="layout">
    <main class="layout-content">
      <div class="container" ref="container">
        <a-flex vertical>
          <!-- <div class="fixed-header">
            <SearchInput></SearchInput>
          </div> -->
          <div class="mobile-header">
            <span class="toggle-menu">
              <MenuOutlined @click="showDrawer" />
              <!-- <span>666</span> -->
            </span>
            <span style="flex: 1">
              <SearchInput></SearchInput>
            </span>

            <a-drawer
              v-model:open="open"
              class="custom-class"
              root-class-name="root-class-name"
              :root-style="{ color: 'blue' }"
              style="background-color: rgba(244, 244, 246); width: auto"
              :closable="false"
              :style="{ padding: 0 }"
              width="auto"
              placement="left"
              @after-open-change="afterOpenChange"
            >
              <Sider class="test"></Sider>
            </a-drawer>
          </div>

          <a-flex gap="24" class="banner">
            <a-flex class="banner-desc" justify="space-evenly" vertical>
              <!-- <p>card content</p> -->

              <h1 style="-webkit-line-clamp: 2">
                ❤️ 一站式 web 工具箱——越努力，越幸运！
              </h1>
              <p class="banner-desc-title">更多工具...敬请期待！</p>
              <div>
                <a-button type="primary" shape="round" size="large"
                  >更多待更新</a-button
                >
              </div>
            </a-flex>
            <div class="banner-img">
              <img src="@/assets/banner2.png" alt="" />
              <div class="description">努力成为一个很哇塞的人</div>
            </div>
          </a-flex>
          <!-- </div> -->
          <div
            class="category"
            ref="stickyElement"
            :class="{ shadow: isSticky }"
          >
            <a-flex>
              <a-button
                style="margin-right: 12px"
                @click="btnFn({ path: '/all' })"
                :type="selectedButton === '/all' ? 'primary' : 'default'"
                >全部</a-button
              >
              <a-button
                style="margin-right: 12px"
                @click="btnFn({ path: '/new' })"
                :type="selectedButton === '/new' ? 'primary' : 'default'"
                >最新</a-button
              >
              <a-button
                style="margin-right: 12px"
                @click="btnFn({ path: '/hot' })"
                :type="selectedButton === '/hot' ? 'primary' : 'default'"
                disabled
                >热门</a-button
              >

              <a-button
                style="margin-right: 12px"
                v-for="(item, index) in menu"
                :key="index"
                @click="btnFn(item)"
                :type="selectedButton === item.path ? 'primary' : 'default'"
                >{{ item.meta.label }}</a-button
              >
              <!-- 隐藏的tab -->
              <!-- <a-button
                v-for="(item, index) in shyMenu"
                :key="index"
                @click="btnFn(item)"
                :type="selectedButton === item.path ? 'primary' : 'default'"
                >{{ item.meta.label }}</a-button
              > -->
              <a-dropdown v-if="shyMenu.length" placement="bottomRight">
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item
                      @click="btnFn(item)"
                      v-for="(item, index) in shyMenu"
                      :key="index"
                    >
                      <span>{{ item.meta.label }}</span>
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button>
                  更多
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </a-flex>
          </div>
          <!-- <div style="padding: 0 1.5rem"> -->
          <AppCard :useTab="selectedButton" />
          <!-- <router-view /> -->
          <!-- </div> -->
        </a-flex>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted, computed } from "vue";
import {
  MailOutlined,
  CalendarOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  DownOutlined,
  MenuOutlined,
} from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";

import { useCurrentRouter } from "@/store/routerStore";
import localStorageUtil from "@/utils/localStorage.js";
import getCurrentRouteChildren from "@/router/utils_route/current_router_children.js";
import AppCard from "@/pages/apps/appCard.vue";
import SearchInput from "@/pages/misc/searchQuery.vue";
import Sider from "@/layout/sider/index.vue";
const routerStore = useCurrentRouter();
const router = useRouter();
const selectedButton = ref(localStorageUtil.get("currentTabRouter") || "/new");
const route = useRoute();
const routes = router.getRoutes();

// 获取所有路由，筛选出有meta.tab的路由
const allTab = routes.filter((item) => item.meta && item.meta.is_tabs);
const menu = allTab.slice(0, 8);
const shyMenu = allTab.slice(8);

// console.log(routes, menu, "777");

const container = ref(null);
const stickyElement = ref(null);
const isSticky = ref(false);
const handleScroll = () => {
  if (stickyElement.value && container.value) {
    const { top: containerTop } = container.value.getBoundingClientRect();
    const { top: stickyTop } = stickyElement.value.getBoundingClientRect();
    isSticky.value = stickyTop - containerTop <= 96;
  }
};
onMounted(() => {
  container.value.addEventListener("scroll", handleScroll);
});
// onUnmounted(() => {
//   container.value.removeEventListener("scroll", handleScroll);
// });
const btnFn = (item) => {
  selectedButton.value = item?.path;
  routerStore.setCurrentTabRouter(item?.path);
};

const open = ref(false);
const afterOpenChange = (bool) => {
  console.log("open", bool);
};
const showDrawer = () => {
  open.value = true;
};
</script>

<style scoped>
.container {
  height: 100vh;
  overflow-y: auto;
}
.shadow {
  box-shadow: rgba(0, 0, 0, 0.08) 0px 6px 6px 0px;
}

.layout {
  flex: 1;
  flex-grow: 1;
  overflow-x: hidden;
  display: flex;
  flex: auto;
  flex-direction: column;
  min-height: auto;
  background-color: #f7f7fa;
}
/* .layout-content .container{padding:0 1.2rem;} */
.layout-content .banner {
  overflow: hidden;
  padding: 24px 1.5rem;
}
.fixed-header {
  text-align: center;
  padding: 16px 1.5rem;
  position: sticky;
  top: 0px;
  background: #f7f7fa;
  width: 100%;
  z-index: 999;
  height: 64px;
}
.category {
  overflow-x: auto;
  position: sticky;
  top: 64px;
  background: #f7f7fa;
  width: 100%;
  z-index: 1;
  padding: 12px 1.5rem;
}
.banner-desc {
  flex: 1 1;
  width: 480px;
}
.banner-desc-title {
  overflow: hidden;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 16px 0;
}
.banner-img {
  aspect-ratio: 480/270;
  border-radius: 12px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  height: auto;
  margin-left: auto;
  margin-right: 0;
  overflow: hidden;
  position: relative;
  max-width: 480px;
}
.banner-img img {
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
}
.description {
  bottom: 0;
  left: 0;
  padding: 32px 24px 24px;
  position: absolute;
  width: 100%;
}
:deep() .ant-drawer .ant-drawer-body,
.custom-class {
  padding: unset !important;
}
.mobile-header {
  gap: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 16px 1.5rem;
  position: sticky;
  top: 0px;
  background: #f7f7fa;
  width: 100%;
  z-index: 999;
  height: 64px;
}
.toggle-menu {
  display: none;
}
.ant-btn {
  font-weight: 600;
  border: unset;
  box-shadow: 0 2px 4px 0 #1e1e1f0a;
}
.ant-btn-default:hover {
  background-color: #deebfe;
  /* color: unset; */
}
/* ------------- */
@media screen and (max-width: 768px) {
  .layout-content .banner {
    flex-direction: column-reverse;
    padding: 1rem;
  }
  .banner-desc {
    flex: 1 1;
    width: auto;
  }
  .banner-desc h1 {
    font-size: 28px;
  }
  .fixed-header {
    padding: 8px 1rem;
    top: 48px;
    height: auto;
  }
  .category {
    top: 63px;
    /* box-shadow: rgba(0, 0, 0, 0.08) 0px 6px 6px 0px; */
    padding: 8px 1rem;
  }
  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 1rem;
  }
  .toggle-menu {
    display: block;
  }
}
</style>
