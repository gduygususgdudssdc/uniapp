<template>
	<view class="container">
		<view v-if="goods">
			<!-- 图片轮播 -->
			<swiper class="swiper" indicator-dots circular>
				<swiper-item v-for="(img, index) in goods.images" :key="index">
					<image class="swiper-image" :src="img" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			
			<!-- 商品信息 -->
			<view class="goods-info">
				<view class="price-row">
					<text class="price">¥{{ goods.price }}</text>
					<text class="original-price" v-if="goods.originalPrice">¥{{ goods.originalPrice }}</text>
				</view>
				<text class="title">{{ goods.title }}</text>
				<view class="meta">
					<text class="meta-item">成色：{{ goods.condition }}</text>
					<text class="meta-item">浏览：{{ goods.views }}</text>
					<text class="meta-item">收藏：{{ goods.likes }}</text>
				</view>
			</view>
			
			<!-- 卖家信息 -->
			<view class="seller-info" v-if="goods.sellerId" @click="goToChat(goods.sellerId)">
				<image class="seller-avatar" :src="sellerInfo.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
				<view class="seller-details">
					<text class="seller-name">{{ sellerInfo.username || '卖家' }}</text>
					<text class="seller-location">{{ goods.location || '未知地区' }}</text>
				</view>
				<text class="contact-btn">💬 联系卖家</text>
			</view>
			
			<!-- 商品描述 -->
			<view class="description">
				<text class="desc-title">商品描述</text>
				<text class="desc-content">{{ goods.description }}</text>
			</view>
			
			<!-- 底部操作栏 -->
			<view class="bottom-bar">
				<view class="action-btn" @click="toggleLike">
					<text class="like-icon">{{ goods.isLiked ? '❤️' : '🤍' }}</text>
					<text>收藏</text>
				</view>
				<button class="buy-btn" @click="handleBuy">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { goodsApi, userApi, orderApi, favoriteApi } from '@/utils/apiService.js'
import { checkLogin, getCurrentUserId } from '@/utils/auth.js'

const goodsId = ref('')
const goods = ref(null)
const sellerInfo = ref({
	id: null,
	username: '卖家',
	avatar: '/static/default-avatar.png'
})

async function loadGoods() {
	try {
		const goodsData = await goodsApi.getGoodsDetail(goodsId.value)
		if (goodsData) {
			// 处理图片数据
			if (typeof goodsData.images === 'string') {
				try {
					goodsData.images = JSON.parse(goodsData.images)
				} catch (e) {
					goodsData.images = [goodsData.images]
				}
			}
			if (!Array.isArray(goodsData.images)) {
				goodsData.images = []
			}
			
			// 初始化 isLiked 字段
			goodsData.isLiked = false
			
			// 如果用户已登录，检查是否已收藏
			if (checkLogin()) {
				try {
					const userId = getCurrentUserId()
					if (userId) {
						const isFavorite = await favoriteApi.checkFavorite(userId, goodsId.value)
						goodsData.isLiked = isFavorite
					}
				} catch (error) {
					console.error('检查收藏状态失败:', error)
				}
			}
			
			goods.value = goodsData
			
			// 加载卖家信息
			if (goodsData.sellerId) {
				try {
					const seller = await userApi.getUserInfo(goodsData.sellerId)
					if (seller) {
						sellerInfo.value = seller
					}
				} catch (error) {
					console.error('加载卖家信息失败:', error)
					// 使用默认值
					sellerInfo.value = {
						id: goodsData.sellerId,
						username: '卖家',
						avatar: '/static/default-avatar.png'
					}
				}
			}
		}
	} catch (error) {
		console.error('加载商品失败:', error)
		uni.showToast({ title: '加载商品失败', icon: 'none' })
	}
}
async function createOrder() {
	// 检查登录状态
	if (!checkLogin()) {
		return
	}
	
	const buyerId = getCurrentUserId()
	if (!buyerId) {
		uni.showToast({ title: '获取用户信息失败', icon: 'none' })
		return
	}
	
	if (!goods.value) {
		uni.showToast({ title: '商品信息不存在', icon: 'none' })
		return
	}
	
	try {
		// 创建订单
		const order = await orderApi.createOrder({
			goodsId: goodsId.value,
			buyerId: buyerId,
			quantity: 1
		})
		
		if (order && order.id) {
			uni.showToast({ 
				title: '订单创建成功', 
				icon: 'success',
				duration: 1500
			})
			
			// 延迟跳转到订单详情页面（付款页面）
			setTimeout(() => {
				uni.redirectTo({
					url: `/pages/order/detail?id=${order.id}`
				})
			}, 1500)
		} else {
			uni.showToast({ title: '订单创建失败', icon: 'none' })
		}
	} catch (error) {
		console.error('创建订单失败:', error)
		uni.showToast({ 
			title: error.message || '创建订单失败', 
			icon: 'none',
			duration: 2000
		})
	}
}
async function toggleLike() {
	// 检查登录状态
	if (!checkLogin()) {
		uni.showToast({ title: '请先登录', icon: 'none' })
		return
	}
	
	if (!goods.value) return
	
	const userId = getCurrentUserId()
	if (!userId) {
		uni.showToast({ title: '获取用户信息失败', icon: 'none' })
		return
	}
	
	try {
		if (goods.value.isLiked) {
			// 取消收藏
			await favoriteApi.removeFavorite(userId, goodsId.value)
			goods.value.isLiked = false
			if (goods.value.likes > 0) {
				goods.value.likes--
			}
			uni.showToast({ title: '已取消收藏', icon: 'success' })
		} else {
			// 添加收藏
			await favoriteApi.addFavorite(userId, goodsId.value)
			goods.value.isLiked = true
			goods.value.likes++
			uni.showToast({ title: '已收藏', icon: 'success' })
		}
	} catch (error) {
		console.error('收藏操作失败:', error)
		uni.showToast({ 
			title: error.message || '操作失败', 
			icon: 'none' 
		})
	}
}

function goToChat(sellerId) {
	if (!checkLogin()) {
		return
	}
	
	if (!sellerId) {
		uni.showToast({ title: '卖家信息不存在', icon: 'none' })
		return
	}
	
	uni.navigateTo({ 
		url: `/pages/message/chat?userId=${sellerId}` 
	})
}

function handleBuy() {
	// 检查登录状态
	if (!checkLogin()) {
		return
	}
	
	// 检查商品信息
	if (!goods.value) {
		uni.showToast({ title: '商品信息不存在', icon: 'none' })
		return
	}
	
	uni.showModal({
		title: '确认购买',
		content: `确定要购买"${goods.value.title}"吗？\n价格：¥${goods.value.price}`,
		success: (res) => {
			if (res.confirm) {
				createOrder()
			}
		}
	})
}

onLoad(async (options) => {
	if (options && options.id) {
		goodsId.value = options.id
		await loadGoods()
	}
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 100rpx;
}

.swiper {
	width: 100%;
	height: 750rpx;
	background-color: #fff;
}

.swiper-image {
	width: 100%;
	height: 100%;
}

.goods-info {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.price-row {
	display: flex;
	align-items: baseline;
	margin-bottom: 20rpx;
}

.price {
	font-size: 48rpx;
	color: #FF5722;
	font-weight: bold;
	margin-right: 20rpx;
}

.original-price {
	font-size: 28rpx;
	color: #999;
	text-decoration: line-through;
}

.title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

.meta {
	display: flex;
	gap: 30rpx;
}

.meta-item {
	font-size: 24rpx;
	color: #999;
}

.seller-info {
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.seller-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.seller-details {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.seller-name {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.seller-location {
	font-size: 24rpx;
	color: #999;
}

.contact-btn {
	padding: 10rpx 30rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 30rpx;
	font-size: 24rpx;
}

.description {
	background-color: #fff;
	padding: 30rpx;
}

.desc-title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

.desc-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;
	display: block;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 20rpx;
	border-top: 1rpx solid #eee;
	z-index: 999;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 30rpx;
	font-size: 24rpx;
	color: #666;
}

.like-icon {
	font-size: 32rpx;
	margin-bottom: 5rpx;
}

.buy-btn {
	flex: 1;
	background-color: #FF5722;
	color: #fff;
	border-radius: 50rpx;
	font-size: 28rpx;
	height: 80rpx;
	line-height: 80rpx;
	border: none;
}
</style>


