<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrapper">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="keyword" placeholder="搜索商品"
					@confirm="handleSearch" />
			</view>
		</view>
		
		<!-- 筛选栏 -->
		<view class="filter-bar">
			<view class="filter-item" @click="showSort = !showSort">
				<text>{{ sortText }}</text>
				<text class="arrow-icon">↓</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goToDetail(item.id)">
				<image class="goods-image" :src="item.images[0]" mode="aspectFill"></image>
				<view class="goods-info">
					<text class="goods-title">{{ item.title }}</text>
					<text class="goods-desc">{{ item.description }}</text>
					<view class="goods-footer">
						<text class="goods-price">¥{{ item.price }}</text>
						<text class="goods-location">{{ item.location }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="goodsList.length === 0" class="empty">
			<text>未找到相关商品</text>
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

<script>
import { goodsApi } from '@/utils/apiService.js'

export default {
	data() {
		return {
			keyword: '',
			currentSort: '',
			showSort: false,
			goodsList: [],
			sortOptions: [
				{ label: '综合排序', value: '' },
				{ label: '价格从低到高', value: 'price_asc' },
				{ label: '价格从高到低', value: 'price_desc' },
				{ label: '最新发布', value: 'time_desc' }
			]
		}
	},
	computed: {
		sortText() {
			const option = this.sortOptions.find(item => item.value === this.currentSort)
			return option ? option.label : '综合排序'
		}
	},
	onLoad(options) {
		if (options.keyword) {
			this.keyword = options.keyword
			this.handleSearch()
		}
	},
	methods: {
		async handleSearch() {
			try {
				const result = await goodsApi.searchGoods(this.keyword, 'onSale', 0, 20)
				let list = result.content || result || []
				
				// 处理排序
				if (this.currentSort === 'price_asc') {
					list.sort((a, b) => a.price - b.price)
				} else if (this.currentSort === 'price_desc') {
					list.sort((a, b) => b.price - a.price)
				} else if (this.currentSort === 'time_desc') {
					list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
				}
				
				// 处理图片数据
				list.forEach(item => {
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
				})
				
				this.goodsList = list
			} catch (error) {
				console.error('搜索失败:', error)
				uni.showToast({ title: '搜索失败', icon: 'none' })
				this.goodsList = []
			}
		},
		selectSort(value) {
			this.currentSort = value
			this.showSort = false
			this.handleSearch()
		},
		goToDetail(id) {
			uni.navigateTo({
				url: `/pages/goods/detail?id=${id}`
			})
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.search-bar {
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 40rpx;
	padding: 0 30rpx;
	height: 70rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	margin: 0 10rpx;
}

.search-icon {
	font-size: 24rpx;
	margin-right: 10rpx;
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

.filter-bar {
	display: flex;
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.filter-item {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #666;
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

.goods-location {
	font-size: 22rpx;
	color: #999;
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





