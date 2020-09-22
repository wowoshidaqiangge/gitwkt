<template>
  <div class="workprocessCost">
    <div class="top">
      <el-form :model="seachinfo" ref="seachinfo">
        <el-row type="flex" justify="start">
          <el-col :span="4">
            <el-form-item label="" prop="date">
              <el-date-picker v-model="date" type="daterange" value-format="yyyy-MM-dd" range-separator="——"
                start-placeholder="开始日期" end-placeholder="结束日期" class="box">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="margin">
            <el-form-item prop="taskNumber" class="box">
              <el-input placeholder="输入生产工单号" v-model="seachinfo.taskNumber"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="partCode" class="box">
              <el-input placeholder="输入物料编号" v-model="seachinfo.partCode"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="margin">
            <el-button @click="search">查询</el-button>
          </el-col>
          <div style="flex:1">
            <el-button type="primary" style="float:right" @click="handleExcel">EXCEL导出</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <div class="middle">
      <el-table :data="tableData" border style="width: 100%">
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
import { workprocessCost } from 'api/tool'
export default {
  partName: 'workprocessCost',
  components: {
  },
  data() {
    return {
      date: '',
      seachinfo: {
        partCode: '',
        taskNumber: '',
      },
      tableData: [],
      excelData: [],  //导出excel表格用的tableData
      columnlist: [
        { prop: 'taskNumber', label: '生产工单' },
        { prop: 'partCode', label: '物料编号' },
        { prop: 'partName', label: '物料名称' },
        { prop: 'workprocessName', label: '工序' },
        { prop: 'assignCount', label: '派件数量' },
        { prop: 'assignTime', label: '派件时间' },
        { prop: 'finishTime', label: '完工时间' },
        { prop: 'cost', label: '用时(天)' },
        { prop: 'workprocessCost', label: '工序用时(件/天)' },
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
      export2Excel(this.columnlist, this.excelData, `工序用时-${time}`)
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
      await workprocessCost(obj).then(res => {
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
      workprocessCost(obj).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.records
          this.totals = parseInt(res.data.total)
        }
      })
    },
    search() {
      this.page.current = 1
      this.getTableData()
    },
    /*getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        else if (index === 8) {
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
        } else {
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
          }
        }
      });
      return sums;
    },*/
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
  }
};
</script>

<style lang="less">
.workprocessCost {
  width: 100%;
  height: auto;
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