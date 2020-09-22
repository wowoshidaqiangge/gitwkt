<template>
  <div class="recordmodal2">
    <el-dialog :title="title" :destroy-on-close='isclose' :visible.sync="dialogFormVisible" width='50%'
      :before-close='beforclose' center>
      <el-row>
        <el-form :model="form" :rules="rules" ref="form">
          <el-col :span="11">
            <el-form-item label="工具编码" :label-width="formLabelWidth" class="formitem formitem1" prop="toolCode">
              <el-input v-model.number="form.toolCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="工具名称" :label-width="formLabelWidth" class="formitem formitem1" prop="toolName">
              <el-input v-model="form.toolName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
              <el-input v-model="form.model"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生产部门" :label-width="formLabelWidth" prop='deptId'>
              <el-select v-model="form.deptId" class="setwidth" @change="getValue" placeholder="请选择">
                <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属部门" :label-width="formLabelWidth" class="formitem formitem1" prop="deptId">
              <SelectTree :props="props" :options="optionData" :value="form.deptId" :clearable="isClearable"
                :accordion="isAccordion" @getValue="getValue($event)" v-if="title =='修改工具'" />
              <SelectTree :props="props" :options="optionData" :clearable="isClearable" :accordion="isAccordion"
                @getValue="getValue($event)" v-else />
            </el-form-item> -->
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
import SelectTree from '@/components/common/treeSelect';
import { tooladd, toolupdate } from 'api/tool'
import { getProduceDeptList } from 'api/product'
// import { dept } from 'api/index';
export default {
  name: "toolModal",
  components: {
    SelectTree
  },
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    title: {
      type: String
    },
  },
  data() {
    return {
      isclose: true,
      sureload: false,
      deptList: [],
      form: {
        toolCode: '',
        toolName: '',
        model: '',
        deptId: '',
      },
      formLabelWidth: '90px',
      rules: {
        toolCode: [
          { required: true, message: '请输入工具编码', trigger: 'blur' },
          // { type: 'number', message: '必须为数字', trigger: 'blur' }
        ],
        toolName: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
      },
      isClearable: false, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      }
    }
  },
  created() {
    this.getdept();
  },
  mounted() { },
  computed: {
    /* 转树形数据 */
    // optionData() {
    //   let cloneData = JSON.parse(JSON.stringify(this.deptlist)); // 对源数据深度克隆
    //   return cloneData.filter(father => {
    //     // 循环所有项，并添加children属性
    //     let branchArr = cloneData.filter(child => father.id == child.parentId); // 返回每一项的子级数组
    //     branchArr.length > 0 ? (father.children = branchArr) : ''; //给父级添加一个children属性，并赋值
    //     return father.parentId == 0; //返回第一层
    //   });
    // }
  },
  methods: {
    //初始化
    init() {
      this.form = {
        toolCode: '',
        toolName: '',
        model: '',
        deptId: '',
      }
    },
    getToolForm(toolForm) {
      this.form = toolForm
    },
    getdept() {
      getProduceDeptList().then(res => {
        if (res.code === '0') {
          this.deptList = res.data;
          console.log(this.deptlist)
        }
      });
    },
    getValue(value) {
      this.form.deptId = value;
    },
    close(num) {
      this.init()
      this.$emit('close', num)
    },
    beforclose() {
      this.init()
      this.$emit('close', false)
    },
    marksure(form) {

      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.title == '新增工具') {
            tooladd(this.form).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg)
                this.close('0')
              }
            })
            this.close('0')
          } else {
            toolupdate(this.form).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg)
                this.close('0')
              }
            })
            this.close('0')
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
<style lang="less">
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