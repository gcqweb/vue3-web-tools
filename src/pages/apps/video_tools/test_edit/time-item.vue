<template>
    <div class="line"
         draggable="true"
         :title="props.name"
         :style="{
        width:props.width + 'px',
        'margin-left':props.left + 'px',
        background:props.color
    }">
      {{ props.name }}
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
      name: { type: String, required: false,default:'文件名' },
      color: { type: String, required: false,default:'' },
      left:{type:Number,required:true,default:0},
      width:{type:Number,required:true,default:10},
  })
  </script>
  
  <style lang="less" scoped>
  @import "../index.less";
  .line{
    cursor: move;
    height: 20px;
    white-space: nowrap; /*不显示的地方用省略号...代替*/
    text-overflow: ellipsis; /* 支持 IE */
    line-height: 20px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: @border-color 1px solid;
    background-color: rgba(248, 235, 174, 0.78);
    user-select: none;
    overflow: hidden;
    &:last-child{
      border-bottom: none;
    }
  }
  </style>
  
  