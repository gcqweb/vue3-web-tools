<template>

  <div class="swiper-container">
    <swiper
    :modules="modules"
    :slides-per-view="4"
    :space-between="50"
    navigation
    EffectFlip

    :pagination="{ clickable: true }"

    @swiper="onSwiper"
    @slideChange="onSlideChange"
    >
      <swiper-slide v-for="slide in slides" :key="slide">
        <img :src="slide.image" :alt="slide.title" />
      </swiper-slide>
    </swiper>
  </div>
</template>
<style>
.swiper {
  width: 100%;
  height: 300px;
}
img {   width: 100%;}
</style>
<script setup>
// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCube,EffectFlip
} from "swiper/modules";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
const slides = [
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 1" },
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 2" },
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 3" },
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 1" },
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 2" },
  { image: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png", title: "Image 3" },// 更多图片
];
// Import Swiper styles

const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log("slide change");
};
</script>
