<template>
  <context-holder />
  <!-- <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Title"
    sub-title="This is a subtitle"
    @back="() => null"
  /> -->
  <div class="yuqueText">
    <img
      src="https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*FhCOSJBrQaoAAAAAAAAAAAAADvuFAQ/original"
    />
  </div>
  <a-flex class="menu" align="center">
    <a-upload
      :before-upload="beforeUpload"
      @change="handleUpload"
      :showUploadList="false"
    >
      <a-button type="text"> <FileAddOutlined />打开 </a-button>
    </a-upload>
    <a-button type="text" @click="toggleFullscreen">
      <FileAddOutlined />全屏
    </a-button>
  </a-flex>
  <a-row class="conv—layout" justify="center">
    <a-col class="conv-left">
      <div class="conv-canvas-context">
        <canvas ref="canvasRef" id="canvas"></canvas>
      </div>
    </a-col>
    <a-col class="conv-right">
      <div class="conv-edit">
        <!-- 两个输入框对应图片宽和高-->
        <div class="conv-rule">
          <a-tabs @change="handleTabsChange" centered>
            <a-tab-pane
              class="conv-rule-tab"
              key="1"
              tab="倍数缩小"
              force-render
            >
              <a-radio-group
                class="conv-rule-option"
                v-model:value="currentScale"
                @change="handleScaleChange"
              >
                <a-radio
                  v-for="item in Scale"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.value }}
                </a-radio>
              </a-radio-group>
            </a-tab-pane>
            <a-tab-pane key="2" tab="百分比" class="conv-rule-tab">
              <a-row :gutter="8">
                <a-col :span="12">
                  <a-slider
                    v-model:value="imgPercentage"
                    :min="0.01"
                    :max="1"
                    :step="0.01"
                    :tip-formatter="formatter"
                    @afterChange="sliderChange"
                  >
                  </a-slider>
                </a-col>
                <a-col :span="4">
                  <a-input-number
                    v-model:value="imgPercentage"
                    :min="0.01"
                    :max="1"
                    :step="0.01"
                  />
                </a-col>
              </a-row>
              <a-tag>{{ Scale[0]?.width }} * {{ Scale[0]?.height }}</a-tag
              >->
              <a-tag color="green"
                >{{ imgWidth_def }} * {{ imgHeight_def }}</a-tag
              >
            </a-tab-pane>
          </a-tabs>

          <!-- 图片格式选择 -->
          <a-space size="8" direction="vertical" class="conv-settings">
            <div>
              <a-row :gutter="8">
                <a-col :span="12">
                  <label>自定义宽度:</label>
                  <a-input
                    type="number"
                    id="widthInput"
                    v-model:value="imgWidth"
                    @blur="handleInputBlur"
                  />
                </a-col>
                <a-col :span="12">
                  <label>自定义高度:</label>
                  <a-input
                    type="number"
                    id="heightInput"
                    @blur="handleInputBlur"
                    v-model:value="imgHeight"
                  />
                </a-col>
              </a-row>

              <label for="formatSelect">图片格式:</label>
              <a-radio-group
                class="conv-fmt-option"
                v-model:value="format"
                :options="formatOptions"
                @change="formatChange"
              />

              <a-button
                :disabled="!image"
                block
                id="download"
                @click="download"
                shape="round"
                type="primary"
              >
                <template #icon> <DownloadOutlined /> </template>下载图片{{ imgResultSize?'（'+imgResultSize+'kb）':"" }}
              </a-button>
              <!-- </a-space> -->
            </div>
          </a-space>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { FileAddOutlined, DownloadOutlined } from "@ant-design/icons-vue";
import { useFullscreenStore } from "@/store/fullscreen.js";
// import png from "./result.png";
const [messageApi, contextHolder] = message.useMessage();
const formatOptions = [
  { label: "JPG", value: "jpg" },
  { label: "JPEG", value: "jpeg" },
  { label: "WEBP", value: "webp" },
  { label: "PNG", value: "png" },
  { label: "GIF", value: "gif" },
  { label: "ICO", value: "ico" },
];
const format = ref("jpeg");
const imgWidth = ref(200);
const imgHeight = ref(200);
// const file = ref(null);
const imgPercentage = ref(1);

const currentScale = ref(1);
const Scale = ref([
  { num: 1, width: 1200, height: 1200, value: "原图" },
  { num: 2, width: 600, height: 600, value: "2倍" },
  { num: 3, width: 400, height: 400, value: "3倍" },
  { num: 4, width: 300, height: 300, value: "4倍" },
  { num: 6, width: 200, height: 200, value: "6倍" },
]);
const imgWidth_def = computed(() => {
  imgWidth.value = parseInt(
    imgPercentage.value * (Scale.value[0]?.width || imgWidth.value)
  );
  return parseInt(
    imgPercentage.value * (Scale.value[0]?.width || imgWidth.value)
  );
});
const imgHeight_def = computed(() => {
  imgHeight.value = parseInt(
    imgPercentage.value * (Scale.value[0]?.height || imgHeight.value)
  );
  return parseInt(
    imgPercentage.value * (Scale.value[0]?.height || imgHeight.value)
  );
});
const currentTab = ref("1");

function handleTabsChange(activeKey) {
  // console.log(typeof activeKey);
  currentTab.value = activeKey;
}
const formatter = (value) => {
  // const newWidth = Math.round(imgWidth.value * parseFloat(value));
  // const newHeight = Math.round(imgHeight.value * parseFloat(value));
  // imgWidth.value = newWidth;
  // imgHeight.value = newHeight;
  // console.log(imgWidth_def, imgHeight_def.value);
  // bai.value = value;

  return `${value}倍`;
};
const fileName = ref(null);
const previewUrl = ref(null);
const base64String = ref(null);
const canvasRef = ref(null); // Canvas元素引用
const image = ref(null); // 图片引用
let uploadImage = null; // 上传的图片文件
const canvasToDataUrl=ref(null);
const imgResultSize=ref(null);

// image.value = new Image();
// image.value.onload = () => {
//    image.value.src=png
// };

const beforeUpload = (file) => {
  fileName.value = file.name.split(".")[0];
  // console.log(fileName.value);
  // 检查文件类型，只允许上传图片文件
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("只能上传图片文件！");
    return false; // 阻止文件上传
  }
  uploadImage = file; // 保存上传的图片文件
  return true; // 允许文件上传
};

const handleUpload = () => {
  if (uploadImage) {
    // 创建Image对象并设置src为上传的图片文件的URL
    image.value = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = reader.result;
      base64String.value = reader.result;
      image.value.onload = () => {
        console.log("图片加载完成");
        imgWidth.value = image.value.width;
        imgHeight.value = image.value.height;
        Scale.value.forEach((obj) => {
          if (obj.num === 1) {
            obj.width = image.value.width;
            obj.height = image.value.height;
            obj.value = "原图：" + obj.width + " * " + obj.height;
          } else {
            // 在这里为每个对象的width和height属性赋值
            // 例如，可以根据num的值来设定不同的width和height
            obj.width = parseInt(image.value.width / obj.num);
            obj.height = parseInt(image.value.height / obj.num);
            obj.value = obj.num + "倍：" + obj.width + " * " + obj.height;
          }
        });
        // 图片加载完成后执行的操作，例如绘制到Canvas上
        loadImage();
      };
      image.value.src = e.target.result; // 设置图片的src属性为上传的图片文件的URL
    };
    reader.readAsDataURL(uploadImage); // 将文件读取为DataURL格式的数据
    return false; // 阻止上传
  }
};

const loadImage = () => {
  if (image.value && canvasRef.value) {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d"); // 获取Canvas的上下文对象
    if (ctx) {
      // canvas.width = imgWidth.value; // 设置Canvas的宽度为输入的宽度值
      // canvas.height = imgWidth.value; // 设置Canvas的高度为输入的高度值
      var width = imgWidth.value;
      var height = imgHeight.value;
      // 根据原始图片宽高比计算高度
      // canvas.width = 200; // 设置宽度为200px
      if (width == "" && height == "") {
        // 提示消息
        // alert("请先输入图片宽高");
        width = image.width;
        height = image.height;
      } else {
        if (height == "") {
          height = (width * image.height) / image.width;
        }
        if (width == "") {
          width = (height * image.width) / image.height;
        }
      }
      canvas.width =
        currentTab.value === "1" ? imgWidth.value : imgWidth_def.value; // 设置宽度为200px
      // canvas.height = (width * img.height) / img.width;
      canvas.height =
        currentTab.value === "1" ? imgHeight.value : imgHeight_def.value;
      // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(image.value, 0, 0, canvas.width, canvas.height); // 将图片绘制到Canvas上，指定目标位置和尺寸
      message.success(`当前像素：${width} x ${height},大小：${getResultImgSize()}kb`);
      
    } else {
      alert("Canvas上下文对象获取失败！");
    }
  } else {
    alert("请先选择一个图片文件并输入宽度和高度！");
  }
};
function handleScaleChange(e) {
  // console.log(e);
  // 从事件对象中获取被选中的值
  const selectedItem = Scale.value.find(
    (item) => item.value === currentScale.value
  );
  // 将 width 和 height 分别赋值给不同的变量
  imgWidth.value = selectedItem?.width;
  imgHeight.value = selectedItem?.height;
  // console.log(currentScale.value, Scale.value, imgWidth.value, imgHeight.value);
  loadImage();
}
const formatChange = (value) => {
   console.log(getResultImgSize());
  
};
const sliderChange = () => {
  // console.log(sliderValue.value);
  loadImage();
};
const getResultImgSize=()=>{
  canvasToDataUrl.value=canvas.toDataURL(`image/${format.value}`);
  var base64String = canvasToDataUrl.value.split(",")[1];
  var byteLength = base64String.length * (3 / 4); // 每4个base64字符转换成3个字节
  // 将字节转换为千字节
  var sizeInKilobytes = byteLength / 1024;
  imgResultSize.value = sizeInKilobytes.toFixed(2);
  // console.log("图像大小约为: " + sizeInKilobytes.toFixed(2) + "KB");
  // 返回图像大小
  return sizeInKilobytes.toFixed(2);
}
// 传入canvas.toDataURL将图片下载到本地
const download = () => {
  // return;
  var a = document.createElement("a");

  // a.href = dataURL;
  a.href =canvasToDataUrl.value;
  a.download = fileName.value + "." + format.value;
  a.click();
};
// 宽和高输入框失焦后获取图片宽高;
const handleInputBlur = () => {
  let width = imgWidth.value;
  let height = imgHeight.value;
  if (width != "" || width || height != "" || height) {
    // readFile();
  }
  // loadImage()
};
const base642img = () => {
  previewUrl.value = base64String.value;
  message.success("Ok");
};
const img2base64 = () => {
  base64String.value = previewUrl.value;
  message.success("Ok");
};

const fullscreenStore = useFullscreenStore();
const isFullscreen = computed(() => {
  return fullscreenStore.isFullscreen;
});
const toggleFullscreen = () => {
  fullscreenStore.toggleFullscreen();
};
</script>

<style scoped>
.fullscreen {
  position: fixed;
  /* 或使用 absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  /* 示例背景色 */
}
.yuqueText {
  margin: 30px 0;
  text-align: center;
}
.menu {
  padding: 0 38px;
  height: 48px;
}
.conv—layout {
  max-width: 1140px;
  margin: 0 auto;
}
.conv-left {
  position: relative;
  overflow: hidden;
  padding: 40px;
  width: 70%;
  min-width: 700px;
  height: 600px;
  border-radius: 38px 0 0 38px;
  background-image: linear-gradient(
    124deg,
    rgb(248 255 200) 1%,
    rgb(255 176 218) 72%
  );
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}
.conv-canvas-context {
  width: 100%;
  height: 100%;
  /* background: url(https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*1QNFQ7WfIqcAAAAAAAAAAAAADvuFAQ/original)
            no-repeat; */
  background-position-y: 100%;
  background-size: contain;
  border: unset;
  display: flex;
  justify-content: center;
  align-items: center;
}
#canvas {
  max-width: 100%;
  max-height: 100%;
}
.conv-right {
  position: relative;
  overflow: hidden;
  padding: 40px 0 0;
  width: 30%;
  min-width: 300px;
  height: 600px;
  border-radius: 0 38px 38px 0;
  background-image: linear-gradient(
    136deg,
    rgb(241 246 255),
    rgb(162, 214, 255) 95%
  );
  background-image: linear-gradient(
    136deg,
    rgb(241, 246, 255),
    rgb(255 232 232) 95%
  );
  box-shadow: -10px 0px 25px -25px;
}
.conv-edit {
  width: 100%;
  height: 100%;
  /* background: url(https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*NIN0SL3TULgAAAAAAAAAAAAADvuFAQ/original)
            no-repeat; */
  background-position-x: right;
  background-position-y: 100%;
  background-size: 406px 251px;
  border: unset;
}
.conv-rule {
  display: flex;
  flex-direction: column;
}
.conv-rule-tab {
  padding: 0 1rem;
}
.conv-rule-option {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.conv-settings {
  padding: 1rem;
}
.conv-fmt-option {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
