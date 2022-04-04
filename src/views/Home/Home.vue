<!-- 首页 -->
<template>
  <div>
    <!-- 录播图组件 -->
    <Carousel
     :carouselData="carouselData">
    </Carousel>
    <!-- 圆形图标 -->
    <div class="func-nav">
      <div class="round-icon">
        <div class="icon" @click="tipInfo">
          <img src="@/assets/home/songrcmd.png">
        </div>
        <div class="title">每日推荐</div>
      </div>
      <div class="round-icon">
        <div class="icon" @click="tipInfo">
          <img src="@/assets/home/privatefm.png">
        </div>
        <div class="title">私人FM</div>
      </div>
      <div class="round-icon">
        <div class="icon" @click="tipInfo">
          <img src="@/assets/home/playlistCollection.png">
        </div>
        <div class="title">歌单</div>
      </div>
      <div class="round-icon">
        <div class="icon" @click="tipInfo">
          <img src="@/assets/home/rank.png">
        </div>
        <div class="title">排行榜</div>
      </div>
      <div class="round-icon">
        <div class="icon" @click="tipInfo">
          <img src="@/assets/home/album.png">
        </div>
        <div class="title">数字专辑</div>
      </div>
    </div>
    <!-- 分割线 -->
    <van-divider/>
    <!-- 歌单展示区 -->
    <SongShowZone
      title="推荐歌单"
      :songDatas="recommendSongSheet"
      >
    </SongShowZone>
    <!-- 分割线 -->
    <van-divider />

    <!-- 测试 -->
    <SongShowZone
      title="推荐歌单"
      :songDatas="recommendSongSheet"
      >
    </SongShowZone>
    <!-- 分割线 -->
    <van-divider />
    <!-- 测试 -->
    <SongShowZone
      title="推荐歌单"
      :songDatas="recommendSongSheet"
      >
    </SongShowZone>
    <!-- 分割线 -->
    <van-divider />
  </div>
</template>

<script>
import Carousel from '@/components/Carousel/Carousel'
import SongShowZone from '@/components/SongShowZone/SongShowZone.vue'
import { Toast } from 'vant'

export default {
  name: 'home',
  components: {
    Carousel,
    SongShowZone
  },
  data () {
    return {
      // 首页轮播图数据
      carouselData: [],
      // 获取圆形图标
      ballData: [],
      // 推荐歌单数据
      recommendSongSheet: []
    }
  },
  mounted () {
    // 获取首页轮播图数据
    this.getCarouselData()
    // 获取圆形图标数据
    this.getBallData()
    // 获取推荐歌单数据
    this.getRecommendSongSheet(6)
  },
  methods: {
    // 获取首页轮播图数据
    async getCarouselData () {
      const result = await this.$API.reqGetCarousel()
      if (result.code === 200) {
        this.carouselData = result.banners
      }
    },
    // 获取圆形图标数据
    async getBallData () {
      const result = await this.$API.reqGetBall()
      if (result.code === 200) {
        this.ballData = result.data
      }
    },
    // 获取推荐歌单数据
    async getRecommendSongSheet (limit = 6) {
      const result = await this.$API.reqGetRecommendSongSheet(limit)
      if (result.code === 200) {
        this.recommendSongSheet = result.result
      }
    },
    tipInfo () {
      Toast('开发中')
    },
    // 跳转至我的
    toHomepage () {
      Toast('点击了')
      this.$router.push('/homepage')
    }
  }
}
</script>

<style lang='less' scoped>
.func-nav{
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 13px 0px;

  .round-icon{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    .icon{
      width: 100%;
      display: flex;
      justify-content: center;
      cursor: pointer;
      img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgb(5, 170, 192);
      }
    }
    .title{
      margin-top: 5px;
      font-size: 10px;
    }
  }

}

// 分割线样式
.van-divider{
  margin: 10px 0px;
  border-color: #d6d7d8;
}
</style>
