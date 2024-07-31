<template>
  <section class="rmbg">
    <a-spin :spinning="loading">
      <div class="clearfix">
        <a-upload-dragger
          :before-upload="beforeUpload"
          :file-list="fileList"
          :show-upload-list="false"
          :multiple="false"
        >
          <!-- v-model:fileList="fileList" -->
          <!-- :multiple="true" -->
          <!-- @preview="handlePreview" -->
          <p class="ant-upload-drag-icon">
            <FileImageOutlined />
          </p>
          <h2 class="ant-upload-text">抠图，请单击或拖动文件到此区域进行</h2>
          <p class="ant-upload-hint">支持单次，服务器太火爆了，请稍等。</p>
        </a-upload-dragger>
      </div>

      <a target="_blank" href="https://huggingface.co/briaai/RMBG-1.4"
        ><h3>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fankui"
            ></use>
          </svg>来自开源模型RMBG-1.4</h3></a>
      <a-button
        v-show="responseImageUrl"
        @click="download"
        type="primary"
        size="large"
        ><DownloadOutlined />保存抠图</a-button
      >
    </a-spin>
    <!-- <a-spin :spinning="loading"> -->
    <div class="container" v-if="previewImageUrl">
      <div class="image-wrapper" draggable="false">
        <div v-if="!loading">
          <img
            :src="responseImageUrl"
            alt="Image 1"
            class="image"
            draggable="false"
          />
          <div class="divider" @mousedown="startDragging"></div>
        </div>
        <img
          :src="previewImageUrl"
          alt="Image 2"
          class="image processed"
          draggable="false"
        />
      </div>
    </div>
    <!-- </a-spin> -->
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, watchEffect } from "vue";
import {
  SyncOutlined,
  PlusOutlined,
  EditFilled,
  EditOutlined,
  FileImageOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
// 引入两张图片
// import img_left from "@/assets/_image.png";
// import img_right from "@/assets/1.jpg";
// import png from "@/assets/123.png";
import { Table, message } from "ant-design-vue";
import axios from "axios";

const dividerPosition = ref("100%");
const isDragging = ref(false);

const startDragging = (event) => {
  isDragging.value = true;
  event.preventDefault(); // 防止触摸事件与点击事件冲突
};

const stopDragging = () => {
  isDragging.value = false;
};
const onMouseMove = (event) => {
  // 禁止默认浏览器行为
  event.preventDefault();
  if (isDragging.value) {
    const container = event.target.closest(".container");
    const rect = container.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newDividerPosition = (offsetX / rect.width) * 100;
    dividerPosition.value = `${newDividerPosition}%`;
  }
};
const onTouchMove = (event) => {
  if (isDragging.value) {
    const container = event.target.closest('.container');
    const rect = container.getBoundingClientRect();
    const touch = event.touches[0];
    const offsetX = touch.clientX - rect.left;
    const newDividerPosition = (offsetX / rect.width) * 100;
    dividerPosition.value = `${newDividerPosition}%`;
  }
};
onMounted(() => {
  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchend', stopDragging);
  window.addEventListener('touchmove', onTouchMove);
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopDragging);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('touchend', stopDragging);
  window.removeEventListener('touchmove', onTouchMove);
});

watchEffect(() => {
  document.documentElement.style.setProperty(
    "--divider-position",
    dividerPosition.value
  );
});

const download = () => {
  const link = document.createElement("a");
  link.href = responseImageUrl.value;
  link.download = "rmbg@" + filename.value;
  link.click();
  message.success("下载成功");
};
// ----------------
const filename = ref("");
const loading = ref(false);
const previewImageUrl = ref("");
const responseImageUrl = ref("");
const fileList = ref([]);

// 获取图片尺寸
function getImageDimensions(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      filename.value = file.name;
      // console.log("File name:", file.name);
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// 上传前的钩子
async function beforeUpload(file) {
  loading.value = true;
  try {
    const dimensions = await getImageDimensions(file);
    console.log("Image dimensions:", dimensions);

    // 设置预览图
    previewImageUrl.value = URL.createObjectURL(file);

    // 发送文件到服务器
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .post("https://api.gcqweb.cn/rmbg/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data && response.data.image_url) {
          responseImageUrl.value = response.data.image_url;
        } else {
          throw new Error("Invalid response");
        }
      });
    loading.value = false;
    dividerPosition.value = "50%";
    return false; // 阻止默认上传
  } catch (error) {
    console.error(error);
    message.error("Failed to upload the image.");
    loading.value = false;
    return false;
  }
}

// 自动调整图片大小
onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      const ratio = previewImageUrl.value
        ? previewImageUrl.value.split(",")[1].split(";")[0].split(",")[0] / 1000
        : 1;
      const style = window.getComputedStyle(entry.target);
      const padding =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const maxWidth = width - padding;
      const maxHeight = height - padding;
      const imgElement = entry.target.querySelector(".image-preview");
      if (imgElement) {
        imgElement.style.maxWidth = `${maxWidth}px`;
        imgElement.style.maxHeight = `${maxHeight}px`;
      }
    });
  });

  const cardElement = document.querySelector(".ant-card-body");
  if (cardElement) {
    observer.observe(cardElement);
  }
});
</script>

<style scoped>
.rmbg {
  width: 70%;
  margin: 0 auto;
  padding: 1rem;
}
.container {
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
  .rmbg{
  width:unset; 
}
}
</style>
