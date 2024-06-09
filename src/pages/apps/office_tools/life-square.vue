<template>
  <a-space align="start">
    <div class="grid">
      <div
        v-for="month in totalMonths"
        :key="month"
        :class="{
          month: true,
          'lived-month': month <= livedMonths,
          'todays-month': month === livedMonths,
          'event-month': isEventMonth(month),
        }"
        :style="getEventMonthStyle(month)"
      ></div>
      <!-- @click="removeEvent(month)" -->
    </div>
    <a-space direction="vertical" style="max-width: 400px">
      <label for="age">年龄：{{ ageRef }}</label>
      <!-- <input v-model.number="age" id="age" type="number" /> -->

      <div>
        <label for="eventName">事件名称：</label>
        <!-- <input v-model="eventName" id="eventName" type="text" /> -->
        <a-input
          id="eventName"
          style="max-width: 7rem"
          v-model:value="eventName"
          size="small"
          placeholder="事件名称"
        >
        </a-input>
      </div>
      <div>
        <label for="eventMonths">月数：</label>
        <!-- <input v-model.number="eventMonths" id="eventMonths" type="number" /> -->
        <a-input-number
          size="small"
          id="eventMonths"
          placeholder="MM"
          v-model:value="eventMonths"
          :min="1"
          :max="999"
        >
        </a-input-number>
        
      </div>
      <a-button @click="addEvent" size="small" type="primary"
        >添加事件</a-button
      >
      <!-- <div> -->
        <!-- style="position: fixed; right: 5rem; top: 10rem" -->
        <h3>事件列表：</h3>
        <ul>
          <li v-for="(event, index) in events" :key="event.startMonth">
            <!-- <span
              :style="{ backgroundColor: event.color, padding: '2px 5px' }"
              style="display: inline-block; width: 20px; height: 20px"
            > -->
            <a-button size="small" :style="{ backgroundColor: event.color,color:'#fff'}" @click="removeEvent(index)">移除</a-button>
        <!-- </span> -->
            <span style="font-size: 12px;">{{ event.name }}</span>
              <!-- （{{
                Math.max(event.endMonth - event.startMonth + 1, 0)
              }}）月 -->
              <!-- {{ event.endMonth }}月） -->
            
          </li>
        </ul>
      <!-- </div> -->
      <!-- </div> -->
    </a-space>
  </a-space>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRefs } from "vue";

const props = defineProps({
  age: Number,
});
// const age = ref(abc);
const ageRef = toRefs(props).age;
const eventName = ref("1");
const eventMonths = ref(10);
const eventTimes = ref(2);
const totalMonths = computed(() => 12 * 80); // 假设人生80年，每年12个月
const livedMonths = computed(() => ageRef.value * 12);
const events = ref([]);
const years = computed(() => 80 - ageRef.value);
// 每天工作8小时，每月休息4天，工作60岁
const workMonths = ref(0);
//每天睡觉8小时
const sleepMonths = ref(0);
// 一个月陪伴父母2天
const meetFamily = ref(0);
// 孩子18岁出门上大学，这 18 年里你平均每天能花 5 个小时陪伴孩子
const kidFun=ref(0);
const updateMonths = () => {
  workMonths.value = Math.floor(
    (((365 - 4 * 12) * (60 - ageRef.value) * 8) / (30 * 24))
  );
  // workMonths.value = Math.floor((ageRef.value * 12 * 8 * 22) / (24 * 30));
  sleepMonths.value = Math.floor(((365 * 8 * years.value) / (30 * 24)));
  // sleepMonths.value = Math.floor((ageRef.value * 12 * 8 * 30) / (24 * 30));ceil
  meetFamily.value = Math.ceil(((80 - ageRef.value-25)*12*2/30));
  kidFun.value = Math.ceil((18*365*5/30/24));
};
onMounted(() => {
  updateMonths();
  events.value.push({
    name: "每天工作8小时，每月休息4天，工作到60岁",
    startMonth: livedMonths.value + 1,
    endMonth: livedMonths.value+1 + workMonths.value,
    color: "#ff9800",
  });

  events.value.push({
    name: "每天睡觉8小时",
    startMonth:
      livedMonths.value + (workMonths.value > 0 ? workMonths.value : 0) + 1,
    endMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +1+
      sleepMonths.value,
    color: "#2196f3",
  });

  events.value.push({
    name: "一个月陪伴父母2天（父母25岁生下你）",
    startMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value + 1,
    endMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value,
    color: "#ff7db5",
  });
  events.value.push({
    name: "孩子18岁出门上大学，18 年里每天能花 5 个小时陪伴孩子",
    startMonth:
    livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value,
    endMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value+kidFun.value,
    color: "#ffe900",
  });
});

watch(ageRef, (newAge) => {
  updateMonths();
  events.value = [
    {
      name: "每天工作8小时，每月休息4天，工作到60岁",
      startMonth: livedMonths.value + 1,
      endMonth: livedMonths.value+1 + workMonths.value,
      color: "#ff9800",
    },
    {
      name: "每天睡觉8小时",
      startMonth:
        livedMonths.value + (workMonths.value > 0 ? workMonths.value : 0) + 1,
      endMonth:
        livedMonths.value +
        (workMonths.value > 0 ? workMonths.value : 0)+1 +
        sleepMonths.value -
        1,
      color: "#2196f3",
    },{
    name: "一个月陪伴父母2天（父母25岁生下你）",
    startMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value + 1,
    endMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value,
    color: "#ff7db5",
  },
  {
    name: "孩子18岁出门上大学，18 年里每天能花 5 个小时陪伴孩子",
    startMonth:
    livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value,
    endMonth:
      livedMonths.value +
      (workMonths.value > 0 ? workMonths.value : 0) +
      sleepMonths.value+ 1+meetFamily.value+kidFun.value,
    color: "#ffe900",
  }
  ];
});
const colors = [
  "#ff8e86",
  "#6ebeff",
  "#ff7db5",
  "#ffad35",
  "#1be2ef",
  "#ea70ff",
  "#ffe900",
];

const addEvent = () => {
  if (eventMonths.value > 0) {
    
    const startMonth =
      events.value.length > 0
        ? events.value[events.value.length - 1].endMonth + 1
        : livedMonths.value + 1;
    const endMonth = startMonth + eventMonths.value - 1;
    const color = colors[events.value.length % colors.length];
    events.value.push({ name: eventName.value, startMonth, endMonth, color });
    eventName.value = "1";
    eventMonths.value = 10;
  }
};

const isEventMonth = (month) => {
  for (const event of events.value) {
    if (month >= event.startMonth && month <= event.endMonth) {
      return true;
    }
  }
  return false;
};

const getEventMonthStyle = (month) => {
  for (const event of events.value) {
    if (month >= event.startMonth && month <= event.endMonth) {
      return { backgroundColor: event.color };
    }
  }
  return {};
};

const removeEvent = (index) => {
  events.value.splice(index, 1);
  updateEvents();
};
const updateEvents = () => {
  let currentMonth = livedMonths.value + 1;
  for (const event of events.value) {
    const duration = event.endMonth - event.startMonth + 1;
    event.startMonth = currentMonth;
    event.endMonth = currentMonth + duration - 1;
    currentMonth = event.endMonth + 1;
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(30, 20px);
  grid-gap: 2px;
  /* background: linear-gradient(#ff9800, #6ebeff, #f5ff85, #ff8e86, #ea9df7, #ff5ba2, #7df9ff); */
}

.month {
  width: 20px;
  height: 20px;
  background-color: #eee;
  /* cursor: pointer; */
  /* border-radius: 4px; */
}

.lived-month {
  background-color: #75da27;
  cursor: pointer;
}

.event-month {
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 5px;
}

button {
  margin-left: 5px;
}
.todays-month {
  background-color: #75da27;
  animation: blink 1.2s ease-in-out infinite;
  /* 过渡 */
  /* transition: backgroundColor 1s;  */
}
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
