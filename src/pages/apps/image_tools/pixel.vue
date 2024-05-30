<template>
  <canvas id="c" ref="c"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { TweenMax, SteppedEase } from "gsap";
import png from "@/assets/banner.jpg";
import png2 from "@/assets/banner.jpg";

const c = ref(null);
onMounted(() => {
  let canvas = c.value;
  const ctx = canvas.getContext("2d");

  // fileInput.addEventListener('change', handleFileSelect);
  const img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Process the image
    processImage();
  };
  img.src =
    "data:image/png;base64,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";
  function handleFileSelect(event) {
    // const file = event.target.files[0];
    // const reader = new FileReader();

    // reader.onload = function(e) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Process the image
      processImage();
    };
    img.src = e.target.result;
    // };
    // reader.readAsDataURL(file);
  }

  function processImage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const replacementColor = { r: 255, g: 90, b: 220, a: 255 }; // #ff2588

    // Function to calculate brightness
    function calculateBrightness(r, g, b) {
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Replace colored blocks with the replacement color, ignoring white and transparent pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Ignore transparent pixels and white pixels
      if (a !== 0 && !(r === 255 && g === 255 && b === 255)) {
        // if (a !== 0 && !(r >= 240 && g >= 240 && b >= 240)) {
        const brightness = calculateBrightness(r, g, b);

        // Calculate new color with same brightness
        const newR = (brightness / 255) * replacementColor.r;
        const newG = (brightness / 255) * replacementColor.g;
        const newB = (brightness / 255) * replacementColor.b;

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        data[i + 3] = replacementColor.a;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    // Rotate the image
    // rotateImage();
  }

  function rotateImage() {
    const degrees = Math.random() * 360;
    const radians = (degrees * Math.PI) / 180;

    // Create an offscreen canvas for the rotation
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");

    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    offscreenCtx.translate(canvas.width / 2, canvas.height / 2);
    offscreenCtx.rotate(radians);
    offscreenCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
  }
});
</script>

<style scoped>
canvas {
  display: block;
}
</style>
