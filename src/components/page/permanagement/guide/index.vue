<template>
  <div class="guide">
    <el-row :gutter="20" class="top" type="flex" justify="start">
      <el-col :span="8" class="top-left">
        <el-button v-show="$_has('GUIDEADD')" type="add" @click="handleAdd">新增</el-button>
        <el-button v-show="$_has('GUIDETADDLIST')" type="add" @click="handleExcel">EXCEL 导入</el-button>
      </el-col>
      <el-col :span="6" :offset="6">
        <el-input
          v-model="param.productNameOrCode"
          prefix-icon="el-icon-search"
          placeholder="请输入物料名称或编码"
          clearable
        >
        </el-input>
      </el-col>
      <div class="pageheader_item">
        <el-button type="add" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button type="info" icon="el-icon-refresh-right" @click="handleReset">重置</el-button>
      </div>
    </el-row>
    <div class="contentBox">
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
        <el-table-column label="序号" prop="index" width="80" align="center">
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
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button v-show="$_has('GUIDEUPDATE')" type="add" plain @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button v-show="$_has('GUIDEDELETE')" type="add" plain @click="handleDel(scope.$index, scope.row)"
              >删除</el-button
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
    <guideModal
      ref="guideModal"
      :title="raw.title"
      :dialogRawVisible="raw.dialogRawVisible"
      :ruleForm="raw.form"
      @closeDia="handleRawClose"
      @updateData="handleUpdateData"
    ></guideModal>
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
import { getGuidePage, delGuide } from '@/api/permanagement/guide';

export default {
  name: 'Guide',
  components: {
    guideModal: () => import('./guideModal'),
    excelModal: () => import('./excelModal')
  },
  data() {
    return {
      param: {
        current: 1,
        size: 10,
        productNameOrCode: ''
      },
      loading: false,
      tableData: [],
      columnlist: Object.freeze([
        { prop: 'productCode', label: '物料编码' },
        { prop: 'productName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'productType', label: '物料类别' },
        { prop: 'unit', label: '基本单位', width: 80 },
        { prop: 'deptName', label: '所属部门' },
        { prop: 'workprocessNames', label: '关联工序' },
        { prop: 'createTime', label: '新增时间' }
      ]),
      page: {
        current: 1,
        size: 10,
        total: 0,
        pages: 1
      },
      raw: {
        title: '新增',
        dialogRawVisible: false,
        form: {}
      },
      excel: {
        title: '导入导轨',
        dialogExcelVisible: false
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    getTableData() {
      for (const key in this.param) {
        if (this.param[key] === '') {
          delete this.param[key];
        }
      }
      this.loading = true;
      getGuidePage(this.param)
        .then(res => {
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
          } else {
            this.$message.error('获取数据失败，请稍后再试');
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    // 分页导航
    handleCurrentChange(val) {
      this.param.current = val;
      this.getTableData();
    },
    // 条件查询
    handleQuery() {
      this.getTableData();
    },
    // 重置
    handleReset() {
      this.param.productNameOrCode = '';
      this.getTableData();
    },
    // 新增用户的表单
    handleAdd() {
      this.raw.title = '新增';
      this.raw.form = {
        productCode: '',
        productTypeId: '',
        productName: '',
        model: '',
        unit: '',
        deptId: '',
        workprocessCodes: []
      };
      this.$refs.guideModal.getCheckNames('');
      this.raw.dialogRawVisible = true;
    },

    // 修改用户的表单
    handleEdit(index, row) {
      this.raw.title = '修改';
      if (row.workprocessCodes) {
        if (typeof row.workprocessCodes === 'string') {
          row.workprocessCodes = row.workprocessCodes.split(',');
        }
      } else {
        row.workprocessCodes = [];
      }
      console.log('row', row);
      const { id, productCode, productTypeId, productName, model, unit, deptId, workprocessCodes } = row;
      this.raw.form = {
        id,
        productCode,
        productTypeId,
        productName,
        model,
        unit,
        deptId,
        workprocessCodes
      };
      this.$refs.guideModal.getCheckNames(row.workprocessNames || '');
      this.$refs.guideModal.getWorkprocessList(row.deptId, parseInt(row.productTypeId));
      this.raw.dialogRawVisible = true;
    },
    handleUpdateData() {
      this.handleRawClose();
      this.getTableData();
    },
    handleRawClose() {
      this.raw.dialogRawVisible = false;
      this.raw.form = {
        id: '',
        productCode: '',
        productTypeId: '',
        productName: '',
        model: '',
        unit: '',
        deptId: '',
        // rawmaterialCodes: [],
        workprocessCodes: []
      };
      this.$refs.guideModal.getCheckNames('');
    },
    // 删除用户
    handleDel(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          delGuide(row.id).then(res => {
            if (res.code == 0) {
              this.$message.success('删除成功');
              if (index === 0) {
                this.param.current -= 1;
                this.getTableData();
              }
              this.page.total -= 1;
              this.tableData.splice(index, 1);
            } else {
              this.$message.error('删除失败');
            }
          });
        })
        .catch(() => {});
    },

    // Excel表单
    handleExcel() {
      this.excel.title = '导入导轨';
      this.excel.dialogExcelVisible = true;
    },
    handleExcelClose() {
      this.excel.dialogExcelVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.guide {
  .top {
    margin: 15px 0;
    .top-left {
      margin-left: 15px;
      min-width: 185px;
    }
    .el-input {
      width: calc(100% - 76px);
      margin-right: 20px;
    }
  }

  .contentBox {
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
  .pageheader_item {
    margin: 0 20px;
    min-width: 156px;
  }
}
</style>
