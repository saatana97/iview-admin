<template>
	<div class="container" @keyup.enter="handleSignin">
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
		<h1>管理平台</h1>
		<div class="box" v-loading="loading">
			<el-form size="large" ref="form" :rules="rule" :model="form">
				<el-form-item prop="username">
					<div class="flex-box">
						<img src="@/assets/prefix-account.png" />
						<el-divider direction="vertical"></el-divider>
					</div>
					<el-input placeholder="用户名" v-model="form.username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<div class="flex-box">
						<img src="@/assets/prefix-password.png" />
						<el-divider direction="vertical"></el-divider>
					</div>
					<el-input placeholder="密码" v-model="form.password" type="password"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox label="rember" v-model="rember" style="color:white;">记住密码</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button class="signup-btn" type="primary" @click="handleSignin">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import VueParticles from 'vue-particles/src/vue-particles/vue-particles';
import UserAPI from '@/api/user';
import MenuAPI from '@/api/menu';
import TreeUtils from '@/utils/TreeUtils';
import logo from '@/assets/logo3.png';
export default {
	name: 'Login',
	components: { VueParticles },
	data() {
		return {
			form: {
				username: '', //用户名
				password: '' //密码
			},
			rule: {
				username: [{ required: true, message: '用户名不能为空' }],
				password: [{ required: true, message: '密码不能为空' }]
			},
			rember: false,
			loading: false
		};
	},
	async mounted() {
		let rember = JSON.parse(this.$store.local('rember') || '{}');
		if (rember.username && rember.password) {
			this.rember = true;
			this.form.username = rember.username;
			this.form.password = rember.password;
		}
	},
	methods: {
		//提交登录
		async handleSignin() {
			try {
				this.loading = true;
				await this.$refs.form.validate();
				let res = await UserAPI.Login(this.form);
				console.info(res);
				if (res && res.token) {
					let user = {};
					if (this.rember) {
						user = {
							username: this.form.username,
							password: this.form.password
						};
					}
					this.$store.local('rember', user);
					console.info(res.token);
					this.$store.session('token', res.token);
					this.$store.session('user', JSON.stringify(res.auth || {}));
					await this.handleLoadMenu(res.auth.menu);
					let returnRoute = this.$store.session('returnRoute');
					if (
						this.$store
							.session('route')
							.split(',')
							.indexOf(returnRoute) === -1
					) {
						returnRoute = false;
					}
					let route = returnRoute || {
						name: 'Home'
					};
					this.$router.push(route);
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		},
		// 加载菜单
		async handleLoadMenu(arr) {
			let route = [],
				permission = [];
			arr.forEach(item => {
				permission.push(item.code);
				route.push(item.router);
			});
			arr = arr.filter(item => item.display);
			arr = TreeUtils.Build(arr, 'id', 'parentId', 'children');
			(function scale(arr) {
				if (arr instanceof Array) {
					arr.forEach(item => {
						scale(item.children);
					});
				}
			})(arr);
			this.$store.session('route', route.join(','));
			this.$store.session('permission', JSON.stringify(permission));
			this.$store.session('menus', JSON.stringify(arr));
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: url('../../assets/login-bgp.png') center center / 100% 100% no-repeat;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.lizi {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	h1 {
		margin: 30px;
		font-size: 3em;
		color: white;
	}
	.box {
		z-index: 2;
		width: 30%;
		min-width: 480px;
		background: url('../../assets/signin-box-bgp.png') left top / contain no-repeat;
		box-shadow: rgba(0, 0, 0, 0.3) 5px 30px 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 50px;
		.el-form {
			width: 60%;

			.el-form-item {
				position: relative;
				.flex-box {
					height: 100%;
					width: 80px;
					position: absolute;
					z-index: 9;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					img {
						margin-right: 10px;
						height: 60%;
					}
					.el-divider {
						height: 1.5em;
					}
				}
				.el-input {
					/deep/ input {
						border-radius: 0;
						padding-left: 80px;
					}
				}
				.code {
					width: 60%;
					+ .img {
						float: right;
						height: 40px;
						width: 30%;
						background-color: white;
						background-position: center center;
						background-size: 100% 100%;
						background-repeat: no-repeat;
					}
				}
				.signup-btn {
					border-radius: 0;
					width: 100%;
					font-size: 1.8em;
					background-color: rgb(16, 177, 230);
				}
			}
			.flex-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				p {
					color: white;
					margin-bottom: 20px;
					a {
						text-decoration: underline !important;
					}
					.el-button {
						font-size: 1em;
						color: white;
						text-decoration: underline !important;
					}
				}
			}
		}
	}
	.reset {
		width: 60%;
		margin: auto;
	}
}
</style>
