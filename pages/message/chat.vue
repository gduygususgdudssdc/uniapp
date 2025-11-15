<template>
	<view class="container">
		<scroll-view 
			class="chat-list" 
			scroll-y 
			:scroll-top="scrollTop"
			:scroll-with-animation="true"
			@scrolltolower="loadMoreMessages"
		>
			<view class="chat-item" :class="{ self: item.senderId === currentUserId }" 
				v-for="item in chatMessages" :key="item.id">
				<image v-if="item.senderId === currentUserId" class="avatar" 
					:src="userAvatar" mode="aspectFill"></image>
				<view class="message-bubble">
					<text class="message-text">{{ item.content }}</text>
					<text class="message-time">{{ formatTime(item.createTime) }}</text>
				</view>
				<image v-if="item.senderId !== currentUserId" class="avatar" 
					:src="targetAvatar" mode="aspectFill"></image>
			</view>
			
			<!-- 加载中提示 -->
			<view v-if="loading" class="loading">
				<text>加载中...</text>
			</view>
		</scroll-view>
		
		<!-- 输入栏 -->
		<view class="input-bar">
			<input 
				class="input" 
				v-model="inputText" 
				placeholder="输入消息..." 
				@confirm="sendMessage"
				:focus="inputFocus"
			/>
			<view class="send-btn" @click="sendMessage">
				<text class="send-text">发送</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { messageApi, userApi } from '@/utils/apiService.js'
import { getCurrentUserId, getCurrentUser, checkLogin } from '@/utils/auth.js'
import wsManager from '@/utils/websocket.js'

const userId = ref('') // 对方用户ID
const currentUserId = ref(null) // 当前登录用户ID
const chatMessages = ref([])
const inputText = ref('')
const userAvatar = ref('')
const targetAvatar = ref('')
const targetUser = ref(null)
const scrollTop = ref(0)
const loading = ref(false)
const inputFocus = ref(false)
let isInitialLoad = true // 标记是否为初始加载

// 加载聊天记录
async function loadChat() {
	if (!currentUserId.value || !userId.value) return
	
	try {
		if (isInitialLoad) {
			loading.value = true
		}
		const messages = await messageApi.getChatMessages(currentUserId.value, parseInt(userId.value))
		chatMessages.value = messages || []
		
		// 标记消息为已读
		await messageApi.markAsRead(currentUserId.value, parseInt(userId.value))
		
		// 滚动到底部
		await nextTick()
		scrollToBottom()
		
		if (isInitialLoad) {
			isInitialLoad = false
		}
	} catch (error) {
		console.error('加载聊天记录失败:', error)
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

// 加载用户信息
async function loadUserInfo() {
	try {
		// 加载当前用户信息
		const currentUser = getCurrentUser()
		if (currentUser) {
			userAvatar.value = currentUser.avatar || '/static/default-avatar.png'
		}
		
		// 加载对方用户信息
		const targetId = parseInt(userId.value)
		const user = await userApi.getUserInfo(targetId)
		if (user) {
			targetUser.value = user
			targetAvatar.value = user.avatar || '/static/default-avatar.png'
			// 设置导航栏标题
			uni.setNavigationBarTitle({
				title: user.username || '聊天'
			})
		}
	} catch (error) {
		console.error('加载用户信息失败:', error)
	}
}

// WebSocket 消息处理
function handleWebSocketMessage(data) {
	console.log('=== 前端收到 WebSocket 消息 ===')
	console.log('消息内容:', JSON.stringify(data, null, 2))
	console.log('消息类型:', data.type)
	console.log('当前用户ID:', currentUserId.value)
	console.log('对方用户ID:', userId.value)
	
	if (data.type === 'MESSAGE') {
		// 收到新消息
		const message = {
			id: data.id,
			senderId: data.senderId,
			receiverId: data.receiverId,
			content: data.content,
			createTime: data.createTime,
			isRead: data.isRead
		}
		
		console.log('解析后的消息:', message)
		console.log('当前消息列表长度:', chatMessages.value.length)
		
		// 检查是否已存在（避免重复）
		const exists = chatMessages.value.some(m => m.id === message.id)
		console.log('消息是否已存在:', exists)
		
		if (!exists) {
			console.log('✓ 添加新消息到列表')
			chatMessages.value.push(message)
			console.log('添加后消息列表长度:', chatMessages.value.length)
			
			// 如果是对方发来的消息，标记为已读
			if (message.senderId !== currentUserId.value) {
				console.log('标记消息为已读')
				wsManager.send('READ', {
					senderId: message.senderId,
					receiverId: currentUserId.value
				})
			}
			
			// 滚动到底部
			nextTick(() => {
				console.log('滚动到底部')
				scrollToBottom()
			})
		} else {
			console.log('⚠ 消息已存在，跳过')
		}
	} else if (data.type === 'ERROR') {
		console.error('收到错误消息:', data.content)
		uni.showToast({ title: data.content || '操作失败', icon: 'none' })
	} else {
		console.warn('未知消息类型:', data.type)
	}
}

// 发送消息
function sendMessage() {
	if (!inputText.value.trim()) return
	
	if (!checkLogin()) return
	
	if (!currentUserId.value || !userId.value) {
		uni.showToast({ title: '用户信息错误', icon: 'none' })
		return
	}
	
	const content = inputText.value.trim()
	inputText.value = ''
	
	// 通过 WebSocket 发送消息
	const success = wsManager.send('SEND', {
		senderId: currentUserId.value,
		receiverId: parseInt(userId.value),
		content: content
	})
	
	if (!success) {
		// WebSocket 未连接，使用 HTTP API 作为后备
		sendMessageByHttp(content)
	}
}

// 使用 HTTP API 发送消息（后备方案）
async function sendMessageByHttp(content) {
	try {
		const messageData = {
			senderId: currentUserId.value,
			receiverId: parseInt(userId.value),
			content: content
		}
		const savedMessage = await messageApi.sendMessage(messageData)
		
		// 添加到消息列表
		chatMessages.value.push(savedMessage)
		
		// 滚动到底部
		await nextTick()
		scrollToBottom()
	} catch (error) {
		console.error('发送消息失败:', error)
		uni.showToast({ title: '发送失败', icon: 'none' })
	}
}

// 滚动到底部
function scrollToBottom() {
	nextTick(() => {
		scrollTop.value = 99999
	})
}

// 加载更多消息（分页）
function loadMoreMessages() {
	// 可以在这里实现分页加载
}

// 连接 WebSocket
function connectWebSocket() {
	if (!currentUserId.value) {
		console.error('无法连接 WebSocket: 用户ID为空')
		return
	}
	
	console.log('开始连接 WebSocket, 用户ID:', currentUserId.value)
	
	wsManager.connect(
		currentUserId.value.toString(),
		handleWebSocketMessage,
		(error) => {
			console.error('WebSocket 连接错误:', error)
			uni.showToast({ 
				title: 'WebSocket 连接失败，请检查网络', 
				icon: 'none',
				duration: 2000
			})
		}
	)
}

// 断开 WebSocket
function disconnectWebSocket() {
	wsManager.disconnect()
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
	
	return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

onLoad((options) => {
	if (options.userId) {
		userId.value = options.userId
		currentUserId.value = getCurrentUserId()
		
		if (!currentUserId.value) {
			checkLogin()
			return
		}
		
		loadUserInfo()
		loadChat()
		connectWebSocket()
	} else {
		uni.showToast({ title: '参数错误', icon: 'none' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}
})

onShow(() => {
	if (currentUserId.value && userId.value) {
		isInitialLoad = false
		loadChat()
		// 如果 WebSocket 未连接，重新连接
		if (!wsManager.isConnected) {
			connectWebSocket()
		}
	}
})

onHide(() => {
	// 页面隐藏时不立即断开，保持连接以便接收消息
	// 如果需要节省资源，可以在这里断开
	// disconnectWebSocket()
})

onUnmounted(() => {
	disconnectWebSocket()
})
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: transparent;
	padding-bottom: 120rpx;
	display: flex;
	flex-direction: column;
}

.chat-list {
	flex: 1;
	padding: 20rpx;
	height: calc(100vh - 120rpx);
}

.chat-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 30rpx;
}

.chat-item.self {
	flex-direction: row-reverse;
}

.avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	margin: 0 20rpx;
	flex-shrink: 0;
}

.message-bubble {
	max-width: 60%;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
}

.chat-item.self .message-bubble {
	background-color: #007AFF;
}

.message-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
	word-break: break-word;
}

.chat-item.self .message-text {
	color: #fff;
}

.message-time {
	font-size: 20rpx;
	color: #999;
	margin-top: 10rpx;
	align-self: flex-end;
}

.chat-item.self .message-time {
	color: rgba(255, 255, 255, 0.7);
}

.input-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 20rpx;
	border-top: 1rpx solid #eee;
	z-index: 999;
}

.input {
	flex: 1;
	height: 70rpx;
	background-color: #F5F5F5;
	border-radius: 35rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
	margin-right: 20rpx;
}

.send-btn {
	width: 120rpx;
	height: 70rpx;
	background-color: #007AFF;
	border-radius: 35rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.send-text {
	color: #fff;
	font-size: 28rpx;
}

.loading {
	text-align: center;
	padding: 20rpx;
	color: #999;
	font-size: 24rpx;
}
</style>
