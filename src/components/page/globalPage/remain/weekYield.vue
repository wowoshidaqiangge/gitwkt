<template>
  <div class="chartContent" v-loading="loading">
    <div class="chart" id="weekYield"></div>
  </div>
</template>
<script>
import { weekYield } from '@/api/globalPage';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.weekYieldFunc();
  },
  created() {},
  methods: {
    // 本周报工产量趋势
    weekYieldFunc() {
      weekYield()
        .then(res => {
          // console.log(res);
          let xarr = [];
          let yarr = [];
          res.data.map(item => {
            xarr.push(item.dateTime);
            yarr.push(item.yield);
          });
          let myChart = echarts.init(document.getElementById('weekYield'));
          let option = {
            color: ['#ADE7FF'],
            textStyle: {
              color: 'white'
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            grid: {
              left: '8%',
              right: '10%',
              // height: "100%",
              top: '10%',
              bottom: '6%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: 'rgba(63, 255, 234, 0.2)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#ADE7FF'
                }
              },
              axisLabel: {
                interval: 0
              },
              data: xarr
            },
            yAxis: {
              // boundaryGap: false,
              type: 'value',
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
              minInterval: 1
            },
            series: [
              {
                data: yarr,
                type: 'line',
                smooth: true,
                symbolSize: 4,
                center: ['50%', '70%'],
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
    height: 90%;
  }
}
</style>
