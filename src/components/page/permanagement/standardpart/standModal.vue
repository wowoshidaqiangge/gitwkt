<template>
  <div class="standModal">
    <el-dialog :title="title" :visible="dialogRawVisible" id="myDialog" width="50%" :before-close="beforeClose" center>
      <el-form class="myForm flex" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="物料编码" prop="partCode">
          <el-input v-model="ruleForm.partCode" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物料图号" prop="partNumber">
          <el-input v-model="ruleForm.partNumber" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="partName">
          <el-input v-model="ruleForm.partName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="ruleForm.model" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="基本单位" prop="unit">
          <el-select v-model="ruleForm.unit" placeholder="请选择单位">
            <el-option v-for="(item, index) in unitOptions" :key="index" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="ruleForm.deptId" placeholder="请选择部门">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn--cancel" @click="handleClose">取 消</el-button>
        <el-button type="add" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProduceDeptList } from '@/api/main'; // 公共api
import { addStand, putStand } from '@/api/permanagement/material';
export default {
  name: 'standModal',
  props: {
    dialogRawVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增'
    },
    ruleForm: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      unitOptions: ['个', '件', '只', '条', '台'],
      deptOptions: [],
      rules: {
        partCode: [
          {
            required: true,
            message: '请添加物料编码',
            trigger: 'change'
          }
        ],
        partNumber: [
          {
            required: true,
            message: '请添加物料图号',
            trigger: 'change'
          }
        ],
        partName: [
          {
            required: true,
            message: '请添加物料名称',
            trigger: 'change'
          }
        ],
        model: [
          {
            required: true,
            message: '请添加型号',
            trigger: 'change'
          }
        ],
        unit: [
          {
            required: true,
            message: '请选择单位',
            trigger: 'change'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getDeptList();
    },
    getDeptList() {
      getProduceDeptList().then(res => {
        res = res.data;
        console.log(res);
        this.deptOptions = res;
      });
    },

    // 提交表单
    handleSubmit() {
      if (this.title === '新增') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            addStand(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success('添加成功');
                this.handleUpdate();
              } else {
                this.$message.error('添加失败，请稍后重试');
                return;
              }
              // this.handleClose();
            });
          } else {
            this.$message.warning('请填写完整');
            return;
          }
        });
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            putStand(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success(`修改成功`);
                this.handleUpdate();
              } else {
                this.$message.error('修改失败，请稍后重试');
              }
              // this.handleClose();
            });
          } else {
            this.$message.warning('请填写完整');
            return;
          }
        });
      }
    },
    handleUpdate() {
      this.$refs.ruleForm.resetFields();
      this.$emit('updateData');
    },
    beforeClose(done) {
      this.handleClose();
      done();
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.$emit('closeDia');
    }
  }
};
</script>
<style lang="less" scoped>
.standModal {
  #myDialog /deep/ .el-dialog {
    border-radius: 5px;
    border-color: #409baf;

    .el-dialog__header {
      background-color: #409baf;
      border-radius: 5px 5px 0 0;
      .el-dialog__title {
        color: #fff;
        letter-spacing: 2px;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 35px 35px 35px 15px;
    }
    .el-dialog__footer {
      border-radius: 0 0 5px 5px;
      text-align: center;

      .btn--cancel {
        margin-right: 15px;
      }
      .btn--cancel:focus,
      .btn--cancel:hover {
        border-color: #409baf;
        background-color: #fff;
        color: #409baf;
      }
    }

    .el-form {
      display: flex;
      flex-wrap: wrap;

      .el-form-item {
        width: 50%;
      }

      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
