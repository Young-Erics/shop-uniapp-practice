<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <scroll-view scroll-y="true" :style="{height: wh + 'px'}">
      <!-- 轮播图区域 -->
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <!-- 循环渲染轮播图的 item 项 -->
        <swiper-item v-for="(item,i) in swiperList" :key="i">
          <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
            <!-- 动态绑定图片的 src 属性 -->
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>
      <!-- 分类导航区域 -->
      <view class="nav-list">
        <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
          <image :src="item.image_src" class="nav-img"></image>
        </view>
      </view>
      <!-- 楼层区域 -->
      <view class="floor-list">
        <!-- 楼层 item 项 -->
        <view class="floor-item" v-for="(item, i) in floorList" :key="i">
          <!-- 楼层标题 -->
          <image :src="item.floor_title.image_src" class="floor-title"></image>
          <!-- 楼层图片区域 start -->
          <view class="floor-img-box">
            <!-- 左侧大图片的盒子 -->
            <navigator class="left-img-box" :url="item.product_list[0].url">
              <!-- mode="widthFix"表示图片高度自适应 -->
              <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
                mode="widthFix"></image>
            </navigator>
            <!-- 右侧 4 个小图片的盒子 -->
            <view class="right-img-box">
              <!-- v-if="i2 !== 0"表示如果索引不为0，就渲染。因为索引为0的第一张图片是左侧的大图 -->
              <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
                :url="item2.url">
                <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
              </navigator>
            </view>
          </view>
          <!-- 楼层图片区域 end -->
        </view>
      </view>
    </scroll-view>

  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        wh: 0,
        // 接收轮播图的数据列表，默认为空数组
        swiperList: [],
        // 分类导航数据列表
        navList: [],
        // 楼层数据
        floorList: []
      }
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
      this.wh = sysInfo.windowHeight - 50
      // 调用获取分类列表数据的方法
      // 在小程序页面刚加载的时候，调用获取轮播图数据的方法
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 3. 获取轮播图数据的方法
      async getSwiperList() {
        // 3.1 发起请求
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // console.log(res) ，打印出来返回的是一个对象，包含message和meta属性
        // 请求失败
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 请求成功，为 data 中的数据赋值
        this.swiperList = res.message
      },
      async getNavList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        this.navList = res.message
      },
      async getFloorList() {
        const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) {
          return uni.$showMsg()
        }
        // 处理点击的url路径
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            // 给prod定义一个自定义属性url，因为navigator_url路径不对，所以要特地处理一下
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      // nav-item 项被点击时候的事件处理函数
      navClickHandler(item) {
        // 判断点击的是哪个 nav
        if (item.name === '分类') {
          // 跳转到分类标签
          uni.switchTab({ url: '/pages/cate/cate' })
        }
      },
      gotoSearch() {
        uni.navigateTo({ url: '/subpkg/search/search' })
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }

  .search-box {
    // 设置定位效果为“吸顶”
    // 和固定定位一样的是以浏览器可视窗口为参照点；区别是，粘性定位占有原先位置不脱标
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
</style>
