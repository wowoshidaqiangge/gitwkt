<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import {refreshRouterSync} from "@/components/common/argu/util";
import router from './router';
export default {
  name: 'App',

  data () {
    return {
    
    }
  },
 beforeCreate() {
   // 需要动态打开新的路由时开启
    // refreshRouterSync(this);
    // router.addRoutes([{ path: '*', redirect: '/404'}])
  },
  watch: {
    /**
    * 侦听页面可视高度的变化,将底部tabbar display:block
    */
  
  },

  methods: {
    ...mapMutations(['changeScreenHeight']),
   
  },

  mounted () {
    
    window.onresize = () => {
      this.changeScreenHeight(document.documentElement.clientHeight)
    }
   
  }
}
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>