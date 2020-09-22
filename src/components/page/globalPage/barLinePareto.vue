<template>
  <div class="chartContent">
    <div class="chart" id="barLinePareto"></div>
  </div>
</template>
<script>
import { producePareto } from '@/api/globalPage';
import echarts from 'echarts';
export default {
  data() {
    return {};
  },
  mounted() {
    this.barLineParetoFunc();
  },
  created() {},
  computed: {},
  methods: {
    barLineParetoFunc() {
      producePareto()
        .then(res => {
          res = res.data;
          console.log('右3', res);
          let xarr = [],
            yarr = [],
            yarr2 = [];
          let sum = 0;
          let rate = 0;

          for (let item of res) {
            item.kindCount = parseInt(item.kindCount);
            sum += item.kindCount;
            xarr.push(item.kindName);
            yarr.push(item.kindCount);
          }

          res.map((item, index) => {
            let num = (item.kindCount / sum).toFixed(4) * 100;
            rate += num;
            item.rate = rate.toFixed(2);
            yarr2.push(item.rate);
          });
          yarr2[yarr2.length - 1] = 100;
          console.log(xarr, yarr, yarr2);
          let myChart = echarts.init(document.getElementById('barLinePareto'));
          let option = {
            color: ['#82F5C6', '#D4B31B'],
            textStyle: {
              color: '#fff'
            },
            // tooltip: {
            //   trigger: 'axis',
            //   formatter: '业绩排行<br/>{b}：{c} 元'
            // },
            // grid: {
            //   left: '2%',
            //   right: '10%',
            //   top: '5%',
            //   bottom: '3%',
            //   containLabel: true
            // },
            tooltip: {
              trigger: 'axis',
              // formatter: '成品生产情况<br/>{b}：{c} 元',
              formatter: function(params) {
                console.log(params); // 这里是数组

                let showVal = params[0].name;
                for (let i = 0, l = params.length; i < l; i++) {
                  if (i == l - 1) {
                    showVal = `${showVal}<br/>${params[i].marker}${params[i].seriesName} : ${params[i].value}%`;
                  } else {
                    showVal = `${showVal}<br/>${params[i].marker}${params[i].seriesName} : ${params[i].value}`;
                  }
                }
                return showVal;
              },
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              show: false,
              // data: ['数量', '累计占比'],
              formatter: ' {name}',
              right: '10%',
              textStyle: {
                color: '#50FEC1'
              }
            },
            grid: {
              left: '4%',
              right: '0%',
              top: '15%',
              bottom: '7%',
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
                interval: 0,
                formatter: '{value}'
              },
              axisPointer: {
                type: 'shadow'
              }
            },
            yAxis: [
              {
                type: 'value',
                // name: '成品数量',
                // min: 0,
                // max: 250,
                // interval: 40,
                scale: true,
                axisLabel: {
                  show: true
                  // formatter: '{value} 个'
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false,
                  interval: 0
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(79,115,153,0.3)'
                  }
                }
              },
              {
                type: 'value',
                // name: '成品合格率',
                // min: 0,
                max: 100,
                // interval: 10,
                // scale: true,
                axisLabel: {
                  formatter: '{value} %'
                },
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false,
                  interval: 0
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: 'rgba(79,115,153,0.3)'
                  }
                }
              }
            ],

            series: [
              {
                name: '数量',
                type: 'bar',
                data: yarr,
                barWidth: '30%'
                // showBackground: true,
                // backgroundStyle: {
                //   color: 'rgba(0,0,0,0.05)'
                // }
                // itemStyle: {
                //   normal: {
                //     label: {
                //       show: true, //开启显示
                //       position: 'top', //在上方显示
                //       textStyle: {
                //         //数值样式
                //         color: '#ffffffee',
                //         fontSize: 14
                //       }
                //     }
                //   }
                // }
              },
              {
                name: '累计占比',
                type: 'line',
                yAxisIndex: 1,
                data: yarr2
              }
            ]
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
        })
        .catch(function(error) {
          console.log(error);
          debugger;
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
    // height: 100%;
  }
}
</style>
