<template>
	<uni-popup ref="popup" type="bottom" :animation="true">
		<view class="p-boddy">
			<view class="header">
				<text>评论</text>
				<image src="/static/chenmushan-videoSwiper/close.png" mode="widthFix" @click="closePopup" />
			</view>

			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll" @scrolltolower="lower">
				<view class="comment-li" v-for="(item,i) of comments" :key="item._id">
					<image class="head-img" :src="item.avatarUrl" mode="widthFix" lazy-load />
					<view class="content">
						<view class="header">
							<text class="name">@{{item.name}}</text>
							<text class="date">{{item.created_time |dataFilters}}</text>
						</view>
						<view class="msg">{{item.msg}}</view>
					</view>
				</view>
				<view class="loading">{{loadingText}}</view>
			</scroll-view>

			<view class="comment-input">
				<input v-model="commentMsg" type="text" placeholder="发点皮的，皮这一下很开心" confirm-type="send"
					@confirm="commentConfirm">
			</view>

		</view>
	</uni-popup>
</template>

<script>
	// 测试服务器

	export default {
		data() {
			return {
				id: -1,
				scrollTop: 0,
				comments: [],
				commentMsg: '',
				loadingText: '',
				reqLock: false,
				itemInfo: {},
				listQuery: {
					page: 1,
					limit: 10
				}
			}
		},
		filters: {
			dataFilters(timeSpan) {
				let now = new Date(timeSpan),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate();
				return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0,
					8);
			}
		},
		methods: {
			showPopup(item) {
				this.itemInfo = item;
				this.commentMsg = '';
				if (this.id != item._id) {
					this.resetPopup(item._id);
				}

				this.$refs.popup.open();
			},
			resetPopup(id) {
				this.scrollTop = 0;
				this.id = id;
				this.comments = [];
				this.listQuery.page = 1;
				this.getList();
			},
			closePopup() {
				this.$refs.popup.close();
			},
			getList() {
				if (this.reqLock) {
					return;
				}
				this.reqLock = true;
				this.loadingText = '正在加载中...';
				this.$api.getCommentList({
					vId: this.id,
					...this.listQuery
				}).then(res => {
					this.reqLock = false;
					if (res.length > 0) {
						this.listQuery.page += 1;
						this.comments = this.comments.concat(res);
						this.loadingText = '加载更多...';

						if (res.length < this.listQuery.limit) {
							this.loadingText = '已经是我的底线了~';
						}

					} else {
						this.loadingText = '已经是我的底线了~';
					}
				})

			},
			lower(e) {
				this.getList();
			},
			commentConfirm() {
				let msg = this.commentMsg;
				this.commentMsg = '';

				if (msg) {
					let userInfo = uni.getStorageSync('userInfo');
					this.$api.addComment({
						vId: this.id,
						msg,
						...userInfo
					}).then(res => {
						uni.showToast({
							title: '评论成功',
						});
						this.itemInfo.commentNum++;
						this.resetPopup(this.id);
					})
				} else {
					uni.showToast({
						title: '请输入评论~',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.p-boddy {
		background-color: rgba(39, 39, 39, .95);
		/* 兼容 iOS < 11.2 */
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
		padding-bottom: env(safe-area-inset-bottom);

		padding: 30rpx;
		height: 60vh;
		border-radius: 16rpx 16rpx 0 0;



		display: flex;
		flex-direction: column;

		.header {
			position: relative;
			font-weight: bold;
			width: 100%;
			height: 50rpx;
			font-size: 32rpx;
			color: #fff;

			display: flex;
			align-items: center;
			justify-content: center;

			image {
				position: absolute;
				right: 0;
				width: 40rpx;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.scroll {
			flex: 1;
			height: calc(60vh - 130rpx);
		}

		.comment-input input {
			width: 100%;
			font-size: 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			color: #fff;
		}
	}

	.comment-li {
		display: flex;
		align-items: flex-start;
		color: #fff;
		width: 100%;

		.content {
			flex: 1;
		}

		.head-img {
			width: 80rpx;
			border-radius: 50%;
			flex-shrink: 0;
			margin-right: 10rpx;
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26rpx;

			.date {
				margin-right: 30rpx;
				font-weight: normal;
				color: rgba(255, 255, 255, .8);
				font-size: 25rpx;
			}
		}

		.msg {
			font-size: 28rpx;
		}
	}

	.comment-li+.comment-li {
		margin-top: 40rpx;
	}

	.loading {
		margin-top: 50rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
	}
</style>
