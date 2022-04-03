<!-- 头部菜单栏 -->
<template>
  <div class="nav">
    <div class="header-nav">
      <div class="menu-icon">
        <!-- 顶部左侧菜单按钮 -->
        <van-button size="normal" @click="showPopup = true"><van-icon name="wap-nav" /></van-button>
      </div>
      <div class="search-input">
        <el-input v-model="query" placeholder="输入要搜索的内容">
          <template name="suffix">
            <li class="el-icon-search"></li>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 左侧弹出层 -->
    <!-- :style="{ height: '100%' } -->
    <van-popup v-model="showPopup" position="left" :closeable="true">
      <div class="menu-nav">
        <div class="user-nav">
          <img :src="usericon" class="user-icon" />
          <div class="user-name" v-if="username == '立即登录'" @click="toLogin">{{ username }}</div>
          <div class="user-name" v-else>{{ username }}</div>
        </div>
        <van-cell-group inset>
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="envelop-o" style="margin-right: 10px" />我的消息 </template>
          </van-cell>
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="points" style="margin-right: 10px" />云贝中心 </template>
          </van-cell>
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="bulb-o" style="margin-right: 10px" />创作者中心 </template>
          </van-cell>
        </van-cell-group>

        <van-cell-group inset title="音乐服务">
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="shopping-cart-o" style="margin-right: 10px" />商城 </template>
          </van-cell>
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="music-o" style="margin-right: 10px" />口袋彩铃 </template>
          </van-cell>
          <van-cell :clickable="true" is-link @click="tipMessage('暂未开发此功能')">
            <template name="title"> <van-icon name="bill-o" style="margin-right: 10px" />我的订单 </template>
          </van-cell>
        </van-cell-group>
        <!-- v-if="username != '立即登录'" -->
        <van-cell-group inset  @click="logout" >
          <van-cell :clickable="true" >
            <template name="title">
              <div class="logout">退出登陆 / 关闭</div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>

    <!-- 底部弹出层 -->
    <van-popup v-model="showLoginPopup" position="bottom" :safe-area-inset-bottom="true" closeable round class="login-nav" >
      <div class="title">手机号登录</div>
      <div class="input-nav">
        <div class="descript">手机号：</div>
        <el-input v-model.trim="phoneNum" class="input" placeholder="请输入手机号"></el-input>
      </div>
      <div class="input-nav">
        <div class="descript">验证码：</div>
        <el-input v-model.trim="checkCode" class="input" placeholder="请输入验证码"></el-input>
      </div>
      <div class="input-nav">
        <el-button type="primary" :disabled=codeDisabled @click="getCheckCode">获取验证码</el-button>
        <el-button type="primary" style="margin: 0px 10px" @click="loginFunc">登录</el-button>
      </div>

    </van-popup>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { setCookie } from '@/utils/token.js'

export default {
  name: 'Header',
  data () {
    return {
      // 展示弹出层
      showPopup: false,
      // 展示登录弹出层
      showLoginPopup: false,
      // 查询条件
      query: '',
      // 电话号码
      phoneNum: '',
      // 短信验证码
      checkCode: '',
      // 发送验证码的可点击状态
      codeDisabled: false
    }
  },
  computed: {
    // 用户名
    username () {
      const nickname = this.userInfo.nickname
      if (nickname) {
        // 如果已登录，可以获取到用户名
        return nickname
      } else {
        // 获取不到用户名，未登录
        return '立即登录'
      }
    },
    // 用户头像
    usericon () {
      const iconUrl = this.userInfo.avatarUrl
      if (iconUrl) {
        return iconUrl
      } else {
        return require('@/assets/header/unLogin.png')
      }
    },
    // 用户账户信息
    userInfo () {
      return this.$store.state.user.userInfo || {}
    }
  },
  mounted () {

  },
  methods: {
    // 跳转至登录
    toLogin () {
      this.showLoginPopup = true
    },
    // 退出登录
    logout () {
      Dialog.confirm({
        title: '确认要退出吗？'
        // message: '弹窗内容'
      }).then(async () => {
        const result = await this.$API.reqLogout()
        console.log(result)
        if (result.code === 200) {
          Toast.success('退出成功')
        }
      }).catch(() => {
        Toast('取消登出操作')
      })
    },
    // 获取验证码
    getCheckCode () {
      if (this.phoneNum) {
        // 已输入手机号
        const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        if (!myreg.test(this.phoneNum)) {
          // 手机号格式不正确
          Toast.fail('请填写正确的手机号码')
        } else {
          // 发送验证码
          this.$API.reqGetCheckCode(this.phoneNum)
          Toast.success('验证码已发送')
          // 禁止短时间内连续发送验证码
          this.codeDisabled = true
          setTimeout(() => {
            this.codeDisabled = false
          }, 60000)
        }
      } else {
        // 未输入手机号
        Toast.fail('请输入手机号')
      }
    },
    // 登录功能
    async loginFunc () {
      if (this.checkCode) {
        // 已输入验证码
        // 验证验证码
        const result = await this.$API.reqVerifyCode({
          phoneNum: this.phoneNum,
          captcha: this.checkCode
        })
        if (result.code === 200) {
          // 登录前先登出
          await this.$API.reqLogout()
          // 进行登录
          const loginResult = await this.$API.reqLoginByCode({
            phoneNum: this.phoneNum,
            captcha: this.checkCode
          })
          console.log(loginResult)
          if (loginResult.code === 200) {
            // 登录成功
            Toast.success('登录成功')
            // 获取用户信息
            this.$store.dispatch('getUserInfo')
            // 保存用户Cookie
            setCookie(loginResult.cookie)
            // 关闭登录弹出层
            this.showLoginPopup = false
            this.showPopup = false
            // 清空输入数据
            this.phoneNum = ''
            this.checkCode = ''
          } else {
            Toast.fail('登录失败')
          }
        } else {
          Toast.fail('验证码错误')
        }
      } else {
        // 未输入验证码
        Toast.fail('请输入验证码')
      }
    },
    tipMessage (message) {
      Toast(message)
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  //吸顶效果
  position: sticky;
  top: 0px;
  z-index: 1;

  .header-nav {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 42px;
    width: 100%;
    margin-bottom: 15px;
    background-color: white;

    .menu-icon {
      height: 100%;
      .van-button {
        height: 100%;
        border: 0px;
      }
    }

    .search-input {
      margin-left: 20px;
      width: 70%;

      .el-input {
        height: 28px;
        border-radius: 20px;
      }

      /deep/.el-input__inner {
        height: 28px;
        border-radius: 20px;
        background-color: rgb(248, 248, 248);
      }
    }
  }
}

.van-popup {
  width: 80%;
  height: 100%;
  background-color: rgb(245, 245, 245);

  .menu-nav {
    width: 100%;

    .user-nav {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 80%;
      height: 50px;
      //background-color: gray;

      .user-icon {
        width: 40px;
        height: 40px;
        margin: 0px 10px;
        border-radius: 50%;
      }

      .user-name {
        line-height: 50px;
      }
    }

    .van-cell-group {
      margin-top: 10px;

      .logout {
        text-align: center;
        color: red;
      }
    }
  }
}

.login-nav{
  width: 100vw;
  height: 35%;

  .title{
    text-align: center;
    font-size: 18px;
    width: 100%;
    margin: 20px 0px;
  }

  .input-nav{
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 10px 0px;

    .el-input{
      width: 60%;

    }
  }

}
</style>
