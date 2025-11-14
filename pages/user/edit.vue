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
				<picker mode="region" @change="onRegionChange">
					<view class="picker">
						<text :class="{ placeholder: !form.province }">
							{{ form.province && form.city && form.district ? 
								`${form.province} ${form.city} ${form.district}` : '请选择所在地区' }}
						</text>
						<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
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
import { ref } from 'vue'
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

// 修复：onLoad 括号闭合
onLoad((options) => {
	if (options.id) {
		addressId.value = options.id
		loadAddress() // 加载已有地址数据
	}
})

// 修复：添加 async 关键字（因使用 await）
const loadAddress = async () => {
	try {
		const address = await addressApi.getAddress(addressId.value)
		if (address) {
			// 适配接口返回字段，确保地区字段正确赋值
			form.value = {
				name: address.name || '',
				phone: address.phone || '',
				province: address.province || '',
				city: address.city || '',
				district: address.district || '',
				detail: address.detail || '',
				isDefault: address.isDefault || false
			}
		}
	} catch (error) {
		console.error('获取地址失败:', error)
		uni.showToast({ title: '加载地址失败', icon: 'none' })
	}
}

const onRegionChange = (e) => {
	const [province, city, district] = e.detail.value
	form.value.province = province
	form.value.city = city
	form.value.district = district
}

// 修复：checkbox 选中状态判断（微信小程序中 e.detail.value 为数组，H5 为布尔值）
const onDefaultChange = (e) => {
	form.value.isDefault = Array.isArray(e.detail.value) ? e.detail.value.length > 0 : e.detail.value
}

const handleSubmit = async () => {
	// 1. 表单校验优化
	if (!form.value.name.trim()) {
		uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
		return
	}
	// 手机号格式校验
	const phoneReg = /^1[3-9]\d{9}$/
	if (!form.value.phone.trim() || !phoneReg.test(form.value.phone)) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}
	if (!form.value.province || !form.value.city || !form.value.district) {
		uni.showToast({ title: '请选择所在地区', icon: 'none' })
		return
	}
	if (!form.value.detail.trim()) {
		uni.showToast({ title: '请输入详细地址', icon: 'none' })
		return
	}

	// 2. 构造提交数据（包含 addressId 用于修改）
	const submitData = {
		id: addressId.value, // 关键：传递地址ID，告知接口是修改操作
		...form.value
	}

	try {
		// 3. 调用修改地址接口（根据实际接口调整方法名）
		await addressApi.updateAddress(submitData)
		uni.showToast({ title: '修改成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack() // 返回上一页并刷新列表
		}, 1500)
	} catch (error) {
		console.error('修改地址失败:', error)
		uni.showToast({ title: '修改失败，请重试', icon: 'none' })
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
</style>q