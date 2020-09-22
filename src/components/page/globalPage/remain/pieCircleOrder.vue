<template>
  <div class="chartContent">
    <div class="chart" id="orderCount"></div>
  </div>
</template>
<script>
// 引入api
import { orderComplete } from './index.js';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
      option: {}
    };
  },
  mounted() {
    this.orderCountChart();
  },
  created() {},
  methods: {
    orderCountChart() {
      orderComplete()
        .then(response => {
          if (response.code == 0) {
            let myChart = echarts.init(document.getElementById('orderCount'));
            let res = {
              name: ['工单完成数', '工单返修数', '工单报废数'],
              yarr: [
                { value: response.data.completed, name: '工单完成数' },
                { value: response.data.repair, name: '工单返修数' },
                { value: response.data.scrap, name: '工单报废数' },
                { value: response.data.rate, name: '工单完成率' }
              ]
            };
            res.yarr.map((item, index) => {
              item.rate = parseFloat(item.value / response.data.total) * 100;
            });
            let option = {
              color: ['#0B76FF', '#00E676', '#E24AFF', 'yellow'],
              legend: [
                {
                  orient: 'vertical',
                  x: '60%',
                  y: '20%',
                  itemWidth: 14,
                  data: ['工单完成数', '工单返修数', '工单报废数', '工单完成率'],
                  formatter: function(name) {
                    let target;
                    const suffix = ['个', '%'];
                    // for (let i = 0; i < res.yarr.length; i++) {
                    //   if (res.yarr[i].name === name) {
                    //     target = res.yarr[i].rate;
                    //   }
                    // }
                    for (let i = 0; i < res.yarr.length; i++) {
                      if (i !== res.yarr.length - 1) {
                        if (res.yarr[i].name === name) {
                          target = ` ${name} :  ${res.yarr[i].value} ${suffix[0]}`;
                        }
                      } else {
                        if (res.yarr[i].name === name) {
                          target = ` ${name} :  ${res.yarr[i].value} `;
                        }
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
              tooltip: {
                show: true, //防止鼠标移到不需要的数据上弹出label
                trigger: 'item',
                formatter: '{a} : {c}'
              },
              series: [
                {
                  name: '工单完成数',
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
                      value: res.yarr[0].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#0B76FF'
                        }
                      }
                    },
                    {
                      value: response.data.total - res.yarr[0].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                },
                {
                  name: '工单完成率',
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
                      value: res.yarr[0].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#00E676'
                        }
                      }
                    },
                    {
                      value: response.data.total - res.yarr[0].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                },
                {
                  name: '工单返修数',
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
                      value: res.yarr[1].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: '#E24AFF'
                        }
                      }
                    },
                    {
                      value: response.data.total - res.yarr[1].value, //不需要显示的数据，颜色设置成和背景一样
                      itemStyle: {
                        normal: {
                          color: '#020657'
                        }
                      }
                    }
                  ]
                },
                {
                  name: '工单报废数',
                  type: 'pie',
                  radius: ['30%', '35%'],
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
                      value: res.yarr[2].value, //需要显示的数据
                      itemStyle: {
                        normal: {
                          color: 'yellow'
                        }
                      }
                    },
                    {
                      value: response.data.total - res.yarr[2].value, //不需要显示的数据，颜色设置成和背景一样
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
        });
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  .chart {
    width: 100%;
    height: 95%;
  }
}
</style>
