<template>
  <div style="text-align: center;">
    <a-input
      :placeholder="placeholderText"
      class="search-input"
      v-model:value="searchQuery"
      @focus="showResults = true"
      @blur="hideResults"
    >
      <template #prefix>
        <SearchOutlined />
      </template>
    </a-input>
    <div v-show="showResults" class="results-container">
      <a-list bordered :dataSource="filteredRoutes" class="search-list">
        <a-list-item
          v-for="item in filteredRoutes"
          :key="item.path"
          @click="selectItem(item)"
        >
          <strong>{{ item.meta.label }}</strong> -
          <span style="color: #666; font-size: 12px">{{ item.meta.desc }}</span>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSearch } from "@/store/searchStore";
import {
  MailOutlined,
  CalendarOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons-vue";
//  import { Input as AInput, List as AList, ListItem as AListItem } from 'ant-design-vue';

const searchStore = useSearch();
const router = useRouter();
const searchQuery = ref(searchStore.searchQuery);
const showResults = ref(false);
const debouncedSearch = debounce((query) => {
  // 执行搜索
  searchQuery.value = query;
}, 300);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const routes = router
  .getRoutes()
  .filter((route) => route.meta && route.meta.label && route.meta.desc);
// console.log(routes, typeof routes);
const placeholderText =
  routes[Math.floor(Math.random() * (routes.length + 1))]?.meta.label;
const filteredRoutes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return routes
    .filter(
      (route) =>
        route.meta.label.toLowerCase().includes(q) ||
        route.meta.desc.toLowerCase().includes(q)
    )
    .slice(0, 10);
});

function selectItem(item) {
  //   console.log("选中了:", item);
  searchQuery.value = item.meta.label;
  searchStore.searchQuery = item.meta.label;
  router.push(item.path);
  showResults.value = false;
}

function hideResults() {
  setTimeout(() => {
    showResults.value = false;
  }, 150); // 延迟以允许点击事件发生
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
</script>

<style>
.search-input {
  width: 33%;
}
.results-container {
  position: absolute;

  width: 100%;
  z-index: 1000;
}
.search-list {
  position: relative;
  /* left: 50%; */
  left: calc(50% - 2rem);
    width: calc(100% - 4rem);
  /* width: calc(100% - 2rem); */
  top: 0;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 1000;
  max-width: 600px;
  max-height: 300px;
  overflow-y: scroll;
  scrollbar-width: none; /* 针对Firefox */
  -ms-overflow-style: none; /* 针对Internet Explorer 和 Edge */
}

.search-list::-webkit-scrollbar {
  /* 针对WebKit 浏览器，如Chrome 和 Safari */
  width: 0;
  height: 0;
  display: none;
}
.search-list .ant-list-item {
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 如果需要调整容器宽度，可以在这里设置宽度 */
  /* width: 一个适当的宽度值; */
}

/* -------------- */
@media screen and (max-width: 768px) {
  .search-input {
    width: 100%;
  }
}
</style>
