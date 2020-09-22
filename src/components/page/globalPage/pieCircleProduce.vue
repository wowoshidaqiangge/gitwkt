<template>
  <div class="chartContent">
    <div class="chart" id="produceCount"></div>
    <div class="abs__text">
      <p class="text__item">
        成品年生产： <span class="text__value">{{ resData.productTotalYield }}</span>
      </p>
      <p class="text__item">
        零件年生产： <span class="text__value">{{ resData.partTotalYield }}</span>
      </p>
      <p class="text__item">
        工序年生产： <span class="text__value">{{ resData.workprocessTotalYield }}</span>
      </p>
    </div>
  </div>
</template>
<script>
// 引入api
import { produceYield } from '@/api/globalPage';

// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
      option: {},
      resData: {}
    };
  },
  mounted() {
    this.produceCountChart();
  },
  created() {},
  methods: {
    produceCountChart() {
      produceYield()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            res.productQualifiedRate = parseFloat(res.productQualifiedRate);
            res.partQualifiedRate = parseFloat(res.partQualifiedRate);
            res.workprocessQualifiedRate = parseFloat(res.workprocessQualifiedRate);
            console.log('右1', res);
            this.resData = res; // 用于页面显示

            let myChart = echarts.init(document.getElementById('produceCount'));

            let chartData = {
              name: ['成品合格率', '零件合格率', '工序合格率'],
              yarr: [
                {
                  name: '成品合格率',
                  value: res.productQualifiedRate
                },
                {
                  name: '零件合格率',
                  value: res.partQualifiedRate
                },
                {
                  name: '工序合格率',
                  value: res.workprocessQualifiedRate
                }
              ]
            };
            let option = {
              color: ['#0B76FF', '#E24AFF', '#00E676', 'yellow'],
              tooltip: {
                show: true, //防止鼠标移到不需要的数据上弹出label
                trigger: 'item',
                // formatter: '{a}<br/> {c}%',
                formatter: function(params) {
                  console.log(params); // 这里是对象
                  const showVal = `${params.seriesName}<br/>${params.marker} ${params.value} %`;
                  return showVal;
                }
              },
              legend: [
                {
                  orient: 'horizontal',
                  x: '5%',
                  y: '80%',
                  itemWidth: 14,
                  data: ['成品合格率', '零件合格率', '工序合格率'],
                  formatter: function(name) {
                    let target;
                    for (let i = 0; i < chartData.yarr.length; i++) {
                      if (chartData.yarr[i].name === name) {
                        target = ` ${name} : ${chartData.yarr[i].value} %`;
                      }
                    }
                    return target;
                  },
                  color: function() {},
                  textStyle: {
                    color: '#fff'
                  }
                }
              ],
              series: [
                {
                  name: '成品合格率',
                  type: 'pie',
                  // left: '10%',
                  radius: ['45%', '50%'],
                  center: ['35%', '40%'], //环的位置
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  hoverAnimation: false,
                  data: [
                    {
                      value: chartData.yarr[0].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#0B76FF'
                        }
                      }
                    },
                    {
                      value: 100 - chartData.yarr[0].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                },
                {
                  name: '零件合格率',
                  type: 'pie',
                  radius: ['40%', '45%'],
                  center: ['35%', '40%'], //环的位置
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  hoverAnimation: false,
                  data: [
                    {
                      value: chartData.yarr[1].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#E24AFF'
                        }
                      }
                    },
                    {
                      value: 100 - chartData.yarr[1].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                },
                {
                  name: '工序合格率',
                  type: 'pie',
                  radius: ['35%', '40%'],
                  center: ['35%', '40%'], //环的位置
                  label: {
                    show: false
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  hoverAnimation: false,
                  data: [
                    {
                      value: chartData.yarr[2].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#00E676'
                        }
                      }
                    },
                    {
                      value: 100 - chartData.yarr[2].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                }
              ]
            };
            myChart.setOption(option, (window.onresize = myChart.resize));
          }
        })
        .catch(e => {
          console.log(e);
          debugger;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  position: relative;
  .chart {
    width: 100%;
    height: 95%;
  }
  .abs__text {
    position: absolute;
    top: 16%;
    right: 8%;
    // display: flex;
    // flex-flow: row wrap;
    // align-content: flex-end;
    color: #fff;
    font-size: 14px;

    .text__item {
      margin: 10% 0;

      .text__value {
        color: #00ffff;
      }
    }
  }
}
</style>
