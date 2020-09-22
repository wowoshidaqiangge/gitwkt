<!-- 大屏 -->
<template>
  <el-main
    class="dashboard"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-background="RGBA(0, 18, 53, 0.5)"
  >
    <div class="header">
      <div class="center__title">
        <img src="@/assets/img/wkt.png" class="center__img" />
        <span class="center__text" @click="goControl"> 联通5G全连接工厂管理平台 </span>
      </div>
      <!-- <div class="right__time">
        <div class="currentTime">{{ currentTmie }}</div>
        <div class="quit">退出</div>
      </div> -->
    </div>

    <div class="main">
      <div class="sideMain">
        <div class="chartBox">
          <div class="chartTitle chartTitleLeft">零件工单状态</div>
          <pieOrderState class="chartContent"></pieOrderState>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleLeft">年工序合格率</div>
          <barLineWorkprocess class="chartContent"></barLineWorkprocess>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleLeft">产品录入质检情况</div>
          <scrollList class="chartContent"></scrollList>
        </div>
      </div>
      <div class="centerMain">
        <div class="center__top chartBox">
          <div class="chartTitle chartTitleMid">产品综合检验</div>
          <scrollList2 class="chartContent"></scrollList2>
        </div>
        <div class="center__Mid chartBox">
          <div class="chartTitle chartTitleMid">不合格分类统计</div>
          <funnelUnqualityClass class="chartContent"></funnelUnqualityClass>
        </div>
        <div class="center__bottom ">
          <div class="info__slogen">
            <h1>通知：10月10日集体培训</h1>
          </div>
        </div>
      </div>
      <div class="sideMain">
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">计划达成率</div>
          <pie3dOrderCount class="chartContent"></pie3dOrderCount>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">一周产量趋势</div>
          <lineWeekYield2 class="chartContent"></lineWeekYield2>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">员工产量</div>
          <barStaffYield class="chartContent"></barStaffYield>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { userListMenu } from 'api/index';
export default {
  components: {
    // CountTo: () => import('@/components/count-to/count-to'),  // 计数器组件
    pieOrderState: () => import('./pieOrderState'), // 左1
    barLineWorkprocess: () => import('./barLineWorkprocess'), // 左2：柱状折线结合
    scrollList: () => import('./scrollList'), // 左3
    scrollList2: () => import('./scrollList2'), // 中上
    funnelUnqualityClass: () => import('./funnelUnqualityClass'), // 中下 漏斗图
    pie3dOrderCount: () => import('./pie3dOrderCount'), // 右1
    lineWeekYield2: () => import('./lineWeekYield2'), // 右2：本周报工产量趋势
    barStaffYield: () => import('./barStaffYield') // 右3
  },
  data() {
    return {
      loading: false, // 未加载完成动画
      userName: sessionStorage.getItem('ms_username'),
      nextroute: '',
      currentTmie: '', //当前时间
      currentTimer: {}, // 实时日期时间的定时器
      bannerUrl: [{ name: '1111111', url: '~@/assets/img/globalPage/banner1.jpg' }]
    };
  },
  created() {
    this.getuserListMenu();
  },
  mounted() {
    // this.loading = false;
  },
  computed: {},
  methods: {
    goControl() {
      this.$router.push({ path: `/${this.nextroute}` });
      // this.$router.push({ path: `/control` });
    },
    getuserListMenu() {
      userListMenu({ userId: sessionStorage.getItem('userId'), type: 'menu' }).then(res => {
        if (res.code === '0') {
          if (Array.isArray(res.data[0].children) && res.data[0].children.length > 0) {
            this.nextroute = res.data[0].children[0].obj.index;
            return;
          } else if (res.data[0].children == null && Array.isArray(res.data) && res.data.length > 0) {
            this.nextroute = res.data[0].obj.index;
            return;
          } else {
            this.nextroute = '';
            return;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
div {
  box-sizing: border-box;
}
.dashboard {
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  background: url('~@/assets/img/globalPage2/bgp.png') no-repeat;
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
    // background: url('~@/assets/img/globalPage/topTitle.png') no-repeat;
    background-size: 100% 100%;
    height: 8.5vh;
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
    .center__title {
      flex: 1;
      font-size: 30px;
      color: #01c4f7;
      display: flex;
      justify-content: center;
      line-height: 8vh;
      cursor: pointer;
      letter-spacing: 0.25rem;
      user-select: none;
      .center__img {
        // height: 4vh;
        // width: 8vh;
        width:45px;
         height: 45px;
        align-self: center;
        margin-right: 2vh;
      }
      .center__text {
        font-size: 2rem;
        font-weight: bold;
        font-family: Source Han Sans CN;
      }
    }
    .right__time {
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
  .middle {
    margin: 0 2%;
    display: flex;
    flex: 1;
    justify-content: space-between;
    .dataBox {
      display: flex;
      width: 19%;
      background-color: rgba(0, 104, 183, 0.3);
      align-items: center;
      .imgBox {
        flex: 2;
        height: 50%;
        justify-content: flex-end;
        display: block;
        position: relative;
        img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          position: absolute;
          left: 80%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
      .textBox {
        color: white;
        flex: 3;
        height: 50%;
        justify-content: flex-start;
        p {
          margin-left: 5%;
        }
      }
    }
  }
  .main {
    display: flex;
    flex: 8;
    margin: 0.8% 1% 1%;
    height: 0; // 与下面overflow作用一样
    // overflow: hidden;
    .sideMain {
      // padding-bottom: 1%;
      width: 35%;
      display: flex;
      flex-direction: column;
      // background: rgba(137, 87, 161, 0.1);
      // padding: 10px;
    }
    .sideMain:last-child {
      // padding-bottom: 1%;
      width: 32.5%;
      display: flex;
      flex-direction: column;
      // background: rgba(137, 87, 161, 0.1);
      // padding: 10px;
    }
    .centerMain {
      // font-size: white;
      width: 35.5%;

      display: flex;
      flex-direction: column;
      // padding: 0 0 0 1%;
      // margin: 0 0 0 2%;
      .center__top {
      }
      .center__mid {
      }
      .center__bottom {
        position: relative;
        bottom: 0.8%;
        margin: 0 auto;
        width: 90%;
        overflow: hidden;
        .info__slogen {
          width: 100%;
          color: #02d9fd;
          text-align: center;
          // margin: 5% 0;
          font-weight: bold;
          letter-spacing: 6px;
          white-space: nowrap;
          animation: 15s wordsLoop linear infinite normal;
          @keyframes wordsLoop {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        }
        .info__slogen:hover {
          animation: none;
        }
      }
    }
    .chartBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 0 2% 2%;
      overflow: hidden;
      // background: url('~@/assets/img/globalPage/chartBox.png')  no-repeat;
      // background-size: 100% 100%;

      .chartTitle {
        display: flex;
        align-items: center;
        color: #00ffff;
        font-size: 1.4vh;
        letter-spacing: 2px;
      }
      .chartTitleLeft {
        margin-left: 11%;
        // flex: 1;
        height: 11%;
      }
      .chartTitleRight {
        margin-left: 14.5%;
        // flex: 1;
        margin-top: -0.25%;
        height: 11%;
      }
      .chartTitleMid {
        // margin-left: 13%;
        height: 8%;
        position: relative;
        top: -0.5%;
        left: 14%;
      }

      .chartContent {
        flex: 1;
      }
    }
    .chartBox:nth-child(2) {
      .chartTitleLeft {
        margin-top: 1.8%;
      }
      .chartTitleRight {
        margin-top: 1.8%;
        margin-left: 13.5%;
      }
      .chartTitleMid {
        top: 0%;
        left: 12%;
      }
    }
    .chartBox:nth-child(3) {
      .chartTitleLeft {
        margin-top: 0.7%;
      }
      .chartTitleRight {
        margin-top: 0.7%;
        margin-left: 16%;
      }
    }
  }
}
</style>
