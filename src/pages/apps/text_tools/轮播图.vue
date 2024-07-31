<template>
  <section
    class="swiper-container"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay"
  >
    <div><span style="font-size: 36px !important">推荐</span></div>
    <div class="carousel">
      <div
        class="carousel-inner"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          class="carousel-item"
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
        >
          <div
            class="carousel-item-content"
            v-for="(item, itemIndex) in page"
            :key="itemIndex"
          >
            <div class="img-context">
              <img :src="item.image" :alt="item.title" />
            </div>
            <a href="#"
              ><h3>{{ item.title }}</h3></a
            >
            <p class="desc">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <button
      v-show="displayBtn"
      class="carousel-control prev"
      @click="prevPage"
      style="font-size: 24px"
    >
      ‹
    </button>
    <button v-show="displayBtn" class="carousel-control next" @click="nextPage">
      ›
    </button>
    <div class="carousel-dots">
      <span
        v-for="(page, pageIndex) in pages"
        :key="pageIndex"
        :class="{ active: pageIndex === currentIndex }"
        @click="goToPage(pageIndex)"
      ></span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const displayBtn = ref(true);
let url="https://p.qpic.cn/music_cover/sTxe2icW7YBoyg5F5IJPdFlxEwsVwzWWrx6gzj3PqO8SC7HADjX5iapA/600?n=1"
const pages = ref([
  [
    {
      image:url,
      title: "Title 1",
      description:
        "DescriptionDescription Description Description Description  1",
    },
    { image: url, title: "Title 2", description: "Description 2" },
    { image: url, title: "Title 3", description: "Description 3" },
    { image: url, title: "Title 4", description: "Description 4" },
    { image: url, title: "Title 5", description: "Description 5" },
  ],
  [
    { image: url, title: "Title 1", description: "Description 1" },
    { image: url, title: "Title 2", description: "Description 2" },
    { image: url, title: "Title 3", description: "Description 3" },
    { image: url, title: "Title 4", description: "Description 4" },
    { image: url, title: "Title 5", description: "Description 5" },
  ],
  [
    { image: url, title: "Title 1", description: "Description 1" },
    { image: url, title: "Title 2", description: "Description 2" },
    { image: url, title: "Title 3", description: "Description 3" },
    { image: url, title: "Title 4", description: "Description 4" },
    { image: url, title: "Title 5", description: "Description 5" },
  ],
  [
    { image: url, title: "Title 1", description: "Description 1" },
    { image: url, title: "Title 2", description: "Description 2" },
    { image: url, title: "Title 3", description: "Description 3" },
    { image: url, title: "Title 4", description: "Description 4" },
    { image: url, title: "Title 5", description: "Description 5" },
  ],
  [
    { image: url, title: "Title 1", description: "Description 1" },
    { image: url, title: "Title 2", description: "Description 2" },
    { image: url, title: "Title 3", description: "Description 3" },
    { image: url, title: "Title 4", description: "Description 4" },
    { image: url, title: "Title 5", description: "Description 5" },
  ],
  // ... 其他页面数据
]);

const currentIndex = ref(0);
let autoPlayInterval = null;

const nextPage = () => {
  currentIndex.value = (currentIndex.value + 1) % pages.value.length;
};

const prevPage = () => {
  currentIndex.value =
    (currentIndex.value - 1 + pages.value.length) % pages.value.length;
};

const goToPage = (index) => {
  currentIndex.value = index;
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextPage, 7000);
  displayBtn.value = false;
};

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval);
  displayBtn.value = true;
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.swiper-container {
  position: relative;
  width: 100%;
  height: 400px;
  /* background-color: rgb(119, 194, 255); */
}

.carousel {
  user-select: none;
  /* background-color: black; */
  position: relative;
  width: 1200px;
  overflow: hidden;
  margin: 0 auto;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 100%;
  gap: 1rem;
}

.carousel-item-content {
  /* width: 80%; */
  /* flex: 1; */
  max-width: 222px;
  text-align: start;
  /* background-color: aqua; */
  overflow: hidden;
}
.desc {
  text-wrap: nowrap;
  overflow: hidden;
  white-space: nowrap;
  /* 省略号*/
  text-overflow: ellipsis;
}
.img-context {
  width: 222px;
  height: 222px;
  /* background-color: antiquewhite; */
  overflow: hidden;
}

.img-context:hover img {
    transition: scale 0.3s ;
  scale: 1.05;
  
}

.carousel-item-content img {
  max-width: 100%;
  max-height: 100%;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(236, 236, 236);
  color: rgb(0, 0, 0);
  border: none;
  padding: 20px;
  cursor: pointer;
}

.carousel-control.prev {
  left: 10px;
}

.carousel-control.next {
  right: 10px;
}

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
}

.carousel-dots span {
  width: 8px;
  height: 8px;
  background: rgb(215, 215, 215);
  border-radius: 50%;
  cursor: pointer;
  /* border: 1px solid rgb(131, 131, 131); */
}
.carousel-dots span:hover{
    background: rgb(163, 163, 163);
}
.carousel-dots span.active {
  background: rgb(163, 163, 163);
}
</style>
