import requests from './ajax'

/*
  获取推荐歌单
  /personalized
  get
  参数: ?limit=1 取出数量
*/
export const reqGetRecommendSongSheet = (limit = 6) => {
  const time = new Date().getTime()
  return requests({
    url: `/personalized?timestamp=${time}&limit=${limit}`,
    method: 'get'
  })
}

/*
  获取热门歌单
  /playlist/hot
  get
  参数: ?limit=1 取出数量
*/
export const reqGetHotSongSheet = () => {
  const time = new Date().getTime()
  return requests({
    url: `/playlist/hot?timestamp=${time}`,
    method: 'get'
  })
}

/*
  获取网友精选歌单
  /top/playlist
  get
  参数: ?limit=1 取出数量
  cat: tag, 比如 " 华语 "、" 古风 " 默认为 "全部"
  limit: 取出歌单数量 , 默认为 50
  offset: 偏移数量 , 用于分页
  */
export const reqGetTopSongSheet = (limit = 10) => {
  const time = new Date().getTime()
  return requests({
    url: `/top/playlist?limit=${limit}&timestamp=${time}`,
    method: 'get'
  })
}

/*
  通过歌曲ID获取歌曲路径
  /song/url?id=
  get
  参数: ?id=1 歌曲id
*/
export const reqGetSongById = (songId) => {
  const time = new Date().getTime()
  return requests({
    url: `/song/url?id=${songId}&timestamp=${time}`,
    method: 'get'
  })
}

/*
  通过歌曲ID获取歌曲详情
  /song/detali
  get
  参数: ?ids: 音乐id
*/
export const reqGetSongDetailById = (songIds) => {
  const time = new Date().getTime()
  if (!Array.isArray(songIds)) {
    // 如果不是数组，变为数组
    songIds = [songIds]
  }
  return requests({
    url: `/song/detail?timestamp=${time}`,
    method: 'get',
    params: {
      ids: songIds + ''
    }
  })
}

/*
  通过歌单ID获取歌单详情
  /playlist/detail?id=24381616
  post
  参数: ?id: 歌单id
*/
export const reqGetSongSheetDetail = (songSheetId) => {
  const time = new Date().getTime()
  return requests({
    url: `/playlist/detail?id=${songSheetId}&timestamp=${time}`,
    method: 'post'
  })
}

/*
  通过歌单ID获取歌单所有歌曲(需要登录)
  /playlist/track/all
  post
  参数: ?id: 歌单id
      offset:页数  limit:获取歌曲的数量
*/
export const reqGetSongSheetAllSong = (params) => {
  const time = new Date().getTime()
  return requests({
    url: `/playlist/track/all?id=${params.songSheetId}&limit=${params.limit}
      &offset=${params.offset}&timestamp=${time}`,
    method: 'post'
  })
}
