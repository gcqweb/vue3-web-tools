<template>

  <section class="timestamp">
    <h2>劝君须惜少年时</h2>
    <a-divider orientation="left" orientation-margin="0px" dashed >
      <strong>当前时间</strong>
    </a-divider>

    <a-space>
      当前时间戳（秒）:<a-input
        v-model:value="currentTimestamp"
        placeholder="当前时间戳（秒）"
      >
        <template #addonAfter>
          <span @click="toggleTimer" class="input_submit">{{
            timerStatus
          }}</span>
        </template>
      </a-input>

      当前日期时间:
      <a-input v-model:value="formattedDate" placeholder="格式化日期时间" />
    </a-space>

    <br /><br />

    <a-divider orientation="left" orientation-margin="0px" dashed >
      <strong>时间戳 格式化日期</strong>
    </a-divider>

    <a-space>
      时间戳（秒）:
      <a-input-search
        v-model:value="customTimestamp"
        placeholder="时间戳"
        enter-button="转换"
        @search="fn"
        allowClear
      />

      格式化日期时间:
      <a-input v-model:value="customTime" placeholder="格式化日期时间">
        <template #addonAfter>
          <span @click="copyFn(customTime)" class="input_submit">复制</span>
        </template>
      </a-input>
    </a-space><br /><br />
    <a-divider orientation="left" orientation-margin="0px" dashed >
      <strong>日期 转换时间戳</strong>
    </a-divider>

    <a-space direction="vertical">
      <a-space direction="vertical">
        <a-space>
          <a-input v-model:value="year" placeholder="YYYY">
            <template #prefix>年：</template>
          </a-input>
          <a-input v-model:value="month" placeholder="MM">
            <template #prefix>月：</template>
          </a-input>
          <a-input v-model:value="day" placeholder="DD">
            <template #prefix>日：</template>
          </a-input>
        </a-space>
        <a-space>
          <a-input v-model:value="hour" placeholder="HH">
            <template #prefix>时：</template>
          </a-input>
          <a-input v-model:value="minute" placeholder="mm">
            <template #prefix>分：</template>
          </a-input>
          <a-input v-model:value="second" placeholder="ss">
            <template #prefix>秒：</template>
          </a-input></a-space
        >
      </a-space>
      <a-space>
        <a-button type="primary" @click="convertToTimestamp"
          >转换为时间戳</a-button
        >
        转换后的时间戳（秒）:
        <a-input v-model:value="inputTimestamp" placeholder="------------">
          <template #addonAfter>
            <span @click="copyFn(inputTimestamp)" class="input_submit"
              >复制</span
            >
          </template>
        </a-input>
      </a-space>
    </a-space>
  </section>
</template>

<script setup>
import { ref, onUnmounted, onMounted, computed } from "vue";
import { message } from "ant-design-vue";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

const customTimestamp = ref(1648720395);
const customTime = ref("2022-01-03 15:46:35");
// 定义输入框的值
// 获取当前时间戳并格式化日期
const currentTimestamp = ref(Math.floor(Date.now() / 1000));
const date = ref(new Date(currentTimestamp.value * 1000));
const year = ref(date.value.getFullYear());
const month = ref(date.value.getMonth() + 1);
const day = ref(date.value.getDate());
const hour = ref(date.value.getHours());
const minute = ref(date.value.getMinutes());
const second = ref(date.value.getSeconds());

// 定义转换后的时间戳
const inputTimestamp = ref("");
const formattedDate = ref("");

let intervalId;
let isTimerRunning = ref(true);
const timerStatus = computed(() => (isTimerRunning.value ? "暂停" : "继续"));

const toggleTimer = () => {
  isTimerRunning.value = !isTimerRunning.value;
  if (isTimerRunning.value) {
    // 如果是继续，则重新启动计时器
    startTimer();
  } else {
    // 如果是暂停，则清除计时器
    clearInterval(intervalId);
  }
};

const startTimer = () => {
  intervalId = setInterval(() => {
    currentTimestamp.value = Math.floor(Date.now() / 1000);
    formattedDate.value = formatDate(date.value);
  }, 1000);
};

onMounted(() => {
  startTimer(); // 页面加载时启动计时器
});

onUnmounted(() => {
  // 组件卸载时清除计时器
  clearInterval(intervalId);
});

const fn = () => {
  // 转换为数字
  let date = new Date(Number(customTimestamp.value) * 1000);
  // 格式化日期
  customTime.value = formatDate(date);
};

const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

// 转换输入框的值为时间戳
const convertToTimestamp = () => {
  const dateString = `${year.value}-${String(month.value).padStart(
    2,
    "0"
  )}-${String(day.value).padStart(2, "0")} ${String(hour.value).padStart(
    2,
    "0"
  )}:${String(minute.value).padStart(2, "0")}:${String(second.value).padStart(
    2,
    "0"
  )}`;
  const date = new Date(dateString);
  inputTimestamp.value = Math.floor(date.getTime() / 1000);
};

const copyFn = async (text) => {
  try {
    await toClipboard(text.toString());
    message.success("已复制到剪切板");
  } catch (e) {
    console.error(e);
    message.error("剪切板异常，请刷新后重试！");
  }
};
</script>

<style scoped>
.timestamp {
  padding: 1.2rem;
  width: 1000px;
  margin: 0 auto;
  margin-top: 1rem;
  /* border: 2px solid #ccc; */
}
:deep() .ant-input-group-addon {
  cursor: pointer;
}
@media screen and (max-width: 500px) {
  :deep() .ant-space {
    flex-direction: column;
  }
  :deep() .ant-space-align-center {
    align-items: start;
  }
  .timestamp {
    width: 100%;
    height: auto;
  }
}
</style>
