<template>
  <div>
    <input type="file" @change="uploadImage" />
    <canvas ref="canvasRef" style="border: 1px solid #ccc"></canvas>
    <!-- <img :src="imgSrc" alt="" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fabric } from "fabric";

const canvasRef = ref(null);
let canvas;

const imgSrc = ref("");
onMounted(() => {
  canvas = new fabric.Canvas(canvasRef.value, {
    width: 800,
    height: 600,
  });

  // 监听鼠标滚轮事件进行缩放
  canvas.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
});

function uploadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgSrc.value = e.target.result;
      fabric.Image.fromURL(e.target.result, (img) => {
        // 设置图片的缩放锁定比例
        img.set({
          // lockScalingFlip: true, // 保持宽高比
          // lockUniScaling: true,
          // lockScalingX: true,
          hasControls: false,
          hasBorders: false,
          cornerSize: 15,
          transparentCorners: false,
          cornerColor: "blue",
          borderColor: "red",
          top: 50,
          left: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        // 确保图片适应canvas大小
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let scale = canvas.width / img.width;
        if (canvasRatio > imgRatio) {
          scale = canvas.height / img.height;
        }
        img.scale(scale).setCoords();

        // 添加图片到画布
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();

        // 监听对象的缩放、移动和旋转
        // canvas.on("object:scaling", updateInfo);
        canvas.on("object:moving", updateInfo);
        canvas.on("object:rotating", updateInfo);
        createNineGrid(img.width);
      });
    };
    reader.readAsDataURL(file);
  }
}

function updateInfo() {
  const obj = canvas.getActiveObject();
  if (obj) {
    console.log(
      `Width: ${obj.getScaledWidth().toFixed(2)}, Height: ${obj
        .getScaledHeight()
        .toFixed(2)}, Angle: ${obj.angle.toFixed(2)}`
    );
  }
}

const createNineGrid = (size) => {
  const gap = 10;
  const gridSize = (size - 2 * gap) / 3;
  let rects = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rect = new fabric.Rect({
        left: j * (gridSize + gap),
        top: i * (gridSize + gap),
        width: gridSize,
        height: gridSize,
        fill: "rgba(0, 0, 0, 0.2)",
        hasControls: false,  // 禁止单独的矩形显示控制点
        selectable: false,   // 禁止单独的矩形被选中
      });
      rects.push(rect);
    }
  }

  // 创建一个组合对象，包含所有矩形
  const group = new fabric.Group(rects, {
    selectable: true,  // 允许整个组合被选中和拖拽
    hasControls: true, // 允许显示控制点，进行缩放等操作
  });

  canvas.add(group);
};
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
