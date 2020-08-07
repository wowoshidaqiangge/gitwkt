<!-- 方圆阀门大屏 -->
<template>
  <el-main class="valvePage" element-loading-text="加载中。。。" element-loading-background="RGBA(0, 18, 53, 0.5)">
    <div class="header">
      <!-- <div class="leftWelcome">
        <div class="welcomeText">欢迎您，{{ userName }}</div>
      </div> -->
      <div class="centerTitle">
        <div class="title" @click="goControl">方圆阀门生产管理系统</div>
      </div>
      <!-- <div class="rightTime">
        <div class="currentTime">{{ currentTmie }}</div>
        <div class="quit">退出</div>
      </div> -->
    </div>
    <div class="main">
      <div class="top">
        <div class="topBox itemBox">
          <div class="title">巡检维修</div>
          <!-- <inspection class="chartBox"></inspection> -->
        </div>
        <div class="topBox itemBox">
          <div class="title">业务数量统计</div>
          <businessNum class="chartBox"></businessNum>
        </div>
        <div class="topBox itemBox">
          <div class="title">考勤数据</div>
          <attendance class="chartBox"></attendance>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="leftTop">
            <div class="title">月巡检维修次数</div>
            <monthrepair class="chartBox"></monthrepair>
          </div>
          <div class="leftBottom">
            <div class="title">试压列表</div>
            <div class="listBox">
              <div class="listHead">
                <div class="headItem">工单号</div>
                <div class="headItem">产品品号</div>
                <div class="headItem">单据日期</div>
                <div class="headItem">移入工艺</div>
                <div class="headItem">产品品名</div>
                <div class="headItem">产品规格</div>
                <div class="headItem">数量</div>
                <div class="headItem">合格数</div>
              </div>
              <div class="listContent" v-if="pushDataList.length>0">
                <vue-seamless-scroll class="seamless_warp" v-if="pushDataList[0].orderId" :data="pushDataList"
                  :class-option="scrollOption">
                  <div class="listUl">
                    <div class="listRow" v-for="(item, index) in pushDataList" :key="index">
                      <div class="rowItem">{{item.orderId}}</div>
                      <div class="rowItem">{{item.itemCode}}</div>
                      <div class="rowItem">{{item.dataCreate}}</div>
                      <div class="rowItem">{{item.transferCraft}}</div>
                      <div class="rowItem">{{item.itemName}}</div>
                      <div class="rowItem">{{item.itemModel}}</div>
                      <div class="rowItem">{{item.orderNumber}}</div>
                      <div class="rowItem">{{item.orderStock}}</div>
                    </div>
                  </div>
                </vue-seamless-scroll>
              </div>
            </div>
          </div>
        </div>
        <div class="middle">
          <div class="midTop">
            <div class="title">设备信息</div>
            <!-- <deviceInfo class="chartBox"></deviceInfo> -->
            <div class="deviceInfo">
              <div class="infoBox">
                <div class="imgBox">
                  <img src="~@/assets/img/valvePage/icon1.png">
                </div>
                <div class="textBox">
                  <div class="textTitle">设备总数</div>
                  <div class="text"><span>{{deviceInfo.total}}</span> 个</div>
                </div>
              </div>
              <div class="infoBox">
                <div class="imgBox">
                  <img src="~@/assets/img/valvePage/icon2.png">
                </div>
                <div class="textBox">
                  <div class="textTitle">运行设备总数</div>
                  <div class="text"><span>{{deviceInfo.run}}</span> 个</div>
                </div>
              </div>
              <div class="infoBox">
                <div class="imgBox">
                  <img src="~@/assets/img/valvePage/icon3.png">
                </div>
                <div class="textBox">
                  <div class="textTitle">设备利用率</div>
                  <div class="text"><span>{{deviceInfo.useRate}}</span> %</div>
                </div>
              </div>
            </div>
            <div class="mapBox"></div>
          </div>
          <div class="midBottom">
            <div class="title">本月每日工单数</div>
            <monthwork class="chartBox"></monthwork>
          </div>
        </div>
        <div class="right">
          <div class="rightTop">
            <div class="title">工单信息</div>
            <workinfo class="chartBox"></workinfo>

          </div>
          <div class="rightBottom">
            <div class="title">工单列表</div>
            <div class="listBox">
              <div class="listHead">
                <div class="headItem">工单号</div>
                <div class="headItem">产品品号</div>
                <div class="headItem">生产人员</div>
                <div class="headItem">状态码</div>
                <div class="headItem">产品品名</div>
                <div class="headItem">产品规格</div>
                <div class="headItem">数量</div>
              </div>
              <div class="listContent" v-if="workDataList.length>0">
                <vue-seamless-scroll class="seamless_warp" v-if="workDataList[0].orderId" :data="workDataList"
                  :class-option="scrollOption">
                  <div class="listUl">
                    <div class="listRow" v-for="(item, index) in workDataList" :key="index">
                      <div class="rowItem">{{item.orderId}}</div>
                      <div class="rowItem">{{item.itemCode}}</div>
                      <div class="rowItem">{{item.orderManage}}</div>
                      <div class="rowItem">{{item.orderState}}</div>
                      <div class="rowItem">{{item.itemName}}</div>
                      <div class="rowItem">{{item.itemModel}}</div>
                      <div class="rowItem">{{item.orderNumber}}</div>
                    </div>
                  </div>
                </vue-seamless-scroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
// 引入api
import { api } from './index'
// 引入echarts
// import echarts from 'echarts';
// 巡检维修 巡检统计
// import inspection from './inspection'
// 业务数量统计
import businessNum from './businessNum'
// 考勤数据
import attendance from './attendance'
// 月巡检维修次数
import monthrepair from './monthrepair'
// 设备信息
// import deviceInfo from './deviceInfo'
// 工单信息
import workinfo from './workinfo'
// 本月每日工单数
import monthwork from './monthwork'
export default {
  components: {
    //  inspection,deviceInfo
    businessNum, attendance, monthrepair, monthwork, workinfo
  },
  data() {
    return {
      // loading: true, // 未加载完成动画
      scrollOption: {
        direction: 0,
        step: 0.5,
        limitMoveNum: 0,
        openWatch: true
      },
      pushDataList: [],  // 试压列表
      workDataList: [],  // 工单列表
      deviceInfo: {
        run: 0,
        total: 0,
        useRate: 0,
      },
      page: {
        current: 1,
        size: 10
      },
    };
  },
  created() {
    this.leftList()
    this.rightList()
    this.getDeviceInfo()
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
  },
  computed: {},
  methods: {
    goControl() {
      // this.$router.push({ path: `/${this.nextroute}` })
    },
    // 试压列表
    leftList() {
      api.pressureList(this.page).then(res => {
        if (res.code == 0) {
          this.pushDataList = res.data.records
        }
      }).catch((e) => { console.log(e) });
    },
    // 工单列表
    rightList() {
      api.erpProduceList(this.page).then(res => {
        if (res.code == 0) {
          this.workDataList = res.data.records
        }
      }).catch((e) => { console.log(e) });
    },
    // 设备信息
    getDeviceInfo() {
      api.deviceInfo().then(res => {
        if (res.code == 0) {
          res.data.useRate = res.data.useRate.toFixed(2)
          this.deviceInfo = res.data
        }
      }).catch((e) => { console.log(e) });
    },
  }
};
</script>
<style lang="less">
.valvePage {
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  background: RGBA(0, 10, 59, 0.9);
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  // .create-isLoading{
  //   .el-loading-text{
  //     color:white;
  //   }
  // }
  div {
    box-sizing: border-box;
  }
  .header {
    display: flex;
    width: 100%;
    background: url('~@/assets/img/valvePage/topTitle.png') no-repeat;
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
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    // height: 0; // 与下面overflow作用一样
    overflow: hidden;
    .top {
      width: 100%;
      height: 33%;
      display: flex;
      justify-content: space-between;
      .topBox {
        width: 33%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        position: relative;
        .title {
          color: #00ffff;
          font-size: 14px;
          width: 6vw;
          height: 2vh;
          border: 1px solid RGBA(0, 108, 200, 1);
          position: absolute;
          left: 5vw;
          top: -1.5vh;
        }
      }
    }
    .bottom {
      margin: 20px 0 0;
      width: 100%;
      height: 66%;
      display: flex;
      justify-content: space-between;

      .left {
        width: 33%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .leftTop {
          width: 100%;
          height: 43%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            width: 6vw;
            height: 2vh;
            border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
        }
        .leftBottom {
          margin: 20px 0 0;
          width: 100%;
          height: 52%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            width: 6vw;
            height: 2vh;
            border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
          .listBox {
            padding: 1.5vh 1vh 1vh 1vh;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            .listHead {
              width: 100%;
              border-bottom: 1px solid #4f7399;
              display: flex;
              justify-content: space-around;
              .headItem {
                color: rgba(0, 170, 230, 1);
                font-size: 12px;
                width: 12.5%;
                height: 2.5vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .listContent {
              margin-top: 0.6vh;
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
                    width: 12.5%;
                    padding: 0.6vh 0;
                    display: flex;
                    // text-align: center;
                    align-items: center;
                    justify-content: center;
                    // white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
            }
          }
        }
      }
      .middle {
        width: 33%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .midTop {
          width: 100%;
          height: 65%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            width: 6vw;
            height: 2vh;
            border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
          .deviceInfo {
            top: 8%;
            position: absolute;
            padding: 0 2vh;
            width: 100%;
            height: 28%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .infoBox {
              width: 28%;
              height: 60%;
              border: 1px solid rgba(26, 63, 129, 1);
              border-radius: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .imgBox {
                width: 40%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  width: 70%;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                }
              }
              .textBox {
                width: 55%;
                height: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                .textTitle {
                  color: rgba(2, 217, 253, 1);
                  font-size: 11px;
                  // webkit-text-size-adjust: none;
                }
                .text {
                  color: white;
                  font-size: 12px;
                  span {
                    font-size: 16px;
                  }
                }
              }
            }
          }
          .mapBox {
            top: 30%;
            position: absolute;
            width: 100%;
            height: 70%;
            background: url('~@/assets/img/valvePage/map.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .midBottom {
          margin: 20px 0 0;
          width: 100%;
          height: 30%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            // width: 6vw;
            // height: 2vh;
            // border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
        }
      }
      .right {
        width: 33%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .rightTop {
          width: 100%;
          height: 55%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            width: 6vw;
            height: 2vh;
            border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
        }
        .rightBottom {
          margin: 20px 0 0;
          width: 100%;
          height: 40%;
          position: relative;
          .title {
            color: #00ffff;
            font-size: 14px;
            width: 6vw;
            height: 2vh;
            border: 1px solid RGBA(0, 108, 200, 1);
            position: absolute;
            left: 5vw;
            top: -1.5vh;
          }
          .listBox {
            padding: 1.5vh 1vh 1vh 1vh;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            .listHead {
              width: 100%;
              border-bottom: 1px solid #4f7399;
              display: flex;
              justify-content: space-around;
              .headItem {
                color: rgba(0, 170, 230, 1);
                font-size: 12px;
                width: 12.5%;
                height: 2.5vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
            .listContent {
              margin-top: 0.6vh;
              width: 100%;
              flex: 1;
              overflow: hidden;
              .listUl {
                width: 100%;
                // padding: 0;
                // margin: 0;
                .listRow {
                  display: flex;
                  justify-content: space-around;
                  .rowItem {
                    color: white;
                    font-size: 11px;
                    width: 12.5%;
                    padding: 0.6vh 0;
                    display: flex;
                    // text-align: center;
                    align-items: center;
                    justify-content: center;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.itemBox {
  background: url('~@/assets/img/valvePage/chartBox.png') no-repeat;
  background-size: 100% 100%;
  opacity: 1;
}
.chartBox {
  width: 100%;
  height: 100%;
}
</style>
