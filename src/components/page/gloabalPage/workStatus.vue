<template>
  <el-main class="chartContent" >
    <div class="chart" id="workStatus"></div>
  </el-main>
</template>
<script>
import ElementUI from 'element-ui';
import { api } from '@/api/index1';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
    
    }
  },
  mounted() {
    this.workStatusFunc()
  },
  created() { },
  methods: {
    // 设备运行情况
    workStatusFunc() {
    //   const loading = this.$loading({
    //     lock: true,//lock的修改符--默认是false
    //     text: 'Loading',//显示在加载图标下方的加载文案
    //     spinner: 'el-icon-loading',//自定义加载图标类名
    //     background: 'rgba(0, 203, 210, 0.25);',//遮罩层颜色
    //     target: document.querySelector('#table')//loadin覆盖的dom元素节点
    // });
    //成功回调函数停止加载
    // loading.close()
   
      api.workStatus()
        .then(response => {
          // this.loading = false
          // console.log(response);
          let myChart = echarts.init(document.getElementById('workStatus'));
          const option = {
            color: ['#00CCCD', '#407FFF', '#53F0A8', '#E15D68', '#F29961'],
            grid: {
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
              // {
              //   name: '工单状态',
              //   type: 'pie',
              //   center: ['50%', '50%'],
              //   radius: '66%',
              //   data: [
              //     { name: '待派单', value: response.data.waitAssignCount },
              //     { name: '待领单', value: response.data.waitClaimCount },
              //     { name: '生产中', value: response.data.produceingCount },
              //     { name: '已完成', value: response.data.produceFinishCount },
              //     { name: '已锁定', value: response.data.produceLockCount },
              //   ],
              //   itemStyle : {
              //     normal : {
              //       label : {
              //       position : 'inner',
              //       // formatter : function (params){return (params.percent - 0) + '%';},
              //       formatter : '{d}%',
              //         textStyle: {
              //           color: 'white'
              //         }
              //       },
              //       labelLine : {
              //         show : false
              //       }
              //     }
              //   },
              // },
              {
                name: '工单状态',
                type: 'pie',
                center: ['50%', '50%'],
                radius: '66%',
                data: [
                  { name: '待派单', value: response.data.waitAssignCount },
                  { name: '待领单', value: response.data.waitClaimCount },
                  { name: '生产中', value: response.data.produceingCount },
                  { name: '已完成', value: response.data.produceFinishCount },
                  { name: '已锁定', value: response.data.produceLockCount },
                ]
              }
            ]
          }
          myChart.setOption(option, (window.onresize = myChart.resize));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>
<style lang="less" scoped>
.chartContent {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>