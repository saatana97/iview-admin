<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
	name: "App",
	components: {},
	data() {
		return {};
	}
};
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	position: relative;
	border: none;
	body {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		#app {
			height: 100%;
			width: 100%;
			.full-container {
				width: 100%;
				height: 100%;
				overflow: auto;
				&.none-scroll {
					overflow: hidden;
				}
			}
		}
	}
}
</style>
