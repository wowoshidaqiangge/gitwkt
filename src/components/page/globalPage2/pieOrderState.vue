<template>
  <div class="chartContent">
    <div class="chart" id="orderState2"></div>
  </div>
</template>
<script>
import { orderState2 } from '@/api/globalPage';
import echarts from 'echarts';

export default {
  data() {
    return {
      loading: false,
      option: {}
    };
  },
  mounted() {
    this.orderState2Chart();
  },
  created() {},
  methods: {
    orderState2Chart() {
      orderState2()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            console.log('左1', res);

            let chartData = [
              { name: '已完工', value: res['produceFinishCount'], rate: res['produceFinishRate'] },
              { name: '生产中', value: res['produceingCount'], rate: res['produceingRate'] },
              { name: '未领单', value: res['waitAssignCount'], rate: res['waitAssignRate'] },
              { name: '未派单', value: res['waitClaimCount'], rate: res['waitClaimRate'] }
            ];
            let myChart = echarts.init(document.getElementById('orderState2'));

            let option = {
              name: '工单状态',
              color: ['#00E676', '#0B76FF', 'yellow', '#E24AFF'],
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
                // formatter: function(params) {
                //   console.log(params); // 这里是对象
                //   const showVal = `${params.seriesName}<br/>${params.marker}${params.name} : ${params.value} ( ${params.percent} %)`;
                //   return showVal;
                // }
              },
              legend: [
                {
                  data: ['已完工', '生产中', '未领单', '未派单'],
                  orient: 'vertical',
                  x: '65%',
                  y: '20%',
                  // padding: [
                  //   15, // 上
                  //   10, // 右
                  //   15, // 下
                  //   10 // 左
                  // ],
                  // margin: [
                  //   15, // 上
                  //   10, // 右
                  //   15, // 下
                  //   10 // 左
                  // ],
                  itemGap: 18,
                  itemWidth: 16,
                  itemHeight: 16,
                  // align: 'left',
                  textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    lineHeight: 18
                  },
                  formatter: function(name) {
                    let target;
                    for (let i = 0; i < chartData.length; i++) {
                      if (chartData[i].name === name) {
                        target = `    ${name}      ${chartData[i].rate}`;
                      }
                    }
                    return target;
                  }
                }
              ],
              series: [
                {
                  type: 'pie',
                  radius: ['0%', '15%'],
                  center: ['40%', '50%'],
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
                  radius: ['15%', '65%'],
                  center: ['40%', '50%'],
                  roseType: 'radius',
                  label: {
                    position: 'inside',
                    show: false
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  }
                }
              ]
            };
            myChart.setOption(option, (window.onresize = myChart.resize));
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
