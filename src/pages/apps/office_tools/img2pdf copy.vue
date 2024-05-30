<template>
  <section class="img2pdf_container">
    <div class="sider">
      <sider>
        <input type="file" @change="loadImage" accept="image/*" />
        <button @click="rotateImage">旋转图片</button>
        <button @click="downloadPDF">下载 PDF</button>
      </sider>
    </div>
    <div class="content">
      <div class="misc">
        <template v-if="imageSrc">
          <img
            :src="imageSrc"
            :style="{ transform: `rotate(${rotation}deg)` }"
            style="max-height: 100%; max-width: 100%"
          />
        </template>
        <!-- <iframe id="pdf" style="width: 100%; height: 100%"></iframe> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { ref } from "vue";
import png from "@/assets/banner.jpg";
const imageSrc = ref(png);
const rotation = ref(0);

async function loadImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
function rotateImage() {
  rotation.value = (rotation.value + 90) % 360;
  //   console.log(rotation.value, "rotation");
}

async function downloadPDF() {
  const pdfDoc = await PDFDocument.create();

  // 加载图片并嵌入到 PDF
  const imageBytes = await fetch(imageSrc.value).then((res) =>
    res.arrayBuffer()
  );
  const embeddedImage = await pdfDoc.embedJpg(imageBytes);
  //   const pngDims = embeddedImage.scale(0.5);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  // 计算图片的适合页面的尺寸和位置
  let imgWidth = embeddedImage.width;
  let imgHeight = embeddedImage.height;
  let scale = Math.min(width / imgWidth, height / imgHeight);
  //   let scale = Math.min(width / imgWidth, height / imgHeight);
  //   let imgX = (width - imgWidth * scale) / 2;
  //   let imgY = (height - imgHeight * scale) / 2;

  //   // 计算旋转后的新位置，确保图片居中
  //   if (rotation.value === 90 || rotation.value === 270) {
  //     // 旋转90或270度后，宽度和高度互换
  //     imgX = (width - imgHeight * scale) / 2;
  //     imgY = (height - imgWidth * scale) / 2;
  //   }
  //   console.log(imgX, imgY, scale);

  //   console.log(`Image dimensions: ${imgWidth}x${imgHeight}`);
  //   console.log(`Scaled dimensions: ${imgWidth * scale}x${imgHeight * scale}`);

  //   // 在 PDF 中添加图片
  //   page.drawImage(embeddedImage, {
  //     x: imgX,
  //     y: imgY,
  //     width: imgWidth * scale,
  //     height: imgHeight * scale,

  //     rotate: degrees(rotation.value), // 确保 this.rotation 的值正确
  //   });
  // 根据旋转角度调整图片尺寸和位置
  let imgX, imgY;
  switch (rotation.value) {
    case 90:
    case 270:
      scale = Math.min(width / imgHeight, height / imgWidth); // 交换尺寸进行比较
      imgX = (width - imgHeight * scale) / 2;
      imgY = (height - imgWidth * scale) / 2;
      break;
    default:
      imgX = (width - imgWidth * scale) / 2;
      imgY = (height - imgHeight * scale) / 2;
      break;
  }

  // 在 PDF 中添加图片
  page.drawImage(embeddedImage, {
    x: imgX,
    y: imgY,
    width:
      rotation.value === 90 || rotation.value === 270
        ? imgHeight * scale
        : imgWidth * scale,
    height:
      rotation.value === 90 || rotation.value === 270
        ? imgWidth * scale
        : imgHeight * scale,
    rotate: degrees(rotation.value),
  });
  // 保存 PDF
  const pdfBytes = await pdfDoc.save();
  //   let  pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  //       document.getElementById('pdf').src = pdfDataUri;
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "image.pdf";
  link.click();
}
</script>

<style scoped>
.img2pdf_container {
  position: relative;
  width: 1100px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  padding: 38px;
  border-radius: 1rem;
  border-top-right-radius: 2rem;

  box-shadow: inset 2px 4px 6px rgba(255, 255, 255, 0.2),
    -1px -4px 4px rgba(255, 255, 255, 0.9);
  background-image: linear-gradient(
    150deg,
    #98d5ff 10%,
    #8fcaf2 20%,
    #79c8fe 51%,
    #5dbdff 70%,
    #98a4ff 100%
  );
}
.sider {
  width: 230px;
  height: 100%;
  transform: translate(-5rem, 0);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(135deg, #afe5ffc2 10%, #bcd3ff 99%);
  backdrop-filter: blur(30px);
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 200px);
  height: 100%;
  width: 100%;

  padding: 2rem;
  padding-left: 0;
}
.misc{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
