<template>
  <div class="chartContent">
    <div class="chart" id="barLinePart"></div>
  </div>
</template>
<script>
import { producePart } from '@/api/globalPage';
import echarts from 'echarts';
export default {
  data() {
    return {};
  },
  mounted() {
    this.barLinePartFunc();
  },
  created() {},
  computed: {},
  methods: {
    barLinePartFunc() {
      producePart()
        .then(res => {
          console.log('左3', res.data);
          // TODO:空数据
          const keys = ['produceTotal', 'qualifiedCount', 'qualifiedRate'];
          for (let item of res.data) {
            for (let key of keys) {
              if (!item[key]) {
                item[key] = 0;
              }
            }
          }
          let xarr = [],
            yarr = [],
            yarr2 = [];
          for (let item of res.data) {
            xarr.push(item.dateMonth);
            yarr.push(item.produceTotal);
            yarr2.push(parseFloat(item.qualifiedRate));
          }
          // console.log(xarr, yarr, yarr2);
          let myChart = echarts.init(document.getElementById('barLinePart'));
          let option = {
            color: ['#00B7EE', '#F19149'],
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

                let showVal = params[0].name + '月';
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
              data: ['生产数量', '生产合格率'],
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
              bottom: '0%',
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
                formatter: '{value} 月'
              },
              axisPointer: {
                type: 'shadow'
              }
            },
            yAxis: [
              {
                type: 'value',
                // name: '生产数量',
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
                // name: '生产合格率',
                // min: 0,
                max: 100,
                // interval: 10,
                scale: true,
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
                name: '生产数量',
                type: 'bar',
                data: yarr,
                barWidth: '30%',
                // showBackground: true,
                // backgroundStyle: {
                //   color: 'rgba(0,0,0,0.05)'
                // }
                itemStyle: {
                  normal: {
                    // label: {
                    //   show: true, //开启显示
                    //   position: 'top', //在上方显示
                    //   textStyle: {
                    //     //数值样式
                    //     color: '#ffffffee',
                    //     fontSize: 14
                    //   }
                    // },
                    barBorderRadius: [6, 6, 0, 0]
                  }
                }
              },
              {
                name: '生产合格率',
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
