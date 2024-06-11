<template>
  <div class="main">
    <a-page-header
      style="
        border: unset;
        position: sticky;
        top: 0;
        z-index: 999;
        background: #fff;
        background: radial-gradient(
          transparent,
          rgba(255, 255, 255, 1) 2px
        ) !important;
        background-size: 1px 1px !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        box-shadow: 0 0px 8px rgb(0 0 0 / 10%);
      "
      title="返回"
      sub-title="工具箱- route"
      @back="router.back()"
    >
      <template #extra>
        <a-button key="3"><StarOutlined />收藏</a-button>
        <a-button key="2"><ShareAltOutlined />分享</a-button>
        <a-button key="1" type="primary">复制</a-button>
        <a-dropdown key="more">
          <a-button :style="{ border: 'none', padding: 0 }">
            <EllipsisOutlined
              :style="{ fontSize: '20px', verticalAlign: 'top' }"
            />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.alipay.com/"
                >
                  1st menu item
                </a>
              </a-menu-item>
              <a-menu-item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.taobao.com/"
                >
                  2nd menu item
                </a>
              </a-menu-item>
              <a-menu-item>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.tmall.com/"
                >
                  3rd menu item
                </a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-page-header>
  </div>
  <router-view />
</template>
<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  EllipsisOutlined,
  StarOutlined,
  ShareAltOutlined,
} from "@ant-design/icons-vue";
import { onMounted, ref, onUnmounted, watch } from "vue";
const router = useRouter();
</script>

<style>
.top {
  transform: translateY(-90px);
}
.abc {
  position: fixed;
  z-index: 999;
  width: 100%;
  transition: all 0.5s;
}
</style>
