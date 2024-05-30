<template>
  <section class="img-list-compress" >
  <div
    ref="draggable"
    class="draggable"
    v-if="isMobileDevice"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
  >
    <a-upload
      :showUploadList="false"
      v-model:file-list="fileList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      :before-upload="beforeUpload"
    >
      <div>
        <plus-outlined />
        <div style="margin-top: 8px">选择文件</div>
      </div>
    </a-upload>
  </div>
  <main >
    <section class="clearfix" style="margin-bottom: 2rem">
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
      <!-- <a-upload
      :showUploadList="false"
      v-model:file-list="fileList"
      list-type="picture-card"
      @preview="handlePreview"
      :multiple="true"
      :before-upload="beforeUpload"
    >
      <div>
        <plus-outlined />
        <div style="margin-top: 8px">选择文件</div>
      </div>
    </a-upload> -->
      <a-modal
        :open="previewVisible"
        :title="previewTitle"
        :footer="null"
        @cancel="handleCancel"
      >
        <img alt="preview" style="width: 100%" :src="previewImage" />
      </a-modal>
    </section>

    <a-modal
      :open="preview_result.open"
      :title="preview_result.title"
      :footer="null"
      @cancel="previewResultCancel"
    >
      <a-spin
        style="display: flex; justify-content: center"
        v-if="!preview_result.src"
      />
      <img v-else alt="preview" style="width: 100%" :src="preview_result.src" />
    </a-modal>
    <section
      style="background-color: #eee; border: 1px solid #eee; border-radius: 8px"
    >
      <a-table
        class="ant-table-striped"
        size="middle"
        :row-class-name="
          (_record, index) => (index % 2 === 1 ? 'table-striped' : '')
        "
        :scroll="{ y: 400 }"
        :columns="columns"
        :data-source="fileList"
        :pagination="false"
        :rowKey="(record) => record.uid"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === '全选'">
            <a-space>
              <a-checkbox
                v-model:checked="isChecked"
                @change="handleCheckAllChange"
              />
              <span>全选</span>
            </a-space>
          </template>
          <template v-else-if="column.key === '目标大小'"> 目标大小 </template>
        </template>

        <template #bodyCell="{ column, record }">
          <!-- <template
            v-if="column.dataIndex === 'index'"
            style="text-align: center"
          >
            {{ record.index }}
          </template> -->
          <template v-if="column.dataIndex === 'isChecked'">
            <a-space>
              <a-checkbox v-model:checked="record.isChecked" />
              <a-avatar
                shape="square"
                :src="record.preview"
                @click="handlePreview(record)"
              />
            </a-space>
          </template>
          <template v-if="column.key === '文件名'" class="filename-col">
            <a-tag color="green" v-if="record.type.split('/')[0] === 'image'">
              {{ record.type.split("/")[1] }}
            </a-tag>
            <a-tag v-else color="error">{{
              record.type.split("/")[0] || "未知"
            }}</a-tag>
            <a-tooltip
              placement="topLeft"
              :arrow="false"
              :mouseEnterDelay="0.3"
              :mouseLeaveDelay="0"
            >
              <template #title>{{ record.name }}</template>
              {{ record.name }}
            </a-tooltip>
          </template>
          <template v-else-if="column.key === '文件大小'">
            <span>
              <a-tag color="processing">{{ convertSize(record.size) }}</a-tag>
              <span v-show="record.targetBase64">
                ->
           
                <a-spin size="small" v-if="loading"/>
                <a-tag v-else
                  :color="
                    convertSize(record?.size) ==
                    getBase64Size(record.targetBase64)
                      ? 'error'
                      : 'green'
                  "
                  >{{ getBase64Size(record.targetBase64) }}</a-tag
                ></span
              >
            </span>
          </template>
          <template v-else-if="column.key === '目标大小'">
            <a-input-number
              size="small"
              id="inputNumber"
              v-model:value="record.targetSize"
              :min="1"
              :max="9999"
              style="width: 8rem"
              @blur="sizeChangeFn(record)"
              @pressEnter="sizeChangeFn(record)"
            >
              <template #addonAfter>
                <a-select
                  size="small"
                  v-model:value="record.sizeUnit"
                  style="width: 4rem"
                  @change="sizeChangeFn(record)"
                >
                  <a-select-option value="KB">KB</a-select-option>
                  <a-select-option value="MB">MB</a-select-option>
                </a-select>
              </template>
            </a-input-number>
          </template>
          <template v-else-if="column.key === '操作'">
            <a-space>
              <a-button
                type="text"
                danger
                size="small"
                key="list-loadmore-more66"
                @click="removeImg(record.uid)"
                >移除</a-button
              >
              <a-button size="small" @click="itemPreview(record)"
                >预览</a-button
              >
              <a-button @click="downloadImages(record)" size="small"
                >下载</a-button
              >
            </a-space>
          </template>
        </template>
        <template #footer>
          <a-space class="footer-actions">
            <a-space-compact block>
              <a-button type="dashed" size="small" @click="setTargetSize"
                >全部压缩</a-button
              >
              <a-input-number
                size="small"
                id="inputNumber"
                v-model:value="targetSize"
                :min="1"
                :max="9999"
                style="width: 8rem"
              >
                <template #addonAfter>
                  <a-select
                    size="small"
                    v-model:value="allAddonAfterValue"
                    style="width: 4rem"
                  >
                    <a-select-option value="KB">KB</a-select-option>
                    <a-select-option value="MB">MB</a-select-option>
                  </a-select>
                </template>
              </a-input-number>
            </a-space-compact>
            <a-button
              shape="round"
              danger
              size="small"
              key="list-loadmore-more66"
              @click="removeImg('all')"
              >清空列表</a-button
            >
            <a-button
              type="primary"
              shape="round"
              @click="downloadImages('all')"
              ><template #icon> <DownloadOutlined /> </template
              >下载已选中</a-button
            >
            <a-badge
              :offset="['-20', -7]"
              count="移动端"
              style="border-radius: 10px 10px 10px 0"
            >
              <a-button type="primary" shape="round" @click="downloadZip">
                <template #count> <DownloadOutlined /> </template
                >打包下载ZIP</a-button
              ></a-badge
            >
            <!-- </a-badge-ribbon> -->
            <!-- <a-badge>
    <template #count>
      <clock-circle-outlined style="color: #f5222d" />
    </template>
    <a-avatar shape="square" size="large" />
  </a-badge> -->
          </a-space>
        </template>
      </a-table>
    </section>
  </main>
  </section>
</template>
<script setup>
// npm install image-conversion
import { onMounted, ref, watch, watchEffect, reactive, computed } from "vue";
// import { dataURLtoFile, urltoBlob } from 'image-conversion';
import { compressAccurately, filetoDataURL } from "image-conversion";
import {
  SyncOutlined,
  PlusOutlined,
  EditFilled,
  EditOutlined,
  FileImageOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { Table, message } from "ant-design-vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
const isChecked = ref(false);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const fileList = ref([]);
const targetSize = ref(200);
const allAddonAfterValue = ref("KB");

let loading = ref(false);

const preview_result = reactive({ open: false, src: "", title: "" });
let isMobileDevice=isMobileFn()||isMobileDeviceFn();
watchEffect(() => {
  if (fileList.value.length > 0) {
    isChecked.value = fileList.value.every((item) => item.isChecked);
  }
});

const handleCheckAllChange = (e) => {
  // isChecked.value = e.target.checked;
  const Checked = e.target.checked;
  fileList.value.forEach((item) => {
    item.isChecked = Checked;
  });

  // console.log(fileList.value,e);
};

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = "";
};
const previewResultCancel = () => {
  preview_result.open = false;
  preview_result.src = "";
  preview_result.title = "";
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
const handlePreview = async (file) => {
  if (!file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || typeof file;
};
const removeImg = (file_uid) => {
  if (file_uid === "all") {
    fileList.value = [];
    return;
  }
  //   console.log(file_uid);
  // 遍历fileList，删除对应的uid
  fileList.value = fileList.value.filter((item) => item.uid !== file_uid);
};

const beforeUpload = async (file) => {
  const isAcceptedType =
    file.type === "image/jpeg" || file.type === "image/png";
  if (!isAcceptedType) {
    message.error("只能上传 JPEG 或 PNG 文件!");
    return Upload.LIST_IGNORE; // 返回 false 阻止文件自动添加到 fileList 和自动上传
  }

  try {
    if (!file.preview) {
      file.preview = await getBase64(file);
    }
  } catch (error) {
    console.log("gg", error);
  }
  //   file.index = file_index;
  file.isChecked = true;
  file.targetSize = targetSize.value;
  file.sizeUnit = allAddonAfterValue.value;

  return false;
  const isPNG = file.type === "image/png";
  if (!isPNG) {
    message.error(`${file.name} is not a png file`);
  }
  return false;
};
const sizeToKB = (size, sizeUnit) => {
  if (sizeUnit === "MB") {
    return size * 1024;
  }
  return size;
};
watch(targetSize, (newval, oldValue) => {
  fileList.value.forEach((item) => {
    if (item.isChecked) {
      item.targetSize = newval;
    }
  });
});
watch(allAddonAfterValue, (newval, oldValue) => {
  fileList.value.forEach((item) => {
    if (item.isChecked) {
      item.sizeUnit = newval;
    }
  });
});

const sizeChangeFn = async (item) => {
  loading.value = true;
  await compressImage(item);
  loading.value = false;
};

// const worker = new Worker('./compressor.worker.js');

// const sizeChangeFn = async (item) => {
//   loading.value = true;
//   worker.postMessage({
//     item: item,
//     size: sizeToKB(item.targetSize, item.sizeUnit)
//   });

//   worker.onmessage = function(e) {
//     item.targetBase64 = e.data.targetBase64;
//     loading.value = false;
//   };
// };

const setTargetSize = () => {
  fileList.value.forEach((item) => {
    compressImage(item);
  });
};

async function compressImage(item) {
  let size = sizeToKB(item.targetSize, item.sizeUnit);
  const res = await compressAccurately(item.originFileObj, size);
  const targetBase64 = await filetoDataURL(res);
  item.targetBase64 = targetBase64;

  //   item.targetSize = target_size;
  // console.log(fileList.value);
}
const getBase64Size = (base64) => {
  if (!base64) return;
  var base64String = base64.split(",")[1];
  var byteLength = base64String.length * (3 / 4); // 每4个base64字符转换成3个字节
  // 将字节转换为千字节
  let imgResultSize = convertSize(byteLength);
  //   var sizeInKilobytes = byteLength / 1024;
  //   let imgResultSize = sizeInKilobytes.toFixed(2);
  // console.log("图像大小约为: " + sizeInKilobytes.toFixed(2) + "KB");
  // 返回图像大小
  return imgResultSize;
};
function convertSize(size) {
  if (size < 1024) {
    return size + " B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  }
}

const itemPreview = async (record) => {
  if(loading.value){
    message.error("正在处理中，请稍后重试");
    return;
  }
  preview_result.open = true;
  if (!record.targetBase64) {
    loading.value = true; // 设置加载状态为true
    await compressImage(record);
    loading.value = false; // 完成后设置加载状态为false
  }
  preview_result.src = record.targetBase64;
  preview_result.title = record.name;

};

const createLink = (file) => {
  const link = document.createElement("a");
  link.href = file.targetBase64;
  link.download = `@${getBase64Size(file.targetBase64)}-${file.name}`; // 可以根据需要修改文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadImages = (onefile) => {
  if (fileList.value.length === 0) return;
  if (onefile === "all") {
    fileList.value.forEach((file) => {
      if (file.isChecked) {
        createLink(file);
        // const link = document.createElement("a");
        // link.href = file.targetBase64;
        // link.download = `@${getBase64Size(file.targetBase64)}-${file.name}`; // 可以根据需要修改文件名
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      }
    });
  } else {
    createLink(onefile);
  }
};

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

// 表格配置------------------
const columns = [
  {
    title: "id",
    dataIndex: "index",
    key: "序号",
    customRender: ({ index }) => `${index + 1}`, // 使用 index 参数加 1 来显示序号
    width: 40,
  },
  {
    title: "全选",
    dataIndex: "isChecked",
    key: "全选",
    width: 70,
  },
  {
    title: "文件名",
    dataIndex: "name",
    key: "文件名",
    ellipsis: true,
    width: 200,
    minWidth: 100,
  },

  {
    title: "文件大小",
    key: "文件大小",
    dataIndex: "文件大小",
    width: 200,
    minWidth: 200,
  },
  {
    title: "目标大小",
    dataIndex: "age",
    key: "目标大小",
    width: 150,
    minWidth: 150,
  },

  {
    title: "操作",
    key: "操作",
    width: 200,
  },
];
const pagination = ref({
  current: 1, // 当前页码
  pageSize: 10, // 每页显示的行数，这就是你设置默认展示行数的地方
  total: fileList.value.length, // 数据总数
  showSizeChanger: true, // 是否显示每页显示个数选择器
  pageSizeOptions: ["10", "20", "30", "40"], // 每页显示个数选择器的选项设置
  hideOnSinglePage: true, // 当只有一页时是否隐藏分页
});

async function downloadZip() {
  const zip = new JSZip();
  for (const item of fileList.value) {
    await compressImage(item);
    const dataUrl = item.targetBase64;
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    zip.file(`${item.name}.png`, blob);
  }
  // 生成ZIP文件并保存
  try {
    const content = await zip.generateAsync({ type: "blob" });
    // console.log(`Generated ZIP size: ${content.size} bytes`);
    saveAs(content, "图片批量压缩.zip");
  } catch (error) {
    console.error("生成zip错误:", error);
  }
  // zip.generateAsync({ type: "blob" }).then((content) => {
  //   saveAs(content, "图片批量压缩.zip");
  // });
}

// ----------
// 拖拽
const draggable = ref(null);
let initialX = 0,
  initialY = 0;
let xOffset = 0,
  yOffset = 0;

const startDrag = (event) => {
  // console.log(true === isMobileFn(), isMobileDeviceFn());
  // 获取初始触摸位置
  initialX = event.touches[0].clientX - xOffset;
  initialY = event.touches[0].clientY - yOffset;
};

const onDrag = (event) => {
  // 计算新位置
  const x = event.touches[0].clientX - initialX;
  const y = event.touches[0].clientY - initialY;

  // 更新元素位置
  xOffset = x;
  yOffset = y;
  draggable.value.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

const endDrag = () => {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const rect = draggable.value.getBoundingClientRect();
  // console.log(rect);
  // 水平贴边逻辑
  // if (rect.left + rect.width / 2 < screenW / 2) {
  //   xOffset = 0; // 贴左边
  // } else {
  //   xOffset = screenW - rect.width-100; // 贴右边
  // }

  // 水平边界检查
  if (rect.left < 0) {
    xOffset = 0;
  } else if (rect.right > screenW) {
    xOffset = screenW - rect.width - 200;
  }

  // 垂直边界检查
  if (rect.top < 0) {
    yOffset = 0;
  } else if (rect.bottom > screenH) {
    yOffset = screenH - rect.height - 200;
  }

  // 应用最终位置
  draggable.value.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
};
function isMobileFn() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone 必须放在前面，因为其 userAgent 也包含 "Android"
  if (/windows phone/i.test(userAgent)) {
    return true; // windows phone
  }

  if (/android/i.test(userAgent)) {
    return true; // Android
  }

  // iOS 设备
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true; // iOS
  }

  return false; // 不是移动端
}

function isMobileDeviceFn() {
  // 用户代理字符串检查
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // 正则表达式检查移动设备的典型标识符
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

// if (isMobileDeviceFn()) {
//   console.log("当前设备是手机端");
// } else {
//   console.log("当前设备是PC或大屏设备");
// }
</script>
<style scoped>
.img-list-compress{width: 70%; margin:0 auto;padding: 1rem;}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.filename-col{
  /* display: ; */
}
.footer-actions{display: flex; justify-content: flex-end}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.demo-loadmore-list {
  min-height: 350px;
}

/* 斑马条纹 */

:deep() .table-striped td {
  background-color: #fafafa;
  /* 浅色主题 */
}

:deep() .dark .table-striped td {
  background-color: rgb(29, 29, 29);
  /* 深色主题 */
}

/* 拖拽元素 */
.draggable {
  display: block;
  position: fixed;
  width: 100px;
  height: 100px;
  background-color: lightblue;
  text-align: center;
  line-height: 100px;
  border-radius: 10px;
  touch-action: none;
  /* 阻止默认的触摸行为 */
  z-index: 999;
}

@media screen and (max-width: 768px) {
  .draggable {
  display: none;}
  .img-list-compress{width: 100%; }
  .filename-col{
  display: none;
}
.footer-actions{justify-content: start}
}
</style>
