<template>
  <section class="life">
    <h2  style="margin-bottom: 1rem;"
        >你已生活了 <strong> {{ daysPast }} </strong> 天🌏</h2
      >
    <a-space direction="vertical">
      出生日期：
      <a-space>
        <a-input
          style="max-width: 7rem"
          v-model:value="year"
          placeholder="YYYY"
          @change="calculateDays"
        >
          <template #prefix>年：</template>
        </a-input>

        <a-input-number
          @change="calculateDays"
          placeholder="MM"
          v-model:value="month"
          :min="1"
          :max="12"
        >
          <template #prefix>月：</template>
        </a-input-number>

        <a-input-number
          @change="calculateDays"
          placeholder="DD"
          v-model:value="day"
          :min="minDay"
          :max="maxDay"
        >
          <template #prefix>日：</template>
        </a-input-number>
      </a-space>

      目标日期：
      <a-date-picker v-model:value="targetDate" />
      <a-button type="primary" @click="calculateDays">查看天数</a-button>

    </a-space>
  </section>
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
// 定义输入的生日年月日
const year = ref("2008");
const month = ref(2);
const day = ref(28);
const targetDate = ref(dayjs());
const daysPast = ref('n');
const minDay = ref(1);
const maxDay = ref(28);
const calculateDays = () => {
  daysPast.value = 'n';
  if (!year.value || !month.value || !day.value || year.value.length !== 4) {
    // message.error("请输入完整的生日信息");
    return;
  }
  if (year.value && month.value) {
    set2MonthDays();
  }
  // 创建生日日期对象
  const birthday = dayjs(`${year.value}-${month.value}-${day.value}`);
  if (!birthday.isValid()) {
    // message.error("输入的生日信息不合法");
    return;
  }

  // 计算天数差异
  const target = dayjs(targetDate.value);
  const days = target.diff(birthday, "day");
  if (days && days < 40000 && days > 0) {
    daysPast.value = days;
  } else {
    daysPast.value = "n";
  }
};

const set2MonthDays = () => {
  if (month.value === 2) {
    // 首先检查是否是非闰年的二月
    if (
      year.value % 4 !== 0 ||
      (year.value % 100 === 0 && year.value % 400 !== 0)
    ) {
      maxDay.value = 28; // 非闰年的二月有28天
    } else {
      maxDay.value = 29; // 闰年的二月有29天
    }
  } else if ([4, 6, 9, 11].includes(month.value)) {
    maxDay.value = 30; // 小月有30天（除了二月）
  } else {
    maxDay.value = 31; // 大月有31天
  }
};
set2MonthDays();
</script>

<style scoped>
.life {
  padding: 1rem;
  width: 1000px;
  margin: 0 auto;
}
@media screen and (max-width: 500px) {
  :deep() .ant-space {
    /* flex-direction: column; */
  }
  :deep() .ant-space-align-center {
    align-items: start;
  }
  .life {
    width: 100%;
    height: auto;
  }
}
</style>
