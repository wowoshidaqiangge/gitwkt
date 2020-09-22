<template>
  <div class="product">
    <div v-if="!isdetails">
      <div class="top">

        <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
          <el-row type="flex" justify="end">
            <div style="flex:1">

            </div>
            <el-col :span="4" class="dateBox">
              <div>
                <el-date-picker v-model="dateValue" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
                  start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="2" style="margin:0 20px">
              <el-form-item label="" prop="state">
                <el-select v-model="seachinfo.state" placeholder="状态">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" prop="productNameOrCode">
                <el-input placeholder="请输入产品名称或编码" v-model="seachinfo.productNameOrCode" class="elinput"> </el-input>
              </el-form-item>

            </el-col>
            <div style="margin:0 15px">
              <el-button type="add" icon="el-icon-search" @click="seachinfo1">查询</el-button>
              <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
            </div>
          </el-row>
        </el-form>

      </div>
      <div class="bot">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column v-for="(item, index) in columnlist" :width="item.width" :key="index" :prop="item.prop"
            :label="item.label" align="center">
          </el-table-column>
          <el-table-column label="状态" width="70" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span v-if="scope.row.state == 1" style="font-weight:600;color:orange">未派单</span>
                <span v-if="scope.row.state == 2" style="font-weight:600;color:blue">未领单</span>
                <span v-if="scope.row.state == 3||scope.row.state == 4" style="font-weight:600;color:green">生产中</span>
                <span v-if="scope.row.state == 5" style="font-weight:600;color:black">已完工</span>
                <span v-if="scope.row.state == 6" style="font-weight:600;color:red">已锁定</span>
                <span v-if="scope.row.state > 7"
                  style="font-weight:600;color:green">{{scope.row.produceTaskPlanState}}</span>
                <!-- <span v-if="scope.row.state == 7" style="font-weight:600;color:black">已解锁</span> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button type="add" plain v-if="scope.row.state != 6" @click="handleDetails(scope.$index, scope.row)">
                加工路线
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination :background="true" :current-page.sync="pagesize" @current-change="handleCurrentChange"
          layout="total, prev, pager, next" :total="totals" :page-size="page.size">
        </el-pagination>
      </div>
    </div>
    <productDetails v-if="isdetails" @goback="goback" ref="productDetails"></productDetails>
  </div>
</template>

<script>
import { ProduceAssemblePage } from 'api/tool'
import productDetails from './productDetails'
import { mapState } from 'vuex'
export default {
  name: 'productAssemble',
  components: {
    productDetails
  },
  data() {
    return {
      isdetails: false,
      dateValue: '',  // 日期范围
      options: [
        // { value: '', label: '全部' },
        { value: '1', label: '未派单' },
        { value: '2', label: '未领单' },
        { value: '3', label: '生产中' },
        // { value: '3', label: '零件生产' },
        // { value: '4', label: '装配' },
        { value: '5', label: '已完工' },
        { value: '6', label: '已锁定' },
        // { value: '7', label: '已解锁' },
      ],
      seachinfo: {
        state: '',
        productNameOrCode: ''
      },
      columnlist: [
        { prop: 'index', label: '序号', width: '50px' },
        { prop: 'deptName', label: '生产部门' },
        { prop: 'taskNumber', label: '装配工单号' },
        { prop: 'itemCode', label: '物料编码' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'planYield', label: '计划生产量' },
        { prop: 'planStartTime', label: '计划开始时间' },
        { prop: 'planEndTime', label: '计划结束时间' },
        { prop: 'createUser', label: '下单人' },
        { prop: 'produceDuration', label: '生产用时' }
      ],
      tableData: [],
      dialogFormVisible: false,
      page: {
        current: 1,
        size: 10
      },
      pagesize: 1,
      totals: 0,
    };
  },
  computed: {
    // ...mapState(['screenHeight'])
  },
  watch: {
    // screenHeight(newVal, oldVal) {
    //   if (newVal) {
    //     this.screenWidth = newVal - 200 + 'px';
    //   }
    // }
  },

  created() {
    this.getTableData();
  },
  methods: {
    seachinfo1() {
      this.page.current = 1
      this.getTableData()
    },
    resetting() {
      this.seachinfo = { state: '', productNameOrCode: '' };
      this.page.current = 1;
      this.dateValue = ''
      this.getTableData();
    },
    // showDialog(m) {
    //   this.dialogFormVisible = true
    //   this.$refs.productModal.getProductForm(m);
    // },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    getTableData() {
      let obj = { ...this.seachinfo, ...this.page, type: '3', beginDate: this.dateValue[0], endDate: this.dateValue[1] };
      ProduceAssemblePage(obj).then(res => {
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.index = index + 1
            if (item.produceDuration) {
              item.produceDuration = `${item.produceDuration}day`
            }
          })
          this.tableData = res.data.records
          this.totals = parseInt(res.data.total);
        }
      })
    },
    // 详情
    handleDetails(index, row) {
      this.isdetails = true
      this.$nextTick(() => {
        this.$refs.productDetails.getBaseInfo(index, row)
        this.$refs.productDetails.getTableData(row)
      })

    },
    // 详情返回
    goback() {
      this.isdetails = false
      this.getTableData();
    },
    close(num) {
      this.dialogFormVisible = false
      // this.dialogFormVisible1 = false
      // if (num === 0) {
      //   this.getdevicepage()
      // }
    },

  }
};
</script>

<style lang="less">
.product {
  width: 100%;
  height: 100%;
  .top {
    height: 50px;
    margin-top: 10px;
    .dateBox {
      // width: 25%;
      // .el-date-editor {
      //   width: 280px;
      // }
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