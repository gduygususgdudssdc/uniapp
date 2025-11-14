<template>
	<view class="container">
		<view class="category-wrapper">
			<!-- 左侧分类列表 -->
			<scroll-view class="category-sidebar" scroll-y>
				<view class="category-item" :class="{ active: currentCategory === item.id }" 
					v-for="item in categories" :key="item.id" @click="selectCategory(item.id)">
					<text class="category-icon">{{ item.icon }}</text>
					<text class="category-name">{{ item.name }}</text>
				</view>
			</scroll-view>
			
			<!-- 右侧子分类 -->
			<scroll-view class="category-content" scroll-y>
				<view class="subcategory-list" v-if="currentSubcategories.length > 0">
					<view class="subcategory-item" v-for="item in currentSubcategories" 
						:key="item.id" @click="goToGoodsList(item.id)">
						<view class="subcategory-icon">{{ getSubcategoryIcon(item.name) }}</view>
						<text class="subcategory-name">{{ item.name }}</text>
					</view>
				</view>
				<view v-else class="empty">
					<text>暂无子分类</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { categoryApi } from '@/utils/apiService.js'

const categories = ref([])
const currentCategory = ref(null)
const subcategories = ref([])

// 计算属性：根据当前选中的分类，自动获取子分类列表
const currentSubcategories = computed(() => {
	return subcategories.value
})

async function loadCategories() {
	try {
		const categoryList = await categoryApi.getCategoryList()
		categories.value = categoryList || []
		if (categories.value.length > 0) {
			currentCategory.value = categories.value[0].id
			await loadSubcategories(currentCategory.value)
		}
	} catch (error) {
		console.error('加载分类失败:', error)
		uni.showToast({ title: '加载分类失败', icon: 'none' })
	}
}

async function loadSubcategories(parentId) {
	try {
		const subcategoryList = await categoryApi.getCategoryList(parentId)
		subcategories.value = subcategoryList || []
	} catch (error) {
		console.error('加载子分类失败:', error)
		subcategories.value = []
	}
}

function selectCategory(id) {
	currentCategory.value = id
	loadSubcategories(id)
}

function goToGoodsList(categoryId) {
	uni.navigateTo({
		url: `/pages/goods/list?categoryId=${categoryId}`
	})
}

function getSubcategoryIcon(name) {
	// 简单映射，实际可以根据名称返回不同图标
	return '📦'
}

onLoad(() => {
	loadCategories()
})
</script>

<style scoped>
.container {
	height: 100vh;
	background-color: #F5F5F5;
}

.category-wrapper {
	display: flex;
	height: 100%;
}

.category-sidebar {
	width: 200rpx;
	background-color: #fff;
	border-right: 1rpx solid #eee;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 20rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.category-item.active {
	background-color: #F5F5F5;
	border-left: 4rpx solid #007AFF;
}

.category-icon {
	font-size: 50rpx;
	margin-bottom: 10rpx;
}

.category-name {
	font-size: 24rpx;
	color: #333;
}

.category-content {
	flex: 1;
	padding: 20rpx;
}

.subcategory-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.subcategory-item {
	width: calc(33.33% - 14rpx);
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx 20rpx;
}

.subcategory-icon {
	font-size: 60rpx;
	margin-bottom: 15rpx;
}

.subcategory-name {
	font-size: 24rpx;
	color: #333;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
}
</style>





