<template>
  <div class="chartContent">
    <div class="charts">
      <div class="chart-info">
        巡检总数： <span class="info-value">{{ resData.inspectionTotal }}</span>
      </div>
      <div class="chart" id="leftChart" :option="option"></div>
    </div>
    <div class="charts">
      <div class="chart-info">
        维修总数： <span class="info-value2">{{ resData.repairTotal }}</span>
      </div>
      <div class="chart" id="rightChart" :option="option2"></div>
    </div>
  </div>
</template>
<script>
// 引入api
import { api } from '@/api/index1';
import { quantityState } from './index.js';

// 引入echarts
// import echarts from 'echarts';
import Charts from '@jiaminghi/charts';
import HighCharts from 'highcharts';
export default {
  data() {
    return {
      loading: false,
      resData: {},
      option: {},
      option2: {}
    };
  },
  mounted() {
    this.drawCharts();
  },
  created() {},
  methods: {
    // api
    async drawCharts() {
      await quantityState()
        .then(res => {
          this.resData = res.data;
          this.leftChart(res.data);
          this.rightChart(res.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 左边图表
    leftChart(data) {
      const { inspectionSuccess, inspectionFail, inspectionTotal } = data;
      // let inspection = parseInt(this.resData.inspectionSuccess);
      let arr = [
        { name: '巡检通过数', y: inspectionSuccess }, //模块名和所占比，也可以{name: '测试1',y: 12}
        { name: '巡检异常数', y: inspectionFail }
      ];
      console.log(arr);
      const option = {
        credits: {
          enabled: false //去掉版权信息，就是图片左下角的网址信息
        },
        colors: ['#00CACF', '#FD9E02'],
        chart: {
          backgroundColor: 'rgba(137, 87, 161, 0)',
          type: 'pie', //饼图
          options3d: {
            enabled: true, //使用3d功能
            alpha: 60, //延y轴向内的倾斜角度
            beta: 0
          }
        },
        title: {
          text: '' //图表的标题文字
        },
        subtitle: {
          text: '' //副标题文字
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: {point.y}</b>'
        },
        legend: {
          itemStyle: {
            color: '#eee'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true, //每个扇块能否选中
            cursor: 'pointer', //鼠标指针
            depth: 70, //饼图的厚度
            dataLabels: {
              enabled: true, //是否显示饼图标签
              distance: -70,
              formatter: function() {
                // return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
                return '<b>' + this.point.name + '</b> : ' + this.point.y;
              },
              style: {
                color: '#eee',
                fontSize: '11.5px', //设置字体大小
                fontFamily: 'PingFang SC',
                textOutline: 'none' // 去除字体外白色描边
              }
            },
            showInLegend: true
          }
        },
        series: [
          {
            type: 'pie',
            name: '巡检统计', //统一的前置词,非必须
            data: arr
          }
        ]
      };
      let chart = HighCharts.chart('leftChart', option);
    },
    // 右边图表
    rightChart(data) {
      const { repairHave, repairWait, repairTotal } = data;
      let arr = [
        { name: '已维修数', y: repairHave }, //模块名和所占比，也可以{name: '测试1',y: 12}
        { name: '待维修数', y: repairWait }
      ];
      console.log(arr);
      const option = {
        credits: {
          enabled: false //去掉版权信息，就是图片左下角的网址信息
        },
        colors: ['#0195F3', '#C004F8'],
        chart: {
          backgroundColor: 'rgba(137, 87, 161, 0)',
          type: 'pie', //饼图
          options3d: {
            enabled: true, //使用3d功能
            alpha: 60, //延y轴向内的倾斜角度
            beta: 0
          }
        },
        title: {
          text: '' //图表的标题文字
        },
        subtitle: {
          text: '' //副标题文字
        },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: {point.y}</b>'
        },
        legend: {
          itemStyle: {
            color: '#eee'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true, //每个扇块能否选中
            cursor: 'pointer', //鼠标指针
            depth: 60, //饼图的厚度
            dataLabels: {
              enabled: true, //是否显示饼图标签
              distance: -70,
              formatter: function() {
                // return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
                return '<b>' + this.point.name + '</b> : ' + this.point.y;
              },
              style: {
                color: '#eee',
                fontSize: '11.5px', //设置字体大小
                fontFamily: 'PingFang SC',
                textOutline: 'none' // 去除字体外白色描边
              }
            },
            showInLegend: true
          }
        },
        series: [
          {
            type: 'pie',
            name: '维修统计', //统一的前置词,非必须
            data: arr
          }
        ]
      };
      let chart = HighCharts.chart('rightChart', option);
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  // width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: row;
  .charts {
    width: 50%;
    height: 100%;

    .chart {
      width: 90%;
      height: 90%;
      margin-top: -4vh;
    }
    .chart-info {
      color: #fff;
      text-align: center;
      margin-top: 4vh;
      height: 3vh;
      font-size: 2vh;

      .info-value {
        font-size: 3vh;
        color: #e24aff;
        // vertical-align: middle;
      }
      .info-value2 {
        font-size: 3vh;
        color: #cb8f0d;
        // vertical-align: middle;
      }
    }
  }
}
</style>
