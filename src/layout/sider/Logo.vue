<template>

  <a-flex class="logo" justify="flexStart" align="center" >
    <!-- <a-button>隐藏</a-button>

    <div  @click="siderStore.toggleSider">
      <div class="toggle-button-cover">
        <div class="button r" id="button-3">
          <input type="checkbox" class="checkbox">
          <div class="knobs"></div>
          <div class="layer"></div>
        </div>
      </div>
    </div> -->
    <!-- <a-avatar src="https://www.antdv.com/assets/logo.1ef800a8.svg" /> -->
    　
    <!-- &nbsp;&nbsp; -->
    <svg class="icon" aria-hidden="true" style="font-size: 30px">
      <use :xlink:href="`#icon-yingyongguanli`"></use>
    </svg>
    <a href="#">
    <span
      style="font-family: 'DingTalk-JinBuTi'; font-size: 20px; color: black"
      class="logo-text"
      >&nbsp; web工具箱</span
    ></a>
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      width="68"
      height="40"
      fill="currentColor"
      viewBox="0 0 68 40"
    >
      <path
        d="M7.846 9.68H4.613v2.986H2.12v3h2.5v4.707h-2.5v2.999h2.5v3.246c0 .234-.19.424-.425.424H2.02v3.227h2.176a3.662 3.662 0 0 0 3.657-3.651v-5.391h2.493v-3H7.852v-2.555h2.493v-3H7.852V9.686l-.006-.006ZM20.577 9.579h-5.72a3.458 3.458 0 0 0-3.455 3.448v13.768a3.454 3.454 0 0 0 3.455 3.448h5.72a3.458 3.458 0 0 0 3.454-3.448V13.027a3.454 3.454 0 0 0-3.454-3.448Zm.221 17.216a.22.22 0 0 1-.221.222h-5.72a.22.22 0 0 1-.222-.222V13.027a.22.22 0 0 1 .222-.221h5.72a.22.22 0 0 1 .221.221v13.768ZM41.115 17.993l4.131-5.251-.025-2.898h-15.64v3.227h11.3l-3.873 4.922h-9.541v3.227h9.396V26.6c0 .234-.19.423-.424.423h-4.676v3.227h4.676a3.658 3.658 0 0 0 3.657-3.65V21.22h8.27v-3.227h-7.251Z"
      ></path>
    </svg> -->
  </a-flex>
</template>

<script setup>
import { useSiderWidth } from "@/store/siderStore";

const siderStore = useSiderWidth();
</script>

<style scoped>
@font-face {
  font-family: "DingTalk-JinBuTi"; /* 自定义字体名称 */
  src: url("@/assets/DingTalk-JinBuTi.woff") format("woff"); /* 字体文件路径及格式 */
  font-weight: normal;
  font-style: normal;
}
.logo {
  width: 100%;
}
.toggle-button-cover {
  display: table-cell;
  position: relative;
  width: 200px;
  height: 140px;
  box-sizing: border-box;
}

.button-cover {
  height: 100px;
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 10px 20px -8px #c5d6d6;
  border-radius: 4px;
}

.button-cover:before {
  counter-increment: button-counter;
  content: counter(button-counter);
  position: absolute;
  right: 0;
  bottom: 0;
  color: #d7e3e3;
  font-size: 12px;
  line-height: 1;
  padding: 5px;
}

.button-cover,
.knobs,
.layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.button {
  position: relative;
  top: 50%;
  width: 74px;
  height: 36px;
  margin: -20px auto 0 auto;
  overflow: hidden;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: 0.3s ease all;
  z-index: 1;
}

.button.r,
.button.r .layer {
  border-radius: 100px;
}

#button-3 .knobs:before {
  content: "ON";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 10px;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  background-color: #03a9f4;
  border-radius: 50%;
  transition: 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
}

#button-3 .checkbox:active + .knobs:before {
  width: 46px;
  border-radius: 100px;
}

#button-3 .checkbox:checked:active + .knobs:before {
  margin-left: -26px;
}

#button-3 .checkbox:checked + .knobs:before {
  content: "OFF";
  left: 42px;
  background-color: #f44336;
}

#button-3 .checkbox:checked ~ .layer {
  background-color: #fcebeb;
}
</style>
