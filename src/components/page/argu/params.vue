<template>
  <div>
   <h3>商品编号 {{ $route.meta.params.id }}</h3>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'params',
  methods: {
    ...mapMutations([
    //   'closeTag'
    ]),
    close () {
      /**
       * 如果是调用closeTag方法，普通的页面传入的对象参数只需要写name字段即可
       * 如果是动态路由和带参路由，需要传入query或params字段，用来区别关闭的是参数为多少的页面
       */
    //   this.closeTag({
    //     name: 'params',
    //     params: {
    //       id: this.$route.params.id
    //     }
    //   })
    }
  }
}
</script>

<style>

</style>