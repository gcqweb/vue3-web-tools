<template>
  <section class="img-conv-fmt">
    <a-flex class="menu" align="center">
      <a-upload :before-upload="beforeUpload" :showUploadList="false">
        <a-button type="text"> <FileAddOutlined />打开 </a-button>
      </a-upload>
      <a-button type="text" @click="toggleFullscreen">
        <FullscreenOutlined />全屏</a-button
      >
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
                  <template #icon> <DownloadOutlined /> </template>下载图片{{
                    imgResultSize ? "（" + imgResultSize + "kb）" : ""
                  }}
                </a-button>
                <!-- </a-space> -->
              </div>
            </a-space>
          </div>
        </div>
      </a-col>
    </a-row>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import {
  FileAddOutlined,
  DownloadOutlined,
  FullscreenOutlined,
} from "@ant-design/icons-vue";
import { useFullscreenStore } from "@/store/fullscreen.js";

const format = ref("jpeg");
const imgWidth = ref(200);
const imgHeight = ref(200);
const imgPercentage = ref(1);
const currentTab = ref("1");
const fileName = ref(null);
const canvasRef = ref(null); // Canvas元素引用
const image = ref(null); // 图片引用
const canvasToDataUrl = ref(null);
const imgResultSize = ref(null);
const aspectRatio = ref(1);

const currentScale = ref("原图");
const Scale = ref([
  { num: 1, width: 1200, height: 1200, value: "原图" },
  { num: 2, width: 600, height: 600, value: "2倍" },
  { num: 3, width: 400, height: 400, value: "3倍" },
  { num: 4, width: 300, height: 300, value: "4倍" },
  { num: 6, width: 200, height: 200, value: "6倍" },
]);

const formatOptions = [
  // { label: "JPG", value: "jpg" },
  { label: "JPEG", value: "jpeg" },
  { label: "WEBP", value: "webp" },
  { label: "PNG", value: "png" },
  // { label: "GIF", value: "gif" },
  // { label: "ICO", value: "ico" },
];

const imgWidth_def = computed(() =>
  parseInt(imgPercentage.value * (Scale.value[0]?.width || imgWidth.value))
);

const imgHeight_def = computed(() =>
  parseInt(imgPercentage.value * (Scale.value[0]?.height || imgHeight.value))
);

function handleTabsChange(activeKey) {
  currentTab.value = activeKey;
}
const formatter = (value) => `${value}倍`;

const beforeUpload = (file) => {
  fileName.value = file.name.split(".")[0];
  // 检查文件类型，只允许上传图片文件
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("只能上传图片文件！");
    return false; // 不允许文件上传
  }

  // 创建Image对象并设置src为上传的图片文件的URL
  image.value = new Image();
  const reader = new FileReader();
  reader.onload = (e) => {
    image.value.onload = () => {
      console.log("图片加载完成");
      imgWidth.value = image.value.width;
      imgHeight.value = image.value.height;
      aspectRatio.value = image.value.width / image.value.height;
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
  reader.readAsDataURL(file); // 将文件读取为DataURL格式的数据

  return false; // 不允许文件上传
};

const loadImage = () => {
  if (image.value && canvasRef.value) {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const width =
        currentTab.value === "1" ? imgWidth.value : imgWidth_def.value;
      const height =
        currentTab.value === "1" ? imgHeight.value : imgHeight_def.value;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image.value, 0, 0, width, height);
      message.success(
        `当前像素：${width} x ${height}, 大小：${getResultImgSize()}kb`
      );
    } else {
      message.error("错误读取Canvas上下文对象！");
    }
  }
  // else {
  //   message.error("没找到图片！");
  // }
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
  getResultImgSize();
};
const sliderChange = () => {
  // console.log(sliderValue.value);
  loadImage();
};

const getResultImgSize = () => {
  if (!canvasRef.value) return;
  canvasToDataUrl.value = canvasRef.value.toDataURL(`image/${format.value}`);
  const base64String = canvasToDataUrl.value.split(",")[1];
  const byteLength = base64String.length * (3 / 4);
  const sizeInKilobytes = byteLength / 1024;
  imgResultSize.value = sizeInKilobytes.toFixed(2);
  return imgResultSize.value;
};

const download = () => {
  if (canvasToDataUrl.value) {
    const link = document.createElement("a");
    link.href = canvasToDataUrl.value;
    link.download = `${fileName.value}_${imgWidth.value}x${imgHeight.value}.${format.value}`;
    link.click();
  } else {
    message.error("请先上传图片！");
  }
};

const handleInputBlur = (event) => {
  const { value, id } = event.target;
  const intValue = parseInt(value);
  if (!isNaN(intValue) && intValue > 0) {
    if (id === "widthInput") {
      imgWidth.value = intValue;
      imgHeight.value = Math.round(intValue / aspectRatio.value);
    } else if (id === "heightInput") {
      imgHeight.value = intValue;
      imgWidth.value = Math.round(intValue * aspectRatio.value);
    }
    loadImage();
  } else {
    message.error("请输入一个有效的正整数！");
  }
};

const toggleFullscreen = () => {
  const fullscreenStore = useFullscreenStore();
  fullscreenStore.toggleFullscreen();
};
</script>

<style scoped>
.img-conv-fmt {
  max-width: 100%;
  padding: 1rem;
}
.fullscreen {
  position: fixed;
  /* 或使用 absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;

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
    rgb(248 255 200 / 50%) 1%,
    rgb(255 176 218 / 50%) 72%
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
