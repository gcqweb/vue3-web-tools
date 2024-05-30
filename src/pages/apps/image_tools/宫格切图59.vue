<template>
  <div class="container">
    <a-upload :before-upload="handleUpload" :show-upload-list="false">
      <a-button>上传照片</a-button>
    </a-upload>

    <div class="main">
      <Drager
        :width="600"
        class="fixed_canvas"
        :height="600"
        :left="0"
        :top="0"
        :selected="false"
        :border="false"
        :resizable="false"
        :rotatable="false"
        boundary
        disabled
      >
        <canvas
          ref="canvasRef"
          class="photo_edit"
          ></canvas>
          <!-- style="width: 600px; height: 600px" -->
      </Drager>
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
        @drag-end="onDragEnd"
        ><div class="images">
          <!-- @drag-start="onDragStart" -->
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
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import Drager from "es-drager";
// import png from "./wp.webp";
// import png from "@/assets/banner.jpg";
import png from "@/assets/678.png";
// import png from "./wp.webp";
const position = reactive({ width: 100, height: 100, left: 100, top: 100 });
const displayGap = ref(10);
// const defaultHeight = 600;
const imgSrc = ref(png);
const canvasRef = ref(null);
const imgRef = ref(null);
// console.log(imgSrc);
onMounted(() => {
  getImgWH();
  drewCanvas();
});
const getImgWH = () => {
  const image = imgRef.value;
  const canvas = canvasRef.value;
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  let ratio = canvas.clientWidth * (width / height);
  position.top = 0;
  position.left = 0;
  // 图片的短边占满默认高度，长边按比例
  position.width = ratio < canvas.clientWidth ? canvas.clientWidth : ratio;
  position.height =
    ratio < canvas.clientWidth
      ? canvas.clientWidth / (width / height)
      : canvas.clientWidth;
  console.log(position.width, position.height, ratio, width / height);
};

const drewCanvas = (index) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = imgRef.value;
  let canvasDisplayWidth =canvas.clientWidth ;
  let canvasDisplayHeight = canvas.clientHeight;
  let imgDisplayWidth = img.clientWidth;
  let imgDisplayHeight = img.clientHeight;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  // return;
  let img_scale_w= imgDisplayWidth / img.naturalWidth; 
  let img_scale_h = imgDisplayHeight / img.naturalHeight;
let canvas_scale_w = canvasDisplayWidth / canvas.width;
let canvas_scale_h = canvasDisplayHeight / canvas.height;

  // let scalePosition = img.width / canvasDisplayWidth;
  // console.dir(img);

  // 绘制图片的一部分到canvas
  console.log(img_scale_w,img_scale_h);
  ctx.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    0,
    // img.naturalWidth,
    // img.naturalHeight,
    img.naturalWidth*img_scale_w,
    img.naturalHeight*img_scale_h,
  );
  // ctx.drawImage(
  //   img,
  //   -position.left,
  //   -position.top,
  //   // -position.left,
  //   // -position.top,
  //   canvas.width ,
  //   canvas.height,
  //   position.left,
  //   position.top,
  //   ratio*scaleWidth,
  //   canvasDisplayHeight*scaleHeight,
  // );
  // 下载图片
  // downloadImage();
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
    imgRef.value.onload = getImgWH;
  };
  reader.readAsDataURL(file);
  return false;
}

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
  const gridSize = minDimension / rows;
  const canvasSize = minDimension + (rows - 1) * spacing; // Increase canvas size to accommodate spacings
  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;
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
      const displayWidth = parseInt(position.width, 10);
      const displayHeight = parseInt(position.height, 10);
      ctx.drawImage(
        image,
        col * gridSize * (naturalWidth / displayWidth) -
          position.left * (naturalWidth / displayWidth),
        row * gridSize * (naturalHeight / displayHeight) -
          position.top * (naturalWidth / displayWidth),
        gridSize * (naturalWidth / displayWidth),
        gridSize * (naturalWidth / displayWidth),
        x,
        y,
        gridSize,
        gridSize
      );
      // ctx.drawImage(
      //   image,
      //   col * gridSize - position.left,
      //   row * gridSize - position.left,
      //   gridSize,
      //   gridSize,
      //   x,
      //   y,
      //   gridSize,
      //   gridSize
      // );
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

// @change="onChange"
// drag、resize、rotate
const onChange = (dragData) => {
  // console.log(position.top);
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

// drag start
const onDragStart = (dragData) => {
  // console.log("onDragStart", dragData);
  // imgRef.value.style.display = "none";
};
// drag end
const onDragEnd = (dragData) => {
  drewCanvas();
  // console.log("onDragEnd", dragData);
  // imgRef.value.style.display = "block";
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
* {
  box-sizing: border-box;
}
.container {
  height: 100%;
  width: 100%;
  background: #d3fdfd;
}
.main {
  position: relative;
  margin: 0 auto;
  width: 600px;
  height: 600px;
  background: #ffffff;
  z-index: 1;
}
.fixed_canvas {
  background: #fddfdf;
  margin: 0 auto;
  z-index: -1;
}
.images {
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}
</style>
