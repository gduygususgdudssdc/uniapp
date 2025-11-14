<template>
	<view class="container">
		<view class="form-section">
			<view class="input-group">
				<uni-icons type="phone" size="20" color="#999"></uni-icons>
				<input class="input" type="number" v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			
			<view class="input-group">
				<uni-icons type="compose" size="20" color="#999"></uni-icons>
				<input class="input" type="number" v-model="form.code" placeholder="请输入验证码" maxlength="6" />
				<text class="code-btn" @click="sendCode">{{ codeText }}</text>
			</view>
			
			<view class="input-group">
				<uni-icons type="locked" size="20" color="#999"></uni-icons>
				<input class="input" type="password" v-model="form.password" placeholder="请输入密码（6-20位）" />
			</view>
			
			<view class="input-group">
				<uni-icons type="locked" size="20" color="#999"></uni-icons>
				<input class="input" type="password" v-model="form.confirmPassword" placeholder="请再次输入密码" />
			</view>
			
			<view class="agreement">
				<checkbox-group @change="onAgreementChange">
					<label>
						<checkbox value="agree" :checked="agreed" />
						<text>我已阅读并同意</text>
						<text class="link">《用户协议》</text>
						<text>和</text>
						<text class="link">《隐私政策》</text>
					</label>
				</checkbox-group>
			</view>
			
			<button class="register-btn" @click="handleRegister">注册</button>
			
			<view class="footer-links">
				<text class="link" @click="goToLogin">已有账号，立即登录</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				phone: '',
				code: '',
				password: '',
				confirmPassword: ''
			},
			agreed: false,
			countdown: 0,
			codeText: '获取验证码'
		}
	},
	methods: {
		sendCode() {
			if (!this.form.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}
			if (this.countdown > 0) return
			
			this.countdown = 60
			this.codeText = `${this.countdown}秒后重试`
			const timer = setInterval(() => {
				this.countdown--
				if (this.countdown > 0) {
					this.codeText = `${this.countdown}秒后重试`
				} else {
					this.codeText = '获取验证码'
					clearInterval(timer)
				}
			}, 1000)
			
			uni.showToast({
				title: '验证码已发送',
				icon: 'success'
			})
		},
		onAgreementChange(e) {
			this.agreed = e.detail.value.includes('agree')
		},
		handleRegister() {
			if (!this.form.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}
			if (!this.form.code) {
				uni.showToast({ title: '请输入验证码', icon: 'none' })
				return
			}
			if (!this.form.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return
			}
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return
			}
			if (!this.agreed) {
				uni.showToast({ title: '请同意用户协议', icon: 'none' })
				return
			}
			
			uni.showToast({
				title: '注册成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		},
		goToLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 40rpx;
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

.input {
	flex: 1;
	font-size: 28rpx;
	margin-left: 20rpx;
}

.code-btn {
	font-size: 26rpx;
	color: #007AFF;
	padding: 10rpx 20rpx;
	border-left: 1rpx solid #ddd;
	margin-left: 20rpx;
}

.agreement {
	margin: 30rpx 0;
	font-size: 24rpx;
	color: #666;
}

.link {
	color: #007AFF;
}

.register-btn {
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
	text-align: center;
	margin-top: 40rpx;
}

.footer-links .link {
	font-size: 26rpx;
	color: #007AFF;
}
</style>





