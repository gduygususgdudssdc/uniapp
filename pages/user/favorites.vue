<template>
	<view class="container">
		<view class="goods-list">
			<view class="goods-item" v-for="item in favoritesList" :key="item.id" @click="goToDetail(item.id)">
				<image class="goods-image" :src="item.images[0]" mode="aspectFill"></image>
				<view class="goods-info">
					<text class="goods-title">{{ item.title }}</text>
					<text class="goods-desc">{{ item.description }}</text>
					<view class="goods-footer">
						<text class="goods-price">¥{{ item.price }}</text>
						<view class="goods-actions">
							<text class="goods-time">{{ formatTime(item.createTime) }}</text>
							<view class="like-btn" @click.stop="toggleLike(item.id)">
								<uni-icons :type="item.isLiked ? 'heart-filled' : 'heart'" 
									size="20" :color="item.isLiked ? '#FF5722' : '#999'"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="favoritesList.length === 0" class="empty">
			<uni-icons type="heart" size="80" color="#ddd"></uni-icons>
			<text>暂无收藏</text>
		</view>
	</view>
</template>

<script>
import { getGoodsList } from '@/utils/mockData.js'

export default {
	data() {
		return {
			favoritesList: []
		}
	},
	onLoad() {
		this.loadFavorites()
	},
	methods: {
		loadFavorites() {
			this.favoritesList = getGoodsList({ status: 'onSale' }).filter(item => item.isLiked)
		},
		toggleLike(id) {
			const item = this.favoritesList.find(g => g.id === id)
			if (item) {
				item.isLiked = false
				this.favoritesList = this.favoritesList.filter(g => g.id !== id)
				uni.showToast({
					title: '已取消收藏',
					icon: 'success'
				})
			}
		},
		goToDetail(id) {
			uni.navigateTo({
				url: `/pages/goods/detail?id=${id}`
			})
		},
		formatTime(time) {
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
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
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

.goods-actions {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.goods-time {
	font-size: 22rpx;
	color: #999;
}

.like-btn {
	padding: 10rpx;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
	color: #999;
}

.empty text {
	margin-top: 30rpx;
	font-size: 28rpx;
}
</style>





