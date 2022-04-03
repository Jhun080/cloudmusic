// 登录路由
export default {
  path: '/error',
  name: 'Error',
  component: () => import('@/views/Error/Error.vue'),
  meta: {
    // 是否展示Header组件
    showHeader: false
  },
  children: [

  ]
}
