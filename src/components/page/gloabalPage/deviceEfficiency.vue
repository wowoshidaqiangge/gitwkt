<template>
  <div class="chartContent">
    <div class="chartText">
      <div class="textBox" v-for="(item,index) in devEfficiencyList" :key="index"
        v-if="item.workpieceRate||item.workpieceRate==0">
        {{item.workpieceRate}}</div>
    </div>
    <div class="chart" id="deviceEfficiency"></div>
  </div>
</template>
<script>
import ElementUI from 'element-ui';
import { api } from '@/api/index1';
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      devEfficiencyList: [{ workpieceRate: '' }],
      timer: ''
    };
  },
  mounted() {
    // this.timer = setInterval(() => {
    this.deviceEfficiencyFunc()
    // }, 5000)
  },
  created() { },
  computed: {
  },
  methods: {
    // 设备工作效率排行
    deviceEfficiencyFunc() {
      api.deviceEfficiency()
        .then(response => {
          console.log(response);
          let res = response.data;
          this.devEfficiencyList = res;
          // console.log(this.devEfficiencyList);
          let xarr = []
          let yarr = []
          response.data.map(item => {
            xarr.push(item.deviceName)
            yarr.push(item.runYield)
          })
          // debugger
          let myChart = echarts.init(
            document.getElementById('deviceEfficiency')
          );
          let option = {
            color: ['#7FE7DD'],
            textStyle: {
              color: 'white'
            },
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
              data: xarr
            },
            yAxis: {
              show: false,
              // max: 100 // Y轴最大值
            },
            tooltip: {
              trigger: 'axis',
              formatter: '设备工作效率<br/>{b}：{c}'
            },
            grid: {
              left: '6%',
              right: '12%',
              // height: "100%",
              top: '5%',
              bottom: '20%',
              containLabel: true
            },
            series: [
              {
                data: yarr,
                // itemStyle: {
                //   normal: {
                //     label: {
                //       show: true, //开启显示
                //       position: 'top', //在上方显示
                //       textStyle: { //数值样式
                //         color: 'black',
                //         fontSize: 16
                //       }
                //     }
                //   }
                // },
                type: 'bar',
                barWidth: '50%',
                // showBackground: true,
                backgroundStyle: {
                  color: '#FEFEFE'
                }
              }
            ]
          };
          myChart.setOption(
            option,
            (window.onresize = myChart.resize)
          );
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
  .chartText {
    position: absolute;
    left: 49.8%;
    top: 70px;
    transform: translate(-50%, 50%);
    width: 76.5%;
    height: 20px;
    color: white;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    .textBox {
      width: 14.28%;
      height: 20px;
      text-align: center;
    }
  }
  .chart {
    padding-top: 20px;
    width: 100%;
    height: 100%;
  }
}
</style>