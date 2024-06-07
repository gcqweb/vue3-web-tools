// src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import NProgress from 'nprogress'; // 引入nprogress
import 'nprogress/nprogress.css'; // 引入nprogress的样式
// import { defineAsyncComponent } from "vue";
// const AsyncComponent = defineAsyncComponent({
//   loader: () => import('@/pages/apps/AppsLayout.vue'),
//   loadingComponent: LoadingComponent,  // 可选，加载时显示的组件
//   errorComponent: ErrorComponent,      // 可选，加载失败时显示的组件
//   delay: 200,                          // 显示加载组件前的延迟，默认200ms
//   timeout: 30000                       // 加载超时时间，默认Infinity
// });
// AsyncComponent()
const router = createRouter({
  //   history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory("/"),
  scrollBehavior(to, from, savedPosition) {
    // 如果savedPosition存在（即用户是从forward/backward导航来的），则使用它
    if (savedPosition) {
      return savedPosition;
    } else {
      // 否则，根据你的需求返回默认滚动行为，例如滚动到顶部
      return { left: 0, top: 0 };
    }
  },
  routes,
});
// 使用 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 开始进度条
  NProgress.start();

  // 继续进行导航
  next();
});

router.afterEach(() => {
  // 结束并重置进度条
  NProgress.done();
});
export default router;
