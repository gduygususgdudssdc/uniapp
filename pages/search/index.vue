<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrapper">
				<text class="search-icon">🔍</text>
				<input class="search-input" v-model="keyword" placeholder="搜索商品"
					@confirm="handleSearch" :focus="true" />
				<text v-if="keyword" class="clear-icon" @click="keyword = ''">❌</text>
			</view>
			<text class="cancel-btn" @click="handleCancel">取消</text>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-section" v-if="!hasSearched && historyList.length > 0">
			<view class="section-header">
				<text class="section-title">搜索历史</text>
				<text class="clear-btn" @click="clearHistory">清除</text>
			</view>
			<view class="history-tags">
				<view class="history-tag" v-for="(item, index) in historyList" 
					:key="index" @click="searchKeyword(item)">
					<text>{{ item }}</text>
				</view>
			</view>
		</view>
		
		<!-- 热门搜索 -->
		<view class="hot-section" v-if="!hasSearched">
			<text class="section-title">热门搜索</text>
			<view class="hot-tags">
				<view class="hot-tag" v-for="(item, index) in hotKeywords" 
					:key="index" @click="searchKeyword(item)">
					<text>{{ item }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			hasSearched: false,
			historyList: ['iPhone', 'MacBook', '运动鞋', '相机'],
			hotKeywords: ['手机', '电脑', '相机', '耳机', '运动鞋', '背包', '手表', '键盘']
		}
	},
	methods: {
		handleSearch() {
			if (!this.keyword.trim()) return
			
			// 添加到历史记录
			if (!this.historyList.includes(this.keyword)) {
				this.historyList.unshift(this.keyword)
				if (this.historyList.length > 10) {
					this.historyList.pop()
				}
			}
			
			// 跳转到搜索结果页
			uni.navigateTo({
				url: `/pages/search/result?keyword=${this.keyword}`
			})
		},
		searchKeyword(keyword) {
			this.keyword = keyword
			this.handleSearch()
		},
		handleCancel() {
			uni.navigateBack()
		},
		clearHistory() {
			uni.showModal({
				title: '提示',
				content: '确定要清除搜索历史吗？',
				success: (res) => {
					if (res.confirm) {
						this.historyList = []
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
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.search-input-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 40rpx;
	padding: 0 30rpx;
	height: 70rpx;
	margin-right: 20rpx;
}

.search-icon {
	font-size: 24rpx;
	margin-right: 10rpx;
}

.clear-icon {
	font-size: 20rpx;
	margin-left: 10rpx;
	cursor: pointer;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	margin: 0 10rpx;
}

.cancel-btn {
	font-size: 28rpx;
	color: #007AFF;
}

.history-section,
.hot-section {
	background-color: #fff;
	padding: 30rpx;
	margin-top: 20rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.clear-btn {
	font-size: 24rpx;
	color: #999;
}

.history-tags,
.hot-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.history-tag,
.hot-tag {
	padding: 15rpx 30rpx;
	background-color: #F5F5F5;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #333;
}
</style>





