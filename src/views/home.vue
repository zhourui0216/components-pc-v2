<template>
	<div class="home">
		<div @click="go('/use-sidebar')">侧边栏</div>
		<div @click="go('/use-input-box')">输入框</div>
		<div @click="go('/use-verification-code')">验证码</div>
		<div @click="go('/use-switch-button')">切换按钮</div>
		<div @click="go('/use-radio')">单选</div>
        <div @click="go('/use-ad-typesetting')">广告排版</div>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		go(path) {
			this.$router.push({ path });
		}
	}
}

</script>

<style lang="scss" scoped>
.home {
	width: 100%;
	height: 100%;

	div {
		cursor: pointer;
	}
}
</style>
