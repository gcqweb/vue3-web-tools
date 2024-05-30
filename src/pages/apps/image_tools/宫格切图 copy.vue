<template>
  <div class="container">
    <a-upload :before-upload="handleUpload" :show-upload-list="false">
      <a-button>上传照片</a-button>
    </a-upload>

    <div class="main">
      <Drager
        :width="600"
        class="test"
        :height="600"
        :left="0"
        :top="0"
        :selected="false"
        :border="false"
        :resizable="false"
        :rotatable="false"
        boundary
        disabled
        ><div class="content" :style="{ gap: `${displayGap}px` }">
          <div
            ref="squareRef"
            v-for="(square, index) in squares"
            :key="index"
            class="square"
            :style="getSquareStyle(index)"
            @click="drewCanvas(index)"
          ></div>
          <!-- @click="printOffset(index)" -->
        </div></Drager
      >
      <Drager
        :width="position.width"
        :height="position.height"
        :left="position.left"
        :top="position.top"
        rotatable
        equalProportion
        snap
        markline
        @change="onChange"
        @drag-start="onDragStart"
        @drag-end="onDragEnd"
        ><div class="images">
          <img :src="imgSrc" ref="imgRef" style="max-height: 100%" />
        </div>
      </Drager>
    </div>
    <button @click="getImgWH">hello</button>
    <button @click="getImgWH">xiangs</button>
    @change="onChange" @drag="onDrag" @drag-start="onDragStart"
    @drag-end="onDragEnd" @resize="onResize" @resize-start="onResizeStart"
    @resize-end="onResizeEnd" @rotate="onRotate" @rotate-start="onRotateStart"
    @rotate-end="onRotateEnd" @focus="onFocus" @blur="onBlur"
  </div>
  <a-slider v-model:value="displayGap" :min="0" :max="20" />

  <!-- <canvas ref="canvasRef"></canvas> -->
  <canvas ref="canvasRef" width="600" height="600" class="photo_edit" style="width: 600px;height: 600px;"></canvas>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import Drager from "es-drager";
// import png from "./wp.webp";
import png from "@/assets/banner.jpg";
// import png from "./wp.webp";
const position = reactive({ width: 100, height: 100, left: 100, top: 100 });
const displayGap = ref(10);
const defaultHeight = 600;
const imgSrc = ref(png);
const canvasRef = ref(null);
const squareRef = ref(null);
const imgRef = ref(null);
// console.log(imgSrc);
const getImgWH = () => {
  const image = new Image();
  image.src = imgSrc.value;
  image.onload = () => {
    // const canvas = document.createElement("canvas");
    // const ctx = canvasRef.value.getContext("2d");
    // canvasRef.value.width = image.width;
    // canvasRef.value.height = image.height;
    // ctx.drawImage(image, 0, 0);
    // const imageData = ctx.getImageData(0, 0, image.width, image.height);
    // // 现在您可以在imageData对象中访问像素数据
    // console.log(imageData);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    let ratio = (width / height) * defaultHeight;
    // 图片的短边占满默认高度，长边按比例
    if (ratio < defaultHeight) {
      position.width = defaultHeight;
      position.height = (height / width) * defaultHeight;
    } else {
      position.height = defaultHeight;
      position.width = (width / height) * defaultHeight;
    }
    console.log(width, height);
  };
};
getImgWH();
const offsetX = ref(100); // X轴偏移量
const offsetY = ref(50); // Y轴偏移量
const drewCanvas = (index) => {
  // 获取item的style的top和left

  const size = 200; // 正方形的尺寸
  const row = Math.floor(index / 3); // 获取当前正方形所在的行
  const col = index % 3; // 获取当前正方形所在的列
  const posX = position.left; // 横向位置
  const posY = position.top; // 纵向位置

  offsetX.value = col * size - posX; //+displayGap.value;
  offsetY.value = row * size - posY; //+displayGap.value;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imgSrc.value;
  img.onload = () => {
    // 设置canvas大小为裁剪区域大小
    canvas.width = 200; // 裁剪宽度
    canvas.height = 200; // 裁剪高度
    // 绘制图片的一部分到canvas
    ctx.drawImage(img, offsetX.value, offsetY.value, 200, 200, 0, 0, 200, 200);
    // 下载图片
    // downloadImage();
  };
};
function downloadImage() {
  const canvas = canvasRef.value;
  const image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  const link = document.createElement("a");
  link.download = "cropped-image.png";
  link.href = image;
  link.click();
}
function handleUpload(file) {
  let reader = new FileReader();
  reader.onload = (e) => {
    imgSrc.value = e.target.result;
    getImgWH();
  };
  reader.readAsDataURL(file);
  return false;
}

// const imageUrl = "YOUR_IMAGE_URL_HERE"; // 替换为实际图像URL

// 构建一个数组，代表 9 个正方形
const squares = reactive(Array.from({ length: 9 }, (_, index) => index));

function getSquareStyle(index) {
  const size = 200; // 正方形的尺寸
  const row = Math.floor(index / 3); // 获取当前正方形所在的行
  const col = index % 3; // 获取当前正方形所在的列
  const posX = position.left; // 横向位置
  const posY = position.top; // 纵向位置
  // 计算背景位置
  const backgroundPosX =
    posX < 0 ? `-${col * size - posX}px` : `${-col * size + posX}px`;
  const backgroundPosY =
    posY < 0 ? `-${row * size - posY}px` : `${-row * size + posY}px`;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // const size = 200; // 每个格子的尺寸
  const rows = 3;
  const cols = 3;
  const image = imgRef.value;
  const spacing = displayGap.value; // 格子之间的间距
  // canvas.width = image.naturalWidth;
  // canvas.height = image.naturalHeight;
  const minDimension = Math.min(image.naturalWidth, image.naturalHeight);
  const gridSize = (minDimension / rows);
  const canvasSize = minDimension + (rows - 1) * spacing; // Increase canvas size to accommodate spacings

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  let offsetX = (position.left * canvasSize) / 600;
    let offsetY = (position.top * canvasSize) / 600;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const posX = col * size;
      const posY = row * size;
      const x = col * (gridSize + spacing);
      const y = row * (gridSize + spacing);
      // console.log(-1 % 200, 666);
      // col * gridSize - offsetX,
      //     row * gridSize - offsetY,
      //     gridSize,
      //     gridSize,
      //     x,
      //     y,
      //     gridSize,
      //     gridSize
      // ctx.drawImage(image,  col * gridSize, row *gridSize, gridSize*6, gridSize*6, x, y, gridSize*6, gridSize*6);
      ctx.drawImage(image, col * gridSize,  row *gridSize, gridSize, gridSize, x, y, gridSize, gridSize);
    }
  }
  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url(${imgSrc.value})`,
    backgroundPosition: `${backgroundPosX} ${backgroundPosY}`,
    backgroundSize: `${position.width + "px " + position.height + "px"}`, // 假设原始图像是 300x300 像素
  };
}

// 输出每个正方形的偏移信息
function printOffset(index) {
  const size = 200;
  const row = Math.floor(index / 3);
  const col = index % 3;
  console.log(
    `Square ${index + 1} Offset: Top - ${row * size}px, Left - ${col * size}px`
  );
}

// @change="onChange"
// drag、resize、rotate
const onChange = (dragData) => {
  // console.log("onChange", dragData);
  // getSquareStyle(1)
  position.width = dragData.width;
  position.height = dragData.height;
  position.left = dragData.left;
  position.top = dragData.top;
};

// draging
const onDrag = (dragData) => {
  console.log("onDrag", dragData);
};
let temp_gap = 0;
// drag start
const onDragStart = (dragData) => {
  console.log("onDragStart", dragData);
  // squareRef.value.style.background= "none";
  imgRef.value.style.display = "none";
  temp_gap = displayGap.value;
  displayGap.value = 0;
};
// drag end
const onDragEnd = (dragData) => {
  console.log("onDragEnd", dragData);
  imgRef.value.style.display = "block";
  displayGap.value = temp_gap;
};

// resizing
const onResize = (dragData) => {
  console.log("onResize", dragData);
};
// resize start
const onResizeStart = (dragData) => {
  console.log("onResizeStart", dragData);
};
// resize end
const onResizeEnd = (dragData) => {
  console.log("onResizeEnd", dragData);
};

// rotating
const onRotate = (dragData) => {
  console.log("onRotate", dragData);
};
// rotate start
const onRotateStart = (dragData) => {
  console.log("onRotateStart", dragData);
};
// resize end
const onRotateEnd = (dragData) => {
  console.log("onRotateEnd", dragData);
};

// focus/selected
function onFocus(val) {
  console.log("onFocus", val);
}
// blur/unselected
function onBlur(val) {
  console.log("onBlur", val);
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  background: #f1f2f2;
}
.main {
  position: relative;
  margin: 0 auto;
  width: 600px;
  height: 600px;
  background: #ffffff;
  z-index: 1;
}
.test {
  background: #c3c3c3;
  margin: 0 auto;
  z-index: -1;
}
.images {
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}
.content {
  position: relative;
  border: 2px solid black;
  justify-content: center; /* 将网格项水平居中 */
  display: grid;
  grid-template-columns: 200px 200px 200px; /* 指定每列的宽度为200px */
  grid-template-rows: 200px 200px 200px; /* 指定每行的高度为200px */
  gap: 10px; /* 设置网格间隔，可根据需要调整 */
  width: fit-content;
  z-index: 1;
}
.square {
  cursor: pointer;
  background-repeat: no-repeat;
  background-color: bisque;
}
</style>
