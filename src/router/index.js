import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers'

Vue.use(Router);

const router = new Router({
    routes
});

router.beforeEach((to, from, next) => {
    if (from.fullPath === '/headman') {
        if (to.fullPath === '/login') {
            next();
        } else {
            next({ path: '/headman' });
        }
    } else {
        next();
    }
});
export default router;