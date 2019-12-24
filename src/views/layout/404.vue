<template>
	<div class="container flex-box col col-center row-around">
		<div class="box">
			<p class="content">对不起，您访问的资源找不到了</p>
			<el-button size="large" type="primary" @click="handleGoback">返回上一个页面</el-button>
		</div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</template>
<script>
import AuthAPI from "@/api/user";
export default {
	data() {
		return {};
	},
	methods: {
		handleGoback() {
			this.$router.go(-2);
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	background: url("../../assets/loginBGP.jpg") center center no-repeat;
	background-size: cover;
	width: 100vw;
	height: 100vh;
	color: white;
	.box {
		min-width: 600px;
		height: 50%;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		.logo {
			width: 100%;
			margin: 20px;
			img {
				margin: 20px;
			}
			.point {
				width: 100%;
			}
		}
		.content {
			font-weight: bolder;
			font-size: 3em;
			text-align: center;
		}
	}
}
</style>
