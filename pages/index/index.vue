<template>
	<view class="content">
		<video-list :videolist="videolist" @itemClick="itemClick"></video-list>
	</view>
</template>

<script>
  import VideoList from "../../components/videolist/video-list";

  export default {
    components: {VideoList},
    data() {
			return {
				videolist: [
					{
					  vid: '60c30961a30ce80001bb437d',
						image:'https://m.ykimg.com/0584000060A759C92027EE090EB42DD8',
						title:'一不小心捡到爱',
						desc:'失忆霸总爱上我',  //描述|摘要，有则显示
						jishu:'30集全',
						videotype:1,  //0 不要VIP || 1 要VIP 是否显示vip角标
					},
					{
            vid: '23232323',
						image:'https://puui.qpic.cn/vcover_vt_pic/0/mzc00200y4wycre1623742797529/350',
						title:'千古玦尘',
						desc:'周冬雨许凯三生亘古恋',
						jishu:'更新至14集',
						videotype:0,
					},
					{
            vid: '23232323',
						image:'https://puui.qpic.cn/vcover_vt_pic/0/qjr4mfe8xf85j0j1622169082720/350',
						title:'双世宠妃3',
						desc:'爆甜！坦诚夫妇三世独宠',
						jishu:'更新至30集',
						videotype:1,
					},
					{
            vid: '23232323',
						image:'https://m.ykimg.com/0584000060A759C92027EE090EB42DD8',
						title:'一不小心捡到爱',
						desc:'失忆霸总爱上我',
						jishu:'30集全',
						videotype:0,
					},
					{
            vid: '23232323',
						image:'https://puui.qpic.cn/vcover_vt_pic/0/mzc00200y4wycre1623742797529/350',
						title:'千古玦尘',
						desc:'周冬雨许凯三生亘古恋',
						jishu:'更新至14集',
						videotype:1,
					},
					{
            vid: '23232323',
						image:'https://puui.qpic.cn/vcover_vt_pic/0/qjr4mfe8xf85j0j1622169082720/350',
						title:'双世宠妃3',
						desc:'爆甜！坦诚夫妇三世独宠',
						jishu:'更新至30集',
						videotype:1,
					}
				],
			}
		},
		onLoad() {

		},
		methods: {
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
</style>
