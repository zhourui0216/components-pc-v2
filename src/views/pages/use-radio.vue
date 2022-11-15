<template>
	<div>
		<radio v-model="val" :label="1">是</radio>
		<radio v-model="val" :label="0">否</radio>
	</div>
</template>

<script>
import radio from "../../components/radio/index.vue";
export default {
	components: {
		radio
	},
	data() {
		return {
			val: 1,
		}
	}
}
</script>

<style scoped lang="scss">
div {
	display: flex;
}
</style>