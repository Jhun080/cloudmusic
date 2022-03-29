<!-- 录播图组件 -->
<template>
  <div class="carousel-nav">
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="(carousel,index) in carouselData" :key="index">
        <img :src="carousel.pic" @click="toDetailInfo(carousel.url)">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: ['carouselData'],
  data () {
    return {

    }
  },
  methods: {
    // 跳转轮播图内容至详情页
    toDetailInfo (url) {
      location.href = url
    }
  }
}
</script>

<style lang="less" scoped>
.carousel-nav{
  width: 100%;
}

// 轮播图样式
.my-swipe .van-swipe-item {

  color: #fff;
  text-align: center;

  img{
    width: 90%;
    border-radius: 10px;
  }
}
</style>
