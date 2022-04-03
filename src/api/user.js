import requests from './ajax'

/*
  获取用户登录状态
  /login/status
  get
  参数:
*/
export const reqGetLoginStatus = () => {
  const time = new Date().getTime()
  return requests({
    url: `/login/status?timestamp=${time}`,
    method: 'get'
  })
}

/*
  发送验证码
  /captcha/sent
  get
  参数: 手机号?phone=13xxx
*/
export const reqGetCheckCode = (phoneNum) => {
  const time = new Date().getTime()
  return requests({
    url: `/captcha/sent?phone=${phoneNum}&timestamp=${time}`,
    method: 'get'
  })
}

/*
  验证验证码
  /captcha/verify
  get
  参数: 手机号、验证码?phone=13xxx&captcha=1597
*/
export const reqVerifyCode = (params) => {
  const time = new Date().getTime()
  return requests({
    url: `/captcha/sent?phone=${params.phoneNum}&captcha=${params.captcha}&timestamp=${time}`,
    method: 'get'
  })
}

/*
  验证码登录
  /login/cellphone
  post
  参数: 手机号、验证码?phone=xxx&captcha=1234
*/
export const reqLoginByCode = (params) => {
  const time = new Date().getTime()
  return requests({
    url: `/login/cellphone?phone=${params.phoneNum}&captcha=${params.captcha}&timestamp=${time}`,
    method: 'get'
  })
}

/*
  获取用户账号信息
  /user/account
  get
  参数:
*/
export const reqGetUserInfo = () => {
  const time = new Date().getTime()
  return requests({
    url: `/user/account?timestamp=${time}`,
    method: 'get'
  })
}

/*
  退出登录
  /logout
  get
  参数:
*/
export const reqLogout = () => {
  const time = new Date().getTime()
  return requests({
    url: `/logout?timestamp=${time}`,
    method: 'post'
  })
}
