import Vue from 'vue';
import App from './App.vue';
import router from './router';

// 引用ElementUI框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'mini' });
// 引用自定义组件
import Window from '@/components/Window';
import CopyButton from '@/components/CopyButton';
Vue.component('k-window', Window);
Vue.component('k-copy', CopyButton);
// 引用第三方图标库
import '@/icons/iconfont.css';
// 引入echarts
import echarts from 'echarts';
import 'echarts/theme/macarons.js';
// import 'echarts/theme/shine.js';
Vue.prototype.$echarts = echarts;
// 定义全局变量
import store from '@/api/store';
Vue.prototype.$store = store;
// 引用DateUtils
import DateUtils from 'date-utils';

Vue.config.productionTip = false;

window.app = new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
