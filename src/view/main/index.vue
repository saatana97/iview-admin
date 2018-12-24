<template>
	<Layout class="full-container">
		<Header>
			<Menu mode="horizontal" theme="dark" active-name="1">
				<div class="layout-logo">
					<img src="@/assets/logo.png" alt="LOGO">
					iView-admin管理系统框架
				</div>
				<div class="layout-nav">
					<MenuItem name="2" @click.native="handleRequestFullScreen">
						<Icon type="md-qr-scanner"/>全屏显示
					</MenuItem>
					<MenuItem name="1">
						<Icon type="md-mail"/>消息通知
					</MenuItem>
					<MenuItem name="2" style="color:red;">
						<Icon type="md-power"/>注销登录
					</MenuItem>
				</div>
			</Menu>
		</Header>
		<Layout class="full-container">
			<Sider>
				<Menu
					accordion
					theme="dark"
					width="auto"
					:active-name="activeMenu"
					:open-names="openMenus"
					ref="leftMenu"
				>
					<Submenu :name="item.code" v-for="(item,index) in menus" :key="index">
						<template slot="title">
							<Icon type="ios-navigate"></Icon>
							{{item.name}}
						</template>
						<MenuItem
							:name="children.code"
							v-for="(children,cindex) in item.children"
							:key="cindex"
							:to="children.router"
						>{{children.name}}</MenuItem>
					</Submenu>
				</Menu>
			</Sider>
			<Layout :style="{padding: '24px'}" class="full-container">
				<Tabs
					type="card"
					closable
					:before-remove="handleTabRemove"
					@on-click="handleTabClick"
					:value="activeTab"
				>
					<TabPane :label="item.label" v-for="(item,index) in tabs" :key="index">
						<Layout
							class="full-container"
							:style="{background:'white',border:'1px solid #dcdee2',borderTop:'none'}"
						>
							<keep-alive>
								<router-view/>
							</keep-alive>
						</Layout>
					</TabPane>
					<ButtonGroup size="small" slot="extra">
						<Button size="small" type="default" @click="goPrevTab">
							<Icon type="md-rewind"/>
						</Button>
						<Button size="small" type="default" @click="clearTabs">
							<Icon type="md-trash"/>
						</Button>
						<Button size="small" type="default" @click="goNextTab">
							<Icon type="md-fastforward"/>
						</Button>
					</ButtonGroup>
				</Tabs>
			</Layout>
		</Layout>
	</Layout>
</template>
<script>
export default {
	data() {
		return {
			modals: {
				clearTabsConfirm: false
			},
			activeTab: 0,
			tabs: [
				{
					label: "首页",
					router: "/home"
				}
			],
			menus: [
				{
					name: "系统设置",
					code: "systemSetting",
					router: "/sys",
					children: [
						{
							name: "菜单管理",
							code: "menuManager",
							router: "/sys/menu"
						},
						{
							name: "用户管理",
							code: "userManager",
							router: "/sys/user"
						}
					]
				},
				{
					name: "个人中心",
					code: "owner",
					router: "/owner",
					children: [
						{
							name: "个人资料",
							code: "userInfo",
							router: "/owner/userinfo"
						},
						{
							name: "通讯录",
							code: "concact",
							router: "/owner/concact"
						}
					]
				}
			],
			activeMenu: "userManager",
			openMenus: ["systemSetting"]
		};
	},
	created() {
		this.handleRouterChange(this.$router.history.current.fullPath);
	},
	methods: {
		handleRequestFullScreen() {
			document.body.webkitRequestFullScreen();
		},
		handleTabRemove(index) {
			this.tabs.splice(index, 1);
			if (this.tabs.length === 0) {
				this.addTab("首页", "/home");
			} else {
				if (this.tabs.length === index) {
					index--;
				}
				this.goTab(index);
			}
			return new Promise(() => {});
		},
		handleTabClick(index) {
			this.$router.push(this.tabs[index].router);
		},
		addTab(label, router) {
			let tabIndex = -1;
			let tab = this.tabs.find((item, index) => {
				tabIndex = index;
				return item.router === router && item.label === label;
			});
			if (!tab) {
				this.tabs.push({
					label,
					router
				});
				tabIndex++;
			}
			this.goTab(tabIndex);
		},
		goTab(index) {
			this.activeTab = index;
			this.$router.push(this.tabs[index].router);
		},
		goPrevTab() {
			let index = this.activeTab - 1;
			if (index < 0) {
				this.$Message.info("已经是最前了");
			} else {
				this.goTab(index);
			}
		},
		goNextTab() {
			let index = this.activeTab + 1;
			if (index >= this.tabs.length) {
				this.$Message.info("已经是最后了");
			} else {
				this.goTab(index);
			}
		},
		clearTabs() {
			const _this = this;
			this.$Modal.confirm({
				title: "操作提示",
				content: "确定要关闭全部标签页吗？",
				closable: true,
				onOk: () => {
					while (_this.tabs.length > 1) {
						_this.handleTabRemove(_this.tabs.length - 1);
					}
				}
			});
		},
		goMenu(parents, menu) {
			this.openMenus = [];
			parents.forEach(item => {
				this.openMenus.push(item.code);
			});
			this.activeMenu = menu.code;
			this.$nextTick(() => {
				this.$refs.leftMenu.updateOpened();
				this.$refs.leftMenu.updateActiveName();
			});
		},
		handleRouterChange(fullPath) {
			const _this = this;
			let tab = this.tabs.find((item, index) => {
				let res = item.router === fullPath;
				if (res) {
					_this.goTab(index);
				}
				return res;
			});
			let parents = [];
			let menu = false;
			(function scanle(arr, parent) {
				let res = false;
				if (arr instanceof Array) {
					res = arr.find(item => {
						let same = item.router === fullPath;
						if (same) {
							menu = item;
							return same;
						} else {
							parents.push(item);
							let find = !!scanle(item.children, item);
							if (!find) {
								parents.pop();
							}
							return find;
						}
					});
				}
				return res;
			})(this.menus);
			if (!tab && menu) {
				this.addTab(menu.name, menu.router);
			}
			this.goMenu(parents, menu);
		}
	},
	watch: {
		$route(to, from) {
			this.handleRouterChange(to.fullPath);
		}
	}
};
</script>
<style lang="scss" scoped>
.layout {
	border: 1px solid #d7dde4;
	background: #f5f7f9;
	position: relative;
	border-radius: 4px;
	overflow: hidden;
}
.layout-logo {
	font-size: 24px;
	padding: 0 10px;
	height: 50px;
	line-height: 50px;
	color: white;
	background: #5b6270;
	border-radius: 3px;
	float: left;
	position: relative;
	top: 5px;
	left: 5px;
	& > img {
		margin: 10px;
		width: 30px;
		height: 30px;
		float: left;
	}
}
.layout-nav {
	width: 420px;
	margin-right: 20px;
	float: right;
	display: flex;
	justify-content: flex-end;
}
// 覆盖框架样式
.ivu-layout {
	.ivu-layout-header {
		padding: 0;
	}
	/deep/ .ivu-tabs-card {
		height: 100%;
	}
	/deep/ .ivu-tabs-tabpane {
		height: 96%;
	}
	/deep/ .ivu-tabs-bar {
		margin: 0 !important;
	}
	/deep/ .ivu-tabs-content {
		height: 100%;
	}
}
</style>
