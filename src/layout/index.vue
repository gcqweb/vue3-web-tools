<template>
  <section class="wrapper">
    <!-- <div> -->
      <Sider class="sider" v-show="openSider"></Sider>
      <!-- <a-button @click="s" style="position: fixed;top:0;z-index: 9;">gggg</a-button> -->
    <!-- </div> -->
    <div class="resizer" @mousedown="startResize"></div>
    <router-view />
  </section>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import Container from "@/layout/container/Container.vue";
import Sider from "@/layout/sider/index.vue";
import { useSiderWidth } from "@/store/siderStore";
import localStorageUtil from "@/utils/localStorage.js";
const siderStore = useSiderWidth();

// --------------- 左侧导航栏 ---------------

const openSider = ref(true);
// watch(openSider, (newValue) => {
//   console.log(66);
// });
const siderWidth = ref(240);
watch(siderWidth, (newValue) => {
  siderStore.setSider(newValue);
});

const s = () => {
  openSider.value = !openSider.value;
  siderStore.toggleSider();
  localStorageUtil.set("openSider", openSider.value);
};

let isDragging = false; // 添加标志变量

function startResize(event) {
  // 阻止默认事件
  event.preventDefault();
  isDragging = true; // 开始拖拽时，设置为true
  const startX = event.clientX;
  const startWidth = siderWidth.value;

  function resizing(event) {
    if (!isDragging) return; // 如果不是拖拽状态，不执行任何操作
    const currentWidth = startWidth + event.clientX - startX;
    siderWidth.value = Math.min(Math.max(currentWidth, 200), 400);
  }

  function stopResize() {
    isDragging = false; // 停止拖拽时，设置为false
    document.removeEventListener("mousemove", resizing);
    document.removeEventListener("mouseup", stopResize);
  }

  document.addEventListener("mousemove", resizing);
  document.addEventListener("mouseup", stopResize);
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
.resizer {
  /* cursor: ew-resize; */
  cursor: col-resize;
  /* border-left: 1px #b4b4b4 solid; */
  background-color: rgb(244, 244, 246);
  width: 8px;
  height: 100%;
}

@media screen and (max-width: 500px) {
  .sider{
display: none;
  }
}
</style>
