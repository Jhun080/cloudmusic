// 当前模块，对所有API进行统一管理
import * as other from './other.js'
import * as song from './song.js'
import * as user from './user.js'

export default {
  ...other,
  ...song,
  ...user
}
