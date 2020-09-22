<template>
  <div class="chartContent">
    <div class="chart" id="planFinish"></div>
  </div>
</template>
<script>
import { planFinish } from '@/api/globalPage';
import HighCharts from 'highcharts';
import Highcharts3d from 'highcharts/highcharts-3d';
Highcharts3d(HighCharts);

export default {
  data() {
    return {
      loading: false,
      option: {}
    };
  },
  mounted() {
    this.planFinishChart();
  },
  created() {},
  methods: {
    planFinishChart() {
      planFinish()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            console.log('右1', res);

            let { produceFinishCount, produceUnFinishCount, produceFinishRate, produceUnFinishRate } = res;
            const obj = {
              produceFinishCount: parseInt(produceFinishCount),
              produceUnFinishCount: parseInt(produceUnFinishCount),
              produceFinishRate: parseFloat(produceFinishRate),
              produceUnFinishRate: parseFloat(produceUnFinishRate)
            };
            let chartData = [
              { name: '计划已达成', y: obj.produceFinishRate },
              { name: '计划未达成', y: obj.produceUnFinishRate }
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
                pointFormat: '{point.name}: {point.y}%</b>'
              },
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                y: 10,
                itemStyle: {
                  color: '#eee'
                }
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true, //每个扇块能否选中
                  cursor: 'pointer', //鼠标指针
                  depth: 45, //饼图的厚度
                  size: '120%',
                  center: ['50%', '40%'],
                  dataLabels: {
                    enabled: true, //是否显示饼图标签
                    distance: -30,
                    formatter: function() {
                      // return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
                      return this.point.y + ' %';
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
                  name: '', //统一的前置词,非必须
                  data: chartData
                }
              ]
            };
            let chart = HighCharts.chart('planFinish', option);
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
    height: 100%;
  }
}
</style>
