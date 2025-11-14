<template>
	<view class="container">
		<!-- 订单状态标签 -->
		<view class="tabs">
			<view class="tab-item" :class="{ active: currentTab === item.value }" 
				v-for="item in tabs" :key="item.value" @click="switchTab(item.value)">
				<text>{{ item.label }}</text>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-item" v-for="item in orderList" :key="item.id" @click="goToDetail(item.id)">
				<view class="order-header">
					<text class="order-no">订单号：{{ item.id }}</text>
					<text class="order-status" :class="item.status">{{ getStatusText(item.status) }}</text>
				</view>
				<view class="order-goods">
					<image class="goods-image" :src="item.goodsImage" mode="aspectFill"></image>
					<view class="goods-info">
						<text class="goods-title">{{ item.goodsTitle }}</text>
						<view class="goods-meta">
							<text class="goods-price">¥{{ item.price }}</text>
							<text class="goods-quantity">x{{ item.quantity }}</text>
						</view>
					</view>
				</view>
				<view class="order-footer">
					<text class="order-time">{{ item.createTime }}</text>
					<text class="order-total">合计：¥{{ item.totalPrice }}</text>
				</view>
				<view class="order-actions" v-if="item.status === 'pending'">
					<button class="action-btn" @click.stop="cancelOrder(item.id)">取消订单</button>
					<button class="action-btn primary" @click.stop="payOrder(item.id)">立即支付</button>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="orderList.length === 0 && !loading" class="empty">
			<text>暂无订单</text>
		</view>
		
		<!-- 加载中 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { orderApi } from '@/utils/apiService.js'
import { getCurrentUserId, checkLogin } from '@/utils/auth.js'

const orderList = ref([])
const userId = ref(null)
const currentTab = ref('all')
const loading = ref(false)
const tabs = ref([
	{ label: '全部', value: 'all' },
	{ label: '待付款', value: 'pending' },
	{ label: '待发货', value: 'paid' },
	{ label: '已完成', value: 'completed' }
])

// 加载订单列表
async function loadOrders() {
	// 检查登录状态
	if (!checkLogin()) {
		return
	}
	
	const currentUserId = getCurrentUserId()
	if (!currentUserId) {
		uni.showToast({ title: '获取用户信息失败', icon: 'none' })
		return
	}
	
	userId.value = currentUserId
	loading.value = true
	
	try {
		// 如果选择的是"全部"，不传status参数
		const status = currentTab.value === 'all' ? '' : currentTab.value
		const orders = await orderApi.getOrderList(currentUserId, status)
		
		// 处理订单数据
		if (Array.isArray(orders)) {
			orderList.value = orders.map(order => {
				// 处理商品图片（如果是JSON字符串，转换为数组）
				if (order.goodsImage && typeof order.goodsImage === 'string') {
					try {
						const images = JSON.parse(order.goodsImage)
						order.goodsImage = Array.isArray(images) ? images[0] : images
					} catch (e) {
						// 保持原样
					}
				}
				return order
			})
		} else {
			orderList.value = []
		}
	} catch (error) {
		console.error('加载订单失败:', error)
		uni.showToast({ 
			title: error.message || '加载订单失败', 
			icon: 'none',
			duration: 2000
		})
		orderList.value = []
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
// 切换标签
function switchTab(value) {
	currentTab.value = value
	loadOrders()
}

// 跳转到订单详情
function goToDetail(id) {
	uni.navigateTo({
		url: `/pages/order/detail?id=${id}`
	})
}

// 取消订单
async function cancelOrder(id) {
	uni.showModal({
		title: '提示',
		content: '确定要取消此订单吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					await orderApi.cancelOrder(id)
					uni.showToast({
						title: '订单已取消',
						icon: 'success'
					})
					loadOrders()
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
async function payOrder(id) {
	try {
		await orderApi.payOrder(id)
		uni.showToast({
			title: '支付成功',
			icon: 'success'
		})
		loadOrders()
	} catch (error) {
		console.error('支付失败:', error)
		uni.showToast({
			title: error.message || '支付失败',
			icon: 'none'
		})
	}
}
onLoad(() => {
	loadOrders()
})
onShow(() => {
	loadOrders()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.tabs {
	display: flex;
	background-color: #fff;
	padding: 0 20rpx;
	border-bottom: 1rpx solid #eee;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 30rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #007AFF;
	font-weight: bold;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 60rpx;
	height: 4rpx;
	background-color: #007AFF;
}

.order-list {
	padding: 20rpx;
}

.order-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.order-no {
	font-size: 24rpx;
	color: #999;
}

.order-status {
	font-size: 26rpx;
	font-weight: bold;
}

.order-status.pending {
	color: #FF9800;
}

.order-status.paid {
	color: #2196F3;
}

.order-status.completed {
	color: #4CAF50;
}

.order-goods {
	display: flex;
	margin-bottom: 20rpx;
}

.goods-image {
	width: 150rpx;
	height: 150rpx;
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
	margin-bottom: 10rpx;
}

.goods-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.goods-price {
	font-size: 30rpx;
	color: #FF5722;
	font-weight: bold;
}

.goods-quantity {
	font-size: 24rpx;
	color: #999;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.order-time {
	font-size: 24rpx;
	color: #999;
}

.order-total {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.order-actions {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
}

.action-btn {
	padding: 10rpx 30rpx;
	background-color: #F5F5F5;
	color: #333;
	border-radius: 30rpx;
	font-size: 24rpx;
	border: none;
}

.action-btn.primary {
	background-color: #007AFF;
	color: #fff;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
}
</style>





