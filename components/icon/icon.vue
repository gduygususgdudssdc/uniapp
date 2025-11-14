<template>
	<text class="icon" :style="iconStyle">{{ iconText }}</text>
</template>

<script>
export default {
	name: 'Icon',
	props: {
		type: {
			type: String,
			default: ''
		},
		size: {
			type: [Number, String],
			default: 16
		},
		color: {
			type: String,
			default: '#333'
		}
	},
	computed: {
		iconText() {
			const iconMap = {
				'search': '🔍',
				'arrowdown': '▼',
				'arrowup': '▲',
				'arrowright': '▶',
				'heart': '♡',
				'heart-filled': '♥',
				'phone': '📱',
				'locked': '🔒',
				'compose': '✏',
				'plus': '+',
				'clear': '✕',
				'checkmarkempty': '✓',
				'closeempty': '✕',
				'shop': '🛒',
				'list': '📋',
				'location': '📍',
				'gear': '⚙',
				'help': '❓',
				'chatboxes': '💬',
				'info': 'ℹ',
				'trash': '🗑',
				'paperplane': '✈',
				'wallet': '💰',
				'cart': '🛒'
			}
			return iconMap[this.type] || '•'
		},
		iconStyle() {
			return {
				fontSize: this.size + 'px',
				color: this.color
			}
		}
	}
}
</script>

<style scoped>
.icon {
	display: inline-block;
	font-style: normal;
}
</style>





