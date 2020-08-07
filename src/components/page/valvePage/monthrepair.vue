<template>
  <div class="chartContent">
    <div class="chart" id="monthRepair"></div>
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
    // 月巡检维修次数
    chart() {
      api.repair().then(res => {
        if (res.code == 0) {
          let xarr = []
          let yarr1 = []
          let yarr2 = []
          if (res)
            res.data.map((item, index) => {
              xarr.push(`${item.month}月`)
              yarr1.push(item.inspectionTotal)
              yarr2.push(item.repairTotal)
            })

          let myChart = echarts.init(document.getElementById('monthRepair'));
          let option = {
            color: ["#51D7FF"],
            textStyle: {
              color: "white"
            },
            legend: [
              {
                show: true,
                orient: 'horizontal',
                x: "50%",
                y: "5%",
                textStyle: {
                  color: "#fff"
                },
                data: ["维修次数"],
              },
              {
                show: true,
                orient: 'horizontal',
                x: "75%",
                y: "5%",
                textStyle: {
                  color: "#fff"
                },
                data: ["巡检次数"],
              },
            ],
            xAxis: {
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
              data: xarr,
            },
            yAxis: {
              // show: false,
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
              // formatter: '{a}<br/>{b}：{c}'
            },
            grid: {
              left: "5%",
              right: "5%",
              top: "25%",
              bottom: "4%",
              // height: "100%",
              containLabel: true
            },
            series: [{
              name: '维修次数',
              data: yarr1,
              type: 'line',
              color: 'rgba(255, 131, 28, 1)',
              symbol: 'circle', //折线点设置为实心点
              symbolSize: 8, //折线点的大小
              itemStyle: {
                normal: {
                  color: "rgba(241, 145, 73, 1)", //折线点的颜色
                }
              },
            },
            {
              name: '巡检次数',
              data: yarr2,
              type: 'line',
              color: 'rgba(44, 171, 244, 1)',
              symbol: 'circle', //折线点设置为实心点
              symbolSize: 8, //折线点的大小
              itemStyle: {
                normal: {
                  color: "rgba(0, 183, 238, 1)", //折线点的颜色
                }
              },
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