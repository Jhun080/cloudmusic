<!-- 歌曲封面组件 -->
<template>
  <div class="songsheet-nav">
    <div class="song-nav" v-for="song in songData" :key="song.id" @click="toSongSheetDetail(song)">
      <div class="mini-icon">
        <li class="el-icon-video-play"></li>
        {{ handlePlayCount(song.playCount) }}
      </div>
      <div class="icon-nav">
        <img :src="song.picUrl" />
      </div>
      <div class="info">
        {{ song.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongCover',
  props: ['songData'],
  data () {
    return {}
  },
  computed: {
    song () {
      return this.songData[1] || {}
    }
  },
  methods: {
    // 处理播放次数显示
    handlePlayCount (count) {
      if (count / 10000 < 0) {
        return count
      } else {
        return Math.floor(count / 10000) + '万'
      }
    },
    // 跳转至歌单详情
    toSongSheetDetail (songSheet) {
      this.$router.push(`/songsheetdetail/${songSheet.id}`)
    }
  }
}
</script>

<style lang="less" scoped>
//隐藏x轴滚动条
.songsheet-nav::-webkit-scrollbar {
  height: 0 !important;
  width: 0px !important;
}

.songsheet-nav {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  //max-width: 100vw;
  font-size: 1px;

  //设置超出部分，出现滚动条
  //overflow: auto;
  overflow-x: scroll; /*x轴滚动*/
  overflow-y: hidden; /*y轴禁止滚动*/

  .song-nav {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;
    width: 30vw;
    //width: 110px;

    //设置最小宽度
    min-width: 110px;

    margin: 0px 5px;
    cursor: pointer;

    .mini-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: rgba(119, 116, 116, 0.3);
      padding: 0px 5px;
      border-radius: 20px;
      color: white;
    }

    .icon-nav {
      width: 100%;

      img {
        width: 100%;
        border-radius: 10px;
      }
    }

    .info {
      width: 100%;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
