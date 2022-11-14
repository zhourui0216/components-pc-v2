<template>
	<div class="switch-button" :style="{'--width': width + 'px', '--height': height + 'px'}" @click="twoway ? change() : willChange()">
		<div class="box" :style="{background: value ? active : color, '--borderSize': borderSize + 'px', '--borcol': value ? boract : borcol}"></div>
		<div :class="{spot: true, open: value, shut: !value}" :style="{'--pointSize': pointSize + 'px', background: value ? pointActive : pointColor}"></div>
	</div>
</template>

<script>
import props from "./props.js";
export default {
	mixins: [props],
	data() {
		return {
			borcol: null, // borderColor
			boract: null, // borderActive
		}
	},
	created() {
		this.borcol = this.borderColor || this.color;
		this.boract = this.borderActive || this.active;
	},
	methods: {
		// 将要改变
		willChange() {
			this.$emit("willChange", !this.value);
		},
		// 改变
		change() {
			this.$emit("input", !this.value);
		}
	}
}
</script>

<style scoped lang="scss">
.switch-button {
	width: var(--width);
	height: var(--height);
	position: relative;
	cursor: pointer;

	.box {
		width: 100%;
		height: 100%;
		border-radius: calc(var(--width) / 2);
		border: var(--borderSize) solid var(--borcol);
		box-sizing: border-box;
		transition: all 0.4s;
		position: absolute;
		z-index: 1;
	}

	.spot {
		width: var(--pointSize);
		height: var(--pointSize);
		border-radius: 50%;
		transition: all 0.4s;
		position: absolute;
		z-index: 2;
	}

	$pointX: calc((var(--height) - var(--pointSize)) / 2);

	.open {
		transform: translate(
			calc(var(--width) - var(--pointSize) - $pointX),
			$pointX
		);
	}

	.shut {
		transform: translate($pointX, $pointX);
	}
}
</style>