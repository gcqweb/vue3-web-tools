<template>
  <a-flex class="navigation-footer">
    <a-flex class="link-info" justify="space-around" style="width: 100%">
      <!-- <div style=" display: flex;width: 100%; justify-content: space-around;align-items: center;"> -->

      <a-tooltip placement="top" :mouseEnterDelay="0" :mouseLeaveDelay="0">
        <template #title>
          <span>关于</span>
        </template>
        <a-button
          type="text"
          shape="circle"
          :icon="h(ReadOutlined)"
          @click="info"
        ></a-button>
      </a-tooltip>
      <a-tooltip placement="top" :mouseEnterDelay="0" :mouseLeaveDelay="0">
        <template #title>
          <span>反馈</span>
        </template>
        <a-button
          type="text"
          shape="circle"
          :icon="h(MailOutlined)"
          @click="info"
        ></a-button>
      </a-tooltip>
      <!-- <a-tooltip
        placement="top"
        :mouseEnterDelay="0"
        :mouseLeaveDelay="0"
        color="#2aae67"
      >
        <template #title>
          <span>关注微信公众号</span>
        </template>
        <a-button
          type="text"
          shape="circle"
          :icon="h(WechatOutlined)"
          @click="info"
        ></a-button>
      </a-tooltip> -->
      <div class="button-container">
        <!-- <a-button
          type="primary"
          @mouseover="showQrCode = true"
          @mouseout="showQrCode = false"
        >
          关注公众号
        </a-button> -->
        <a-button
          type="text"
          shape="circle"
          @mouseover="showQrCode = true"
          @mouseout="showQrCode = false"
          :icon="h(WechatOutlined)"
          @click="info"
        ></a-button>
        <div
          v-show="showQrCode"
          class="qr-code-container"
          :style="{ backgroundImage: 'url(' + qrCodeUrl + ')' }"
        ></div>
      </div>
      <!-- </div> -->
      <!-- border-color: #7cb305; -->
    </a-flex>
    <a-divider style="margin: 12px 0" />
    <a-button
      type="text"
      block
      :icon="h(CopyrightOutlined)"
      href="https://beian.miit.gov.cn/"
      target="_blank"
      >皖ICP备2022008051号-1</a-button
    >
  </a-flex>
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted } from "vue";
import {
  CopyrightOutlined,
  ReadOutlined,
  MailOutlined,
  WechatOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import wechat from "@/assets/for1280.jpg";
const info = () => {
  message.info("暂未开放");
};

const showQrCode = ref(false);
const qrCodeUrl = wechat; // 引入二维码图片路径
</script>

<style scoped>
.navigation-footer {
  display: inline-flex;
  align-items: flex-start;
  background-color: var(--menu-cds-bg-color);
  flex-direction: column;
  position: relative;
}

.button-container {
  position: relative;
}

.qr-code-container {
  position: absolute;
  top: -160px;
  /* left: 50%; */
  right:0;
  /* transform: translateX(-50%); */
  width: 150px;
  height: 150px;
  background-size: cover;
  background-position: center;
  /* opacity: 0; */
  transition: opacity 0.3s ease-in-out;
}

/* .qr-code-container.visible {
  opacity: 1;
} */
</style>
