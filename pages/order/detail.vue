<template>
	<view class="container">
		<!-- 加载中 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		
		<view v-if="order && !loading">
			<!-- 订单状态 -->
			<view class="status-section">
				<text class="status-icon">{{ getStatusIcon(order.status) }}</text>
				<text class="status-text">{{ getStatusText(order.status) }}</text>
				<text class="status-desc">{{ getStatusDesc(order.status) }}</text>
			</view>
			
			<!-- 商品信息 -->
			<view class="goods-section">
				<image class="goods-image" :src="order.goodsImage" mode="aspectFill"></image>
				<view class="goods-info">
					<text class="goods-title">{{ order.goodsTitle }}</text>
					<view class="goods-meta">
						<text class="goods-price">¥{{ order.price }}</text>
						<text class="goods-quantity">x{{ order.quantity }}</text>
					</view>
				</view>
			</view>
			
			<!-- 订单信息 -->
			<view class="info-section">
				<view class="info-item">
					<text class="info-label">订单号</text>
					<text class="info-value">{{ order.id }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">下单时间</text>
					<text class="info-value">{{ order.createTime }}</text>
				</view>
				<view class="info-item" v-if="order.payTime">
					<text class="info-label">支付时间</text>
					<text class="info-value">{{ order.payTime }}</text>
				</view>
				<view class="info-item" v-if="order.completeTime">
					<text class="info-label">完成时间</text>
					<text class="info-value">{{ order.completeTime }}</text>
				</view>
			</view>
			
			<!-- 卖家信息 -->
			<view class="seller-section" v-if="order.seller">
				<text class="section-title">卖家信息</text>
				<view class="seller-info">
					<image class="seller-avatar" :src="order.seller.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					<text class="seller-name">{{ order.seller.username || '卖家' }}</text>
					<text class="contact-btn" @click="goToChat(order.seller.id)">💬 联系卖家</text>
				</view>
			</view>
			
			<!-- 价格明细 -->
			<view class="price-section">
				<view class="price-item">
					<text class="price-label">商品总额</text>
					<text class="price-value">¥{{ order.price * order.quantity }}</text>
				</view>
				<view class="price-item">
					<text class="price-label">运费</text>
					<text class="price-value">¥0</text>
				</view>
				<view class="price-total">
					<text class="total-label">实付金额</text>
					<text class="total-value">¥{{ order.totalPrice }}</text>
				</view>
			</view>
			
			<!-- 操作按钮 -->
			<view class="actions" v-if="order.status === 'pending'">
				<button class="action-btn" @click="cancelOrder">取消订单</button>
				<button class="action-btn primary" @click="payOrder">立即支付</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { orderApi, userApi } from '@/utils/apiService.js'
import { checkLogin, getCurrentUserId } from '@/utils/auth.js'

const orderId = ref('')
const order = ref(null)
const loading = ref(false)

// 加载订单详情
async function loadOrder() {
	if (!orderId.value) {
		return
	}
	
	loading.value = true
	try {
		const orderData = await orderApi.getOrderDetail(orderId.value)
		
		if (orderData) {
			// 处理商品图片
			if (orderData.goodsImage && typeof orderData.goodsImage === 'string') {
				try {
					const images = JSON.parse(orderData.goodsImage)
					orderData.goodsImage = Array.isArray(images) ? images[0] : images
				} catch (e) {
					// 保持原样
				}
			}
			
			// 加载卖家信息
			if (orderData.sellerId && !orderData.seller) {
				try {
					const seller = await userApi.getUserInfo(orderData.sellerId)
					if (seller) {
						orderData.seller = seller
					}
				} catch (error) {
					console.error('加载卖家信息失败:', error)
					orderData.seller = {
						id: orderData.sellerId,
						username: '卖家',
						avatar: '/static/default-avatar.png'
					}
				}
			}
			
			order.value = orderData
		}
	} catch (error) {
		console.error('加载订单失败:', error)
		uni.showToast({ 
			title: error.message || '加载订单失败', 
			icon: 'none',
			duration: 2000
		})
	} finally {
		loading.value = false
	}
}

function getStatusText(status) {
	const map = {
		pending: '待付款',
		paid: '待发货',
		shipped: '已发货',
		completed: '已完成',
		cancelled: '已取消'
	}
	return map[status] || ''
}

function getStatusIcon(status) {
	const map = {
		pending: '💰',
		paid: '📦',
		shipped: '🚚',
		completed: '✅',
		cancelled: '❌'
	}
	return map[status] || 'ℹ️'
}

function getStatusColor(status) {
	const map = {
		pending: '#FF9800',
		paid: '#2196F3',
		shipped: '#9C27B0',
		completed: '#4CAF50',
		cancelled: '#999'
	}
	return map[status] || '#999'
}

function getStatusDesc(status) {
	const map = {
		pending: '请尽快完成支付',
		paid: '卖家正在准备发货',
		shipped: '商品正在路上',
		completed: '交易已完成',
		cancelled: '订单已取消'
	}
	return map[status] || ''
}

function goToChat(userId) {
	if (!checkLogin()) {
		return
	}
	
	uni.navigateTo({
		url: `/pages/message/chat?userId=${userId}`
	})
}

// 取消订单
async function cancelOrder() {
	uni.showModal({
		title: '提示',
		content: '确定要取消此订单吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					await orderApi.cancelOrder(orderId.value)
					uni.showToast({
						title: '订单已取消',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				} catch (error) {
					console.error('取消订单失败:', error)
					uni.showToast({
						title: error.message || '取消订单失败',
						icon: 'none'
					})
				}
			}
		}
	})
}

// 支付订单
async function payOrder() {
	if (!order.value) {
		return
	}
	
	uni.showModal({
		title: '确认支付',
		content: `确定要支付 ¥${order.value.totalPrice} 吗？`,
		success: async (res) => {
			if (res.confirm) {
				try {
					await orderApi.payOrder(orderId.value)
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					})
					// 重新加载订单信息
					setTimeout(() => {
						loadOrder()
					}, 1500)
				} catch (error) {
					console.error('支付失败:', error)
					uni.showToast({
						title: error.message || '支付失败',
						icon: 'none'
					})
				}
			}
		}
	})
}

onLoad((options) => {
	if (options && options.id) {
		orderId.value = options.id
		loadOrder()
	}
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 40rpx;
}

.status-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	padding: 60rpx 0;
	margin-bottom: 20rpx;
}

.status-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 200rpx 0;
	color: #999;
	font-size: 28rpx;
}

.status-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin: 20rpx 0 10rpx;
}

.status-desc {
	font-size: 24rpx;
	color: #999;
}

.goods-section {
	display: flex;
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.goods-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.goods-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.goods-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.goods-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.goods-price {
	font-size: 32rpx;
	color: #FF5722;
	font-weight: bold;
}

.goods-quantity {
	font-size: 24rpx;
	color: #999;
}

.info-section {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.info-item:last-child {
	margin-bottom: 0;
}

.info-label {
	font-size: 28rpx;
	color: #999;
}

.info-value {
	font-size: 28rpx;
	color: #333;
}

.seller-section {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

.seller-info {
	display: flex;
	align-items: center;
}

.seller-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.seller-name {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.contact-btn {
	padding: 10rpx 30rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 30rpx;
	font-size: 24rpx;
}

.price-section {
	background-color: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.price-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.price-label {
	font-size: 28rpx;
	color: #666;
}

.price-value {
	font-size: 28rpx;
	color: #333;
}

.price-total {
	display: flex;
	justify-content: space-between;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.total-label {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
}

.total-value {
	font-size: 36rpx;
	color: #FF5722;
	font-weight: bold;
}

.actions {
	display: flex;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #fff;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	background-color: #F5F5F5;
	color: #333;
	border-radius: 50rpx;
	font-size: 28rpx;
	border: none;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #fff;
}
</style>





