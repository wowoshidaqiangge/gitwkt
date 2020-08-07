<template>
  <div class="bookmodal">
    <el-dialog
      title="报工"
      :destroy-on-close="isclose"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="beforclose"
      center
    >
      <div v-show="booking">
        <p class="modal__tip">请刷取您的员工卡或账号密码验证身份，开始报工！</p>
        <el-input
          class="modal__input"
          v-model="input"
          placeholder="方式一：刷卡报工"
          ref="getFocus1"
          @keyup.enter.native="bookSubmit()"
        ></el-input>
        <el-input class="modal__input" v-model="passwordInput" placeholder="方式二：密码验证"></el-input>
        <el-button type="add" @click="bookSubmit()" style="margin-left:1rem">确定</el-button>
      </div>
      <div v-show="!booking && !bookingSuc">
        <p class="modaltit1">工单信息：</p>
        <el-row>
          <el-form :model="form" :rules="rules" ref="form">
            <div class="modalcont">
              <el-col :span="11">
                <el-form-item
                  label="工单号码"
                  :label-width="formLabelWidth"
                  class="formitem formitem1"
                  prop="taskNumber"
                >
                  <el-input v-model="form.taskNumber" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="物料名称" :label-width="formLabelWidth" class="formitem formitem1" prop="itemName">
                  <el-input v-model="form.itemName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="物料编码" :label-width="formLabelWidth" class="formitem formitem1" prop="itemCode">
                  <el-input v-model="form.itemCode" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="规则型号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
                  <el-input v-model="form.itemModel" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  label="计划产量"
                  :label-width="formLabelWidth"
                  class="formitem formitem1"
                  prop="planYield"
                >
                  <el-input v-model="form.planYield" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="所属部门" :label-width="formLabelWidth" class="formitem formitem1" prop="deptName">
                  <el-input v-model="form.deptName" disabled></el-input>
                </el-form-item>
              </el-col>
            </div>

            <el-col :span="21">
              <p class="modaltit1">请填写生产数量：</p>
            </el-col>

            <el-col :span="11">
              <el-form-item
                label="生产数量"
                :label-width="formLabelWidth"
                class="formitem formitem1"
                prop="produceCount"
              >
                <el-input v-model.number="form.produceCount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="已生产数" :label-width="formLabelWidth" class="formitem formitem1" prop="nowCount">
                <el-input v-model="form.nowCount" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close" style="margin-right:1rem">取 消</el-button>
          <el-button type="add" @click="makesure()" :disabled="btnDisabled" :loading="sureload">{{
            sureloadText
          }}</el-button>
        </div>
      </div>
      <div v-show="bookingSuc">
        <p class="modal__tip">报工成功！本次报工{{ form.produceCount }}件，累计报工 {{ nowCountVal }} 件。</p>
        <i class="el-icon-success icon--suc"></i>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { produceTaskReport } from 'api/headman';
export default {
  name: 'bookmodal',
  props: {
    dialogVisible: {
      type: Boolean
    },
    isedit: {
      type: Boolean
    }
  },
  data() {
    return {
      password: '',
      username: '',
      icCard: '',
      booking: true,
      input: '',
      passwordInput: '',
      isclose: true,
      btnDisabled: false,
      sureload: false,
      sureloadText: '确 定',
      form: {
        taskNumber: '',
        nowCount: 0,
        deviceType: '',
        planManhourAvgyield: '',
        specificationModel: '',
        productName: '',
        productCode: '',
        produceCount: ''
      },
      formLabelWidth: '80px',
      rules: {
        produceCount: [{ type: 'number', required: true, message: '输入必须为数字', min: 0, trigger: 'blur' }]
      },
      nowCountVal: 0,
      bookingSuc: false
    };
  },
  created() {
    this.icCard = sessionStorage.getItem('icCard');
    this.password = sessionStorage.getItem('password') || '';
    this.username = sessionStorage.getItem('ms_username') || '';
  },
  mounted() {},
  methods: {
    //初始化
    init() {
      this.form = {
        taskNumber: '',
        nowCount: '',
        deviceType: '',
        planManhourAvgyield: '',
        specificationModel: '',
        productName: '',
        productCode: '',
        produceCount: ''
      };
      this.input = '';
      this.passwordInput = '';
      this.booking = true;
      this.bookingSuc = false;
    },
    bookSubmit() {
      if (this.icCard === this.input || this.password === this.passwordInput) {
        this.booking = false;
      } else {
        this.$message.error('卡号或密码与登录者不符！');
      }
    },
    getform(info) {
      this.form = info;
      this.form.nowCount = info.nowCount ? info.nowCount : 0;
      this.nowCountVal = parseInt(this.form.nowCount);
      this.form.produceCount = '';
      console.log('form', this.form);
      this.$nextTick(function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
          this.$refs.getFocus1.focus();
        }, 100);
      });
    },
    makesure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { produceTaskId, produceTaskPlanId, deviceId, workprocessId, taskNumber, produceCount } = this.form;
          const obj = { produceTaskId, produceTaskPlanId, deviceId, workprocessId, taskNumber, produceCount };
          this.sureload = true;
          this.sureloadText = '提交中...';
          this.btnDisabled = true;
          produceTaskReport(obj).then(res => {
            if (res.code === '0') {
              this.nowCountVal = this.nowCountVal + parseInt(this.form.produceCount);
              this.bookingSuc = true;
              this.btnDisabled = false;
              this.sureload = false;
              this.sureloadText = '确 定';
              setTimeout(() => {
                this.close('0', this.nowCountVal);
              }, 1200);
            } else {
              // this.$message.error(res.msg);
              this.sureload = false;
              this.sureloadText = '确 定';
              this.btnDisabled = false;
            }
          });
        } else {
          this.$message.warning('请正确填写生产数量');
        }
      });
    },
    beforclose() {
      this.init();
      // this.$emit('close', false);
      this.close('0', this.nowCountVal);
    },
    // updateData(){
    //   this.$emit('update', num, val);
    // },
    close(num, val) {
      this.init();
      this.$emit('close', num, val);
    },
    // 防抖
    debounce(func, wait = 50, immediate = true) {
      let timer, context, args;
      const later = () =>
        setTimeout(() => {
          timer = null;
          if (!immediate) {
            func.apply(context, args);
            context = args = null;
          }
        }, wait);
      return function(...params) {
        if (!timer) {
          timer = later();
          if (immediate) {
            func.apply(this, params);
          } else {
            context = this;
            args = params;
          }
        } else {
          clearTimeout(timer);
          timer = later();
        }
      };
    }
  }
};
</script>

<style lang="less">
.bookmodal {
  .modalcont {
    padding: 25px 0;
    border: 1px dashed #aaa;
    margin-bottom: 15px;
    height: 140px;
  }
  .modaltit1 {
    padding: 10px 0;
    font-size: 18px;
    color: #324170;
  }
  .dialog-footer {
    text-align: center;
  }
  .icon--suc {
    font-size: 40px;
    color: green;
    margin-left: calc(50% - 20px);
  }
}
</style>
