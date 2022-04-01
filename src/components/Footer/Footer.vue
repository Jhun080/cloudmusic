<!-- 底部导航栏 -->
<template>
  <div class="footer-nav">
    <!-- 导航 -->
    <van-tabbar v-model="active" active-color="rgb(5, 170, 192)" route>
      <van-tabbar-item to="/home">
        <span>发现</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? icon.find.active : icon.find.inactive" class="icon"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item @click="toPodcast">
        <span>播客</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? icon.podcast.active : icon.podcast.inactive" class="icon"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/homepage">
        <span>我的</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? icon.my.active : icon.my.inactive" class="icon"/>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'Footer',
  data () {
    return {
      active: '',
      icon: {
        find: {
          active: require('@/assets/footer/findActive.png'),
          inactive: require('@/assets/footer/findInactive.png')
        },
        my: {
          active: require('@/assets/footer/myActive.png'),
          inactive: require('@/assets/footer/myInactive.png')
        },
        podcast: {
          active: require('@/assets/footer/podcastActive.png'),
          inactive: require('@/assets/footer/podcastInactive.png')
        }
      }
    }
  },
  methods: {
    // 跳转至播客
    toPodcast () {
      Toast('正在开发中')
    }
  }
}
</script>

<style lang='less' scoped>
//底部导航栏高度
@--box-height: 42px;

.footer-nav{
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: @--box-height;
  background-color: grey;

  .van-tabbar{
    height: @--box-height;
  }
  .icon{
    border-radius: 50%;
  }

}

</style>
