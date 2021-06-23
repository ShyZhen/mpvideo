<!-- 
   * 视频滑动及数据加载（仅支持微信小程序）
   1. pages.json中设置当前页面为自定义导航栏
   2. swiper 实现方式开启衔接滑动
   3. 2.4基础库微信小程序已支持video标签同层渲染，所以可使用正常标签
   4. swiperItem * 3, 同一时间存在3个swiperItem元素对应showlist属性 (showlist始终保持3个元素)
   5. 在数组到(底|顶) 时想向（下|上）滚动，加载数据将（上|下）个item设置为空数据
   6. 在滑动到空数据swiperItem时使用currentEx属性的方式将swiper强制返回上个元素实现回弹效果
   7. 视频数据目前保持增量更新不删除过期数据
 -->

<template>
	<view>

		<view class="navbar" :style="{top:statusbarH + 'px'}">
			<uni-icons type="back" color="#fff" size="30" @click="back" />
		</view>

		<!-- 勿删! 用于处理 IOS bug ，频繁触发视图渲染解决同层渲染bug -->
		<!-- controls 若为 true 可删 -->
		<view :style="{display:updateView ? 'block' : 'none'}" />

		<swiper class="sv-swiper" :duration="500" :vertical="true" circular @change="swiperChange" :current="currentEx">

			<!-- 此处不能加 key，加key会导致回弹失效。 -->
			<swiper-item v-for="(item,i) of showList">
				<view class="sv-item">
					<video :direction="0" :id="'video' + i" class="sv-video" :src="item.url" :controls="false"
						:show-loading="false" :show-mute-btn="false" :loop="true" :autoplay="false"
						:show-fullscreen-btn="false" :show-play-btn="false" :show-center-play-btn="false"
						@click="changeVideoState" />

					<!-- 内容区域 -->
					<block v-if="item.index != -1">
						<!--<operation :itemInfo.sync="item" />-->
						<view class="debug">
							<view>{{item.title}}</view>
							<view>当前视频的id:{{item._id}}</view>
						</view>
					</block>

					<image class="sv-play" v-show="!videoState" src="/static/play.png"
						mode="widthFix" />
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import utils from '../../utils/utils.js';
import operation from './components/operation.vue';

	export default {
		components: {
			operation
		},
		data() {
			return {
				baseList: [], // 数据池
				showList: [], // 当前显示的列表
				swiperIndex: 0, // 当前swiper的索引
				videoIndex: 0, // 当前视频播放的索引
				statusbarH: 0, // 状态栏高度
				videoState: true, // 当前视频播放的状态
				defualtVideoId: null, // 默认视频
				currentEx: 0, // 控制回弹字段
				reqLock: false, // 请求锁
				updateView: true // ios bug
			}
		},
		onLoad: function(option) {
			const res = wx.getSystemInfoSync()
			this.statusbarH = res.statusBarHeight;

			console.log(option)
			// 带参跳转
			if (option.id) {
				this.defualtVideoId = option.id;
			}
		},
		onReady() {
			this.getList();
			this.disposeIosBug();
		},
		methods: {
			// （防抖）获取数据列表
			getList: utils.debounce(function(id) {
				let isId = id == undefined;
				let {
					defualtVideoId,
					reqLock,
					baseList,
					videoIndex
				} = this.$data;

				baseList = isId ? [] : baseList;

				// 存在并且id相同不再重复加载避免异常错误
				if (defualtVideoId && defualtVideoId == id) {
					uni.showToast({
						title: '暂无更多视频',
						icon: 'none'
					});
					return;
				}

				// 请求query
				let query = {
					vId: !isId ? id : defualtVideoId,
					type: (defualtVideoId != undefined && !isId) ? (id < defualtVideoId ? 1 : 2) : 2,
				};

				// 是否能请求
				if (reqLock) {
					return;
				}

				this.reqLock = true;

				uni.showToast({
					title: query.type == 1 ? '向上加载数据' : '向下加载数据',
					icon: 'none'
				});

				// 请求接口
				this.$api.getVideoList(query).then(res => {

					if (!defualtVideoId) {
						defualtVideoId = this.defualtVideoId = res.current._id;
					}

					// id存在表示加载更多视频
					if (!isId) {
						let arr = id < defualtVideoId ? res.pre_video : res.after_video;

						if (arr.length <= 0) {
							uni.showToast({
								title: '暂无更多视频',
								icon: 'none'
							});
							return;
						}
						// 下滑加载
						else if (id < defualtVideoId) {
							baseList.unshift(...arr.reverse());
							this.videoIndex = videoIndex + arr.length; // 保持当前索引
						}
						// 上滑加载
						else {
							baseList = baseList.concat(arr);
						}
					} else {
						baseList = res.pre_video.reverse();
						baseList.push(res.current);
						baseList = baseList.concat(res.after_video);
					}

					// 重新赋值索引
					let index = 0;
					baseList.forEach(item => {
						item.index = index++;
						if (isId && item._id == this.defualtVideoId) {
							this.videoIndex = item.index;
						}
					});
					this.$set(this.$data, 'baseList', baseList);
					this.setShowList();
				}).finally(() => {
					this.reqLock = false;
				})

			}, 500),

			// 滑动改变
			swiperChange(e) {
				let newIndex = e.detail.current;
				let oldIndex = this.currentEx;
				this.currentEx = this.swiperIndex = newIndex;
				
				setTimeout(()=>{
					// 判 如果下一个视频没有则进行回弹
					let nowItem = this.showList[newIndex];
					if (nowItem.index != -1) {
						this.videoIndex = nowItem.index;
						this.setShowList();
					} else {
						this.getList(this.baseList[this.videoIndex]._id);
						this.currentEx = oldIndex;
					}
				},10)
				
				this.videoState = true;
			},

			// 对showlist(swiper所展示数据)
			setShowList() {
				let {
					videoIndex,
					swiperIndex
				} = this.$data;
				let list = this.baseList;

				if (!(list && list.length > 0))
					return;

				// 获取当前视频索引的上下视频
				let upVideo, nowVideo, nextVideo, noneVideo = {
					index: -1
				};

				// 获取上下视频然后到 顶/底 时则使用nonevideo占位
				upVideo = videoIndex - 1 < 0 ? noneVideo : list[videoIndex - 1];
				nowVideo = list[videoIndex];
				nextVideo = videoIndex + 1 >= list.length ? noneVideo : list[videoIndex + 1];

				// 获取当前swiperIndex的上下索引
				let upSwiperIndex = swiperIndex - 1 < 0 ? 2 : swiperIndex - 1;
				let nextSwiperIndex = swiperIndex + 1 >= 3 ? 0 : swiperIndex + 1;

				// 对showlist进行重新赋值
				let showList = this.showList;

				showList[upSwiperIndex] = upVideo;
				showList[swiperIndex] = nowVideo;
				showList[nextSwiperIndex] = nextVideo;

				this.$set(this.$data, 'showList', showList);

				// 播放当前选择的视频关闭其他的视频
				this.$nextTick(() => {
					uni.createVideoContext(`video${upSwiperIndex}`, this).stop();
					uni.createVideoContext(`video${nextSwiperIndex}`, this).stop();
					uni.createVideoContext(`video${swiperIndex}`, this).play();
				})
			},

			// 修改当前视频的播放状态
			changeVideoState(e) {
				let video = uni.createVideoContext(e.currentTarget.id, this);
				this.videoState ? video.pause() : video.play();
				this.videoState = !this.videoState;
			},

      // 处理 IOS controls为false情况下 同层渲染bug代码
      // 参考链接：https://developers.weixin.qq.com/community/develop/article/doc/0006cc4b0906587f80ab9873456813
      disposeIosBug() {
        setInterval(() => {
          this.updateView = false;
          this.$nextTick(() => {
            this.updateView = true;
          });
        }, 100);
      },

			// 通过视频id重置页面 (未测)
			resetVideoPage(videoId) {
				if (!videoId)
					return;
				this.baseList = []; // 数据池
				this.showList = []; // 当前显示的列表
				this.swiperIndex = 0; // 当前swiper的索引
				this.videoIndex = 0; // 当前视频播放的索引
				this.videoState = true; // 当前视频播放的状态
				this.defualtVideoId = videoId; // 默认视频
				this.currentEx = 0; // 控制回弹字段
				this.reqLock = false; // 请求锁
				this.getList();
			},
			// 返回
			back() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	page {
		background-color: #000;
	}
</style>

<style lang="scss" scoped>
	.debug {
		position: absolute;
		left: 50rpx;
		bottom: 100rpx;
		font-size: 32rpx;
		color: #fff;
	}

	.sv-item,
	.sv-swiper,
	.sv-video {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}

	.sv-play {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: .8;
		pointer-events: none;
		width: 100rpx;
	}

	.navbar {
		position: fixed;
		top: 0;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		z-index: 99;
	}
</style>
