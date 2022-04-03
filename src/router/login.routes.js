// 登录路由
export default {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/Login/Login.vue'),
  meta: {
    // 是否展示Header组件
    showHeader: true
  },
  children: [

  ]
}
