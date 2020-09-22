<template>
  <div class="chartContent">
    <div class="charts">
      <div class="chart" id="leftChart"></div>
    </div>
    <div class="charts">
      <div class="chart" id="rightChart"></div>
    </div>
  </div>
</template>
<script>
// 引入api
import { orderState } from '@/api/globalPage';
// 引入echarts
import echarts from 'echarts';
import HighCharts from 'highcharts';
import Highcharts3d from 'highcharts/highcharts-3d';
Highcharts3d(HighCharts);
export default {
  data() {
    return {
      loading: false,
      resData: {},
      option: {}
    };
  },
  mounted() {
    this.drawCharts();
  },
  created() {},
  methods: {
    async drawCharts() {
      await orderState()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            console.log('左1', res);
            this.leftChart(res);
            this.rightChart(res);
          }
        })
        .catch(function(error) {
          console.log(error);
          // debugger;
        });
    },

    // 左边图表
    leftChart(res) {
      let { produceFinishCount, produceTotal } = res;
      const obj = {
        produceFinishCount: parseInt(produceFinishCount),
        produceTotal: parseInt(produceTotal),
        produceUnFinishCount: produceTotal - produceFinishCount
      };
      let arr = [
        { name: '计划已完成', y: obj.produceFinishCount },
        { name: '计划未完成', y: obj.produceUnFinishCount }
      ];
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
          text: ''
        },
        subTile: { text: '' },
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.name}: {point.y}</b>'
        },
        legend: {
          verticalAlign: 'bottom',
          y: 18,
          itemStyle: {
            color: '#eee'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true, //每个扇块能否选中
            cursor: 'pointer', //鼠标指针
            depth: 45, //饼图的厚度
            // size: '100%', // TODO:调整大小和位置无效？？
            center: ['50%', '65%'],
            dataLabels: {
              enabled: true, //是否显示饼图标签
              distance: -40,
              formatter: function() {
                // return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
                return this.point.y;
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
    rightChart(res) {
      let chartData = [
        { name: '已完工', value: res['produceFinishCount'] },
        { name: '生产中', value: res['produceingCount'] },
        { name: '未领单', value: res['waitAssignCount'] },
        { name: '未派单', value: res['waitClaimCount'] }
      ];
      let myChart = echarts.init(document.getElementById('rightChart'));

      let option = {
        name: '工单状态',
        color: ['#00E676', '#0B76FF', 'yellow', '#E24AFF'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: [
          {
            orient: 'horizontal',
            x: '0%',
            y: '90%',
            data: ['已完工', '生产中', '未领单', '未派单'],
            itemWidth: 14,
            // align: 'left',
            textStyle: {
              color: '#fff'
            }
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['0%', '15%'],
            center: ['50%', '60%'],
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            hoverAnimation: false,
            data: [{ value: 0 }],
            color: ['white']
          },
          {
            name: '工单状态',
            type: 'pie',
            data: chartData,
            radius: ['15%', '50%'],
            center: ['50%', '60%'],
            roseType: 'radius',
            label: {
              position: 'inside',
              show: false
            },
            tooltip: {
              trigger: 'item',
              // formatter: '{a} <br/>{b} : {c} ({d}%)',
              formatter: function(params) {
                // console.log(params); // 这里是对象
                const showVal = `${params.seriesName}<br/>${params.marker}${params.name} : ${params.value} ( ${params.percent} %)`;
                return showVal;
              }
            }
          }
        ]
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
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
      width: 100%;
      height: 100%;
      margin-top: -4vh;
    }
  }
}
</style>
