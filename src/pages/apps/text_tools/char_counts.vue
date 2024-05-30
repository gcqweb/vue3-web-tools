<template>
  <section class="char-counts">
    
  
    <!-- <input type="text" v-model="inputText" placeholder="请输入" /> -->
    <a-textarea v-model:value="inputText" show-count  />
    <div style="display:block">
      <a-statistic title="数字" :value="charCounts.numbers" style="margin-right: 50px" />
      <p>数字：{{ charCounts.numbers }}</p>
      <p>英文字母: {{ charCounts.englishLetters }}</p>
      <p>汉字: {{ charCounts.chineseCharacters }}</p>
      <p>中文符号: {{ charCounts.chineseSymbols }}</p>
      <p>英文标点符号: {{ charCounts.englishPunctuation }}</p>
      <p>特殊字符: {{ charCounts.specialChars }}</p>
    </div>
    <!-- <input v-model="unicode2Char" placeholder="请输入" />
    <button @click="toUnicode">字符转Unicode</button>
    <button @click="fromUnicode">Unicode转字符</button>
    {{unicode2Char}} -->
    <!-- <input v-model="htmlString" @blur="encodeHtml" placeholder="Enter HTML here" />
  <input v-model="encodedHtml" @blur="decodeHtml" placeholder="Encoded HTML appears here" /> -->
</section>
  </template>

<script setup>
import { ref, computed } from 'vue';

const inputText = ref('');

const charCounts = computed(() => {
    const counts = {
        numbers: (inputText.value.match(/\d/g) || []).length,
        englishLetters: (inputText.value.match(/[a-zA-Z]/g) || []).length,
        chineseCharacters: (inputText.value.match(/[\u4e00-\u9fa5]/g) || []).length,
        chineseSymbols: (inputText.value.match(/[\u3000-\u303f]/g) || []).length,
        englishPunctuation: (inputText.value.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g) || []).length,
        specialChars: (inputText.value.match(/[^a-zA-Z0-9\u4e00-\u9fa5.,\/#!$%\^&\*;:{}=\-_`~()]/g) || []).length
    };
    return counts;
});



// ---------------------
const unicode2Char = ref('')
// 字符转Unicode
function toUnicode(str=unicode2Char.value) {
  // let str =unicode2Char.value;
  return str.split('').map(char => 'U+' + char.charCodeAt(0).toString(16).toUpperCase()).join(' ');
}

// Unicode转字符
function fromUnicode(unicodeStr=unicode2Char.value) {
  return unicodeStr.split(' ').map(u => String.fromCharCode(parseInt(u.slice(2), 16))).join('');
}

// ---------------------------
// HTML标签和编码相互转换
// npm install he

// import he from 'he';

const htmlString = ref('Sally & Jack <div>');
const encodedHtml = ref('');

// Encode HTML
function encodeHtml() {
  encodedHtml.value = he.encode(htmlString.value);
}

// Decode HTML
function decodeHtml() {
  htmlString.value = he.decode(encodedHtml.value);
}
</script>
<style scoped>

.char-counts{
  padding: 1rem;
  
}
</style>

