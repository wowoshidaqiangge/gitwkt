<template>
  <div class="chartContent">
    <div class="listBox">
      <div class="listHead">
        <div class="headItem">产品编号</div>
        <div class="headItem">设备名称</div>
        <div class="headItem">设备编号</div>
        <div class="headItem">操作工</div>
        <div class="headItem">录入时间</div>
        <div class="headItem">检验员</div>
        <div class="headItem">检验时间</div>
        <div class="headItem">状态</div>
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
              <div class="rowItem">{{ item.deviceName }}</div>
              <div class="rowItem">{{ item.deviceNumber }}</div>
              <div class="rowItem">{{ item.workerUser }}</div>
              <div class="rowItem">{{ item.createTime }}</div>
              <div class="rowItem">{{ item.checkExamUser }}</div>
              <div class="rowItem">{{ item.checkExamTime }}</div>
              <div class="rowItem">{{ item.qualityStateMsg }}</div>
            </div>
          </div>
        </vue-seamless-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import './plugin';
import { produceAddQuality } from '@/api/globalPage';

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
      produceAddQuality()
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            for (let item of res) {
              item.qualityStateMsg = item.qualityState == 1 ? '合格' : '不合格';
              item.workerUser = item.workerUser.split('"')[1];
              item.checkExamUser = item.checkExamUser.split('"')[1];
              item.createTime = item.createTime.split(' ')[0];
              item.checkExamTime = item.checkExamTime.split(' ')[0];
            }
            console.log('左3', res);
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
  overflow: hidden;
  .listBox {
    // padding: 1.5vh 1vh 1vh 1vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    .listHead {
      width: 100%;
      margin-top: 0.5rem;
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
</style>
