<template>
  <section class="img2pdf_container">
    <section class="sider">
      <a-space direction="vertical">
        <a-upload
          v-model:file-list="fileList"
          name="img"
          list-type="picture-card"
          class="img-uploader"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :multiple="BatchMode"
        >
          <div>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">选择图片</div>
          </div>
        </a-upload>

        <a-divider style="margin: 0.5rem 0; background-color: #fff" />
        <div style="display: flex; justify-content: space-between">
          <a-button @click="rotateImage(false)"
            ><RotateRightOutlined />旋转图片</a-button
          >
          <a-button @click="rotateImage(true)" v-show="BatchMode"
            ><RotateRightOutlined />批量旋转</a-button
          >
        </div>
        <span
          ><a-switch
            v-model:checked="BatchMode"
            checked-children="批"
            un-checked-children="单"
          />{{ BatchMode ? "批量模式" : "单图模式" }}
          <a-tooltip title="选中的文件，将执行同样的操作">
            <a-button
              shape="circle"
              type="link"
              :icon="h(QuestionCircleOutlined)"
            ></a-button>
          </a-tooltip>
          <br />
          <!-- <a-switch
            v-model:checked="BatchMode"
            checked-children="批"
            un-checked-children="单"
          />{{ BatchMode ? "高效模式" : "性能模式" }} -->
        </span>
        <div style="display: flex; justify-content: space-between">
          <a-segmented
            v-show="selectedPageSize !== '无'"
            v-model:value="autoOrientation"
            :options="pdfOrientation"
            @change="rotatePdf(false)"
          />
          <a-button
            v-show="selectedPageSize !== '无' && BatchMode"
            @click="rotatePdf(true)"
            >批量{{
              autoOrientation === "portrait"
                ? "垂直"
                : autoOrientation === "landscape"
                ? "水平"
                : "自动"
            }}</a-button
          >
        </div>
        <div style="display: flex; justify-content: space-between">
          <div>
            <span>纸张</span>
            <a-select
              style="max-width: 100%"
              size=""
              ref="select"
              v-model:value="selectedPageSize"
              :options="paperSize"
              @change="changeSelect(false)"
            ></a-select>
          </div>
          <div v-show="BatchMode">
            <span>批量纸张</span>
            <a-select
              style="max-width: 100%"
              size=""
              ref="select"
              v-model:value="selectedPageSize"
              :options="paperSize"
              @change="changeSelect(true)"
            ></a-select>
          </div>
        </div>
        <a-tooltip title="下载右侧预览的PDF">
          <a-button
            type="primary"
            shape="round"
            size=""
            block
            @click="downloadPdf"
          >
            <template #icon>
              <DownloadOutlined />
            </template>
            <span>下载PDF</span>
          </a-button>
        </a-tooltip>
        <div
          v-show="BatchMode"
          style="display: flex; justify-content: center; align-items: center"
        >
          <a-space-compact block v-show="BatchMode">
            <a-button @click="removeImage('all')">清空列表</a-button>
            <a-tooltip title="将已选图片单独转换为PDF并打包成ZIP文件">
              <a-button
                type="primary"
                shape="round"
                size=""
                block
                @click="downloadEachCanvasAsPdf"
              >
                <template #icon>
                  <FileZipOutlined />
                  <!-- 更换为Zip相关的图标 -->
                </template>
                <span>打包为ZIP下载</span>
              </a-button>
            </a-tooltip>
            <a-tooltip title="将已选图片合并为一个PDF文件下载">
              <a-button
                type="primary"
                shape="round"
                size=""
                block
                @click="downloadMultipleCanvasInOnePdf"
              >
                <template #icon>
                  <FilePdfOutlined />
                  <!-- 更换为合并相关的图标 -->
                </template>
                <span>合并为PDF下载</span>
              </a-button>
            </a-tooltip>
          </a-space-compact>
        </div>
      </a-space>

      <div class="grid-layout" v-show="BatchMode && fileList.length ">
        <div
          v-for="(file, index) in fileList"
          :key="file.uid"
          class="preview-item"
          @click="gridItemHandler(file)"
        >
          <img :src="file.thumbUrl || file.base64" />
          <a-checkbox class="item-checkbox" v-model:checked="file.isChecked" />
          <a-button
            class="item-remove"
            size="small"
            danger
            type="primary"
            block
            @click.stop="removeImage(file)"
            >移除</a-button
          >
        </div>
      </div>
    </section>

    <div class="content">
      <div class="misc" v-show="canvasRef">
        <canvas class="pdf-canvas" ref="canvasRef"></canvas>
      </div>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref, nextTick, h, watch, computed } from "vue";
import jsPDF from "jspdf";
import {
  LoadingOutlined,
  PlusOutlined,
  DownloadOutlined,
  RotateRightOutlined,
  FileZipOutlined,
  FilePdfOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
// import png from "./result.png";
// import png from "@/assets/banner.jpg";
import JSZip, { file } from "jszip";
const canvasRef = ref(null);
// const imageRef = ref(null);
const rotation = ref(0);
const pdf_filename = ref("img2pdf");
const fileList = ref([]);
const BatchMode = ref(true);
const loading = ref(false);
const currentRecord = ref(null);

const selectedPageSize = ref("无");
const paperSize = ref([
  { value: "无", label: "无", width: 10, height: 10 },
  { value: "A4", label: "A4", width: 595.28, height: 841.89 },
  { value: "A3", label: "A3", width: 841.89, height: 1190.55 },
  { value: "A2", label: "A2", width: 1190.55, height: 1683.78 },
  { value: "A5", label: "A5", width: 420.94, height: 595.28 },
]);

const autoOrientation = ref("auto");
const pdfOrientation = ref([
  { label: "自动", value: "auto" },
  { label: "垂直", value: "portrait" },
  { label: "水平", value: "landscape" },
]); //方向，水平/垂直
function debounce(func, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
// 监听currentRecord
watch(
  () => currentRecord.value,
  async (newVal, oldVal) => {
      let canvas =
        newVal.pdfPageSize !== "无"
          ? await convertPdf(newVal, canvasRef.value)
          : await convertImg(newVal, canvasRef.value);
          // 从数组找到对应uid的元素
          newVal.thumbUrl = canvas.toDataURL("image/jpeg", 0.5);
          fileList.value = fileList.value.map(item => item.uid === newVal.uid ? newVal : item);
      // fileList.value[newVal.uid]
      // console.log("newVal", newVal);

    // }
  },
  { deep: true }
);
// watch(
//   () => currentRecord.value,
//   debounce(async (newVal, oldVal) => {
//     if (newVal) {
//       let canvas = newVal.pdfPageSize !== "无"
//         ? await convertPdf(newVal, canvasRef.value)
//         : await convertImg(newVal, canvasRef.value);
//       newVal.thumbUrl = canvas.toDataURL("image/jpeg", 0.5);
//       fileList.value = fileList.value.map(item => item.uid === newVal.uid ? newVal : item);
//       console.log("newVal", newVal);
//     }
//   }, 300), // 300毫秒为防抖延迟时间
//   { deep: true }
// );
function gridItemHandler(record) {
  currentRecord.value = record;
  autoOrientation.value = record.pdfRotation;
  rotation.value = record.imgRotation;
  selectedPageSize.value = record.pdfPageSize;
  // createImg(record.base64).then((img) => {
  //   imageRef.value = img;
  //   // drawImage();
  // });
  // test();
}

const removeImage = (record) => {
  if (record === "all") {
    fileList.value = []; // 清空列表
    return;
  }

  let index = fileList.value.indexOf(record);
  index = fileList.value.length - 1 === index ? index - 1 : index;
  fileList.value = fileList.value.filter((item) => item !== record);
  currentRecord.value = fileList.value[index];
  // createImg(fileList.value[index].base64).then((img) => {
  //   imageRef.value = img;
  //   // drawImage();
  // });
};

const rotatePdf = (botch = false) => {
  // currentRecord.value.pdfRotation = autoOrientation.value;
  currentRecord.value = {...currentRecord.value, pdfRotation: autoOrientation.value};
  if (botch) {
    fileList.value.forEach((item) => {
      if (item.isChecked) {
        item.pdfRotation = autoOrientation.value;
      }
    });
    drewPreview();
  }
  // drawImage();
};

const changeSelect = (batch = false) => {
  // currentRecord.value.pdfPageSize = selectedPageSize.value;
  currentRecord.value = {...currentRecord.value, pdfPageSize: selectedPageSize.value};
  if (batch) {
    fileList.value.forEach((item) => {
      if (item.isChecked) {
        item.pdfPageSize = selectedPageSize.value;
      }
    });
    drewPreview();
  }
  // drawImage();
};

// function rotateImage(batch = false) {
const rotateImage=(batch = false) =>{
  rotation.value = (rotation.value + 90) % 360;
  // currentRecord.value.imgRotation = rotation.value;
  currentRecord.value = { ...currentRecord.value, imgRotation:rotation.value};
  
  if (batch) {
    fileList.value.forEach((item) => {
      if (item.isChecked) {
        item.imgRotation = (item.imgRotation + 90) % 360;
      }
    }); 
    drewPreview();
  
  }
  // drawImage();
  // drewPreview();
  // test();
}

const drewPreview = async (batch = false) => {
    // if (!batch) {
  //   let canvas =
  //     currentRecord.value.pdfPageSize !== "无"
  //       ? await convertPdf(currentRecord.value)
  //       : await convertImg(currentRecord.value);
  //   currentRecord.value.thumbUrl = canvas.toDataURL("image/jpeg", 0.5);
  //   return;
  // }

  for (let i = 0; i < fileList.value.length; i++) {
    let file = fileList.value[i];
    let canvas =
      file.pdfPageSize !== "无"
        ? await convertPdf(file)
        : await convertImg(file);
    file.thumbUrl = canvas.toDataURL("image/jpeg", 0.5);
  }
};

const beforeUpload = async (file) => {
  let [filename, suffix = ""] = file.name.split("."); // 修正：处理没有点的情况
  let [file_type, fmt] = file.type.split("/");
  if (!suffix || !file_type || !fmt || file_type !== "image") {
    message.error("无法识别该图片文件");
    return;
  }
  file.filename = filename;
  file.suffix = suffix;
  file.file_type = file_type;
  file.fmt = fmt;
  file.isChecked = true;
  file.base64 = null;
  file.imgRotation = 0;
  file.pdfRotation = "auto" || "portrait" || "landscape";
  file.pdfPageSize = "无" || undefined;

  // console.log(file);

  // 返回 false 停止自动上传
  let base64Data = await new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => {
        console.error("读取文件错误:", e);
        reject(e); // Reject the promise on reader error
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("加载出错:", error);
      reject(error);
    }
  });
  file.base64 = base64Data;
  currentRecord.value = file;
  return false;
};

const createImg = (imgSrc) => {
  // imageRef.value = img;
  //   drawImage();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgSrc;
  });
};

const drawImage = () => {
  if (selectedPageSize.value !== "无") {
    // drawPdf();
  } else {
    // drawFullImage();
  }
};

function drawPdf() {
  const canvas = canvasRef.value;
  if (canvas && imageRef.value) {
    const ctx = canvas.getContext("2d");
    const page = paperSize.value.find(
      (p) => p.value === selectedPageSize.value
    );
    const isPortrait = autoOrientation.value === "portrait";
    canvas.width = isPortrait ? page.width * 2 : page.height * 2;
    canvas.height = isPortrait ? page.height * 2 : page.width * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rotated = rotation.value % 180 !== 0;
    const imgWidth = rotated ? imageRef.value.height : imageRef.value.width;
    const imgHeight = rotated ? imageRef.value.width : imageRef.value.height;

    // 计算缩放比例
    const scaleX = canvas.width / imgWidth;
    const scaleY = canvas.height / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    // 计算旋转后的图片中心点
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation.value * Math.PI) / 180);

    // 根据旋转角度调整图片绘制位置
    if (rotation.value === 90 || rotation.value === 270) {
      ctx.drawImage(
        imageRef.value,
        (-imgHeight * scale) / 2,
        (-imgWidth * scale) / 2,
        imgHeight * scale,
        imgWidth * scale
      );
    } else {
      ctx.drawImage(
        imageRef.value,
        (-imgWidth * scale) / 2,
        (-imgHeight * scale) / 2,
        imgWidth * scale,
        imgHeight * scale
      );
    }

    ctx.restore();
  }
}

const drawFullImage = () => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");

  if (canvas && imageRef.value) {
    // 根据图片尺寸调整canvas尺寸
    let rotated = rotation.value % 180 !== 0;
    canvas.width = rotated
      ? imageRef.value.naturalHeight
      : imageRef.value.naturalWidth;
    canvas.height = rotated
      ? imageRef.value.naturalWidth
      : imageRef.value.naturalHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation.value * Math.PI) / 180);
    ctx.drawImage(
      imageRef.value,
      -imageRef.value.naturalWidth / 2,
      -imageRef.value.naturalHeight / 2
    );
    ctx.restore();
  }
};

function downloadPdf() {
  const canvas = canvasRef.value;
  const rotated = rotation.value % 180 === 0 ? "landscape" : "portrait";

  autoOrientation.value =
    canvas.width > canvas.height ? "landscape" : "portrait";

  if (canvas) {
    const pdf = new jsPDF({
      // orientation: autoOrientation.value,
      orientation:
        selectedPageSize.value === "无" ? rotated : autoOrientation.value,
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(
      canvas.toDataURL("image/jpeg"),
      "JPG",
      0,
      0,
      canvas.width,
      canvas.height
    );
    // pdf.save("download.pdf");
    pdf.save(`${pdf_filename.value}.pdf`);
  }
}

const convertImg = async (file, canvas_element = null) => {
  // return new Promise((resolve, reject) => {
  // 图像的Base64编码数据
  try {
    const base64ImageSrc = file.base64;
    let naturalWidth;
    let naturalHeight;
    let rotation = file.imgRotation % 180 !== 0;
    let Orientation = file.imgRotation;
    let width;
    let height;
    const img = await createImg(base64ImageSrc);

    // 创建一个脱离DOM的canvas元素
    let canvas = canvas_element;
    if (!canvas) {
      canvas = document.createElement("canvas");
    }
    // 设置canvas的宽度和高度为图像的尺寸，确保图像完整显示
    naturalWidth = img.naturalWidth;
    naturalHeight = img.naturalHeight;
    width = rotation ? naturalHeight : naturalWidth;
    height = rotation ? naturalWidth : naturalHeight;

    canvas.width = width;
    canvas.height = height;
    // 获取canvas的2D渲染上下文
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Orientation * Math.PI) / 180);
    // 在canvas上绘制图像
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();
    return canvas;
  } catch (err) {
    throw err; // 抛出异常
  }
};

const convertPdf = async (file, canvas_element = null) => {
  try {
    // 图像的Base64编码数据
    const base64ImageSrc = file.base64;
    let width;
    let height;
    let canvas = canvas_element;
    // 创建一个Image对象
    const img = await createImg(base64ImageSrc);
    // 创建一个脱离DOM的canvas元素
    if (!canvas) {
      canvas = document.createElement("canvas");
    }
    const ctx = canvas.getContext("2d");
    const page = paperSize.value.find((p) => p.value === file.pdfPageSize);
    const isPortrait = file.pdfRotation === "portrait";
    width = isPortrait ? page.width * 2 : page.height * 2;
    height = isPortrait ? page.height * 2 : page.width * 2;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rotated = file.imgRotation % 180 !== 0;
    // 设置canvas的宽度和高度为图像的尺寸，确保图像完整显示
    const imgWidth = rotated ? img.naturalHeight : img.naturalWidth;
    const imgHeight = rotated ? img.naturalWidth : img.naturalHeight;
    // 计算缩放比例
    const scaleX = canvas.width / imgWidth;
    const scaleY = canvas.height / imgHeight;
    const scale = Math.min(scaleX, scaleY);
    // 计算旋转后的图片中心点
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(centerX, centerY);
    ctx.rotate((file.imgRotation * Math.PI) / 180);
    // 根据旋转角度调整图片绘制位置
    if (file.imgRotation === 90 || file.imgRotation === 270) {
      ctx.drawImage(
        img,
        (-imgHeight * scale) / 2,
        (-imgWidth * scale) / 2,
        imgHeight * scale,
        imgWidth * scale
      );
    } else {
      ctx.drawImage(
        img,
        (-imgWidth * scale) / 2,
        (-imgHeight * scale) / 2,
        imgWidth * scale,
        imgHeight * scale
      );
    }

    ctx.restore();
    // 解析Promise并返回结果
    return canvas;
  } catch (err) {
    throw err; // 抛出异常
  }
};

const test = (file = null) => {
  if (!file) {
    file = fileList.value[0];
  }
  convertFile(file).then((canvas) => {
    canvasRef.value = canvas;
  });
};
const convertFile = async (file) => {
  // try {
  // Base64 encoded image data from the file
  const base64ImageSrc = file.base64;
  // Create an Image object
  const img = await createImg(base64ImageSrc);
  // Create a detached DOM canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let naturalWidth, naturalHeight;
  let width, height;
  let rotated = file.imgRotation % 180 !== 0;
  let scaleX, scaleY, scale;
  let centerX, centerY;

  // If the function is called for PDF conversion
  if (file.pdfPageSize && file.pdfPageSize !== "无") {
    const page = paperSize.value.find((p) => p.value === file.pdfPageSize);
    const isPortrait = file.pdfRotation === "portrait";
    width = isPortrait ? page.width * 2 : page.height * 2;
    height = isPortrait ? page.height * 2 : page.width * 2;

    scaleX = width / (rotated ? img.naturalHeight : img.naturalWidth);
    scaleY = height / (rotated ? img.naturalWidth : img.naturalHeight);
    scale = Math.min(scaleX, scaleY);
  } else {
    // If the function is called for Image conversion
    width = rotated ? img.naturalHeight : img.naturalWidth;
    height = rotated ? img.naturalWidth : img.naturalHeight;
    // No scaling is applied for simple image conversion
    scale = 1;
  }
  centerX = width / 2;
  centerY = height / 2;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set white background for PDF
  // if (file.pdfPageSize) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // }

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((file.imgRotation * Math.PI) / 180);

  // Adjust image position based on rotation
  if (rotated) {
    ctx.drawImage(
      img,
      (-height * scale) / 2,
      (-width * scale) / 2,
      height * scale,
      width * scale
    );
  } else {
    ctx.drawImage(
      img,
      (-width * scale) / 2,
      (-height * scale) / 2,
      width * scale,
      height * scale
    );
  }

  ctx.restore();
  return canvas;
  // }
  // catch (error) {
  //   throw error;
  // }
};

// 打包下载
async function downloadEachCanvasAsPdf() {
  const zip = new JSZip();

  // 遍历canvas列表，每个canvas生成一个PDF文件，并添加到zip中
  for (let index = 0; index < fileList.value.length; index++) {
    const file = fileList.value[index];
    if (!file.isChecked) continue;

    let canvas =
      file.pdfPageSize !== "无"
        ? await convertPdf(file)
        : await convertImg(file);
    // console.log(file, 6);
    const rotated = file.imgRotation % 180 === 0 ? "portrait" : "landscape";

    const pdf = new jsPDF({
      orientation: file.pdfRotation === "无" ? rotated : file.pdfRotation,
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "JPG",
      0,
      0,
      canvas.width,
      canvas.height
    );

    // 将PDF内容转为二进制并添加到zip中
    const pdfBinary = pdf.output("arraybuffer");
    zip.file(`pdfFilenames${[index]}.pdf`, pdfBinary);
  }

  // 生成zip文件并触发下载
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // 使用文件保存功能触发下载
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "all_canvas_pdfs.zip";
    link.click();
  });
}

// 合并下载
async function downloadMultipleCanvasInOnePdf() {
  // 创建PDF文档实例，初始化为第一个canvas的方向和大小
  const rotated =
    fileList.value[0].imgRotation % 180 === 0 ? "portrait" : "landscape";

  let finalRotated =
    fileList.value[0].pdfRotation === "无"
      ? rotated
      : fileList.value[0].pdfRotation;
  // console.log(rotated);
  const firstCanvas = await convertPdf(fileList.value[0]);
  const pdf = new jsPDF({
    orientation: finalRotated,
    unit: "px",
    format: [firstCanvas.width, firstCanvas.height],
  });

  // 遍历canvas列表，每个canvas添加到新的一页
  for (let index = 0; index < fileList.value.length; index++) {
    const file = fileList.value[index];
    if (!file.isChecked) continue;
    let canvas =
      file.pdfPageSize !== "无"
        ? await convertPdf(file)
        : await convertImg(file);
    if (index > 0) {
      // 如果不是第一个canvas，添加新页
      pdf.addPage([canvas.width, canvas.height], finalRotated);
    }
    pdf.addImage(
      canvas.toDataURL("image/jpeg"),
      "JPG",
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  // 保存PDF文件
  pdf.save(`pdfFilename${1}.pdf`);
}
</script>

<style scoped>
* {
  /* border-radius: unset !important; */
  box-sizing: border-box;
}
.img2pdf_container * {
  user-select: none;
}
.img2pdf_container {
  position: relative;
  width: 1100px;
  height: 700px;
  width: 970px;
  height: 650px;
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
  max-width: 50%;
  width: 50%;
  max-width: 800px;
  height: 100%;
  transform: translate(-5rem, 0);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-items: center; */
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
.misc {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-uploader {
  /* max-width: 100%;
  max-height: 100%; */
  text-align: center;
}
:deep()
  .ant-upload-wrapper.ant-upload-picture-card-wrapper
  .ant-upload.ant-upload-select {
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  background-color: #fff;
}
.img-uploader img {
  max-width: 100%;
  max-height: 100%;
  background-color: #fff;
}
.pdf-canvas {
  max-height: 100%;
  max-width: 100%;
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.2);
}
:deep() .action-column {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px; /* 根据需要调整内边距 */
}

.grid-layout {
  width: 100%;
  margin-top: 8px;
  display: grid;
  grid-template-columns: 50px 50px 50px 50px 50px;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 8px;
  flex: 1;
  overflow-y: scroll;
  /* background: #69c3ff; */
  /* box-shadow: inset 0px 0px 14px rgb(0 0 0 / 21%); */
  padding: 8px;
  justify-content: center;
  align-items: center;
}
/* 隐藏滚动条 */
.grid-layout::-webkit-scrollbar {
  display: none;
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* padding: .5rem; */
  min-height: 70px;
  height: 100%;
  /* height: fit-content; */
  /* box-shadow: 0.2px 0.2px 0.4px #000; */
  cursor: pointer;

  /* border-radius: 8px; */
}
:deep() .ant-image .ant-image-img,
img {
  max-width: 100%;
  max-height: 100%;
}
.img-item {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  /* object-fit: cover; */
}
.preview-item:hover .item-remove {
  display: block;
  /* object-fit: cover; */
}
.preview-item:hover {
  /* border: #464646 2px solid; */
  box-shadow: 0 0 0 2px rgb(0 0 0 / 100%);
  /* 外边框 */
}
.item-checkbox {
  position: absolute;
  left: 0;
  top: 0;
}

.item-remove {
  display: none;
  position: absolute;
  left: 0;
  bottom: 0;
}
:deep() .ant-checkbox-group {
  cursor: unset;
}

/* ---------------------- */
@media screen and (max-width: 700px) {
  .img2pdf_container {
    width: unset ;
    height: unset;
    margin: unset;
    background-image: unset;
    box-shadow: none;
    padding:  1rem;
  }
  .content {
display: none;
  }
  .sider{
    transform:unset;
    width:100%;
  }
}
</style>
