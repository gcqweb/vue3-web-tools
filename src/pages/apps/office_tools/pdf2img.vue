<template>
  <div>
    <a-upload
      :show-upload-list="false"
      v-model:fileList="fileList"
      :before-upload="beforeUpload"
      multiple
    >
      <div v-if="fileList.length < maxCount">
        <plus-outlined />
        <div style="margin-top: 8px">上传</div>
      </div>
    </a-upload>

    <a-checkbox-group v-model:checked="checkedList" class="grid-layout">
      <div
        v-for="(file, index) in fileList"
        :key="file.uid"
        class="preview-item"
      >
        <div class="img-item">
          <img :src="file.url || file.thumbUrl" @click="aiyou" />
          <a-checkbox
            class="item-checkbox"
            :value="file.uid"
            @change="handleCheckboxChange"
          />
          <a-button
            class="item-remove"
            size="small"
            danger
            type="primary"
            block
            @click="removeFile(index)"
            >移除</a-button
          >
        </div>
      </div>
    </a-checkbox-group>
    <a-button @click="performAction">对选定对象执行操作</a-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Upload, Button, Checkbox, Image } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";

const maxCount = 5;
const fileList = ref([]);
const checkedList = ref([]);
// const imgsrc
function beforeUpload(file) {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    alert("You can only upload image files!");
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      file.url = e.target.result;
      resolve(false); // Prevent upload, since we handle the file locally
    };
    reader.readAsDataURL(file);
  });
}
const aiyou = () => {
  console.log(1);
};
function removeFile(index) {
  fileList.value.splice(index, 1);
}

function handleCheckboxChange(event) {
  const { checked, value } = event.target;
  if (checked) {
    checkedList.value.push(value);
  } else {
    const index = checkedList.value.indexOf(value);
    if (index > -1) {
      checkedList.value.splice(index, 1);
    }
  }
}

function performAction() {
  console.log(`对选定对象执行操作: ${checkedList.value.join(", ")}`);
}
</script>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  gap: 4px;

  background: #a6d7f8;
}
.preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* padding: .5rem; */
  min-height: 70px;
  box-shadow: 0.2px 0.2px 0.4px #000;
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
  border: #464646 1px solid;
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
:deep() .ant-checkbox-group{
  cursor: unset;
}
</style>
