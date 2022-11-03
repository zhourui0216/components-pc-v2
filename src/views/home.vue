<template>
	<div class="home">
        <div @click="go('/use-sidebar')">侧边栏</div>
		<!-- <sidebar :list="list" :fold="fold"></sidebar> -->
		<!-- <button @click="fold=!fold">切换</button> -->
		<!-- <input-box v-model="value2" clearable ></input-box> -->
		<!-- <verification-code @change="b"></verification-code> -->
	</div>
</template>

<script>
import sidebar from "../components/sidebar/index.vue";
import inputBox from "../components/input-box/index.vue";
import verificationCode from "../components/verification-code/index.vue";
export default {
	components: {
		sidebar,
		inputBox,
		verificationCode
	},
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
}
</style>
