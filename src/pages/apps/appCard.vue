<template>
  <section class="main">
 
      <a-empty v-if="childRoutes.length<1" :image="Empty.PRESENTED_IMAGE_SIMPLE" />

    <div v-else class="card-list">
      <a-card hoverable v-for="(app, i) in childRoutes" :key="i">
        <template #actions>
          <div style="display: flex">
            <a-tooltip title="236500" :mouseEnterDelay="0.3">
              <a-button
                type="link"
                size="small"
                :icon="h(FireOutlined)"
                @click="info('view，暂未开放')"
                >23.6K</a-button
              >
            </a-tooltip>
            <a-button type="link" size="small" @click="info('like，暂未开放')"
              ><LikeFilled style="color: orange"></LikeFilled>1.2W</a-button
            >
            <a-button type="link" size="small" @click="info('favorite，暂未开放')"
              ><HeartFilled style="color: hotpink"></HeartFilled>3.0K</a-button
            >
            <a-popconfirm
              title="暂未开放，需要登录，现在登录?"
              ok-text="登录"
              cancel-text="取消"
              @confirm="confirm"
              @cancel="cancel"
            >
              <template #default>
                <a-button type="link" size="small"
                  ><LikeFilled style="color: orange"></LikeFilled>1.2W</a-button
                >
              </template>
            </a-popconfirm>
          </div>
          <div
            style="
              flex: 2;
              text-align: end;
              display: flex;
              align-items: center;
              justify-content: end;
              user-select: none;
            "
          >
            <a-avatar-group shape="square">
              <a-avatar style="background-color: #fde3cf">A</a-avatar>
              <a-tooltip title="User1" placement="top">
                <a-avatar style="background-color: #87d068">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </a-tooltip>
            </a-avatar-group>
          </div>
        </template>
        <a-card-meta @click="openApp(app)">
          <template #title>
            {{ app?.meta?.label }}
          </template>
          <template #avatar>
            <span class="app-icon">
              <svg class="icon" aria-hidden="true" style="font-size: 64px">
                <use
                  :xlink:href="`#${
                    app?.meta?.app_icon || 'icon-shengmingtizheng'
                  }`"
                ></use>
              </svg>
            </span>
          </template>
          <template #description>
            <a-flex vertical gap="4px">
              <div>
                <span
                  @click.stop="info('gcqweb')"
                  style="font-size: 12px; user-select: none"
                  >@gcqweb</span
                >
              </div>
              <!-- <a-tooltip
                placement="bottomLeft"
                class="custom-tooltip"
                color="cyan"
                :mouseEnterDelay="0.3"
                :arrow="`falase`"
              >
                <template #title v-if="app?.meta?.desc">{{
                  app?.meta.desc
                }}</template> -->
                <a-typography-paragraph
                  style="height: 2.7rem;color:#000;"
                  :ellipsis="{ rows: 2 }"
                  :content="
                    app?.meta?.desc ? app?.meta?.desc : `Hello,Ant Design!`
                  "
                />
              <!-- </a-tooltip> -->

              <div>
                <a-tag @click.stop="info('标签')" style="user-select: none"
                  >标签</a-tag
                >
              </div>
            </a-flex>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </section>
</template>
<script setup>
import {
  NotificationOutlined,
  FireOutlined,
  LikeOutlined,
  LikeFilled,
  HeartOutlined,
  HeartFilled,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { ref, computed, defineProps, h, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCurrentRouter } from "@/store/routerStore.js";
import localStorageUtil from "@/utils/localStorage.js";
import { message } from "ant-design-vue";
import { Empty } from 'ant-design-vue';
const props = defineProps({
  useTab: String,
  // popularTab: Boolean,
});

const routerStore = useCurrentRouter();

const info = (type) => {
  message.success(type);
};

const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();

const currentTab = ref(props.useTab);
watchEffect(() => {
  currentTab.value = props.useTab;
});
// useTab
const popularTab = ["/all", "/hot", "/new"];
const childRoutes = computed(() => {
  // 查找当前路由对象
  const currentRoute = router
    .getRoutes()
    .find((r) => r.path === currentTab.value);
  // 返回子路由数组，如果没有子路由，则返回空数组
  if (popularTab.includes(props.useTab)) {
    return getCategoryRoutes(props.useTab);
  }
  return currentRoute && currentRoute.children ? currentRoute.children : [];
});
const getCategoryRoutes = (category = "/all") => {
  let toolsRoutes;
  // 返回子路由数组，如果没有子路由，则返回空数组
  if (props.useTab === "/all") {
    let toolsTabRoutes = [];
    toolsRoutes = routes.filter((route) => route?.meta?.is_tabs === true);
    // 遍历toolsRoutes数组
    toolsRoutes.forEach((parentRoute) => {
      toolsTabRoutes.push(...parentRoute.children);
    });
    return toolsTabRoutes;
  }

  if (props.useTab === "/hot") {
    // 获取 use_times 使用次数最多的前 10 条路由
    const mostUsedRoutes = routes
      .filter((route) => typeof route?.meta?.use_times === "number")
      .sort((a, b) => b.meta.use_times - a.meta.use_times)
      .slice(0, 10);
   return mostUsedRoutes;
  }

  if (props.useTab === "/new") {
    // 获取 go_live_time 最新的前 10 条路由
    const latestRoutes = routes
      .filter((route) => route?.meta?.go_live_time)
      .sort(
        (a, b) => new Date(b.meta.go_live_time) - new Date(a.meta.go_live_time)
      )
      .slice(0, 10);
   return latestRoutes;
  }

};
const openApp = (path) => {
  router.push(path);
};

const confirm = () => {
  message.success("正在登录/login.");
};
const cancel = () => {
  message.error("取消点赞");
};
</script>
<style scoped>
.main {
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
}

:deep() .ant-card-bordered {
  cursor: pointer;
  overflow: hidden;
  padding: 20px 20px 16px;
  border: unset;
  position: relative;
}
:deep() .ant-card {
  box-shadow: 0 6px 8px 0 rgba(28, 31, 35, 0.06);
}
:deep() .ant-card .ant-card-body {
  padding: unset;
  border-radius: unset;
}
:deep() .ant-card .ant-card-meta {
  margin: 0;
  margin-bottom: 1rem;
  display: flex;
}
:deep() .ant-card .ant-card-meta-avatar {
  padding-inline-end: 16px;
}
:deep() .ant-card .ant-card-meta-detail > div:not(:last-child) {
  margin-bottom: unset;
  font-size: large;
}
:deep() .ant-card .ant-card-actions > li {
  width: unset !important;
  margin: 12px 0 0 0;
  color: rgba(154, 154, 154, 0.45);
  text-align: center;
}
:deep() .ant-card .ant-card-actions > li:not(:last-child) {
  flex: 1;
  border-inline-end: unset;
}
:deep() .ant-avatar {
  width: 16px;
  height: 16px;
}
:deep() .ant-card .ant-card-actions {
  /* justify-content: space-between; */
  text-align: start;
  align-items: center;
}
.anticon {
  text-align: start;
}
:deep() .ant-card .ant-card-actions > li > span a:not(.ant-card-btn),
.ant-card .ant-card-actions > li > span > .anticon {
  width: unset;
}

:deep() .ant-card .ant-card-actions > li > span:hover {
  color: unset;
  transition: color 0.2s;
}
:deep() .ant-card-actions .ant-btn {
  margin: unset;
  padding-left: 0;
}
.ant-card-actions .ant-btn > * {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin: unset;
  margin-inline-start: 0;
  padding-right: 2px;
}
.ant-card-actions .ant-btn > *:hover {
  color: rgba(0, 0, 0, 1);
}
.card-list {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(4, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem 1.5rem;
}
.app-icon {
  /* background: #f0f0f5; */
  border: 1px solid #f0f0f5;
  border-radius: 8px;
  height: 64px;
  width: 64px;
  align-items: center;
  display: inline-flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}
/* .custom-tooltip :deep() .ant-tooltip-inner {
  color: #000;
} */
/* ---------------- */
@media screen and (max-width: 768px) {
  :deep() .ant-col {
    max-width: 100%;
    min-height: 1px;
    width: 100%;
  }
  :deep() .ant-card-bordered {
    margin-bottom: unset;
  }
}
</style>
