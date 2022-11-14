<template>
	<div class="radio" @click="check()">
		<img :src="value == label ? radio2 : radio1" alt="">
		<!-- <input type="radio" name="s" :value="label" ref="redio" :checked="value == label"> -->
		<label>
			<slot></slot>
		</label>
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
	created() {
		console.log();
	},
	methods: {
		check() {
			console.log()
			// this.$refs.redio.click()
			this.$emit("input", this.label)
		}
	}
}
</script>

<style scoped lang="scss">
.radio {
    user-select: none;
	display: flex;
    align-items: center;
	margin: 0 10px;
    cursor: pointer;

    img {
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }

	label {
		font-size: 14px;
        cursor: pointer;
	}
}
</style>