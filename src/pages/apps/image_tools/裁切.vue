<template>
  <div>
    <div ref="imageContainer" class="img-container">
      <img ref="image" :src="imageSrc" alt="Source Image" />
    </div>
    <button @click="cropImage">Crop Image</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const cropper = ref(null);
const imageSrc= 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'
const image = ref(null);
onMounted(() => {
  cropper.value = new Cropper(image.value, {
    aspectRatio: 16 / 9,
    crop(event) {
      console.log(event.detail.x);
      console.log(event.detail.y);
      console.log(event.detail.width);
      console.log(event.detail.height);
      console.log(event.detail.rotate);
      console.log(event.detail.scaleX);
      console.log(event.detail.scaleY);
    },
  });
});

function cropImage() {
  // 此方法用于裁剪图像并可能将其切割为多宫格
  const canvas = cropper.value.getCroppedCanvas();
  // 处理裁剪后的图像，例如显示或保存等
  console.log(canvas.toDataURL("image/jpeg"));
}
</script>

<style>
.img-container {
  width: 100%;
  max-width: 400px;
  height: 400px;
  position: relative;
  margin: auto;
}
</style>
