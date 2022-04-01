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
          <img src="@/assets/user_icon.jpg" class="user-icon" />
          <div class="user-name">Jhun</div>
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
        <van-cell-group inset>
          <van-cell :clickable="true" @click="tipMessage('暂未开发此功能')">
            <template name="title">
              <div class="logout">退出登陆 / 关闭</div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'

export default {
  name: 'Header',
  data () {
    return {
      // 展示弹出层
      showPopup: false,
      // 查询条件
      query: ''
    }
  },
  mounted () {
    // this.$API.reqTest().then(res => {
    //   console.log(res)
    // })
  },
  methods: {
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
</style>
