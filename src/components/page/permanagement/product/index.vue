<template>
  <div class="product" v-loading="loading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="top">
      <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="end">
          <div style="flex:1">
            <el-button type="add" v-if="$_has('PRODUCTADD')" icon="el-icon-circle-plus-outline" @click="add"
              >新增</el-button
            >
            <el-button type="add" @click="handleExcel">EXCEL 导入</el-button>
          </div>

          <el-col :span="3">
            <el-form-item label="" prop="productNameOrCode">
              <el-input placeholder="请输入工序名或编码" v-model="seachinfo.productNameOrCode" class="elinput">
              </el-input>
            </el-form-item>
          </el-col>
          <div style="margin:0 15px">
            <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
            <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <div class="bot">
      <el-table :data="tableData" stripe border>
       
        <el-table-column
        show-overflow-tooltip
          v-for="(item, index) in columnlist"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          :label="item.label"
          align="center"
        >
        </el-table-column>
       
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="success" v-if="$_has('PRODUCTUPDATE')" plain @click="handleagin(scope.row)"
              >修改</el-button
            >
            <el-button type="warning" v-if="$_has('PRODUCTDELETE')" plain @click="handleUntie(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :background="true"
          :current-page.sync="pagesize"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :total="totals"
        >
        </el-pagination>
      </div>
    </div>
    <Modal :dialogFormVisible="dialogFormVisible" ref="productmodal" :tit="tit" @close="close" />
    <excelModal
      ref="excelModal"
      :title="excel.title"
      :dialogExcelVisible="excel.dialogExcelVisible"
      @closeExcel="handleExcelClose"
      @updateData="handleUpdateData"
    ></excelModal>
  </div>
</template>

<script>
import { productPage, productDelete } from 'api/product';
import Modal from './modal';
export default {
  name: 'product',
  components: {
    Modal,
    excelModal: () => import('./excelModal')
  },
  data() {
    return {
      loading:false,
      seachinfo: {},
      dialogFormVisible: false,
      tit: '新增产品',
      page: {
        current: 1,
        size: 10,
        type: 1
      },
      pagesize: 1,
      totals: 0,
      tableData: [],
      columnlist: [
        { prop: 'index', label: '序号', width: '80' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'model', label: '规格型号' },
        { prop: 'productType', label: '产品类型' },
        { prop: 'workKind', label: '基本单位' },
        { prop: 'partCodes', label: '关联零件&标准件' },
        { prop: 'workprocessCodes', label: '关联工序' },
        { prop: 'deptName', label: '所属部门' },
        { prop: 'createTime', label: '创建时间' }
      ],
     
      excel: {
        title: '导入零件',
        dialogExcelVisible: false
      }
    };
  },
  created() {
    this.getproductPage();
  },
  mounted() {},
  computed: {},
  methods: {
   
    // 数据列表
    getproductPage() {
      this.loading = true
      let obj = { ...this.seachinfo, ...this.page };
      productPage(obj).then(res => {
        this.loading = false
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.index = index + 1;
            if (item.createTime) {
              item.createTime = item.createTime.split(' ')[0];
            }
          });
          this.tableData = res.data.records;
          this.pagesize = parseInt(res.data.current);
          this.totals = parseInt(res.data.total);
        }
      });
    },

    //搜索
    seachinfo1() {
      this.page.current = 1;
      this.getproductPage();
    },
    //重置
    resetting() {
      this.seachinfo = {};
      this.page.current = 1;
      this.getproductPage();
    },
    //新增
    add() {
      this.tit = '新增产品'
      this.dialogFormVisible = true;
    },
    close(num) {
      this.dialogFormVisible = false;
      if (num === '0') {
        this.getproductPage();
      }
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getproductPage();
    },
    // 修改
    handleagin(info) {
     
      this.tit = '修改产品';
      this.$refs.productmodal.getproductInfo(info);
      this.dialogFormVisible = true;
    },
    //删除
    handleUntie(info) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          productDelete({ id: info.id, type: 1 }).then(res => {
            if (res.code === '0') {
              this.$message.success(res.msg);
              this.getproductPage();
            }
          });
        })
        .catch(() => {});
    },
    handleUpdateData() {
      this.resetting();
    },
    // Excel
    handleExcel() {
      this.excel.title = '导入产品';
      this.excel.dialogExcelVisible = true;
    },
    handleExcelClose() {
      this.excel.dialogExcelVisible = false;
    }
  }
};
</script>
<style lang="less">
.el-tooltip__popper {
  max-width: 30%;
  line-height: 30px;
}
</style>
<style lang="less">
.product {
   min-height:99% ;
  .top {
    height: 50px;
    margin-top: 10px;
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
