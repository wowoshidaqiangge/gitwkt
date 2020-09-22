<template>
  <div class="chartContent">
    <!-- <div class="chartText">
      <div
        class="textBox"
        v-for="(item, index) in resData"
        :key="index"
        v-show="item.money || item.money == 0"
      >
        {{ item.money }}元
      </div>
    </div> -->
    <div class="chart" id="staffYield"></div>
  </div>
</template>
<script>
import { staffYield } from '@/api/globalPage';
import echarts from 'echarts';
export default {
  data() {
    return {
      resData: []
    };
  },
  mounted() {
    this.staffYieldFunc(); // 前7名业绩员
  },
  created() {},
  computed: {},
  methods: {
    staffYieldFunc(number) {
      staffYield({ number })
        .then(res => {
          // console.log(res);
          this.resData = res.data;
          let xarr = [];
          let yarr = [];
          res.data.map(item => {
            xarr.push(item.assignUser);
            yarr.push(item.yield);
          });
          let myChart = echarts.init(document.getElementById('staffYield'));
          let option = {
            color: ['#82F5C6'],
            textStyle: {
              color: '#fff'
            },
            tooltip: {
              trigger: 'axis',
              formatter: '员工产量排行<br/>{b}：{c}',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            grid: {
              left: '6%',
              right: '6%',
              top: '7%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: xarr,
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(79,115,153,0.3)'
                }
              },
              axisTick: {
                show: false,
                interval: 0
              },
              axisLabel: {
                show: true,
                interval: 0
              },
              axisPointer: {
                type: 'shadow'
              }
            },
            yAxis: {
              show: true,
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(79,115,153,0.3)'
                }
              }
              // max: 100 // Y轴最大值
            },

            series: [
              {
                type: 'bar',
                data: yarr,
                barWidth: '25%',
                showBackground: true,
                backgroundStyle: {
                  color: 'rgba(0,0,0,0.05)'
                },
                itemStyle: {
                  normal: {
                    label: {
                      show: false, //开启显示
                      position: 'top', //在上方显示
                      textStyle: {
                        //数值样式
                        color: '#ffffffee',
                        fontSize: 14
                      }
                    }
                  }
                  // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  //   { offset: 0, color: '#83bff6' },
                  //   { offset: 0.5, color: '#188df0' },
                  //   { offset: 1, color: '#188df0' }
                  // ])
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
  display: flex;
  flex-direction: column;
  .chartText {
    margin: auto;
    align-items: center;
    width: 79%;
    height: 15%;
    color: white;
    font-size: 1.5vh;
    display: flex;
    flex-direction: row;
    .textBox {
      margin: 2% 0 0;
      width: 14.28%;
      height: 20px;
      // text-align: center;
      line-height: 20px;
    }
  }
  .chart {
    flex: 1;
    width: 100%;
  }
}
</style>
