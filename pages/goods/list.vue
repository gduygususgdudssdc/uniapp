<template>
	<view class="container">
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" @click="showSort = !showSort">
				<text>{{ sortText }}</text>
				<text class="arrow-icon">↓</text>
			</view>
			<view class="filter-item" @click="showCategory = !showCategory">
				<text>{{ categoryName || '全部分类' }}</text>
				<text class="arrow-icon">↓</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id">
				<image class="goods-image" :src="item.images && item.images[0] ? item.images[0] : '/static/default-goods.png'" mode="aspectFill" @click="goToDetail(item.id)"></image>
				<view class="goods-info">
					<text class="goods-title" @click="goToDetail(item.id)">{{ item.title }}</text>
					<text class="goods-desc" @click="goToDetail(item.id)">{{ item.description }}</text>
					
					<!-- 卖家信息 -->
					<view class="seller-info" v-if="item.seller" @click.stop="goToChat(item.seller.id)">
						<image class="seller-avatar" :src="item.seller.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
						<text class="seller-name">{{ item.seller.username || '卖家' }}</text>
						<text class="chat-icon">💬</text>
					</view>
					
					<view class="goods-footer">
						<text class="goods-price">¥{{ item.price }}</text>
						<view class="goods-meta">
							<text class="goods-location">{{ item.location }}</text>
							<text class="goods-time">{{ formatTime(item.createTime) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="goodsList.length === 0" class="empty">
			<text>暂无商品</text>
		</view>
		
		<!-- 排序弹窗 -->
		<view v-if="showSort" class="popup" @click="showSort = false">
			<view class="popup-content" @click.stop>
				<view class="popup-item" v-for="item in sortOptions" :key="item.value"
					:class="{ active: currentSort === item.value }" @click="selectSort(item.value)">
					<text>{{ item.label }}</text>
					<text v-if="currentSort === item.value" class="checkmark-icon">✓</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { goodsApi, categoryApi, userApi } from '@/utils/apiService.js'
import { getCurrentUserId, checkLogin } from '@/utils/auth.js'

const categoryId = ref('')
const categoryName = ref('')
const currentSort = ref('')
const showSort = ref(false)
const showCategory = ref(false)
const goodsList = ref([])
const sortOptions = ref([
	{ label: '综合排序', value: '' },
	{ label: '价格从低到高', value: 'price_asc' },
	{ label: '价格从高到低', value: 'price_desc' },
	{ label: '最新发布', value: 'time_desc' }
])

const sortText = computed(() => {
	const option = sortOptions.value.find(item => item.value === currentSort.value)
	return option ? option.label : '综合排序'
})

async function loadGoods() {
	try {
		const params = {
			status: 'onSale',
			page: 0,
			size: 20
		}
		if (categoryId.value) {
			params.categoryId = categoryId.value
		}
		
		const result = await goodsApi.getGoodsList(params)
		let list = result.content || result || []
		
		// 处理排序
		if (currentSort.value === 'price_asc') {
			list.sort((a, b) => a.price - b.price)
		} else if (currentSort.value === 'price_desc') {
			list.sort((a, b) => b.price - a.price)
		} else if (currentSort.value === 'time_desc') {
			list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
		}
		
		// 处理图片数据和卖家信息
		for (let item of list) {
			// 处理图片
			if (typeof item.images === 'string') {
				try {
					item.images = JSON.parse(item.images)
				} catch (e) {
					item.images = [item.images]
				}
			}
			if (!Array.isArray(item.images)) {
				item.images = []
			}
			
			// 加载卖家信息
			if (item.sellerId && !item.seller) {
				try {
					const seller = await userApi.getUserInfo(item.sellerId)
					if (seller) {
						item.seller = seller
					}
				} catch (error) {
					console.error('加载卖家信息失败:', error)
					// 如果加载失败，使用默认值
					item.seller = {
						id: item.sellerId,
						username: '卖家',
						avatar: '/static/default-avatar.png'
					}
				}
			}
		}
		
		goodsList.value = list
	} catch (error) {
		console.error('加载商品失败:', error)
		uni.showToast({ title: '加载商品失败', icon: 'none' })
		goodsList.value = []
	}
}

function selectSort(value) {
	currentSort.value = value
	showSort.value = false
	loadGoods()
}

function goToDetail(id) {
	uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
}

// 跳转到聊天页面
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

function formatTime(time) {
	const date = new Date(time)
	const now = new Date()
	const diff = now - date
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))
	if (days === 0) {
		const hours = Math.floor(diff / (1000 * 60 * 60))
		if (hours === 0) {
			const minutes = Math.floor(diff / (1000 * 60))
			return minutes + '分钟前'
		}
		return hours + '小时前'
	}
	return days + '天前'
}

onLoad(async (options) => {
	if (options && options.categoryId) {
		categoryId.value = options.categoryId
		try {
			const category = await categoryApi.getCategoryDetail(categoryId.value)
			if (category) {
				categoryName.value = category.name
			}
		} catch (error) {
			console.error('加载分类信息失败:', error)
		}
	}
	await loadGoods()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.filter-bar {
	display: flex;
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.filter-item {
	display: flex;
	align-items: center;
	margin-right: 40rpx;
	font-size: 28rpx;
	color: #666;
}

.arrow-icon {
	font-size: 20rpx;
	margin-left: 10rpx;
	color: #666;
}

.checkmark-icon {
	font-size: 24rpx;
	color: #007AFF;
	font-weight: bold;
}

.goods-list {
	padding: 20rpx;
}

.goods-item {
	display: flex;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
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
	font-weight: bold;
	margin-bottom: 10rpx;
}

.goods-desc {
	font-size: 24rpx;
	color: #999;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	margin-bottom: 10rpx;
}

.goods-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.goods-price {
	font-size: 32rpx;
	color: #FF5722;
	font-weight: bold;
}

.goods-meta {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.goods-location {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 5rpx;
}

.goods-time {
	font-size: 22rpx;
	color: #999;
}

.seller-info {
	display: flex;
	align-items: center;
	margin: 10rpx 0;
	padding: 10rpx;
	background-color: #F5F5F5;
	border-radius: 8rpx;
}

.seller-avatar {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	margin-right: 10rpx;
}

.seller-name {
	flex: 1;
	font-size: 22rpx;
	color: #666;
}

.chat-icon {
	font-size: 24rpx;
	margin-left: 10rpx;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
}

.popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}

.popup-content {
	background-color: #fff;
	margin-top: 88rpx;
}

.popup-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #eee;
}

.popup-item.active {
	color: #007AFF;
}
</style>

