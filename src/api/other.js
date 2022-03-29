import requests from './ajax'

// 测试
export const reqTest = () => {
  return requests({
    url: '/login/qr/create',
    method: 'get'
  })
}

/*
  获取首页轮播图数据
  /banner?type=1
  get
  type:资源类型,对应以下类型,默认为 0 即 PC,1 为安卓
*/
export const reqGetCarousel = () => {
  return requests({
    url: '/banner?type=1',
    method: 'get'
  })
}

/*
  获取圆形图标
  /homepage/dragon/ball
  get
*/
export const reqGetBall = () => {
  return requests({
    url: '/homepage/dragon/ball',
    method: 'get'
  })
}
