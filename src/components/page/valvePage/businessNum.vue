<template>
  <div class="chartContent">
    <div class="chartBox">
      <div class="titleBox">
        <div class="titleTag"></div>
        <div class="titleText">近半年业务数量</div>
      </div>
      <div class="chart" id="businessNum"></div>
    </div>
    <div class="scrollBox">
      <div class="titleBox">
        <div class="titleTag"></div>
        <div class="titleText">各客户销售订单</div>
      </div>
      <div class="listBox">
        <div class="listHead">
          <div class="headItem">客户</div>
          <div class="headItem">业务数量</div>
          <div class="headItem">订单数量</div>
          <div class="headItem">未发数量</div>
        </div>
        <div class="listContent" v-if="clientList.length>0">
          <vue-seamless-scroll class="seamless_warp" v-if="clientList[0].client" :data="clientList"
            :class-option="scrollOption">
            <div class="listUl">
              <div class="listRow" v-for="(item, index) in clientList" :key="index">
                <div class="rowItem">{{item.client}}</div>
                <div class="rowItem">{{item.orderNumber}}</div>
                <div class="rowItem">{{item.numberDeliver}}</div>
                <div class="rowItem">{{item.numberUnship}}</div>
              </div>
            </div>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入api
import { api } from './index'
// 引入echarts
import echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
      scrollOption: {
        direction: 0,
        step: 0.5,
        limitMoveNum: 0,
        openWatch: true
      },
      clientList: [],
    }
  },
  mounted() {
    this.chart()
    this.getClientList()
  },
  created() { },
  methods: {
    // 近半年业务数量
    chart() {
      api.orderStatistics().then(res => {
        if (res.code == 0) {
          let xarr = []
          let yarr = []
          res.data.map(item => {
            xarr.push(item.date)
            yarr.push(item.number)
            let myChart = echarts.init(document.getElementById('businessNum'));
            let option = {
              color: ["#51D7FF"],
              textStyle: {
                color: "white"
              },
              xAxis: {
                type: 'category',
                // axisLine: {
                //   show: false
                // },
                // axisTick: {
                //   show: false,
                //   interval: 0
                // },
                // axisLabel: {
                //   interval: 0
                // },
                data: xarr
              },
              yAxis: {
                show: true,
                type: 'value',
                name: '(个)',
                nameTextStyle: {
                  color: "white",
                  // fontSize: 16,
                  // padding: 10
                },
                position: 'left',//位置靠左
                // nameLocation: 'middle', //位置居中
                // nameGap: 10, //与y轴距离
                // nameRotate: 90, //角度

                // interval: 100,
                axisLine: {
                  lineStyle: {
                    color: 'rgba(63, 255, 234, 0.2)'
                  }
                },
                splitLine: {
                  // show: false,
                  lineStyle: {
                    color: 'rgba(63, 255, 234, 0.2)'
                  }
                },
              },
              tooltip: {
                trigger: "axis",
                formatter: '业务数量<br/>{b}：{c}'
              },
              grid: {
                left: "5%",
                right: "5%",
                top: "17%",
                bottom: "4%",
                // height: "100%",
                containLabel: true
              },
              series: [{
                data: yarr,
                type: 'bar',
                barWidth: "30%",
                itemStyle: {
                  //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                  // emphasis: {
                  //   barBorderRadius: 30
                  // },

                  normal: {
                    //柱形图圆角，初始化效果
                    barBorderRadius: [5, 5, 0, 0],
                    // label: {
                    //   show: true,//是否展示
                    //   textStyle: {
                    //     fontWeight: 'bolder',
                    //     fontSize: '12',
                    //     fontFamily: '微软雅黑',
                    //   }
                    // }
                  }
                },
              }]
            };
            myChart.setOption(option, (window.onresize = myChart.resize));
          })
        }
      }).catch((e) => { console.log(e) });

    },
    getClientList() {
      api.clientStatistics().then(res => {
        this.clientList = res.data
      }).catch(() => { });
    }
  }
}
</script>
<style lang="less">
.chartContent {
  display: flex;
  flex-direction: row;
  .chartBox {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .titleBox {
      width: 100%;
      height: 15%;
      padding-top: 1vh;
      display: flex;
      align-items: center;
      flex-direction: row;
      .titleTag {
        margin: 0 1.5vh;
        width: 0.5vh;
        height: 1.4vh;
        background: rgba(236, 132, 68, 1);
        border-radius: 3px;
      }
      .titleText {
        font-size: 11px;
        color: white;
      }
    }
    .chart {
      width: 100%;
      flex: 1;
    }
  }
  .scrollBox {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .titleBox {
      width: 100%;
      height: 15%;
      padding-top: 1vh;
      display: flex;
      align-items: center;
      flex-direction: row;
      .titleTag {
        margin: 0 1.5vh;
        width: 0.5vh;
        height: 1.4vh;
        background: rgba(183, 68, 236, 1);
        border-radius: 3px;
      }
      .titleText {
        font-size: 11px;
        color: white;
      }
    }
    .listBox {
      padding: 0.5vh;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .listHead {
        width: 100%;
        border-bottom: 1px solid #4f7399;
        display: flex;
        justify-content: space-around;
        .headItem {
          color: rgba(0, 170, 230, 1);
          font-size: 12px;
          width: 20%;
          height: 2.5vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .listContent {
        margin: 0.6vh 0;
        width: 100%;
        flex: 1;
        overflow: hidden;
        .listUl {
          width: 100%;
          .listRow {
            display: flex;
            justify-content: space-around;
            .rowItem {
              color: white;
              font-size: 11px;
              width: 20%;
              padding: 0.6vh 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>