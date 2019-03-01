import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/view/login/index';
import Main from '@/view/main/index';
import Home from '@/view/home/index';
import UserInfo from '@/view/owner/userinfo/index';
import Concact from '@/view/owner/concact/index';
import User from '@/view/sys/user/index';
import Menu from '@/view/sys/menu/index';
import Role from '@/view/sys/role/index';
import Dict from '@/view/sys/dict/index';
import Org from '@/view/sys/org/index';

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
          path: '/sys/dict',
          name: 'Dict',
          component: Dict
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
          path: '/sys/org',
          name: 'Org',
          component: Org
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
      sessionStorage.returnRouter = from.fullPath;
      next();
    }
  }
  console.info('router:\t' + from.fullPath + '\t=>\t' + to.fullPath);
});
export default router;
