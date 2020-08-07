<template>
  <div class="chartContent">
    <div class="chart" id="attendance"></div>
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
    // 考勤数据
    chart() {
      api.checkin(this.page).then(res => {
        if (res.code == 0) {

        }
      }).catch((e) => { console.log(e) });
      let myChart = echarts.init(document.getElementById('attendance'));
      let option = {

        label: {
          normal: {
            show: true,
            position: 'outside',
            // fontSize: 11,
            formatter: function (params) {
              debugger
              var s = params.data.name
              // s = `s ${'\n'}带动转发量(${params.data.s})`

              return '{color0|' + s + '\n' + '}带动转发量{color2|' + params.data.s + '}'
              //{color|标签内容} 针对此内容使用的颜色
            },
            "rich": {
              "color0": {
                "color": "rgba(44, 171, 244, 1)"
              },
              "color1": {
                "color": "white"
              },
              "color2": {
                "color": "rgba(44, 171, 244, 0.5)"
              }
            },
            // color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          containLabel: true
        },
        legend: {
          show: false,
        },
        series: [
          // {
          //   name: '',
          //   type: 'pie',
          //   radius: ['0%', '70%'],
          //   center: ['50%', '50%'],
          //   label: {
          //     position: 'inside',
          //     // show: false
          //     formatter: '{d}人'
          //   },
          //   labelLine: {
          //     show: true
          //   },
          //   hoverAnimation: false,
          //   data: [
          //     { value: 191, name: '当前在岗率' },
          //     { value: 12, name: '当前请假人数', selected: true },
          //   ],
          //   color: ['rgba(44, 171, 244, 1)', 'rgba(10, 67, 108, 1)']
          // },
          {
            name: '',
            type: 'pie',
            radius: ['0%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            // label: {
            //   position: 'inside',
            //   show: false,
            //   formatter: '{a}',
            //   itemStyle: {
            //     color: 'white'
            //   }
            // },
            // labelLine: {
            //   show: true
            // },
            // itemStyle: {
            //   normal: {
            //     label: {
            //       textStyle: {
            //         color: ['rgba(44, 171, 244, 1)', 'white'],
            //         fontSize: 14,
            //         fontWeight: 'bolder'
            //       }
            //     },
            //     labelLine: {
            //       lineStyle: {
            //         color: ['rgba(44, 171, 244, 1)', 'white']
            //       }
            //     }
            //   }
            // },
            hoverAnimation: false,
            data: [
              { value: 191, name: '当前在岗率' },
              { value: 12, name: '当前请假人数', selected: true },
            ],
            color: ['rgba(44, 171, 244, 1)', 'rgba(10, 67, 108, 1)']
          },
          {
            name: '',
            type: 'pie',
            radius: ['85%', '88%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              normal: {
                label: {
                  textStyle: {
                    color: ['rgba(255, 131, 28, 1)'],
                    // fontSize: 14,
                    // fontWeight: 'bolder'
                  }
                },
                labelLine: {
                  lineStyle: {
                    color: ['rgba(255, 131, 28, 1)']
                  }
                }
              }
            },
            hoverAnimation: false,
            tooltip: {
              show: false
            },
            hoverAnimation: false,
            data: [{ value: 1, name: '员工总数' },],
            color: ['rgba(44, 171, 244, 0.5)']
          },

        ],
        // color: ['#2CABF4', '#FF831C', '#0A436C']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
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