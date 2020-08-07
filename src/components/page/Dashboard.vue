<template>
    <div class="bj" @click="gotroute">
       <p>我是首页 —— 大强哥</p>
       <!-- <i class="el-icon-lx-recharge"></i> -->
    </div>
</template>

<script>

// import bu from 'assets/img/1001417.jpg';
export default {
    name: 'dashboard',
    data() {
        return {
            name: sessionStorage.getItem('ms_username'),
        }
    },
    components: {
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
  
    methods: {
      gotroute(){
        //   this.$router.push({ path:'/table'})
      }
    }
};
</script>


<style lang='less'>
.bj{
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/1001417.jpg') no-repeat;
    background-size: 100%;
    p{
      text-align: center;
      font-size: 25px;
      line-height: 100px;
      color: #fff;
    }
}
</style>
