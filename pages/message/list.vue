<template>
	<view class="container">
		<view class="message-list">
			<view class="message-item" v-for="item in messageList" :key="item.id" @click="goToChat(item.userId)">
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="message-content">
					<view class="message-header">
						<text class="username">{{ item.username }}</text>
						<text class="time">{{ formatTime(item.lastTime) }}</text>
					</view>
					<view class="message-body">
						<text class="last-message">{{ item.lastMessage }}</text>
						<view class="unread-badge" v-if="item.unreadCount > 0">
							<text>{{ item.unreadCount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view v-if="messageList.length === 0" class="empty">
			<uni-icons type="chatboxes" size="80" color="#ddd"></uni-icons>
			<text>暂无消息</text>
		</view>
	</view>
</template>

<script>


export default {
	data() {
		return {
			messageList: []
		}
	},
	onLoad() {
		this.loadMessages()
	},
	onShow() {
		this.loadMessages()
	},
	methods: {
		loadMessages() {
			this.messageList = getMessageList()
		},
		goToChat(userId) {
			uni.navigateTo({
				url: `/pages/message/chat?userId=${userId}`
			})
		},
		formatTime(time) {
			const date = new Date(time)
			const now = new Date()
			const diff = now - date
			const days = Math.floor(diff / (1000 * 60 * 60 * 24))
			if (days === 0) {
				const hours = Math.floor(diff / (1000 * 60 * 60))
				if (hours === 0) {
					const minutes = Math.floor(diff / (1000 * 60))
					return minutes + '分钟前'
				}
				return hours + '小时前'
			}
			if (days === 1) return '昨天'
			if (days < 7) return days + '天前'
			return date.toLocaleDateString()
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.message-list {
	padding: 20rpx;
}

.message-item {
	display: flex;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
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
}

.unread-badge {
	min-width: 36rpx;
	height: 36rpx;
	background-color: #FF5722;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 10rpx;
	margin-left: 20rpx;
}

.unread-badge text {
	font-size: 20rpx;
	color: #fff;
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
	color: #999;
}

.empty text {
	margin-top: 30rpx;
	font-size: 28rpx;
}
</style>





