<template>
	<div class="use-switch-button">
		<switch-button v-model="val"></switch-button>
	</div>
</template>

<script>
import switchButton from "../../components/switch-button/index.vue";
export default {
	components: {
		switchButton
	},
	data() {
		return {
			val: true
		}
	},
    methods: {
        change(e) {
            console.log(e);
        }
    }
}
</script>

<style scoped lang="scss">
.use-switch-button {
    padding: 20px;
}
</style>