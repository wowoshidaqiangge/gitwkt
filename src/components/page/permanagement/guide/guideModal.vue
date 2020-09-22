<template>
  <div class="guideModal">
    <el-dialog :title="title" :visible="dialogRawVisible" id="myDialog" width="50%" :before-close="beforeClose" center>
      <el-form class="myForm flex" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="物料编码" prop="productCode">
          <el-input v-model="ruleForm.productCode" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="物料名称" prop="productName">
          <el-input v-model="ruleForm.productName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="model">
          <el-input v-model="ruleForm.model" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="ruleForm.deptId" placeholder="请选择部门" @change="deptChange">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基本单位" prop="unit">
          <el-select v-model="ruleForm.unit" placeholder="请选择单位">
            <el-option v-for="(item, index) in unitOptions" :key="index" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料类别" prop="productTypeId">
          <el-select v-model="ruleForm.productTypeId" placeholder="" @change="typeChange">
            <el-option label="线轨" value="4"> </el-option>
            <el-option label="滑块" value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联工序" prop="workprocessCodes">
          <template>
            <el-input type="textarea" autosize placeholder="关联的工序" v-model="checkProcessNames" disabled>
            </el-input>
            <el-checkbox-group v-model="ruleForm.workprocessCodes" @change="processChange">
              <el-checkbox
                v-for="item in processList"
                :key="item.workprocessCode"
                :label="item.workprocessCode"
                @change="val => processItemChange(val, item.workprocessName)"
                >{{ item.workprocessName }}</el-checkbox
              >
            </el-checkbox-group>
          </template>
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
import { getProcessList } from '@/api/common/index';
import { addGuide, putGuide } from '@/api/permanagement/guide';
export default {
  name: 'guideModal',
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
      param: {
        deptId: '',
        itemType: 3
      },
      unitOptions: ['个', '只', '件', '条', '支', '面', '台'],
      deptOptions: [],
      rawList: [],
      processList: [],
      initProcessList: [],
      checkRawNames: '',
      checkProcessNames: '',
      rules: {
        productCode: [
          {
            required: true,
            message: '请添加物料编码',
            trigger: 'blur'
          }
        ],
        productName: [
          {
            required: true,
            message: '请添加物料名称',
            trigger: 'blur'
          }
        ],
        model: [
          {
            required: true,
            message: '请添加型号',
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请选择单位',
            trigger: 'blur'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'blur'
          }
        ],
        productTypeId: [
          {
            required: true,
            message: '请选择物料类别',
            trigger: 'blur'
          }
        ],
        workprocessCodes: [
          {
            required: true,
            message: '请选择关联工序',
            trigger: 'blur'
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
      // this.getUnitList();
    },
    getDeptList() {
      getProduceDeptList().then(res => {
        res = res.data;
        console.log(res);
        this.deptOptions = res;
      });
    },
    getWorkprocessList(id, type) {
      getProcessList(id, type).then(res => {
        res = res.data;
        res.map(item => {
          const { id, workprocessCode, workprocessName, type } = item;
          this.processList.push({ workprocessId: id, workprocessCode, workprocessName, type });
        });
      });
    },
    getCheckNames(name) {
      this.checkProcessNames = name;
    },
    deptChange(val) {
      this.param.deptId = val;
      this.processList = [];
      this.checkProcessNames = '';
      this.ruleForm.productTypeId = '';
      this.ruleForm.workprocessCodes = [];
      this.getWorkprocessList(this.param.deptId, '');
    },
    typeChange(val) {
      this.param.itemType = parseInt(val);
      this.processList = [];
      this.checkProcessNames = '';
      this.ruleForm.workprocessCodes = [];
      this.getWorkprocessList(this.ruleForm.deptId, this.param.itemType);
    },
    processChange(val) {
      console.log(val);
      let wangongCode = '';
      let wangongName = '';
      for (let i of this.processList) {
        if (i.workprocessName === '完工' && i.type == 5) {
          wangongCode = i.workprocessCode;
          wangongName = i.workprocessName;
        }
      }
      if (wangongCode !== '') {
        if (!val.includes(wangongCode)) {
          // 没有则新增，正好在队尾
          val.push(wangongCode);
          this.processItemChange(true, wangongName);
        } else {
          // 已有则移动到队尾
          const index = val.indexOf(wangongCode);
          val.splice(index, 1);
          this.processItemChange(false, wangongName);

          val.push(wangongCode);
          this.processItemChange(true, wangongName);
        }
      }
      this.ruleForm.workprocessCodes = val;
    },
    processItemChange(val, name) {
      console.log(this.checkProcessNames);
      console.log(val, name);
      if (val) {
        if (this.checkProcessNames === '') {
          this.checkProcessNames = this.checkProcessNames + name;
        } else {
          this.checkProcessNames = this.checkProcessNames + ',' + name;
        }
      } else {
        let tmpArr = this.checkProcessNames.split(',');
        const index = tmpArr.indexOf(name);
        if (index > -1) {
          tmpArr.splice(index, 1);
        }
        this.checkProcessNames = tmpArr.join(',');
      }
    },
    // 提交表单
    handleSubmit() {
      if (this.title === '新增') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            addGuide(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success('添加成功');
                this.handleUpdate();
              } else {
                this.$message.error('添加失败，请稍后重试');
                this.handleClose();
              }
            });
          } else {
            this.$message.warning('请填写完整');
            return;
          }
        });
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            putGuide(this.ruleForm).then(res => {
              if (res.code == 0) {
                this.$message.success(`修改成功`);
                this.handleUpdate();
              } else {
                this.$message.error('修改失败，请稍后重试');
                this.handleClose();
              }
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
      this.checkRawNames = '';
      this.checkProcessNames = '';
      this.processList = [];
      this.$emit('updateData');
    },
    beforeClose(done) {
      this.handleClose();
      done();
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.checkRawNames = '';
      this.checkProcessNames = '';
      this.processList = [];
      this.$emit('closeDia');
    }
  }
};
</script>
<style lang="less" scoped>
.guideModal {
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
    .el-form-item:nth-last-child(1) {
      // margin-top: 5px;
      width: 100%;
      .el-textarea {
        /deep/ .el-textarea__inner {
          color: #333;
          background-color: #ccc3;
        }
      }
      .el-checkbox-group {
        margin-top: 15px;
        padding: 10px;
        outline: 1px dashed #999;
        min-height: 20px;
      }
    }
  }
}
</style>
