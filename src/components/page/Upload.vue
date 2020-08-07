<template>
    <div class="charts">
      <el-button type="primary" @click="jump">添加路由</el-button>
  </div>
</template>

<script>
   import Router from 'vue-router';
   import {insertRouter} from '@/components/common/argu/addroute'
    export default {
        name: 'upload',
        data() {
            return {
               option:{},

            }
        },
        components: {
            
        },
        mounted(){
            this.gettime()
        },
        methods:{
            gettime(){
                let  arr = [0,100,200,300,400,500,600,700,800,900,1000,1100,1200]
                let  arr1 = [{time:0,value:1},{time:156,value:2},{time:357,value:1},{time:359,value:3},{time:789,value:1},{time:1200,value:2},]
                let arr2 = [...arr]
                let num = 0
                arr1.map((item)=>{
                    arr2.push(item.time)
                })
                let arr3 =  Array.from(new Set(arr2.sort(this.sortNumber)))
                console.log(arr3)
                
                arr3.map((item,index)=>{
                   let obj = arr1.filter(v=>v.time ===item)
                   if(obj.length>0){
                       num = obj[0].value
                       arr3[index] = obj[0]
                   }else{
                       arr3[index]= {
                           time:item,
                           value:num
                       }
                   }
                })
                 console.log(arr3)
            },
             sortNumber(a,b){
                    return a-b
             },
                // 用于手动配置动态路由
                jump() {
                    const o = parseInt(Math.random() * 10)
                    const name = "listing" + o;
                    /**
                     * @param { 当前实例 } vm
                     * @param { 当前动态路由模板名字 } component
                     * @param { 临时缓存组件地址 } com
                     * @param { 路由name } name 具体看业务是传订单号，还是name+时间戳 要求是不重复
                     * @param { 具体传参数 } params
                     * @param { 查询参数 } query
                     */
                    var obj = {
                        vm: this,
                        component: "params",
                        com: "@/components/page/argu/params.vue",
                        name: name,
                        params: {
                        id: o
                        },
                        query: {}
                    };
                    insertRouter(obj);
                },
        },
        created(){
          
        }
    }
</script>

<style scoped>
    .charts{
        width: 100%;
        height: 100%;
    }
</style>