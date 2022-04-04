import { reqGetSongSheetDetail, reqGetSongDetailById } from '@/api/song.js'
const state = {
  // 当前播放的歌曲
  nowPlaySong: '',
  // 当前歌单数据
  songSheetData: {
    creator: {}
  },
  // 当前播放歌曲列表
  playSongList: []
}
const mutations = {
  // 设置当前歌单数据
  SETSONGSHEETDATA (state, songSheetData) {
    state.songSheetData = songSheetData
  },
  // 设置当前播放歌曲列表
  SETPLAYSONGLIST (state, playSongList) {
    // 只保存有用的数据
    state.playSongList = playSongList.map(item => {
      return {
        name: item.name, // 歌名
        id: item.id, // 歌曲id
        ar: item.ar, // 作者
        fee: item.fee // 歌曲vip类型
      }
    })
  }
}
const actions = {
  // 获取当前歌单数据
  async getSongSheetList ({ commit }, songSheetId) {
    // 通过歌单ID获取歌单详情
    const result = await reqGetSongSheetDetail(songSheetId)
    if (result.code === 200) {
      // 更新当前歌单数据
      commit('SETSONGSHEETDATA', result.playlist)
    }
  },

  // 获取当前歌单的所有歌曲ID
  async getAllSongBySongSheetId ({ commit }, songSheetId) {
    // 通过歌单ID获取歌单详情
    const result = await reqGetSongSheetDetail(songSheetId)
    if (result.code === 200) {
      // 更新当前播放歌曲列表数据
      commit('SETSONGSHEETDATA', result.playlist)
    }
  },

  // 获取所有歌曲详情数据
  async getSongDetailBySongIds ({ commit }, songSheetId) {
    let songIds = []
    // 首先查询歌单数据
    // 通过歌单ID获取歌单详情
    const songSheetResult = await reqGetSongSheetDetail(songSheetId)
    if (songSheetResult.code === 200) {
      songIds = songSheetResult.playlist.trackIds.map(item => {
        return item.id
      })
    }
    // 通过歌单ID获取歌单详情
    const result = await reqGetSongDetailById(songIds)
    if (result.code === 200) {
      // 更新当前播放歌曲列表数据
      commit('SETPLAYSONGLIST', result.songs)
    }
  }
}
const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
