<template>
  <section class="ocr">
    <a-spin :spinning="loading">
      <div class="clearfix">
        <a-upload-dragger
          :before-upload="beforeUpload"
          :file-list="fileList"
          :show-upload-list="false"
          :multiple="false"
        >
          <p class="ant-upload-drag-icon">
            <FileImageOutlined />
          </p>
          <h2 class="ant-upload-text">OCR，请单击或拖动文件到此区域进行</h2>
          <p class="ant-upload-hint">支持单次，服务器太火爆了，请稍等。</p>
        </a-upload-dragger>
      </div>
    </a-spin>
    <div class="container" v-if="previewImageUrl">
      <div>
        <p v-for="txt in text">
          {{ txt[1] }}
        </p>
      </div>
      <div class="image-wrapper" draggable="false">
        <img
          :src="previewImageUrl"
          alt="Image 2"
          class="image processed"
          draggable="false"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
// 开源模型：https://github.com/RapidAI/RapidOCR?tab=readme-ov-file
import { ref } from "vue";
import { FileImageOutlined } from "@ant-design/icons-vue";

import { Table, message } from "ant-design-vue";
import axios from "axios";
const text = ref("");

// ----------------
const loading = ref(false);
const previewImageUrl = ref("");
const fileList = ref([]);

// 上传前的钩子
async function beforeUpload(file) {
  loading.value = true;
  try {
    // 设置预览图
    previewImageUrl.value = URL.createObjectURL(file);

    // 发送文件到服务器
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .post("https://api.gcqweb.cn/gcqweb/ocr_papid/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data && response.data.ocr_data) {
          text.value = response.data.ocr_data;
        } else {
          throw new Error("Invalid response");
        }
      });
    loading.value = false;
    return false; // 阻止默认上传
  } catch (error) {
    console.error(error);
    message.error("Failed to upload the image.");
    loading.value = false;
    return false;
  }
}
</script>

<style scoped>
.ocr {
  width: 70%;
  margin: 0 auto;
  padding: 1rem;
}
.container {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  object-fit: contain;
}

.processed {
  clip-path: polygon(
    0 0,
    var(--divider-position) 0,
    var(--divider-position) 100%,
    0 100%
  );
}

.divider {
  position: absolute;
  top: 0;
  left: var(--divider-position);
  width: 4px;
  height: 100%;
  background: red;
  cursor: ew-resize;
  transform: translateX(-50%);
}

@media screen and (max-width: 600px) {
  .ocr {
    width: unset;
  }
  .container {
    flex-direction: column;
  }
}
</style>
