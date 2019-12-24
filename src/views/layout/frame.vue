<template>
	<div class="main-frame">
		<div class="theme" :class="theme">
			<header>
				<aside>
					<img src="/favicon.ico" alt="LOGO" class="logo" />
					<span>时尚家居日杂</span>
				</aside>
				<section class="main-content">
					<el-menu :default-active="currentMenuCode" router mode="horizontal" @select="handleMenuSelect">
						<template v-for="(parent, i) in visibleMenus">
							<el-menu-item v-if="!parent.children || parent.children.length === 0" :index="parent.code" :route="parent.router" :key="i">
								<el-icon :class="parent.icon"></el-icon>
								<span>{{ parent.title }}</span></el-menu-item
							>
							<el-submenu v-else :index="parent.code" :key="i">
								<template slot="title">
									<el-icon :class="parent.icon"></el-icon>
									<span>{{ parent.title }}</span>
									<span v-if="currentMenuId === parent.id">&nbsp;-&nbsp;{{ currentMenu.title }}</span>
								</template>
								<el-menu-item v-for="(child, j) in parent.children" :key="j" :index="child.code" :route="child.router"
									><el-icon :class="child.icon"></el-icon> <span>{{ child.title }}</span></el-menu-item
								>
							</el-submenu>
						</template>
					</el-menu>
				</section>
				<section>
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
				</section>
			</header>
			<section>
				<section>
					<el-scrollbar>
						<keep-alive>
							<router-view></router-view>
						</keep-alive>
					</el-scrollbar>
				</section>
				<footer>
					<ul class="tabs">
						<li
							:class="{ actived: item.hover || item.active }"
							v-for="(item, index) in tabs"
							:key="index"
							@mouseenter="item.hover = true"
							@mouseleave="item.hover = false"
							@click="handleMenuSelect(item.key)"
						>
							<router-link :to="item.route">
								<el-icon :class="item.icon"></el-icon>
								<span>{{ item.title }}</span>
							</router-link>
							<el-button v-if="!item.fixed && (item.hover || item.active)" circle type="danger" icon="el-icon-close" @click.stop="handleDelTab(item.key)"></el-button>
						</li>
					</ul>
					<el-select v-model="theme" class="theme-select">
						<el-option label="浅色" value="theme-light"></el-option>
						<el-option label="深色" value="theme-dark"></el-option>
					</el-select>
				</footer>
			</section>
		</div>
	</div>
</template>

<script>
import TreeUtils from '@/utils/TreeUtils';
export default {
	name: 'MainFrame',
	data() {
		return {
			theme: 'theme-dark',
			isFullScreen: false,
			notifyCount: 0,
			loading: true,
			currentMenuCode: 'Home',
			currentOpenCode: null,
			menus: [],
			menuCodeMap: new Map(),
			menuRouterMap: new Map(),
			tabs: [],
			user: { username: 'admin' }
		};
	},
	computed: {
		visibleMenus() {
			function filter(arr) {
				let res = [];
				if (arr instanceof Array) {
					res = arr
						.filter(item => item.display)
						.sort((prev, next) => prev.sort - next.sort)
						.map(item => {
							return { ...item, children: filter(item.children) };
						});
				}
				return res;
			}
			return filter(this.menus);
		},
		currentMenu() {
			return this.menuCodeMap.get(this.currentMenuCode);
		}
	},
	created() {
		const _this = this;
		this.loading = true;
		this.menus = JSON.parse(this.$store.session('menus'));
		TreeUtils.Filter(this.menus, item => {
			_this.menuCodeMap.set(item.code, item);
			_this.menuRouterMap.set(item.router, item);
		});
		this.tabs = JSON.parse(this.$store.session('tabs'));
		this.handleRouteChange(this.$router.history.current.fullPath);
		this.loading = false;
	},
	beforeRouteUpdate(to, from, next) {
		this.handleRouteChange(to.fullPath);
		next();
	},
	methods: {
		handleExitFullScreen() {},
		handleFullScreen() {},
		handleShowRepwd() {},
		handleLogout() {
			this.$store.logout();
		},
		handleNotify() {},
		handleRouteChange(fullPath) {
			const back = fullPath;
			fullPath = fullPath.split('?')[0];
			let menu = this.menuRouterMap.get(fullPath);
			while (!menu) {
				let arr = fullPath.split('/');
				arr.pop();
				fullPath = arr.join('/');
				menu = this.menuRouterMap.get(fullPath);
			}
			if (menu) {
				this.handleMenuSelect(menu.code);
				this.$store.debug && console.info('[route] matched menu ' + menu.code);
			} else {
				console.warn('no menu matched for router ' + back);
			}
		},
		handleMenuSelect(key) {
			this.currentMenuCode = key;
			let menu = this.menuCodeMap.get(key);
			this.currentMenuId = menu.parentId;
			this.handleAddTab({
				key: menu.code,
				title: menu.title,
				route: menu.router,
				active: true,
				fixed: menu.code === 'Home',
				hover: false
			});
			document.title = '时尚家居日杂 - ' + menu.title;
		},
		handleAddTab(tab) {
			let temp = this.tabs.find(item => item.key === tab.key);
			if (temp || tab.active) {
				this.tabs.forEach(item => (item.active = false));
			}
			if (temp) {
				temp.active = true;
			} else {
				let invoke = tab.fixed ? this.tabs.unshift : this.tabs.push;
				invoke.call(this.tabs, tab);
			}
			this.$store.session('tabs', this.tabs);
		},
		handleDelTab(key) {
			let index = this.tabs.findIndex(item => item.key === key);
			this.tabs.splice(index, 1);
			if (!this.tabs.find(item => item.active)) {
				let tab = this.tabs[this.tabs.length - 1];
				this.handleMenuSelect(tab.key);
				this.$router.push(tab.route);
			}
			this.$store.session('tabs', this.tabs);
		}
	}
};
</script>

<style lang="scss" scoped>
@import './themes/theme';
.main-frame {
	width: 100%;
	height: 100%;
	font-family: 'Consolas';
	@include themify() {
		/deep/ * {
			transition: all 0.3s;
		}
		/deep/ *:not([class^='el-']) {
			&:not([class^='el-']) & {
				color: t('fc-base');
			}
		}
		/deep/ [class^='el-icon-'] {
			color: t('fc-base');
		}
		@include flex(column);
		> header {
			background: t('header-bgc');
			height: t('header-height');
			width: 100%;
			padding: t('header-padding');
			@include flex($row: space-between);
			> aside {
				height: 100%;
				width: t('aside-width');
				@include flex($row: space-around);
				.logo {
					height: 80%;
				}
				span {
					color: t('fc-power');
					font-family: '楷体';
					font-weight: bolder;
					font-size: 1.5rem;
				}
			}
			> section {
				height: 100%;
				@include flex($row: space-around);
				.user-photo {
					height: 100%;
					border-radius: 50%;
				}
				.user-name {
					color: t('fc-base');
				}
				.el-menu {
					width: 100%;
					height: 100%;
					margin: 0 2%;
					background: t('menu-bgc-normal');
					border: none;
					.el-menu-item,
					.el-submenu {
						color: t('fc-base');
						height: 100%;
						line-height: unset;
						@include flex(column, center);
						/deep/ .el-submenu__title {
							height: 100%;
							border: none;
							background: t('menu-bgc-hover');
							color: t('fc-base');
							@include flex(row, center);
						}
						&:hover {
							background: t('menu-bgc-hover');
						}
						&.is-active {
							* {
								color: t('fc-reverse');
							}
							background: t('menu-bgc-active');
						}
					}
				}
			}
		}
		> section {
			width: 100%;
			height: 100%;
			overflow: hidden;
			@include flex-main;
			@include flex(column);
			> section {
				width: 100%;
				background: t('content-bgc');
				overflow: hidden;
				@include flex-main;
				.el-scrollbar {
					width: 100%;
					height: 100%;
					/deep/ .el-scrollbar__wrap {
						overflow-x: hidden;
						.el-scrollbar__view {
							width: 100%;
							height: 100%;
							> .container {
								width: calc(100% - 40px);
								height: calc(100% - 20px);
								padding: 10px 20px;
								.left {
									width: 200px;
									flex-shrink: 0;
									background: t('menu-bgc-hover');
									margin-right: 20px;
									.el-tree-node {
										color: t('fc-base');
									}
								}
								.right {
									width: 100%;
									flex-shrink: 100;
									.oparetion {
										margin-bottom: 10px;
									}
									.search {
										.el-form {
											.el-form-item {
												margin-bottom: 10px;
												/deep/ .el-form-item__label {
													color: t('fc-base');
												}
											}
										}
									}
									.content {
										flex-grow: 1;
										.el-table {
											height: 100%;
											background: none;
											&::before {
												height: 0;
											}
											/deep/ tr {
												background: t('table-bgc');
												th,
												td {
													color: t('fc-base');
													background: t('table-bgc');
													border-color: t('table-bc');
												}
											}
										}
									}
									.pagination {
										border: none;
										/deep/ .el-pagination__total {
											color: t('fc-base');
										}
									}
								}
							}
						}
					}
				}
			}
			> footer {
				height: t('footer-height');
				width: t('footer-width');
				background: t('footer-bgc');
				padding: t('footer-padding');
				@include flex();
				.tabs {
					width: calc(100% - 6em);
					height: 100%;
					@include flex();
					li {
						height: 100%;
						margin: 0 5px;
						background: t('menu-bgc-hover');
						transition: all 0.3s;
						color: t('fc-base');
						@include flex();
						&.actived {
							color: t('fc-reverse');
						}
						a {
							padding: 0 1em;
						}
						.el-button {
							padding: 3px;
							margin-right: 5px;
						}
					}
				}
				.theme-select {
					width: 5em;
					right: 1%;
					position: absolute;
				}
			}
		}
	}
}
</style>
