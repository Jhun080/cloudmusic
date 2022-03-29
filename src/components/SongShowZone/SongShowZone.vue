<!-- 歌单展示区域 -->
<template>
  <div class="info-nav">
    <div class="title">{{ title }}</div>
    <SongCover
      :songData="songDatas"
      >
    </SongCover>
  </div>
</template>

<script>
import SongCover from '@/components/SongCover/SongCover.vue'

export default {
  name: 'SongShowZone',
  props: ['songDatas', 'title'],
  components: {
    SongCover
  },
  data () {
    return {

    }
  },
  mounted () {

  }
}
</script>

<style lang='less' scoped>
.info-nav{
  width: 100%;
  height: 190px;
  //background-color: gray;

  .title{
    font-size: 15px;
    font-weight: bold;
    margin-left: 15px;
    margin-bottom: 10px;
  }
}

</style>
