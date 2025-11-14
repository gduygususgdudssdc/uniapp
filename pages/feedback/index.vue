<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<text class="label">反馈类型</text>
				<picker mode="selector" :range="feedbackTypes" @change="onTypeChange">
					<view class="picker">
						<text :class="{ placeholder: !form.type }">{{ form.type || '请选择反馈类型' }}</text>
						<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">问题描述</text>
				<textarea class="textarea" v-model="form.content" 
					placeholder="请详细描述您遇到的问题或建议..." maxlength="500"></textarea>
				<text class="char-count">{{ form.content.length }}/500</text>
			</view>
			
			<view class="form-item">
				<text class="label">上传图片（选填）</text>
				<view class="upload-images">
					<view class="image-item" v-for="(img, index) in form.images" :key="index">
						<image :src="img" mode="aspectFill"></image>
						<view class="delete-btn" @click="deleteImage(index)">×</view>
					</view>
					<view class="upload-btn" v-if="form.images.length < 3" @click="chooseImage">
						<uni-icons type="plus" size="40" color="#999"></uni-icons>
						<text>添加图片</text>
					</view>
				</view>
			</view>
			
			<view class="form-item">
				<text class="label">联系方式</text>
				<input class="input" v-model="form.contact" placeholder="请输入手机号或邮箱（选填）" />
			</view>
			
			<button class="submit-btn" @click="handleSubmit">提交反馈</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				type: '',
				content: '',
				images: [],
				contact: ''
			},
			feedbackTypes: ['功能建议', 'BUG反馈', '界面问题', '其他问题']
		}
	},
	methods: {
		onTypeChange(e) {
			this.form.type = this.feedbackTypes[e.detail.value]
		},
		chooseImage() {
			uni.chooseImage({
				count: 3 - this.form.images.length,
				success: (res) => {
					this.form.images = [...this.form.images, ...res.tempFilePaths]
				}
			})
		},
		deleteImage(index) {
			this.form.images.splice(index, 1)
		},
		handleSubmit() {
			if (!this.form.type) {
				uni.showToast({ title: '请选择反馈类型', icon: 'none' })
				return
			}
			if (!this.form.content) {
				uni.showToast({ title: '请输入问题描述', icon: 'none' })
				return
			}
			
			uni.showToast({
				title: '提交成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
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

.textarea {
	width: 100%;
	min-height: 200rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.char-count {
	font-size: 24rpx;
	color: #999;
	text-align: right;
	margin-top: 10rpx;
	display: block;
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

.input {
	width: 100%;
	height: 80rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 0 20rpx;
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
</style>





