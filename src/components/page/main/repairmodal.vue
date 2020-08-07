<template>
  <div class="repairmodal3">
    <el-dialog :title="tit" :destroy-on-close='isclose' :visible.sync="dialogFormVisible" width='50%'
      :before-close='beforclose' center>
      <el-row>
        <el-form :model="form" :rules="rules" ref="form">
          <el-col :span="22">
            <el-form-item label="故障设备" :label-width="formLabelWidth" class="formitem formitem1" prop="deviceId">
              <el-select v-model="form.deviceId" filterable placeholder="请选择" @change='changeselect'>
                <el-option v-for="item in deptlist" :key="item.id" :label="item.name" :value="item.id">
                  {{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备名称" :label-width="formLabelWidth" class="formitem formitem1" prop="name">
              <el-input placeholder="请输入内容" v-model="deviceInfo.name" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="规格编号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
              <el-input placeholder="请输入内容" v-model="deviceInfo.model" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备类型" :label-width="formLabelWidth" class="formitem formitem1" prop="toType">
              <el-input placeholder="请输入内容" v-model="deviceInfo.toTypeName" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备编号" :label-width="formLabelWidth" class="formitem formitem1" prop="number">
              <el-input placeholder="请输入内容" v-model="deviceInfo.number" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="故障时间" :label-width="formLabelWidth" class="formitem formitem1" prop="dateTime">
              <el-date-picker v-model="form.dateTime" @change='changetime' type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="故障原因" :label-width="formLabelWidth" class="formitem formitem1" prop="fault">
              <el-input type="textarea" :rows="2" v-model="form.fault"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="解决办法" :label-width="formLabelWidth" class="formitem formitem1" prop="solution">
              <el-input type="textarea" :rows="2" v-model="form.solution"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="维修人" :label-width="formLabelWidth" class="formitem formitem1" prop="repairUserId">
              <el-cascader v-model="form.repairUserId" :options="userlist" :props="casprops"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="验收人" :label-width="formLabelWidth" class="formitem formitem1" prop="checkUserId">
              <el-cascader v-model="form.checkUserId" :options="userlist" :props="casprops"></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="当前状态" :label-width="formLabelWidth" class="formitem formitem1" prop="state">
              <el-radio-group v-model="form.state">
                <el-radio :label="0">待检修</el-radio>
                <el-radio :label="1">已完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mainrepairid, mainrepairadd, mainrepairput, devInfo } from 'api/main'
import { userListByDept } from 'api/index'
import { deviceList } from 'api/index'
import moment from 'moment'
export default {
  name: 'repairmodal3',

  props: {
    dialogFormVisible: {
      type: Boolean
    },
    tit: {
      type: String
    },

  },
  data() {
    return {
      isclose: true,
      sureload: false,
      deptlist: [],
      rolelist: [],
      deviceInfo: {
        name: '',
        model: '',
        number: '',
        toType: ''
      },
      form: {
        category: '',
        deviceId: '',
        period: 'A型',
        dateTime: '',
        assumeUserId: '',
        dutyUserId: '',
        remark: ''
      },
      formLabelWidth: '90px',
      rules: {
        deviceId: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        state: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        dateTime: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        fault: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        solution: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        fault: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        repairUserId: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        checkUserId: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],

      },
      timelist: [{ value: 'year', label: '按年' }, { value: 'month', label: '按月' }],
      userlist: [],
      casprops: {
        label: 'title',
        value: 'id',
        children: 'userList'
      }
    }
  },
  created() {
    //   this.getdeviceToTypeList()
    this.getuserPage()
    this.getdeviceList()
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    //查看详情
    getmainrepairid(id) {
      mainrepairid(id).then(res => {
        if (res.code === '0') {
          this.form = res.data
          this.changeselect(res.data.deviceId)
        }
      })
    },
    // 获取用户列表
    getuserPage() {
      userListByDept().then(res => {
        if (res.code === '0') {
          this.userlist = res.data;
        }
      })
    },
    // 设备类型
    getdeviceList() {
      deviceList().then(res => {
        if (res.code === '0') {
          this.deptlist = res.data
        }
      })
    },
    // 修改设备
    changeselect(val) {
      console.log(val)
      devInfo({ id: val }).then(res => {
        if (res.code === '0') {
          this.deviceInfo = res.data
        }
      })
    },
    // 修改时间
    changetime(val) {
      this.form.dateTime = moment(val).format('YYYY-MM-DD')
    },
    close(num) {
      this.init()
      this.$emit('close', num)
    },
    //初始化
    init() {
      this.form = {
        category: '',
        deviceId: '',
        period: 'A型',
        dateTime: '',
        assumeUserId: '',
        dutyUserId: '',
        remark: ''
      }
      this.deviceInfo = {
        name: '',
        model: '',
        number: '',
        toType: ''
      }
    },
    marksure(form) {
      this.$refs[form].validate((valid) => {

        let formObj = this.form
        if (Array.isArray(this.form.checkUserId)) {
          formObj.checkUserId = this.form.checkUserId[1]
        } else {
          formObj.checkUserId = this.form.checkUserId
        }
        if (Array.isArray(this.form.repairUserId)) {
          formObj.repairUserId = this.form.repairUserId[1]
        } else {
          formObj.repairUserId = this.form.repairUserId
        }
        if (valid) {
          if (this.tit === '新增') {
            mainrepairadd(this.form).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg)
                this.close('0')
              }
            })
          } else {
            mainrepairput(this.form).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg)
                this.close('0')
              }
            })
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    beforclose() {
      this.init()
      this.$emit('close', false)
    }
  }
}
</script>


<style lang='less'>
.repairmodal3 {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    background-color: #409baf;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .el-dialog__title {
      color: #fff;
      letter-spacing: 2px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .dialog-footer {
    text-align: end;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .el-select {
    width: 100%;
  }
  .el-col {
    margin-bottom: 20px;
  }
}
</style>
