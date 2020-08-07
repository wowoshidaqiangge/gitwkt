<template>
  <div class="chartContent" v-loading="loading">
    <div class="chart" id="planAchieveRate"></div>
  </div>
</template>
<script>
import ElementUI from 'element-ui';
import { api } from '@/api/index1';
// 引入Charts
import Charts from '@jiaminghi/charts';
export default {
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    this.planAchieveRateFunc()
  },
  created() { },
  methods: {
    // 设备运行情况
    planAchieveRateFunc() {
      api.planAchieveRate()
        .then(response => {
          // console.log(response);
          let rate = response.data.finishRate.replace("%", "");
          // console.log(rate)
          let myChart = new Charts(document.getElementById('planAchieveRate'));
          const option = {
            grid: {
              containLabel: true
            },
            series: [
              {
                type: 'gauge',
                center: ['50%', '45%'],
                radius: '65%',
                startAngle: -Math.PI / 2,
                endAngle: Math.PI * 1.5,
                arcLineWidth: 15,
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
          myChart.setOption(option, (window.onresize = myChart.resize));
          // myChart.prototype.setOption = function(option,animationEnd = false);
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