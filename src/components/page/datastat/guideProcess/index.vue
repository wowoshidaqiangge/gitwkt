<template>
  <div class="production">
    <el-row type="flex" justify="start" class="pageheader">
      <el-col :span="4" class="pageheader_item">
      
        <el-date-picker style="width:100%"  v-model="dateTime" type="daterange" range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col :span="3" class="pageheader_item">
        <el-input style="width:100%" v-model="searchInfo.beginProductCode" placeholder="起始产品编码">
        </el-input>
      </el-col>
      <el-col :span="3" class="pageheader_item">
        <el-input style="width:100%" v-model="searchInfo.endProductCode" placeholder="结束产品编码">
        </el-input>
      </el-col>
      <div class="pageheader_item">
        <el-button type="add" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
      </div>
      <div style="flex:1">
        <div style="float:right;">
          <el-button type="add" @click="handleExcel">EXCEL导出</el-button>
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
             
              <el-table-column v-for="(item, index) in columnlist3" :key="index" :prop="item.prop" :label="item.label"
                align="center"></el-table-column>
            
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
import { export2Excel2, } from '@/utils/util.js';
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
      dateTime:[],
      searchInfo: {
        beginTime: '',
        endTime: '',
        beginProductCode: '',
        endProductCode: ''
      },
      pagesize: 1,
      totals: 0,
      orderlist: [],
      // dateValue: moment(new Date()).format("YYYY-MM"),
      page: {
        current: 1,
        size: 10
      },
      loading: false,
      tableData: [],
      excelData: [],  //导出excel表格用的tableData
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
    this.dateTime[0] = `${moment(new Date()).format('YYYY')}-1-1`
    this.dateTime[1] = moment(new Date()).format('YYYY-MM-DD')
  },
  methods: {
    // 导出EXCEL表格
    handleExcel: async function () {
      await this.getExcelData()
      const multiHeader = [['产品编码', "日期", "等级", "轨高", "轨宽", "组合", "", "", "", "", "检查员", "备注"]]
      const header = ["", "", "", "", "", "头", "中1", "中2", "中3", "尾", "", ""]
      const filterVal = ['productCode', 'createTime', 'rank', 'guideHeight', 'guideWidth',
        'combinationHeader', 'combinationCentreOne', 'combinationCentreTwo', 'combinationCentreThree', 'combinationFoot', 'checkExamUserOut', 'remark']
      const data = this.excelData
      console.log(data)
      const merges = ['A1:A2', 'B1:B2', 'C1:C2', 'D1:D2', 'E1:E2', 'F1:J1', 'K1:K2', 'L1:L2']
      let time = moment(new Date()).format("YYYYMMDD")
      export2Excel2(header, data, `线轨生产追溯${time}`, filterVal, multiHeader, merges)
      // .then(() => {
      //   this.$message.success('导出成功');
      // })
    },
    getExcelData: async function () {
      if(this.dateTime){
        this.searchInfo.beginTime=this.dateTime[0],
        this.searchInfo.endTime=this.dateTime[1]
      }
      let obj = { ...this.searchInfo, current: 1, size: 9999 }
      await getProduceRetrospect(obj).then(res => {
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
          this.excelData = res.data.records;
        }
      });
    },
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
      if(this.dateTime){
        this.searchInfo.beginTime=this.dateTime[0],
        this.searchInfo.endTime=this.dateTime[1]
      }
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
      this.page.current=1
      this.getProduceRetrospectData();
    },
    //重置
    handleReset() {
      this.searchInfo = {
        beginTime: '',
        endTime: '',
        beginProductCode: '',
        endProductCode: ''
      },
      this.dateTime=[],
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