// 首页路由
export default {
  path: '/home',
  name: 'Home',
  component: () => import('@/views/Home/Home.vue'),
  children: [

  ]
}
