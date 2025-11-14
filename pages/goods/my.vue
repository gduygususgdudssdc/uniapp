<template>
	<view class="container">
		<!-- 标签页 -->
		<view class="tabs">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === item.value }"
				v-for="item in tabs" 
				:key="item.value"
				@click="switchTab(item.value)"
			>
				<text>{{ item.label }}</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view 
				class="goods-item" 
				v-for="item in filterGoods" 
				:key="item.id"
			>
				<image 
					class="goods-image" 
					:src="item.images && item.images[0] ? item.images[0] : '/static/default-goods.png'" 
					mode="aspectFill"
					@click="goToDetail(item.id)"
				></image>
				<view class="goods-info">
					<text class="goods-title" @click="goToDetail(item.id)">{{ item.title }}</text>
					<view class="goods-meta">
						<text class="goods-price">¥{{ item.price }}</text>
						<text class="goods-status" :class="item.status">{{ getStatusText(item.status) }}</text>
					</view>
					<view class="goods-actions">
						<button class="action-btn" @click="editGoods(item.id)">编辑</button>
						<button class="action-btn danger" @click="deleteGoods(item.id)">删除</button>
						<button v-if="item.status === 'onSale'" class="action-btn" @click="offShelf(item.id)">下架</button>
						<button v-if="item.status === 'offShelf'" class="action-btn" @click="onShelf(item.id)">上架</button>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="filterGoods.length === 0 && !loading" class="empty">
			<text>暂无商品</text>
		</view>
		
		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { goodsApi } from '@/utils/apiService.js'
import { checkLogin, getCurrentUserId } from '@/utils/auth.js'

const goodsList = ref([])
const currentTab = ref('onSale')
const loading = ref(false)

const tabs = ref([
	{ label: '在售', value: 'onSale' },
	{ label: '已下架', value: 'offShelf' },
	{ label: '已售出', value: 'sold' }
])

const filterGoods = computed(() => {
	return goodsList.value.filter(item => item.status === currentTab.value)
})

async function loadGoods() {
	if (!checkLogin()) {
		return
	}
	
	const userId = getCurrentUserId()
	if (!userId) {
		uni.showToast({ title: '获取用户信息失败', icon: 'none' })
		return
	}
	
	loading.value = true
	try {
		const goods = await goodsApi.getMyGoods(userId)
		if (Array.isArray(goods)) {
			goods.forEach(item => {
				// 处理图片数据
				if (item.images && typeof item.images === 'string') {
					try {
						item.images = JSON.parse(item.images)
					} catch (e) {
						item.images = [item.images]
					}
				} else if (!Array.isArray(item.images)) {
					item.images = []
				}
			})
			goodsList.value = goods
		} else {
			goodsList.value = []
		}
	} catch (error) {
		console.error('加载商品失败:', error)
		uni.showToast({
			title: error.message || '加载商品失败',
			icon: 'none',
			duration: 2000
		})
		goodsList.value = []
	} finally {
		loading.value = false
	}
}

function switchTab(value) {
	currentTab.value = value
}

function getStatusText(status) {
	const statusMap = {
		'onSale': '在售',
		'offShelf': '已下架',
		'sold': '已售出'
	}
	return statusMap[status] || status
}

function goToDetail(id) {
	uni.navigateTo({
		url: `/pages/goods/detail?id=${id}`
	})
}

function editGoods(id) {
	uni.navigateTo({
		url: `/pages/goods/edit?id=${id}`
	})
}

async function deleteGoods(id) {
	uni.showModal({
		title: '提示',
		content: '确定要删除这个商品吗？',
		success: async (res) => {
			if (res.confirm) {
				try {
					await goodsApi.deleteGoods(id)
					uni.showToast({ title: '删除成功', icon: 'success' })
					loadGoods()
				} catch (error) {
					console.error('删除商品失败:', error)
					uni.showToast({
						title: error.message || '删除失败',
						icon: 'none'
					})
				}
			}
		}
	})
}

function prepareGoodsForUpdate(goods) {
	const updateData = { ...goods }
	if (Array.isArray(updateData.images)) {
		updateData.images = JSON.stringify(updateData.images)
	}
	delete updateData.createTime
	return updateData
}

async function offShelf(id) {
	try {
		const goods = goodsList.value.find(item => item.id === id)
		if (!goods) return
		
		const updateData = prepareGoodsForUpdate(goods)
		updateData.status = 'offShelf'
		await goodsApi.updateGoods(id, updateData)
		uni.showToast({ title: '已下架', icon: 'success' })
		loadGoods()
	} catch (error) {
		console.error('下架商品失败:', error)
		uni.showToast({
			title: error.message || '下架失败',
			icon: 'none'
		})
	}
}

async function onShelf(id) {
	try {
		const goods = goodsList.value.find(item => item.id === id)
		if (!goods) return
		
		const updateData = prepareGoodsForUpdate(goods)
		updateData.status = 'onSale'
		await goodsApi.updateGoods(id, updateData)
		uni.showToast({ title: '已上架', icon: 'success' })
		loadGoods()
	} catch (error) {
		console.error('上架商品失败:', error)
		uni.showToast({
			title: error.message || '上架失败',
			icon: 'none'
		})
	}
}

onLoad(() => {
	loadGoods()
})

onShow(() => {
	if (checkLogin()) {
		loadGoods()
	}
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
	flex-shrink: 0;
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
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.goods-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.goods-price {
	font-size: 32rpx;
	color: #FF5722;
	font-weight: bold;
}

.goods-status {
	font-size: 24rpx;
	padding: 5rpx 15rpx;
	border-radius: 5rpx;
}

.goods-status.onSale {
	background-color: #E3F2FD;
	color: #1976D2;
}

.goods-status.offShelf {
	background-color: #FFF3E0;
	color: #F57C00;
}

.goods-status.sold {
	background-color: #E8F5E9;
	color: #388E3C;
}

.goods-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 60rpx;
	line-height: 60rpx;
	background-color: #F5F5F5;
	color: #333;
	border-radius: 30rpx;
	font-size: 24rpx;
	border: none;
	padding: 0;
	text-align: center;
}

.action-btn.danger {
	background-color: #FFEBEE;
	color: #D32F2F;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
	font-size: 28rpx;
}

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
	font-size: 28rpx;
}
</style>
