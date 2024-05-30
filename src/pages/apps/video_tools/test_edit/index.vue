<template>
  <!-- ffmpeg js转换音频_实现纯前端下的音频剪辑处理
  https://blog.csdn.net/weixin_42344395/article/details/111969043 -->
  <!-- 源码 -->
  <!-- https://blog.csdn.net/sky529063865/article/details/129954456 -->
    <div class="app-container">
      <div class="resource-list">
        <div class="btn-bar">
          <input ref="uploadInput" v-show="false" type="file" multiple @change="changeFile"/>
          <button @click="addFile('media')">添加媒体</button>
          <button @click="addFile('font')">添加字体</button>
          <button @click="addDirectory">添加文件夹</button>
        </div>
        <div class="file-list">
          <resource-item
                  draggable="true"
                  v-for="(item,index) in mediaList"
                  :file="item"
                  :key="item.key"
                  @play="handlePlay(item)"
                  @del="handleDel(index)"
                  @dragstart.private="fileDragStart($event,item)"
                  @dragend.private="fileDragEnd($event,item)"
                  @dblclick="appendFile(item)"
          />
        </div>
      </div>
      <div class="view">
        <div class="window">
          <div class="screen">
            <video :src="previewSrc" controls autoplay></video>
          </div>
          <div class="screen">
            <video :src="renderSrc" controls autoplay></video>
          </div>
        </div>
        <div class="time-line"
             @dragenter="lineDragEnter"
             @dragleave="lineDragLeave"
             @dragover="lineDragOver"
             @drop="lineDropFile">
          <div
            class="line"
            draggable="true"
            v-for="(file,index) in timeLineList"
            :title="file.name"
            :style="{
                width:file.width + 'px',
                'margin-left':file.left + 'px',
                background:file.color
            }"
            :key="'timeLine' + file.key"
            @dragstart="lineDragStart($event,index)"
            @dragend="lineDragEnd"
            @dragenter="lineItemDragEnter($event,index)"
            @dragleave="lineItemDragLeave"
            @dragover="lineItemDragMove"
            @drop.prevent.stop="lineItemDropFile(index)"
          >{{ file.name }}
          </div>
        </div>
        <div class="tool-bar">
          <tool-tab @create="handleCreateText" @render="handleRender"/>
        </div>
      </div>
      <!--    加载弹窗-->
      <progress-dialog :title="progressTitle" v-if="progressVisible" :number="progressNumber" :count="progressCount"/>
      <!--    时间轴示例-->
      <div class="hidden">
          <div id="move" ref="moveBlock">
              {{ nowFile.name }}
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import ResourceFile from '@/view/ffmpeg/app/type/file.js'
  import { checkFontFile , checkMediaFile } from '@/view/ffmpeg/app/util.js'
  import ft from './ffmpeg.js'
  import { reactive , ref } from 'vue'
  import ResourceItem from './component/resource-item.vue'
  import ToolTab from './component/tool-tab.vue'
  import ProgressDialog from '@/view/ffmpeg/app/component/progress-dialog.vue'
  ft.instance()
  const uploadInput = ref(null)
  const previewSrc = ref('')
  const renderSrc = ref('')
  // 进度条
  const progressTitle = ref('')
  const progressNumber = ref(0)
  const progressCount = ref(100)
  const progressVisible = ref(false)
  // 媒体资源 图片 视频 音频
  const mediaList = reactive([])
  // 字体资源
  const fontList = reactive([])
  // 添加文件
  let addType = ''
  
  const addDirectory = () => {
      console.log("未实现")
      alert('未实现')
  }
  const addFile = (type) => {
    addType = type
    uploadInput.value.click()
  }
  // 选择文件
  const changeFile = function (e) {
    const files = e.target.files
    const mediaLoadList = []
    const fontLoadList = []
    console.log('文件列表',files)
    for ( let i = 0 ; i < files.length ; i++ ) {
      const file = new ResourceFile(files[i])
      console.log('文件',file)
      file.setSize('AUTO')
      if(addType === 'media'){
        if(checkMediaFile(file)){
          file.setMedia()
          mediaLoadList.push(file)
          // mediaList.push(file)
          continue
        }
      }
      if(addType === 'font'){
        if(checkFontFile(file)){
          file.setFont()
          fontLoadList.push(file)
          // fontList.push(file)
        }
      }
    }
      if(addType === 'media'){
          loadMediaFile(mediaLoadList)
      }
      if(addType === 'font'){
          loadFontFile(fontLoadList)
      }
  
  
  }
  // 加载文件
  const loadMediaFile = async (list) => {
    console.log('加载文件',list)
    openLoadProgress(list.length,'加载资源文件')
    let i = 0
    for ( const file of list ) {
      await ft.loadFile(file)
      mediaList.push(file)
      i++
      setLoadProgressNumber(i)
    }
    setTimeout(() => {
      closeLoadProgress()
    },100)
  }
  const loadFontFile = async (list) => {
    console.log('加载文件',list)
    openLoadProgress(list.length,'加载字体文件')
    let i = 0
    for ( const file of list ) {
      await ft.loadFile(file)
      fontList.push(file)
      i++
      setLoadProgressNumber(i)
    }
    setTimeout(() => {
      closeLoadProgress()
    },100)
  }
  
  const handlePlay = (file) => {
    console.log("播放文件",file)
    previewSrc.value=file.url
  }
  const handleDel = (index) => {
    console.log("删除文件",index)
    mediaList.splice(index,1)
  }
  // 打开进度条
  const openLoadProgress = (count,title = '加载中') => {
    progressVisible.value = true
    progressCount.value = count
    progressNumber.value = 0
    progressTitle.value = title
  }
  // 设置进度条值
  const setLoadProgressNumber = (val) => {
    progressNumber.value = val
  }
  // 关闭进度条
  const closeLoadProgress = () => {
    progressVisible.value = false
    progressCount.value = 0
    progressNumber.value = 0
    progressTitle.value = ''
  }
  
  import Line from './type/line.js'
  // 时间轴
  const timeLineList = ref([])
  const moveStartPosition = ref({x:0,y:0})
  let moveIndex = ''
  let moveIn = ''
  // 拖动类型
  let dragType = 'create'
  // 拖动的当前文件
  const nowFile = ref({})
  // 拖动的dom
  const moveBlock = ref( null )
  // 是否拖入时间揍
  const lineIn = ref( false )
  /**
   * 文件列表拖拽开始
   * @param $event
   * @param file
   */
  const fileDragStart = ( $event , file ) => {
      console.log( '文件列表拖拽开始' , $event , file )
      dragType = 'create'
      nowFile.value = file
      let width = nowFile.value.duration * 2
      moveBlock.value.style.width = (width > 270 ? 270 : width) + 'px'
      $event.dataTransfer.setDragImage( moveBlock.value , 0 , 0 )
  }
  /**
   * 文件列表拖拽结束
   * @param $event
   * @param file
   */
  const fileDragEnd = ( $event , file ) => {
      console.log( '文件列表拖拽结束' , $event , file )
      lineIn.value = false
  }
  /**
   * 添加到时间轴最后
   * @param item
   */
  const appendFile = (item)=> {
      console.log('双击添加',item)
      const file = new Line(item)
      file.setMedia()
      console.log( 'file' , file )
      timeLineList.value.push( file )
  }
  
  /**
   * 时间轴放入
   * @param index
   */
  const lineItemDropFile = ( index ) => {
      console.log( '时间轴放入' , index )
      // 放在某个轴上
      if ( dragType === 'create' ) {
          const file = new Line(mediaList[index])
          file.setMedia()
          console.log( 'file' , file )
          timeLineList.value.splice(index,0,file)
      }
      // 移动
      if ( dragType === 'move' ) {
          console.log( '移动' ,moveIndex,index)
          let list = timeLineList.value
          if(moveIndex > index){
              const item = timeLineList.value[moveIndex]
              list.splice(moveIndex,1)
              list.splice(index,0,item)
          }else{
              const item = timeLineList.value[moveIndex]
              console.log('移动',item,list)
              list.splice(moveIndex,1)
              list.splice(index,0,item)
              console.log("移动到后面",list)
          }
          timeLineList.value = list
      }
  }
  const lineDragStart = ( $event , index ) => {
      console.log( '时间轴拖动开始' , index,$event )
      dragType = 'move'
      moveIndex = index
      moveStartPosition.value.x = $event.pageX
      moveStartPosition.value.y = $event.pageY
  }
  /**
   * 时间轴拖动结束
   * @param $event
   * @constructor
   */
  const lineDragEnd = ( $event ) => {
      console.log( '时间轴拖动结束' , $event )
      console.log('移动了',$event.pageX - moveStartPosition.value.x,$event.pageY-moveStartPosition.value.y)
      timeLineList.value[moveIndex].left+=$event.pageX - moveStartPosition.value.x
      moveStartPosition.value.x = 0
      moveStartPosition.value.y = 0
      moveIndex = ''
  }
  /**
   * 时间轴内容进入
   * @param $event
   * @constructor
   */
  const lineItemDragEnter = ( $event,index ) => {
      console.log( '时间轴进入' , $event )
      $event.preventDefault(); //阻止默认事件
      moveIn = index
  }
  /**
   * 时间轴内容离开
   * @param $event
   * @constructor
   */
  const lineItemDragLeave = ( $event  ) => {
      console.log( '时间轴离开' , $event )
      $event.preventDefault(); //阻止默认事件
      moveIn = ''
  }
  /**
   * 时间轴内容移动
   * @param $event
   */
  const lineItemDragMove = ($event) => {
      console.log("拖拽移动",$event)
      console.log('移动了',$event.pageX - moveStartPosition.value.x,$event.pageY-moveStartPosition.value.y)
  }
  /**
   * 时间轴进入
   * @param $event
   * @constructor
   */
  const lineDragEnter = ( $event ) => {
      console.log( '时间列表进入' , $event )
      $event.preventDefault(); //阻止默认事件
      lineIn.value = true
  }
  
  /**
   * 时间轴离开
   * @param $event
   * @param file
   * @constructor
   */
  const lineDragLeave = ( $event , file ) => {
      console.log( '时间列表离开' , $event )
      $event.preventDefault(); //阻止默认事件
      lineIn.value = false
  }
  
  /**
   * 时间轴阻止默认
   * @param $event
   * @constructor
   */
  const lineDragOver = ( $event ) => {
      $event.preventDefault(); //阻止默认事件
  }
  
  /**
   * 时间轴放入
   * @param $event
   */
  const lineDropFile = ( $event ) => {
      console.log( '时间列表放入' ,dragType, $event )
      // 放在空的地方
      if ( dragType === 'create' ) {
          let file = new Line(nowFile.value)
          file.setMedia()
          console.log( 'file' , file )
          timeLineList.value.push( file )
      }
  }
  
  const handleCreateText = (text) => {
      let data = {
          key : '',
          name : text,
          duration : 30,
          left : 0
      }
      const item = new Line(data)
      item.setText()
      item.setFont(fontList[0].getFSName())
      console.log('添加',item,fontList[0].getFSName())
      timeLineList.value.push(item)
  }
  const handleRender = () => {
      console.log("渲染视频")
      let args = ft.generateArgs(timeLineList.value)
      ft.run( args )
      console.log('ft.progress',ft.progress)
      openLoadProgress(100,'渲染中')
      ft.updateProgress = updateRender
  }
  const updateRender = (progress) => {
      setLoadProgressNumber(parseInt(progress.ratio))
      if(progress.ratio >= 100) {
          setTimeout(() => {
              closeLoadProgress()
              previewRender()
          },1000)
  
      }
  }
  const previewRender = () => {
      ft.readFile(ft.renderFileName).then(res => {
          console.log("文件",res)
          renderSrc.value = res
      })
  }
  window.ft = ft
  </script>
  
  <style lang="less" scoped>
  @import "index.less";
  .app-container{
    width: 100vw;
    height: 100vh;
    display: flex;
    position: relative;
  }
  .resource-list{
    display: flex;
    flex-direction:column;
    width: @resource-width;
    height: 100%;
    box-sizing: border-box;
    border-right:  @border-color 1px solid;
    .btn-bar{
      display: flex;
      border-bottom: @border-color 1px solid;
      button{
        flex: 1;
        margin:5px;
      }
    }
    .file-list{
      width: 300px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .view{
    flex: 1;
    display: flex;
    flex-direction:column;
    .window{
      flex:1;
      box-sizing: border-box;
      border-bottom: @border-color 1px solid;
      display: flex;
      .screen{
        flex: 1;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        &:first-child{
          border-right: @border-color 1px solid;
        }
        video{
          width: 100%;
          max-height: 100%;
          //max-width: 1024px;
          //max-height: 768px;
        }
      }
    }
    .time-line{
      width: calc(100vw - @resource-width);
      height: 300px;
      box-sizing: border-box;
      border-bottom: @border-color 1px solid;
      overflow-x: scroll;
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
    }
    .tool-bar{
      height: 100px;
      box-sizing: border-box;
    }
  }
  
  .hidden {
    position: fixed;
    left: 0;
    top: -100px;
  
    #move {
      min-width: 20px;
      height: 20px;
      background: red;
      border: 1px solid #07b3c9;
      overflow: hidden;
    }
  }
  </style>
  
  