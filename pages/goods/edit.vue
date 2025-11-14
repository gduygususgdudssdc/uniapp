<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<text class="label">商品标题</text>
				<input class="input" v-model="form.title" placeholder="请输入商品标题" />
			</view>
			
			<view class="form-item">
				<text class="label">商品图片</text>
				<view class="upload-images">
					<view class="image-item" v-for="(img, index) in form.images" :key="index">
						<image :src="img" mode="aspectFill"></image>
						<view class="delete-btn" @click="deleteImage(index)">×</view>
					</view>
					<view class="upload-btn" v-if="form.images.length < 9" @click="chooseImage">
						<uni-icons type="plus" size="40" color="#999"></uni-icons>
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
				<text class="label">商品描述</text>
				<textarea class="textarea" v-model="form.description" placeholder="请详细描述商品信息..." maxlength="500"></textarea>
			</view>
			
			<button class="submit-btn" @click="handleSubmit">保存修改</button>
			<button class="delete-btn-full" @click="handleDelete">删除商品</button>
		</view>
	</view>
</template>

<script>
import { getGoodsDetail } from '@/utils/mockData.js'

export default {
	data() {
		return {
			goodsId: '',
			form: {
				title: '',
				images: [],
				price: '',
				description: ''
			}
		}
	},
	onLoad(options) {
		if (options.id) {
			this.goodsId = options.id
			this.loadGoods()
		}
	},
	methods: {
		loadGoods() {
			const goods = getGoodsDetail(this.goodsId)
			if (goods) {
				this.form = {
					title: goods.title,
					images: [...goods.images],
					price: goods.price.toString(),
					description: goods.description
				}
			}
		},
		chooseImage() {
			uni.chooseImage({
				count: 9 - this.form.images.length,
				success: (res) => {
					this.form.images = [...this.form.images, ...res.tempFilePaths]
				}
			})
		},
		deleteImage(index) {
			this.form.images.splice(index, 1)
		},
		handleSubmit() {
			uni.showToast({
				title: '修改成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		},
		handleDelete() {
			uni.showModal({
				title: '提示',
				content: '确定要删除此商品吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					}
				}
			})
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
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
	padding: 0 20rpx;
	font-size: 28rpx;
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
	padding: 20rpx;
	font-size: 28rpx;
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

.delete-btn-full {
	width: 100%;
	height: 88rpx;
	background-color: #FF5722;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	margin-top: 20rpx;
	border: none;
}
</style>





