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
          for (let i of res.data) {
            if (!i.yield) {
              i.yield = 0;
            }
          }
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
              trigger: 'axis',
              // formatter: '{b}<br/>产量：{c}'
              formatter: function(params) {
                console.log(params); // 这里是数组

                let showVal = params[0].name;
                for (let i = 0, l = params.length; i < l; i++) {
                  showVal = `${showVal}<br/>${params[i].marker}当日产量 : ${params[i].value}`;
                }
                return showVal;
              }
            },
            grid: {
              left: '7%',
              right: '7%',
              top: '10%',
              bottom: '0%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: 'rgba(79,115,153,0.3)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(79,115,153,0.3)'
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
                  color: 'rgba(79,115,153,0.3)'
                }
              },
              splitLine: {
                // show: false,
                lineStyle: {
                  color: 'rgba(79,115,153,0.3)'
                }
              }
              // minInterval: 1
            },
            series: [
              {
                name: '一周产量趋势',
                data: yarr,
                type: 'line',
                smooth: true,
                symbolSize: 6,
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
