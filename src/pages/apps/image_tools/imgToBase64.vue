<template>
  <section class="img2Base64">
    <!-- <context-holder /> -->
    <div class="flex">
      <a-upload-dragger
        class="upload-dragger"
        name="file"
        :before-upload="beforeUpload"
        @change="handleUpload"
        :showUploadList="false"
      >
        <p class="ant-upload-text"></p>
        <h2 class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
          单击或拖动文件到此区域进行上传
        </h2>
        <!-- <p class="ant-upload-hint"> 支持单个或批量上传</p> -->
      </a-upload-dragger>
      <a-space direction="vertical">
        <a-button type="primary" @click="base642img">Base64转换图片</a-button>
        <a-button type="primary" @click="img2base64">图片转换base64</a-button>
      </a-space>
    </div>
    <div class="base64-to-img">
      <textarea
        class="base64-to-img-textarea"
        v-model="base64String"
        placeholder="要转换的base64字符串"
        allow-clear
        @blur="base642img"
      />
      <div class="base64-to-img-preview">
        <a-space>
          <a-button danger shape="round" type="primary">
            <span
              @click="
                () => {
                  base64String = '';
                  previewUrl = '';
                }
              "
              class="input_submit"
              >清空</span
            >
          </a-button>

          <a-button shape="round" type="primary">
            <span @click="copyFn(base64String)" class="input_submit"
              >复制Base64字符串</span
            >
          </a-button>

          <a-button
            id="download"
            @click="download"
            shape="round"
            type="primary"
          >
            <!-- block -->
            <template #icon> <DownloadOutlined /> </template>下载图片</a-button
          >
        </a-space>
        <img
          v-if="previewUrl"
          style="max-width: 400px; max-height: 400px"
          :src="previewUrl"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import {
  FileAddOutlined,
  DownloadOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
const copyFn = async (text) => {
  try {
    await toClipboard(text.toString());
    message.success("已复制到剪切板");
  } catch (e) {
    console.error(e);
    message.error("剪切板异常，请刷新后重试！");
  }
};
//   import { useFullscreenStore } from "@/store/fullscreen.js";
// import png from "./result.png";
// const [messageApi, contextHolder] = message.useMessage();

const currentTab = ref("1");
const fileName = ref(null);
const previewUrl = ref(null);
const base64String = ref(null);
// const canvasRef = ref(null); // Canvas元素引用
const image = ref(null); // 图片引用
let uploadImage = null; // 上传的图片文件

function handleTabsChange(activeKey) {
  // console.log(typeof activeKey);
  currentTab.value = activeKey;
}

const beforeUpload = (file) => {
  fileName.value = file.name.split(".")[0];
  // console.log(fileName.value);
  // 检查文件类型，只允许上传图片文件
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("只能上传图片文件！");
    return false; // 阻止文件上传
  }
  uploadImage = file; // 保存上传的图片文件
  return false; // 允许文件上传
};

const handleUpload = () => {
  if (uploadImage) {
    // 创建Image对象并设置src为上传的图片文件的URL
    image.value = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = reader.result;
      base64String.value = reader.result;
      image.value.src = e.target.result; // 设置图片的src属性为上传的图片文件的URL
    };
    reader.readAsDataURL(uploadImage); // 将文件读取为DataURL格式的数据
    return false; // 阻止上传
  }
};

// 传入canvas.toDataURL将图片下载到本地
const download = () => {
  // 创建一个 Blob 对象
  var blob = base64ToBlob(previewUrl.value);
  // 创建一个临时的 URL
  var url = URL.createObjectURL(blob);
  // 创建一个 <a> 标签来下载文件
  var a = document.createElement("a");
  a.href = url;
  a.download = "image.png";
  document.body.appendChild(a);
  a.click();
  // 清理临时的 URL
  URL.revokeObjectURL(url);
};

const base64ToBlob = (base64str) => {
  var parts = base64str.split(";base64,");
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

const base642img = () => {
  previewUrl.value = base64String.value;
  if (previewUrl.value) {
    message.success("Ok");
  }
};
const img2base64 = () => {
  base64String.value = previewUrl.value;
  if (base64String.value) {
    message.success("Ok");
  }
};
</script>

<style scoped>
.fullscreen {
  position: fixed;
  /* 或使用 absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  /* 示例背景色 */
}
.img2Base64 {
  /* display: flex;
  flex-direction: column; */
  padding: 1rem;
  width: 70%;
  margin: 0 auto;
  gap: 1rem;
}
.base64-to-img {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.base64-to-img-preview {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* text-align: center */
}

.upload-dragger {
  display: block;
  height: 100px;
  width: 500px;
}
.base64-to-img-textarea {
  min-height: 300px;
  height: 100%;
  width: 50%;
}
.flex {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;
}
@media screen and (max-width: 700px) {
  .img2Base64 {
    width: 100%;
  }
  .upload-dragger {
    height: 100px;
    width: unset;
  }
  .base64-to-img {
    flex-direction: column;
  }
  .base64-to-img-textarea {
    height: 3rem;
    width: unset;
    min-height: unset;
  }
  .base64-to-img-preview {
    width: unset;
  }
}
</style>
