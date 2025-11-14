<template>
	<view class="container">
		<view class="header">
			<text class="title">编辑资料</text>
		</view>
		
		<view class="form-section">
			<!-- 头像编辑 -->
			<view class="avatar-section">
				<text class="section-label">头像</text>
				<view class="avatar-wrapper" @click="chooseAvatar">
					<image class="avatar" :src="form.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					<view class="avatar-mask">
						<text class="avatar-text">点击更换</text>
					</view>
				</view>
			</view>
			
			<!-- 昵称编辑 -->
			<view class="form-item">
				<text class="label">昵称</text>
				<input class="input" v-model="form.username" placeholder="请输入昵称" maxlength="20" />
			</view>
			
			<!-- 其他信息（可选） -->
			<view class="form-item">
				<text class="label">邮箱</text>
				<input class="input" v-model="form.email" placeholder="请输入邮箱（可选）" type="email" />
			</view>
			
			<view class="form-item">
				<text class="label">所在地区</text>
				<input class="input" v-model="form.address" placeholder="请输入所在地区（可选）" />
			</view>
			
			<!-- 保存按钮 -->
			<button class="save-btn" @click="handleSave" :disabled="saving">
				{{ saving ? '保存中...' : '保存' }}
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/utils/apiService.js'
import { getCurrentUser, getCurrentUserId, checkLogin, saveUserInfo } from '@/utils/auth.js'

const form = ref({
	id: null,
	username: '',
	avatar: '',
	email: '',
	address: ''
})

const saving = ref(false)

onLoad(() => {
	if (!checkLogin()) {
		uni.navigateBack()
		return
	}
	
	// 加载当前用户信息
	const currentUser = getCurrentUser()
	if (currentUser) {
		form.value = {
			id: currentUser.id,
			username: currentUser.username || '',
			avatar: currentUser.avatar || '',
			email: currentUser.email || '',
			address: currentUser.address || ''
		}
	}
})

// 选择头像
function chooseAvatar() {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0]
			
			// 显示预览
			form.value.avatar = tempFilePath
			
			// 上传头像到服务器
			uploadAvatar(tempFilePath)
		},
		fail: (err) => {
			console.error('选择图片失败:', err)
			uni.showToast({ title: '选择图片失败', icon: 'none' })
		}
	})
}

// 上传头像
async function uploadAvatar(filePath) {
	try {
		uni.showLoading({ title: '上传中...' })
		
		const userId = getCurrentUserId()
		if (!userId) {
			uni.hideLoading()
			uni.showToast({ title: '用户信息错误', icon: 'none' })
			return
		}
		
		// 方案1：如果配置了OSS，先上传到OSS
		// 方案2：如果后端支持文件上传，使用 uni.uploadFile 上传到后端
		// 方案3：临时使用本地路径（仅用于测试，实际应该上传到OSS）
		
		// 这里先使用临时方案：直接使用临时路径
		// TODO: 如果配置了OSS，应该先上传到OSS获取URL
		// const ossUrl = await uploadToOSS(filePath)
		// const avatarUrl = ossUrl
		
		const avatarUrl = filePath
		
		// 更新头像到后端
		await userApi.updateAvatar(userId, avatarUrl)
		form.value.avatar = avatarUrl
		
		// 更新本地用户信息
		const updatedUser = await userApi.getUserInfo(userId)
		if (updatedUser) {
			saveUserInfo(updatedUser, uni.getStorageSync('token'))
		}
		
		uni.hideLoading()
		uni.showToast({ title: '头像上传成功', icon: 'success' })
	} catch (error) {
		console.error('上传头像失败:', error)
		uni.hideLoading()
		uni.showToast({ 
			title: error.message || '上传头像失败', 
			icon: 'none' 
		})
	}
}

// 保存用户信息
async function handleSave() {
	// 验证
	if (!form.value.username || form.value.username.trim() === '') {
		uni.showToast({ title: '请输入昵称', icon: 'none' })
		return
	}
	
	if (saving.value) {
		return
	}
	
	saving.value = true
	
	try {
		const userId = getCurrentUserId()
		if (!userId) {
			uni.showToast({ title: '用户信息错误', icon: 'none' })
			return
		}
		
		// 更新昵称
		const currentUser = getCurrentUser()
		if (form.value.username !== currentUser?.username) {
			await userApi.updateUsername(userId, form.value.username)
		}
		
		// 更新其他信息（使用通用更新接口）
		if (form.value.email !== currentUser?.email || form.value.address !== currentUser?.address) {
			await userApi.updateUser(userId, {
				email: form.value.email || '',
				address: form.value.address || ''
			})
		}
		
		// 获取最新用户信息
		const updatedUser = await userApi.getUserInfo(userId)
		
		// 更新本地存储
		if (updatedUser) {
			saveUserInfo(updatedUser, uni.getStorageSync('token'))
		}
		
		uni.showToast({ title: '保存成功', icon: 'success' })
		
		// 延迟返回，让用户看到成功提示
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	} catch (error) {
		console.error('保存失败:', error)
		uni.showToast({ 
			title: error.message || '保存失败，请重试', 
			icon: 'none',
			duration: 2000
		})
	} finally {
		saving.value = false
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.header {
	background-color: #007AFF;
	padding: 40rpx;
	text-align: center;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
}

.form-section {
	padding: 40rpx;
}

.avatar-section {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	text-align: center;
}

.section-label {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 30rpx;
	display: block;
}

.avatar-wrapper {
	position: relative;
	display: inline-block;
	margin: 0 auto;
}

.avatar {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	border: 4rpx solid #E5E5E5;
}

.avatar-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0;
	transition: opacity 0.3s;
}

.avatar-wrapper:active .avatar-mask {
	opacity: 1;
}

.avatar-text {
	color: #fff;
	font-size: 24rpx;
}

.form-item {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
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
	color: #333;
}

.save-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	margin-top: 40rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.save-btn:disabled {
	background-color: #CCCCCC;
	opacity: 0.6;
}
</style>
