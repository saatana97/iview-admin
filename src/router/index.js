import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/view/login/index';
import Main from '@/view/main/index';
import Home from '@/view/home/index';
import User from '@/view/user/index';
import Menu from '@/view/menu/index';
import Role from '@/view/role/index';
import UserInfo from '@/view/userinfo/index';
import Concact from '@/view/concact/index';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/',
          alias: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/sys/user',
          name: 'User',
          component: User
        },
        {
          path: '/sys/menu',
          name: 'Menu',
          component: Menu
        },
        {
          path: '/sys/role',
          name: 'Role',
          component: Role
        },
        {
          path: '/owner/userinfo',
          name: 'UserInfo',
          component: UserInfo
        },
        {
          path: '/owner/concact',
          name: 'Concat',
          component: Concact
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  let token = sessionStorage['token'] || localStorage['token'] || false;
  if (token) {
    if (to.fullPath === '/login') {
      next('/home');
    } else {
      next();
    }
  } else {
    if (['/login'].indexOf(to.fullPath) === -1) {
      sessionStorage.returnRouter = to.fullPath;
      next('/login');
    } else {
      next();
    }
  }
  console.info('router:\t' + from.fullPath + '\t=>\t' + to.fullPath);
});
export default router;
