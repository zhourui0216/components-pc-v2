<template>
	<div class="switch-button" :style="{width: width + 'px', height: height + 'px', background: value ? active : color, borderRadius: (width / 2) + 'px', '--borderSize': borderSize + 'px', '--bc': value ? ba : bc}" @click="twoway ? change() : willChange()">
		<div :class="{spot: true, open: value, shut: !value}" :style="{'--height': height + 'px', '--pointSize': pointSize + 'px', background: value ? pointActive : pointColor}"></div>
	</div>
</template>

<script>
import props from "./props.js";
export default {
	mixins: [props],
	data() {
		return {
			bc: null, // borderColor
			ba: null, // borderActive
		}
	},
	created() {
		this.bc = this.borderColor || this.color;
		this.ba = this.borderActive || this.active;
	},
	methods: {
		// 将要改变
		willChange() {
			console.log("将要改变")
			this.$emit("willChange", !this.value);
		},
		// 改变
		change() {
			console.log("改变")
			this.$emit("input", !this.value);
		}
	}
}
</script>

<style scoped lang="scss">
.switch-button {
	border: var(--borderSize) solid var(--bc);
	transition: all 0.4s;
	box-sizing: border-box;
	position: relative;
	cursor: pointer;

	.spot {
		width: var(--pointSize);
		height: var(--pointSize);
		border-radius: 50%;
		transform: translateY(-50%);
		transition: all 0.4s;
		position: absolute;
		top: 50%;
	}

	$pointX: calc((var(--height) - var(--pointSize)) / 2);

	.open {
		left: calc(100% - var(--pointSize) - $pointX + var(--borderSize));
	}

	.shut {
		left: calc($pointX - var(--borderSize));
	}
}
</style>