<template>
  <section class="main-container">
    <div class="background-1"></div>
    <div class="background-2"></div>
    <div class="background-upper">
      <h1 class="title">Hello World</h1>
      <button class="download" @click="fn">点击下载</button>
    </div>
  </section>
  <canvas id="c"></canvas>
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted } from "vue";
function fn() {
  var c = document.getElementById("c"),
    ctx = c.getContext("2d"),
    cw = (c.width = window.innerWidth),
    ch = (c.height = window.innerHeight),
    paper = new Image(200, 200),
    ink = new Image(75, 100), // Dimensions of the viewable area, not the entire sprite-sheet
    numFrames = 7,
    n = 0,
    data = {};
  paper.src = "@/assets/banner.jpg";
  ink.src = "@/assets/banner.jpg";
  window.addEventListener("load", function () {
    window.addEventListener("touchstart", function (e) {
      e.preventDefault();
      setData(e.touches[0].clientX, e.touches[0].clientY);
      setTween();
    });

    window.addEventListener("click", function (e) {
      setData(e.offsetX, e.offsetY);
      setTween();
    });

    drawBg();

    // First run, generate a few drips
    for (var i = 0; i < 5; i++) {
      setData(
        cw / 2 - 150 + 200 * Math.random(),
        ch / 2 - 100 + 200 * Math.random()
      );
      setTween(i / 10);
    }
  });
}
function setData(inputX, inputY) {
  n < 3 ? n++ : (n = 0);
  data = {
    frame: 0,
    x: inputX,
    y: inputY,
    s: 75 * n,
    scale: 0.7 + Math.random() * 0.5,
    rotate: Math.random() * Math.PI * 2,
  };
}

function setTween(delay = 0) {
  TweenMax.to(data, 0.45, {
    delay: delay,
    frame: numFrames,
    ease: SteppedEase.ease.config(numFrames),
    onUpdate: run,
    onUpdateParams: [data],
  });
}

function drawBg(alpha = 1) {
  var pattern = ctx.createPattern(paper, "repeat");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pattern; //'#fff';
  ctx.fillRect(0, 0, cw, ch);
}

function run(data) {
  // Thank you @Shaw for help with the random scale+rotation - https://codepen.io/shshaw/
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transforms from previous draws
  ctx.globalCompositeOperation = "source-atop"; // Fade old drops by redrawing background texture
  drawBg(0.01); //
  ctx.globalAlpha = 1; // Restore globalAlpha that was modified in drawBg()
  ctx.translate(data.x, data.y); // Translate over to the mouse position to center your scaling & rotation on that point
  ctx.scale(data.scale, data.scale); // Randomized scale
  ctx.rotate(data.rotate); // Randomized rotation in radians
  ctx.translate(-data.x, -data.y); // Move back to the starting position
  ctx.globalCompositeOperation = ["darken", "multiply"][
    Math.round(Math.random())
  ];
  ctx.drawImage(
    ink,
    data.s,
    data.frame * ink.height,
    ink.width,
    ink.height,
    data.x - 33,
    data.y - ink.height / 2,
    ink.width,
    ink.height
  );
}

window.addEventListener("resize", function () {
  cw = c.width = window.innerWidth;
  ch = c.height = window.innerHeight;
  drawBg();
});
</script>

<style scoped>
.main-container {
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 50px 10px;
  background-color: #5ab0b6;
  height: 500px;
}
.background-1 {
  z-index: 0;
  width: 200px;
  height: 200px;
  left: 300px;
  top: 0;
  background-image: linear-gradient(
    to right top,
    #70a9ff,
    #42c9ff,
    #00d3ff,
    #32eaec,
    #92fddb
  );
  border-radius: 100%;
  position: absolute;
}
.background-2 {
  z-index: 0;
  width: 300px;
  height: 300px;
  right: 200px;
  margin-bottom: 0%;
  background-image: linear-gradient(
    to right top,
    #ff4f70,
    #ff646a,
    #ff7866,
    #ff8a66,
    #ff9b69
  );
  border-radius: 37% 63% 63% 37%/31% 39% 61% 69%;
  position: absolute;
}

.background-upper {
  z-index: 0;
  width: 380px;
  height: 85%;
  margin-top: 40px;
  position: absolute;
  background-color: #ffffff40;
  backdrop-filter: blur(15.5px);
  -webkit-backdrop-filter: blur(15.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: #8e8e8e30 0 6px 15px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 13px;
  -webkit-border-radius: 13px;
  color: #ffffffbf;
}
.title {
}
.download {
  width: auto;
  background-color: #ffffff40;
  backdrop-filter: blur(6.5px);
  -webkit-backdrop-filter: blur(6.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: #8e8e8e30 0 6px 15px;
  -webkit-box-shadow: rgba(142, 142, 142, 0.19) 0px 6px 15px 0px;
  border-radius: 20px;
  -webkit-border-radius: 13px;
  color: #fff;
  padding: 8px 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  margin-bottom: 20px;
}
</style>
