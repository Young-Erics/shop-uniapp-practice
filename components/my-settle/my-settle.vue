<template>
  <view>
    <!-- 最外层的容器 -->
    <view class="my-settle-container">
      <!-- 全选区域 label表示点击全选也可以选中radio-->
      <label class="radio" @click="changeAllState">
        <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
      </label>
      <!-- 合计区域 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
      </view>
      <!-- 结算按钮 -->
      <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapGetters, mapMutations } from 'vuex'
  export default {
    name: "my-settle",
    computed: {
      ...mapGetters('moduleCart', ['checkedCount', 'totalGoods', 'checkedGoodsAmount']),
      ...mapGetters('moduleUser', ['addstr']),
      ...mapState('moduleUser', ['token']),
      // 定义全选。如果购物车里的商品总数量等于勾选的商品的总数量，就说明全部都打钩了。那么就让全选勾上
      isFullCheck() {
        return this.totalGoods === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('moduleCart', ['updateAllGoodsState']),
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击了结算按钮
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')

        // 2. 再判断用户是否选择了收货地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')

        // 3. 最后判断用户是否登录了
        if (!this.token) return uni.$showMsg('请先登录！')
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    // 将背景色从 cyan 改为 white
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      height: 50px;
      min-width: 100px;
      background-color: #c00000;
      color: white;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
