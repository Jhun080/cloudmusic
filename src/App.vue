<template>
  <div id="app">
    <!-- 头部菜单栏 -->
    <Header></Header>
    <div class="main-nav">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 音乐播放栏 -->
    <PlayBar></PlayBar>
    <!-- 底部导航栏 -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue'
import PlayBar from '@/components/PlayBar/PlayBar.vue'
import Footer from '@/components/Footer/Footer.vue'

export default {
  components: {
    Header,
    PlayBar,
    Footer
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.main-nav {
  padding-bottom: 80px;

}
</style>
