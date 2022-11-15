<template>
	<div class="radio">
		<img :src="value == label ? radio1 : radio2" @click="check()">
		<p @click="check()">
			<slot></slot>
		</p>
	</div>
</template>

<script>
import props from "./props.js"
export default {
	mixins: [props],
	data() {
		return {
			radio1: require("./static/radio1.png"),
			radio2: require("./static/radio2.png"),
		}
	},
	methods: {
		check() {
			this.$emit("input", this.label);
		}
	}
}
</script>

<style scoped lang="scss">
.radio {
	width: auto;
	min-width: 60px;
	height: auto;
	display: flex;
	align-items: center;
	user-select: none;

	img {
		width: 14px;
		height: 14px;
		margin-right: 10px;
		cursor: pointer;
	}

	p {
		font-size: 14px;
		cursor: pointer;
	}
}
</style>