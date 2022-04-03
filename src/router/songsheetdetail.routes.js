// 登录路由
export default {
  path: '/songsheetdetail/:songsheetid',
  name: 'SongSheetDetail',
  component: () => import('@/views/SongSheetDetail/SongSheetDetail.vue'),
  meta: {
    // 是否展示Header组件
    showHeader: false
  },
  children: [

  ]
}
