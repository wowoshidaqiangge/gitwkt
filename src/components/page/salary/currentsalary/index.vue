<template>
  <div class="salary">
    <el-row class="content__top" type="flex" justify="space-around">
      <el-col :span="4">
        <span class="param__label">部门：</span>
        <!-- <el-select v-model="param.deptId" placeholder="请选择部门">
          <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
          </el-option>
        </el-select> -->
        <el-cascader
          v-model="deptValue"
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
      <el-col :span="6">
        <span class="param__label">日期：</span>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="handleTimeChange"
        >
        </el-date-picker>
        <!-- <el-button type="add" @click="handleQuery">查询</el-button> -->
      </el-col>
      <div class="top__btn">
        <el-button type="add" @click="handleQuery">查询</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
        <el-button type="add" v-show="$_has('CURRENTSALARYEXPORT')" @click="exportExcel">导出</el-button>
      </div>
    </el-row>
    <div class="content__tip">
      <span>工资总计：{{ salarySum }} 元</span>
    </div>
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
        <el-table-column label="状态" prop="state" align="center" width="80">
          <template slot-scope="scope">
            <span style="color: red" v-if="scope.row.state == 0">未核对</span>
            <span style="color: green" v-if="scope.row.state == 1">已核对</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              v-if="$_has('CURRENTSALARYOPERATION')"
              @click="handleEdit(scope.$index, scope.row, param.type)"
              >编辑</el-button
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
    <editModal
      ref="editModal"
      :title="modal.title"
      :dialogVisible="modal.dialogVisible"
      @closeDia="handleClose"
      @updateData="handleUpdateData"
    ></editModal>
  </div>
</template>

<script>
import { getProduceDeptList } from '@/api/main'; // 公共api
import { getSalaryPage } from '@/api/salary';
import { export2Excel } from '@/utils/util.js';

import moment from 'moment';
export default {
  name: 'salary',
  components: {
    editModal: () => import('./editModal')
  },
  data() {
    return {
      deptId: '',
      param: {
        current: 1,
        size: 10,
        deptId: '7',
        type: '',
        name: '',
        officeNo: '',
        startTime: '',
        endTime: ''
      },
      deptValue: ['7'],
      dateValue: [],
      // deptList: [],
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
      columnlist1: [
        { prop: 'name', label: '姓名', width: 80 },
        { prop: 'officeNo', label: '工号', width: 80 },
        { prop: 'deptName', label: '部门' },
        { prop: 'taskNumber', label: '生产工单' },
        { prop: 'itemCode', label: '物料编码' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'workprocessCode', label: '工序编号' },
        { prop: 'workprocessName', label: '工序' },
        // { prop: 'accountType, label: '结算方式' }, // 1-计件，2-计时，3-计件、计时组合
        { prop: 'accountTypeName', label: '结算方式' }, // 1-计件，2-计时，3-计件、计时组合
        { prop: 'hourlyPrice', label: '计时工价', width: 50 },
        { prop: 'manHour', label: '计时时间', width: 50 },
        { prop: 'gH', label: '让步工H', width: 50 },
        { prop: 'gC', label: '降级工C', width: 50 },
        { prop: 'lH', label: '让步料H', width: 50 },
        { prop: 'lC', label: '降级料C', width: 50 },
        { prop: 'qualified', label: '合格P', width: 50 },
        { prop: 'supplement', label: '补', width: 50 },
        { prop: 'finishTime', label: '完成时间' },
        { prop: 'salary', label: '工资(元)', width: 80 }
      ],
      columnlist2: [
        { prop: 'name', label: '姓名', width: 80 },
        { prop: 'officeNo', label: '工号', width: 80 },
        { prop: 'deptName', label: '部门' },
        { prop: 'taskNumber', label: '生产工单' },
        { prop: 'itemCode', label: '物料编码' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'workprocessCode', label: '工序编号' },
        { prop: 'workprocessName', label: '工序' },
        { prop: 'produceCount', label: '实际完成数量' },
        { prop: 'qualified', label: '合格数量', width: 50 },
        { prop: 'unQualified', label: '不合格数量', width: 60 },
        { prop: 'pNums', label: 'P级数量', width: 50 },
        { prop: 'hNums', label: 'H级数量', width: 50 },
        { prop: 'cNums', label: 'C级数量', width: 50 },
        { prop: 'scrapNums', label: '报废数量', width: 50 },
        { prop: 'supplement', label: '补', width: 50 },
        { prop: 'remark', label: '不合格原因' },
        { prop: 'finishTime', label: '完成时间' },
        { prop: 'salary', label: '工资(元)', width: 80 }
      ],
      columnlist: [],
      tableData: [],
      salarySum: 0,
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      modal: {
        title: '结算详情',
        dialogVisible: false
      }
    };
  },
  computed: {},
  created() {
    this.deptId = sessionStorage.getItem('deptId');
    // this.getDeptList();
    this.init();
    console.log(this.columnlist);
  },
  methods: {
    init() {
      this.param = {
        current: 1,
        size: 10,
        name: '',
        officeNo: '',
        startTime: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endTime: moment(new Date()).format('YYYY-MM-DD')
      };
      this.dateValue = [this.param.startTime, this.param.endTime];

      if (this.deptId == 7) {
        this.deptOptions = this.deptOptions1;
        this.param.deptId = '7';
        this.deptValue = ['7'];
        this.param.type = '';
        this.columnlist = this.columnlist1;
      } else if (this.deptId == 8) {
        this.deptOptions = this.deptOptions2;
        this.param.deptId = '20';
        this.deptValue = ['8', '20'];
        this.param.type = 1;
        this.columnlist = this.columnlist2;
      } else if (this.deptId == 19 || this.deptId == 20) {
        this.deptOptions = this.deptOptions2;
        this.param.deptId = this.deptId;
        this.deptValue = ['8', this.deptId];
        this.param.type = '';
        this.columnlist = this.columnlist2;
      } else {
        this.deptOptions = this.deptOptions;
        this.param.deptId = '7';
        this.deptValue = ['7'];
        this.param.type = '';
        this.columnlist = this.columnlist1;
      }
      this.$forceUpdate();
      this.tableData.length = 0;
      this.handleQuery();
    },

    // getDeptList() {
    //   getProduceDeptList().then(res => {
    //     res = res.data;
    //     this.deptList = res;
    //   });
    // },
    handleTimeChange(val) {
      console.log('时间', val);
      if (val) {
        this.param.startTime = val[0];
        this.param.endTime = val[1];
      } else {
        this.param.startTime = '';
        this.param.endTime = '';
      }
    },

    handleDeptChange(val) {
      console.log(val);
      this.param.deptId = val[val.length - 1];
      if (val[1] && val[1] == 20) {
        this.param.type = 1;
        this.columnlist = this.columnlist2;
      } else {
        this.param.type = '';
        this.columnlist = this.columnlist1;
      }
      this.handleQuery();
    },
    // 获取表格数据
    getTableData() {
      console.log(this.param);
      this.loading = true;
      for (const key in this.param) {
        if (this.param[key] === '' || this.param[key] === undefined) {
          delete this.param[key];
        }
      }
      getSalaryPage(this.param)
        .then(res => {
          if (res.code == 0) {
            res = res.data;
            const accountTypeNames = ['-', '计件', '计时', '计件、计时组合'];
            const stateMsgs = ['未核对', '已核对'];
            for (let item of res.records) {
              if (item.accountType) {
                item.accountType = parseInt(item.accountType);
                item.accountTypeName = accountTypeNames[item.accountType];
              }
              item.stateMsg = stateMsgs[parseInt(item.state)];
              item.state = item.state ? item.state.toString() : '0';
              item.firstCheckSquad = item.firstCheckSquad ? item.firstCheckSquad.toString() : '1';
              item.assignUser = item.assignUser ? item.assignUser.split('"')[1] : '';
              item.assignTime = item.assignTime ? item.assignTime.split(' ')[0] : '';
              item.firstCheckSquadUser = item.firstCheckSquadUser ? item.firstCheckSquadUser.split('"')[1] : '';
              item.firstCheckExamUser = item.firstCheckExamUser ? item.firstCheckExamUser.split('"')[1] : '';
              item.secondCheckExamUser = item.secondCheckExamUser ? item.secondCheckExamUser.split('"')[1] : '';
              item.finishCheckExamUser = item.finishCheckExamUser ? item.finishCheckExamUser.split('"')[1] : '';
              item.finishTime = item.finishTime ? item.finishTime.split(' ')[0] : '';
            }
            this.tableData = res.records;
            console.table(this.tableData);
            res.total = parseInt(res.total);
            res.pages = parseInt(res.pages);
            res.current = parseInt(res.current);
            res.size = parseInt(res.size);
            const { total, pages, current, size } = res;
            this.page = { total, pages, current, size };
            this.salarySum = res.salarySum;
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          debugger;
          this.$message.error('后台接口错误');
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
    // 编辑表单
    handleEdit(index, row, type) {
      this.modal.title = '结算详情';
      console.log('row', row);
      // const { id, materialCode, materialNumber, materialName, model, unit, deptId } = row;
      // this.modal.form = {
      //   id,
      //   materialCode,
      //   materialNumber,
      //   materialName,
      //   model,
      //   unit,
      //   deptId
      // };
      this.modal.dialogVisible = true;
      // setTimeout(() => {
      //   this.$refs.editModal.getDetailData(row, type);
      // }, 100);
      this.$refs.editModal.getDetailData(row, type);
    },
    handleUpdateData() {
      this.handleQuery();
    },
    handleClose() {
      this.modal.dialogVisible = false;
    },
    // Excel
    async exportExcel() {
      const { deptId, type, name, officeNo, startTime, endTime } = this.param;
      const obj = { current: 1, size: 10000, deptId, type, name, officeNo, startTime, endTime };
      let columnlist = JSON.parse(JSON.stringify(this.columnlist));
      columnlist.push({ prop: 'stateMsg', label: '状态' });
      let tableData = [];
      await getSalaryPage(obj).then(res => {
        if (res.code == 0) {
          res = res.data;
          const accountTypeNames = ['-', '计件', '计时', '计件、计时组合'];
          const stateMsgs = ['未核对', '已核对'];
          for (let item of res.records) {
            if (item.accountType) {
              item.accountType = parseInt(item.accountType);
              item.accountTypeName = accountTypeNames[item.accountType];
            }
            item.stateMsg = stateMsgs[parseInt(item.state)];
            item.state = item.state ? item.state.toString() : '0';
            item.firstCheckSquad = item.firstCheckSquad ? item.firstCheckSquad.toString() : '1';
            item.assignUser = item.assignUser ? item.assignUser.split('"')[1] : '';
            item.assignTime = item.assignTime ? item.assignTime.split(' ')[0] : '';
            item.firstCheckSquadUser = item.firstCheckSquadUser ? item.firstCheckSquadUser.split('"')[1] : '';
            item.firstCheckExamUser = item.firstCheckExamUser ? item.firstCheckExamUser.split('"')[1] : '';
            item.secondCheckExamUser = item.secondCheckExamUser ? item.secondCheckExamUser.split('"')[1] : '';
            item.finishCheckExamUser = item.finishCheckExamUser ? item.finishCheckExamUser.split('"')[1] : '';
            item.finishTime = item.finishTime ? item.finishTime.split(' ')[0] : '';
          }
          tableData = res.records;
        }
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
      export2Excel(columnlist, tableData, `当前工资-${suffix}`);
      this.$message.success('导出成功');
    }
  }
};
</script>

<style lang="less" scoped>
.salary {
  .el-row {
    margin: 15px 0;

    .el-col {
      display: flex;
    }
    .el-col:nth-last-child(1) {
      max-width: 400px;
    }
    .el-select {
      max-width: 180px;
    }
    .el-input {
      max-width: 180px;
      // margin-right: 20px;
    }
    .el-date-editor {
      max-width: 250px;
      // margin-right: 20px;
    }

    .param__label {
      color: #666;
      line-height: 2rem;
      width: 60px;
    }
    .el-button {
      margin-right: 0.5rem;
    }
  }
  .top__btn {
    min-width: 155px;
  }
  .content__tip {
    margin-left: 25px;
    color: #666;
    line-height: 1.5rem;
  }
  .content__box {
    margin: 20px 15px 30px 15px;
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
