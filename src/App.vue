<template>
  <div id="app">
    <!-- 头部菜单栏 -->
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue'

export default {
  components: {
    Header
  },
  data () {
    return {

    }
  }
}
</script>

<style lang='less' scoped>

</style>
