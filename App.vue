<script>
	import config from '@/utils/config.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			console.log('API 地址:', config.baseURL)
			
			// 清除可能存在的本地存储地址，使用默认配置
			config.clearBaseURL()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
