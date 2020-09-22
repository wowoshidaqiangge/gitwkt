<template>
  <div class="chartContent" v-loading="loading">
    <div class="chart" id="deviceOperation"></div>
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
      timer: ''
    };
  },
  mounted() {
    // this.timer = setInterval(() => {
    this.deviceOperationFunc();
    // }, 5000)
  },
  created() {},
  methods: {
    // 设备运行情况
    deviceOperationFunc() {
      api
        .deviceOperation()
        .then((response) => {
          // console.log(response);
          let myChart = echarts.init(document.getElementById('deviceOperation'));
          let res = {
            name: ['关机', '开机', '运行'],
            value: [
              { value: response.data.offCount, name: '关机', rate: response.data.offRate },
              { value: response.data.onCount, name: '开机', rate: response.data.onRate },
              { value: response.data.runCount, name: '运行', rate: response.data.runRate }
            ]
          };
          let option = {
            name: '设备运行情况',
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            grid: {
              containLabel: true
            },
            legend: [
              {
                orient: 'vertical',
                x: '60%',
                y: '20%',
                // data: [
                //   '关机',
                //   '开机',
                //   '运行'
                // ],
                data: ['关机'],
                align: 'left',
                formatter: function (name) {
                  // var total = 0;
                  var target;
                  for (var i = 0; i < res.value.length; i++) {
                    // total += res.value[i].value;
                    if (res.value[i].name === name) {
                      target = res.value[i].rate;
                    }
                  }
                  return name + '： ' + target;
                },
                textStyle: {
                  color: '#fff'
                }
              },
              {
                orient: 'vertical',
                x: '60%',
                y: '40%',
                // data: [
                //   '关机',
                //   '开机',
                //   '运行'
                // ],
                data: ['开机'],
                align: 'left',
                formatter: function (name) {
                  // var total = 0;
                  var target;
                  for (var i = 0; i < res.value.length; i++) {
                    // total += res.value[i].value;
                    if (res.value[i].name === name) {
                      target = res.value[i].rate;
                    }
                  }
                  return name + '： ' + target;
                },
                textStyle: {
                  color: '#fff'
                }
              },
              {
                orient: 'vertical',
                x: '60%',
                y: '60%',
                // data: [
                //   '关机',
                //   '开机',
                //   '运行'
                // ],
                data: ['运行'],
                formatter: function (name) {
                  // var total = 0;
                  var target;
                  for (var i = 0; i < res.value.length; i++) {
                    // total += res.value[i].value;
                    if (res.value[i].name === name) {
                      target = res.value[i].rate;
                    }
                  }
                  return name + '： ' + target;
                },
                textStyle: {
                  color: '#fff'
                }
              }
            ],
            // {
            //   show: true,
            //   orient: 'vertical',
            //   right: "10%",
            //   top: "30%",
            //   // data: [
            //   //   '关机',
            //   //   '开机',
            //   //   '运行'
            //   // ],
            //   data: res.name,
            //   formatter: function (name) {
            //     // var total = 0;
            //     var target;
            //     for (var i = 0; i < res.value.length; i++) {
            //       // total += res.value[i].value;
            //       if (res.value[i].name === name) {
            //         target = res.value[i].rate;
            //       }
            //     }
            //     return name + "： " + target;
            //   },
            //   textStyle: {
            //     color: "#fff"
            //   }
            // },
            series: [
              {
                type: 'pie',
                radius: ['0%', '20%'],
                center: ['35%', '50%'],
                label: {
                  show: false
                },
                tooltip: {
                  show: false
                },
                hoverAnimation: false,
                data: [{ value: 1 }],
                color: ['white']
              },
              {
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                name: '设备运行情况',
                type: 'pie',
                radius: ['20%', '65%'],
                center: ['35%', '50%'],
                label: {
                  position: 'inside',
                  show: false
                },
                data: [
                  { value: response.data.offCount, name: '关机' },
                  { value: response.data.onCount, name: '开机' },
                  { value: response.data.runCount, name: '运行' }
                ],
                roseType: 'radius',
                color: ['rgba(164, 163, 163, 1)', '#0B76FF', '#00E676']
              }
            ]
            // color: ['#E24AFF', '#0B76FF', '#00E676']
          };
          myChart.setOption(option, (window.onresize = myChart.resize));
          this.$emit('func', response.data);
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
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
