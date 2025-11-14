<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user-header">
			<view class="avatar-wrapper" @click="goToEdit">
				<image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
				<view class="avatar-edit-hint">点击编辑</view>
			</view>
			<view class="user-info" @click="goToEdit">
				<text class="username">{{ userInfo.username }}</text>
				<text class="user-level">{{ userInfo.level }}</text>
			</view>
			<text class="arrow-icon" @click="goToEdit">›</text>
		</view>
		
		<!-- 数据统计 -->
		<view class="stats">
			<view class="stat-item" @click="goToMyGoods">
				<text class="stat-value">{{ myGoodsCount }}</text>
				<text class="stat-label">我的商品</text>
			</view>
			<view class="stat-item" @click="goToFavorites">
				<text class="stat-value">{{ favoritesCount }}</text>
				<text class="stat-label">我的收藏</text>
			</view>
			<view class="stat-item" @click="goToOrders">
				<text class="stat-value">{{ ordersCount }}</text>
				<text class="stat-label">我的订单</text>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="menu-list">
			<view class="menu-item" @click="goToOrders">
				<text class="menu-icon">🛒</text>
				<text class="menu-text">我的订单</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToMyGoods">
				<text class="menu-icon">📦</text>
				<text class="menu-text">我的商品</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToFavorites">
				<text class="menu-icon">❤️</text>
				<text class="menu-text">我的收藏</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToAddress">
				<text class="menu-icon">📍</text>
				<text class="menu-text">地址管理</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToSettings">
				<text class="menu-icon">⚙️</text>
				<text class="menu-text">设置</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToHelp">
				<text class="menu-icon">❓</text>
				<text class="menu-text">帮助中心</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToFeedback">
				<text class="menu-icon">💬</text>
				<text class="menu-text">意见反馈</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToAbout">
				<text class="menu-icon">ℹ️</text>
				<text class="menu-text">关于我们</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
		
		<!-- 退出登录按钮 -->
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { userApi, goodsApi, orderApi,favoriteApi } from '@/utils/apiService.js'
import { getCurrentUser, getCurrentUserId, checkLogin, logout, isLoggedIn } from '@/utils/auth.js'

const userInfo = ref({
	id: null,
	username: '未登录',
	avatar: '',
	level: 'V1',
	score: 0,
	phone: '',
	email: '',
	address: ''
})

const myGoodsCount = ref(0)
const favoritesCount = ref(0)
const ordersCount = ref(0)

async function loadData() {
	// 检查登录状态
	if (!isLoggedIn()) {
		userInfo.value = {
			id: null,
			username: '未登录',
			avatar: 'https://i.pravatar.cc/100?img=0',
			level: 'V1',
			score: 0,
			phone: '',
			email: '',
			address: ''
		}
		myGoodsCount.value = 0
		favoritesCount.value = 0
		ordersCount.value = 0
		return
	}
	
	try {
		const userId = getCurrentUserId()
		if (!userId) {
			return
		}
		
		// 加载用户信息
		const currentUser = getCurrentUser()
		if (currentUser) {
			userInfo.value = { ...currentUser }
			
			// 从服务器获取最新用户信息
			try {
				const userData = await userApi.getUserInfo(userId)
				if (userData) {
					userInfo.value = { ...userData }
					// 更新本地存储
					uni.setStorageSync('userInfo', userData)
				}
			} catch (error) {
				console.error('获取用户信息失败:', error)
			}
		}
		
		// 统计数据
		try {
			// 我的商品数量
			const myGoods = await goodsApi.getMyGoods(userId)
			myGoodsCount.value = Array.isArray(myGoods) ? myGoods.length : 0
		} catch (error) {
			console.error('获取我的商品失败:', error)
		}
		
		try {
			// 订单数量
			const orders = await orderApi.getOrderList(userId)
			ordersCount.value = Array.isArray(orders) ? orders.length : 0
		} catch (error) {
			console.error('获取订单列表失败:', error)
		}
		
		try {
			const count = await favoriteApi.getFavoriteCount(userId)
			favoritesCount.value = count || 0
		} catch (error) {
			console.error('获取收藏数量失败:', error)
			favoritesCount.value = 0
		}
		
	} catch (error) {
		console.error('加载数据失败:', error)
	}
}

function handleLogout() {
	logout()
}

onLoad(() => {
	loadData()
})

onShow(() => {
	loadData()
})

// 导出方法供模板使用
const goToEdit = () => {
	if (!checkLogin()) return
	// 跳转到编辑页面
	uni.navigateTo({ url: '/pages/user/updata' })
}

const goToMyGoods = () => {
	if (!checkLogin()) return
	uni.navigateTo({ url: '/pages/goods/my' })
}

const goToFavorites = () => {
	if (!checkLogin()) return
	uni.navigateTo({ url: '/pages/user/favorites' })
}

const goToOrders = () => {
	if (!checkLogin()) return
	uni.navigateTo({ url: '/pages/order/list' })
}

const goToAddress = () => {
	if (!checkLogin()) return
	uni.navigateTo({ url: '/pages/address/list' })
}

const goToSettings = () => {
	uni.navigateTo({ url: '/pages/settings/index' })
}

const goToHelp = () => {
	uni.navigateTo({ url: '/pages/help/index' })
}

const goToFeedback = () => {
	uni.navigateTo({ url: '/pages/feedback/index' })
}

const goToAbout = () => {
	uni.navigateTo({ url: '/pages/about/index' })
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.user-header {
	display: flex;
	align-items: center;
	background-color: #007AFF;
	padding: 60rpx 40rpx 40rpx;
	color: #fff;
}

.avatar-wrapper {
	position: relative;
	margin-right: 30rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.avatar-edit-hint {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.6);
	color: #fff;
	font-size: 20rpx;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	white-space: nowrap;
	opacity: 0;
	transition: opacity 0.3s;
}

.avatar-wrapper:active .avatar-edit-hint {
	opacity: 1;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.user-level {
	font-size: 24rpx;
	opacity: 0.8;
}

.arrow-icon {
	font-size: 32rpx;
	color: #999;
	font-weight: bold;
}

.stats {
	display: flex;
	background-color: #fff;
	margin: -30rpx 40rpx 20rpx;
	border-radius: 20rpx;
	padding: 40rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #007AFF;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #999;
}

.menu-list {
	background-color: #fff;
	margin: 0 20rpx;
	border-radius: 20rpx;
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

.menu-icon {
	font-size: 24rpx;
	margin-right: 20rpx;
}

.menu-text {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	margin-left: 0;
}

.menu-arrow {
	font-size: 24rpx;
	color: #999;
	font-weight: bold;
}

.logout-section {
	padding: 40rpx 20rpx;
	margin-top: 40rpx;
}

.logout-btn {
	width: 100%;
	height: 88rpx;
	background-color: #fff;
	color: #FF3B30;
	border: 2rpx solid #FF3B30;
	border-radius: 20rpx;
	font-size: 32rpx;
	line-height: 88rpx;
	text-align: center;
}

.logout-btn:active {
	background-color: #FFEBE9;
}
</style>





