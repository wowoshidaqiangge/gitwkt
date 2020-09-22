<template>
  <div class="chartContent">
    <div class="chartText">
      <div
        class="textBox"
        v-for="(item, index) in devEfficiencyList"
        :key="index"
        v-show="item.runLength || item.runLength == 0"
      >
        {{ item.runLength }}h
      </div>
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
    this.deviceEfficiencyFunc();
    // }, 5000)
  },
  created() {},
  computed: {},
  methods: {
    // 本周设备累计运行时间排行
    deviceEfficiencyFunc() {
      api
        .deviceEfficiency()
        .then((response) => {
          // console.log(response);
          let res = response.data;
          this.devEfficiencyList = res;
          // console.log(this.devEfficiencyList);
          let xarr = [];
          let yarr = [];
          response.data.map((item) => {
            xarr.push(item.deviceName);
            yarr.push(item.runLength);
          });
          // debugger
          let myChart = echarts.init(document.getElementById('deviceEfficiency'));
          let option = {
            color: ['#0070FF'],
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
              show: false
              // max: 100 // Y轴最大值
            },
            tooltip: {
              trigger: 'axis',
              formatter: '设备开机时间<br/>{b}：{c}h'
            },
            grid: {
              left: '1.2%',
              right: '11%',
              // height: "100%",
              top: '4%',
              bottom: '4%',
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
                showBackground: true,
                backgroundStyle: {
                  color: '#FEFEFE'
                }
              }
            ]
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
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
