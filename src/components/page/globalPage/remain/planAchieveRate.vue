<template>
  <div class="chartContent" v-loading="loading">
    <div class="chart" id="planAchieveRate" :option="option"></div>
  </div>
</template>
<script>
import { api } from '@/api/index1';
// 引入Charts
import Charts from '@jiaminghi/charts';
// 引入3D图表
import HighCharts from 'highcharts';
export default {
  data() {
    return {
      loading: false,
      option: {}
    };
  },
  mounted() {
    this.planAchieveRateFunc();
  },
  created() {},
  methods: {
    // 设备运行情况
    planAchieveRateFunc() {
      api
        .planAchieveRate()
        .then((response) => {
          // console.log(response);
          let rate = parseInt(response.data.finishRate.replace('%', ''));
          let arr = [
            { name: '已达成', y: rate }, //模块名和所占比，也可以{name: '测试1',y: 12}
            { name: '未达成', y: 100 - rate }
          ];
          // console.log(arr)
          const option = {
            credits: {
              enabled: false //去掉版权信息，就是图片左下角的网址信息
            },
            colors: ['#FD9E02', '#00CACF'],
            chart: {
              backgroundColor: 'rgba(137, 87, 161, 0)',
              type: 'pie', //饼图
              options3d: {
                enabled: true, //使用3d功能
                alpha: 60, //延y轴向内的倾斜角度
                beta: 0
              }
            },
            title: {
              text: '' //图表的标题文字
            },
            subtitle: {
              text: '' //副标题文字
            },
            tooltip: {
              headerFormat: '{series.name}<br>',
              pointFormat: '{point.name}: {point.y}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true, //每个扇块能否选中
                cursor: 'pointer', //鼠标指针
                depth: 45, //饼图的厚度
                dataLabels: {
                  enabled: true, //是否显示饼图的线形tip
                  inside: true,
                  formatter: function () {
                    return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
                  },
                  style: {
                    color: '#eee',
                    fontSize: '11.5px', //设置字体大小
                    fontFamily: 'PingFang SC',
                    textOutline: 'none' // 去除字体外白色描边
                  },
                  distance: 20
                }

                // showInLegend: true
              }
            },
            series: [
              {
                type: 'pie',
                name: '计划概况', //统一的前置词,非必须
                data: arr
              }
            ]
          };
          var chart = HighCharts.chart('planAchieveRate', option);
          // chart.series[0].setData(arr)
          // chart.series[0].userOptions.center[1] += -20
          // console.log(rate)
          /*let myChart = new Charts(document.getElementById('planAchieveRate'));
          const option = {
            grid: {
              containLabel: true
            },
            series: [
              {
                type: 'gauge',
                center: ['50%', '50%'],
                radius: '65%',
                startAngle: -Math.PI / 2,
                endAngle: Math.PI * 1.5,
                arcLineWidth: 18,
                data: [
                  { name: 'itemA', value: rate, gradient: ['#03c2fd', '#1ed3e5', '#2fded6'] }
                ],
                axisLabel: {
                  show: false
                },

                axisTick: {
                  show: false
                },
                pointer: {
                  show: false
                },
                dataItemStyle: {
                  lineCap: 'round'
                },
                details: {
                  show: true,
                  formatter: '{value}%',
                  style: {
                    fill: '#1ed3e5',
                    fontSize: 20
                  }
                }
              }
            ]
          }
          myChart.setOption(option, (window.onresize = myChart.resize));*/
          // myChart.prototype.setOption = function(option,animationEnd = false);
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
