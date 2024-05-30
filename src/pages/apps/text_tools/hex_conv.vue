<template>
    <div>
      <input type="file" @change="handleFileUpload" />
      <pre>{{ hexContent }}</pre>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const hexContent = ref('');
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = new Uint8Array(e.target.result);
    //   hexContent.value=buffer.toString(2);
      const hexArray = Array.from(buffer, byte => byte.toString(16).padStart(2, '0'));
      hexContent.value = hexArray.join(' ');
      console.log(`File length in bytes: ${buffer.length}`);
    };
    reader.readAsArrayBuffer(file);
  }
  </script>
  
  <style scoped>
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  </style>