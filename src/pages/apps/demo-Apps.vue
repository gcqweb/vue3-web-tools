<template>
  <div class="layout">
    <main class="layout-content">
      <div class="container" ref="container">
        <a-flex vertical>
          <div class="fixed-header">
            <a-input placeholder="搜索" style="width: 33%">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </div>
          <div class="banner">
            <a-flex gap="24">
              <a-flex
                style="flex: 1 1; width: 480px"
                justify="space-evenly"
                vertical
              >
                <p>card content</p>
                <h1 style="-webkit-line-clamp: 2">
                  ❤️新人必学！Pick LLM 101，一起探索AI大模型的无限潜力
                </h1>
                <p
                  style="
                    overflow: hidden;
                    display: block;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  <!-- <span> -->
                  这里是Andrej Karpathy 的大模型导论课程，Andrej Karpathy
                  是人工智能领域最负盛名的教学者。在这门课程里，他将会花1个小时带你入门大语言模型。
                  <!-- </span> -->
                </p>
                <div>
                  <a-button type="primary" shape="round" size="large"
                    >立即学习</a-button
                  >
                </div>
              </a-flex>
              <div
                style="
                  aspect-ratio: 480/270;
                  border-radius: 12px;
                  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.12);
                  cursor: pointer;
                  height: 270px;
                  margin-left: auto;
                  margin-right: 0;
                  overflow: hidden;
                  position: relative;
                  width: 480px;
                "
              >
                <img
                  style="width: 100%; border-radius: inherit"
                  src="./assets/banner.jpg"
                  alt=""
                />

                <div
                  style="
                    bottom: 0;
                    left: 0;
                    padding: 32px 24px 24px;
                    position: absolute;
                    width: 100%;
                  "
                  class="description"
                >
                  LLM 101 with Andrej Karpathy
                </div>
              </div>
            </a-flex>
          </div>
          <div
            class="category"
            ref="stickyElement"
            :class="{ shadow: isSticky }"
          >
            <a-flex>
              <a-button
                style="margin-right: 12px"
                v-for="(item, index) in appsRoutes"
                :key="index"
                @click="btnFn(item)"
                :type="selectedButton === item.meta.label ? 'primary' : 'default'"
                >{{ item.meta.label }}</a-button
              >
            </a-flex>
          </div>
          <div style="padding: 0 1.5rem">
            <router-view />
          </div>
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
  // ToolOutlined,
  // LeftCircleOutlined, RightCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons-vue";
import { useRouter, useRoute } from "vue-router";

import { useCurrentRouter } from "@/store/routerStore";
import localStorageUtil from "@/utils/localStorage.js";
const routerStore = useCurrentRouter();
const router = useRouter();
const selectedButton = ref("链接");
const route = useRoute();

// 当前路由信息
const appsRoutes = ref(route.matched[0].children);

console.log( appsRoutes.value,'777',route);

const container = ref(null);
const stickyElement = ref(null);
const isSticky = ref(false);
const handleScroll = () => {
  if (stickyElement.value && container.value) {
    const { top: containerTop } = container.value.getBoundingClientRect();
    const { top: stickyTop } = stickyElement.value.getBoundingClientRect();
    isSticky.value = stickyTop - containerTop <= 64;
  }
};
onMounted(() => {
  container.value.addEventListener("scroll", handleScroll);
});
// onUnmounted(() => {
//   container.value.removeEventListener("scroll", handleScroll);
// });
const btnFn = (item) => {
  console.log(item,'666');
  if (item?.path) {
    router.push(item.path);
  }
  selectedButton.value = item?.meta.label;
};
// btnFn(appsRoutes.value[0]);
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
  z-index: 1;
}
.category {
  position: sticky;
  top: 64px;
  background: #f7f7fa;
  width: 100%;
  z-index: 1;
  padding: 12px 1.5rem;
}
</style>
