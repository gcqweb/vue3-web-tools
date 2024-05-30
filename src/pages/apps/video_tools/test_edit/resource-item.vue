<template>
    <div class="line" :title="file.toString()">
      <div class="icon">
        <img v-if="file.cover" :src="file.cover"/>
        <span v-else>无图</span>
      </div>
      <div class="info">
        <div class="play" @click="handlePlay">播</div>
        <div class="del" @click="handleDel">删</div>
        <div class="file-type">
          <div class="mp4" v-if="file.ext === 'mp4'">mp4</div>
          <div class="mp3" v-if="file.ext === 'mp3'">mp3</div>
        </div>
        <div class="filename" :title="file.name">{{ file.name }}</div>
        <div class="k-box-flex">
          <div class="size k-flex-1">{{ file.durationStr }}</div>
  <!--        <div class="size k-flex-1">{{ file.sizeStr }}</div>-->
          <div class="date">{{ file.sizeStr }}</div>
  <!--        <div class="date">{{ file.lastModifiedDateStr }}</div>-->
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import ResourceFile from '@/view/ffmpeg/app/type/file.js'
  import { toRef } from 'vue'
  const emit = defineEmits(['del','play'])
  const props = defineProps({
    file: { type: Object, required: true,default:() => new ResourceFile() }
  })
  const file = toRef(props, 'file')
  const handleDel = () => {
    console.log("点删除")
    emit('del')
  }
  const handlePlay = () => {
    console.log("点播放")
    emit('play')
  }
  </script>
  
  <style lang="less" scoped>
  @import "../index.less";
  .line{
    user-select: none;
    box-sizing: border-box;
    border: @resource-border-color solid 1px;
    height: 50px;
    display: flex;
    .icon{
      width: 50px;
      box-sizing: border-box;
      border: 1px dashed #999;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      img{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .info{
      flex: 1;
      position: relative;
      padding-top: 5px;
      .del{
        position: absolute;
        right: 5px;
        top: 5px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        background-color: palevioletred;
        font-size: 10px;
        color:#fff;
        cursor: pointer;
        border-radius: 2px;
      }
      .play{
        position: absolute;
        right: 25px;
        top: 5px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        background-color: palevioletred;
        font-size: 10px;
        color:#fff;
        cursor: pointer;
        border-radius: 2px;
      }
      .file-type{
        position: absolute;
        right: 40px;
        top: 5px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        font-size: 10px;
        border-radius: 2px;
        padding:0 5px;
        .mp4{
          color:#fff;
          background-color: #07b3c9;
        }
        .mp3{
          color:#fff;
          background-color: #d9b608;
        }
      }
      .filename{
        font-size: 6px;
        width: 220px;
        height: 20px;
        overflow: hidden;
        white-space:nowrap;/*不显示的地方用省略号...代替*/
        text-overflow:ellipsis;/* 支持 IE */
      }
      .size{
        font-size: 6px;
        text-align: left;
      }
      .date{
        font-size: 6px;
        text-align: right;
        margin-right: 5px;
      }
    }
  }
  </style>