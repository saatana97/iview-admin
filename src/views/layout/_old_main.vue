<template>
	<div class="container" v-loading="loading">
		<header>
			<div class="logo"></div>
			<div class="left">
				<el-button type="text" class="toggle-menu-btn" @click="isCollapse = !isCollapse">
					<i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
				</el-button>
				<el-menu class="top-menu" mode="horizontal" :router="false" :default-active="currentTopMenu && currentTopMenu.code">
					<template v-for="parent in handleSortMenu(menus)">
						<el-menu-item :key="parent.code" :index="parent.code" :route="{ path: parent.router }" @click="handleTopMenuClick(parent)">
							<i :class="parent.icon"></i>
							<span slot="title">{{ parent.title }}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</div>
			<div class="right">
				<img class="user-photo" src="@/assets/photo.jpg" />
				<el-dropdown>
					<p class="user-name">
						{{ user.username }}
						<i class="el-icon-arrow-down el-icon--right"></i>
					</p>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="handleExitFullScreen" v-if="isFullScreen">
							<i class="el-icon-third-quxiaoquanping"></i>
							<span>退出全屏</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="handleFullScreen" v-else>
							<i class="el-icon-third-quanping"></i>
							<span>全屏显示</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="handleShowRepwd">
							<i class="el-icon-third-suoding"></i>
							<span>修改密码</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="handleLogout">
							<i class="el-icon-third-kaiguan"></i>
							<span>退出系统</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-button type="text" title="消息通知" @click="handleNotify">
					<el-badge :value="notifyCount" :max="99" class="item">
						<i style="font-size:24px;" class="el-icon-third-icon_notice text-success"></i>
					</el-badge>
				</el-button>
				<el-button type="text" title="注销登录" @click="handleLogout">
					<i style="font-size:24px;" class="el-icon-third-icon_share text-danger"></i>
				</el-button>
			</div>
		</header>
		<body>
			<aside>
				<el-menu router class="left-menu" :collapse="isCollapse" unique-opened :collapse-transition="!isCollapse" :default-active="(currentLeftMenu && currentLeftMenu.code) || ''" :default-openeds="openMenus">
					<template v-for="parent in handleSortMenu(leftMenus)">
						<el-submenu :index="parent.code" v-if="parent.children instanceof Array && parent.children.length > 0" :key="parent.code">
							<template slot="title">
								<i :class="parent.icon"></i>
								<span slot="title">{{ parent.title }}</span>
							</template>
							<el-menu-item :key="child.code" v-for="child in handleSortMenu(parent.children)" :index="child.code" :route="{ path: child.router }">{{ child.title }}</el-menu-item>
						</el-submenu>
						<el-menu-item v-else :key="parent.code" :index="parent.code" :route="{ path: parent.router }">
							<i :class="parent.icon"></i>
							<span slot="title">{{ parent.title }}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section>
				<el-button-group class="tab-oparetion">
					<el-button icon="el-icon-arrow-left" @click="handlePrevTab">上一页</el-button>
					<el-button @click="handleClearTab" title="点击按钮时按住CTRL可以关闭全部标签">关闭其他</el-button>
					<el-button @click="handleNextTab">
						下一页
						<i class="el-icon-arrow-right el-icon--right"></i>
					</el-button>
				</el-button-group>
				<el-tabs type="card" v-model="currentTab" closable @tab-remove="handleTabRemove" @tab-click="handleTabClick" class="main-tabs" key="main-tabs">
					<el-tab-pane :key="item.name + ''" v-for="item in tabs" :label="item.title" :name="item.name">
						<keep-alive>
							<router-view v-if="item.name === currentTab" />
						</keep-alive>
					</el-tab-pane>
				</el-tabs>
				<footer>时尚家居日杂后台管理系统</footer>
			</section>
		</body>
		<k-window title="修改密码" :visible.sync="repwdVisiable" width="500px" :close-on-click-modal="false">
			<el-form :model="repwdForm" ref="repwdForm" :rules="repwdRule" label-width="100px">
				<el-form-item label="原密码" prop="pass">
					<el-input v-model="repwdForm.pass" clearable show-password placeholder="请输入原密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPwd">
					<el-input v-model="repwdForm.newPwd" clearable show-password placeholder="由6~20位数字、字母下划线分割线小数点组成"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="repwd">
					<el-input v-model="repwdForm.repwd" clearable show-password placeholder="请再次输入新密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleCloseRepwd">取 消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSaveRepwd">保 存</el-button>
			</div>
		</k-window>
	</div>
</template>
<script>
import UserAPI from '@/api/user';
let firstCollapse = true;
export default {
	data() {
		const _this = this;
		return {
			loading: false,
			user: {},
			isCollapse: false,
			notifyCount: 0,
			menus: [],
			leftMenus: [],
			openMenus: [],
			currentTopMenu: null,
			currentLeftMenu: null,
			homeTab: { title: '首页', name: 'Home', router: '/home' },
			tabs: [],
			currentTab: null,
			repwdVisiable: false,
			repwdForm: {
				id: null,
				pass: null,
				newPwd: null,
				repwd: null
			},
			repwdRule: {
				pass: [{ required: true, message: '原密码不能为空' }],
				newPwd: [
					{ required: true, message: '新密码不能为空' },
					{
						validator(rule, value, cb) {
							if (/^[0-9a-zA-Z-_\.]{6,20}$/.test(value)) {
								cb();
							} else {
								cb(new Error('密码格式错误'));
							}
						}
					}
				],
				repwd: [
					{ required: true, message: '请再次确认新密码' },
					{
						validator(rule, value, cb) {
							if (value === _this.repwdForm.newPwd) {
								cb();
							} else {
								cb(new Error('两次密码输入不一致'));
							}
						}
					}
				]
			},
			isFullScreen: false,
			notify: null,
			clearId: 0
		};
	},
	beforeDestroy() {
		clearInterval(this.clearId);
	},
	async mounted() {
		this.loading = true;
		this.user = JSON.parse(this.$store.session('user') || '{}');
		await this.handleLoadMenu();
		this.tabs = [this.homeTab];
		this.handleRouterChange(this.$router.history.current.fullPath);
		const _this = this;
		window.onresize = function() {
			_this.isFullScreen = document.fullscreenEnabled && (window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled || false);
		};
		this.loading = false;
	},
	watch: {
		$route(to, from) {
			this.handleRouterChange(to.fullPath);
		},
		tabs(value, old) {
			if (!value || value.length === 0) {
				this.$router.push({ name: 'Home' });
			}
		}
	},
	methods: {
		handleFullScreen() {
			var requestMethod =
				document.body.requestFullScreen || //W3C
				document.body.webkitRequestFullScreen || //FireFox
				document.body.mozRequestFullScreen || //Chrome等
				document.body.msRequestFullScreen; //IE11
			if (requestMethod) {
				requestMethod.call(document.body);
			} else if (typeof window.ActiveXObject !== 'undefined') {
				//for Internet Explorer
				var wscript = new ActiveXObject('WScript.Shell');
				if (wscript !== null) {
					wscript.SendKeys('{F11}');
				}
			} else {
				this.$message.error('当前浏览器不支持全屏显示');
			}
		},
		handleExitFullScreen() {
			var exitMethod =
				document.exitFullscreen || //W3C
				document.mozCancelFullScreen || //FireFox
				document.webkitExitFullscreen || //Chrome等
				document.webkitExitFullscreen; //IE11
			if (exitMethod) {
				exitMethod.call(document);
			} else if (typeof window.ActiveXObject !== 'undefined') {
				//for Internet Explorer
				var wscript = new ActiveXObject('WScript.Shell');
				if (wscript !== null) {
					wscript.SendKeys('{F11}');
				}
			} else {
				this.$message.error('当前浏览器不支持全屏显示');
			}
		},
		handleShowRepwd() {
			this.repwdVisiable = true;
		},
		handleCloseRepwd() {
			this.repwdVisiable = false;
		},
		async handleSaveRepwd() {
			try {
				await this.$refs.repwdForm.validate();
				this.loading = true;
				this.repwdForm.id = JSON.parse(this.$store.session('user') || '{}').id;
				let res = await UserAPI.Repwd(this.repwdForm);
				if (res) {
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.handleCloseRepwd();
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		},
		handleTopMenuClick(menu) {
			this.currentTopMenu = menu;
			if (menu.children && menu.children.length > 0) {
				if (firstCollapse) {
					this.isCollapse = false;
					firstCollapse = false;
				} else {
					this.isCollapse = false || this.isCollapse;
				}
			} else {
				this.$router.push(menu.router);
				if (!this.isCollapse) {
					firstCollapse = true;
				}
				this.isCollapse = true;
			}
			this.leftMenus = menu.children || [];
		},
		handleSortMenu(arr) {
			return arr
				.filter(item => item.display)
				.sort((prev, next) => {
					return (prev.sort || 0) - (next.sort || 0);
				});
		},
		handleLoadMenu() {
			this.menus = JSON.parse(this.$store.session('menus') || '[]');
		},
		handleNotify() {
			this.notify = this.$notify({
				title: '消息通知',
				message: '暂时没有新的消息通知',
				type: 'success',
				duration: 1000
			});
		},
		handleLogout() {
			this.$store.clearSession();
			this.$router.push({ name: 'Login' });
		},
		handlePrevTab() {
			let tabIndex = this.tabs.findIndex(item => {
				return item.name === this.currentTab;
			});
			if (tabIndex === -1 || tabIndex === 0) {
				this.$message.info('前面没有了');
			} else {
				this.goTab(this.tabs[tabIndex - 1]);
			}
		},
		handleNextTab() {
			let tabIndex = this.tabs.findIndex(item => {
				return item.name === this.currentTab;
			});
			if (tabIndex === -1 || tabIndex === this.tabs.length - 1) {
				this.$message.info('后面没有了');
			} else {
				this.goTab(this.tabs[tabIndex + 1]);
			}
		},
		async handleClearTab(event) {
			const _this = this;
			let all = event.ctrlKey,
				str = all ? '全部' : '其他';
			if (all ? this.tabs.length > 1 : this.tabs.length > 2) {
				try {
					await this.$confirm('确定要关闭' + str + '标签页吗？');
					let arr = [this.homeTab];
					let current = this.homeTab;
					if (!all) {
						let temp = this.tabs.find(item => item.name === _this.currentTab);
						if (temp && temp.name !== 'Home') {
							arr.push(temp);
							current = temp;
						}
					}
					this.tabs = arr;
					this.goTab(current);
				} catch (e) {}
			}
		},
		handleTabRemove(name) {
			if (name === 'Home') {
				return;
			}
			let tabIndex = this.tabs.findIndex(item => {
				return item.name === name;
			});
			this.tabs.splice(tabIndex, 1);
			if (this.tabs.length > 0) {
				this.goTab(this.tabs[this.tabs.length - 1]);
			}
		},
		handleTabClick(tab) {
			tab = this.tabs.find(item => {
				return item.name === tab.name;
			});
			this.goTab(tab);
		},
		addTab(title, name, router, fullPath) {
			let tab = this.tabs.find(item => {
				return item.name === name;
			});
			if (!tab) {
				tab = {
					title,
					name,
					router
				};
				if (name === 'Home') {
					this.tabs.unshift(tab);
				} else {
					this.tabs.push(tab);
				}
			}
			this.goTab(tab, fullPath || router);
		},
		goTab(tab, fullPath) {
			this.currentTab = tab.name;
			this.$router.push(fullPath || tab.router);
		},
		goMenu(parents, menu) {
			this.openMenus = [];
			parents.forEach(item => {
				this.openMenus.push(item.permission);
			});
			this.currentLeftMenu = menu;
		},
		handleRouterChange(fullPath) {
			let router = fullPath.split('?')[0];
			const _this = this;
			let isHome = false;
			//匹配顶部菜单
			let topMenu = this.menus.find(item => {
				return item.router === fullPath;
			});
			if (!topMenu) {
				topMenu = this.menus.find(item => {
					return fullPath.startsWith(item.router + '/');
				});
			}
			if (!topMenu) {
				console.warn('路由匹配菜单失败');
				return;
			}
			let menu = false;
			let parents = [];
			// 匹配左侧菜单
			// 先完整匹配
			(function scanle(arr) {
				let res = false;
				if (arr instanceof Array) {
					res = arr.find(item => {
						res = item.router === fullPath;
						if (res) {
							menu = item;
						} else {
							parents.push(item);
							res = !!scanle(item.children);
							if (!res) {
								parents.pop();
							}
						}
						return res;
					});
				}
				return res;
			})(topMenu.children);
			// 匹配不到再模糊匹配
			if (!menu) {
				(function scanle(arr) {
					let res = false;
					if (arr instanceof Array) {
						res = arr.find(item => {
							res = item.router === fullPath;
							if (res) {
								menu = item;
							} else if (fullPath.startsWith(item.router + '/')) {
								parents.push(item);
								res = !!scanle(item.children);
								if (!res) {
									menu = parents.pop();
									res = true;
								}
							}
							return res;
						});
					}
					return res;
				})(topMenu.children);
			}
			this.$store.debug && console.info(parents.map(item => item.name).join('/') + ' > ' + menu.name);
			if (topMenu) {
				this.handleTopMenuClick(topMenu);
				this.currentLeftMenu = menu;
				let tab = this.tabs.find(item => {
					return item.router === fullPath;
				});
				if (tab) {
					this.goTab(tab);
				} else if (menu && (!menu.children || menu.children.length === 0)) {
					this.addTab(menu.title, menu.code, menu.router, fullPath);
					this.goMenu(parents, menu);
				} else if (topMenu && (!topMenu.children || topMenu.children.length === 0)) {
					this.addTab(topMenu.title, topMenu.code, topMenu.router, fullPath);
					this.goMenu(parents, menu);
				}
			}
		}
	}
};
</script>
<style lang="scss" scoped>
//header
// $bgc-header-normal: #2469dd;
$bgc-header-normal: #2c3e50;
$bgc-header-hover: $bgc-header-normal + 20%;
$bgc-header-active: $bgc-header-hover + 20%;
$bdc-header: $bgc-header-active + 50%;
$fc-header: white;
$shadow-header: #ccc 0px 0px 5px;
$height-header: 50px;
// left
$bgc-left-normal: #5c738c;
$bgc-left-hover: $bgc-left-normal + 20%;
$bgc-left-active: $bgc-left-hover + 20%;
$bdc-left: $bgc-left-active + 50%;
$fc-left: white;
$ic-left: $fc-left - 50%;
// tab
$bgc-tab-normal: $bgc-left-hover;
$bgc-tab-active: #6dacc7;
$bdc-tab-normal: $bgc-left-normal;
$bdc-tab-active: $bdc-tab-normal + 100%;
$fc-tab: white;
$shadow-tab: #ccc 0px 0px 10px;
// content
$bgc-content-normal: lightgray;
$bgc-content-hover: $bgc-content-normal + 20%;
$bgc-content-active: $bgc-content-hover + 20%;
// footer
$height-footer: 30px;
.container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	header {
		width: 100%;
		height: $height-header;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: $shadow-header;
		background: $bgc-header-normal;
		/deep/ * {
			color: $fc-header;
		}
		.logo {
			width: 200px;
			height: 36px;
			background: url('../../assets/logo2.png') 20px center / contain no-repeat;
			&::after {
				content: '时尚家居日杂';
				line-height: 36px;
				padding-left: 80px;
			}
		}
		.left {
			flex-grow: 1;
			display: flex;
			.toggle-menu-btn {
				width: $height-header;
			}
			.top-menu {
				background: $bgc-header-normal;
				.el-menu-item {
					height: $height-header;
					line-height: $height-header;
					&.is-active {
						background: $bgc-header-active;
						border: none;
						border-bottom: $bdc-header 5px solid;
					}
					&:hover {
						background: $bgc-header-hover;
					}
				}
			}
		}
		.right {
			display: flex;
			align-items: center;
			min-width: 130px;
			padding-right: 1em;
			> *:not(:last-child) {
				margin-right: 10px;
			}
			.user-photo {
				height: 1.8em;
				border-radius: 50%;
			}
			.user-name {
				line-height: 32px;
			}
		}
	}
	body {
		width: 100%;
		height: 100%;
		background: $bgc-content-normal;
		aside {
			height: 100%;
			float: left;
			.left-menu {
				background: $bgc-left-normal;
				min-width: 60px;
				height: 100%;
				width: 100%;
				&:not(.el-menu--collapse) {
					width: 200px;
				}
				/deep/ .el-menu-item {
					height: 3em;
					line-height: 3em;
					margin: 0.5em 0;
					color: $fc-left;
					i {
						color: $ic-left;
					}
					&:hover {
						background-color: $bgc-left-hover;
						color: $fc-left;
					}
					&.is-active {
						border-right: 3px $bdc-left solid;
						background-color: $bgc-left-active;
						color: $fc-left;
					}
				}
			}
		}
		section {
			height: calc(100% - 60px);
			padding: 5px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.main-tabs {
				max-width: 100%;
				height: calc(100% - 45px);
				/deep/ .el-tabs__header {
					height: 30px;
					padding: 10px;
					padding-right: 280px;
					background: $bgc-content-hover;
					border: none;
					* {
						background: none;
						border: none;
					}
					.el-tabs__nav-next,
					.el-tabs__nav-prev {
						height: 28px;
						line-height: 30px;
						font-size: 1.2em;
					}
					.el-tabs__item {
						margin-right: 5px;
						height: 30px;
						line-height: 30px;
						background-color: $bgc-tab-normal;
						color: $fc-tab;
						border: 1px solid $bdc-tab-normal;
						border-radius: 5px;
						&.is-active {
							box-shadow: $shadow-tab;
							z-index: 10;
							background-color: $bgc-tab-active;
							border: 1px solid $bdc-tab-active;
							color: $fc-tab;
							font-weight: bolder;
						}
					}
				}
				/deep/ .el-tabs__content {
					background: $bgc-content-active;
					border: 1px solid $bdc-tab-active;
					height: calc(100% - 62px);
					.el-tab-pane {
						overflow: hidden;
						height: calc(100% - 2vh);
						width: calc(100% - 2vh);
						padding: 1vh;
						> .container {
							height: 100%;
							width: 100%;
							overflow: auto;
							display: flex;
							flex-direction: row;
							justify-content: center;
							flex-wrap: nowrap;
							> .left {
								min-width: 200px;
								height: calc(100% - 1px);
								overflow: auto;
							}
							> .right {
								flex-grow: 1;
								width: 100%;
								height: calc(100% - 1px);
								> .oparetion {
									.el-button {
										margin: 0 1% 0.5% 0;
									}
								}
								> .search {
									.el-form {
										.el-form-item {
											margin-bottom: 0.5%;
										}
									}
								}
								> .content {
									overflow: auto;
									flex-grow: 1;
									.el-table {
										width: 100%;
										height: 100%;
										/deep/ td {
											padding: 0.5% 0;
										}
									}
								}
								> .pagination {
									margin-top: 0.5%;
								}
							}
						}
					}
				}
			}
			.tab-oparetion {
				max-width: 280px;
				position: absolute;
				top: 15px;
				right: 15px;
				z-index: 10;
				.el-button {
					height: 30px;
				}
			}
			footer {
				background: $bgc-content-hover;
				text-align: center;
				height: $height-footer;
				line-height: $height-footer;
			}
		}
	}
}
</style>
