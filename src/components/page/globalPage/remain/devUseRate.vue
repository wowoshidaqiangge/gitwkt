<template>
  <div class="chartContent" v-loading="loading">
    <div class="chartText">
      <div
        class="textBox"
        v-for="(item, index) in useRateList"
        :key="index"
        v-if="item.useRate || item.useRate == 0"
      >
        {{ item.useRate }}
      </div>
    </div>
    <div class="chart" id="devUseRate" @mouseover="mouseOver" @mouseleave="mouseLeave"></div>
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
      loading: false,
      useRateList: [{ deviceName: '', useRate: '', useRateOrder: '' }],
      mTime: ''
    };
  },
  mounted() {
    this.devUseRateFunc();
  },
  created() {},
  methods: {
    mouseOver() {
      clearInterval(this.mTime);
    },
    mouseLeave() {
      this.devUseRateFunc();
    },
    // 设置数据高亮轮播定时器
    setCarouselTime(xarr, myChart) {
      var index = 0; //播放所在下标
      this.mTime = setInterval(function () {
        myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        });
        index++;
        if (index > xarr.length - 1) {
          index = 0;
        }
      }, 2200);
    },
    // 设备综合利用率
    devUseRateFunc() {
      api
        .devUseRate()
        .then((response) => {
          // console.log(response);
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].useRateOrder = (response.data[i].useRateOrder * 100).toFixed(2);
          }

          let res = response.data;
          this.useRateList = res;
          let xarr = [];
          let yarr = [];
          res.map((item) => {
            xarr.push(item.deviceName);
            yarr.push(item.useRateOrder);
          });
          // debugger
          let myChart = echarts.init(document.getElementById('devUseRate'));
          let option = {
            color: ['#78C6A2'],
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
              max: 100
            },
            tooltip: {
              trigger: 'axis',
              formatter: '设备综合利用率<br/>{b}：{c}%'
            },
            grid: {
              left: '3%',
              right: '12%',
              // height: "100%",
              top: '3%',
              bottom: '5%',
              containLabel: true
            },
            series: [
              {
                data: yarr,
                type: 'bar',
                barWidth: '50%',
                showBackground: true,
                backgroundStyle: {
                  color: '#FEFEFE'
                }
              }
            ]
          };
          this.setCarouselTime(xarr, myChart);
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
    width: 77%;
    height: 15%;
    color: white;
    font-size: 1.5vh;
    display: flex;
    flex-direction: row;
    .textBox {
      margin: 1% 0 0;
      width: 14.28%;
      height: 20px;
      text-align: center;
      line-height: 20px;
    }
  }
  .chart {
    flex: 1;
    width: 100%;
  }
}
</style>
