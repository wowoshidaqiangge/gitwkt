<template>
  <div class="guideTaskPlan">
    <div v-if="!detailFlag">
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
            <el-option v-for="item in stateList" :key="item.enumKey" :label="item.enumValue" :value="item.enumKey">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="pageheader_item">
          <el-input placeholder="请输入物料名称或编码" v-model="param.itemNameOrCode" class="elinput"> </el-input
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
          >
          </el-table-column>
          <el-table-column prop="produceTaskPlanState" label="状态" align="center">
            <template slot-scope="scope">
              <span style="color:#E6A23C" v-if="scope.row.state == 1">{{ scope.row.produceTaskPlanState }}</span>
              <span style="color:#409EFF" v-if="scope.row.state == 2">{{ scope.row.produceTaskPlanState }}</span>
              <span style="color:#67C23A" v-if="scope.row.state == 3 || scope.row.state == 4">{{
                scope.row.produceTaskPlanState
              }}</span>
              <span style="color:#909399" v-if="scope.row.state == 5">{{ scope.row.produceTaskPlanState }}</span>
              <span style="color:#F56C6C" v-if="scope.row.state == 6 || scope.row.state == 7">{{
                scope.row.produceTaskPlanState
              }}</span>
              <span style="color:green" v-if="scope.row.state >= 10">{{ scope.row.produceTaskPlanState }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="produceDuration" label="生产用时" align="center" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.produceDuration ? scope.row.produceDuration + ' day' : '' }} </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.state != 5 && scope.row.state != 6"
                type="add"
                plain
                @click="handleEdit(scope.$index, scope.row)"
                >派单</el-button
              >
              <el-button v-if="scope.row.state == 5" type="add" plain @click="handleEdit(scope.$index, scope.row)"
                >报工记录</el-button
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
    <!-- <div class="guide__paidan" v-if="detailFlag">
      <div class="detail__top">
        <h4 class="top__left">导轨生产工单 — 派单</h4>
        <el-button type="add" icon="el-icon-back" @click="handleClose">返回</el-button>
      </div>
      <div class="detail__info">
        <p class="info__title">基本信息：</p>
        <div class="info__items">
          <div class="info__item">
            <span class="item__label">生产工单：</span>
            <span class="item__value">{{ detailData.taskNumber }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">物料编码：</span>
            <span class="item__value">{{ detailData.productCode }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">物料名称：</span>
            <span class="item__value">{{ detailData.productName }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">规格型号：</span>
            <span class="item__value">{{ detailData.model }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">生产部门：</span>
            <span class="item__value">{{ detailData.deptName }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">生产数量：</span>
            <span class="item__value">{{ detailData.planYield }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">计划开始时间：</span>
            <span class="item__value">{{ detailData.planStartTime }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">计划结束时间：</span>
            <span class="item__value">{{ detailData.planEndTime }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">发料人：</span>
            <span class="item__value">{{ detailData.planEndTime }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">特殊要求：</span>
            <span class="item__value">{{ detailData.xxx }}</span>
          </div>
        </div>
      </div>
      <div class="tablebox">
        <el-table :data="detailData.partBillList" stripe border style="width: 96%;margin: 0 auto" v-loading="loading">
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
              <span style="color:#F56C6C" v-if="scope.row.state === 0">未发料</span>
              <span v-else>已发料</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state === 0" type="add" plain>确定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> -->
    <productDetails v-show="detailFlag" @goback="handleClose" ref="productDetails"></productDetails>
  </div>
</template>

<script>
import { produceTaskStateList } from 'api/index';
import { produceTaskPlanpage } from 'api/product';

export default {
  name: 'guideTaskPlan',
  components: {
    productDetails: () => import('./productDetails')
  },
  data() {
    return {
      param: {
        type: 2,
        current: 1,
        size: 10,
        beginDate: '',
        endDate: '',
        state: '',
        itemNameOrCode: ''
      },
      detailFlag: false,
      stateList: [],
      dateValue: '',
      loading: false,
      tableData: [],
      columnlist: [
        { prop: 'deptName', label: '生产部门' },
        { prop: 'taskNumber', label: '导轨任务单' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'planYield', label: '计划生产量' },
        {
          prop: 'planStartTime',
          label: '计划开始时间'
        },
        {
          prop: 'planEndTime',
          label: '计划结束时间'
        },
        { prop: 'createUser', label: '下单人' }
      ],
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      modal: {
        title: '',
        dialogVisible: false
      }
      // detailData: {
      //   taskNumber: 1111,
      //   partBillList: [
      //     {
      //       state: 0,
      //       partBillId: 2,
      //       type: 1,
      //       productCode: 11111
      //     }
      //   ]
      // },
      // columnlist2: [
      //   { prop: 'partCode', label: '物料编码' },
      //   { prop: 'partNumber', label: '物料图号' },
      //   { prop: 'partName', label: '物料名称' },
      //   { prop: 'partCount', label: '数量' },
      //   {
      //     prop: 'createTime',
      //     label: '新增时间'
      //   },
      //   {
      //     prop: 'updateTime',
      //     label: '发料时间'
      //   }
      // ]
    };
  },
  created() {
    this.getStateList();
    this.init();
  },
  methods: {
    init() {
      // 查询参数初始化
      this.param.state = '';
      this.param.beginDate = '';
      this.param.endDate = '';
      this.param.itemNameOrCode = '';
      this.dateValue = [];
      this.getTableData();
    },
    // API:查询状态列表
    getStateList() {
      produceTaskStateList().then(res => {
        if (res.code === '0') {
          this.stateList = res.data;
          console.log(this.stateList);
        }
      });
    },
    // API:获取表格数据
    getTableData() {
      // this.loading = true;
      for (const key in this.param) {
        if (this.param[key] === '') {
          delete this.param[key];
        }
      }
      produceTaskPlanpage(this.param).then(res => {
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
      });
      this.loading = false;
    },
    // 处理日期参数
    changeDate(val) {
      if (val) {
        this.param.beginDate = val[0];
        this.param.endDate = val[1];
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

    // 编辑表单：
    handleEdit(index, row) {
      this.detailFlag = true;
      this.$nextTick(() => {
        this.$refs.productDetails.getBaseInfo(index, row);
        this.$refs.productDetails.getTableData(this.param.type, row.produceTaskPlanId);
      });
    },
    handleUpdateData() {
      this.getTableData();
    },
    handleClose() {
      // this.modal.dialogVisible = false;
      this.detailFlag = false;
    }
  }
};
</script>

<style lang="less">
.guideTaskPlan {
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
  .page {
    margin-top: 20px;
    float: right;
  }
  .el-pager li.active {
    background-color: #409baf !important;
    color: #fff;
  }

  // .guide__paidan {
  //   border: 1px solid #ccc;
  //   border-radius: 3px;

  //   .detail__top {
  //     border: 1px solid #e6ebf1;
  //     height: 50px;
  //     background-color: rgb(230, 235, 241);
  //     padding: 0 10px;
  //     display: flex;
  //     align-items: center;
  //     .top__left {
  //       flex: 1;
  //       color: rgb(50, 25, 112);
  //       font-weight: 600;
  //     }
  //   }
  //   .detail__info {
  //     display: flex;
  //     flex-direction: column;
  //     margin: 10px 15px 20px 15px;
  //     color: #324170;
  //     .info__title {
  //       line-height: 2.5rem;
  //     }
  //     .info__items {
  //       flex: 1 0 auto;
  //       margin: 0 2%;
  //       display: flex;
  //       flex-direction: row;
  //       flex-wrap: wrap;
  //       justify-content: flex-start;
  //     }
  //     .info__item {
  //       flex: 0 1 24%;
  //       margin: 8px 0;
  //       .item__value {
  //         color: #444;
  //       }
  //     }
  //   }
  //   .tablebox {
  //     margin-bottom: 20px;
  //   }
  // }
}
</style>
