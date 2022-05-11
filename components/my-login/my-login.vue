<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮,open-type="getUserInfo"表示开放获取用户信息，可以从@getuserinfo回调中获取到用户信息 -->
    <!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
    <!-- <button type="primary" class="btn-login" @click="getHa">测试</button> -->
    <button @click="noAdd">测试</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'my-login',
    data() {
      return {
        baraa: 'mm'
      }
    },
    methods: {
      ...mapMutations('moduleUser', ['updateUserInfo']),
      async noAdd() {
        const [err, res] = await uni.getUserProfile({
          desc: '获取用户信息',
          lang: 'zh_CN'
          /*         success: (e) => {
                     console.log("所有", e)
                   } */
        })
        // 成功的结果
        console.log(res)
        // 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(res.userInfo)
        // 获取登录成功后的 Token 字符串
        this.getToken(res)
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 拿code
        // 
        const [err, res] = await uni.login({
          provider: 'weixin',
          onlyAuthorize: 'true'
        }).catch(err => err)
        // 返回code和errMsg
        console.log(res)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // console.log(query)
        // 换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log(loginResult)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
