<script setup>
// "@ffmpeg/core": "^0.10.0",
// "@ffmpeg/ffmpeg": "^0.10.0",

import { ref, onMounted, onUnmounted } from 'vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
const fileType = ref("") // 视频文件类型

/**
 * 根据在线的视频地址截取片段
 * @param {string} url 在线视频链接
 * @param {number|string} startTime 截取开始时间
 * @param {number|string} endTime 截取结束时间
 * @param {Function} callBack 回调函数
 */
const videoCut = async (url, startTime, endTime, callBack) => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
    if(!url) return;

    fileType.value = url.split(".").pop()

    const inputName = `input.${fileType.value}`;
    const outputName = `output.${fileType.value}`;

    // 将输入文件保存到虚拟文件系统
    await ffmpeg.FS('writeFile', inputName, await fetchFile(url));

    // 运行 FFmpeg 命令
    try {
        await ffmpeg.run(
            '-ss', `${startTime}`,
            '-t', `${endTime - startTime}`,
            '-i', inputName,
            '-vcodec', 'copy',
            '-acodec', 'copy',
            outputName
        );

        // 读取输出文件
        let arrayBuffer = ffmpeg.FS('readFile', outputName).buffer; // 读取缓存

        // 创建下载链接并通过回调下载保存到本地
        const fileUrl = URL.createObjectURL(new Blob([arrayBuffer])); // 转为Blob URL
        callBack && callBack(fileUrl)

        // 释放内存
        ffmpeg.FS('unlink', inputName);
        ffmpeg.FS('unlink', outputName);
    } catch (e) { }
}

const downloadFile = (url, fileName = `clip.${fileType.value}`) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}

onMounted(() => {
    videoCut("https://视频.mp4", 0, 3, downloadFile)
})

onUnmounted(() => {
    ffmpeg.exit();
})
</script>
