<template>
  <view class="content">
    <!-- 滚动分类 -->
    <scroll-view scroll-x="true" class="check-scroll">
      <view v-for="(item, index) in navList" :key="item.type"
            class="check-date cu-btn round"
            :class="item.type === videoId ? 'active' : ''"
            @tap="changeType(item)">
        {{item.title}}
      </view>
    </scroll-view>

    <video-list :videolist="navList[videoId].itemsList" @itemClick="itemClick"></video-list>
    <load-more :status="navList[videoId].loadMoreStatus" />
  </view>
</template>

<script>
import VideoList from "../../components/videolist/video-list"
import {getVideoInfos} from "@/apis/index"
import LoadMore from "../../components/loadmore/load-more";

export default {
  components: {LoadMore, VideoList},
  data() {
    return {
      pageSize: 10,
      videoId: 0,  // 第几个、也是type值
      navList: [
        {type: 0, title: '推荐'},  // all
        {type: 1, title: '搞笑'},  // 搞笑小视频
        {type: 2, title: '小品'},  // 完整小品
        {type: 3, title: '电影'},  // 电影解说
        {type: 4, title: '美女'},
        {type: 5, title: '新闻'},  // 各地耸人听闻的有趣新闻
        {type: 6, title: '科技'},  // 宇宙、人生、科技、产品、修仙等
        {type: 7, title: '悬疑'},  // 悬疑事件、案情
      ],
    }
  },
  onLoad() {
    this.loadTabBars()
  },
  methods: {
    loadTabBars() {
      this.navList.forEach(item => {
        this.$set(item, 'itemsList', [])
        // 加载更多 0加载前，1加载中，2没有更多了
        this.$set(item, 'loadMoreStatus', 0)
        this.$set(item, 'refreshing', 0)
        this.$set(item, 'currentPage', 1)
      })
      this.loadData('add')
    },
    loadData(type) {
      let that = this
      let tabItem = this.navList[this.videoId]
      // 加载
      if (type === 'add') {
        if (tabItem.loadMoreStatus === 2){
          return
        }
        tabItem.loadMoreStatus = 1
      }
      // 刷新
      if (type === 'refresh') {
        tabItem.currentPage = 1
      }

      getVideoInfos(this.videoId, tabItem.currentPage).then(res => {
        let list = res.data

        if (type === 'refresh') {
          // 刷新前清空数组
          tabItem.itemsList = []
        }
        list.forEach(item => {
          tabItem.itemsList.push(item)
        })

        // 下拉刷新 关闭刷新动画
        if (type === 'refresh') {
          that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
          tabItem.loadMoreStatus = 0
        }

        // 上滑加载 处理状态以及页数
        if (type === 'add') {
          tabItem.loadMoreStatus = list.length < this.pageSize ? 2: 0
        }
        tabItem.currentPage += 1
      }).catch(err => {})
    },
    onReachBottom() {
      //上滑加载
      setTimeout(() => {
        this.loadData('add');
      }, 1000);
    },
    //下拉刷新
    onPulldownReresh() {
      this.loadData('refresh');
    },
    changeType(item) {
      this.videoId = item.type
      this.loadData('add')
      console.log(this.navList)
    },

    getList(type) {
      this.videolist = [
        {
          vid: '60c30961a30ce80001bb437d',
          image:'https://m.ykimg.com/0584000060A759C92027EE090EB42DD8',
          title:'一不小心捡到爱',
          desc:'失忆霸总爱上我',  //描述|摘要，有则显示
          jishu:'30集全',
          viptype:1,  //0 不要VIP || 1 要VIP 是否显示vip角标
        },
        {
          vid: '23232323',
          image:'https://puui.qpic.cn/vcover_vt_pic/0/mzc00200y4wycre1623742797529/350',
          title:'千古玦尘',
          desc:'周冬雨许凯三生亘古恋',
          jishu:'更新至14集',
          viptype:0,
        },
        {
          vid: '23232323',
          image:'https://puui.qpic.cn/vcover_vt_pic/0/qjr4mfe8xf85j0j1622169082720/350',
          title:'双世宠妃3',
          desc:'爆甜！坦诚夫妇三世独宠',
          jishu:'更新至30集',
          viptype:1,
        },
        {
          vid: '23232323',
          image:'https://m.ykimg.com/0584000060A759C92027EE090EB42DD8',
          title:'一不小心捡到爱',
          desc:'失忆霸总爱上我',
          jishu:'30集全',
          viptype:0,
        },
        {
          vid: '23232323',
          image:'https://puui.qpic.cn/vcover_vt_pic/0/mzc00200y4wycre1623742797529/350',
          title:'千古玦尘',
          desc:'周冬雨许凯三生亘古恋',
          jishu:'更新至14集',
          viptype:1,
        },
        {
          vid: '23232323',
          image:'https://puui.qpic.cn/vcover_vt_pic/0/qjr4mfe8xf85j0j1622169082720/350',
          title:'双世宠妃3',
          desc:'爆甜！坦诚夫妇三世独宠',
          jishu:'更新至30集',
          viptype:1,
        }
      ]
    },
    itemClick(item) {
      console.log(item)
      // 原生video
      // uni.navigateTo({
      //   url: `/pages/video/index?id=${item.vid}`,
      // })

      // 腾讯视频插件
      uni.navigateTo({
        url: `/pages/txvideo/index?id=${item.vid}`,
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.check-scroll {
  width: 100%;
  white-space: nowrap;
  padding: 18px 0 18px 0;
  .check-date {
    margin: 0 8px 0 8px;
    display: inline-flex;
  }
  .active {
    color: #ffffff;
    background: #f52f2f;
  }
}
</style>
