<template>
  <el-main class="chartContent">
    <div class="chart" id="banlanceRate"></div>
  </el-main>
</template>
<script>
import { banlanceRate } from './index.js';
import echarts from 'echarts';

export default {
  data() {
    return {};
  },
  mounted() {
    this.banlanceRateFunc();
  },
  created() {},
  methods: {
    // 设备运行情况
    banlanceRateFunc() {
      //   const loading = this.$loading({
      //     lock: true,//lock的修改符--默认是false
      //     text: 'Loading',//显示在加载图标下方的加载文案
      //     spinner: 'el-icon-loading',//自定义加载图标类名
      //     background: 'rgba(0, 203, 210, 0.25);',//遮罩层颜色
      //     target: document.querySelector('#table')//loadin覆盖的dom元素节点
      // });
      //成功回调函数停止加载
      // loading.close()
      banlanceRate()
        .then(res => {
          // this.loading = false
          console.log(res);
          const showRate = res.data.rate.replace('-', '').replace('%', '');
          const realRate = res.data.rate.includes('-') ? `-${showRate}` : showRate;
          let myChart = echarts.init(document.getElementById('banlanceRate'));
          const option = {
            color: ['#2CABF4FF', '#0A436CFF', '#09478D', '#FFC464', , '#E24AFF'],
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
                data: ['本期结存', '上期结存', '同比增长'],
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
                name: '结存同比',
                type: 'pie',
                selectedMode: 'single',
                center: ['40%', '40%'],
                radius: ['0', '60%'],
                // radius: '60%',
                // roseType: 'radius',
                data: [
                  { name: '本期结存', value: res.data.currentPeriodBalance },
                  { name: '上期结存', value: res.data.lastPeriodBalance }
                  // { name: '同比增长', value: res.data.rate }
                ],
                label: {
                  // position: 'inside',
                  position: 'outside',
                  // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  formatter: '{b}：{c}'
                  // normal: {
                  //   color: function (params) {
                  //     const colors = ['#2CABF4FF', '#fff', '#FFC464'];
                  //     console.log(params);
                  //     debugger;
                  //     rutern;
                  //   }
                  // }
                }
              },
              {
                name: '结存同比',
                type: 'pie',
                center: ['40%', '40%'],
                radius: ['64%', '65%'],
                // roseType: 'radius',
                data: [{ name: '同比增长', value: showRate }],

                label: {
                  // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  formatter: `{b}：${realRate * 100}%`
                },
                tooltip: {
                  show: false
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
