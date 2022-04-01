<!-- 音乐播放栏 -->
<template>
  <div class="playbar-nav">
    <!-- 隐藏起来的播放器 -->
    <div class="hidden-player">
      <audio :src="songURL" ref="audio" class="inner-player" controls="controls" loop="loop" preload="auto"></audio>
    </div>
    <!-- 音乐播放栏 -->
    <div class="player">
      <!-- 歌曲封面 -->
      <img :src="songIcon" class="song-icon">
      <!-- 歌曲名 -->
      <div class="song-title">{{ songName }} - {{ songer.name }}</div>
      <!-- 播放器按钮 -->
      <div class="button-nav">
        <div class="button">
          <img src="@/assets/player/previous.png" class="previous">
          <!-- 播放按钮及歌曲进度条显示 -->
          <el-progress type="circle" :percentage="circleRate" class="progress" color="#05AAC0" :width=27 :show-text=false :stroke-width=2></el-progress>
          <img :src="palyState=='suspend'?require('@/assets/player/suspend.png'):require('@/assets/player/play.png')"
            class="play" @click="playSong">
          <img src="@/assets/player/next.png" class="next">
          <img src="@/assets/player/playlist.png" class="playlist">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayBar',
  data () {
    return {
      // 播放速度
      playSpeed: 100,
      currentRate: 1,
      // 播放状态
      palyState: 'suspend',
      // 歌曲信息
      songURL: '',
      // 歌曲详情
      songDetail: { },
      // 歌曲时长
      songTime: 0,
      // 歌曲封面
      songIcon: '',
      // 歌曲名
      songName: '',
      // 歌手信息
      songer: {},
      // 当前播放进度
      currentTime: 0,
      // 记录定时器
      timerId: null
    }
  },
  watch: {
    // 监听歌曲详情是否更新
    songDetail: {
      deep: true,
      handler: function (val, oldVal) {
        this.songTime = val.songs[0].dt || 0
        this.songIcon = val.songs[0].al.picUrl || ''
        this.songName = val.songs[0].name || ''
        this.songer = val.songs[0].ar[0] || {}
      }
    }
  },
  computed: {
    circleRate () {
      return Math.floor(this.currentTime / (this.songTime / 1000) * 100) || 0.5
    }
  },
  mounted () {
    // 获取一首音乐(临时)
    this.getSongURL()
    // 获取音乐详情(临时)
    this.getSongDetail()
  },
  methods: {
    // 播放音乐
    playSong () {
      // 修改播放状态
      this.palyState = this.palyState === 'suspend' ? 'play' : 'suspend'
      // console.log(this.getCurrentTime())

      if (this.palyState === 'suspend') {
        // 暂停播放
        this.pause()
        // 暂停进度条转动
        this.playSpeed = 0
      } else {
        // 开始播放
        this.play()
        // 开启进度条转动
        this.playSpeed = 1
      }
    },
    // 开始播放
    play () {
      this.$refs.audio.play()
      // 清空定时器事件
      if (this.timerId) {
        this.timerId = null
      }
      // 定时器事件：实时更新当前播放进度
      this.timerId = setInterval(() => {
        this.currentTime = this.getCurrentTime()
      }, 900)
    },
    // 暂停播放
    pause () {
      this.$refs.audio.pause()
      // 清空定时器事件
      clearInterval(this.timerId)
      this.timerId = null
    },
    // 获取当前播放进度
    getCurrentTime () {
      return this.$refs.audio.currentTime
    },
    // 获取一首音乐(临时)
    async getSongURL (songId = 33894312) {
      const result = await this.$API.reqGetSongById(songId)
      if (result.code) {
        this.songURL = result.data[0].url
      }
    },
    // 获取音乐详情(临时)
    async getSongDetail (songId = 33894312) {
      const result = await this.$API.reqGetSongDetailById(songId)
      if (result.code) {
        this.songDetail = result
      }
    }
  }

}
</script>

<style lang='less' scoped>
//音乐播放栏高度
@--box-height: 40px;

.playbar-nav{
  position: fixed;
  bottom: 42px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  height: @--box-height;
  background-color: white;

  //需要隐藏的播放器
  .hidden-player{
    position: fixed;
    bottom: 0px;
    height: 0px;
    width: 0px;
    visibility: hidden;

    .inner-player{

    }
  }

  .player{
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
    width: 100%;

    .song-icon{
      width: 30px;
      height: 30px;
      border-radius: 5px;
      margin: 0px 13px;
    }

    .song-title{
      font-size: 10px;
    }

    .button-nav{
      position: absolute;
      right: 0px;

      .button{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        position: relative;

        .progress{
          position: absolute;
          left: 25px;
        }

        img{
          z-index: 1;
          width: 16px;
          height: 16px;
          margin-right: 15px;
          cursor: pointer;
          transform: all .5s;
        }

      }

    }

  }

}

</style>
