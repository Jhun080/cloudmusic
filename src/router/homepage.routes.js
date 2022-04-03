// 首页路由
export default {
  path: '/homepage',
  name: 'Homepage',
  component: () => import('@/views/HomePage/Homepage.vue'),
  meta: {
    // 是否展示Header组件
    showHeader: true
  },
  children: [

  ]
}
