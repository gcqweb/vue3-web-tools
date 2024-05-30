<template>
    <div class="dialog-content">
      <div class="dialog-box">
        <div class="header">
          {{ props.title }}
        </div>
        <div class="content">
          <div class="progress">
            <div class="box">
              <div class="value" >
                {{ props.number }}/{{ props.count }}
              </div>
              <div class="percent" :style="progress()">
                {{ props.number }}/{{ props.count }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
    
    <script setup>
    const props = defineProps({
      title: { type: String, required: false,default:'加载中' },
      number:{type:Number,required:true,default:0},
      count:{type:Number,required:true,default:100},
    })
    const progress = () => {
      let percent = props.number / props.count
      percent = percent > 1 ? 1 : percent
      percent = percent * 460
      // console.log('百分比',percent)
      const style = {
        clip:'rect(0px, ' + percent  + 'px, 20px, 0px)'
      }
      // console.log('style',style)
      return style
    }
    </script>
    
    <style lang="less" scoped>
    .dialog-content{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dialog-box{
      width: 500px;
      //height: 100px;
      background-color: #fff;
      box-shadow: 0 0 10px #222222;
      border-radius: 5px;
      .header{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #999;
      }
      .content{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
      }
    }
    .progress{
      height: 20px;
      margin-left: 20px;
      margin-right: 20px;
      border:1px solid #222;
      width: 100%;
      position: relative;
      .box{
        position: relative;
      }
      .percent{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #dc3562;
        color:#fff;
        height: 20px;
        transition: all 0.1s;
        width: 100%;
        text-align: center;
        clip:rect(0px,0px,20px,0px);
      }
      .value{
        position: absolute;
        top: 1px;
        left: 0;
        right: 0;
        text-align: center;
        height: 20px;
        line-height: 20px;
        color:#000;
      }
    }
    </style>
    
    