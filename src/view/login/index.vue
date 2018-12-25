<template>
	<Layout class="layout-container">
		<vue-particles
			color="#fff"
			:particleOpacity="1"
			:particlesNumber="60"
			shapeType="circle"
			:particleSize="4"
			linesColor="#fff"
			:linesWidth="1"
			:lineLinked="true"
			:lineOpacity="0.7"
			:linesDistance="150"
			:moveSpeed="3"
			:hoverEffect="true"
			hoverMode="grab"
			:clickEffect="true"
			clickMode="push"
			class="lizi full-container none-scroll"
		/>
		<Content class="login-box">
			<h1 class="layout-logo">
				<img src="@/assets/logo.png">
				iView-admin管理系统
			</h1>
			<Form ref="loginForm" :model="form" :rules="rules">
				<FormItem prop="username">
					<Input type="text" v-model="form.username" placeholder="Username">
						<Icon type="ios-person-outline" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem prop="password">
					<Input type="password" v-model="form.password" placeholder="Password">
						<Icon type="ios-lock-outline" slot="prepend"></Icon>
					</Input>
				</FormItem>
				<FormItem>
					<Button type="primary" @click="handleLogin" long>登 陆</Button>
				</FormItem>
				<FormItem label="自动登录">
					<i-Switch size="large" v-model="form.remeber">
						<span slot="open">ON</span>
						<span slot="close">OFF</span>
					</i-Switch>
				</FormItem>
			</Form>
		</Content>
	</Layout>
</template>
<script>
import VueParticles from "vue-particles/src/vue-particles/vue-particles";
import AuthApi from "@/api/auth";
export default {
	components: { VueParticles },
	data() {
		return {
			form: {
				username: "admin",
				password: "123456",
				remeber: false
			},
			rules: {
				username: [
					{
						required: true,
						message: "请输入您的用户名",
						trigger: "change"
					}
				],
				password: [
					{
						required: true,
						message: "请输入您的的登录密码",
						trigger: "change"
					},
					{
						type: "string",
						min: 6,
						max: 20,
						message: "密码由6到20个字符组成",
						trigger: "change"
					}
				]
			}
		};
	},
	methods: {
		handleLogin() {
			this.$refs["loginForm"].validate(async valid => {
				if (valid) {
					let res = await AuthApi.Login(this.form);
					let storage = sessionStorage;
					if (this.form.remeber) {
						storage = localStorage;
					}
					storage.token = res.token;
					let returnRouter = sessionStorage.returnRouter || "/home";
					this.$router.push(returnRouter);
					this.$Message.success("登陆成功");
				} else {
					this.$Message.error("登录失败");
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
* {
	font-size: 12px;
}
.layout-container {
	color: white;
	background: #515a6e;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	.login-box {
		padding: 50px;
		width: max-content;
		min-width: 25%;
		top: 20%;
		left: 38%;
		position: fixed;
		background: rgba(0, 0, 0, 0.3);
		.layout-logo {
			font-size: 2rem;
			text-align: center;
			height: 50px;
			line-height: 50px;
			margin-bottom: 20px;
			& > img {
				float: left;
				width: 30px;
				height: 30px;
				margin: 10px;
			}
		}
	}
}
* {
	/deep/ .ivu-form-item-label {
		color: white !important;
	}
}
</style>
