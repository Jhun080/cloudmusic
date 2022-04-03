// 首页路由
export default {
  path: '/home',
  name: 'Home',
  component: () => import('@/views/Home/Home.vue'),
  meta: {
    // 是否展示Header组件
    showHeader: true
  },
  children: [

  ]
}
