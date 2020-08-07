import Vue from 'vue';
import Vuex from 'vuex';
import { login } from '@/api/index';
import { Message } from 'element-ui';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userId: '',
        screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        newAddRoutes: []
    },
    mutations: {
        setUserId(state, id) {
            state.userId = id;
        },
        changeScreenHeight(state, val) {
            state.screenHeight = val;
        },
        setnewAddRoutes(state, val) {
            state.newAddRoutes = val;
        }
    },
    actions: {
        // 登录
        handleLogin({ commit }, { username, password, icCard }) {
            return new Promise((resolve, reject) => {
                login({ username, password, icCard })
                    .then(res => {
                        if (res.code === '0') {
                            const data = res.data;
                            let arr = [];
                            sessionStorage.setItem('userName', JSON.stringify(data.name));
                            sessionStorage.setItem('userId', data.id);
                            sessionStorage.setItem('roleId', data.roleId);
                            sessionStorage.setItem('deptId', data.deptId);
                            if (data.icCard) {
                                sessionStorage.setItem('icCard', data.icCard);
                            }
                            commit('setUserId', data.id);
                            data.userMenu.map(item => {
                                arr.push(item.indexUpper);
                            });
                            sessionStorage.setItem('buttonpremissions', JSON.stringify(arr));
                            resolve(data);
                        } else {
                            Message.error(res.msg);
                        }
                        commit('setUserId', data.id);
                        data.userMenu.map(item => {
                            arr.push(item.indexUpper);
                        });
                        sessionStorage.setItem('buttonpremissions', JSON.stringify(arr));
                        resolve(data);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
    },
    modules: {}
});

export default store;