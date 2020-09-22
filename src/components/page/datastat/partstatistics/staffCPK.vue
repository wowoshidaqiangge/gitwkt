<template>
  <div class="staffCPK">
    <div class="top">
      <el-form :model="seachinfo" ref="seachinfo">
        <el-row type="flex" justify="start">
          <el-col :span="4">
            <el-form-item label="" prop="date">
              <el-date-picker v-model="date" type="daterange" range-separator="——" start-placeholder="开始日期"
                end-placeholder="结束日期" style="width:100%" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="margin">
            <el-form-item prop="itemCode" style="width:100%">
              <el-input placeholder="输入物料编号" v-model="seachinfo.itemCode"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="workprocessName" style="width:100%">
              <el-input placeholder="输入工序名称" v-model="seachinfo.workprocessName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="margin">
            <el-form-item prop="userName" style="width:100%">
              <el-input placeholder="输入员工姓名" v-model="seachinfo.userName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button @click="search">查询</el-button>
          </el-col>
          <div style="flex:1">
            <el-button type="primary" style="float:right" @click="handleExcel">EXCEL导出</el-button>
          </div>
        </el-row>

      </el-form>
    </div>
    <div class="middle">
      <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination :background="true" :current-page.sync="pagesize" @current-change="handleCurrentChange"
        layout="total, prev, pager, next" :total="totals" :page-size="page.size">
      </el-pagination>
    </div>
  </div>

</template>
<script>
import moment from 'moment';
import { export2Excel } from '@/utils/util.js';
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { staffCPK } from 'api/tool'
export default {
  itemName: 'staffCPK',
  components: {
  },
  data() {
    return {
      date: '',
      seachinfo: {
        itemCode: '',
        workprocessName: '',
        userName: ''
      },
      tableData: [],
      excelData: [],  //导出excel表格用的tableData
      columnlist: [
        { prop: 'taskNumber', label: '生产工单' },
        { prop: 'itemCode', label: '物料编号' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'workprocessName', label: '工序' },
        { prop: 'username', label: '加工者' },
        { prop: 'finishTime', label: '完工时间' },
        { prop: 'cpkValue', label: 'CPK值' },
        { prop: 'rank', label: '等级' },
      ],
      page: {
        current: 1,
        size: 10
      },
      pagesize: 1,
      totals: 0,
    };
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 导出EXCEL
    handleExcel: async function () {
      await this.getExcelData()
      let time = moment(new Date()).format("YYYYMMDD")
      export2Excel(this.columnlist, this.excelData, `员工CPK-${time}`)
      // .then(() => {
      //   this.$message.success('导出成功');
      // })
    },
    getExcelData: async function () {
      let dayTime = {}
      if (this.date) {
        dayTime = {
          startTime: this.date[0],
          endTime: this.date[1]
        }
      } else {
        dayTime = {
          startTime: '',
          endTime: ''
        }
      }
      let obj = { ...this.seachinfo, ...dayTime, current: 1, size: 9999 }
      await staffCPK(obj).then(res => {
        if (res.code === '0') {
          this.excelData = res.data.records
        }
      })
    },
    getTableData() {
      let dayTime = {}
      if (this.date) {
        dayTime = {
          startTime: this.date[0],
          endTime: this.date[1]
        }
      } else {
        dayTime = {
          startTime: '',
          endTime: ''
        }
      }
      let obj = { ...this.seachinfo, ...dayTime, ...this.page }
      staffCPK(obj).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.records
          this.totals = parseInt(res.data.total)
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        else if (index === 6) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = (sums[index] / values.length).toFixed(2)
          } else {
          }
        } else if (index === 7) {
          const avg = parseFloat(sums[6])
          if (avg >= 1.67) {
            sums[index] = 'A+'
          } else if (avg < 1.67 || sums[6] >= 1.33) {
            sums[index] = 'A'
          } else if (avg < 1.33 || sums[6] >= 1.00) {
            sums[index] = 'B'
          } else if (avg < 1.00 || sums[6] >= 0.67) {
            sums[index] = 'C'
          } else if (avg < 0.67) {
            sums[index] = 'D'
          }
          // debugger
        }
      });
      return sums;
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    search() {
      this.page.current = 1
      this.getTableData()
    }
  }
};
</script>

<style lang="less">
.staffCPK {
  width: 100%;
  height: auto;
  position: relative;
  .box {
    width: 100%;
  }
  .margin {
    margin: 0 20px;
  }
  .top {
    margin: 0 30px;

    .el-button {
      color: white;
      background: #409baf;
    }
  }
  .middle {
    margin: 20px 30px;
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