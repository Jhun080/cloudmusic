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
        <div class="song-title" @click="showPlayDetail">{{ songName }} -&nbsp;
          <span class="author" v-for="(author,index) in songer" :key="author.id">
            {{ index == 0 ? '' : '/' }} {{ author.name }}
          </span>
        </div>
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

    <!-- 播放详情弹窗，全屏 -->
    <div class="playdetail-nav">
      <van-popup v-model="playDetailVisible" position="bottom">
        <div class="detail-nav">
          <!-- 顶部区域 -->
          <div class="header-nav">
            <img :src="require('@/assets/player/down.png')" class="down-icon" @click="playDetailVisible=false">
            <div class="song-info">
              <!-- 歌曲名 -->
              <div class="title">{{ songName }}</div>
              <!-- 作者 -->
              <div class="author-nav">
                <span class="author" v-for="(author,index) in songer" :key="author.id">
                  {{ index == 0 ? '' : '/' }} {{ author.name }}
                </span>
              </div>
            </div>
            <img :src="require('@/assets/player/share.png')" class="share-icon">
          </div>
          <!-- 中部区域 -->
          <div class="center-nav">
            <div :class="{'songicon':true,'suspend':palyState=='suspend'}">
              <img :src="songIcon">
            </div>

          </div>
          <!-- 底部区域 -->
          <div class="footer-nav">
            <!-- 进度条区域 -->
            <div class="progressbar-nav">
              <!-- 当前播放时间 -->
              <div class="nowtime">{{ formateTime(currentTime*1000) }}</div>
              <div class="progressbar">
                <mt-range
                  v-model="currentTime" :min=0 :max="songTime/1000" :barHeight=2 @input="changeCurrentTimeFirst" @change="changeCurrentTimeSecond">
                </mt-range>
              </div>
              <!-- 当前歌曲总时间 -->
              <div class="totaltime">{{ formateTime(songTime) }}</div>
            </div>
            <!-- 按钮区域 -->
            <div class="button-nav">
              <img :src="require('@/assets/player/loopPlayBig.png')" class="normal-icon">
              <img :src="require('@/assets/player/lastBig.png')" class="normal-icon" @click="playLastSong">
              <img :src="require(`@/assets/player/${palyState=='suspend'?'suspend':'play'}Big.png`)" class="big-icon" @click="playSong">
              <img :src="require('@/assets/player/nextBig.png')" class="normal-icon" @click="playNextSong">
              <img :src="require('@/assets/player/playlistBig.png')" class="normal-icon" @click="showSongPlayList">
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
      value: 25540,
      // 标记是否展示播放详情页面
      playDetailVisible: false,
      // 标记是否展示播放列表
      showPlayList: false,
      // 播放类型 单曲:single  随机:random  循环:loop
      playType: 'loop',
      // 播放状态  暂停:suspend  播放:play
      palyState: 'suspend',
      // 歌曲资源URL
      songURL: '',
      // 歌曲详情
      songDetail: { },
      // 歌曲时长(毫秒)
      songTime: 0,
      // 歌曲封面
      songIcon: '',
      // 歌曲名
      songName: '',
      // 歌手信息
      songer: {},
      // 当前播放时间进度(秒)
      currentTime: 0,
      // 记录定时器
      timerId: null,
      // 当前播放歌曲id
      playingSongId: '1933997277'
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
        this.songer = val.songs[0].ar || []
      }
    }
  },
  computed: {
    ...mapState({
      // 当前播放列表
      playSongList: state => state.song.playSongList
    }),
    // 进度条进度
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
    // 展示播放详情页
    showPlayDetail () {
      this.playDetailVisible = true
    },
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
    // 修改当前播放的音乐的进度(First，滑动进度条时)
    changeCurrentTimeFirst () {
      // 首先销毁计时器
      clearInterval(this.timerId)
      this.timerId = null
    },
    // 修改当前播放的音乐的进度(Second，放开滑块时)
    changeCurrentTimeSecond () {
      // 修改播放器audio当前进度
      this.$refs.audio.currentTime = this.currentTime
      // 启动定时器，开始播放
      this.play()
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
    },
    // 时间转换
    formateTime (time) {
      return this.$dayjs(time).format('mm:ss')
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

.playdetail-nav{
  width: 100%;
  height: 100%;
  width: 100%;

  .van-popup--bottom {
    height: 100%;

    .detail-nav{
      width: 100%;
      height: 100%;
      //background-color: rgb(125,125,123);
      background-color: rgb(131,123,110);

      .header-nav{
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 45px;
        //background-color: rgb(19, 212, 226);

        .down-icon{
          position: absolute;
          left: 15px;
          width: 22px;
          height: 22px;
        }

        .song-info{
          display: flex;
          flex-wrap: wrap;
          align-content: center;
          text-align: center;

          .title{
            width: 100%;
            font-size: 14px;
            color: white;
          }

          .author-nav{
            width: 100%;
            font-size: 10px;
            color: rgb(223, 217, 217);
          }
        }

        .share-icon{
          position: absolute;
          right: 15px;
          width: 22px;
          height: 22px;
        }

      }

      .center-nav{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100% - 135px) ;
        //background-color: aquamarine;

        .songicon{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 75vw;
          height: 75vw;
          background-image: url('~@/assets/player/disc1.png');
          background-size:100%;
          border-radius: 50%;
          animation: imgRotate 20s linear infinite;
          img{
            width: 50vw;
            height: 50vw;
            border-radius: 50%;
          }
        }

        .songicon.suspend{

          animation-play-state: paused;
        }

      }

      .footer-nav{
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 90px;
        //background-color: rgb(211, 219, 216);

        .progressbar-nav{
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-around;
          align-items: center;

          .nowtime{
            font-size: 10px;
            color: rgb(223, 217, 217);
          }

          .progressbar{
            width: 70vw;
            /deep/.mt-range-content{
              left: 10px;
            }
            /deep/.mt-range-runway{
              right: -10px;
            }
            /deep/.mt-range-progress{
              background-color: rgb(5,170,192);
            }
            /deep/.mt-range-thumb{
              width: 10px;
              height: 10px;

              top: 8px;
              box-shadow: none;
              border: 2px solid rgb(5,170,192);
            }
          }

          .totaltime{
            font-size: 10px;
            color: rgb(223, 217, 217);
          }

        }

        .button-nav{
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;

          .normal-icon{
            width: 20px;
            height: 20px;
            margin: 0px 20px;
          }

          .big-icon{
            width: 40px;
            height: 40px;
          }
        }

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

//动画事件：图片自转
@keyframes imgRotate{
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
