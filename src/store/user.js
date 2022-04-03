import { reqGetLoginStatus, reqGetUserInfo } from '@/api/user.js'
const state = {
  // 用户登录状态
  loginStatus: {},
  // 用户信息
  userInfo: {
    // 标记是否已经获取信息，如果未获取,则会存在getInfoFlag这个属性
    // 如果已获取，获取的新的属性中不会包含这个属性
    getInfoFlag: 1
  }
}
const mutations = {
  SETUSERINFO (state, userInfo) {
    state.userInfo = userInfo
  },
  SETLOGINSTATUS (state, loginStatus) {
    state.loginStatus = loginStatus
  }
}
const actions = {
  // 获取用户登录状态
  async getLoginStatus ({ commit }) {
    const result = await reqGetLoginStatus()
    if (result.data.code === 200) {
      commit('SETLOGINSTATUS', result.data.account)
    }
  },
  // 获取用户信息
  async getUserInfo ({ commit }) {
    const result = await reqGetUserInfo()
    // console.log(result)
    if (result.code === 200) {
      commit('SETUSERINFO', result.profile || {})
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
