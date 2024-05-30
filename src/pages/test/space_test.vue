<template>
  <div>个人空间</div>
  <div>User ID: {{ userId }}</div>
  <router-link :to="{ name: 'space', params: { id: '123' } }"
    >Go to User 123's Detail</router-link
  >
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted,defineProps } from 'vue';

import { useRouter, useRoute } from "vue-router";
const route = useRoute();

const fetchData = (userId) => {
  // 根据 userId 获取数据
};
const router = useRouter();
router.push({ name: "space", params: { id: "123" } });
const props = defineProps({
  userId: String,
});

watch(
  () => route.params.userId,
  (newUserId, oldUserId) => {
    fetchData(newUserId);
  }
);

onMounted(() => {
  fetchData(route.params.userId);
});
</script>

<style scoped></style>
