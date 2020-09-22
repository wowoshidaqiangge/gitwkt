<template>
  <div class="chartContent">
    <div class="content-item left-container">
      <div class="left-item">
        <div class="left-item__left">
          <img class="left-item__icon" src="@/assets/img/dashboard/center-bottom-icon1.png" />
        </div>
        <div class="left-item__right">
          <p class="left-item__label">运行设备总数</p>
          <p class="left-item__value">{{ deviceState.totalNum }} 个</p>
        </div>
      </div>
      <div class="left-item">
        <div class="left-item__left">
          <img class="left-item__icon" src="@/assets/img/dashboard/center-bottom-icon2.png" />
        </div>
        <div class="left-item__right">
          <p class="left-item__label">生产合格率</p>
          <p class="left-item__value">{{ deviceState.qulityRate }} %</p>
        </div>
      </div>
      <div class="left-item">
        <div class="left-item__left">
          <img class="left-item__icon" src="@/assets/img/dashboard/center-bottom-icon3.png" />
        </div>

        <div class="left-item__right">
          <p class="left-item__label">设备使用率</p>
          <p class="left-item__value">{{ deviceState.deviceUseRate }} %</p>
        </div>
      </div>
    </div>
    <div class="content-item right-container">
      <img class="right-item" src="@/assets/img/dashboard/center-bottom.png" />
    </div>
  </div>
</template>
<script>
// 引入api
// import { api } from '@/api/index1';
// import { quantityState } from './index.js';

// 引入echarts
// import echarts from 'echarts';

export default {
  data() {
    return {
      loading: false,
      resData: {},
      deviceState: {
        totalNum: 2600,
        qulityRate: 96,
        deviceUseRate: 90
      } // TODO:假数据
    };
  },
  mounted() {},
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
        colors: ['#FD9E02', '#00CACF'],
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
        lagend: {
          align: 'center',
          verticalAlign: 'middle'
          // x: '50%',
          // y: '50%'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true, //每个扇块能否选中
            cursor: 'pointer', //鼠标指针
            depth: 45, //饼图的厚度
            dataLabels: {
              // enabled: true, //是否显示饼图的线形tip
              inside: true,
              formatter: function() {
                return '<b>' + this.point.name + '</b> : ' + this.percentage + ' %';
              },
              style: {
                color: '#eee',
                fontSize: '11.5px', //设置字体大小
                fontFamily: 'PingFang SC',
                textOutline: 'none' // 去除字体外白色描边
              },
              distance: 20
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
  .content-item {
    width: 50%;
    height: 100%;

    .left-item {
      color: #fff;
      border: 1px solid rgba(26, 63, 129, 1);
      border-radius: 11px;
      font-size: 2vh;
      padding: 0.5rem;
      margin-top: 4.5vh;
      margin-left: 3vh;
      width: 60%;
      display: flex;

      .left-item__left {
        margin-right: 2vh;
        display: flex;
        .left-item__icon {
          height: 42px;
          align-self: center;
        }
      }
      .left-item__right {
        .left-item__label {
          color: #02d9fd;
          line-height: 23px;
          font-size: 1rem;
        }
        .left-item__value {
          // color: #fff;
          line-height: 23px;
          font-size: 1rem;
        }
      }
    }

    .right-item {
      margin-top: 4.5vh;
      width: 90%;
    }
  }
}
</style>
