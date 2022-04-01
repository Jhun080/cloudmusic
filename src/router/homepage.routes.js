// 首页路由
export default {
  path: '/homepage',
  name: 'Homepage',
  component: () => import('@/views/HomePage/Homepage.vue'),
  children: [

  ]
}
