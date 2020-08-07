<template>
  <div class="partDeliver">
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="零件&标准件" name="first">
        <div class="partDeliver__overview" v-if="!detailFlag">
          <el-row type="flex" justify="end" class="pageheader">
            <el-col :span="5" class="pageheader_item">
              <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="changeDate"
              >
              </el-date-picker
            ></el-col>
            <el-col :span="2" class="pageheader_item">
              <el-select v-model="param.state" placeholder="全部状态">
                <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="pageheader_item">
              <el-input placeholder="请输入装配工单号" v-model="param.taskNumber" class="elinput"> </el-input
            ></el-col>
            <div class="pageheader_item">
              <el-button type="add" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="info" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
            </div>
          </el-row>
          <div class="tablebox">
            <el-table :data="tableData" stripe border style="width: 100%" v-loading="loading">
              <el-table-column label="序号" prop="index" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in columnlist"
                :key="index"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              ></el-table-column>
              <el-table-column prop="partBillState" label="状态" align="center">
                <template slot-scope="scope">
                  <span style="color:#E6A23C" v-if="scope.row.partBillState === 0">未发料</span>
                  <span v-if="scope.row.partBillState === 1">已发料</span>
                  <span style="color:#F56C6C" v-if="scope.row.partBillState === 6">已锁定</span>
                </template>
              </el-table-column>
              <el-table-column label="清单详情" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.partBillState !== 6" type="primary" plain @click="handleDetail(scope.row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="发料确认" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" v-if="scope.row.partBillState === 0" plain @click="handleSubmit(scope.row)"
                    >确定</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page.sync="page.current"
                :total="page.total"
                :page-size.sync="page.size"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="partDeliver__detail" v-if="detailFlag">
          <div class="detail__top">
            <h4 class="top__left">零件&标准件清单 — 详情</h4>
            <el-button type="add" icon="el-icon-back" @click="handleClose">返回</el-button>
          </div>
          <div class="detail__info">
            <p class="info__title">产品基本信息：</p>
            <div class="info__items">
              <div class="info__item">
                <span class="item__label">装配工单：</span>
                <span class="item__value">{{ infoData.taskNumber }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">物料编码：</span>
                <span class="item__value">{{ infoData.productCode }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">物料名称：</span>
                <span class="item__value">{{ infoData.productName }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">规格型号：</span>
                <span class="item__value">{{ infoData.model }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">生产部门：</span>
                <span class="item__value">{{ infoData.deptName }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">生产数量：</span>
                <span class="item__value">{{ infoData.planYield }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">计划开始时间：</span>
                <span class="item__value">{{ infoData.planStartTime }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">计划结束时间：</span>
                <span class="item__value">{{ infoData.planEndTime }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">发料人：</span>
                <span class="item__value">{{ infoData.partBillUser }}</span>
              </div>
              <div class="info__item">
                <span class="item__label">特殊要求：</span>
                <span class="item__value">{{ infoData.remark }}</span>
              </div>
            </div>
          </div>
          <div class="tablebox">
            <el-table :data="tableData2" stripe border style="width: 96%;margin: 0 auto" v-loading="loading2">
              <el-table-column label="序号" prop="index" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in columnlist2"
                :key="index"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="type" label="物料类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">零件</span>
                  <span v-if="scope.row.type === 2">标准件</span>
                </template>
              </el-table-column>
              <el-table-column prop="state" label="状态" width="100" align="center">
                <template slot-scope="scope">
                  <span style="color:#E6A23C" v-if="scope.row.state === 0">未发料</span>
                  <span v-if="scope.row.state === 1">已发料</span>
                  <span style="color:#F56C6C" v-if="scope.row.state === 6">已锁定</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.state === 0" type="primary" plain @click="handleSubmit2(scope.row)"
                    >确定</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page.sync="page2.current"
              :total="page2.total"
              :page-size.sync="page2.size"
              @current-change="handleCurrentChange2"
            >
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="原材料" name="second">
        <div class="partDeliver__overview">
          <el-row type="flex" justify="end" class="pageheader">
            <el-col :span="5" class="pageheader_item">
              <el-date-picker
                v-model="dateValue2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="changeDate2"
              >
              </el-date-picker
            ></el-col>
            <el-col :span="2" class="pageheader_item">
              <el-select v-model="param3.state" placeholder="全部状态">
                <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3" class="pageheader_item">
              <el-input placeholder="请输入生产工单号" v-model="param3.taskNumber" class="elinput"> </el-input
            ></el-col>
            <div class="pageheader_item">
              <el-button type="add" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button type="info" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
            </div>
          </el-row>
          <div class="tablebox">
            <el-table
              :data="tableData3"
              stripe
              border
              style="width: 100%"
              v-loading="loading3"
              :default-sort="{ prop: 'state', order: 'ascending' }"
            >
              <el-table-column label="序号" prop="index" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="item in columnlist3.slice(0, 2)"
                :key="item.index"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              ></el-table-column>
              <el-table-column prop="" label="零件基本信息" align="center">
                <el-table-column
                  v-for="item in columnlist3.slice(2, 5)"
                  :key="item.index"
                  :width="item.width"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <el-table-column prop="" label="原材料基本信息" align="center">
                <el-table-column
                  v-for="item in columnlist3.slice(5, 8)"
                  :key="item.index"
                  :width="item.width"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <el-table-column
                v-for="item in columnlist3.slice(8, 12)"
                :key="item.index"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              ></el-table-column>
              <el-table-column prop="state" label="状态" align="center">
                <template slot-scope="scope">
                  <span style="color:#E6A23C" v-if="scope.row.rawmaterialBillList[0].state === 0">未发料</span>
                  <span v-if="scope.row.rawmaterialBillList[0].state === 1">已发料</span>
                  <span style="color:#F56C6C" v-if="scope.row.rawmaterialBillList[0].state === 6">已锁定</span>
                </template>
              </el-table-column>
              <el-table-column label="发料确认" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    v-if="scope.row.rawmaterialBillList[0].state === 0"
                    plain
                    @click="handleSubmit3(scope.row)"
                    >确定</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="page">
              <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page.sync="page3.current"
                :total="page3.total"
                :page-size.sync="page3.size"
                @current-change="handleCurrentChange3"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { produceTaskStateList } from 'api/index';
import {
  partBillPage,
  setPartBillState,
  partBillDetail,
  setPartState,
  rawBillPage,
  setRawBillState
} from 'api/product';

import moment from 'moment';

export default {
  name: 'partDeliver',
  components: {},
  data() {
    return {
      param: {
        current: 1,
        size: 10,
        beginDate: '',
        endDate: '',
        state: '',
        taskNumber: ''
      },
      param2: { current: 1, size: 10, produceTaskId: '' }, // 零件详情查询
      param3: { current: 1, size: 10, beginDate: '', endDate: '', state: '', taskNumber: '' }, // 原材料
      activeName: 'first',
      detailFlag: false,
      stateList: [
        { label: '未发料', value: 0 },
        { label: '已发料', value: 1 },
        { label: '全部状态', value: '' }
      ],
      dateValue: '',
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      tableData: [],
      columnlist: [
        { prop: 'deptName', label: '生产部门' },
        { prop: 'taskNumber', label: '装配工单号' },
        { prop: 'productCode', label: '物料编码' },
        { prop: 'productName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'planYield', label: '计划生产量' },
        {
          prop: 'createTime',
          label: '新增时间'
        },
        {
          prop: 'partBillTime',
          label: '发料时间'
        },
        { prop: 'partBillUser', label: '发料人' }
      ],
      infoData: {},
      page2: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      loading2: false,
      tableData2: [],
      columnlist2: [
        { prop: 'partCode', label: '物料编码' },
        { prop: 'partNumber', label: '物料图号' },
        { prop: 'partName', label: '物料名称' },
        { prop: 'partCount', label: '数量' },
        {
          prop: 'createTime',
          label: '新增时间'
        },
        {
          prop: 'partBillTime',
          label: '发料时间'
        }
      ],
      page3: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      dateValue2: '',
      loading3: false,
      tableData3: [],
      columnlist3: [
        { prop: 'deptName', label: '生产部门', index: 1 },
        { prop: 'taskNumber', label: '生产工单号', index: 2 },
        { prop: 'partCode', label: '物料编码', index: 3 },
        { prop: 'partNumber', label: '物料图号', index: 4 },
        { prop: 'partName', label: '物料名称', index: 5 },

        { prop: 'rawmaterialBillList[0].materialCode', label: '物料编码', index: 5 },
        { prop: 'rawmaterialBillList[0].materialNumber', label: '物料图号', index: 7 },
        { prop: 'rawmaterialBillList[0].materialName', label: '物料名称', index: 8 },

        { prop: 'planYield', label: '数量', index: 9 },
        {
          prop: 'createTime',
          label: '新增时间',
          index: 10
        },
        {
          prop: 'rawmaterialBillList[0].rawmaterialBillTime',
          label: '发料时间',
          index: 11
        },
        { prop: 'rawmaterialBillList[0].createUser', label: '发料人', index: 12 }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 查询参数初始化
      this.param.state = '';
      this.param.beginDate = moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD');
      this.param.endDate = moment(new Date()).format('YYYY-MM-DD');
      this.dateValue = [this.param.beginDate, this.param.endDate];
      this.param.taskNumber = '';

      this.param3.state = '';
      this.param3.beginDate = moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD');
      this.param3.endDate = moment(new Date()).format('YYYY-MM-DD');
      this.param3.taskNumber = '';
      this.dateValue2 = [this.param3.beginDate, this.param3.endDate];
      this.getTableData();
    },
    handleTabClick(tab, event) {
      console.log(tab, event);
      this.init();
    },
    // API:获取表格数据
    getTableData() {
      if (this.activeName === 'first') {
        for (const key in this.param) {
          if (this.param[key] === '') {
            delete this.param[key];
          }
        }
        this.loading = true;
        partBillPage(this.param).then(res => {
          if (res.code === '0') {
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
        });
      } else {
        // 原材料
        for (const key in this.param3) {
          if (this.param3[key] === '') {
            delete this.param3[key];
          }
        }
        rawBillPage(this.param3).then(res => {
          this.loading3 = true;
          if (res.code === '0') {
            res = res.data;
            for (let item of res.records) {
              if (item.rawmaterialBillList.length === 0) {
                item.rawmaterialBillList = [
                  {
                    createUser: '',
                    id: '',
                    materialCode: '',
                    materialName: '',
                    materialNumber: '',
                    rawmaterialBillTime: '',
                    rawmaterialCount: '',
                    state: ''
                  }
                ];
              }
            }
            this.tableData3 = res.records;
            console.log(this.tableData3);
            res.total = parseInt(res.total);
            res.pages = parseInt(res.pages);
            res.current = parseInt(res.current);
            res.size = parseInt(res.size);
            const { total, pages, current, size } = res;
            this.page3 = { total, pages, current, size };
          }
          this.loading3 = false;
        });
      }
    },
    // API:获取详情数据
    getDetailData() {
      this.loading2 = true;
      partBillDetail(this.param2).then(res => {
        if (res.code === '0') {
          res = res.data;
          this.tableData2 = res.records;
          console.log(this.tableData2);
          res.total = parseInt(res.total);
          res.pages = parseInt(res.pages);
          res.current = parseInt(res.current);
          res.size = parseInt(res.size);
          const { total, pages, current, size } = res;
          this.page2 = { total, pages, current, size };
        }
      });
      this.loading2 = false;
    },
    // 处理日期参数
    changeDate(val) {
      if (val) {
        this.param.beginDate = val[0] || '';
        this.param.endDate = val[1] || '';
      } else {
        this.param.beginDate = '';
        this.param.endDate = '';
      }
    },
    // 条件查询
    handleQuery() {
      this.getTableData();
    },
    // 重置
    handleReset() {
      this.init();
    },
    //分页
    handleCurrentChange(val) {
      this.param.current = val;
      this.getTableData();
    },
    handleUpdateData() {
      this.getTableData();
    },

    /* 详情 */
    handleDetail(row) {
      this.detailFlag = true;
      const {
        taskNumber,
        productCode,
        productName,
        model,
        deptName,
        planYield,
        planStartTime,
        planEndTime,
        partBillUser,
        remark
      } = row;
      this.infoData = {
        taskNumber,
        productCode,
        productName,
        model,
        deptName,
        planYield,
        planStartTime,
        planEndTime,
        partBillUser,
        remark
      };
      this.param2.produceTaskId = row.produceTaskId;
      this.getDetailData();
    },
    //分页
    handleCurrentChange2(val) {
      this.param2.current = val;
      this.getDetailData();
    },
    handleUpdateDetail() {
      this.getDetailData();
    },
    handleClose() {
      this.detailFlag = false;
    },
    // 发料确认(产品)
    handleSubmit(row) {
      this.$confirm(
        '请注意，此操作将为该产品所有零件和标准件发料，是否继续？ 如果需要单独发料请返回，点击详情进行操作。 ',
        '提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          // 调用产品发料确认接口
          const obj = { produceTaskPlanId: row.produceTaskPlanId, partBillState: 1 };
          setPartBillState(obj).then(res => {
            if (res.code === '0') {
              this.$message.success('发料成功');
              // row.partBillState = 1;
              this.handleUpdateData();
            } else {
              this.$message.error('发料失败，请稍后重试');
            }
          });
        })
        .catch(() => {});
    },

    // 发料确认(零件)
    handleSubmit2(row) {
      // 调用零件发料确认接口
      console.log(row);
      const obj = { id: row.partBillId, state: 1 };
      setPartState(obj).then(res => {
        if (res.code === '0') {
          this.$message.success('发料成功');
          this.handleUpdateDetail();
        } else {
          this.$message.error('发料失败，请稍后重试');
        }
      });
    },

    /* 原材料 */
    changeDate2(val) {
      if (val) {
        this.param3.beginDate = val[0];
        this.param3.endDate = val[1];
      } else {
        this.param3.beginDate = '';
        this.param3.endDate = '';
      }
    },
    handleCurrentChange3(val) {
      this.param3.current = val;
      this.getTableData();
    },
    handleSubmit3(row) {
      //MARKIT：原材料列表暂时取第一个,不太对
      console.log(row);
      const obj = { id: row.rawmaterialBillList[0].id, state: 1 };

      // 调用原材料发料确认接口
      setRawBillState(obj).then(res => {
        if (res.code === '0') {
          this.$message.success('发料成功');
          // row.rawmaterialBillList[0].state = 1;
          this.handleUpdateData();
        } else {
          this.$message.error('发料失败，请稍后重试');
        }
      });
    }
  }
};
</script>

<style lang="less">
.partDeliver {
  height: 100%;

  .partDeliver__overview {
    .pageheader {
      margin: 15px 0;
      .pageheader_item {
        margin: 0 15px;
      }
      .el-date-editor {
        width: 100%;
      }
      .el-button {
        margin-right: 10px;
        height: 32px;
      }
    }
    .tablebox {
      margin-top: 30px;
    }
  }

  .partDeliver__detail {
    height: 99%;
    border: 1px solid #ccc;
    border-radius: 3px;

    .detail__top {
      border: 1px solid #e6ebf1;
      height: 50px;
      background-color: rgb(230, 235, 241);
      padding: 0 10px;
      display: flex;
      align-items: center;
      .top__left {
        flex: 1;
        color: rgb(50, 25, 112);
        font-weight: 600;
      }
    }
    .detail__info {
      display: flex;
      flex-direction: column;
      margin: 10px 15px 20px 15px;
      color: #324170;
      .info__title {
        line-height: 2.5rem;
      }
      .info__items {
        flex: 1 0 auto;
        margin: 0 2%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      .info__item {
        flex: 0 1 24%;
        margin: 8px 0;
        .item__value {
          color: #444;
        }
      }
    }
    .tablebox {
      margin-bottom: 20px;
    }
  }

  .page {
    margin: 20px 30px 20px 0;
    text-align: end;
  }
  .el-pager li.active {
    background-color: #409baf !important;
    color: #fff;
  }
}
</style>
