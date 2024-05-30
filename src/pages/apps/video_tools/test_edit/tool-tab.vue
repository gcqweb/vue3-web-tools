<template>
    <div class="tab">
      字母
    </div>
    <div class="tool-content">
      <input type="text" v-model="text">
      <button @click="handleCreate">添加</button>
      <button @click="handleRender">渲染</button>
    </div>
  </template>
  
  <script setup>
  import {ref} from 'vue'
  const text = ref('')
  const emit = defineEmits(['create','render'])
  const handleCreate = () => {
      console.log("添加",text.value)
      emit('create', text.value)
      text.value = ''
  }
  const handleRender = () =>{
      console.log('渲染')
      emit('render')
  }
  </script>
  
  <style scoped>
  
  </style>
  
  