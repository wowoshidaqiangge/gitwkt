<template>
  <div class="chartContent">
    <div class="chart">
      <div class="topTitle">巡检总数：<span style="color:#C95CE9;">562</span></div>
      <div class="chart" id="inspection" :option="option"></div>
      <div class="botTitle">巡检统计</div>
    </div>
    <div class="chart">
      <div class="topTitle">维修总数：<span style="color:#CB8F0D;">259</span></div>
      <div class="chart" id="repair" :option="option"></div>
      <div class="botTitle">维修统计</div>
    </div>
  </div>
</template>
<script>
// 引入3D图表
import HighCharts from 'highcharts'
export default {
  data() {
    return {
      loading: false,
      option: {}
    }
  },
  mounted() {
    // this.leftChart()
    this.rightChart()
  },
  created() { },
  methods: {
    // 巡检统计
    leftChart() {
      // let rate = parseInt(response.data.finishRate.replace("%", ""));
      let arr = [{ name: '巡检通过数', y: 450 },
      { name: '巡检异常数', y: 112 },]   //模块名和所占比，也可以{name: '测试1',y: 12}
      // console.log(arr)
      const option = {
        credits: {
          enabled: false                //去掉版权信息，就是图片左下角的网址信息
        },
        colors: ['#FD9E02', '#00CACF'],
        chart: {
          margin: [0, 0, 15, 0],
          backgroundColor: 'rgba(137, 87, 161, 0)',
          type: 'pie',//饼图
          options3d: {
            enabled: true,//使用3d功能
            alpha: 60,//延y轴向内的倾斜角度
            beta: 0,
          }
        },
        legend: {
          enabled: true,
          x: -10,
          y: 23,
          align: 'left', //程度标的目标地位
          layout: 'vertical', //垂直标的目标地位
          itemStyle: {
            color: 'white'
          },
          itemHoverStyle: { color: 'white' }
        },
        title: {
          text: '',
          margin: 0,
        },
        subtitle: {
          text: '',//副标题文字
          margin: 0,
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: {point.y}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,//每个扇块能否选中
            cursor: 'pointer',//鼠标指针
            depth: 45,//饼图的厚度
            dataLabels: {
              enabled: true,//是否显示饼图的线形tip
              inside: true,
              formatter: function () {
                // console.log(this)
                return this.y;
              },
              style: {
                color: '#eee',
                fontSize: '11.5px',//设置字体大小
                fontFamily: 'PingFang SC',
                textOutline: "none"        // 去除字体外白色描边
              },
              distance: -20
            },

            showInLegend: true
          }
        },
        series: [
          {
            type: 'pie',
            name: '巡检统计',//统一的前置词,非必须
            data: arr
          }
        ]
      }
      let leftChart = HighCharts.chart('inspection', option)
    },
    // 维修统计
    rightChart() {
      // let rate = parseInt(response.data.finishRate.replace("%", ""));
      let arr = [{ name: '已维修数', y: 170 },
      { name: '待维修数', y: 89 },]   //模块名和所占比，也可以{name: '测试1',y: 12}
      // console.log(arr)
      const option = {
        credits: {
          enabled: false                //去掉版权信息，就是图片左下角的网址信息
        },
        colors: ['#0195F3', '#AB05DC'],
        chart: {
          margin: [0, 0, 15, 0],
          backgroundColor: 'rgba(137, 87, 161, 0)',
          type: 'pie',//饼图
          options3d: {
            enabled: true,//使用3d功能
            alpha: 60,//延y轴向内的倾斜角度
            beta: 0,
          }
        },
        legend: {
          enabled: true,
          x: 10,
          y: 23,
          align: 'right', //程度标的目标地位
          layout: 'vertical', //垂直标的目标地位
          itemStyle: {
            color: 'white'
          },
          itemHoverStyle: { color: 'white' }
        },
        title: {
          text: '',
          margin: 0,
        },
        subtitle: {
          text: '',//副标题文字
          margin: 0,
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: {point.y}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,//每个扇块能否选中
            cursor: 'pointer',//鼠标指针
            depth: 45,//饼图的厚度
            dataLabels: {
              enabled: true,//是否显示饼图的线形tip
              inside: true,
              formatter: function () {
                // console.log(this)
                return this.y;
              },
              style: {
                color: '#eee',
                fontSize: '11.5px',//设置字体大小
                fontFamily: 'PingFang SC',
                textOutline: "none"        // 去除字体外白色描边
              },
              distance: -20
            },

            showInLegend: true
          }
        },
        series: [
          {
            type: 'pie',
            name: '维修统计',//统一的前置词,非必须
            data: arr
          }
        ]
      }
      let rightChart = HighCharts.chart('repair', option)
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
    display: flex;
    flex-direction: column;
    position: relative;
    .topTitle {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-50%, 0%);
      color: white;
      span {
        font-size: 19px;
      }
    }
    .chart {
      margin: 1vh 0;
      width: 100%;
      height: 95%;
    }
    .botTitle {
      position: absolute;
      bottom: 8%;
      left: 50%;
      transform: translate(-50%, 0%);
      color: white;
    }
  }
}
</style>