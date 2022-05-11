export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: {
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // 本地持久化cart数据
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  },
  getters: {
    // 统计购物车商品总数量
    totalGoods(state) {
      let num = 0
      // 让每个商品的goods_count循环相加即得到总数量
      state.cart.forEach(goods => num += goods.goods_count)
      return num
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter(x => x.goods_state)
        .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
        .toFixed(2)
    }
  },
  // 模块的 mutations 方法
  mutations: {
    addCart(state, goods) {
      // find方法如果满足条件，则返回对应的第一个数组元素；如果不满足，则返回undefined
      const findResults = state.cart.find(item => item.goods_id === goods.goods_id)
      if (!findResults) {
        // 如果是findResults是undefined,证明没有这个商品。！undefined返回true，if才会执行
        // 而没有这个商品，就添加到购物车
        // console.log(findResults)
        state.cart.push(goods)
      } else {
        // 若购物车有这个商品，那么商品数量加1即可
        findResults.goods_count++
      }
      // 通过 commit 方法，调用 moduleCart 命名空间下的 saveToStorage 方法
      this.commit('moduleCart/saveToStorage')
      // console.log(state.cart) 
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResults = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResults) {
        // 更新对应商品的勾选状态
        findResults.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('moduleCart/saveToStorage')
      }
    },
    // 更新购物车的商品数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('moduleCart/saveToStorage')
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 过滤出原来的cart中不等于传入的goodsid，即把传入的goods筛了出去，达到了删除的目的
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('moduleCart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('moduleCart/saveToStorage')
    }
  }
}
