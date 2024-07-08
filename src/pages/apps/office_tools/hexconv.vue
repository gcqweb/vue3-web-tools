<template>
  <section class="hex-conv">
    <a-space direction="vertical" block>
      <h2>进制转换</h2>
      <p>
        支持2~36进制之间的相互转换，支持<a-typography-text type="success"
          >浮点型</a-typography-text
        >（小数保留<input
          v-model.number="decimalPlaces"
          type="number"
          min="0"
          max="100"
        />位）
      </p>

      <br />
      <a-space>
        <!-- <label>输入进制</label> -->
        <a-radio-group v-model:value="inputBase" :options="hexRadio" />
        <a-select
          v-model:value="inputBase"
          style="width: 100px"
          :options="hexOptions"
        ></a-select>
        <!-- <select v-model="inputBase">
          <option v-for="base in bases" :key="base" :value="base">
            {{ base }}进制
          </option>
        </select> -->
      </a-space>

      <div class="conv-input">
        <label>转换数字</label>
        <a-input
          style="flex: 1"
          placeholder="请输入数字"
          v-model:value="number"
          type="text"
          @change="convert"
        />
      </div>
      <div></div>
      <br />
      <a-space>
        <!-- <label>输出进制</label> -->
        <a-radio-group v-model:value="outputBase" :options="hexRadio" />
        <a-select
          v-model:value="outputBase"
          style="width: 100px"
          :options="hexOptions"
        ></a-select>
        <!-- <select v-model="outputBase">
          <option v-for="base in bases" :key="base" :value="base">
            {{ base }}进制
          </option>
        </select> -->
      </a-space>

      <div class="conv-input">
        <label>转换结果</label>
        <!-- <a-input v-model:value="result" type="text" readonly />
        <a-button @click="copyFn(result)">复制</a-button> -->
        <a-input v-model:value="result" style="flex: 1" readonly>
          <template #addonAfter>
            <span @click="copyFn(result)" class="copy-btn">复制</span>
          </template>
        </a-input>
      </div>

      <a-button style="width: 30%" type="primary" shape="round" @click="convert"
        >转换</a-button
      >
    </a-space>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard();

const bases = Array.from({ length: 35 }, (_, i) => i + 2);
const hexOptions = [...Array(35)].map((_, i) => ({
  value: i + 2,
  label: `${i + 2}进制`,
}));
const hexRadio = [2, 4, 8, 10, 16, 32].map((base) => ({
  value: base,
  label: `${base}进制`,
}));
const inputBase = ref(10);
const outputBase = ref(2);
const number = ref("");
const result = ref("");
const decimalPlaces = ref(10); // Default to 10 decimal places

watch([inputBase, outputBase, decimalPlaces], () => convert());
const convert2 = () => {
  if (!number.value) {
    result.value = "";
    return;
  }
  try {
    const num = parseInt(number.value, inputBase.value);
    result.value = num.toString(outputBase.value);
  } catch (e) {
    result.value = "Invalid number";
  }
};

const convert = () => {
  const num = Number(number.value);
  if (!number.value || isNaN(num)) {
    result.value = "";
    return;
  }
  try {
    const [integerPart, fractionalPart] = number.value.split(".");

    // Convert integer part
    const integerNum = parseInt(integerPart, inputBase.value);
    let resultInteger = integerNum.toString(outputBase.value);

    if (fractionalPart !== undefined) {
      // Convert fractional part
      let fraction =
        parseInt(fractionalPart, inputBase.value) /
        Math.pow(inputBase.value, fractionalPart.length);
      let resultFraction = "";

      for (let i = 0; i < decimalPlaces.value; i++) {
        // Use the user-defined decimal places
        fraction *= outputBase.value;
        const digit = Math.floor(fraction);
        resultFraction += digit.toString(outputBase.value);
        fraction -= digit;

        if (fraction === 0) break; // Stop if there is no remainder
      }

      result.value = resultInteger + "." + resultFraction;
    } else {
      result.value = resultInteger;
    }
  } catch (e) {
    result.value = "Invalid number";
  }
};
const copyFn = async (text) => {
  if (!text) return;
  try {
    await toClipboard(text.toString());
    message.success("已复制到剪切板");
  } catch (e) {
    console.error(e);
    message.error("剪切板异常，请刷新后重试！");
  }
};
</script>

<style>
.hex-conv {
  padding: 1.2rem;
  width: 1000px;
  margin: 0 auto;
  margin-top: 1rem;
  /* border: 2px solid #ccc; */
}
.copy-btn {
  user-select: none;
}
.conv-input {
  display: flex;
  gap: 8px;
  align-items: center;
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
  .hex-conv {
    width: 100%;
    height: auto;
  }
}
</style>
