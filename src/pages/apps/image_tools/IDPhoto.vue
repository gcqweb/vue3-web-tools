<template>
  <context-holder />
  <section class="IDPhoto">
    <section class="settings">
      <a-upload :before-upload="handleUpload" :show-upload-list="false">
        <a-button>上传照片</a-button>
      </a-upload>
      <a-button @click="handleAI"> AI抠图</a-button>
      <div class="color-picker">
        <div class="select-color">
          <!-- 单选框线性/镜像渐变/纯色 -->
          <!-- <div class="flex"> -->
          <a-radio-group
            v-model:value="currentGradient.type"
            button-style="solid"
          >
            <a-radio-button
              :value="option"
              v-for="(option, index) in gradientOptions"
              :key="index"
              >{{ option }}</a-radio-button
            >
          </a-radio-group>
          <input
            v-if="currentGradient.type !== '纯色'"
            type="color"
            class="color-picker1"
            v-model="currentGradient.color"
          />
          <!-- <div v-for="(option, index) in gradientOptions" :key="index">
              <input
                type="radio"
                :id="option"
                :value="option"
                v-model="currentGradient.type"
                @click="currentGradient.type = option"
              />
              <label :for="option">{{ option }}</label>
            </div> -->
          <!-- </div> -->
        </div>
        <div class="select-color">
          <input type="color" class="color-picker1" v-model="backgroundColor" />
          <span>
            <button
              class="color-btn"
              v-for="color in colors"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="backgroundColor = color"
            ></button>
          </span>
        </div>
      </div>
      <div class="size">
        <h4>尺寸</h4>
        <div class="size_text">
          <div v-for="option in sizes" :key="option.value">
            <input
              v-if="option.label != '自定义'"
              type="radio"
              :id="option.value"
              :value="option.value"
              v-model="selectedSize"
            />
            <div v-else="option.label === '自定义'">
              <input
                type="radio"
                :id="option.value"
                :value="option.value"
                v-model="selectedSize"
              />
              <span @click="selectedSize = 8">{{ option.label }}<br /></span>
              <a-space v-if="selectedSize === 8">
                <a-input-number
                  :min="32"
                  :max="2000"
                  v-model:value="coustom_width"
                  class="coustom_width"
                  @blur="resizeHandle"
                />
                <a-input-number
                  :min="32"
                  :max="2000"
                  v-model:value="coustom_height"
                  class="coustom_height"
                  @blur="resizeHandle"
                />
              </a-space>
            </div>
            <label :for="option.value">{{
              option.label != "自定义" ? option.label : ""
            }}</label>
          </div>
        </div>
      </div>
      <a-space>
        <a-button @click="addBorder">边框</a-button>
        <a-button @click="saveCanvasAsImage">保存</a-button>
        <a-button @click="saveCanvasAsImage('layout')">保存排版</a-button>
      </a-space>
    </section>
    <section class="edit">
      <a-segmented
        v-model:value="value"
        :options="data"
        @change="changeLayout"
      />
      <div v-show="value == '排版'" class="img-layout">
        <canvas ref="targetCanvas"></canvas>
      </div>
      <div
        v-show="value == '编辑'"
        class="parent"
        ref="parent"
        :style="{
          height: canvas_display.height + 'px',
          width: canvas_display.width + 'px',
        }"
      >
        <DraggableContainer :adsorbParent="true">
          <Vue3DraggableResizable
            ref="editable"
            :initW="300"
            :initH="400"
            v-model:x="rect_drag.x"
            v-model:y="rect_drag.y"
            v-model:w="rect_drag.width"
            v-model:h="rect_drag.height"
            :draggable="true"
            :resizable="true"
            :lockAspectRatio="true"
            @drag-start="clearCanvas"
            @drag-end="resizingHandle"
            @resize-start="clearCanvas"
            @resize-end="resizingHandle"
            class="dragged_box"
          >
            <img
              class="photo"
              ref="photo"
              :src="photoSrc"
              @load="onImageLoad"
            />
          </Vue3DraggableResizable>
          <canvas
            ref="canvasRef"
            class="photo_edit"
            :style="{
              height: canvas_display.height + 'px',
              width: canvas_display.width + 'px',
              backgroundColor: backgroundColor,
            }"
          ></canvas>
        </DraggableContainer>
      </div>
    </section>
  </section>
</template>

<script setup>
// npm install vue3-draggable-resizable
import { ref, nextTick, onMounted, watch, reactive, computed } from "vue";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import { DraggableContainer } from "vue3-draggable-resizable";
//default styles
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";
// import png from "./12.png";
// import png from "./result.png";
import png from "@/assets/default_idphoto.png";
import { message } from "ant-design-vue";
// import { UserOutlined } from "@ant-design/icons-vue";
const [messageApi, contextHolder] = message.useMessage();
const used = ref(1);

const data = reactive(["编辑", "排版"]);
const value = ref(data[0]);

const canvasRef = ref(null);
const photo = ref(null);
const parent = ref(null);
const editable = ref(null);
const photoSrc = ref(png); // 图片路径
const base64String = ref(null);
// photoSrc.value = base64String.value || png;
const canvas_display = reactive({ width: 300, height: 400 });
const rect_drag = reactive({ x: 0, y: 0, width: 300, height: 400 });
const rect_canvas = reactive({ x: 0, y: 0, width: 300, height: 400 });
const rect_img = reactive({ x: 0, y: 0, width: 300, height: 400 });
const canvas_img = reactive({ x: 0, y: 0, width: 300, height: 400 });

let colors = [
  "#ffffff",
  "#eeeeee",
  "#ec3636",
  "#F3C76C",
  "#ffee66",
  "#3CA082",
  "#00a2ff",
  "#bb55dd",
];
// #d43935 //红色
const currentGradient = ref({ color: "#ffffff", type: "纯色" });
const gradientOptions = ref(["纯色", "线性渐变", "径向渐变"]);
// const coustom_size = reactive({width: 2000, height: 2000});
const coustom_width = ref(2000);
const coustom_height = ref(2000);
const selectedSize = ref(0);
const onImageLoad = () => {
  // console.log(photo.value?.naturalWidth);
  if (photo.value) {
    imageDimensions.value = {
      width: photo.value.naturalWidth,
      height: photo.value.naturalHeight,
    };
    init_main();
    drawCanvas();
    resizeHandle();
  }
};

const imageDimensions = ref({ width: 300, height: 200 });
const sizes = computed(() => [
  {
    label: `原图（${imageDimensions.value.width}*${imageDimensions.value.height}）`,
    width: photo.value?.naturalWidth || 0,
    height: photo.value?.naturalHeight || 0,
    value: 0,
  },
  { label: "一寸（295*413）", width: 295, height: 413, value: 1 },
  { label: "二寸（413*579）", width: 413, height: 579, value: 2 },
  { label: "大一寸（390*567）", width: 390, height: 567, value: 3 },
  { label: "大二寸（413*626）", width: 413, height: 626, value: 4 },
  { label: "小一寸（360*378）", width: 360, height: 378, value: 5 },
  { label: "小二寸（413*531）", width: 413, height: 531, value: 6 },
  { label: "身份证（260*390）", width: 260, height: 390, value: 7 },
  // { label: "自定义",width: coustom_size.width, height: coustom_size.height, value: 8 },
  {
    label: "自定义",
    width: coustom_width.value,
    height: coustom_height.value,
    value: 8,
  },
]);

const backgroundColor = ref(colors[2]); // 初始背景颜色

// onMounted(() => {
//   init_main();
//   resizeHandle();
//     resizingHandle();
//     sizeChange();
// });
const init_main = () => {
  let photoNaturalWidth = photo.value?.naturalWidth;
  let photoNaturalHeight = photo.value?.naturalHeight;
  // 初始化canvas图片绘制尺寸
  canvas_img.width = photoNaturalWidth;
  canvas_img.height = photoNaturalHeight;
  // 初始化canvas显示css高度
  canvas_display.width =
    canvas_display.height / (canvas_img.height / canvas_img.width);
  canvas_display.height = 400;
  // 初始化dom图片尺寸
  rect_img.width = canvas_display.width || photoNaturalWidth;
  rect_img.height =
    canvas_display.width / (photoNaturalWidth / photoNaturalHeight) ||
    photoNaturalHeight;
  // 初始化拖拽的高度
  rect_drag.width = rect_img.width;
  rect_drag.height = rect_img.height;
  // 初始化cancas，根据尺寸或者图片的像素
  rect_canvas.width = canvas_img.width;
  rect_canvas.height = canvas_img.height;
};

const resizeHandle = () => {
  if (selectedSize.value === 8) {
    if (
      coustom_width.value <= 0 ||
      coustom_height.value <= 0 ||
      !(
        0.5 < coustom_width.value / coustom_height.value &&
        coustom_width.value / coustom_height.value < 3
      )
    ) {
      messageApi.error("宽高不能为0，或错误宽高比");
      // alert("请输入正确的宽高");
      coustom_width.value = coustom_width.value ? coustom_width.value : 2000;
      coustom_height.value = coustom_height.value ? coustom_height.value : 2000;
      return;
    }
    canvas_display.height = 400;
    canvas_display.width = coustom_width.value / (coustom_height.value / 400);
    rect_canvas.width = coustom_width.value;
    rect_canvas.height = coustom_height.value;
    rect_drag.width = canvas_display.width;
    rect_drag.height =
      canvas_display.width /
      (photo.value.naturalWidth / photo.value.naturalHeight);
  }
};

// 监听图片位置变化
watch(
  [
    backgroundColor,
    rect_canvas,
    rect_img,
    selectedSize,
    currentGradient,
    base64String,
    photoSrc,
  ],
  () => {
    resizeHandle();
    resizingHandle();
  },
  { deep: true }
);

const getCurrentGradient = (ctx) => {
  // 设置背景颜色
  if (currentGradient.value.type === "纯色") {
    return backgroundColor.value;
  } else {
    if (currentGradient.value.type === "线性渐变") {
      // 线性渐变
      var gradient = ctx.createLinearGradient(
        0,
        canvasRef.value.width * 1.5,
        0,
        0
      ); // 从左到右的线性渐变
    }
    if (currentGradient.value.type === "径向渐变") {
      // 创建径向渐变
      var gradient = ctx.createRadialGradient(
        canvasRef.value.width / 2,
        canvasRef.value.height / 2,
        0,
        canvasRef.value.width / 2,
        canvasRef.value.height / 2,
        canvasRef.value.width
      );
    }
    gradient.addColorStop(0, currentGradient.value.color); // 中间白色
    gradient.addColorStop(1, backgroundColor.value); // 外边蓝色
    return gradient;
  }
};

function lightenHexColor(hex, brightness = 0.8) {
  // 获取此颜色的亮一些趋向于白色的颜色
  // 检查输入的16进制颜色值是否有效
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    messageApi.error("无效的十六进制颜色格式");
    throw new Error("无效的十六进制颜色格式");
  }

  // 如果是简写形式的颜色值，将其转换为完整形式
  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  // 提取RGB分量
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // 根据亮度值计算新的RGB分量
  const newR = Math.min(255, Math.floor(r + (255 - r) * brightness));
  const newG = Math.min(255, Math.floor(g + (255 - g) * brightness));
  const newB = Math.min(255, Math.floor(b + (255 - b) * brightness));
  // 将新的RGB分量转换为16进制字符串
  const result =
    "#" +
    newR.toString(16).padStart(2, "0") +
    newG.toString(16).padStart(2, "0") +
    newB.toString(16).padStart(2, "0");
  return result;
}

const drawCanvas = () => {
  if (!photo.value?.complete) return; // 确保图片已加载
  const ctx = canvasRef.value.getContext("2d");
  canvasRef.value.width = rect_canvas.width;
  canvasRef.value.height = rect_canvas.height;
  // 设置填充样式并填充画布
  // ctx.fillStyle = backgroundColor.value;
  ctx.fillStyle = getCurrentGradient(ctx);
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  // 绘制图片
  if (photo.value.complete) {
    ctx.drawImage(
      photo.value,
      canvas_img.x,
      canvas_img.y,
      canvas_img.width,
      canvas_img.height
    );
  }
  photo.value.style.visibility = "hidden";
};

function handleUpload(file) {
  let reader = new FileReader();
  reader.onload = (e) => {
    base64String.value = e.target.result;
    photoSrc.value = e.target.result;
    // photo.value.onload(); // 确保图片加载后调用drawCanvas
  };
  reader.readAsDataURL(file);
  return false;
}
function beforeUpload() {
  let base64Str = base64String.value;
  // 判断图片大小是否超过5M
  const fileSizeInBytes = new Blob([base64Str]).size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  if (!base64Str) {
    messageApi.error("未选择图片");
    // alert("未选择图片");
    return;
  }
  if (fileSizeInMB >= 5) {
    messageApi.error("图片大小不能超过5M");
    // alert("图片大小不能超过5M");
    console.log("图片大小不能超过5M");
    return;
  }

  // 判断图片分辨率是否大于2000px
  const image = new Image();
  image.src = base64Str;
  image.onload = () => {
    const width = image.width;
    const height = image.height;
    if (width >= 2000 || height >= 2000) {
      messageApi.error("图片分辨率不能大于2000px");
      console.log("图片分辨率不能大于2000px");
      return;
    }
  };
  return true;
}
async function handleAI() {
  if (
    !beforeUpload() ||
    !confirm(
      `AI抠图，将图片上传至服务器，是否上传？\n注：服务器免费次数有限\n本月剩余总数约：${used.value}次`
    )
  ) {
    // messageApi.warning("取消上传");
    console.log("取消上传");
    return;
  }
  // return
  let uploadUrl = "https://api.gcqweb.cn/IDPhoto/";
  // 创建一个新的FormData实例
  const formData = new FormData();
  formData.append("密码", "123456");
  formData.append("文件", base64String.value);
  try {
    messageApi.success("正在上传，请等待AI处理结果...");
    console.log("开始上传图片至服务器");
    // 使用fetch发送POST请求
    const response = await fetch(uploadUrl, {
      method: "POST", // or 'PUT'
      body: formData,
      mode: 'cors',
    });
    // 解析响应为JSON
    const data = await response.json();
    photoSrc.value = "data:image/png;base64," + data["photo_base64"];
    used.value = data["used-id"][1] - data["used-id"][0];
    return;
    // 在这里处理数据，例如将其保存到变量中
    console.log(data);
    // photoSrc.value = data;
  } catch (error) {
    messageApi.error("服务器响应异常！");
    console.error("Error:", error);
  }
}
watch(selectedSize, (newValue, oldValue) => {
  sizeChange();
});
const sizeChange = () => {
  document.querySelector(".vdr-container").classList.add("drag");
  document.querySelector(".vdr-handle").style.display = "block";
  let currentWidth = sizes.value[selectedSize.value].width;
  let currentHeight = sizes.value[selectedSize.value].height;
  let currentSelected = sizes.value[selectedSize.value].label;
  // console.log(currentWidth);
  if (!currentSelected || currentSelected === "原图") {
    currentWidth = photo.value.naturalWidth;
    currentHeight = photo.value.naturalHeight;
  }
  rect_canvas.width = currentWidth;
  rect_canvas.height = currentHeight;
  if (currentHeight && currentHeight != 400) {
    canvas_display.height = 400;
    canvas_display.width = currentWidth / (currentHeight / 400);
    rect_img.width = canvas_display.width;
    rect_img.height =
      canvas_display.width /
      (photo.value.naturalWidth / photo.value.naturalHeight);
    rect_drag.width = rect_img.width;
    rect_drag.height = rect_img.height;
  }
  canvas_img.x = rect_drag.x * (rect_canvas.width / rect_drag.width);
  canvas_img.y =
    rect_drag.y /
    (canvas_display.height / sizes.value[selectedSize.value]?.height);
  // });
};

const resizingHandle = () => {
  // 显示
  photo.value.style.visibility = "visible";
  // clearCanvas();
  rect_img.width = rect_drag.width;
  rect_img.height = rect_drag.height;
  rect_img.x = rect_drag.x * (photo.value.naturalHeight / rect_drag.height);
  rect_img.y = rect_drag.y * (photo.value.naturalHeight / rect_drag.height);

  canvas_img.x =
    rect_drag.x /
    (canvas_display.width / sizes.value[selectedSize.value]?.width);
  canvas_img.y =
    rect_drag.y /
    (canvas_display.height / sizes.value[selectedSize.value]?.height);
  canvas_img.width =
    rect_drag.width * (canvasRef.value.width / canvas_display.width);
  canvas_img.height =
    rect_drag.height * (canvasRef.value.height / canvas_display.height);
  drawCanvas();
};

function addBorder() {
  document.querySelector(".vdr-container").classList.toggle("drag");
}

const clearCanvas = () => {
  photo.value.style.visibility = "visible";
  document.querySelector(".vdr-container").classList.remove("drag");

  // 清空画布中的ctx.drawImage
  if (canvasRef.value.getContext) {
    const ctx = canvasRef.value.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    // 清空画布中的ctx.drawImage
    canvasRef.value.width = rect_canvas.width;
    canvasRef.value.height = rect_canvas.height;

    // 设置背景颜色
    ctx.fillStyle = getCurrentGradient(ctx);
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
};

// 保存 Canvas 为图片
const saveCanvasAsImage = (canvas_type = null) => {
  const link = document.createElement("a");
  link.download = "_IDphont.png";
  if (canvas_type == "layout") {
    link.href = targetCanvas.value.toDataURL("image/png");
  } else {
    link.href = canvasRef.value.toDataURL("image/png");
  }
  link.click();
};

// ==============================

const targetCanvas = ref(null);

const columns = 3;
const rows = 2;
const margin = 20; // Outer border margin
const spacing = 2 * margin; // Inner spacing

// onMounted(() => {
const changeLayout = () => {
  const imgDataUrl = canvasRef.value.toDataURL();
  const img = new Image();
  img.src = imgDataUrl; // Replace with your image path
  img.onload = () => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const targetWidth =
      columns * imgWidth + (columns - 1) * spacing + 2 * margin;
    const targetHeight = rows * imgHeight + (rows - 1) * spacing + 2 * margin;

    // Set the target canvas size
    targetCanvas.value.width = targetWidth;
    targetCanvas.value.height = targetHeight;
    const targetCtx = targetCanvas.value.getContext("2d");
    // Fill the background with white color
    targetCtx.fillStyle = "white";
    targetCtx.fillRect(0, 0, targetWidth, targetHeight);

    // Draw the images in 3x2 layout with margin and spacing
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = margin + col * (imgWidth + spacing);
        const y = margin + row * (imgHeight + spacing);
        targetCtx.drawImage(img, x, y, imgWidth, imgHeight);
      }
    }
  };
};
</script>
<style scoped>
/* :deep() body {
  
} */
canvas {
  max-width: 100%;
}
.IDPhoto {
  padding: 1rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  position: relative;
  /* border: 1px solid #000; */
  user-select: none;
  /* background: -webkit-linear-gradient(top, transparent 19px, #e7e7e7 20px), -webkit-linear-gradient(left, transparent 19px, #e7e7e7 20px);
    background-size: 20px 20px; */
    background: linear-gradient(
      125.84deg,
      rgba(255, 232, 227, 0.5),
      rgba(255, 244, 236, 0.295) 12.8%,
      hsla(0, 0%, 100%, 0.396137) 34.17%,
      hsla(0, 0%, 100%, 0.0747951) 75.81%,
      rgba(211, 255, 247, 0.085) 87.48%,
      rgba(201, 235, 255, 0.5) 117.01%,
      rgba(201, 235, 255, 0.5) 0
    ),
    #f8f9f9;
}
.setting {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #000; */
  user-select: none;
}
.parent {
  width: 300px;
  height: 400px;
  /* position: absolute; */
  top: 100px;
  left: 100px;
  /* border: 1px solid #000; */
  user-select: none;
}
.parent img {
  width: 100%;
  /* opacity: 0.7; */
  /* max-height: 200px; */
  /* position: absolute; */
  /* display: none; */
  /* top: 0;
  left: 0; */
  /* z-index: 100; */
  user-select: none;
}

.size_text {
  text-align: start;
  position: relative;
  z-index: 1;
}
.edit {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid #000; */
  user-select: none;
  flex-direction: column;
}
.drag {
  border: 1px solid #000000;
}
.dragged_box {
  z-index: 0;
}
.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 0;
  margin: 0 5px;
  cursor: pointer;
  /* border: 1px solid #33aaee; */
  background-color: #fff;
  box-shadow: 0px 2px 9px -7px #000000;
  transition: all 0.3s;
  /* &:hover{
  } */
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-layout {
  max-width: 500px;
}
.select-color,
.size {
  padding: 0.5rem;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  gap: 0.5rem;
}
.size {
  flex-direction: column;
  align-items: start;
}
.color-picker1 {
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  overflow: hidden;
  /* border: #979797 1px solid; */
  background: conic-gradient(red, yellow, lime, aqua, blue, fuchsia, red);
}

.color-picker1::-webkit-color-swatch-wrapper {
  padding: 0;
  height: calc(2rem - 2px);
  width: calc(2rem - 2px);
  border-radius: 50%;
}

.color-picker1::-webkit-color-swatch {
  border: none;
  height: calc(2rem - 2px);
  width: calc(2rem - 2px);
  border-radius: 50%;
}

/* ------------- */
@media screen and (max-width: 700px) {
  .IDPhoto {
    flex-direction: column-reverse;
    margin: 0 auto;
    justify-content: start;
    width: 100%;
    overflow-x: hidden;
  }
  .size_text {
    text-align: start;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .size_text div {
    /* overflow: hidden; */
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .settings {
    margin-top: 1rem;
    z-index: 999;
  }
  .size {
    flex-direction: column;
    align-items: start;
  }
}
</style>
