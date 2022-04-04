<!-- 音乐播放栏 -->
<template>
  <div>
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
            <img src="@/assets/player/previous.png" class="previous" @click="playLastSong">
            <!-- 播放按钮及歌曲进度条显示 -->
            <el-progress type="circle" :percentage="circleRate" class="progress" color="#05AAC0" :width=27 :show-text=false :stroke-width=2></el-progress>
            <img :src="palyState=='suspend'?require('@/assets/player/suspend.png'):require('@/assets/player/play.png')"
              class="play" @click="playSong">
            <img src="@/assets/player/next.png" class="next" @click="playNextSong">
            <img src="@/assets/player/playlist.png" class="playlist" @click="showSongPlayList">
          </div>
        </div>
      </div>
    </div>

    <!-- 播放列表弹窗 -->
    <div class="playlist-nav">
      <van-popup v-model="showPlayList" position="bottom">
        <div class='list-nav'>
          <div class="header-fixed">
            <div class="title">当前播放({{ playSongList.length }})</div>
            <div class="func-nav">
              <div class="playtype-icon"><img :src="require(`@/assets/player/${playType}Play.png`)">列表循环</div>
              <div class="func-icon">
                <img src="@/assets/player/download.png">
                <img src="@/assets/player/collection.png">
                <img src="@/assets/player/delete.png">
              </div>
            </div>
          </div>
          <!-- 歌曲列表区域 -->
          <div class="songlist-nav">
            <!-- 每一行歌曲信息 -->
            <div class="songinfo-nav" v-for="song in playSongList" :key="song.id" @click="playMusic(song)">
              <!-- 正在播放图标 -->
              <img :src="require('@/assets/player/playing.png')" v-if="song.id==playingSongId" class="playing-icon">
              <!-- vip图标 -->
              <img :src="require('@/assets/songsheet/vip.png')" v-if="song.fee==1" class="vip-icon">
              <!-- 歌曲名 -->
              <div :class="{'songname':true,'playing':song.id==playingSongId}">{{ song.name }}</div>
              <!-- 歌曲作者 -->
              <div :class="{'author-nav':true,'playing':song.id==playingSongId}">&nbsp;-&nbsp;
                <span class="author" v-for="(author,index) in song.ar" :key="author.id">
                  {{ index == 0 ? '' : '/' }} {{ author.name }}
                </span>
              </div>
              <img :src="require('@/assets/player/close.png')" class="close-icon">
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>

</template>

<script>
import { Toast } from 'vant'
import { mapState } from 'vuex'

export default {
  name: 'PlayBar',
  data () {
    return {
      // 标记是否展示播放列表
      showPlayList: false,
      // 播放类型 单曲:single  随机:random  循环:loop
      playType: 'loop',
      // 播放状态
      palyState: 'suspend',
      // 歌曲资源URL
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
      timerId: null,
      // 当前播放歌曲id
      playingSongId: ''
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
    ...mapState({
      // 当前播放列表
      playSongList: state => state.song.playSongList
    }),
    circleRate () {
      return Math.floor(this.currentTime / (this.songTime / 1000) * 100) || 0.5
    }
  },
  mounted () {
    // 注册自定义事件(汇总)
    this.registerEvent()
    // 获取一首音乐(临时)
    this.getSongURL()
    // 获取音乐详情(临时)
    this.getSongDetail()

    // 获取当前播放列表(当前id是固定的)
    this.getPlaySongList()
  },
  methods: {
    // 播放列表上一首歌曲
    playLastSong () {
      // 获取播放列表长度
      const size = this.playSongList.length
      // 查询当前播放的音乐在列表中的位置
      let nowPlayingIndex
      this.playSongList.forEach((item, index) => {
        if (item.id === this.playingSongId) {
          nowPlayingIndex = index
        }
      })
      nowPlayingIndex--
      // 判断是否超出播放列表范围，和是不是vip歌曲
      while (1) {
        // 超出播放列表数量，从尾开始
        if (nowPlayingIndex < 0) {
          nowPlayingIndex = size - 1
        }
        // 是vip歌曲
        if (this.playSongList[nowPlayingIndex].fee === 1) {
        // vip歌曲，暂时先跳过，播放上一首歌曲
          nowPlayingIndex--
          // 继续循环
          continue
        }
        // 达成在播放列表范围内且不是vip歌曲，跳出循环开始播放
        break
      }
      // 播放音乐
      this.playMusic(this.playSongList[nowPlayingIndex])
    },
    // 播放列表下一首歌曲
    playNextSong () {
      // 获取播放列表长度
      const size = this.playSongList.length
      // 查询当前播放的音乐在列表中的位置
      let nowPlayingIndex
      this.playSongList.forEach((item, index) => {
        if (item.id === this.playingSongId) {
          nowPlayingIndex = index
        }
      })
      nowPlayingIndex++
      // 判断是否超出播放列表范围，和是不是vip歌曲
      while (1) {
        // 超出播放列表数量，从尾开始
        if (nowPlayingIndex >= size) {
          nowPlayingIndex = 0
        }
        // 是vip歌曲
        if (this.playSongList[nowPlayingIndex].fee === 1) {
        // vip歌曲，暂时先跳过，播放下一首歌曲
          nowPlayingIndex++
          // 继续循环
          continue
        }
        // 达成在播放列表范围内且不是vip歌曲，跳出循环开始播放
        break
      }
      // 播放音乐
      this.playMusic(this.playSongList[nowPlayingIndex])
    },
    // 播放音乐
    playSong () {
      // 修改播放状态
      this.palyState = this.palyState === 'suspend' ? 'play' : 'suspend'
      // console.log(this.getCurrentTime())

      if (this.palyState === 'suspend') {
        // 暂停播放
        this.pause()
      } else {
        // 开始播放
        this.play()
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
        // 歌曲剩余时间
        const remainTime = (this.songTime - this.currentTime * 1000)
        // console.log(remainTime)
        if (remainTime <= 1500) {
          // 当前歌曲已经播放完，播放下一首
          this.playNextSong()
        }
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
    },
    // 播放音乐(在播放列表中点击)
    playMusic (song) {
      if (song.fee === 1) {
        Toast('暂时不支持播放VIP歌曲')
      } else {
        // 更新当前播放的音乐id
        this.playingSongId = song.id
        // 通知底部播放栏播放音乐
        this.playMusicById(song.id)
      }
    },
    // 通过音乐id播放音乐
    async playMusicById (songId) {
      try {
        if (this.palyState !== 'suspend') {
          // 如果当前播放器正在播放
          // 首先暂停播放(会清空计时器)
          this.playSong()
        }
        // 获取音乐详情
        await this.getSongDetail(songId)
        // 获取一首音乐(临时)
        await this.getSongURL(songId)
        // 开始播放音乐
        this.playSong()
      } catch (error) {
        console.log(error)
        Toast('播放失败，刷新一下吧')
      }
    },
    // 展示播放列表弹窗
    showSongPlayList () {
      this.showPlayList = true
    },
    // 获取当前播放列表
    getPlaySongList () {
      this.$store.dispatch('getSongDetailBySongIds', 7360210135)
    },
    // 注册自定义事件(汇总)
    registerEvent () {
      // 订阅来自表单的播放音乐事件
      this.$bus.$on('playMusic', (songId) => {
        console.log('播放音乐ID：', songId)
        // 播放音乐操作
        this.playMusicById(songId)
      })
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
      max-width: 50vw;
      font-size: 10px;
      //超过一行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
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

.playlist-nav{
  width: 100%;

  .van-popup--bottom {
    height: 60%;
    width: 90%;
    //居中
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    border-radius: 15px;
  }

  .list-nav{
    padding: 0px 10px;
    .header-fixed{
      position: sticky;
      top: 0px;
      z-index: 1;
      background-color: white;

      .title{
        padding: 15px 0px 5px 0px;
        font-size: 15px;
        font-weight: bold;
      }

      .func-nav{
        display: flex;
        flex-wrap: nowrap;
        padding: 5px 0px 10px 0px;
        .playtype-icon{
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          width: 100%;
          font-size: 14px;
          img{
            width: 16px;
            height: 16px;
            margin-right: 6px;
          }
        }
        .func-icon{
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          width: 150px;
          img{
            width: 18px;
            height: 18px;
          }
          img:nth-of-type(2){
            margin: 0px 30px;
          }
        }

      }
    }

    .songlist-nav{
      width: 100%;
      background-color: white;
      transition: all .5s;
      //超过一行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;

      .songinfo-nav{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        position: relative;
        height: 38px;

        .songname{
          font-size: 15px;
        }
        .songname.playing{
          color:rgb(5,170,192)
        }

        .author-nav{
          position: relative;
          top: 1px;
          font-size: 1px;
          color: rgb(112,112,112);
        }
        .author-nav.playing{
          color:rgb(5,170,192)
        }

        .playing-icon{
          width: 14px;
          height: 14 px;
          margin-right: 5px;
        }

        .vip-icon{
          width: 14px;
          height: 14 px;
          margin-right: 3px;
        }

        .close-icon{
          position: absolute;
          right: 0px;
          width: 16px;
          height: 16px;
        }
      }

      .songinfo-nav:active{
        //background-color: rgb(218,218,218);
        animation: hoverColorChangeBegin .3s linear;
      }
    }

  }
}

//动画事件：背景色转换(悬浮时)
@keyframes hoverColorChangeBegin{
  0%{
    background-color: white;
  }
  100%{
    background-color: rgb(218,218,218);
  }
}

</style>
