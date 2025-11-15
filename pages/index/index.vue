<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar" @click="goToSearch">
			<text class="search-icon">🔍</text>
			<text class="search-text">搜索商品</text>
		</view>
		
		<!-- Banner 轮播图 -->
		<view class="swiper-container">
			<swiper 
				class="swiper" 
				indicator-dots 
				autoplay 
				circular 
				:display-multiple-items="1"
				previous-margin="30rpx"
				next-margin="30rpx"
				:current="currentIndex"
				@change="onSwiperChange"
			>
				<swiper-item v-for="(banner, index) in banners" :key="index" v-if="banners.length > 0">
					<view 
						class="swiper-item-wrapper" 
						:class="{ active: currentIndex === index }"
						@click="handleBannerClick(index)"
					>
						<image class="swiper-image" :src="banner" mode="aspectFill"></image>
					</view>
			</swiper-item>
		</swiper>
		</view>
		
		<!-- 分类导航 -->
		<view class="category-nav">
			<view 
				class="category-item" 
				v-for="item in categories" 
				:key="item.id"
				@click="goToCategory(item.id)"
			>
				<text class="category-icon">{{ item.icon }}</text>
				<text class="category-name">{{ item.name }}</text>
			</view>
		</view>
		
		<!-- 推荐商品 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">推荐商品</text>
				<text class="section-more" @click="goToGoodsList">更多 ></text>
			</view>
			<view class="goods-grid">
				<view 
					class="goods-item" 
					v-for="item in recommendGoods" 
					:key="item.id"
				>
					<image 
						class="goods-image" 
						:src="item.images && item.images[0] ? item.images[0] : ''" 
						mode="aspectFill"
						@click="goToDetail(item.id)"
					></image>
					<view class="goods-info">
						<text class="goods-title" @click="goToDetail(item.id)">{{ item.title }}</text>
						<view v-if="item.seller" class="seller-mini" @click.stop="goToChat(item.seller.id)">
							<text class="seller-mini-name">{{ item.seller.username || '卖家' }}</text>
							<text class="chat-mini-icon">💬</text>
						</view>
						<view class="goods-footer">
							<text class="goods-price">¥{{ item.price }}</text>
							<text class="goods-location">{{ item.location }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 最新上架 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">最新上架</text>
				<text class="section-more" @click="goToGoodsList">更多 ></text>
			</view>
			<view class="goods-list">
				<view 
					class="goods-row" 
					v-for="item in latestGoods" 
					:key="item.id"
				>
					<image 
						class="goods-row-image" 
						:src="item.images && item.images[0] ? item.images[0] : ''" 
						mode="aspectFill"
						@click="goToDetail(item.id)"
					></image>
					<view class="goods-row-info">
						<text class="goods-row-title" @click="goToDetail(item.id)">{{ item.title }}</text>
						<text class="goods-row-desc" @click="goToDetail(item.id)">{{ item.description }}</text>
						<view v-if="item.seller" class="seller-mini" @click.stop="goToChat(item.seller.id)">
							<text class="seller-mini-name">{{ item.seller.username || '卖家' }}</text>
							<text class="chat-mini-icon">💬</text>
						</view>
						<view class="goods-row-footer">
							<text class="goods-row-price">¥{{ item.price }}</text>
							<text class="goods-row-time">{{ formatTime(item.createTime) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { bannerApi, categoryApi, goodsApi, userApi } from '@/utils/apiService.js'
import { checkLogin } from '@/utils/auth.js'

const banners = ref([])
const bannerList = ref([])
const currentIndex = ref(0)
const categories = ref([])
const recommendGoods = ref([])
const latestGoods = ref([])

function onSwiperChange(e) {
	currentIndex.value = e.detail.current
}

async function loadData() {
	try {
		// 加载 Banner
		try {
			const list = await bannerApi.getBannerList()
			bannerList.value = list
			banners.value = list.map(banner => banner.imageUrl)
		} catch (error) {
			console.error('加载Banner失败:', error)
			// 使用本地图片作为后备（如果后端没有配置 banner）
			banners.value = []
		}
		
		// 加载分类
		const categoryList = await categoryApi.getCategoryList()
		categories.value = categoryList.slice(0, 8)
		
		// 加载推荐商品
		const recommendResult = await goodsApi.getGoodsList({
			status: 'onSale',
			page: 0,
			size: 6
		})
		recommendGoods.value = recommendResult.content || recommendResult
		
		// 加载最新商品
		const latestResult = await goodsApi.getGoodsList({
			status: 'onSale',
			page: 0,
			size: 5
		})
		latestGoods.value = latestResult.content || latestResult
		
		// 处理商品图片和卖家信息
		await processGoodsImages(recommendGoods.value)
		await processGoodsImages(latestGoods.value)
	} catch (error) {
		console.error('加载数据失败:', error)
		uni.showToast({ title: '加载数据失败', icon: 'none' })
	}
}

async function processGoodsImages(goodsList) {
	if (!Array.isArray(goodsList)) return
	
	for (let item of goodsList) {
		// 处理图片数据
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
				item.seller = {
					id: item.sellerId,
					username: '卖家',
					avatar: '/static/default-avatar.png'
				}
			}
		}
	}
}

function handleBannerClick(index) {
	const banner = bannerList.value[index]
	if (banner && banner.linkUrl) {
		uni.navigateTo({ url: banner.linkUrl })
	}
}

function goToSearch() {
	uni.navigateTo({ url: '/pages/search/index' })
}

function goToCategory(categoryId) {
	uni.navigateTo({ url: `/pages/goods/list?categoryId=${categoryId}` })
}

function goToGoodsList() {
	uni.navigateTo({ url: '/pages/goods/list' })
}

function goToDetail(id) {
	uni.navigateTo({ url: `/pages/goods/detail?id=${id}` })
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

function formatTime(time) {
	if (!time) return ''
	const date = new Date(time)
	const now = new Date()
	const diff = now - date
	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)
	
	if (minutes < 1) return '刚刚'
	if (minutes < 60) return `${minutes}分钟前`
	if (hours < 24) return `${hours}小时前`
	if (days < 7) return `${days}天前`
	
	return `${date.getMonth() + 1}-${date.getDate()}`
}

onLoad(() => {
	loadData()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: transparent;
}

.search-bar {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80rpx;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 40rpx;
	padding: 0 30rpx;
}

.search-icon {
	font-size: 32rpx;
	margin-right: 10rpx;
}

.search-text {
	font-size: 28rpx;
	color: #999;
}

.swiper-container {
	margin: 20rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.swiper {
	height: 300rpx;
}

.swiper-item-wrapper {
	height: 100%;
	padding: 0 10rpx;
	transition: transform 0.3s;
}

.swiper-item-wrapper.active {
	transform: scale(1.05);
}

.swiper-image {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}

.category-nav {
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
	margin-bottom: 20rpx;
}

.category-icon {
	font-size: 48rpx;
	margin-bottom: 10rpx;
}

.category-name {
	font-size: 24rpx;
	color: #333;
}

.section {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 20rpx;
	padding: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-more {
	font-size: 24rpx;
	color: #999;
}

.goods-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.goods-item {
	width: 48%;
	margin-bottom: 20rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	overflow: hidden;
}

.goods-image {
	width: 100%;
	height: 300rpx;
}

.goods-info {
	padding: 20rpx;
}

.goods-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.seller-mini {
	display: flex;
	align-items: center;
	margin-bottom: 10rpx;
}

.seller-mini-name {
	font-size: 22rpx;
	color: #666;
	margin-right: 10rpx;
}

.chat-mini-icon {
	font-size: 22rpx;
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

.goods-list {
	display: flex;
	flex-direction: column;
}

.goods-row {
	display: flex;
	margin-bottom: 30rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	overflow: hidden;
	padding: 20rpx;
}

.goods-row-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.goods-row-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.goods-row-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.goods-row-desc {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.goods-row-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: auto;
}

.goods-row-price {
	font-size: 32rpx;
	color: #FF5722;
	font-weight: bold;
}

.goods-row-time {
	font-size: 22rpx;
	color: #999;
}
</style>
