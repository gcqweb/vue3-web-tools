<template>
  <div class="color-converter">
    <input v-model="inputColor" placeholder="输入颜色值 (#RRGGBB)" />
    <input type="color" v-model="inputColor" />
    <!-- <space></space> -->
    rgb<input v-model="inputColor" placeholder="输入颜色值 (#RRGGBB)" />
    <div v-if="isValidColor">
      <p>RGB: {{ color.rgb().join(", ") }}</p>
      <p>RGBA: {{ color.rgba().join(", ") }}</p>
      <p>HSL: {{ color.hsl().join(", ") }}</p>
      <!-- <p>HWB: {{ color.hwb().join(', ') }}</p> -->
      <p>LCH: {{ color.lch().join(", ") }}</p>
      <p>OKLCH: {{ color.oklch().join(", ") }}</p>
      <p>LAB: {{ color.lab().join(", ") }}</p>
      <p>OKLAB: {{ color.oklab().join(", ") }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import chroma from "chroma-js";

const inputColor = ref("#666666");
const color = computed(() => {
  try {
    return chroma(inputColor.value);
  } catch (e) {
    return null;
  }
});

const isValidColor = computed(() => {
  try {
    chroma(inputColor.value);
    return true;
  } catch (e) {
    return false;
  }
});
</script>

<style>
.color-converter {
  margin: 20px;
}
input[type="color"] {
  margin-left: 10px;
}
</style>
