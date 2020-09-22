<template>
  <div class="hisSalary">
    <div class="hisSalary-main" v-if="tabIndex === 0">
      <el-row class="content__top" type="flex" justify="space-around">
        <el-col :span="4">
          <span class="param__label">部门：</span>
          <!-- <el-select v-model="param.deptId" placeholder="请选择部门">
            <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select> -->
          <el-cascader
            v-model="param.deptId"
            :options="deptOptions"
            :props="{ expandTrigger: 'hover' }"
            placeholder="请选择部门"
            @change="handleDeptChange"
          ></el-cascader>
        </el-col>
        <el-col :span="3.5">
          <span class="param__label">姓名：</span>
          <el-input v-model="param.name" placeholder=""> </el-input>
        </el-col>
        <el-col :span="3.5">
          <span class="param__label">工号：</span>
          <el-input v-model="param.officeNo" placeholder=""> </el-input>
        </el-col>
        <el-col :span="5">
          <span class="param__label">日期：</span>
          <el-date-picker
            v-model="param.startTime"
            type="month"
            placeholder="请选择月份"
            format="yyyy-MM"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-col>
        <div class="top__btn">
          <el-button type="add" @click="handleQuery">查询</el-button>
          <el-button type="info" @click="handleReset">重置</el-button>
          <el-button type="add" v-show="$_has('HISTORYSALARYEXPORT')" @click="exportExcel">EXCEL 导出</el-button>
        </div>
      </el-row>
      <div class="content__box">
        <el-table :data="tableData" border stripe style="width: 100%;" v-loading="loading">
          <el-table-column label="序号" prop="index" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in columnlist"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="add"
                plain
                @click="handleDetail(scope.$index, scope.row)"
                v-if="$_has('HISTORYSALARYOPERATION') && scope.row.deptName == '线轨'"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :total="page.total"
          :page-size.sync="page.size"
          :current-page.sync="page.current"
        >
        </el-pagination>
      </div>
    </div>
    <detailModal ref="detailModal" :tabIndex="tabIndex" @closeModal="closeDetail"></detailModal>
  </div>
</template>

<script>
import { getProduceDeptList } from '@/api/main'; // 公共api
import { getHisSalaryPage } from '@/api/salary';
import { export2Excel } from '@/utils/util.js';
import moment from 'moment';

export default {
  name: 'hisSalary',
  components: {
    detailModal: () => import('./detailModal')
  },
  data() {
    return {
      tabIndex: 0,
      deptId: '',
      param: {
        current: 1,
        size: 10,
        deptId: '',
        name: '',
        officeNo: '',
        startTime: '' // 2020-06
      },
      deptList: [],
      deptOptions: [
        { label: '生产一部', value: '7' },
        {
          label: '生产二部',
          value: '8',
          children: [
            { label: '线轨', value: '20' },
            { label: '滑块', value: '19' }
          ]
        }
      ],
      deptOptions1: [{ label: '生产一部', value: '7' }],
      deptOptions2: [
        {
          label: '生产二部',
          value: '8',
          children: [
            { label: '线轨', value: '20' },
            { label: '滑块', value: '19' }
          ]
        }
      ],
      loading: false,
      tableData: [],
      columnlist: [
        { prop: 'name', label: '姓名' },
        { prop: 'officeNo', label: '工号' },
        { prop: 'deptName', label: '部门' },
        { prop: 'mSalary', label: '当月工资(元)' },
        { prop: 'ySalary', label: '当年工资(元)' },
        { prop: 'mAvSalary', label: '月平均工资(元)' }
      ],
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      }
    };
  },
  created() {
    this.deptId = sessionStorage.getItem('deptId');
    // this.getDeptList();
    this.init();
  },
  methods: {
    init() {
      this.param = {
        current: 1,
        size: 10,
        name: '',
        officeNo: '',
        startTime: moment(new Date()).format('YYYY-MM')
      };
      if (this.deptId == 7) {
        this.deptOptions = this.deptOptions1;
        this.param.deptId = '7';
      } else if (this.deptId == 8) {
        this.deptOptions = this.deptOptions2;
        this.param.deptId = '20';
      } else if (this.deptId == 19 || this.deptId == 20) {
        this.deptOptions = this.deptOptions2;
        this.param.deptId = this.deptId;
      } else {
        this.param.deptId = '7';
        this.deptOptions = this.deptOptions;
      }
      this.$forceUpdate();
      this.tableData.length = 0;
      this.handleQuery();
    },
    getDeptList() {
      getProduceDeptList().then(res => {
        res = res.data;
        this.deptList = res;
      });
    },
    handleDeptChange(val) {
      this.param.deptId = this.param.deptId[this.param.deptId.length - 1];
      this.handleQuery();
    },
    // 获取表格数据
    getTableData() {
      this.loading = true;
      for (const key in this.param) {
        if (this.param[key] === '') {
          delete this.param[key];
        }
      }
      getHisSalaryPage(this.param)
        .then(res => {
          console.log(res);
          if (res.code == 0) {
            res = res.data;
            this.tableData = res.records;
            console.log(this.tableData);
            res.total = parseInt(res.total);
            res.pages = parseInt(res.pages);
            res.current = parseInt(res.current);
            res.size = parseInt(res.size);
            const { total, pages, current, size } = res;
            this.page = { total, pages, current, size };
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          debugger;
        });
    },
    // 条件查询
    handleQuery() {
      this.param.current = 1;
      this.getTableData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.param.current = val;
      this.getTableData();
    },
    //重置
    handleReset() {
      this.init();
    },
    // Excel
    async exportExcel() {
      const { deptId, name, officeNo, startTime } = this.param;
      const obj = { current: 1, size: 10000, deptId, name, officeNo, startTime };
      let tableData = [];
      await getHisSalaryPage(obj).then(res => {
        tableData = res.data.records;
      });
      //TODO: 导出的部门后缀
      let suffix = '';
      if (this.param.deptId == 7) {
        suffix = '生产一部';
      } else if (this.param.deptId == 19) {
        suffix = '生产二部-滑块';
      } else if (this.param.deptId == 20) {
        suffix = '生产二部-线轨';
      } else {
        suffix = '';
      }
      suffix = `${suffix}-${this.param.startTime}`;
      export2Excel(this.columnlist, tableData, `历史工资-${suffix}`);
      this.$message.success('导出成功');
    },
    getCurTime() {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      // let day = date.getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      // if (day < 10) {
      //   day = `0${day}`;
      // }
      // return `${year}-${month}-${day}`;
      return `${year}-${month}`;
    },

    // 查看详情
    handleDetail(index, row) {
      console.log(index, row);
      this.tabIndex = 1;
      // const timer = setTimeout(() => {
      //   this.$refs.detailModal.init(row, this.param);
      // }, 100);
      // if (timer) {
      //   clearTimeout(timer);
      // }
      this.$refs.detailModal.init(row, this.param);
    },
    closeDetail() {
      this.tabIndex = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.hisSalary {
  .el-row {
    margin: 20px 0;
    .el-col {
      display: flex;
    }
    .el-select {
      max-width: 180px;
    }
    .el-input {
      max-width: 180px;
      // margin-right: 20px;
    }
    .el-date-editor {
      max-width: 300px;
      // margin-right: 20px;
    }
    .el-button {
      // margin-right: 10px;
    }
    .el-col:nth-last-child(1) {
      min-width: 485px;
    }
    .param__label {
      color: #666;
      line-height: 2rem;
      width: 60px;
    }
  }
  .top__btn {
    min-width: 165px;
  }
  .content__box {
    margin: 30px 15px;
    // min-height: 540px;
  }
  .page {
    float: right;
    margin-right: 15px;
    .el-pagination.is-background /deep/ .el-pager li:not(.disabled).active {
      background-color: #409baf;
      color: #fff;
    }
  }
}
</style>
