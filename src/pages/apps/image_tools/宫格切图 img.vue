<template>
  <div>
    <div
      style="width: 800px; margin: auto; display: flex; flex-direction: column"
    >
      <div>
        请选择上传图片:
        <input
          type="file"
          id="back"
          ref="backfile"
          accept="image/*"
          @change="handleFile"
        />
      </div>

      <div
        id="imgContainer"
        style="
          position: relative;
          margin-left: 150px;
          margin-top: 10px;
          width: 500px;
          height: 500px;
          overflow: hidden;
          background: lightgray;
        "
      >
        <img id="img" :src="imgSrc" style="" />
      </div>

      <div style="margin-left: 150px">
        <template v-for="(items, index) in imgList" :key="index">
          <div style="font-size: 0">
            <template v-for="(itemOne, indexOne) in items" :key="indexOne">
              <img
                :src="itemOne"
                style="
                  width: 200px;
                  display: block;
                  float: left;
                  margin-left: 5px;
                  margin-top: 5px;
                "
              />

              <!--{{itemOne}}-->
            </template>
          </div>
        </template>
      </div>

      <div id="dpiBtn" style="display: none">
        <input type="button" value="分割图片" @click="split" />
        <input
          type="button"
          value="打包下载图片"
          @click="downZip"
          style="margin-left: 20px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

//图片的原宽高
const imgWidth = ref(0);
const imgHeight = ref(0);
//图片内容
const imgSrc = ref("");
//选中的图片文件，保存在数组中
const imgFile = ref();
const roundMax = ref(0);
//选中图片后的处理
const handleFile = () => {
  let filePaths = window.event.target.files;
  //清空原有缩略图
  if (filePaths.length === 0) {
    //未选择，则返回
    return;
  }
  //把新选中的图片加入数组
  imgFile.value = filePaths[0];
  imgSrc.value = URL.createObjectURL(imgFile.value);

  let reader = new FileReader();
  reader.readAsDataURL(imgFile.value);

  reader.onload = () => {
    //显示图片
    imgSrc.value = reader.result;
    //得到宽高
    let img = new Image();
    img.src = reader.result;
    img.onload = () => {
      //保存宽高
      imgWidth.value = img.width;
      imgHeight.value = img.height;

      if (img.width >= img.height) {
        roundMax.value = img.height / 3;
        let rate = 500 / img.width;

        let left = (500 - img.width) / 3;
        let top = (500 - img.height) / 3;

        let styleStr =
          "display: inline-block;position:absolute;transform:scale(" +
          rate +
          ");left:" +
          left +
          "px;display: block;top:" +
          top +
          "px;";
        document.getElementById("img").style = styleStr;
      } else {
        roundMax.value = img.width / 2;
        let rate = 500 / img.height;

        let left = (500 - img.width) / 2;
        let top = (500 - img.height) / 2;

        let styleStr =
          "display: inline-block;position:absolute;transform:scale(" +
          rate +
          ");left:" +
          left +
          "px;display: block;top:" +
          top +
          "px;";
        document.getElementById("img").style = styleStr;
      }
      //显示btn
      document.getElementById("dpiBtn").style.display = "";
    };
  };
};
const imgList = ref([]);
//行数
const rows = ref(2);
//列数
const columns = ref(2);

//拆分图片
const split = () => {
  var canvas = document.createElement("canvas");
  canvas.width = imgWidth.value;
  canvas.height = imgHeight.value;
  let ctx = canvas.getContext("2d");
  let img = document.getElementById("img");
  ctx.drawImage(img, 0, 0, imgWidth.value, imgHeight.value);
  let list = getList(ctx);
  imgList.value = list;
  console.log(imgList.value);
};

//得到切割后的图片列表
const getList = (ctx) => {
  let destWidth = ctx.canvas.width / columns.value;
  let destHeight = ctx.canvas.height / rows.value;
  let list = [];
  for (let i = 0; i < rows.value; i++) {
    let listOne = [];
    for (let k = 0; k < columns.value; k++) {
      console.log("i:" + i + ";k:" + k);
      let url = getPart(
        ctx,
        k * destWidth,
        i * destHeight,
        destWidth,
        destHeight
      );
      listOne.push(url);
    }
    list.push(listOne);
  }
  return list;
};
//得到canvas的指定部分
const getPart = (ctx, x, y, w, h) => {
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  console.log("x:" + x + ";y:" + y + ";w:" + w + ";h:" + h);
  let data = ctx.getImageData(x, y, w, h);
  let context = canvas.getContext("2d");
  context.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png", 1);
};
</script>

<style scoped></style>
