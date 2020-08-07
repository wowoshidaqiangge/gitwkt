<template>
  <div class="chartContent">
    <div class="chart">
      <div class="chart" id="leftChart"></div>
    </div>
    <div class="chart">
      <div class="chart" id="rightChart"></div>
    </div>
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
      option: {}
    }
  },
  mounted() {
    this.leftChart()
    this.rightChart()
  },
  created() { },
  methods: {
    // 左边图表
    leftChart() {
      // api.orderComplete(this.page).then(res => {
      //   if (res.code == 0) {

      //   }
      // }).catch((e) => { console.log(e) });
      let myChart1 = echarts.init(document.getElementById('leftChart'));
      let myChart2 = echarts.init(document.getElementById('leftChart'));
      // let xData = ['完成工单数', '未完成工单数', '工单完成率',]
      // let yData = ['300', '100', '38']
      let res = {
        name: ['完成工单数', '未完成工单数', '工单完成率'],
        value1: [
          { value: '300', name: "完成工单数", rate: '42%' },
          { value: '100', name: "未完成工单数", rate: '24%' },
          { value: '200', name: "工单完成率", rate: '24%' },
        ]
      };
      let option1 = {
        color: ['#0B76FF', '#E24AFF', '#00E676',],
        legend: [
          {
            orient: 'vertical',
            x: "20%",
            y: "68%",
            itemWidth: 14,
            data: ['完成工单数', '未完成工单数', '工单完成率'],
            formatter: function (name) {
              let target;
              for (var i = 0; i < res.value1.length; i++) {
                if (res.value1[i].name === name) {
                  target = res.value1[i].value;
                }
              }
              return ' ' + name + "： " + target;
            },
            textStyle: {
              color: "#fff"
            }
          },
        ],
        tooltip: {
          show: true,//防止鼠标移到不需要的数据上弹出label
          trigger: 'item',
          formatter: "{a} : {c}"
        },
        series: [
          {
            name: '完成工单数',
            type: 'pie',
            radius: ['45%', '50%'],
            center: ['45%', '35%'],//环的位置
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
                value: 300, //需要显示的数据
                itemStyle: {
                  normal: {
                    color: '#0B76FF'
                  }
                }
              },
              {
                value: 100, //不需要显示的数据，颜色设置成和背景一样
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                }
              }
            ]
          },
          {
            name: '未完成工单数',
            type: 'pie',
            radius: ['35%', '40%'],
            center: ['45%', '35%'],//环的位置
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
                value: 100, //需要显示的数据
                itemStyle: {
                  normal: {
                    color: '#E24AFF'
                  }
                }
              },
              {
                value: 300, //不需要显示的数据，颜色设置成和背景一样
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                }
              }
            ]
          },
          {
            name: '工单完成率',
            type: 'pie',
            radius: ['40%', '45%'],
            center: ['45%', '35%'],//环的位置
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
                value: 200, //需要显示的数据
                itemStyle: {
                  normal: {
                    color: '#00E676'
                  }
                }
              },
              {
                value: 200, //不需要显示的数据，颜色设置成和背景一样
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                }
              }
            ]
          },
        ]

      }
      myChart1.setOption(option1, (window.onresize = myChart1.resize));

    },
    // 右边图表
    rightChart() {
      api.orderState(this.page).then(res => {
        if (res.code == 0) {

        }
      }).catch((e) => { console.log(e) });
      let myChart = echarts.init(document.getElementById('rightChart'));
      let res = {
        name: ["已发料", "未生产", "生产中"],
        value: [
          { value: '42', name: "已发料", rate: '42%' },
          { value: '24', name: "未生产", rate: '24%' },
          { value: '34', name: "生产中", rate: '34%' }
        ]
      };
      let option = {
        name: '设备生产中情况',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          containLabel: true
        },
        legend: [
          {
            orient: 'vertical',
            x: "25%",
            y: "68%",
            data: ["已发料", "未生产", "生产中"],
            itemWidth: 14,
            // align: 'left',
            formatter: function (name) {
              // var total = 0;
              var target;
              for (var i = 0; i < res.value.length; i++) {
                // total += res.value[i].value;
                if (res.value[i].name === name) {
                  target = res.value[i].rate;
                }
              }
              return ' ' + name + "： " + target;
            },
            textStyle: {
              color: "#fff"
            }
          },
        ],
        series: [
          {
            type: 'pie',
            radius: ['0%', '15%'],
            center: ['45%', '35%'],
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            hoverAnimation: false,
            data: [{ value: 1 },],
            color: ['white']
          },
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            name: '设备生产中情况',
            type: 'pie',
            radius: ['15%', '60%'],
            center: ['45%', '35%'],
            label: {
              position: 'inside',
              show: false
            },
            data: [
              { value: 42, name: '已发料' },
              { value: 24, name: '未生产' },
              { value: 34, name: '生产中' },
            ],
            roseType: 'radius',
            color: ['#0B76FF', 'rgba(226, 74, 255, 1)', '#00E676']
          }

        ],
        // color: ['#E24AFF', '#0B76FF', '#00E676']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    }
  }
}
</script>
<style lang="less" scoped>
.chartContent {
  // width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: row;
  .chart {
    width: 50%;
    height: 100%;
    .chart {
      margin: 1vh 0;
      width: 100%;
      height: 95%;
    }
  }
}
</style>