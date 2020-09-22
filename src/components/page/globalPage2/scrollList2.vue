<template>
  <div class="chartContent">
    <div class="listBox">
      <div class="listHead listHead1">
        <div class="head1Item"></div>
        <div class="head1Item"></div>
        <div class="head1Item"></div>
        <div class="head1Item"></div>
        <div class="head1Item">组合</div>
        <div class="head1Item"></div>
        <div class="head1Item"></div>
      </div>
      <div class="listHead">
        <div class="headItem head2Item">产品编号</div>
        <!-- <div class="headItem">日期</div> -->
        <div class="headItem head2Item">等级</div>
        <div class="headItem head2Item">轨高</div>
        <div class="headItem head2Item">轨宽</div>
        <div class="headItem">
          头部
        </div>
        <div class="headItem">
          中1
        </div>
        <div class="headItem">
          中2
        </div>
        <div class="headItem">
          中3
        </div>
        <div class="headItem">
          尾部
        </div>

        <div class="headItem head2Item">平行度</div>
        <div class="headItem head2Item">检验员</div>
      </div>
      <div class="listContent" v-if="tableData.length > 0">
        <vue-seamless-scroll
          class="seamless_warp"
          :data="tableData"
          :class-option="scrollOption"
          v-if="tableData[0].productCode"
        >
          <div class="listUl">
            <div class="listRow" v-for="(item, index) in tableData" :key="index">
              <div class="rowItem">{{ item.productCode }}</div>
              <!-- <div class="rowItem">{{ item.createTime }}</div> -->
              <div class="rowItem">{{ item.rank }}</div>
              <div class="rowItem">{{ item.guideHeight }}</div>
              <div class="rowItem">{{ item.guideWidth }}</div>
              <!-- TODO -->
              <div class="rowItem">{{ item.combinationHeader }}</div>
              <div class="rowItem">{{ item.combinationCentreOne }}</div>
              <div class="rowItem">{{ item.combinationCentreTwo }}</div>
              <div class="rowItem">{{ item.combinationCentreThree }}</div>
              <div class="rowItem">{{ item.combinationFoot }}</div>

              <div class="rowItem">{{ item.parallel }}</div>
              <div class="rowItem">{{ item.checkExamUser }}</div>
            </div>
          </div>
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import './plugin';
import { produceStateQuality } from '@/api/globalPage';

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      scrollOption: {
        direction: 0,
        step: 0.5,
        limitMoveNum: 0,
        openWatch: true
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      produceStateQuality()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            for (let item of res) {
              if (item.checkExamUser) {
                item.checkExamUser = item.checkExamUser.split('"')[1];
              }
              if (item.createTime) {
                item.createTime = item.createTime.split(' ')[0];
              }
            }
            console.log('中上', res);
            this.tableData = res;
          }
        })
        .catch(e => {
          console.log(e);
          debugger;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  // height: 50%;
  .listBox {
    box-sizing: border-box;
    padding: 1.5vh 1.5vh 1vh 1vh;
    width: 100%;
    height: 35vh;
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

      .headItem:nth-child(5) {
        border-left: 1px solid #4f7399;
      }
      .headItem:nth-child(9) {
        border-right: 1px solid #4f7399;
      }

      .head2Item {
        margin-top: -1.25vh;
      }
    }
    .listHead1 {
      border-top: 1px solid #4f7399;
      border-bottom-style: none;
      .head1Item {
        color: rgba(0, 170, 230, 1);
        font-size: 12px;
        width: 12.5%;
        height: 2.5vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .head1Item:nth-child(5) {
        width: 62.5%;
        border-left: 1px solid #4f7399;
        border-right: 1px solid #4f7399;
        border-bottom: 1px solid #4f7399;
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
          // .rowItem :first-child{
          //   width: 10%;
          // }
        }
      }
    }
  }
}
</style>
