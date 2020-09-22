<template>
  <el-main class="chartContent">
    <div class="chart" id="banlanceCount"></div>
  </el-main>
</template>
<script>
import { banlanceCount } from './index.js';
import echarts from 'echarts';
export default {
  data() {
    return {};
  },
  mounted() {
    this.banlanceCountFunc();
  },
  created() {},
  methods: {
    // 设备运行情况
    banlanceCountFunc() {
      //   const loading = this.$loading({
      //     lock: true,//lock的修改符--默认是false
      //     text: 'Loading',//显示在加载图标下方的加载文案
      //     spinner: 'el-icon-loading',//自定义加载图标类名
      //     background: 'rgba(0, 203, 210, 0.25);',//遮罩层颜色
      //     target: document.querySelector('#table')//loadin覆盖的dom元素节点
      // });
      //成功回调函数停止加载
      // loading.close()
      banlanceCount()
        .then(res => {
          // this.loading = false
          console.log(res);
          let myChart = echarts.init(document.getElementById('banlanceCount'));
          const option = {
            color: ['#407FFF', '#35EFEF', '#E24AFF', '#E15D68', '#53F0A8', '#FFC464'],
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
                data: ['本期结存品类数', '本期收入品类数', '本期发出品类数'],
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
                name: '本期品类',
                type: 'pie',
                center: ['40%', '40%'],
                radius: ['0', '65%'],
                // roseType: 'radius',
                data: [
                  { name: '本期结存品类数', value: res.data.currentBalanceItem },
                  { name: '本期收入品类数', value: res.data.currentInItem },
                  { name: '本期发出品类数', value: res.data.currentOutItem }
                ],
                label: {
                  // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  formatter: '{c}'
                }
              }
            ]
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
        })
        .catch(function(error) {
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
