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
          <div class="chartTitle chartTitleLeft">工单状态统计</div>
          <pieHalfOrder class="chartContent"></pieHalfOrder>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleLeft">成品生产情况</div>
          <barLineProduct class="chartContent"></barLineProduct>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleLeft">零件生产情况</div>
          <barLinePart class="chartContent"></barLinePart>
        </div>
      </div>
      <div class="centerMain">
        <div class="center__top chartBox">
          <div class="chartTitle chartTitleMid hasLink" @click="openDia">基本信息</div>
          <!-- <div class="info__slogen">
            <h1 class="slogen__text">{{ banner.bannerTitle }}</h1>
          </div> -->
          <el-carousel height="300px" :interval="3000" class="info__banner">
            <el-carousel-item v-for="(item, index) in banner.bannerPicList" :key="index">
              <el-image class="banner__img" :src="item" fit="fill"></el-image>
            </el-carousel-item>
          </el-carousel>
          <edit-modal
            :title="modal.title"
            :dialogVisible="modal.dialogVisible"
            @closeDia="closeDia"
            ref="editModal"
          ></edit-modal>
        </div>

        <div class="center__bottom chartBox">
          <div class="chartTitle chartTitleMid">成品分类统计</div>
          <funnelProduceClass class="chartContent"></funnelProduceClass>
        </div>
      </div>
      <div class="sideMain">
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">产品及合格率</div>
          <pieCircleProduce class="chartContent"></pieCircleProduce>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">一周产量趋势</div>
          <lineWeekYield class="chartContent"></lineWeekYield>
        </div>
        <div class="chartBox">
          <div class="chartTitle chartTitleRight">产品Pareto图</div>
          <barLinePareto class="chartContent"></barLinePareto>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { userListMenu } from 'api/index';
import { baseInfoGet } from 'api/globalPage';
import { isEmpty } from '@/utils/util';

export default {
  components: {
    // CountTo: () => import('@/components/count-to/count-to'),  // 计数器组件
    editModal: () => import('./editModal'),
    pieHalfOrder: () => import('./pieHalfOrder'), // 左1
    barLineProduct: () => import('./barLineProduct'), // 左2：柱状折线结合 - 成品生产
    barLinePart: () => import('./barLinePart'), // 左3：柱状折线结合 - 零件生产
    funnelProduceClass: () => import('./funnelProduceClass'), // 中下 漏斗图
    pieCircleProduce: () => import('./pieCircleProduce'), // 右1：圆环图
    lineWeekYield: () => import('./lineWeekYield'), // 右2：本周报工产量趋势
    barLinePareto: () => import('./barLinePareto') // 右3：产品柏拉图
  },
  data() {
    return {
      loading: false, // 未加载完成动画
      userName: sessionStorage.getItem('ms_username'),
      nextroute: '',
      currentTmie: '', //当前时间
      currentTimer: {}, // 实时日期时间的定时器
      banner: {
        bannerTitle: '热烈欢迎各位领导莅临指导',
        bannerPicList: []
      },
      modal: {
        title: '修改基本信息',
        dialogVisible: false
      }
    };
  },
  created() {
    this.getuserListMenu();
    this.getBaseInfo();
  },
  mounted() {},
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
    },
    getBaseInfo() {
      baseInfoGet().then(res => {
        if (res.code == 0) {
          res = res.data;
          console.log('中上', res);
          const tmp = [];
          res.bannerPicList.map((item, index) => {
            if (item.trim() != '' && item != null) {
              tmp.push(item);
            }
          });
          res.bannerPicList = tmp;
          this.banner = res;
        }
      });
    },
    openDia() {
      this.modal.dialogVisible = true;
      this.$refs.editModal.getParentData(this.banner);
    },
    closeDia() {
      this.modal.dialogVisible = false;
      this.getBaseInfo();
    }
  }
};
</script>
<style lang="less" scoped>
div {
  box-sizing: border-box;
}
.hasLink {
  cursor: pointer;
}
.dashboard {
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
  background: url('~@/assets/img/globalPage/bgp.png') no-repeat;
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
        height:45px;
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
      width: 40.5%;
      display: flex;
      flex-direction: column;
      // padding: 10px;
    }
    .centerMain {
      // font-size: white;
      width: 45%;

      display: flex;
      flex-direction: column;
      padding: 0 0 0 1%;
      margin: 0 0 0 2%;
      .center__top {
        position: relative;
        margin: 0 auto;
        width: 90%;
        .info__slogen {
          position: absolute;
          top: 13%;
          width: 97%;
          margin-left: 1.5%;
          padding: 0.25rem 1rem;
          overflow: hidden;
          border: 2px solid #1a4082;
          border-radius: 10px;
          .slogen__text {
            color: #02d9fd;
            text-align: center;
            font-weight: bold;
            font-family: Source Han Sans CN;
            letter-spacing: 6px;
            white-space: nowrap;
            animation: 15s wordsLoop linear infinite normal;
          }
          .slogen__text:hover {
            animation: none;
          }

          @keyframes wordsLoop {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        }

        .el-carousel {
          overflow-y: hidden;
          top: 7%;
          // height: 58%;
          /deep/ .el-carousel__item {
            border-radius: 5px;
          }
        }

        .banner__img {
          margin-left: 1%;
          width: 98%;
          height: 98%;
          border-radius: 5px;
        }
      }
      .center__bottom {
        // margin-top: 2%;
        // height: 50%;
      }
    }

    .chartBox {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 0 2% 2%;
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
        margin-left: 11.5%;
        // flex: 1;
        height: 11%;
      }
      .chartTitleRight {
        margin-left: 13.5%;
        // flex: 1;
        height: 11%;
      }
      .chartTitleMid {
        height: 7%;
        position: relative;
        left: 11%;
        top: -0.5%;
      }

      .chartContent {
        flex: 1;
      }
    }
    .chartBox:nth-child(2) {
      .chartTitleLeft {
        margin-top: 1.7%;
      }
      .chartTitleRight {
        margin-top: 1.7%;
      }
      .chartTitleMid {
        left: 11%;
        top: -3.5%;
      }
    }
    .chartBox:nth-child(3) {
      .chartTitleLeft {
        margin-top: 0.5%;
      }
      .chartTitleRight {
        margin-top: 0.8%;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
