// 保存用户Cookie
export const setCookie = (cookie) => {
  localStorage.setItem('cloudmusic_cookie', cookie)
}

// 获取用户Cookie
export const getCookie = () => {
  return localStorage.getItem('cloudmusic_cookie')
}

// 删除用户Cookie
export const removeCookie = () => {
  localStorage.removeItem('cloudmusic_cookie')
}
