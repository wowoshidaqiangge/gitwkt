<template>
  <div class="staff">
    <div class="left" v-loading='leftloading' element-loading-spinner="el-icon-loading" element-loading-text="加载中...">
      <div class="tit">
        <i class=" el-icon-menu"></i>
        组织机构
      </div>
      <el-tree :data="data" style="margin:3px" :default-expand-all='true' :render-content="renderContent"
        @node-click="handleNodeClick">
      </el-tree>
    </div>
    <div class="right">
      <div class="top">

        <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
          <el-row type="flex" justify="end">
            <div style="flex:1">
              <el-button type="add" v-if="$_has('STAFFADD')" icon='el-icon-circle-plus-outline' @click="add">新增
              </el-button>
            </div>

            <el-col :span="3" style="margin:0 20px">
              <el-form-item label="" prop="isValid">
                <el-select v-model="seachinfo.isValid" placeholder="状态">
                  <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="" prop="userNameOrPhone">
                <el-input placeholder="输入员工姓名或手机号" v-model="seachinfo.userNameOrPhone" class="elinput"> </el-input>
              </el-form-item>

            </el-col>
            <div style="margin:0 15px">
              <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
              <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
            </div>
          </el-row>
        </el-form>

      </div>
      <div class="bot" v-loading='botloading' element-loading-spinner="el-icon-loading" element-loading-text="加载中...">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column v-for="(item,index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
            align="center">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isValid== '1' ">正常</span>
              <span v-if="scope.row.isValid== '0' " style="color:red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button type="add" v-if="scope.row.isValid ==0 & $_has('STAFFUNLOCK')" plain
                @click="handle(1, scope.row)">启用</el-button>
              <el-button type="error" plain v-if="scope.row.isValid ==1&$_has('STAFFLOCK') "
                @click="handle(0, scope.row)">禁用</el-button>
              <el-button type="success" plain v-if="scope.row.isValid ==1&$_has('STAFFUPDATE') "
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>

              <el-button type="info" v-if="scope.row.isValid ==1 &$_has('STAFFDELETE')" plain class="red"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="page">
          <el-pagination :background='true' :current-page.sync="pagesize" @current-change="handleCurrentChange"
            layout="total, prev, pager, next" :total="totals" :page-size="page.size">
          </el-pagination>
        </div>
      </div>
    </div>
    <Modal :dialogFormVisible='dialogFormVisible' @close='close' ref='staffmodal' :isedit='isedit' :tit='tit' />
  </div>
</template>

<script>
import { deptList, userPage, userDelete, authputUserid, updateValid } from 'api/index'
import Modal from './staffmodal'
export default {
  name: 'staff',
  components: {
    Modal
  },
  data() {
    return {
      screenWidth: (document.body.clientHeight - 215) + 'px',
      seachinfo: {
        userNameOrPhone: '',
        isValid: ''
      },
      value1: '',
      tit: '',
      dialogFormVisible: false,
      leftloading: false,
      botloading: false,
      visible: false,
      data: [],
      value: '',
      tableData: [],
      columnlist: [
        { prop: 'index', label: '序号' },
        { prop: 'name', label: '员工姓名' },
        { prop: 'phone', label: '手机号' },
        { prop: 'deptName', label: '部门' },
        { prop: 'roleName', label: '角色' },
        { prop: 'icCard', label: 'IC卡' },
        { prop: 'createTime', label: '创建时间' },
      ],
      page: {
        current: 1,
        size: 10,
      },
      totals: 0,
      pagesize: 1,
      isedit: false,
      options: [
        { name: '正常', value: '1' },
        { name: '禁用', value: '0' }
      ]
    }
  },
  created() {
    this.getdeptList()
    this.getuserPage()
  },
  methods: {
    // 搜索
    seachinfo1() {
      this.page.current = 1
      this.getuserPage()
    },
    // 重置
    resetting() {
      this.seachinfo = {
        userNameOrPhone: '',
        isValid: ''
      }
      this.page.current = 1
      this.getuserPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.page.current = val
      this.getuserPage()
      console.log(`当前页: ${val}`);
    },
    add() {
      this.isedit = false
      this.tit = '新增员工'
      this.dialogFormVisible = true
    },
    close(h) {
      this.dialogFormVisible = false
      if (h === '0') {
        this.getuserPage()

      }
    },
    handleEdit(h, m) {
      this.tit = '编辑员工'
      this.isedit = true
      this.$refs.staffmodal.getauthputUserid({ id: m.id })
      this.dialogFormVisible = true
    },
    // 添加树状图icon
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <i class={data.obj.icon}></i>
          <span> {node.label}</span>
        </span>
      )
    },
    // 删除
    handleDelete(h, m) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        userDelete(m).then(res => {
          if (res.code === '0') {
            this.init()
            this.getuserPage()
            this.$message.success('删除成功');
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => { });

    },
    // 禁用启用
    handle(h, m) {
      let obj = { id: m.id, isValid: h }
      updateValid(obj).then(res => {
        if (res.code === '0') {
          this.$message.success(res.msg)
          this.getuserPage()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    init() {
      this.page = { current: 1, size: 10 }
    },
    // 组织架构列表点击
    handleNodeClick(data) {
      this.seachinfo.deptId = data.id
      this.getuserPage()
    },
    getuserPage() {
      this.botloading = true
      let obj = { ...this.seachinfo, ...this.page }
      if (this.seachinfo.deptId) {
        obj.deptId = this.seachinfo.deptId
      }
      userPage(obj).then(res => {
        this.botloading = false
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.index = index + 1
            if (!item.roleName) {
              item.roleName = '班组长'
            }
            item.createTime = item.createTime.split(' ')[0]
          })
          this.tableData = res.data.records
          this.pagesize = parseInt(res.data.current)
          this.totals = parseInt(res.data.total)
        }
      })
    },
    getdeptList() {
      this.leftloading = true
      deptList().then(res => {
        this.leftloading = false
        if (res.code === '0') {
          this.data = res.data
          // this.data = this.getarr(res.data)
          // console.log(this.getarr(res.data))
        }
      })
    }
  }
}
</script>


<style lang='less'>
.staff {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    width: 180px;
    box-shadow: 0px 1px 4px 2px rgba(0, 150, 255, 0.09);
    border-radius: 5px;
    .tit {
      height: 60px;
      margin-top: 10px;
      line-height: 60px;
      border-bottom: 1px solid #64a3d3;
      margin: 0 9px;
      margin-bottom: 10px;
    }
  }
  .right {
    flex: 1;
    width: 100px;
    box-shadow: 0px 1px 4px 2px rgba(0, 150, 255, 0.09);
    border-radius: 5px;
    padding: 0 10px;
    .top {
      height: 50px;
      margin-top: 10px;
      .bot {
        .el-form-item__content {
          // width: calc(100% - 80px);
          float: right;
        }
      }
    }
    .bot {
      height: calc(100% - 45px);
    }

    .page {
      margin: 10px 0;
      float: right;
    }
    .el-pager li.active {
      background-color: #409baf !important;
      color: #fff;
    }
  }
}
</style>
