<template>
  <section class="qr">
    <a-upload-dragger
        :showUploadList="false"
        v-model:fileList="fileList"
        name="file"
        @preview="handlePreview"
        :multiple="true"
        :before-upload="beforeUpload"
      >
        <p class="ant-upload-drag-icon">
          <!-- <inbox-outlined></inbox-outlined> -->
          <FileImageOutlined />
        </p>
        <h2 class="ant-upload-text">单击或拖动文件到此区域进行处理</h2>
        <p class="ant-upload-hint">
          支持单次或批量选择，不上传服务器本地处理，速度取决于你的设备。
        </p>
      </a-upload-dragger>
    <a-form
      :layout="formState.layout"
      :model="formState"
      v-bind="formItemLayout"
    >
      <a-form-item label="布局">
        <!-- <a-segmented v-model:value="formState.layout" :options="['水平','垂直','Inline']" /> -->
        <a-radio-group v-model:value="formState.layout">
          <a-radio-button value="horizontal">水平</a-radio-button>
          <a-radio-button value="vertical">垂直</a-radio-button>
          <a-radio-button value="inline">Inline</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="字段 A">
        <a-input
          v-model:value="formState.fieldA"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item label="字段 B">
        <a-input
          v-model:value="formState.fieldB"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item label="容错率L/M/Q/H">
        <a-input
          v-model:value="formState.errorLevel"
          placeholder="二维码类型"
        />
      </a-form-item>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-button type="primary" @click="submitForm">提交</a-button>
      </a-form-item>
    </a-form>
    <div>
      <img ref="qrcodeRef" :src="qrcodeUrl" alt="QR Code" />
    </div>
    <a-alert
      :message="qrcode_info"
      v-if="qrcode_info"
      closable
      :after-close="handleClose"
    />
    <a-button type="primary" @click="get_qr_info">扫描二维码</a-button>
    <a-button type="primary" @click="dowloadChange((type = 'js'))"
      >下载</a-button
    >
    <div v-if="scanResult">
      <h3>扫描结果：</h3>
      <p>{{ scanResult }}</p>
    </div>

    <a-qrcode
      :value="text"
      error-level="H"
      type="svg"
      icon="https://www.antdv.com/assets/logo.1ef800a8.svg"
    />
    <a-qrcode ref="qrcodeCanvasRef" :value="data" error-level="L" />
    <a-button type="primary" @click="dowloadChange">下载</a-button>
  </section>
</template>

<script setup>
// npm install jsqr
// npm install qrcode
// //npm install qrcode-svg
import { ref, reactive, computed, watch } from "vue";
import QRCode from "qrcode";
// import QRCodeSVG from "qrcode-svg";
import jsQR from "jsqr";
const qrcodeUrl = ref(null);
const formState = reactive({
  layout: "horizontal",
  errorLevel: "L",
  fieldA: "value1",
  fieldB: "value2",
});

// const options = {
//   //   width: 200,
//   //   height: 200,
//   color: {
//     dark: "#000000", // 黑色
//     light: "#ffffff", // 白色
//   },
//   background: "#ffffff", // 白色背景
//   type: "image/png",
//   quality: 1,
//   margin: 1,
//   errorCorrectionLevel: formState.errorLevel,
// };
const text = ref("test");
const data = ref("");
watch(
  formState,
  (newValue, oldValue) => {
    // console.log(`fieldA changed from ${oldValue.fieldA} to ${newValue.fieldA}`);
    // console.log(`fieldB changed from ${oldValue.fieldB} to ${newValue.fieldB}`);
    // 将对象转换为JSON字符串
    data.value = JSON.stringify(formState);
    // 生成二维码并将其绑定到变量
    QRCode.toDataURL(
      data.value,
      { errorCorrectionLevel: formState.errorLevel },
      function (err, url) {
        if (err) console.error(err);
        qrcodeUrl.value = url;
      }
    );
  },
  { immediate: true }
);

const qrcodeCanvasRef = ref();

// 扫描二维码
const qrcode_info = ref(null);
const scanResult = ref(null);
const qrcodeRef = ref();
function handleClose() {
  qrcode_info.value = null;
}
const get_qr_info = () => {
  const img = qrcodeRef.value; // 使用获取img元素的引用
  //   console.log(img);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);

  if (code) {
    console.log("扫描结果:", code.data);
    qrcode_info.value = code.data;
    scanResult.value = code.data;
    // 在这里可以处理扫描到的二维码信息
  } else {
    console.log("没有找到二维码");
  }
};

// 下载二维码
const dowloadChange = async (type) => {
  // console.log(qrcodeCanvasRef.value);
  // return
  let url = await qrcodeCanvasRef.value.toDataURL();
  if (type === "js") {
    // 创建一个可下载的图片链接
    url = qrcodeUrl.value;
  }
  const a = document.createElement("a");
  a.download = "QRCode.png";
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const formItemLayout = computed(() => {
  const { layout } = formState;
  return layout === "水平"
    ? {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
      }
    : {};
});
const buttonItemLayout = computed(() => {
  const { layout } = formState;
  return layout === "水平"
    ? {
        wrapperCol: {
          span: 14,
          offset: 4,
        },
      }
    : {};
});
const submitForm = () => {
  console.log(formState);
};
</script>

<style>
.qr {
  padding: 1rem;
}
</style>
