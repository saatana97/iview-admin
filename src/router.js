import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/views/layout/404';
import EmptyLayout from '@/views/layout/empty';
Vue.use(Router);
const router = new Router({
	mode: 'history',
	fallback: true,
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/login',
			name: 'Login',
			meta: { white: true },
			component: () => import('@/views/layout/login')
		},
		{
			path: '/',
			redirect: '/home',
			meta: { type: 0 },
			component: () => import('@/views/layout/frame'),
			children: [
				{
					path: 'home',
					name: 'Home',
					component: () => import('@/views/layout/home')
				},
				{
					path: 'product',
					name: 'ProductManager',
					component: () => import('@/views/product'),
					children: [
						{
							path: 'create',
							name: 'CreateProduct',
							component: () => import('@/views/product/form')
						},
						{
							path: 'update',
							name: 'UpdateProduct',
							component: () => import('@/views/product/form')
						}
					]
				},
				{
					path: 'sys',
					name: 'SystemManager',
					component: EmptyLayout,
					children: [
						{
							path: 'file',
							name: 'ResourceManager',
							component: () => import('@/views/system/file/index'),
							children: [
								{
									path: 'create',
									name: 'CreateResource',
									component: () => import('@/views/system/file/form')
								},
								{
									path: 'update',
									name: 'UpdateResource',
									component: () => import('@/views/system/file/form')
								}
							]
						},
						{
							path: 'dict',
							name: 'DictionaryManager',
							component: () => import('@/views/system/dict/index'),
							children: [
								{
									path: 'create',
									name: 'CreateDictionary',
									component: () => import('@/views/system/dict/form')
								},
								{
									path: 'update',
									name: 'UpdateDictionary',
									component: () => import('@/views/system/dict/form')
								}
							]
						},
						{
							path: 'menu',
							name: 'MenuManager',
							component: () => import('@/views/system/menu/index'),
							children: [
								{
									path: 'create',
									name: 'CreateMenu',
									component: () => import('@/views/system/menu/form')
								},
								{
									path: 'update',
									name: 'UpdateMenu',
									component: () => import('@/views/system/menu/form')
								}
							]
						},
						{
							path: 'org',
							name: 'OrgManager',
							component: () => import('@/views/system/org/index'),
							children: [
								{
									path: 'create',
									name: 'CreateOrg',
									component: () => import('@/views/system/org/form')
								},
								{
									path: 'update',
									name: 'UpdateOrg',
									component: () => import('@/views/system/org/form')
								}
							]
						},
						{
							path: 'user',
							name: 'UserManager',
							component: () => import('@/views/system/user/index'),
							children: [
								{
									path: 'create',
									name: 'CreateUser',
									component: () => import('@/views/system/user/form')
								},
								{
									path: 'update',
									name: 'UpdateUser',
									component: () => import('@/views/system/user/form')
								}
							]
						},
						{
							path: 'role',
							name: 'RoleManager',
							component: () => import('@/views/system/role/index'),
							children: [
								{
									path: 'create',
									name: 'CreateRole',
									component: () => import('@/views/system/role/form')
								},
								{
									path: 'update',
									name: 'UpdateRole',
									component: () => import('@/views/system/role/form')
								}
							]
						}
					]
				}
			]
		},
		{
			path: '*',
			alias: '/404',
			name: 'NotFound',
			meta: { white: true },
			component: NotFound
		}
	]
});
import AuthAPI from '@/api/user';
import store from '@/api/store';
router.beforeEach(async (to, from, next) => {
	store.debug && console.info(`[route] ${from.fullPath} => ${to.fullPath}`);
	let token = store.session('token'),
		gotoLogin = false,
		isWhite = to.meta.white === true;
	if (!token && !isWhite) {
		// 如果未登录而且不是白名单页面，跳转登陆页面
		Vue.prototype.$message({
			message: '请登录后再访问其他页面',
			type: 'warning'
		});
		gotoLogin = true;
	} else if (token && !isWhite) {
		// 或者登陆了而且不是白名单页面，校验token获取用户信息
		// let res = await AuthAPI.CheckLogin({ token });
		// if (res.code === 200) {
		// 	store.session('user', JSON.stringify(res.data));
		// } else {
		// 	//   如果登陆失效了，跳转登录页面
		// 	Vue.prototype.$message.error('你的登录信息已失效，请重新登录');
		// 	gotoLogin = true;
		// }
	}
	if (gotoLogin) {
		// 跳转登录页面清空会话信息
		store.clearSession();
		if (!isWhite) {
			//   如果访问的不是白名单页面，缓存返回路由
			store.session('returnRoute', to.fullPath);
		}
		next({
			name: 'Login'
		});
	} else {
		next();
		store.routeRetryTime = 0;
	}
});
// 尝试修复偶尔出现的路由懒加载异常
router.onError(error => {
	Vue.prototype.$message.warning('页面路由出现异常，若刷新无法解决请联系管理员');
	console.warn(error);
});
export default router;
