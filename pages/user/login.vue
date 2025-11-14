<template>
	<view class="container">
		<view class="logo-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">二手交易平台</text>
		</view>
		
		<view class="form-section">
			<view class="input-group">
				<text class="input-icon">📱</text>
				<input class="input" type="number" v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
			</view>

			<view class="input-group">
				<text class="input-icon">🔒</text>
				<input class="input" type="password" v-model="form.password" placeholder="请输入密码" />
			</view>
			
			<button class="login-btn" @click="handleLogin" :disabled="loading">
				{{ loading ? '登录中...' : '登录' }}
			</button>
			
			<!-- 微信快捷登录 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="divider">
				<view class="divider-line"></view>
				<text class="divider-text">或</text>
				<view class="divider-line"></view>
			</view>
			
			<button class="wechat-login-btn" @click="handleWechatLogin" :disabled="wechatLoading">
				<text class="wechat-icon">💬</text>
				<text>{{ wechatLoading ? '登录中...' : '微信快捷登录' }}</text>
			</button>
			<!-- #endif -->
			
			<view class="footer-links">
				<text class="link" @click="goToRegister">立即注册</text>
				<text class="link" @click="handleForgetPassword">忘记密码？</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi } from '@/utils/apiService.js'
import { saveUserInfo, isLoggedIn } from '@/utils/auth.js'

const form = ref({
	phone: '',
	password: ''
})

const loading = ref(false)
const wechatLoading = ref(false)

// 检查是否已登录
onLoad(() => {
	if (isLoggedIn()) {
		uni.showToast({ title: '您已登录', icon: 'none' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}
})

async function handleLogin() {
	// 表单验证
	if (!form.value.phone) {
		uni.showToast({ title: '请输入手机号', icon: 'none' })
		return
	}
	
	// 手机号格式验证
	if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}
	
	if (!form.value.password) {
		uni.showToast({ title: '请输入密码', icon: 'none' })
		return
	}
	
	// 密码长度验证
	if (form.value.password.length < 6) {
		uni.showToast({ title: '密码至少6位', icon: 'none' })
		return
	}

	// 防止重复提交
	if (loading.value) {
		return
	}

	loading.value = true

	try {
		const response = await userApi.login({
			phone: form.value.phone,
			password: form.value.password
		})

		if (response && response.user && response.token) {
			// 保存用户信息和token
			saveUserInfo(response.user, response.token)
			
			uni.showToast({ title: '登录成功', icon: 'success' })
			
			// 延迟跳转，让用户看到成功提示
			setTimeout(() => {
				// 如果有上一页，则返回上一页，否则跳转到首页
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
					uni.switchTab({ url: '/pages/index/index' })
				}
			}, 1500)
		} else {
			uni.showToast({ title: '登录失败，请重试', icon: 'none' })
		}
	} catch (error) {
		console.error('登录失败:', error)
		uni.showToast({ 
			title: error.message || '登录失败，请检查网络', 
			icon: 'none',
			duration: 2000
		})
	} finally {
		loading.value = false
	}
}

function goToRegister() {
	uni.navigateTo({ url: '/pages/user/register' })
}

function handleForgetPassword() {
	uni.showToast({ title: '功能开发中', icon: 'none' })
}

// 微信快捷登录
async function handleWechatLogin() {
	// 防止重复提交
	if (wechatLoading.value) {
		return
	}

	wechatLoading.value = true

	try {
		// 1. 获取微信登录凭证 code
		const loginRes = await new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: resolve,
				fail: reject
			})
		})

		if (!loginRes.code) {
			uni.showToast({ title: '获取微信登录凭证失败', icon: 'none' })
			return
		}

		// 2. 获取用户信息（需要用户授权）
		let userInfo = null
		try {
			const userProfileRes = await new Promise((resolve, reject) => {
				uni.getUserProfile({
					desc: '用于完善用户资料',
					success: resolve,
					fail: reject
				})
			})
			userInfo = userProfileRes.userInfo
		} catch (err) {
			console.log('用户取消授权或获取用户信息失败:', err)
			// 如果用户拒绝授权，仍然可以登录，只是没有昵称和头像
		}

		// 3. 调用后端微信登录接口
		const response = await userApi.wechatLogin({
			code: loginRes.code,
			nickName: userInfo?.nickName || '',
			avatarUrl: userInfo?.avatarUrl || ''
		})

		if (response && response.user && response.token) {
			// 保存用户信息和token
			saveUserInfo(response.user, response.token)
			
			uni.showToast({ title: '登录成功', icon: 'success' })
			
			// 延迟跳转
			setTimeout(() => {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack()
				} else {
					uni.switchTab({ url: '/pages/index/index' })
				}
			}, 1500)
		} else {
			uni.showToast({ title: '登录失败，请重试', icon: 'none' })
		}
	} catch (error) {
		console.error('微信登录失败:', error)
		uni.showToast({ 
			title: error.message || '微信登录失败，请重试', 
			icon: 'none',
			duration: 2000
		})
	} finally {
		wechatLoading.value = false
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background: linear-gradient(180deg, #007AFF 0%, #5AC8FA 100%);
	padding: 100rpx 60rpx;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100rpx;
}

.logo {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 30rpx;
}

.app-name {
	font-size: 40rpx;
	color: #fff;
	font-weight: bold;
}

.form-section {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
}

.input-group {
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 0 20rpx;
	margin-bottom: 30rpx;
	height: 88rpx;
}

.input-icon {
	font-size: 24rpx;
	margin-right: 20rpx;
}

.input {
	flex: 1;
	font-size: 28rpx;
	margin-left: 0;
}

.login-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	margin-top: 40rpx;
	border: none;
}

.footer-links {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.link {
	font-size: 26rpx;
	color: #007AFF;
}

.divider {
	display: flex;
	align-items: center;
	margin: 40rpx 0;
}

.divider-line {
	flex: 1;
	height: 1rpx;
	background-color: #E5E5E5;
}

.divider-text {
	margin: 0 20rpx;
	font-size: 24rpx;
	color: #999;
}

.wechat-login-btn {
	width: 100%;
	height: 88rpx;
	background-color: #07C160;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	margin-top: 20rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.wechat-icon {
	font-size: 36rpx;
	margin-right: 10rpx;
}
</style>

