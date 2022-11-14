<template>
	<div class="home">
        <div @click="go('/use-sidebar')">侧边栏</div>
        <div @click="go('/use-input-box')">输入框</div>
        <div @click="go('/use-verification-code')">验证码</div>
        <div @click="go('/use-switch-button')">切换按钮</div>
        <div @click="go('/use-radio')">勾选</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	methods: {
		a(e) {
			console.log("将要" + e)
		},
		b(e) {
			console.log("外部接收" + e)
		},
        go(path) {
            this.$router.push({path});
        }
	},
	watch: {
		value2(v) {
			console.log("改变：" + v + "," + typeof v)
			return v
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
