<template>
  <div class="chartContent">
    <div class="chart" id="monthWork"></div>
  </div>
</template>
<script>
// 引入api
import { api } from './index'
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    this.chart()
  },
  created() { },
  methods: {
    // 本月每日工单数
    chart() {
      api.monthOrder(this.page).then(res => {
        if (res.code == 0) {
          let xarr = []
          let yarr = []
          res.data.map(item => {
            xarr.push(item.date)
            yarr.push(item.number)
          })
          let myChart = echarts.init(document.getElementById('monthWork'));
          let option = {
            color: ["#51D7FF"],
            textStyle: {
              color: "white"
            },

            xAxis: {
              name: '(号)',
              type: 'category',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false,
                interval: 0
              },
              // axisLabel: {
              //   interval: 0
              // },
              data: xarr
            },
            yAxis: {
              // show: false,
              name: '(单数)',
              // interval: 100,
              axisLine: {
                lineStyle: {
                  color: 'rgba(63, 255, 234, 0.2)'
                }
              },
              splitLine: {
                // show: false,
                lineStyle: {
                  color: 'rgba(63, 255, 234, 0.2)'
                }
              },
            },
            tooltip: {
              trigger: "axis",
              formatter: '{a}<br/>{b}：{c}'
            },
            grid: {
              left: "5%",
              right: "8%",
              top: "25%",
              bottom: "3%",
              // height: "100%",
              containLabel: true
            },
            series: [{
              name: '工单数',
              data: yarr,
              type: 'line',
              color: 'rgba(44, 171, 244, 1)',
            }]
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
        }
      }).catch((e) => { console.log(e) });

    }
  }
}
</script>
<style lang="less">
.chartContent {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>