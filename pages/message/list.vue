<template>
	<view class="container">
		<view class="message-list">
			<view class="message-item" v-for="item in messageList" :key="item.userId" @click="goToChat(item.userId)">
				<image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
				<view class="message-content">
					<view class="message-header">
						<text class="username">{{ item.username }}</text>
						<text class="time">{{ formatTime(item.lastTime) }}</text>
					</view>
					<view class="message-body">
						<text class="last-message">{{ item.lastMessage || '暂无消息' }}</text>
						<view class="unread-badge" v-if="item.unreadCount > 0">
							<text>{{ item.unreadCount > 99 ? '99+' : item.unreadCount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="messageList.length === 0 && !loading" class="empty">
			<text class="empty-icon">💬</text>
			<text class="empty-text">暂无消息</text>
		</view>
		
		<!-- 加载中 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { messageApi } from '@/utils/apiService.js'
import { getCurrentUserId, checkLogin } from '@/utils/auth.js'

const messageList = ref([])
const loading = ref(false)
const currentUserId = ref(null)
let pollTimer = null

// 加载消息列表
async function loadMessages() {
	if (!currentUserId.value) {
		currentUserId.value = getCurrentUserId()
		if (!currentUserId.value) {
			return
		}
	}
	
	try {
		loading.value = true
		const list = await messageApi.getMessageList(currentUserId.value)
		messageList.value = list || []
	} catch (error) {
		console.error('加载消息列表失败:', error)
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

// 跳转到聊天页面
function goToChat(userId) {
	if (!checkLogin()) return
	uni.navigateTo({
		url: `/pages/message/chat?userId=${userId}`
	})
}

// 格式化时间
function formatTime(time) {
	if (!time) return ''
	const date = new Date(time)
	const now = new Date()
	const diff = now - date
	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)
	
	if (minutes < 1) return '刚刚'
	if (minutes < 60) return `${minutes}分钟前`
	if (hours < 24) return `${hours}小时前`
	if (days === 1) return '昨天'
	if (days < 7) return `${days}天前`
	
	return `${date.getMonth() + 1}-${date.getDate()}`
}

// 轮询更新消息列表
function startPolling() {
	pollTimer = setInterval(() => {
		if (currentUserId.value) {
			loadMessages()
		}
	}, 5000) // 每5秒刷新一次
}

// 停止轮询
function stopPolling() {
	if (pollTimer) {
		clearInterval(pollTimer)
		pollTimer = null
	}
}

onLoad(() => {
	currentUserId.value = getCurrentUserId()
	if (currentUserId.value) {
		loadMessages()
		startPolling()
	}
})

onShow(() => {
	if (currentUserId.value) {
		loadMessages()
		startPolling()
	}
})

onUnmounted(() => {
	stopPolling()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: transparent;
}

.message-list {
	padding: 20rpx;
}

.message-item {
	display: flex;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.message-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.message-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.username {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
}

.time {
	font-size: 24rpx;
	color: #999;
}

.message-body {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.last-message {
	flex: 1;
	font-size: 26rpx;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-right: 20rpx;
}

.unread-badge {
	min-width: 36rpx;
	height: 36rpx;
	background-color: #FF5722;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 12rpx;
}

.unread-badge text {
	font-size: 20rpx;
	color: #fff;
	font-weight: bold;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 28rpx;
}
</style>
