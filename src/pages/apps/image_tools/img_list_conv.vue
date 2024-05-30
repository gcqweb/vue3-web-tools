<template>
  <section class="img-list-conv">
    <div class="clearfix">
      <a-upload
        v-model:fileList="fileList"
        list-type="picture-card"
        @preview="handlePreview"
        :multiple="true"
        :before-upload="beforeUpload"
        :showUploadList="false"
      >
        <!-- <div v-if="fileList.length < 5"> -->
        <!-- <plus-outlined /> -->
        <div style="margin-top: 8px">Upload</div>
        <!-- </div> -->
      </a-upload>
      <a-modal
        :open="previewVisible"
        :title="previewTitle"
        :footer="null"
        @cancel="handleCancel"
      >
        <img alt="预览" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
    <!-- <div
    @click="previewResultCancel"
    class="preview"
    v-show="preview_result.open"
    style="
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      position: fixed;
      /* 居中 */
      left: 0;
      top: 0;
      z-index: 9;
    "
  >
    <div
      @click.stop="javascript:;"
      style="max-width: 700px;"
    >

      <canvas style="width: 100%" ref="canvasRef"></canvas>
      <button type="" @click="previewResultCancel">关闭</button>
    </div>
  </div> -->
    <!-- <a-spin style="display: flex; justify-content: center" v-if="!preview_result.src" /> -->
    <!-- <a-modal :open="preview_result.open" :title="preview_result.title" :footer="null" @cancel="previewResultCancel"> -->
    <!-- <a-spin style="display: flex; justify-content: center" /> -->
    <!-- <a-spin style="display: flex; justify-content: center" v-if="!preview_result.src" /> -->
    <!-- <img style="width: 100%" :src="preview_result.src" alt="" />
  </a-modal> -->
    <a-modal
      :open="preview_result.open"
      :title="preview_result.title"
      :footer="null"
      @cancel="previewResultCancel"
    >
      <a-spin
        style="display: flex; justify-content: center"
        v-if="!preview_result.src"
      />
      <img v-else alt="preview" style="width: 100%" :src="preview_result.src" />
    </a-modal>
    <a-list
      class="demo-loadmore-list"
      :loading="false"
      item-layout="horizontal"
      :data-source="fileList"
      bordered
    >
      <template #header>
        <div style="text-align: center">
          <h2>批量图片转换格式，支持jpg/png/webp</h2>
        </div>
      </template>
      <template #footer>
        <div style="text-align: end; white-space: nowrap">
          <a-space>
            批量格式:
            <a-select
              v-model:value="defaultFmt"
              show-search
              placeholder="格式"
              :options="fmts"
              :filter-option="filterOption"
              @change="handleChange"
            >
            </a-select>
            <a-button type="dashed" shape="round" @click="renderAll"
              >预览已选中</a-button
            >
            <a-button
              shape="round"
              danger
              size="small"
              key="list-loadmore-more66"
              @click="removeImg('all')"
              >清空</a-button
            >
            <a-button type="primary" shape="round" @click="downloadAll">
              <template #icon> <DownloadOutlined /> </template
              >下载已选中</a-button
            >
            <a-badge
              :offset="['-20', -7]"
              count="移动端"
              style="border-radius: 10px 10px 10px 0"
            >
              <a-button type="primary" shape="round" @click="downloadZip">
                <template #count> <DownloadOutlined /> </template
                >打包下载ZIP</a-button
              ></a-badge
            >
          </a-space>
        </div>
      </template>
      <!-- <template #loadMore>... </template> -->
      <template #renderItem="{ item }">
        <a-list-item>
          <a-checkbox v-model:checked="item.isChecked"></a-checkbox>

          <a-list-item-meta :description="item.type">
            <template #title>
              {{ item.name }}
              <a-tag color="green" :bordered="false">
                {{ convertSize(item.size) }}
              </a-tag>
            </template>

            <template #avatar>
              <!-- 头像 -->
              <a-avatar
                shape="square"
                :src="item.preview"
                @click="handlePreview(item)"
              />
            </template>
          </a-list-item-meta>

          <section
            class="custom"
            style="display: flex; align-items: center; white-space: nowrap"
          >
            <a-space>
              <!-- 压缩图像：
              <a-input-number
                size="small"
                id="inputNumber"
                v-model:value="item.targetSize"
                :min="1"
                :max="9999"
                style="width: 8rem"
                @blur="itemChange(item, true)"
              >
                <template #addonAfter>
                  <a-select
                    size="small"
                    v-model:value="item.sizeUnit"
                    style="width: 4rem"
                  >
                    <a-select-option value="KB">KB</a-select-option>
                    <a-select-option value="MB">MB</a-select-option>
                  </a-select>
                </template>
              </a-input-number> -->
              <div>
                <a-tag color="processing">{{ convertSize(item.size) }}</a-tag
                >->
                <a-tag color="green"> {{ item.resultSize || "null" }} </a-tag>
              </div>

              <span>目标格式:</span>
              <a-select
                v-model:value="item.targetFmt"
                show-search
                placeholder="目标格式"
                :options="fmts"
                :filter-option="filterOption"
                @change="itemChange(item)"
              ></a-select>
            </a-space>
            <!-- @blur="renderToCanvas(item, false,true)" -->
          </section>

          <!-- <template #extra>
          <img
            width="272"
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          />
        </template> -->

          <template #actions>
            <!-- <a key="list-loadmore-more66" @click="removeImg(item.uid)">删除</a> -->
            <!-- <a-button @click="downloadImages">xiazai</a-button> -->
            <a-button
              type="text"
              danger
              size="small"
              key="list-loadmore-more66"
              @click="removeImg(item.uid)"
              >移除</a-button
            >
            <!-- <a-button size="small" @click="itemPreview(item)">预览</a-button> -->
            <a-button size="small" @click="itemPreview(item)">预览</a-button>
            <a-button @click="renderToCanvas(item, true)" size="small"
              >下载</a-button
            >
          </template>
        </a-list-item>
      </template>
    </a-list>

    <!-- <canvas style="display: none" ref="downloadCanvasRef"></canvas> -->
    <canvas style="width: 80%; display: none" ref="canvasRef"></canvas>
  </section>
</template>
<script setup>
// npm install image-conversion
import { onMounted, ref, nextTick, computed, reactive } from "vue";
import { message, Upload } from "ant-design-vue";
import {
  compressAccurately,
  filetoDataURL,
  imagetoCanvas,
} from "image-conversion";
import {
  SyncOutlined,
  PlusOutlined,
  EditFilled,
  EditOutlined,
  FileImageOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
// import { Modal } from 'ant-design-vue';

// const { modal, contextHolder } = Modal.useModal();
const defaultFmt = ref("image/jpeg");
// const imageRef = ref(null);
const previewRef = ref(null);
const preview_result = reactive({
  open: false,
  isok: false,
  title: "",
  src: "",
});

// const downloadCanvasRef = ref(null);
const isChecked = ref(false);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const fileList = ref([]);
const canvasRef = ref(null);
const previewResultModal = ref(null);
const imgCompressKb = ref(false);
const targetSize = ref(200);
const allAddonAfterValue = ref("KB");

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const fmts = ref([
  { value: "image/jpeg", label: "jpeg" },
  { value: "image/png", label: "png" },
  // { value: "image/gif", label: "gif" },
  { value: "image/webp", label: "webp" },
  // { value: "image/bmp", label: "bmp" },
  // { value: "image/tiff", label: "tiff" },
  // { value: "image/svg+xml", label: "svg" },
  // { value: "image/x-icon", label: "x-ico" },
  // { value: "image/vnd.microsoft.icon", label: "标准ico" },
]);

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const previewResultCancel = () => {
  preview_result.open = false;
  preview_result.title = "";
  preview_result.src = "";
};

const itemPreview = async (item) => {
  // console.log(fileList.value);
  preview_result.open = true;
  // preview_result.title = item.name;
  let img_type = item.targetFmt;
  let img_name = item.name;
  let { baseName, _ } = extractFileNameDetails(img_name);
  let type = img_type.split("/")[1];
  preview_result.title = `${baseName}.${type}`;
  if (!item.resultBase64) {
    await renderToCanvas(item, false);
  }
  preview_result.src = item.resultBase64;
};

function extractFileNameDetails(filename) {
  // 查找最后一个点的位置
  const lastDotIndex = filename.lastIndexOf(".");
  // 如果没有找到点或点是第一个字符，我们认为没有后缀
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { baseName: filename, suffix: "" };
  }
  // 基本名是最后一个点之前的所有字符
  const baseName = filename.substring(0, lastDotIndex);
  // 后缀是最后一个点之后的所有字符
  const suffix = filename.substring(lastDotIndex + 1);
  return { baseName, suffix };
}

function downloadAll() {
  fileList.value.forEach(async (item) => {
    if (item.isChecked) {
      renderToCanvas(item, true);
    }
  });
}

async function downloadImage(canvas, item) {
  let img_type = item.targetFmt;
  let img_name = item.name;
  const image = canvas.toDataURL(img_type);
  const link = document.createElement("a");
  let { baseName, _ } = extractFileNameDetails(img_name);
  let type = img_type.split("/")[1];
  link.download = `${baseName}.${type}`;
  link.href = image;
  link.click();
}

const handleChange = async () => {
  fileList.value.forEach((item) => {
    if (item.isChecked) {
      item.targetFmt = defaultFmt.value;
    }
  });
};
const itemChange = async (item, isCompress = false) => {
  // console.log(item.targetFmt);
  let itempreview = await renderToCanvas(item, false, isCompress);
  // console.log(itempreview);
};

const renderAll = () => {
  fileList.value.forEach(async (item) => {
    if (item.isChecked) {
      await renderToCanvas(item, false); // 重新渲染
    }
  });
};

const getResultImgSize = async (canvas, item, isCompress) => {
  let canvasToDataUrl = await canvas.toDataURL(`${item.targetFmt}`);
  if (canvasToDataUrl) {
    if (isCompress) {
      const blob = dataURLtoBlob(canvasToDataUrl);
      const compressBase64 = await compressImage(blob);
      var base64String = compressBase64;
      console.log(666);
    } else {
      var base64String = canvasToDataUrl;
    }
    console.log(isCompress);
    item.resultBase64 = base64String;
    preview_result.src = base64String;
    base64String = base64String.split(",")[1];
    var byteLength = base64String.length * (3 / 4); // 每4个base64字符转换成3个字节
    let imgResultSize = convertSize(byteLength);
    item.resultSize = imgResultSize;
  } else {
    console.error("从canvas生成dataURL时出错");
  }
};

function convertSize(size) {
  // 将字节转换为千字节
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
}

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
  previewImage.value = "";
};

const handlePreview = async (file) => {
  previewImage.value = file.preview || "#";
  previewVisible.value = true;
  previewTitle.value = file.name;
};

const removeImg = (file_uid) => {
  if (file_uid === "all") {
    fileList.value = [];
    return;
  }
  //   console.log(file_uid);
  // 遍历fileList，删除对应的uid
  fileList.value = fileList.value.filter((item) => item.uid !== file_uid);
};

const beforeUpload = async (file) => {
  // 判断文件类型是否为image
  if (!file.type.startsWith("image/")) {
    message.error(`${file.name}不是图像文件!`);
    return Upload.LIST_IGNORE || false;
  }

  file.targetFmt = defaultFmt.value;
  try {
    if (!file.preview) {
      file.preview = await getBase64(file);
    }
  } catch (error) {
    console.log("gg", error);
  }
  file.isChecked = true;
  file.resultSize = 0;
  file.toCompress = false;
  file.targetSize = targetSize.value;
  file.sizeUnit = allAddonAfterValue.value;

  return false;
};
const renderToCanvas = async (item, isDownload, isCompress = false) => {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // 处理跨域
  img.src = item.preview;
  const canvas = canvasRef.value;
  await new Promise((resolve, reject) => {
    img.onload = () => {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
  });
  await getResultImgSize(canvas, item, isCompress);
  if (isDownload) {
    downloadImage(canvas, item);
  }
};

async function downloadZip() {
  const zip = new JSZip();
  let isEmpty = true; // 假设zip为空
  for (const item of fileList.value) {
    if (!item.isChecked) continue;
    await renderToCanvas(item, false);
    console.log(fileList.value);
    const dataUrl = item.resultBase64;
    const blob = dataURLtoBlob(dataUrl);
    compressImage(blob);
    // const response = await fetch(dataUrl);
    // const blob = await response.blob();
    zip.file(`${item.name}.png`, blob);
    isEmpty = false; // 如果添加了文件，则zip不为空
  }
  if (isEmpty) {
    message.error("请选择要下载的图片");
    return;
  }
  try {
    const content = await zip.generateAsync({ type: "blob" });
    // console.log(`Generated ZIP size: ${content.size} bytes`);
    saveAs(content, "图片批量转换.zip");
  } catch (error) {
    console.error("生成zip错误:", error);
  }
}

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function compressImage(blob, size) {
  // let size = sizeToKB(item.targetSize, item.sizeUnit);
  const res = await compressAccurately(blob, 200);
  const targetBase64 = await filetoDataURL(res);
  return targetBase64;

  item.resultBase64 = targetBase64;
  //   item.targetSize = target_size;
  console.log(targetBase64.length);
}
</script>
<style scoped>
.img-list-conv{
  width: 70%; margin: 0 auto
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}


:deep() .ant-list-item-meta-title {
  min-width: 4rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

@media screen and (max-width: 600px) {
  .img-list-conv{
  width:unset; padding: 1rem;
}
}
</style>
