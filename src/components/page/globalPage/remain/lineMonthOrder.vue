<template>
  <div class="chartContent">
    <div class="chart" id="monthWork"></div>
  </div>
</template>
<script>
// 引入api
import { monthOrder } from './index.js';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.chart();
  },
  created() {},
  methods: {
    // 本月每日工单数
    chart() {
      monthOrder(this.page)
        .then(res => {
          if (res.code == 0) {
            let xarr = [];
            let yarr = [];
            res.data.map(item => {
              xarr.push(item.showDate);
              yarr.push(item.number);
            });
            let myChart = echarts.init(document.getElementById('monthWork'));
            let option = {
              color: ['#51D7FF'],
              textStyle: {
                color: 'white'
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
                name: '(工单数)',
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
                }
              },
              tooltip: {
                trigger: 'axis',
                formatter: '{a}<br/>{b}：{c}'
              },
              grid: {
                left: '4%',
                right: '10%',
                top: '23%',
                bottom: '1%',
                containLabel: true
              },
              series: [
                {
                  name: '工单数',
                  data: yarr,
                  type: 'line',
                  smooth: true,
                  symbolSize: 4,
                  areaStyle: {
                    color: {
                      type: 'line',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'RGBA(57, 255, 255, 0.8)' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'RGBA(57, 255, 255, 0.1)' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  },
                  itemStyle: {
                    normal: {
                      lineStyle: {
                        color: 'RGBA(57, 255, 255, 1)'
                      }
                    }
                  }
                }
              ]
            };
            myChart.setOption(option, (window.onresize = myChart.resize));
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style lang="less">
.chartContent {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
