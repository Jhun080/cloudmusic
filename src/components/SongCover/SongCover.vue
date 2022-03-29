<!-- 歌曲封面组件 -->
<template>
  <div class="songsheet-nav">
    <div class="song-nav" v-for="song in songData" :key="song.id">
      <div class="mini-icon">
        <li class="el-icon-video-play"></li> {{ handlePlayCount(song.playCount) }}
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
    }
  }
}
</script>

<style lang="less" scoped>
.songsheet-nav {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  font-size: 1px;

  .song-nav {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;
    width: 30vw;
    margin: 0px 5px;
    cursor: pointer;

    .mini-icon{
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
