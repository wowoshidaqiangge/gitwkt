<template>
  <div class="tool">
    <div class="top">

      <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="end">
          <div style="flex:1">
            <el-button type="add" icon='el-icon-circle-plus-outline' v-if=" $_has('TOOLADD')" @click="add">新增
            </el-button>
            <el-button type="add" v-if=" $_has('TOOLADDLIST')" @click="addexcel">EXCEL导入</el-button>
          </div>
          <el-col :span="2" style="margin:0 20px" v-if="roleId<3">
            <el-form-item label="" prop="deptId">
              <el-select v-model="seachinfo.deptId" placeholder="部门">
                <el-option v-for="item in deptoption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="toolNameOrCode">
              <el-input placeholder="输入工具名称或编码" v-model="seachinfo.toolNameOrCode" class="elinput"> </el-input>
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
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center">
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="info" plain v-if=" $_has('TOOLUPDATE')" @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button type="danger" plainclass="red" v-if=" $_has('TOOLDELETE')"
              @click="handledistribute(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination :background="true" :current-page.sync="pagesize" @current-change="handleCurrentChange"
        layout="total, prev, pager, next" :total="pageTotal" :page-size="page.size">
      </el-pagination>
    </div>
    <toolModal :dialogFormVisible="dialogFormVisible" @close='close' :title='title' ref="toolmodal"></toolModal>
    <toolExcel :dialogExcelVisible="dialogExcelVisible" @close='close' :title='title'></toolExcel>
  </div>
</template>

<script>
import { toolpage, tooldelete } from 'api/tool'
import toolModal from './toolmodal'
import toolExcel from './toolexcel'
export default {
  name: 'tool',
  components: {
    toolModal, toolExcel
  },
  data() {
    return {
      roleId:sessionStorage.getItem('roleId'),
      dialogFormVisible: false,
      dialogExcelVisible: false,
      title: '',
      seachinfo: {
        toolNameOrCode: '',
      },
      deptoption:[
        { value: '7', label: '生产一部' },
        { value: '8', label: '生产二部' },
      ],
      columnlist: [
        { prop: 'index', label: '序号' },
        { prop: 'toolCode', label: '工具编码' },
        { prop: 'toolName', label: '工具名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'deptName', label: '所属部门' },
        { prop: 'createTime', label: '新增时间' },
      ],
      tableData: [],
      page: {
        current: 1,
        size: 10
      },
      pagesize: 1,
      pageTotal: 0,
      screenWidth: (document.body.clientHeight - 215) + 'px',
    };
  },
  created() {
    this.getTableData()
  },
  mounted() {

  },
  watch: {},
  computed: {},
  methods: {
    add() {
      this.title = '新增工具';
      this.dialogFormVisible = true;
    },
    addexcel() {
      this.title = "导入EXCEL"
      this.dialogExcelVisible = true
    },
    seachinfo1() {
      this.page.current = 1
      this.getTableData()
    },
    resetting() {
      this.seachinfo = { toolNameOrCode: '',deptId:'' };
      this.page.current = 1;
      this.getTableData();
    },
    //修改
    handleEdit(h, m) {
      this.title = '修改工具';
      this.$refs.toolmodal.getToolForm(m);
      this.dialogFormVisible = true;
    },
    handledistribute(h, m) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          tooldelete(m).then(res => {
            if (res.code === '0') {
              this.$message.success(res.msg);
              this.getTableData();
            }
          });
        })
        .catch(() => { });
    },
    getTableData() {
      let obj = { ...this.seachinfo, ...this.page };
      toolpage(obj).then(res => {
        // console.log(res)
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.index = index + 1
          })
          this.tableData = res.data.records
          this.pageTotal = parseInt(res.data.total);
        }
      })

    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getTableData();
    },
    close(num) {
      this.dialogFormVisible = false
      this.dialogExcelVisible = false
      if (num === '0') {
        this.getTableData()
      }
    }
  }
};
</script>

<style lang='less'>
.tool {
  width: 100%;
  height: 100%;
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
