<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<text class="label">收货人</text>
				<input class="input" v-model="form.name" placeholder="请输入收货人姓名" />
			</view>
			
			<view class="form-item">
				<text class="label">手机号</text>
				<input class="input" type="number" v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
			</view>
			
			<view class="form-item">
				<text class="label">所在地区</text>
				<picker mode="region" :value="regionValue" @change="onRegionChange">
					<view class="picker">
						<text :class="{ placeholder: !form.province }">
							{{ form.province && form.city && form.district ?
								`${form.province} ${form.city} ${form.district}` : '请选择所在地区' }}
						</text>
						<text class="picker-arrow">›</text>
					</view>
				</picker>
			</view>
			
			<view class="form-item">
				<text class="label">详细地址</text>
				<textarea class="textarea" v-model="form.detail" placeholder="请输入详细地址" maxlength="100"></textarea>
			</view>
			
			<view class="form-item">
				<label class="checkbox-label">
					<checkbox :checked="form.isDefault" @change="onDefaultChange" />
					<text>设为默认地址</text>
				</label>
			</view>
			
			<button class="submit-btn" @click="handleSubmit">保存</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addressApi } from '@/utils/apiService.js'
import { getCurrentUser, getCurrentUserId, checkLogin, isLoggedIn } from '@/utils/auth.js'

const addressId = ref('')
const form = ref({
	name: '',
	phone: '',
	province: '',
	city: '',
	district: '',
	detail: '',
	isDefault: false
});

// 为 Picker 组件提供正确的 value 格式
const regionValue = computed(() => {
	if (form.value.province && form.value.city && form.value.district) {
		return [form.value.province, form.value.city, form.value.district]
	}
	return []
})

// 获取地址详情
const loadAddress = async () => {
	console.log('loadAddress 被调用')
	console.log('addressId:', addressId.value)
	
	// 检查登录状态
	if (!isLoggedIn()) {
		console.log('用户未登录')
		uni.showToast({ title: '请先登录', icon: 'none' })
		setTimeout(() => {
			uni.navigateTo({ url: '/pages/user/login' })
		}, 1500)
		return
	}

	// 检查地址ID
	if (!addressId.value) {
		console.log('addressId 为空，跳过加载')
		return
	}

	try {
		console.log('开始请求地址信息，ID:', addressId.value)
		const address = await addressApi.getAddress(addressId.value)
		console.log('获取到地址信息:', address)
		
		if (address) {
			form.value = { ...address }
			console.log('地址信息已加载到表单:', form.value)
		} else {
			console.log('地址不存在')
			uni.showToast({ title: '地址不存在', icon: 'none' })
		}
	} catch (error) {
		console.error('获取地址失败:', error)
		uni.showToast({ title: '获取地址失败: ' + (error.message || '未知错误'), icon: 'none', duration: 3000 })
	}
}

onLoad((options) => {
	console.log('页面加载，参数:', options)
	if (options && options.id) {
		addressId.value = options.id
		console.log('设置 addressId:', addressId.value)
		loadAddress()
	} else {
		console.log('没有地址ID，这是新增地址模式')
	}
})
const onRegionChange = (e) => {
	const [province, city, district] = e.detail.value
	form.value.province = province
	form.value.city = city
	form.value.district = district
}
const onDefaultChange = (e) => {
	form.value.isDefault = e.detail.value.length > 0
}
const handleSubmit = () => {
			if (!form.value.name) {
				uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
				return
			}
			if (!form.value.phone) {
				uni.showToast({ title: '请输入手机号', icon: 'none' })
				return
			}
			if (!form.value.province) {
				uni.showToast({ title: '请选择所在地区', icon: 'none' })
				return
			}
			if (!form.value.detail) {
				uni.showToast({ title: '请输入详细地址', icon: 'none' })
				return
			}
			
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
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
	font-size: 20rpx;
	color: #999;
	font-weight: bold;
}

.textarea {
	width: 100%;
	min-height: 150rpx;
	background-color: #F5F5F5;
	border-radius: 10rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.checkbox-label {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #333;
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





