<template>
  <div class="production">
    <el-row type="flex" justify="start" class="pageheader">
      <el-col :span="3" class="pageheader_item">
        <el-date-picker style="width:100%" placeholder="请选择日期"  v-model="searchInfo.dateTime"  type="date" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="3" class="pageheader_item">
        <el-input style="width:100%" v-model="searchInfo.beginProductCode" placeholder="起始产品编码" >
        </el-input>
      </el-col>
      <el-col :span="3" class="pageheader_item">
        <el-input style="width:100%" v-model="searchInfo.endProductCode"  placeholder="结束产品编码">
        </el-input>
      </el-col>
      <div class="pageheader_item">
        <el-button type="add" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
      </div>
      <div style="flex:1">
        <div style="float:right;">
          <el-button type="add">EXCEL导出</el-button>
        </div>
      </div>
    </el-row>
    <div class="tablebox">
      <el-table :data="tableData" stripe border :header-cell-style="{
          background: '#fddd9b66 !important',
          color: '#333'
        }" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.processList" stripe border style="width: 100%" lazy :header-cell-style="{
                background: '#f0f9eb !important',
                color: '#666'
              }">
              <!-- <el-table-column type="expand">
                <template slot-scope="props2">
                  <el-table :data="props2.row.reportList" stripe border lazy :header-cell-style="{
                      background: '#f0f9eb !important',
                      color: '#888'
                    }">
                    <el-table-column v-for="(item, index) in columnlist2" :key="index" :width="item.width"
                      :prop="item.prop" :label="item.label" align="center"></el-table-column>
                  </el-table>
                  <br />
                  <el-table :data="props2.row.qualityList" stripe border lazy :header-cell-style="{
                      background: '#f0f9eb !important',
                      color: '#888'
                    }">
                    <el-table-column v-for="(item, index) in columnlist2" :key="index" :width="item.width"
                      :prop="item.prop" :label="item.label" align="center"></el-table-column>
                  </el-table>
                </template>
              </el-table-column> -->
              <el-table-column v-for="(item, index) in columnlist3" :key="index" :prop="item.prop" :label="item.label"
                align="center"></el-table-column>
              <!-- <el-table-column prop="produceDuration" label="生产用时" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{
                      scope.row.produceDuration
                        ? scope.row.produceDuration + ' day'
                        : ''
                    }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="produceTaskPlanState" label="状态" width="130" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.state === 1">{{
                    scope.row.produceTaskPlanState
                  }}</span>
                  <span style="color:#E6A23C" v-if="scope.row.state === 2">{{ scope.row.produceTaskPlanState }}</span>
                  <span style="color:#409EFF" v-if="scope.row.state === 3">{{ scope.row.produceTaskPlanState }}</span>
                  <span style="color:#67C23A" v-if="scope.row.state === 4">{{ scope.row.produceTaskPlanState }}</span>
                  <span style="color:#F56C6C" v-if="scope.row.state === 5">{{ scope.row.produceTaskPlanState }}</span>
                  <span style="color:#909399" v-if="scope.row.state === 6">{{ scope.row.produceTaskPlanState }}</span>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </el-table-column>
        <el-table-column v-for="item in columnlist1.slice(0, 5)" :key="item.id" :prop="item.prop" :label="item.label"
          align="center">
        </el-table-column>
        <el-table-column label="组合" align="center">
          <el-table-column v-for="(item, index) in columnlist2" :key="index" :width="item.width" :prop="item.prop"
            :label="item.label" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column v-for="item in columnlist1.slice(5,7)" :key="item.id" :prop="item.prop" :label="item.label"
          align="center">
        </el-table-column>
        <!-- <el-table-column prop="produceDuration" label="生产用时" align="center" width="120">
          <template slot-scope="scope">
            <span>{{
                scope.row.produceDuration
                  ? scope.row.produceDuration + ' day'
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="produceTaskState" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">{{
              scope.row.produceTaskState
            }}</span>
            <span style="color:#E6A23C" v-if="scope.row.state === 2">{{ scope.row.produceTaskState }}</span>
            <span style="color:#409EFF" v-if="scope.row.state === 3">{{ scope.row.produceTaskState }}</span>
            <span style="color:#67C23A" v-if="scope.row.state === 4">{{ scope.row.produceTaskState }}</span>
            <span style="color:#F56C6C" v-if="scope.row.state === 5">{{ scope.row.produceTaskState }}</span>
            <span style="color:#909399" v-if="scope.row.state === 6">{{ scope.row.produceTaskState }}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="page">
        <el-pagination :background='true' :current-page.sync="pagesize" @current-change="handleCurrentChange"
          layout="total, prev, pager, next" :total="totals">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getProduceRetrospect } from 'api/tool';

import moment from 'moment';
import { mapState } from 'vuex';
export default {
  name: 'retroSpect',
  components: {},
  computed: {
    ...mapState(['screenHeight'])
  },
  watch: {
    // 监听高度
    // screenHeight(newVal, oldVal) {
    //   if (newVal) {
    //     this.screenCusHeigth = newVal - 300 + 'px';
    //   }
    // }
  },
  data() {
    return {
      searchInfo: {
        dateTime: '',
        beginProductCode: '',
        endProductCode: ''
      },
      pagesize: 1,
      totals: 0,
      orderlist: [],
      dateValue: '',
      searchinfo: {
        productCode: '',
        beginTime: '',
        endTime: '',
      },
      page: {
        current: 1,
        size: 10
      },
      loading: false,
      tableData: [],
      columnlist1: [
        { prop: 'productCode', label: '产品编码', id: '1' },
        { prop: 'createTime', label: '日期', id: '2' },
        { prop: 'rank', label: '等级', id: '3' },
        { prop: 'guideHeight', label: '轨高', id: '4' },
        { prop: 'guideWidth', label: '轨宽', id: '5' },
        { prop: 'checkExamUserOut', label: '检查员', id: '6' },
        { prop: 'remark', label: '备注', id: '7' },
      ],
      columnlist2: [
        { prop: 'combinationHeader', label: '头' },
        { prop: 'combinationCentreOne', label: '中1' },
        { prop: 'combinationCentreTwo', label: '中2' },
        { prop: 'combinationCentreThree', label: '中3' },
        { prop: 'combinationFoot', label: '尾' },
      ],
      columnlist3: [
        { prop: 'workprocessName', label: '设备工序' },
        { prop: 'recordTime', label: '录入时间', },
        { prop: 'deviceNumber', label: '设备编码', },
        { prop: 'deviceName', label: '设备名称', },
        { prop: 'operator', label: '操作工', },
        { prop: 'checkTime', label: '检验时间', },
        { prop: 'checkExamUserIn', label: '检验员', },
        { prop: 'state', label: '状态', },

      ],
    };
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      // this.getproduceTaskStateList();
      this.getProduceRetrospectData();
    },
    // API:查询状态列表
    // getproduceTaskStateList() {
    //   produceTaskStateList().then(res => {
    //     if (res.code === '0') {
    //       this.orderlist = res.data;
    //     }
    //   });
    // },
    // API:获取数据
    getProduceRetrospectData() {
      // this.loading = true;
      let obj = { ...this.page, ...this.searchInfo }
      getProduceRetrospect(obj).then(res => {
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            if (item.checkExamUserOut) {
              item.checkExamUserOut = item.checkExamUserOut.split('"')[1]
            }
            if (item.processList) {
              item.processList.map((v) => {
                if (v.checkExamUserIn) {
                  v.checkExamUserIn = v.checkExamUserIn.split('"')[1]
                }
                if (v.operator) {
                  v.operator = v.operator.split('"')[1]
                }
              })
            }
          })
          this.tableData = res.data.records;
          this.pagesize = parseInt(res.data.current)
          this.totals = parseInt(res.data.total)
          this.loading = false;
        }
      });
      /*this.tableData = [
        {
          productCode: "15A0612001",
          createTime: "2020-06-19 15:28:48",
          rank: "P",
          guideHeight: "28.790",
          guideWidth: "34.024",
          combination: "54.985",
          checkUser: "检验甲",
          remark: "这是备注",
          processList: [{
            workProcessName: "打孔",
            recordTime: "2020-06-19 15:28:48",
            id: "001",
            name: "打孔设备",
            operator: "员工甲",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验甲",
            state: "合格",
          },
          {
            workProcessName: "调直",
            recordTime: "2020-06-19 15:28:48",
            id: "002",
            name: "调直设备",
            operator: "员工乙",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验乙",
            state: "不合格",
          }]
        },
        {
          productCode: "15A0612001",
          createTime: "2020-06-19 15:28:48",
          rank: "P",
          guideHeight: "28.790",
          guideWidth: "34.024",
          combination: "54.985",
          checkUser: "检验甲",
          remark: "这是备注",
          processList: [{
            workProcessName: "打孔",
            recordTime: "2020-06-19 15:28:48",
            id: "001",
            name: "打孔设备",
            operator: "员工甲",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验甲",
            state: "合格",
          },
          {
            workProcessName: "调直",
            recordTime: "2020-06-19 15:28:48",
            id: "002",
            name: "调直设备",
            operator: "员工乙",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验乙",
            state: "不合格",
          }]
        },
        {
          productCode: "15A0612001",
          createTime: "2020-06-19 15:28:48",
          rank: "P",
          guideHeight: "28.790",
          guideWidth: "34.024",
          combination: "54.985",
          checkUser: "检验甲",
          remark: "这是备注",
          processList: [{
            workProcessName: "打孔",
            recordTime: "2020-06-19 15:28:48",
            id: "001",
            name: "打孔设备",
            operator: "员工甲",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验甲",
            state: "合格",
          },
          {
            workProcessName: "调直",
            recordTime: "2020-06-19 15:28:48",
            id: "002",
            name: "调直设备",
            operator: "员工乙",
            checkTime: "2020-06-19 20:22:48",
            checker: "检验乙",
            state: "不合格",
          }]
        },
      ]
      this.totals = this.tableData.length*/
    },
    // 处理日期参数
    // changedate(val) {
    //   this.searchInfo.beginTime = moment(val[0]).format('YYYY-MM-DD');
    //   this.searchInfo.endTime = moment(val[1]).format('YYYY-MM-DD');
    // },
    //搜索
    handleSearch() {
      this.getProduceRetrospectData();
    },
    //重置
    handleReset() {
      this.searchInfo= {
        dateTime: '',
        beginProductCode: '',
        endProductCode: ''
      },
      this.searchInfo={
        productCode: '',
        beginTime: '',
        endTime: '',
      }
      this.dateValue = '';
      this.getProduceRetrospectData();
    },
    //分页
    handleCurrentChange(val) {
      this.page.current = val
      this.getProduceRetrospectData()
    }
  }
};
</script>

<style lang="less">
.production {
  .pageheader {
    margin: 15px 0;
    .box {
      width: 100%;
    }
    .margin {
      margin: 0 20px;
    }
    .pageheader_item {
      margin: 0 15px;
    }
    // .el-form-item__label {
    //   width: 120px;
    // }
    // .el-input__inner {
    //   width: 189px;
    // }
    // .datetime {
    //   width: 100%;
    // }

    .el-button {
      margin-right: 10px;
      height: 32px;
    }
  }
  .page {
    margin-top: 10px;
    float: right;
  }
  .el-pager li.active {
    background-color: #409baf !important;
    color: #fff;
  }
}
</style>