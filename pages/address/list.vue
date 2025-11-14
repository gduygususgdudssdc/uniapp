<template>
	<view class="container">
		<view class="address-list">
			<view class="address-item" v-for="item in addressList" :key="item.id" @click="selectAddress(item)">
				<view class="address-content">
					<view class="address-header">
						<text class="name">{{ item.name }}</text>
						<text class="phone">{{ item.phone }}</text>
						<text class="default-tag" v-if="item.isDefault">默认</text>
					</view>
					<text class="address-text">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
				</view>
				<view class="address-actions">
					<view class="action-btn" @click.stop="editAddress(item.id)">
						<uni-icons type="compose" size="18" color="#007AFF"></uni-icons>
						<text>编辑</text>
					</view>
					<view class="action-btn" @click.stop="deleteAddress(item.id)">
						<uni-icons type="trash" size="18" color="#FF5722"></uni-icons>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="addressList.length === 0" class="empty">
			<text>暂无地址</text>
		</view>
		
		<!-- 添加按钮 -->
		<view class="add-btn-wrapper">
			<button class="add-btn" @click="addAddress">+ 添加新地址</button>
		</view>
	</view>
</template>

<script>
import { getAddressList } from '@/utils/mockData.js'

export default {
	data() {
		return {
			addressList: []
		}
	},
	onLoad() {
		this.loadAddresses()
	},
	methods: {
		loadAddresses() {
			this.addressList = getAddressList()
		},
		selectAddress(item) {
			// 如果是从订单页面跳转过来的，返回选中的地址
			const pages = getCurrentPages()
			const prevPage = pages[pages.length - 2]
			if (prevPage && prevPage.route === 'pages/order/detail') {
				uni.navigateBack()
				return
			}
		},
		addAddress() {
			uni.navigateTo({
				url: '/pages/address/edit'
			})
		},
		editAddress(id) {
			uni.navigateTo({
				url: `/pages/address/edit?id=${id}`
			})
		},
		deleteAddress(id) {
			uni.showModal({
				title: '提示',
				content: '确定要删除此地址吗？',
				success: (res) => {
					if (res.confirm) {
						this.addressList = this.addressList.filter(item => item.id !== id)
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
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
	padding-bottom: 120rpx;
}

.address-list {
	padding: 20rpx;
}

.address-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.address-content {
	margin-bottom: 20rpx;
}

.address-header {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.name {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-right: 20rpx;
}

.phone {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.default-tag {
	padding: 5rpx 15rpx;
	background-color: #FF5722;
	color: #fff;
	border-radius: 5rpx;
	font-size: 20rpx;
}

.address-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.address-actions {
	display: flex;
	justify-content: flex-end;
	gap: 40rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #eee;
}

.action-btn {
	display: flex;
	align-items: center;
	gap: 10rpx;
	font-size: 26rpx;
	color: #666;
}

.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 100rpx 0;
	color: #999;
}

.add-btn-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background-color: #fff;
	border-top: 1rpx solid #eee;
}

.add-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	border: none;
}
</style>





