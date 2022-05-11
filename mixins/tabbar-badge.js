// 按需导入 mapGetters 这个辅助方法
import { mapGetters } from 'vuex'
export default {
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  computed: {
    // 将 m_cart 模块中的 total 映射为当前页面的计算属性
    ...mapGetters('moduleCart', ['totalGoods']),
  },
  watch: {
    totalGoods() {
      // 重新为 tabBar 的数字徽章赋值,使用watch监听total值得变化能实时更新徽标的数字
      // 这里不用watch的完整写法是因为，setBadge已经定义好了，不用再传入newVal，再次调用方法一样能刷新
      this.setBadge()
    }
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2, // 索引
        text: this.totalGoods + '' // 注意：text 的值必须是字符串，不能是数字
      })
    }
  },
}
