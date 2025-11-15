<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<text class="label">商品标题</text>
				<input class="input" v-model="form.title" placeholder="请输入商品标题" />
			</view>
			
			<view class="form-item">
				<text class="label">商品分类</text>
				<picker 
					mode="selector" 
					:range="categoryOptions" 
					range-key="name" 
					:value="categoryIndex"
					@change="onCategoryChange">
					<view class="picker">
						<text :class="{ placeholder: !form.categoryName }">
							{{ form.categoryName || '请选择分类' }}
						</text>
						<text class="picker-arrow">›</text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">商品图片</text>
				<view class="upload-images">
					<view class="image-item" v-for="(img, index) in form.images" :key="index">
						<image :src="img" mode="aspectFill"></image>
						<view class="delete-btn" @click="deleteImage(index)">×</view>
					</view>
					<view class="upload-btn" v-if="form.images.length < 9" @click="chooseImage">
						<text class="upload-icon">+</text>
						<text>添加图片</text>
					</view>
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">售价</text>
				<view class="price-input">
					<text class="currency">¥</text>
					<input class="input" type="digit" v-model="form.price" placeholder="0.00" />
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">原价（选填）</text>
				<view class="price-input">
					<text class="currency">¥</text>
					<input class="input" type="digit" v-model="form.originalPrice" placeholder="0.00" />
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">成色</text>
				<picker 
					mode="selector" 
					:range="conditionOptions" 
					:value="conditionIndex"
					@change="onConditionChange">
					<view class="picker">
						<text :class="{ placeholder: !form.condition }">
							{{ form.condition || '请选择成色' }}
						</text>
						<text class="picker-arrow">›</text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">所在地区</text>
				<input class="input" v-model="form.location" placeholder="请输入所在地区" />
			</view>
			
			<view class="form-item">
				<text class="label">商品描述</text>
				<textarea class="textarea" v-model="form.description" placeholder="请详细描述商品信息..." maxlength="500"></textarea>
				<text class="char-count">{{ (form.description || '').length }}/500</text>
			</view>
			
			<button class="submit-btn" @click="handleSubmit">发布商品</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { categoryApi, goodsApi } from '@/utils/apiService.js'
import { getCurrentUserId, checkLogin } from '@/utils/auth.js'

const categoryOptions = ref([])
const categoryIndex = ref(-1) // 当前选中的分类索引
const conditionOptions = ref(['全新', '99新', '95新', '9成新', '8成新', '7成新', '6成新以下'])
const conditionIndex = ref(-1) // 当前选中的成色索引

const form = ref({
	title: '',
	categoryId: null,
	categoryName: '',
	images: [],
	price: '',
	originalPrice: '',
	condition: '',
	location: '',
	description: ''
})

// 加载分类列表
async function loadCategories() {
	try {
		const categories = await categoryApi.getCategoryList()
		// 获取所有主分类和子分类，展平为一个列表
		const allCategories = []
		
		if (Array.isArray(categories)) {
			categories.forEach(category => {
				// 添加主分类
				allCategories.push({
					id: category.id,
					name: category.name
				})
				
				// 如果有子分类，也添加进去
				if (category.children && Array.isArray(category.children)) {
					category.children.forEach(subCategory => {
						allCategories.push({
							id: subCategory.id,
							name: `${category.name} - ${subCategory.name}`
						})
					})
				}
			})
		}
		
		categoryOptions.value = allCategories
	} catch (error) {
		console.error('加载分类失败:', error)
		uni.showToast({ title: '加载分类失败', icon: 'none' })
	}
}

// 分类选择变化
function onCategoryChange(e) {
	const index = e.detail.value
	categoryIndex.value = index
	
	if (categoryOptions.value[index]) {
		const selectedCategory = categoryOptions.value[index]
		form.value.categoryId = selectedCategory.id
		form.value.categoryName = selectedCategory.name
	}
}

// 成色选择变化
function onConditionChange(e) {
	const index = e.detail.value
	conditionIndex.value = index
	
	if (conditionOptions.value[index]) {
		form.value.condition = conditionOptions.value[index]
	}
}

// 选择图片
function chooseImage() {
	uni.chooseImage({
		count: 9 - form.value.images.length,
		success: (res) => {
			form.value.images = [...form.value.images, ...res.tempFilePaths]
		}
	})
}

// 删除图片
function deleteImage(index) {
	form.value.images.splice(index, 1)
}

// 提交表单
async function handleSubmit() {
	// 表单验证
	if (!form.value.title) {
		uni.showToast({ title: '请输入商品标题', icon: 'none' })
		return
	}
	
	if (!form.value.categoryId) {
		uni.showToast({ title: '请选择商品分类', icon: 'none' })
		return
	}
	
	if (!form.value.images || form.value.images.length === 0) {
		uni.showToast({ title: '请至少上传一张图片', icon: 'none' })
		return
	}
	
	if (!form.value.price) {
		uni.showToast({ title: '请输入售价', icon: 'none' })
		return
	}
	
	if (!form.value.condition) {
		uni.showToast({ title: '请选择成色', icon: 'none' })
		return
	}
	
	if (!form.value.location) {
		uni.showToast({ title: '请输入所在地区', icon: 'none' })
		return
	}
	
	// 检查登录状态
	if (!checkLogin()) {
		return
	}
	
	const userId = getCurrentUserId()
	if (!userId) {
		uni.showToast({ title: '获取用户信息失败', icon: 'none' })
		return
	}
	
	try {
		// 准备提交数据
		const submitData = {
			title: form.value.title,
			categoryId: form.value.categoryId,
			categoryName: form.value.categoryName,
			images: JSON.stringify(form.value.images), // 转换为JSON字符串
			price: parseFloat(form.value.price),
			originalPrice: form.value.originalPrice ? parseFloat(form.value.originalPrice) : null,
			condition: form.value.condition,
			location: form.value.location,
			description: form.value.description || '',
			sellerId: userId
		}
		
		// 调用API发布商品
		await goodsApi.createGoods(submitData)
		
		uni.showToast({ title: '发布成功', icon: 'success' })
		
		// 延迟跳转
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	} catch (error) {
		console.error('发布商品失败:', error)
		uni.showToast({ 
			title: error.message || '发布失败', 
			icon: 'none',
			duration: 2000
		})
	}
}

onLoad(() => {
	loadCategories()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: transparent;
	padding: 20rpx;
}

.form {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
}

.form-item {
	margin-bottom: 40rpx;
}

.label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
	display: block;
}

.input {
	width: 100%;
	height: 80rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding-left:  20rpx;
	font-size: 28rpx;
}

.picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 80rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 0 20rpx;
}

.picker text.placeholder {
	color: #999;
}

.picker-arrow {
	font-size: 32rpx;
	color: #999;
}

.upload-images {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.image-item {
	position: relative;
	width: 200rpx;
	height: 200rpx;
	border-radius: 10rpx;
	overflow: hidden;
}

.image-item image {
	width: 100%;
	height: 100%;
}

.delete-btn {
	position: absolute;
	top: 0;
	right: 0;
	width: 40rpx;
	height: 40rpx;
	background-color: rgba(0, 0, 0, 0.6);
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	border-radius: 0 0 0 10rpx;
}

.upload-btn {
	width: 200rpx;
	height: 200rpx;
	border: 2rpx dashed #ddd;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #999;
	font-size: 24rpx;
}

.upload-icon {
	font-size: 40rpx;
	margin-bottom: 10rpx;
}

.price-input {
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 0 20rpx;
}

.currency {
	font-size: 28rpx;
	color: #333;
	margin-right: 10rpx;
}

.textarea {
	width: 100%;
	min-height: 200rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding-left: 20rpx;
	font-size: 28rpx;
}

.char-count {
	font-size: 24rpx;
	color: #999;
	text-align: right;
	margin-top: 10rpx;
	display: block;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	margin-top: 40rpx;
	border: none;
}
</style>





