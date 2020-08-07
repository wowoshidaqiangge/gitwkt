<!-- 大屏 -->
<template>
  <el-main class="global" v-loading="loading" element-loading-text="加载中。。。"
    element-loading-background="RGBA(0, 18, 53, 0.5)">
    <div class="header">
      <!-- <div class="leftWelcome">
        <div class="welcomeText">欢迎您，{{ userName }}</div>
      </div> -->
      <div class="centerTitle">
        <div class="title" @click="goControl">威肯特生产管理系统</div>
      </div>
      <!-- <div class="rightTime">
        <div class="currentTime">{{ currentTmie }}</div>
        <div class="quit">退出</div>
      </div> -->
    </div>
    <div class="main">
      <div class="sideMain">
        <div class="chartBox">
          <div class="chartTitle">设备运行情况</div>
          <devOperation class="chartContent" @func="getCircleDateFunc"></devOperation>
        </div>
        <div class="chartBox">
          <div class="chartTitle">设备综合利用率</div>
          <!-- <div class="chartText"></div> -->
          <devUseRate class="chartContent"></devUseRate>
        </div>
        <div class="chartBox">
          <div class="chartTitle">一周产量趋势</div>
          <weekYield class="chartContent"></weekYield>
        </div>
      </div>
      <div class="centerMain">
        <div class="circleSection">
          <div class="circleBox">
            <div class="circleTitle">{{this.circleDate.monthYield}}</div>
            <div class="circleText">本月产量</div>
          </div>
          <div class="circleBox">
            <div class="circleTitle">{{this.circleDate.offCount}}</div>
            <div class="circleText">关机设备数</div>
          </div>
          <div class="circleBox">
            <div class="circleTitle">{{this.circleDate.runCount}}</div>
            <div class="circleText">运行设备总数</div>
          </div>
          <div class="circleBox">
            <div class="circleTitle">{{this.circleDate.useRate}}</div>
            <div class="circleText">设备使用率</div>
          </div>
        </div>
        <div class="devSection">
          <div class="devTitle">
            <div class="lefTitle">设备运行监控</div>
            <div class="rightIcon">
              <div class="greenIcon"></div>
              <div class="iconText">生产</div>
              <div class="blueIcon"></div>
              <div class="iconText">开机</div>
              <div class="redIcon"></div>
              <div class="iconText">故障</div>
              <div class="grayIcon"></div>
              <div class="iconText">关机</div>
            </div>
          </div>
          <div class="devSectionMain">
            <div class="devList" v-for="(v,m) in deviceTypeList1" :key="m" :style="{flex:v.flex}">
              <div class="devTextBox">
                <div class="devText">
                  <div class="text">{{v.deviceType}}</div>
                </div>
              </div>
              <div class="devRobotBox" v-for="(item,index) in v.deviceRunVo" :key='index'>
                <div class="devRobot" v-if='!item.isdevice'>
                  <div :class="item.color"></div>
                  <div class="robot"></div>
                </div>
                <div class="devText" v-if='!item.isdevice'>{{item.deviceNameRecord}}</div>
                <div class="devTextOnly" v-if='item.isdevice'>
                  <div class="text">{{item.deviceNameRecord}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sideMain">
        <div class="chartBox">
          <div class="chartTitle">计划达成率</div>
          <planAchieveRate class="chartContent"></planAchieveRate>
        </div>
        <div class="chartBox">
          <div class="chartTitle">工单状态统计</div>
          <workStatus class="chartContent"></workStatus>
        </div>
        <div class="chartBox">
          <div class="chartTitle">设备工作效率排行</div>
          <!-- <div class="chartText"></div> -->
          <deviceEfficiency class="chartContent"></deviceEfficiency>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import ElementUI from 'element-ui';
import { api } from '@/api/index1'
import { userListMenu } from 'api/index'
import $ from 'jquery';
// 引入路由
import Routers from '@/router';
// 引入echarts
import echarts from 'echarts';
// 设备运行情况图表
import devOperation from './gloabalPage/devOperation'
// 设备综合利用率图表
import devUseRate from './gloabalPage/devUseRate'
// 一周产量趋势图表
import weekYield from './gloabalPage/weekYield'
// 计划达成率图表
import planAchieveRate from './gloabalPage/planAchieveRate'
// 工作状态统计图表
import workStatus from './gloabalPage/workStatus'
// 设备工作效率图表
import deviceEfficiency from './gloabalPage/deviceEfficiency'
export default {
  components: {
    devOperation,
    devUseRate,
    weekYield,
    planAchieveRate,
    workStatus,
    deviceEfficiency
  },
  data() {
    return {
      loading: true, // 未加载完成动画
      userName: sessionStorage.getItem('ms_username'),
      currentTmie: '', //当前时间
      currentTimer: {}, // 实时日期时间的定时器
      nextroute: '',
      deviceTypeList1: '', // 设备监控列表
      deviceTypeList2: '',
      circleDate: {
        monthYield: '',
        offCount: '',
        useRate: '',
        runCount: ''
      }  // 顶部圈内数据
    };
  },
  created() {
    var _this = this;
    this.currentTimer = window.setInterval(function () {
      // 创建当前系统时间的Date对象
      var dateObj = new Date();
      // 获取完整年份值
      var year = dateObj.getFullYear();
      // 获取月份
      var month = dateObj.getMonth() + 1;
      // 获取月份中的日
      var date = dateObj.getDate();
      // 获取星期值
      var day = dateObj.getDay();
      var weeks = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ];
      // 根据星期值，从数组中获取对应的星期字符串
      var week = weeks[day];
      // 获取小时
      var hour = dateObj.getHours();
      // 获取分钟
      var minute = dateObj.getMinutes();
      // 获取秒钟
      var second = dateObj.getSeconds();
      // 如果月、日、时、分、秒的值小于10，在前面补0
      if (month < 10) {
        month = '0' + month;
      }
      if (date < 10) {
        date = '0' + date;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
      _this.currentTmie =
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second;
    }, 1000);
  },
  mounted() {
    //  const loading = this.$loading({
    //   //  customClass: 'create-isLoading',
    //     // lock: true,//lock的修改符--默认是false
    //     // // text: 'Loading',//显示在加载图标下方的加载文案
    //     // // spinner: 'el-icon-loading',//自定义加载图标类名
    //     // background: 'RGBA(0, 18, 53, 0.5)',//遮罩层颜色
    //     // target: document.querySelector('#table')//loading覆盖的dom元素节点
    // });
    this.deviceMonitorFunc()
    this.getuserListMenu()
  },
  computed: {},
  methods: {
    goControl() {
      this.$router.push({ path: `/${this.nextroute}` })
    },
    getuserListMenu() {
      userListMenu({ userId: sessionStorage.getItem('userId'),type:'menu' }).then(res => {
        if (res.code === '0') {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.nextroute = res.data[0].children[0].obj.index
          }
        }
      })
    },
    // API相关
    // 中间圈内数据
    getCircleDateFunc(deviceOperateList) {
      this.circleDate.offCount = deviceOperateList.offCount
      this.circleDate.useRate = deviceOperateList.useRate
      this.circleDate.runCount = deviceOperateList.runCount
      api.getCircleDate().then(response => {
        this.circleDate.monthYield = response.data.currentMonthYield
        console.log(this.circleDate)
      }).catch(function (error) {
        console.log(error);
      });
    },
    // 设备运行监控
    deviceMonitorFunc() {
      this.loading = true
      api.deviceMonitor().then(response => {
        this.loading = false
        console.log(response.data);
        let deviceType1 = []
        let deviceType2 = []
        if (Array.isArray(response.data)) {
          response.data.map((item, index) => {
            if (index < 5) {
              item.deviceRunVo.map((v, m) => {
                if (m > 10) {
                  item.flex = '2'
                } else {
                  item.flex = '1'
                }
                if (v.state === '1') {
                  v.color = 'grayIcon'
                } else if (v.state === '2') {
                  v.color = 'blueIcon'
                } else if (v.state === '3') {
                  v.color = 'greenIcon'
                } else if (v.state === '0') {
                  v.color = 'redIcon'
                }
              })
              deviceType1.push(item)
            } else if (index = 6) {
              item.deviceRunVo.map((v, m) => {
                if (m > 10) {
                  item.flex = '2'
                } else {
                  item.flex = '1'
                }
                if (v.state === '1') {
                  v.color = 'grayIcon'
                } else if (v.state === '2') {
                  v.color = 'blueIcon'
                } else if (v.state === '3') {
                  v.color = 'greenIcon'
                } else if (v.state === '0') {
                  v.color = 'redIcon'
                }
              })
              deviceType2.push(item)
            }
          })
        }
        let att = []
        att.push(...deviceType1[4].deviceRunVo, { deviceNameRecord: '动力类', isdevice: true }, ...deviceType2[0].deviceRunVo)
        let obj = { deviceRunVo: att, deviceType: '喷涂车间' }
        deviceType1[4] = obj
        console.log(att)
        // deviceType1[4] = 
        // console.log(response.data);
        // 设备监控设备状态
        this.deviceTypeList1 = deviceType1
        // this.deviceTypeList2 = deviceType2
        // console.log(this.deviceTypeList1)
      })
        .catch(function (error) {
          console.log(error);
        });
    },

  }
};
</script>
<style lang="less" scoped>
div {
  box-sizing: border-box;
}
.global {
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  background: url('~@/assets/img/globalPage/background.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  // .create-isLoading{
  //   .el-loading-text{
  //     color:white;
  //   }
  // }

  .header {
    display: flex;
    width: 100%;
    background: url('~@/assets/img/globalPage/topTitle.png') no-repeat;
    background-size: 100% 100%;
    .leftWelcome {
      width: 300px;
      color: white;
      font-size: 20px;
      display: flex;
      line-height: 30px;
      .welcomeText {
        padding-left: 20px;
      }
    }
    .centerTitle {
      flex: 1;
      font-size: 30px;
      color: white;
      .title {
        height: 68px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        letter-spacing: 5px;
      }
    }
    .rightTime {
      width: 300px;
      color: white;
      font-size: 20px;
      display: flex;
      line-height: 30px;
      .currentTime {
        padding-left: 10px;
      }
      .quit {
        padding-left: 30px;
      }
    }
  }
  .main {
    display: flex;
    flex: 1;
    // height: 0; // 与下面overflow作用一样
    overflow: hidden;
    .sideMain {
      width: 24%;
      // display: flex;
      // flex-direction: column;
      // padding: 10px;
      .chartBox {
        // flex: 1;
        height: 33%;
        background: url('~@/assets/img/globalPage/chartBox.png')
          no-repeat;
        background-size: 100% 105%;
        position: relative;
        .chartTitle {
          position: absolute;
          background: url('~@/assets/img/globalPage/chartTitle.png')
            no-repeat;
          background-size: 65% 70%;
          background-position-x: center;
          background-position-y: 31px;
          margin: 0px 5px 4px;
          text-align: center;
          padding: 30px 5px;
          width: 100%;
          height: 7.8vh;
          line-height: 31px;
          color: #00f6ff;
          font-size: 14px;
          letter-spacing: 2px;
        }
        .chartText {
          position: absolute;
          left: 50%;
          top: 70px;
          transform: translate(-50%, 50%);
          width: 80%;
          height: 20px;
          color: white;
          font-size: 13px;
          display: flex;
          justify-content: space-around;
          .textBox {
            width: 10%;
            height: 20px;
          }
        }
        .chartContent {
          // flex: 1;
          height: 100%;
          padding-top: 70px;
          text-align: center;
        }
      }
    }
    .centerMain {
      // font-size: white;
      width: 52%;
      display: flex;
      flex-direction: column;
      padding: 10px 0 0 0;
      .circleSection {
        height: 18%;
        display: flex;
        .circleBox {
          display: flex;
          flex-direction: column;
          width: 25%;
          // line-height: 40px;
          .circleTitle {
            background: url('~@/assets/img/globalPage/circle.png')
              no-repeat;
            // background-size: cover;
            background-size: contain;
            background-position-x: center;
            color: #00f6ff;
            text-align: center;
            height: 75%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .circleText {
            text-align: center;
            font-size: 14px;
            color: white;
          }
        }
      }
      .devSection {
        height: 79%;
        display: flex;
        flex-direction: column;
        background: rgba(0, 203, 210, 0.25);
        border-radius: 5px;
        margin-top: 10px;
        .devTitle {
          height: 8%;
          width: 100%;
          position: relative;
          .lefTitle {
            position: absolute;
            left: 15px;
            top: 10px;
            width: 100px;
            height: 20px;
            line-height: 20px;
            border-left: 2px solid #00f6ff;
            color: #00f6ff;
            text-align: center;
            font-size: 14px;
          }
          .rightIcon {
            position: absolute;
            right: 20px;
            top: 10px;
            width: 200px;
            height: 20px;
            display: flex;
            flex-direction: row;
            .greenIcon {
              width: 5px;
              height: 12px;
              margin: 4px;
              background: rgba(72, 227, 69, 1);
              border-radius: 2px;
            }
            .blueIcon {
              width: 5px;
              height: 12px;
              margin: 4px;
              background: rgba(64, 139, 255, 1);
              border-radius: 2px;
            }
            .redIcon {
              width: 5px;
              height: 12px;
              margin: 4px;
              background: rgba(234, 94, 6, 1);
              border-radius: 2px;
            }
            .grayIcon {
              width: 5px;
              height: 12px;
              margin: 4px;
              background: rgba(164, 163, 163, 1);
              border-radius: 2px;
            }
            .iconText {
              margin-right: 5px;
              width: 40px;
              color: white;
              text-align: center;
              line-height: 20px;
              font-size: 12px;
            }
          }
        }
        .devSectionMain {
          position: relative;
          display: flex;
          flex: 1;
          flex-direction: column;
          .styleObj {
            position: absolute;
            left: 27%;
            bottom: 2.6%;
          }
          .devList {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            .styleObj {
              position: absolute;
              left: 40%;
              bottom: 10%;
            }
            .devTextBox {
              width: 9%;
              display: flex;
              flex-direction: column;
              .devText {
                margin: 0 auto;
                width: 2.5vw;
                height: 5.12vh;
                display: flex;
                flex-direction: column;
                .text {
                  font-weight: bold;
                  color: white;
                  font-size: 1.8vh;
                  letter-spacing: 0.3vh;
                  text-align: center;
                }
              }
            }
            .devRobotBox {
              width: 9%;
              display: flex;
              flex-direction: column;
              .devTextOnly {
                margin: 0 auto;
                width: 2.5vw;
                height: 5.12vh;
                display: flex;
                flex-direction: column;
                .text {
                  font-weight: bold;
                  color: white;
                  font-size: 1.8vh;
                  letter-spacing: 0.3vh;
                  text-align: center;
                }
              }
              .devRobot {
                position: relative;
                margin: 0 auto;
                width: 2.5vw;
                height: 5.12vh;
                border: 1px solid rgba(0, 246, 255, 0.6);
                .greenIcon {
                  position: absolute;
                  top: 9%;
                  left: 7%;
                  width: 10%;
                  height: 25%;
                  background: rgba(72, 227, 69, 1);
                  border-radius: 2px;
                }
                .blueIcon {
                  position: absolute;
                  top: 9%;
                  left: 7%;
                  width: 10%;
                  height: 25%;
                  background: rgba(64, 139, 255, 1);
                  border-radius: 2px;
                }
                .redIcon {
                  position: absolute;
                  top: 9%;
                  left: 7%;
                  width: 10%;
                  height: 25%;
                  background: rgba(234, 94, 6, 1);
                  border-radius: 2px;
                }
                .grayIcon {
                  position: absolute;
                  top: 9%;
                  left: 7%;
                  width: 10%;
                  height: 25%;
                  background: rgba(164, 163, 163, 1);
                  border-radius: 2px;
                }
                .robot {
                  position: absolute;
                  top: 20%;
                  left: 16%;
                  width: 65%;
                  height: 65%;
                  background: url('~@/assets/img/globalPage/robot.png')
                    no-repeat;
                  background-size: 100% 100%;
                }
              }
              .devText {
                color: white;
                text-align: center;
                font-size: 1.5vh;
                line-height: 3vh;
              }
            }
          }
        }
      }
    }
  }
}
</style>
