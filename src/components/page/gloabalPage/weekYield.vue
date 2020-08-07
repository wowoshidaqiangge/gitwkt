<template>
  <div class="chartContent" v-loading="loading">
    <div class="chart" id="weekYield"></div>
  </div>
</template>
<script>
import ElementUI from 'element-ui';
import { api } from '@/api/index1';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    this.weekYieldFunc()
  },
  created() { },
  methods: {
    // 一周产量趋势
    weekYieldFunc() {
      api.weekYield()
        .then(response => {
          // console.log(response);
          let date = []
          for (var i = 0; i < response.data.length; i++) {
            let a = response.data[i].date.split("-")
            let b = a.slice(1)
            let c = b.join('-')
            date.push(c)
          }
          // console.log(date)
          let xarr = []
          let yarr = []
          response.data.map(item => {
            xarr.push(item.date)
            yarr.push(item.yield)
          })
          let myChart = echarts.init(document.getElementById('weekYield'));
          let option = {
            color: ['#ADE7FF'],
            textStyle: {
              color: "white"
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            grid: {
              left: "10%",
              right: "10%",
              // height: "100%",
              top: "10%",
              bottom: "10%",
              containLabel: true
            },
            xAxis: {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#ADE7FF'
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
              data: date
            },
            yAxis: {
              // boundaryGap: false,
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#ADE7FF'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#ADE7FF'
                }
              },
            },
            series: [{
              data: yarr,
              type: 'line',
              smooth: true,
              symbolSize: 6,
              lineStyle: {
                width: 3,
                shadowColor: 'rgba(0,0,0,0.5)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                normal: {
                  label: {
                    backgroundColor: '#ADE7FF',
                    color: '#ADE7FF'
                  },
                  color: '#E4E7FF',
                  borderColor: '#E4E7FF',
                  lineStyle: {
                    color: 'blue'
                  }
                }
              }
            }]
          };
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