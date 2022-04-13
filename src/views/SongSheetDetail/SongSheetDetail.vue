<!-- 歌单详情页 -->
<template>
  <div class="songsheet-nav">
    <!-- 歌单详情头部样式 -->
    <div class="header-nav">
      <div class="func-nav">
        <div class="left">
          <div class="el-icon-back" style="margin: 0px 15px" @click="routeBack"></div>
          <div>歌单</div>
        </div>
        <div class="right">
          <div class="el-icon-search"></div>
          <div class="el-icon-more" style="margin: 0px 20px"></div>
        </div>
      </div>
      <div class="songsheetinfo-nav">
        <div class="songsheet-icon">
          <img :src="songsheetIcon" @click="preventTouch"/>
        </div>
        <div class="info-nav">
          <div class="title">{{ songSheetData.name }}</div>
          <div class="author">
            <img :src="songSheetData.creator.avatarUrl" class="author-icon" />
            <div class="author-name">{{ songSheetData.creator.nickname }}</div>
          </div>
          <div class="description">{{ songSheetData.description }}</div>
        </div>
      </div>
      <!-- 歌单数据 评论、分享………… -->
      <div class="songsheetdata-nav">
        <div class="mini-icon" style="border-right: 1px solid rgb(200, 200, 203)">
          <img :src="require('@/assets/songsheet/collection.png')" />
          {{ handleNum(songSheetData.subscribedCount) }}
        </div>
        <div class="mini-icon">
          <img :src="require('@/assets/songsheet/comment.png')" />
          {{ handleNum(songSheetData.commentCount) }}
        </div>
        <div class="mini-icon" style="border-left: 1px solid rgb(200, 200, 203)">
          <img :src="require('@/assets/songsheet/share.png')" />
          {{ handleNum(songSheetData.shareCount) }}
        </div>
      </div>
    </div>
    <!-- 歌曲数据 -->
    <div class="songlist-nav">
      <div class="playall" @click="playAllSong"><img :src="require('@/assets/songsheet/playAll.png')"/>播放全部</div>
      <div class="songinfo" v-for="(song, index) in songSheetData.tracks" :key="song.id" @click="playMusic(song,index)">
        <div class="song-index">
          {{ index + 1 }}
        </div>
        <div class="info-nav">
          <!-- 歌名、作者区域 -->
          <div class="info">
            <div class="song-title">{{ song.name }}</div>
            <div class="song-author">
              <div class="tip" v-if="song.fee==1">
                <img :src="require('@/assets/songsheet/vip.png')">
              </div>
              <div class="author">
                {{ song.ar[0].name }} - {{ song.al.name }}
              </div>
            </div>
          </div>
          <!-- 按钮区域 -->
          <div class="button-nav">
            <img :src="require('@/assets/songsheet/more.png')" class="mini-button">
            <img :src="require('@/assets/songsheet/mv.png')" v-if="song.mv!=0" class="mini-button">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapState } from 'vuex'

export default {
  name: 'SongSheetDetail',
  data () {
    return {
      // 歌单信息
      // songSheetData: {
      //   creator: {}
      // }
    }
  },
  computed: {
    ...mapState({
      // 歌单详情
      songSheetData: state => state.song.songSheetData
    }),
    // 歌单id
    songSheetId () {
      return this.$route.params.songsheetid
    },
    // 歌单封面
    songsheetIcon () {
      return this.songSheetData.coverImgUrl || ''
    }
  },
  activated () {
    // 获取歌单详情
    this.getSongSheetDetail()
  },
  mounted () {
    // 获取歌单详情
    this.getSongSheetDetail()
  },
  methods: {
    // 播放音乐
    playMusic (song, index = 1) {
      if (song.fee === 1) {
        Toast('暂时不支持播放VIP歌曲')
      } else {
        // 通知底部播放栏播放音乐
        // 参数：歌单id，从第index首开始播放
        this.$bus.$emit('playAllSongBySheetId', this.songSheetId, index + 1)
      }
    },

    // 播放当前列表全部音乐
    playAllSong () {
      // 通知播放器播放当前列表全部音乐
      // 参数：歌单id
      this.$bus.$emit('playAllSongBySheetId', this.songSheetId)
    },

    // 获取歌单详情
    async getSongSheetDetail () {
      // vuex获取歌单详情
      this.$store.dispatch('getSongSheetList', this.songSheetId)
    },

    // 返回上一个url
    routeBack () {
      this.$router.go(-1)
    },

    // 处理数字的显示
    handleNum (num) {
      const front = Math.floor(num / 100000)
      if (front > 0) {
        return front + '万'
      } else {
        return num
      }
    },

    // 空白事件阻止手机浏览器预览事件
    preventTouch () {

    }
  }
}
</script>

<style lang="less" scoped>
.songsheet-nav {
  //background-color: grey;

  .header-nav {
    width: 100%;
    height: 195px;
    //border-radius:0 0 50% 50%;
    background-color: rgb(5, 170, 192);

    // 顶部返回按键区
    .func-nav {
      position: fixed;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 45px;
      font-size: 18px;
      background-color: rgb(5, 170, 192);
      color: white;

      .left {
        display: flex;
        align-items: center;
      }

      .right {
        display: flex;
        align-items: center;
      }
    }

    .songsheetinfo-nav {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      width: 100%;
      height: 130px;
      margin-top: 45px;
      background-color: rgb(5, 170, 192);

      .songsheet-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 130px;
        margin: 0px 15px;

        img {
          //取消该图片的点击事件
          pointer-events: none;
          width: 100px;
          height: 100px;
          border-radius: 15px;
        }
      }

      .info-nav {
        width: 100%;
        margin-top: 15px;
        .title {
          text-align: left;
          color: white;
          font-size: 12px;
        }
        .author {
          display: flex;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
          margin-top: 15px;

          .author-icon {
            max-width: 24px;
            max-height: 24px;
            border-radius: 50%;
          }

          .author-name {
            width: 100%;
            margin: 0px 5px;
            font-size: 10px;
            color: rgb(53, 50, 50);
          }
        }

        .description {
          width: 90%;
          color: rgb(53, 50, 50);
          font-size: 10px;
          margin-top: 8px;
          //超过两行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}

.songsheetdata-nav {
  background-color: white;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  width: 310px;
  height: 34px;
  margin: 10px auto;
  border-radius: 20px;
  box-shadow: 1px 0px 5px 1px rgba(0, 0, 0, 0.27);

  .mini-icon {
    max-width: 80px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 0px 15px;
    font-size: 10px;
    text-align: center;

    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
}

.songlist-nav {
  .playall {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: 40px;

    font-size: 15px;
    font-weight: bold;
    img {
      width: 22px;
      height: 22px;
      margin: 0px 12px;
    }
  }

  .songinfo {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: 45px;

    .song-index {
      display: inline-block;
      width: 42px;
      font-size: 15px;
      color: rgb(163, 163, 163);
      line-height: 45px;
      text-align: center;
    }

    .info-nav {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      align-items: center;
      width: calc(100% - 42px);

      .info {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        // width: 100%;
        min-width: 65vw;
        text-align: left;

        .song-title {
          width: 100%;
          font-size: 14px;
          font-weight: bold;
          //超过两行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .song-author {
          display: flex;
          align-items: center;
          justify-content: center;
          .tip{
            display: flex;
            margin-right: 3px;
            img{
              margin: auto;
              width: 15px;
              height: 15px;
            }
          }

          .author{
            margin-top: 2px;
            width: 100%;
            color: rgb(163, 163, 163);
            font-size: 10px;
            //超过一行显示省略号
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
      }

      .button-nav{
        width: 100%;
        .mini-button{
          float: right;
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
      }

    }
  }
}
</style>
