<template>
	<view class="container">
		<view class="help-list">
			<view class="help-item" v-for="(item, index) in helpList" :key="index" 
				@click="toggleHelp(index)">
				<view class="help-header">
					<text class="help-title">{{ item.title }}</text>
					<uni-icons :type="item.expanded ? 'arrowup' : 'arrowdown'" 
						size="16" color="#999"></uni-icons>
				</view>
				<view class="help-content" v-if="item.expanded">
					<text>{{ item.content }}</text>
				</view>
			</view>
		</view>
		
		<!-- 联系客服 -->
		<view class="contact-section">
			<text class="contact-title">需要更多帮助？</text>
			<button class="contact-btn" @click="contactService">联系客服</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			helpList: [
				{
					title: '如何发布商品？',
					content: '点击底部"发布"按钮，填写商品信息（标题、分类、图片、价格、描述等），点击"发布商品"即可。',
					expanded: false
				},
				{
					title: '如何购买商品？',
					content: '在商品详情页点击"立即购买"，确认订单信息后完成支付即可。',
					expanded: false
				},
				{
					title: '如何联系卖家？',
					content: '在商品详情页点击"联系卖家"，或进入"消息"页面找到对应的聊天记录，即可与卖家沟通。',
					expanded: false
				},
				{
					title: '如何申请退款？',
					content: '在订单详情页点击"申请退款"，填写退款原因，等待卖家处理。如遇问题可联系客服。',
					expanded: false
				},
				{
					title: '如何修改个人信息？',
					content: '进入"我的"页面，点击头像或右上角箭头，进入"编辑资料"页面修改信息。',
					expanded: false
				},
				{
					title: '如何管理收货地址？',
					content: '进入"我的"页面，点击"地址管理"，可以添加、编辑或删除收货地址。',
					expanded: false
				},
				{
					title: '交易安全保障',
					content: '平台提供交易担保服务，支持退款退货，确保交易安全。如有问题可随时联系客服。',
					expanded: false
				},
				{
					title: '如何举报违规商品？',
					content: '在商品详情页点击右上角"..."按钮，选择"举报"，填写举报原因提交即可。',
					expanded: false
				}
			]
		}
	},
	methods: {
		toggleHelp(index) {
			this.helpList[index].expanded = !this.helpList[index].expanded
		},
		contactService() {
			uni.showModal({
				title: '联系客服',
				content: '客服电话：400-888-8888\n客服时间：9:00-18:00',
				showCancel: false,
				confirmText: '知道了'
			})
		}
	}
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 200rpx;
}

.help-list {
	padding: 20rpx;
}

.help-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.help-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.help-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.help-content {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #F5F5F5;
}

.help-content text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.8;
}

.contact-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 30rpx;
	border-top: 1rpx solid #eee;
}

.contact-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
	text-align: center;
}

.contact-btn {
	width: 100%;
	height: 88rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	border: none;
}
</style>





