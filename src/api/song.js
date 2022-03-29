import requests from './ajax'

/*
  获取推荐歌单
  /personalized
  get
  参数: ?limit=1 取出数量
*/
export const reqGetRecommendSongSheet = (limit = 6) => {
  return requests({
    url: `/personalized?limit=${limit}`,
    method: 'get'
  })
}
