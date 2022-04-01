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
export const reqGetSongDetailById = (songId) => {
  const time = new Date().getTime()
  return requests({
    url: `/song/detail?ids=${songId}&timestamp=${time}`,
    method: 'get'
  })
}
