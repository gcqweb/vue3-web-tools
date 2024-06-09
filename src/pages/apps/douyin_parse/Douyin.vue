<template>
  <section class="dy-parse">
    <div class="layout">
      <a-typography-title :level="1" class="title">抖音解析</a-typography-title>
      <p>支持 抖音 / 快手<span style="font-size: 12px;">（手机端）</span> 短视频、图集解析和下载</p>
      <a-input
        class="url_input is-sticky"
        v-model:value="link_url"
        placeholder="请输入 抖音 / 快手 分享链接"
        size="large"
        allow-clear
        @pressEnter="parseHandle"
      >
        <template #addonAfter>
          <span @click="parseHandle" class="input_submit">
            <ExperimentOutlined /> 解析</span
          >
        </template>
      </a-input>

      <a-divider />
      <a-spin v-if="loading" size="large" />
      <p v-else>{{ parse_data.desc }}</p>

      <div class="video_layout" v-show="parse_data.type === 'video'">
        <video :src="video_url" controls class="video-container"></video>
        <!-- <div ref="videoContainer" class="video-container"></div> -->
      </div>

      <div
        v-show="parse_data.type === 'images'"
        style="top: 150px"
        class="is-sticky"
      >
        <div class="actions">
          <a-space>
            <a-button @click="selectAllItems">全选</a-button>
            <a-button @click="invertSelection">反选</a-button>
            <a-button shape="round" type="primary" @click="downloadFn('bat')">
              <template #icon>
                <DownloadOutlined />
              </template>
              批量下载</a-button
            >
          </a-space>
        </div>
      </div>
      <div class="images_layout" v-if="parse_data.type === 'images'">
        <a-image-preview-group>
          <!-- <div > -->
          <a-image
            alt="example"
            :src="item"
            class="img_card"
            v-for="(item, index) in parse_data.urls"
          >
            <!-- src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" -->
            <template #previewMask>
              <a-button
                block
                type="primary"
                class="download_btn"
                @click.stop="downloadFn(index)"
                >下载</a-button
              >
              <a-checkbox
                class="checkbox"
                v-model:checked="checkedImages[index]"
                @click.stop=""
              ></a-checkbox>
            </template>
          </a-image>
        </a-image-preview-group>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
// import "xgplayer/dist/index.min.css";
// import Player from "xgplayer";
import axios from "axios";
//   import mp4 from "./a.mp4";
import { message } from "ant-design-vue";
import {
  DownloadOutlined,
  // CloudSyncOutlined,
  // ThunderboltOutlined,
  ExperimentOutlined,
} from "@ant-design/icons-vue";
// import { notification } from "ant-design-vue";

// const videoContainer = ref(null);
// const player = ref(null);
const link_url = ref("");
const video_url = ref("");
const parse_data = reactive({ urls: [], type: "", desc: "", format: "" });
const loading = ref(false);
const checkAll = ref(false);
// 创建一个响应式对象以跟踪复选框的状态
const checkedImages = reactive(Array(parse_data.urls.length).fill(false));
watch(
  () => parse_data.urls.length,
  (newLength, oldLength) => {
    // 当 parse_data.urls 的长度发生变化时，更新 checkedImages 的长度
    checkedImages.length = newLength;
    // 如果新长度大于旧长度，填充新的位置为 false
    if (newLength > oldLength) {
      checkedImages.fill(false, oldLength);
    }
  }
);
// onMounted(() => {
//   player.value = new Player({
//     el: videoContainer.value,
//     // url: mp4,
//     // url: video_url.value,
//     url: video_url.value,
//     width: "600px",
//     height: "337px",
//     autoplay: false, //自动播放
//     miniprogress: true, //迷你进度条
//     screenShot: true, //截图
//     download: true, //下载
//     keyShortcut: true, //快捷键
//     playnext: true,
//     // commonStyle: {
//     //   // 进度条底色
//     //   progressColor: '#ff6600',
//     //   // 播放完成部分进度条底色
//     //   playedColor: 'FF1100',
//     //   // 缓存部分进度条底色
//     //   cachedColor: '',
//     //   // 进度条滑块样式
//     //   sliderBtnStyle: {},
//     //   // 音量颜色
//     //   volumeColor: '#ff9900'
//     // },
//     // controls: true,
//   });

//   // 离开页面暂停播放
//   window.addEventListener("beforeunload", () => {
//     player.value && player.value.pause();
//   });
// });

// onUnmounted(() => {
//   player.value && player.value.destroy();
// });

// const Fn = () => {};
function getShareLink(string) {
  // 使用正则表达式查找匹配的链接
  let link = string.match(
    /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/
  );
  if (link) {
    return link[0];
  }
  return null; // 如果未找到链接则返回 null
}
const get_parse_mode=(url)=>{
  // link="https://api./gcqweb/dy"
  // link="http://fastapi-q00d.fcv3.1609541690181973.cn-hangzhou.fc.devsapp.net/gcqweb/"
  // let link="https://tool.gcqweb.cn/gcqweb/"
  let link="https://tool.gcqweb.cn/gcqweb/"
  if (url.includes("douyin")) {
    return link+'dy';
  } else if (url.includes("kuaishou")) {
    return link+'ks';
  }
}
// 使用axios异步发请求
// if (link_url.value)
const getData = async (target_url) => {
  const http_url = get_parse_mode(target_url) || "http://192.168.8.116:1996/dy/"; //|| ;
  const res = await axios.get(http_url, {
    params: {
      link: target_url, // 这是你要传递的参数
    },
  });
  // console.log(res);
  if (res.status === 200) {
    // console.log(res.data.parse_data, 8765554);
    // parse_data=res.data.parse_data
    // 使用扩展运算符将对象的所有属性赋值给响应式对象
    Object.assign(parse_data, res.data.parse_data);
    // 清空checkedImages

    if (res.data.parse_data.type === "video") {
      // player.value?.destroy();
      // player.value = new Player({
      //   el: videoContainer.value,
      //   url: res.data.parse_data.urls[2],
      //   width: "600px",
      //   height: "337px",
      //   autoplay: false,
      //   miniprogress: true,
      //   screenShot: true,
      //   download: true,
      //   keyShortcut: true,
      // });
      const newUrl = res.data.parse_data.urls[0];
      // player.value.src = newUrl;
      video_url.value = newUrl;
    }
    // player.value.pause();
  }
  message.success("获取成功");
};

// const openNotification = (placement) => {
//   notification.open({
//     message: `请先勾选复选框`,
//     description: "选择需要的保存的图片后，批量下载",
//     placement,
//   });
// };

const parseHandle = async () => {
  // console.log(1);
  if (!link_url.value) {
    return;
  }
  // 更新视频链接
  let ShareLink = getShareLink(link_url.value);
  if (!ShareLink) return;
  link_url.value=ShareLink;
  // console.log(ShareLink);
  loading.value = true;
  await getData(ShareLink);
  loading.value = false;
};

// 全选
const selectAllItems = () => {
  // console.log(checkedImages);
  if (checkAll.value) {
    toggleSelectAllItems(false);
  } else {
    toggleSelectAllItems(true);
  }
  checkAll.value = !checkAll.value;
};

const toggleSelectAllItems = (select) => {
  checkedImages.forEach((_, index) => {
    checkedImages[index] = select;
  });
};

// 反选
const invertSelection = () => {
  checkedImages.forEach((value, index) => {
    checkedImages[index] = !value;
  });
  // 更新 checkAll 的状态
  checkAll.value = checkedImages.every((value) => value === true);
};

const downloadFn = (index) => {
  if (index === "bat") {
    // console.log(checkedImages);

    // if (checkedImages.every((value) => value === false)) {
    //   // message.error('请选择视频');
    //   openNotification("top");
    //   return;
    // }

    // console.log("批量下载");
    checkedImages.forEach((value, i) => {
      if (value) {
        let url = parse_data.urls[i];
        createLink(url);
      }
    });
  } else {
    // console.log(index);
    let url = parse_data.urls[index];
    createLink(url);
  }
};

const createLink = async (url) => {
  try {
    // 使用 fetch 获取图片
    const response = await fetch(url);
    if (!response.ok) {
      message.error("网络无响应！");
      throw new Error("网络无响应！");
    }
    // 将图片转换为 blob
    const blob = await response.blob();
    // 创建一个对象URL
    const objectURL = URL.createObjectURL(blob);
    // 创建一个下载链接
    const link = document.createElement("a");
    link.href = objectURL;
    link.download = `${parse_data.desc}.${parse_data.format||'webp'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放对象URL
    URL.revokeObjectURL(objectURL);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};
</script>

<style scoped>
.is-sticky {
  position: sticky;
  z-index: 1000;
}
.actions {
  top: 150px;
}
.video-container {
  max-width: 600px;
  max-height: 337px;
}

.title {
  color: #fff;
  margin-top: 2rem;
  text-shadow: 2px 2px #fd1755, -2px -1px #2bf2ec,
    30px 20px rgba(255, 255, 255, 0.03);
  /* text-shadow: 0 0 20px #2addfd; */
}

.dy-parse {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1rem;
}
.layout {
  text-align: center;
  height: 100%;
  width: 100%;
  /* padding: 1rem; */
}

:deep() .ant-image-mask {
  background: unset;
  opacity: 1;
}
:deep() .ant-image:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.42), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  border: 1px transparent solid;
}
:deep() .ant-image {
  height: auto;
  width: 100%;
  display: flex;
  overflow: hidden;
  border: 1px #eee dashed;
  max-width: 200px;
  position: relative;
}
img,
:deep() .ant-image-img {
  height: auto;
  object-fit: contain;
  width: 100%;
}

.ant-image-mask .download_btn {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0.7;
  /* border-radius: 0 0 8px 8px; */
  border-radius: 0;
}
.ant-image-mask:hover .download_btn {
  display: block; /* 父元素被悬停时，子元素显示为block */
}

.images_layout {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
  /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
  grid-template-columns: repeat(auto-fit, 200px);
  justify-content: center; /* 将网格项水平居中 */
  user-select: none;
}

.checkbox {
  position: absolute;
  top: 0;
  left: 0;
}

.url_input {
  max-width: 100%;
  width: 500px;
  top: 90px;
}
:deep() .ant-input-group .ant-input-group-addon {
  background-color: #fff !important;
}
.url_input:hover :deep() .ant-input-group .ant-input-group-addon {
  border: 2px solid #000000;
  background: #000000 !important;
  color: #fff;
  /* text-shadow: 1px 1px #fd1755, -1px -1px #2bf2ec,
      30px 20px rgba(255, 255, 255, 0.03); */
  filter: drop-shadow(
    1px 1px #fd1755,
    -1px -1px #2bf2ec,
    30px 20px rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: drop-shadow(
    1px 1px #fd1755,
    -1px -1px #2bf2ec,
    30px 20px rgba(255, 255, 255, 0.03)
  );
}
.input_submit {
  user-select: none;
  display: block;
  width: 100%;
  height: 100%;
  padding: 10px 0;
}
:deep() .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
  border-color: #000000;
  border-inline-end-width: 0px;
}
:deep() .ant-input-affix-wrapper {
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.66);
  border-inline-end-width: 0px;
}
:deep() .ant-input-group .ant-input-group-addon {
  cursor: pointer;
  background-color: transparent;
  border: 2px solid rgba(0, 0, 0, 0.66);
  border-inline-start-width: 0px;
  font-size: 1rem;
  font-weight: 500;
}
.video_layout {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 700px) {
  .images_layout {
    grid-template-columns: 1fr 1fr;
  }
  .ant-image-mask .download_btn {
    display: block;
  }
}
</style>
