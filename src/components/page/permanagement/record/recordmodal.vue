<template>	
  <div class="recordmodal2">	
    <el-dialog :title="tit" :destroy-on-close='isclose' :visible.sync="dialogFormVisible" width='50%'	
      :before-close='beforclose' center>	
      <el-row>	
        <el-form :model="form" :rules="rules" ref="form">	
          <el-col :span="11">	
            <el-form-item label="设备名称" :label-width="formLabelWidth" class="formitem formitem1" prop="name">	
              <el-input v-model="form.name"></el-input>	
            </el-form-item>	
          </el-col>	
          <el-col :span="11">	
            <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">	
              <el-input v-model="form.model"></el-input>	
            </el-form-item>	
          </el-col>	
          <el-col :span="11">	
            <el-form-item label="设备编号" :label-width="formLabelWidth" class="formitem formitem1" prop="number">	
              <el-input v-model="form.number"></el-input>	
            </el-form-item>	
          </el-col>	
          <el-col :span="11">	
            <el-form-item label="设备类型" :label-width="formLabelWidth" class="formitem formitem1" prop="toTypeName">	
              <el-select v-model="form.toTypeName" placeholder="请选择">	
                <el-option v-for="item in deptlist" :key="item.enumKey" :label="item.enumValue" :value="item.enumKey">	
                  {{item.enumValue}}	
                </el-option>	
              </el-select>	
	
            </el-form-item>	
          </el-col>	
	
          <el-col :span="11">	
            <el-form-item label="所属车间" :label-width="formLabelWidth" class="formitem formitem1" prop="typeName">	
              <el-select v-model="form.typeName" placeholder="请选择">	
                <el-option v-for="item in rolelist" :key="item.enumKey" :label="item.enumValue" :value="item.enumKey">	
                </el-option>	
              </el-select>	
            </el-form-item>	
          </el-col>	
          <el-col :span="11">	
            <el-form-item label="生产厂家" :label-width="formLabelWidth" class="formitem formitem1" prop="manufacturers">	
              <el-input v-model="form.manufacturers"></el-input>	
            </el-form-item>	
          </el-col>	
          <el-col :span="11">	
            <el-form-item label="供应商" :label-width="formLabelWidth" class="formitem formitem1" prop="suppliers">	
              <el-input v-model="form.suppliers"></el-input>	
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
import { deviceToTypeList, devicesave, deviceid, deviceupdate } from 'api/main'	
import { deviceTypeList } from 'api/index'	
	
export default {	
  name: 'recordmodal2',	
	
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
      form: {	
        toType: '',	
        number: '',	
        manufacturers: '',	
        suppliers: '',	
        name: '',	
        model: '',	
        type: ''	
      },	
      formLabelWidth: '90px',	
      rules: {	
        name: [{ required: true, message: '请输入', trigger: 'blur' }],	
        model: [{ required: true, message: '请输入', trigger: 'blur' }],	
        number: [{ required: true, message: '请输入', trigger: 'blur' }],	
        toTypeName: [{ required: true, message: '请输入', trigger: 'blur' }],	
        typeName: [{ required: true, message: '请输入', trigger: 'blur' }],	
      }	
    }	
  },	
  created() {	
    this.getdeviceToTypeList()	
    this.getdeviceTypeList()	
  },	
  mounted() {	
	
  },	
  watch: {	
	
  },	
  methods: {	
    // 设备类型	
    getdeviceToTypeList() {	
      deviceToTypeList().then(res => {	
        if (res.code === '0') {	
          this.deptlist = res.data	
        }	
      })	
    },	
    //车间	
    getdeviceTypeList() {	
      deviceTypeList().then(res => {	
        if (res.code === '0') {	
          this.rolelist = res.data	
        }	
      })	
    },	
    //设备详情	
	
    getdeviceid(devicefrom) {	
      this.form = devicefrom	
      // deviceid(id).then(res => {	
      //   if (res.code === '0') {	
      //     res.data.toType = res.data.toType.toString()	
      //     this.form = res.data	
      //   }	
      // })	
    },	
    close(num) {	
      this.init()	
      this.$emit('close', num)	
    },	
    //初始化	
    init() {	
      this.form = {	
        toType: '',	
        number: '',	
        manufacturers: '',	
        suppliers: '',	
        name: '',	
        model: '',	
        type: ''	
      }	
    },	
    marksure(form) {	
      this.$refs[form].validate((valid) => {	
        if (valid) {	
          let obj = {	
            id: this.form.id,	
            toType: this.form.toType,	
            number: this.form.number,	
            manufacturers: this.form.manufacturers,	
            suppliers: this.form.suppliers,	
            name: this.form.name,	
            model: this.form.model,	
            type: this.form.type	
          }	
          if (this.tit == '新增档案') {	
            devicesave(this.form).then(res => {	
              if (res.code === '0') {	
                this.$message.success(res.msg)	
                this.close('0')	
              }	
            })	
          } else {	
            deviceupdate(obj).then(res => {	
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
.recordmodal2 {	
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
  // .formitem{	
  //     width: 45%;	
	
  //     margin-bottom: 40px;	
  // }	
  // .formitem1{	
  //     margin-right: 5%;	
  // }	
}	
</style>