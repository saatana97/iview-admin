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

<style>
* {
	margin: 0;
	padding: 0;
	position: relative;
	border: none;
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
	width: 100vw;
}
.full-container {
	width: 100%;
	height: 100%;
	overflow: auto;
}
</style>
