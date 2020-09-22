<template>
  <el-main class="chartContent">
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
    return {};
  },
  mounted() {
    this.workStatusFunc();
  },
  created() {},
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

      api
        .workStatus()
        .then((res) => {
          // this.loading = false
          // console.log(res);
          let myChart = echarts.init(document.getElementById('workStatus'));
          const option = {
            color: ['#35EFEF', '#407FFF', '#53F0A8', '#E15D68', '#FFC464'],
            grid: {
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: [
              {
                orient: 'vertical',
                x: '75%',
                y: '25%',
                data: ['待派单', '待领单', '生产中', '已完成', '已锁定'],
                itemWidth: 15,
                // align: 'left',
                // formatter: function (name) {
                //   // var total = 0;
                //   var target;
                //   for (var i = 0; i < res.value.length; i++) {
                //     // total += res.value[i].value;
                //     if (res.value[i].name === name) {
                //       target = res.value[i].rate;
                //     }
                //   }
                //   return ' ' + name + '： ' + target + ' ';
                // },
                textStyle: {
                  color: '#fff'
                }
              }
            ],
            series: [
              {
                name: '工单状态',
                type: 'pie',
                center: ['40%', '50%'],
                // radius: ['30%', '70%'],
                radius: '60%',
                // roseType: 'radius',

                data: [
                  { name: '待派单', value: res.data.waitAssignCount },
                  { name: '待领单', value: res.data.waitClaimCount },
                  { name: '生产中', value: res.data.produceingCount },
                  { name: '已完成', value: res.data.produceFinishCount },
                  { name: '已锁定', value: res.data.produceLockCount }
                ]
              }
            ]
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
