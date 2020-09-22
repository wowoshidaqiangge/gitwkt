import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './vuex/store';
import ElementUI from 'element-ui';
import formCreate from '@form-create/element-ui';
import VueI18n from 'vue-i18n';
import VCharts from 'v-charts'
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/main.css';
import './components/common/directives';

// import highcharts from 'highcharts';
// import VueHighCharts from 'vue-highcharts';
// import highcharts3d from 'highcharts/highcharts-3d';
// Vue.use(VueHighCharts);
// highcharts3d(highcharts);

import scroll from 'vue-seamless-scroll';
Vue.use(scroll);
Vue.use(VCharts)
// import 'jquery-table2excel'
import 'babel-polyfill';
import '@/components/common/otherRender.js';
import '@/components/common/vue-echarts.js';
import '@/components/common/table2excel.js';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(formCreate);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    const role = sessionStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
        // document.title = '臻航生产管理系统';
    }  else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert(
                'vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看',
                '浏览器不兼容通知', {
                    confirmButtonText: '确定'
                }
            );
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');