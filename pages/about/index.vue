<template>
	<view class="container">
		<view class="about-section">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<text class="app-name">二手交易平台</text>
			<text class="version">Version 1.0.0</text>
		</view>
		
		<view class="info-section">
			<text class="info-title">平台介绍</text>
			<text class="info-content">
				二手交易平台是一个专业的二手商品交易平台，致力于为用户提供安全、便捷、高效的二手交易服务。
				我们秉承"诚信交易，共享价值"的理念，让闲置物品重新焕发价值，让交易变得更简单。
			</text>
		</view>
		
		<view class="info-section">
			<text class="info-title">联系我们</text>
			<view class="contact-item">
				<text class="contact-label">客服电话：</text>
				<text class="contact-value">400-888-8888</text>
			</view>
			<view class="contact-item">
				<text class="contact-label">客服邮箱：</text>
				<text class="contact-value">service@example.com</text>
			</view>
			<view class="contact-item">
				<text class="contact-label">官方微信：</text>
				<text class="contact-value">二手交易平台</text>
			</view>
		</view>
		
		<view class="copyright">
			<text>© 2024 二手交易平台</text>
			<text>All Rights Reserved</text>
		</view>
	</view>
</template>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 40rpx;
}

.about-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 60rpx 40rpx;
	margin-bottom: 30rpx;
}

.logo {
	width: 150rpx;
	height: 150rpx;
	margin-bottom: 30rpx;
}

.app-name {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 15rpx;
}

.version {
	font-size: 24rpx;
	color: #999;
}

.info-section {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
}

.info-title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 30rpx;
	display: block;
}

.info-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;
	display: block;
}

.contact-item {
	display: flex;
	margin-bottom: 20rpx;
}

.contact-label {
	font-size: 28rpx;
	color: #666;
	width: 200rpx;
}

.contact-value {
	font-size: 28rpx;
	color: #333;
}

.copyright {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 24rpx;
}
</style>





