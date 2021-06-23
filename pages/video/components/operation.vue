<template>
	<view class="boddy">
		<view class="m-icon" @click="changeLike">
			<image v-show="info.like" src="/static/chenmushan-videoSwiper/like.png" mode="widthFix" />
			<image v-show="!info.like" src="/static/chenmushan-videoSwiper/no-like.png" mode="widthFix" />
			<text>{{info.likeNum}}</text>
		</view>

		<view class="m-icon" @click="showCommentModal">
			<image src="/static/chenmushan-videoSwiper/comment.png" mode="widthFix"></image>
			<text>{{info.commentNum}}</text>
		</view>

		<!-- 评论弹窗 -->
		<popup-comment ref="popupComment" />
	</view>
</template>
x
<script>
import utils from '../../../utils/utils.js';
import popupComment from './popupComment.vue';

	export default {
		components: {
			popupComment
		},
		props: {
			itemInfo: {
				type: Object,
				default: function() {
					return {
						like: false,
						likeNum: 0,
						commentNum: 0
					}
				}
			}
		},
		data() {
			return {
				info: JSON.parse(JSON.stringify(this.itemInfo))
			}
		},
		watch: {
			itemInfo: {
				deep: true,
				handler() {
					this.$set(this.$data, 'info', JSON.parse(JSON.stringify(this.itemInfo)));
				}
			}
		},
		methods: {
			changeLike() {
				// 视觉修改
				
				if(this.info.like){
					
					this.$set(this.info, 'likeNum', this.info.likeNum - 1);
				}
				else{
					this.$set(this.info, 'likeNum', this.info.likeNum + 1);
				}
				
				this.$set(this.info, 'like', !this.info.like);
				
				this.postChangeLike();
			},
			// 展示评论弹框
			showCommentModal() {
				this.$refs.popupComment.showPopup(this.itemInfo);
			},
			// 防抖进行接口请求
			postChangeLike: utils.debounce(function() {

				let userInfo = uni.getStorageSync('userInfo');

				this.$api.updateVideoLike({
					uId: userInfo.nickName,
					vId: this.info._id,
					status: this.info.like
				}).then(res => {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					this.itemInfo.like = this.info.like;
					this.itemInfo.likeNum = this.info.likeNum = res.likeNum;
				})

			}, 500),
		}
	}
</script>

<style scoped lang="scss">
	.boddy {
		position: absolute;
		right: 50rpx;
		bottom: 500rpx;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.m-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 64rpx;
		}

		text {
			color: #fff;
		}
	}

	.m-icon+.m-icon {
		margin-top: 50rpx;
	}
</style>
