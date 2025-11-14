<template>
	<view class="container">
		<view class="menu-list">
			<view class="menu-item" @click="clearCache">
				<text class="menu-text">清除缓存</text>
				<text class="menu-value">{{ cacheSize }}</text>
				<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
			</view>
			<view class="menu-item">
				<text class="menu-text">消息通知</text>
				<switch :checked="notifications" @change="onNotificationChange" />
			</view>
			<view class="menu-item">
				<text class="menu-text">自动更新</text>
				<switch :checked="autoUpdate" @change="onAutoUpdateChange" />
			</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-item" @click="goToAbout">
				<text class="menu-text">关于我们</text>
				<text class="menu-value">v1.0.0</text>
				<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
			</view>
			<view class="menu-item" @click="goToHelp">
				<text class="menu-text">帮助中心</text>
				<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
			</view>
			<view class="menu-item" @click="goToFeedback">
				<text class="menu-text">意见反馈</text>
				<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
			</view>
		</view>
		
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cacheSize: '12.5MB',
			notifications: true,
			autoUpdate: true
		}
	},
	methods: {
		clearCache() {
			uni.showModal({
				title: '提示',
				content: '确定要清除缓存吗？',
				success: (res) => {
					if (res.confirm) {
						this.cacheSize = '0MB'
						uni.showToast({
							title: '清除成功',
							icon: 'success'
						})
					}
				}
			})
		},
		onNotificationChange(e) {
			this.notifications = e.detail.value
			uni.showToast({
				title: e.detail.value ? '已开启' : '已关闭',
				icon: 'none'
			})
		},
		onAutoUpdateChange(e) {
			this.autoUpdate = e.detail.value
			uni.showToast({
				title: e.detail.value ? '已开启' : '已关闭',
				icon: 'none'
			})
		},
		goToAbout() {
			uni.navigateTo({
				url: '/pages/about/index'
			})
		},
		goToHelp() {
			uni.navigateTo({
				url: '/pages/help/index'
			})
		},
		goToFeedback() {
			uni.navigateTo({
				url: '/pages/feedback/index'
			})
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '已退出',
							icon: 'success'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/user/login'
							})
						}, 1500)
					}
				}
			})
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 20rpx;
}

.menu-list {
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.menu-value {
	font-size: 26rpx;
	color: #999;
	margin-right: 20rpx;
}

.logout-section {
	margin-top: 40rpx;
}

.logout-btn {
	width: 100%;
	height: 88rpx;
	background-color: #FF5722;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	border: none;
}
</style>





