<template>
    <input type="file" @change="fileChange">
</template>

<script setup>
// npm install @ffmpeg/ffmpeg@^0.10.0

// npm install @ffmpeg/core@^0.10.0

//获取视频画面截图
import { ref, onUnmounted } from 'vue'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
const fileType = ref("") // 视频文件类型

const fileChange = (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    fileType.value = file.name.split(".").pop()

    // 由于这里一秒截取一帧 ，截取5次， 所以如果视频不足5秒会导致截取和读取失败
    // 回调中是base64图片组成的数组，需要在前面拼接 "data:image/png;base64," ,然后在img的src中赋值即可
    videoFrame(file, 5, 1, (data) => console.log(data))
}

/**
 * 根据选择的视频文件获取视频截图
 * @param {file} file 选择的视频文件
 * @param {number|string} count 截取图片的次数
 * @param {number|string} interval 截取图片的间隔
 * @param {Function} callBack 回调
 */
const videoFrame = async (file, count, interval, callBack) => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
    if(!file) return;

    const inputName = `input.${fileType.value}`;

    const orgFileBuffer = await file.arrayBuffer()

    // 将输入文件保存到虚拟文件系统
    await ffmpeg.FS('writeFile', inputName, await fetchFile(new Blob([orgFileBuffer])));

    try {
        await ffmpeg.run(
            "-i",
            inputName,
            "-r",
            `${interval}`,
            "-ss",
            "0",
            "-vframes",
            `${count}`,
            "-f",
            "image2",
            "-s",
            "88*50",
            "image-%02d.png"
        );
        const baseArr = []

        for (let i = 0; i < count; i++) {
            let temp = i + 1;
            if (temp < 10) {
                temp = "0" + temp;
            }
            baseArr.push(
                arrayBufferToBase64(ffmpeg.FS("readFile", "image-" + temp + ".png"))
            );
        }

        callBack && callBack(baseArr)

        // 释放内存
        ffmpeg.FS('unlink', inputName);
    } catch (e) {}
}

const arrayBufferToBase64 = (array) => {
    array = new Uint8Array(array);
    var length = array.byteLength;
    var table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
    var base64Str = "";
    for (var i = 0; length - i >= 3; i += 3) {
        var num1 = array[i];
        var num2 = array[i + 1];
        var num3 = array[i + 2];
        base64Str +=
            table[num1 >>> 2] +
            table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
            table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
            table[num3 & 0b111111];
    }
    var lastByte = length - i;
    if (lastByte === 1) {
        var lastNum1 = array[i];
        base64Str +=
            table[lastNum1 >>> 2] + table[(lastNum1 & 0b11) << 4] + "==";
    } else if (lastByte === 2) {
        // eslint-disable-next-line no-redeclare
        var lastNum1 = array[i];
        var lastNum2 = array[i + 1];
        base64Str +=
            table[lastNum1 >>> 2] +
            table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
            table[(lastNum2 & 0b1111) << 2] +
            "=";
    }
    return base64Str
}

onUnmounted(() => {
    ffmpeg.exit();
})
</script>