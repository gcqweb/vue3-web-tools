<template>
  <section class="grid_cut">
    <div class="grid_edit">
      <span>
        <a-modal
          title="文件列表"
          v-model:open="isModalVisible"
          cancelText="取消"
          okText="确定"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <a-list :dataSource="images" :renderItem="image">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-list-item-meta
                  :title="`${index + 1}@${fileInfo.fullname}`"
                />
                <a-button @click="downloadFile(index, item)">保存</a-button>
              </a-list-item>
            </template>
          </a-list>
        </a-modal>
      </span>
      <a-upload
        class="mobile_upload"
        :show-upload-list="false"
        :multiple="false"
        :before-upload="handleUpload"
      >
        <a-button block type="dashed">
          <PictureOutlined />
          选择文件
        </a-button>
      </a-upload>
      <a-upload-dragger
        class="pc_upload"
        name="file"
        :show-upload-list="false"
        :multiple="false"
        :before-upload="handleUpload"
      >
        <p class="ant-upload-drag-icon">
          <PictureOutlined />
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域加载图像</p>
        <p class="ant-upload-hint">本地操作,速度取决于你的设备</p>
      </a-upload-dragger>

      <a-space>
        <span>{{ cutModel ? "✂" : "✒" }}</span>
        <a-switch
          v-model:checked="cutModel"
          checked-children="切"
          un-checked-children="裁"
          @change="setModel"
        />
        <a-button :size="size" v-show="cutModel" @click="unLockRatio"
          >{{ fixedRatio ? "自由" : "固定" }}比例</a-button
        >
      </a-space>
      <a-radio-group :size="size"
        v-model:value="ratioOptions.ratio"
        v-show="ratioOptions.status || !cutModel"
        button-style="solid"
        @click="cutRadioFn"
      >
        <a-radio-button :value="16 / 9">16:9</a-radio-button>
        <a-radio-button :value="9 / 16">9:16</a-radio-button>
        <a-radio-button :value="3 / 2">3:2</a-radio-button>
        <a-radio-button :value="2 / 3">2:3</a-radio-button>
        <a-radio-button :value="4 / 3">4:3</a-radio-button>
        <a-radio-button :value="3 / 4">3:4</a-radio-button>
        <a-radio-button :value="1 / 1">1:1</a-radio-button>
        <a-radio-button value="free">自由</a-radio-button>
      </a-radio-group>
      <a-space-compact :size="size" v-show="cutModel">
        <a-button :size="size" @click="setGridFn(3, 3)">9 宫格</a-button>
        <a-button :size="size" @click="setGridFn(2, 3)">6 宫格</a-button>
        <a-button :size="size" @click="setGridFn(2, 2)">4 宫格</a-button>
        <a-button :size="size" @click="setGridFn(1, 3)">3 宫格</a-button>
        <a-button :size="size" @click="setGridFn(1, 2)">2 宫格</a-button>

        <!-- <a-switch
            v-model:checked="fixedRatio"
            checked-children="固定"
            un-checked-children="自由"
            @change="setGridFn(gridType.row, gridType.col)"
          />{{ fixedRatio }} -->
        <!-- @change="setModel" -->
      </a-space-compact>
      <div v-show="cutModel">
        <a-row align="middle">
          <a-col :span="1">列</a-col>
          <a-col :span="12">
            <a-slider
              @afterChange="setGridFn(gridType.row, gridType.col)"
              v-model:value="gridType.col"
              :min="0"
              :max="9"
            />
          </a-col>
          <a-col :span="4">
            <a-input-number :size="size"
              @change="setGridFn(gridType.row, gridType.col)"
              v-model:value="gridType.col"
              :min="0"
              :max="9"
              style="margin-left: 16px"
            />
          </a-col>
        </a-row>
        <a-row align="middle">
          <a-col :span="1">行</a-col>
          <a-col :span="12">
            <a-slider
              @afterChange="setGridFn(gridType.row, gridType.col)"
              v-model:value="gridType.row"
              :min="1"
              :max="9"
            />
          </a-col>
          <a-col :span="4">
            <a-input-number :size="size"
              @change="setGridFn(gridType.row, gridType.col)"
              v-model:value="gridType.row"
              :min="1"
              :max="9"
              style="margin-left: 16px"
            />
          </a-col>
        </a-row>

      </div>
      <div class="download">
        <a-space v-show="cutModel">
          <a-button
            type="primary"
            @click="cropAndDownload('zip')"
            :icon="h(FileZipOutlined)"
            >下载zip</a-button
          >
          <a-button
            type="primary"
            @click="cropAndDownload('group')"
            :icon="h(DownloadOutlined)"
            >下载 {{ gridType.row * gridType.col || "" }} 宫格</a-button
          >

          <a-button v-show="images.length" @click="showModal"
            >文件列表</a-button
          >
        </a-space>
        <a-button
          type="primary"
          block
          shape="round"
          v-show="!cutModel"
          @click="cropAndDownload('cut')"
          :icon="h(DownloadOutlined)"
          >下载裁剪区域</a-button
        >
      </div>
    </div>
    <div >
      
      <div class="grid_preview">
        <img ref="imageElement" :src="imgSrc" class="imgClass" />
      </div>
      <a-row justify="center" align="top" style="margin:1rem auto ;">
          <a-col :span="1">
            <RotateRightOutlined
              @click="setRotate"
              style="padding-top: 0.5rem"
            />
          </a-col>

          <a-col :span="22">
            <a-slider
              class="rotate-slider"
              :min="-45"
              :max="45"
              @change="setRotateToFn(roateAngle)"
              v-model:value="roateAngle"
              :step="0.5"
              :marks="marks"
          /></a-col>
          <a-col :span="1">
            <BorderHorizontalOutlined
              @click="horizontalFlipFn"
              style="padding-top: 0.5rem"
            />
          </a-col>
        </a-row>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive, computed, h } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import png from "@/assets/678.png";
import JSZip from "jszip"; // 引入JSZip
// import png from "./wp.webp";
import { saveAs } from "file-saver";
import {
  PictureOutlined,
  DownloadOutlined,
  FileZipOutlined,
  RotateRightOutlined,
  BorderHorizontalOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const sliderValue = ref(0); // 滑块默认值
const marks = {
  [-40]: -40,
  [-30]: -30,
  [-20]: -20,
  [-10]: -10,
  [0]: 0,
  [10]: 10,
  [20]: 20,
  [30]: 30,
  [40]: 40,
};

// 计算显示的绑定值
const displayValue = computed(() => sliderValue.value - midpoint);

const imgSrc = ref(png);
const imageElement = ref(null);
const gridType = reactive({ row: 3, col: 3 });
let cropper = null;
const cutModel = ref(true);
const fixedRatio = ref(true);
const fileInfo = {
  fullname: "grid_cut.png",
  filename: "grid_cut",
  fileMIME: "",
  fmt: "",
};
const ratioOptions = reactive({ ratio: "free", status: false });
const isMobile = isMobileDevice();
const size = isMobile ? "small" : "default";
const unLockRatio = () => {
  fixedRatio.value = !fixedRatio.value;
  ratioOptions.status = !ratioOptions.status;
  cropper.setAspectRatio(ratioOptions.ratio);
  setGridFn(gridType.row, gridType.col);
};

const cutRadioFn = (e) => {
  ratioOptions.ratio = e.target.value;
  cropper.setAspectRatio(ratioOptions.ratio);
};

let tempRatio = { row: 3, col: 3 };
const setModel = () => {
  fixedRatio.value = !fixedRatio.value;
  if (!cutModel.value) {
    tempRatio.row = gridType.row;
    tempRatio.col = gridType.col;
    setGridFn(NaN, NaN);
  } else {
    setGridFn(tempRatio.row, tempRatio.col);
  }
};

const setRotate = () => {
  cropper.rotate(90);
};
const roateAngle = ref(0);
const setRotateToFn = (angle) => {
  cropper.rotateTo(angle);
};
const horizontalFlip = ref(false); // 水平翻转
const horizontalFlipFn = () => {
  horizontalFlip.value = !horizontalFlip.value;
  if (horizontalFlip.value) {
    cropper.scale(-1, 1);
  } else {
    cropper.scale(1, 1);
  }
};
function handleUpload(file) {
  console.log(file);
  let [filename, suffix = ""] = file.name.split("."); // 修正：处理没有点的情况
  let [file_type, fmt] = file.type.split("/");
  if ((!suffix || !file_type || !fmt) && file_type !== "image") {
    message.error("无法识别该图片文件");
    return false;
  }
  fileInfo.fullname = file.name;
  fileInfo.filename = filename;
  fileInfo.fileMIME = file.type;

  fileInfo.fmt = fmt;
  let reader = new FileReader();
  reader.onload = (e) => {
    imgSrc.value = e.target.result;
    initializeCropper();
  };
  reader.readAsDataURL(file);
  return false;
}

function initializeCropper(Mobile = isMobile) {
  if (cropper) {
    cropper.destroy();
  }
  imageElement.value.onload = () => {
    cropper = new Cropper(imageElement.value, {
      aspectRatio: 0 || NaN, // 初始化无固定比例
      viewMode: Mobile ? 3 : 2,
      dragMode: "move",
      movable: true, // 移动图片
      scalable: true,
      zoomable: true, // 移动端缩放图像
      modal: false, //黑色背景
      guides: false, //裁剪框上方显示虚线
      center: false, //裁剪框中显示虚线
      background: true, //背景是否显示
      wheelZoomRatio: 0.3,
      autoCropArea: 1,
      // cropBoxResizable: false, // 固定裁剪框
      // cropBoxMovable : false,//裁剪框是否可移动
    });
  };
}

onMounted(() => {
  initializeCropper(isMobile);
});

function sliceCanvas(canvas, rows, cols) {
  const cellWidth = Math.floor(canvas.width / cols);
  const cellHeight = Math.floor(canvas.height / rows);
  const images = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const slicedCanvas = document.createElement("canvas");
      slicedCanvas.width = cellWidth;
      slicedCanvas.height = cellHeight;
      const slicedCtx = slicedCanvas.getContext("2d");

      // 绘制到slicedCanvas上，注意调整drawImage的参数
      slicedCtx.drawImage(
        canvas,
        j * cellWidth,
        i * cellHeight,
        cellWidth,
        cellHeight,
        0,
        0,
        cellWidth,
        cellHeight
      );

      const promise = new Promise((resolve) => {
        slicedCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(null); // 如果没有blob产生，也resolve以确保Promise完成
          }
        }, fileInfo.fileMIME);
      });

      images.push(promise);
    }
  }
  // return images;
  // 使用Promise.all等待所有Promise完成，然后返回结果
  return Promise.all(images);
}

async function downloadAsZip(
  imagesPromises,
  zipName = `grid_cut_${fileInfo.filename}.zip`
) {
  const zip = new JSZip();
  // 使用Promise.all等待所有图片Promise解析，并收集其Blob数据
  const imagesBlobs = await Promise.all(imagesPromises);
  imagesBlobs.forEach((blob, index) => {
    const filename = `${index + 1}_${fileInfo.fullname || "test.png"}`; // 修正了文件名格式，移除了不合适的@
    // 直接添加Blob到zip文件中
    zip.file(filename, blob, { binary: true }); // 使用binary: true而不是base64
  });
  // 生成ZIP文件Blob并触发下载
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, zipName);
}

// 下载单个图像的函数
function downloadImage(imageData, fileName) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(imageData);
  link.href = url || imageData;
  link.download = fileName || "image.png"; // 自定义文件名，默认为'image.png'
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
let images = ref([]);
async function cropAndDownload(method = "zip/group/cut") {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas({ imageSmoothingQuality: "high" });
    if (method === "cut") {
      canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileInfo.fullname; // 设置下载文件名
        a.click();
        URL.revokeObjectURL(url); // 释放URL对象
      });
      return;
    }
    images.value = await sliceCanvas(canvas, gridType.row, gridType.col); // 假设我们希望裁剪成3x3宫格
    console.log(images.value);
    if (method === "zip") {
      downloadAsZip(images);
    } else if (method === "group") {
      // if (isMobile) {
      showModal();
      return;
      // }
      // 遍历数组并下载所有图像
      images.forEach((imageData, index) => {
        // 这里可以自定义文件名，例如加上序号或根据实际情况调整
        downloadImage(imageData, `${index + 1}@${fileInfo.fullname}`);
      });
    } else {
      alert("下载方式不允许");
    }
  }
}

function setFullSize(viewMode) {
  if (!cropper) return;
  cropper.options.viewMode =
    viewMode === 0 ? 0 : viewMode || cropper.options.viewMode;
  // 刷新实例以应用新的设置
  cropper.replace(cropper.url);
}

function setGridFn(row = 1, col = 1) {
  if (!cropper) return;
  gridType.row = row;
  gridType.col = col;
  let ratio = fixedRatio.value ? col / row : NaN;
  if (!ratioOptions.status) {
    cropper.setAspectRatio(ratio);
  }
  createDashedLine(row, col);
}

function createDashedLine(row, col) {
  const container = document.querySelector(".cropper-view-box");
  if (!container) return;
  // 获取所有class为'box'的子元素
  const boxes = container.querySelectorAll(".additional");
  if (boxes.length > 0) {
    boxes.forEach((box) => {
      box.remove();
    });
  }
  if (!row && !col) return;
  createAdditional(row, "row", "width");
  createAdditional(col, "col", "height");
}

function createAdditional(
  times,
  direction = "row/col",
  style = "width/height"
) {
  const styleProperty = style === "width" ? "width" : "height";
  const directionProperty = direction === "row" ? "top" : "left";
  const container = document.querySelector(".cropper-view-box");
  for (let i = 0; i < times - 1; i++) {
    const element = document.createElement("span");
    element.style[directionProperty] = `${(100 / times) * (i + 1)}%`; // 添加样式
    element.style[styleProperty] = "100%";
    element.classList.add("additional"); // 添加类
    container.appendChild(element);
  }
}

function updateCropperOptions(options = {}) {
  const {
    aspectRatio = cropper.options.aspectRatio,
    viewMode = cropper.options.viewMode,
  } = options;
  // dragMode = "move",
  // movable = true,
  // scalable = true,
  // zoomable = true,
  // modal = true,
  // guides = false,
  // center = false,
  // background = false,
  // wheelZoomRatio = 0.3
  if (!cropper) {
    console.error("Cropper instance is not initialized!");
    return;
  }

  // 更新裁剪框比例
  // 更新裁剪框比例和视图模式
  cropper.setAspectRatio(aspectRatio);
  cropper.options.viewMode = viewMode;
  // cropper.setAspectRatio(aspectRatio);
  // cropper.options = {
  //   ...cropper.options,
  //   ...options, // 直接合并options对象，覆盖或新增属性
  // };
  // cropper.options = {
  //   ...cropper.options, // 先展开原有options
  //   viewMode, // 等同于viewMode: viewMode，如果viewMode有值则覆盖原有值
  //   // dragMode, // 同上，用于更新dragMode
  //   // scalable: movable, // 假设你是想根据movable更新scalable属性
  // };

  console.log(aspectRatio, cropper.options.viewMode);
  // 刷新实例以应用新的设置
  cropper.replace(cropper.url);
}

function isMobileDevice() {
  if (typeof window !== "undefined") {
    // 检查触摸设备
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    ) {
      return true;
    }

    // 检查常见移动设备关键字
    let userAgent = navigator.userAgent.toLowerCase();
    let mobileKeywords = [
      "mobi",
      "ipad",
      "iphone",
      "ipod",
      "android",
      "windows phone",
    ];
    for (let i = 0; i < mobileKeywords.length; i++) {
      if (userAgent.indexOf(mobileKeywords[i]) !== -1) {
        return true;
      }
    }

    // 检查屏幕尺寸（可选，根据需求决定是否加入此判断）
    let screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    let screenHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    if (screenWidth <= 768 || screenHeight <= 768) {
      return true; // 假设小于等于768像素为移动设备
    }
  }
  return false;
}
const isModalVisible = ref(false);
const showModal = () => {
  isModalVisible.value = true;
};

const handleOk = () => {
  isModalVisible.value = false;
};

const handleCancel = () => {
  isModalVisible.value = false;
};
const downloadFile = (index, file) => {
  const link = document.createElement("a");
  console.log(file);
  const url = URL.createObjectURL(file);
  link.href = url;
  link.download = `${index + 1}@${fileInfo.fullname}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // 释放URL对象
};
</script>

<style scoped>
.imgClass {
  max-width: 100%;
}
.grid_cut {
  display: flex;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
}
.pc_upload {
  max-height: 200px;
}
.mobile_upload {
  display: none;
}
.grid_edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 420px;
}

:deep() .additional {
  position: absolute;
  z-index: 999;
  top: 0;
  border: #ffffff42 1px dashed;
}
.grid_preview {
  width: 500px;
  height: 500px;
}
button,
input[type="button"],
input[type="submit"],
svg,
span,
* {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.rotate-slider :deep() .ant-slider-track {
  display: none;
}
.rotate-slider :deep() .ant-slider-dot-active {
  border-color: #f0f0f0;
}
.rotate-slider :deep() .ant-slider-mark,
.rotate-slider :deep() .ant-slider-mark-text-active {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
/* .download{
  margin: 0 auto;
} */
/* ---------- */
@media screen and (max-width: 500px) {
  .grid_cut {
    padding: 1rem;
    /* padding-bottom: 2rem; */
    flex-direction: column;
    gap: 1rem;
  }
  .pc_upload {
    display: none;
  }
  .mobile_upload {
    display: block;
    width: 100%;
  }
  :deep() .ant-upload-wrapper .ant-upload-select {
    display: block;
  }
  .grid_edit {
    gap: 0.5rem;
    min-width: unset;
  }
  .grid_preview {
    width: 300px;
    height: 300px;
    aspect-ratio: 1 / 1;
    /* padding-top: 100%; */
    margin: 0 auto;
  }
}
</style>
