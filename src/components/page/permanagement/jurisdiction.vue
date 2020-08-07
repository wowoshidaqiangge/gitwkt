<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <el-button type="add" plain icon="el-icon-circle-plus-outline" v-if=" $_has('JURISDICTIONADD')" @click="add">
            新增</el-button>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="index" label="序号" align="center" width=80></el-table-column>
      <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="users" align="center" label="用户列表"></el-table-column>
      <el-table-column prop="remark" align="center" label="描述"></el-table-column>

      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button type="success" plain icon="el-icon-edit" v-if=" $_has('JURISDICTIONUPDATE')"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="info" plain icon="el-icon-delete" class="red" v-if=" $_has('JURISDICTIONDELETE')"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Modal1 :dialogFormVisible="dialogFormVisible" ref="juri" :tit="tit" @close="close" :isedit="isedit" />
  </div>
</template>

<script>
import { roleList, roleDelete } from 'api/index';
import Modal1 from './jurimodal';
export default {
  name: 'jurisdiction',
  components: {
    Modal1
  },
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      tit: '',
      isedit: false
    };
  },
  created() {
    this.getroleList();
  },
  methods: {
    handleDelete(h, m) {

      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          roleDelete(m).then(res => {
            if (res.code === '0') {
              this.getroleList();
              this.$message.success('删除成功');
            } else {
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'error'
              });
            }
          });
        })
        .catch(() => { });
    },
    handleEdit(h, m) {
      this.tit = '编辑角色';
      this.isedit = true;
      this.$refs.juri.getauthroleid({ id: m.id });
      this.$forceUpdate;
      this.dialogFormVisible = true;
    },
    close(h) {
      this.dialogFormVisible = false;
      if (h === '0') {
        this.getroleList();
      }
    },
    add() {
      this.tit = '新增角色';
      this.isedit = false;
      this.dialogFormVisible = true;
    },
    getroleList() {
      roleList().then(res => {
        if (res.code === '0') {
          res.data.map((item, index) => {
            item.index = index + 1;
          });

          this.tableData = res.data;
        }
      });
    }
  }
};
</script>


<style scoped>
</style>
