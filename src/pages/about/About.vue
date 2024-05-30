<template>
  <section class="support">
    <div class="left">
      <div class="describe">
        <h2>About</h2>
        <br />
        <h3>首先感谢您关注「」！</h3>
        <br />
        <p>
          「」为了给大家带来更好的浏览体验，网站从来不放任何广告，由于每年都<span style=" position: relative;"><img class="love-img" src="https://gw.alipayobjects.com/zos/bmw-prod/8e0650ba-8432-43aa-b7b0-82fd83509619.svg" width="100" height="72" style="left: 0px;
    top: -16px;
    position: absolute;
    width: 6rem;
    height: 3rem;
    object-fit: unset;">（为爱发电😎）</span>需要支付不少的网站服务器、域名、CDN、维护等各种费用，为了维持网站的正常运营，希望得到大家的支持。
          本站为非盈利性站点，赞助群仅仅作为用户喜欢本站捐赠打赏，本站不贩卖软件，所有内容不作为商业行为。
        </p>
        <br /><br /><br /><br />
        <h3>打赏赞助</h3>
        <br />
        <p>
          如果您觉得「」帮助了您，那么可以打赏一下，请编辑部吃个小零食、喝一杯咖啡或进「」赞助群，赞助群门槛会随着网站维护费用的变动，不定时进行动态调整！
        </p>
        <br />
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4rem;
          "
        >
          <div><img src="@/assets/banner2.png" alt="" /><br> 方式1</div>
          <div><img src="@/assets/banner2.png" alt="" /> <br>方式1</div>
          <div><img src="@/assets/banner2.png" alt="" /> <br>方式1</div>
        </div>
      </div>
    </div>
    <div class="right">right</div>
  </section>
</template>

<script setup>
import { reactive, ref, watch, h, onMounted, onUnmounted } from "vue";
</script>

<style scoped>
.support {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 1rem;
  gap: 2rem;
}
.left {
  flex: 1;
  background-color: antiquewhite;
}
.right {
  width: 260px;
  height: 90vh;
  background-color: aquamarine;
}
.describe {
  padding: 3rem 5rem;
}
img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
</style>
