<template>
  <aside class="layout-sider">
    <div class="layout-sider-children">
      <div class="navigation-vertical" :style="{ width: siderWidth + 'px' }">
        <div class="navigation-inner">
          <div class="navigation-header-list-outer">
            <div class="navigation-header">
              
              <Logo/>
              <!-- <CloudUploadOutlined /> -->
              <a-button
                class="navigation-btn"
                type="primary"
                block
                :icon="h(CloudUploadOutlined)"
                @click="info"
                >提交创意</a-button
              >
            </div>
            <div class="navigation-list-wrapper">
              <Menu />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive, h, ref, computed, watch } from "vue";
import { CloudUploadOutlined } from "@ant-design/icons-vue";

import { useSiderWidth } from "@/store/siderStore";
import Logo from "./Logo.vue";
import Menu from "./Menu.vue";
import Footer from "./Footer.vue";
import { message } from "ant-design-vue";
const info = () => {
  message.info("暂未开放");
};
const siderStore = useSiderWidth();
const siderWidth = computed(() => siderStore.siderWidth);

</script>

<style scoped>
.layout-sider {
  background-color: rgba(244, 244, 246);
  flex-shrink: 0;
  height: 100%;
  min-height: 600px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  z-index: 1;
  padding: 8px;
  padding-right: 0;
}
.layout-sider-children {
  height: 100%;
}
.navigation-vertical {
  background-color: #f9f9f9;
  border: none;
  border-radius: 16px;
  height: 100%;
  min-width: 224px;
  padding: 16px 8px;
  display: inline-flex;
  margin: 0;
  outline: none;
  overflow: hidden;
  transition: padding-left 0.1s ease-out,
    width 0.2s cubic-bezier(0.62, 0.05, 0.36, 0.95);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 240px;
}
.navigation-inner {
  display: flex;
  height: 100%;
  justify-content: space-between;
  width: 100%;
  flex-direction: column;
  /* background-color: #ddd; */
}
.navigation-header-list-outer {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.navigation-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0;
  position: relative;
}

.navigation-btn {
  margin-top: 24px;
}
.navigation-list-wrapper {
  -ms-overflow-style: none;
  margin-top: 16px;
  padding-top: 0;
  scrollbar-width: none;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
