<template>
	<view class="container">
		<view class="chat-list">
			<view class="chat-item" :class="{ self: item.senderId !== currentUserId }" 
				v-for="item in chatMessages" :key="item.id">
				<image v-if="item.senderId === currentUserId" class="avatar" 
					:src="userAvatar" mode="aspectFill"></image>
				<view class="message-bubble">
					<text class="message-text">{{ item.content }}</text>
				</view>
				<image v-if="item.senderId !== currentUserId" class="avatar" 
					:src="targetAvatar" mode="aspectFill"></image>
			</view>
		</view>
		
		<!-- 输入栏 -->
		<view class="input-bar">
			<input class="input" v-model="inputText" placeholder="输入消息..." @confirm="sendMessage" />
			<view class="send-btn" @click="sendMessage">
				<uni-icons type="paperplane" size="24" color="#007AFF"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
import { getChatMessages, getUserInfo } from '@/utils/mockData.js'

export default {
	data() {
		return {
			userId: '',
			currentUserId: 0, // 当前登录用户ID
			chatMessages: [],
			inputText: '',
			userAvatar: 'https://via.placeholder.com/100',
			targetAvatar: 'https://via.placeholder.com/100'
		}
	},
	onLoad(options) {
		if (options.userId) {
			this.userId = options.userId
			this.loadChat()
		}
	},
	methods: {
		loadChat() {
			// 加载聊天记录
			this.chatMessages = getChatMessages(this.userId)
			
			// 加载用户头像
			const user = getUserInfo(this.userId)
			if (user) {
				this.targetAvatar = user.avatar
			}
		},
		sendMessage() {
			if (!this.inputText.trim()) return
			
			const newMessage = {
				id: this.chatMessages.length + 1,
				senderId: this.currentUserId,
				content: this.inputText,
				time: new Date().toLocaleString()
			}
			this.chatMessages.push(newMessage)
			this.inputText = ''
			
			// 滚动到底部
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 99999,
					duration: 300
				})
			}, 100)
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

.chat-list {
	padding: 20rpx;
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
}

.message-bubble {
	max-width: 60%;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.chat-item.self .message-bubble {
	background-color: #007AFF;
}

.message-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.chat-item.self .message-text {
	color: #fff;
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
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>





