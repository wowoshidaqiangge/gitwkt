<template>
  <div class="assignmodal">
    <el-dialog :title="tit" :visible.sync="dialogFormVisible" :before-close="beforclose" center>
      <p class="modaltit1">工单信息：</p>
      <el-row>
        <el-form :model="form" ref="form" :rules="rules">
          <div class="modalcont">
            <el-col :span="11">
              <el-form-item label="编号" :label-width="formLabelWidth" prop="index">
                <el-input v-model="form.index" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <div style="height:51px;flex:1;"></div>
            <el-col :span="11">
              <el-form-item label="工种" :label-width="formLabelWidth" prop="workKind">
                <el-input v-model="form.workKind" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工序" :label-width="formLabelWidth" prop="workprocessName">
                <el-input v-model="form.workprocessName" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="11">
            <el-form-item label="派单数量" :label-width="formLabelWidth" prop="assignCount">
              <el-input v-model="form.assignCount" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="tit !== '工单分解'">
            <el-form-item label="结算方式" :label-width="formLabelWidth" prop="accountType">
              <el-cascader v-model="form.accountType" :options="accountTypeList" :props="casprops2" style="width:100%">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="tit !== '工单分解'">
            <el-form-item label="计划结束时间" :label-width="formLabelWidth" prop="planEndTime">
              <el-date-picker style="width:100%" v-model="form.planEndTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div style="height:51px;flex:1;"></div>
          <el-col :span="24" class="upload-demo" v-if="tit !== '工单分解'">
            <span style="line-height:32px;font-size: 18px;color: #324170;">工艺文件上传1:</span>
            <el-upload class="upload-demo1" :action="host" :data="ossParams" ref="updata" :on-success="handleSuccess"
              :before-upload="beforeUpload" :on-remove="handleRemove" :on-exceed="exceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-col>
          <el-col :span="24" class="upload-demo" v-if="tit !== '工单分解'">
            <span style="line-height:32px;font-size: 18px;color: #324170;">工具信息:</span>
            <el-table :data="tablelist" stripe border>
              <el-table-column v-for="(item,index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
                align="center"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" v-if="tit !== '工单分解'">
            <p style="line-height:32px;font-size: 18px;color: #324170;padding:10px 0">请选择派单设备和人员:</p>
            <el-col :span="12">
              <el-form-item label="生产设备" :label-width="formLabelWidth" prop="deviceId">
                <el-cascader v-model="form.deviceId" :options="devicelist" :props="casprops1">
                </el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="生产人员" :label-width="formLabelWidth" prop="userId">
                <el-cascader v-model="form.userId" :options="getuserList" :props="casprops">
                </el-cascader>
                <!-- <el-select v-model="form.deviceId" placeholder="请选择">
                                    
                                    <el-option v-for="item in devicelist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                                </el-select> -->
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>

        <el-col :span="24" v-if="tit === '工单分解'">
          <span>分解工单数:</span>
          <el-input-number v-model="num" @change="handleChange" :min="0" :max="5" style="margin:10px 0 20px 23px">
          </el-input-number>
        </el-col>

        <el-col :span="24" v-if="tit === '工单分解'">
          <span style="line-height:32px">分工单计划产量:</span>
          <div v-for="(item, index) in numlist" :key="index" style="width:10%;display:inline-block;margin-left:17px">
            <el-input v-model="item.value" @change="
                                e => {
                                    changevalue(e, index);
                                }
                            "></el-input>
          </div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="marksure('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { produceTaskAssign, getToolInfo, deviceListByType, userListByDept, saveProduceTaskPlan } from 'api/tool';
import { onenet } from 'api/onenet';
import moment from 'moment';
export default {
  name: 'assignmodal',

  props: {
    dialogFormVisible: {
      type: Boolean
    },
    tit: {
      type: String
    }
  },
  data() {
    return {
      limit: 1,
      host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com',
      ossParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        expire: '',
        key: '', // key后面有用，先默认设空字符串
        success_action_status: '200' // 默认200
      },
      fileList: [],
      form: {
        productName: '',
        productCode: '',
        specificationModel: '',
        planYield: '',
        taskNumber: '',
        planStartTime: '',
        planEndTime: '',
        yieldList: [],
        userId: '',
        technologyName: '',
        technology: ''
      },
      formLabelWidth: '100px',
      num: 0,
      numlist: [],
      value0: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      accountTypeList: [
        { id: 1, title: '方式一：计件', accountTypeList: '' },
        { id: 2, title: '方式二：计时', accountTypeList: '' },
        { id: 3, title: '方式三：计件和计时', accountTypeList: '' },
      ],
      devicelist: [],
      getuserList: [],
      casprops: {
        label: 'title',
        value: 'id',
        children: 'userList'
      },
      casprops1: {
        label: 'title',
        value: 'id',
        children: 'deviceList'
      },
      casprops2: {
        label: 'title',
        value: 'id',
        children: 'accountTypeList'
      },
      tablelist: [],   // 工具信息表格
      columnlist: [
        { label: '序号', prop: 'index', },
        { label: '工具编码', prop: 'toolCode' },
        { label: '规格型号', prop: 'model', },
        { label: '工具名称', prop: 'toolName', },
      ],
      rules: {
        assignCount: [
          { required: true, message: '请输入派单数量', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              var reg = /^[0-9][0-9]*$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('数量必须为整数'))
              }
            },
            trigger: 'change'
          }
        ],
        accountType: [{ required: true, message: '请选择结算方式', trigger: 'blur' },],
        userId: [{ required: true, message: '请选择部门', trigger: 'blur' },],
        deviceId: [{ required: true, message: '请选择设备', trigger: 'blur' },]
      }
    };
  },
  created() {
    // this.getdeviceList();
    this.getuserListByDept();
    this.getdeviceListByType();
  },
  watch: {},

  methods: {
    // 所有设备
    getdeviceListByType() {
      deviceListByType().then(res => {
        if (res.code === '0') {
          this.devicelist = res.data;
        }
      })
    },
    handleSuccess(res, file) {
      var a = this.host + '/' + this.ossParams.key;
      this.form.technologyName = file.name;
      this.form.technology = a;
    },
    // 上传之前的回调
    beforeUpload: async function (file) {
      await this.backOssInfo(file);
    },
    handleRemove(file, fileList) {

      // 二次确认删除
      this.$message.success('删除成功');
      this.fileList = [];
      this.form.technologyName = '';
      this.form.technology = '';
    },
    exceed(files, fileList) {
      this.$message.error('最多只能上传一个文件！');
    },
    // 获取oss签名数据
    backOssInfo: function (file) {
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
      return new Promise(
        function (resolve, reject) {
          onenet.ossInfo().then(
            function (response) {
              if (response === undefined) {
                this.$message.error(response.error);
                reject();
              } else {
                this.ossParams.OSSAccessKeyId = response.accessid;
                this.ossParams.policy = response.policy;
                this.ossParams.signature = response.signature;
                this.ossParams.key = sessionStorage.getItem('userId') + this.randomWord(true, 9, 12) + '.' + fileName;
                resolve();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    randomWord(randomFlag, min, max) {
      let str = '';
      let range = min;
      let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    // 获取工具信息表格
    getTableData() {
      let { workprocessCode } = this.form
      let obj = { workprocessCode }
      getToolInfo(obj).then(res => {
        if (res.code === '0') {
          res.data.map((item, index) => {
            item.index = index + 1
          })
          this.tablelist = res.data
        }
      })
    },
    // 设备列表
    // getdeviceList() {
    //   deviceList().then(res => {
    //     this.devicelist = res.data;
    //   });
    // },
    //获取部门下用户
    getuserListByDept() {
      userListByDept().then(res => {
        if (res.code === '0') {
          this.getuserList = res.data;
        }
      });
    },
    changevalue(value, index) {
      this[`value${index}`] = value.toString();
    },
    // 获取详情
    getproduceTaskPlanid(m, produceTask) {
      if (m.technologyName) {
        this.fileList = [
          { name: m.technologyName, url: m.technology }
        ]
      }
      this.form = { ...m, ...produceTask };
      this.form.userId = m.assignUserId   // 获取用户默认展示ID
      // console.log(typeof (this.form.deviceId))
      this.getTableData()
    },
    handleChange(val) {
      this.getmath(this.form.assignCount, val);
      this.num = val;
      let arr = [];
      for (let a = 0; a < val; a++) {
        arr.push({ value: this[`value${a}`] });
      }
      this.numlist = arr;
    },
    //平分工单
    getmath(value, num) {
      for (let a = 0; a < num; a++) {
        if (a == num - 1) {
          this[`value${a}`] = (value - (value % num)) / num + (value % num);
        } else {
          this[`value${a}`] = (value - (value % num)) / num;
        }
      }
    },
    close(num) {
      this.init();
      this.$emit('close', num);
    },

    marksure(form) {

      this.$refs[form].validate(valid => {

        if (valid) {
          // 处理分单
          // console.log(1)
          if (this.tit === '工单分解') {
            let arr = [];
            let obj = {}
            this.numlist.map((item, index) => {
              arr.push(this[`value${index}`]);
            });
            this.form.yieldList = arr;
            this.form.type = '1'
            delete this.form.createTime
            saveProduceTaskPlan(this.form).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            });
          } else if (this.tit === '修改') {
            if (Array.isArray(this.form.userId)) {
              this.form.deptId = this.form.userId[0];
              this.form.userId = this.form.userId[1];
            }
            if (Array.isArray(this.form.deviceId)) {
              this.form.deviceId = this.form.deviceId[1]
            }
            if (Array.isArray(this.form.accountType)) {
              this.form.accountType = this.form.accountType[0]
            }
            this.form.produceTaskPlanId = this.form.id //要求produceTaskPlanId的value值为派单详情列表的id
            delete this.form.id
            let obj = { ...this.form, type: '1', operateType: '1' } // type=1为零件工单；operateType=1为修改
            produceTaskAssign(obj).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            }).catch(() => { });
          } else if (this.tit === '派单' || this.tit === '重新派单') {
            if (Array.isArray(this.form.userId)) {
              this.form.deptId = this.form.userId[0];
              this.form.userId = this.form.userId[1];
            }
            if (Array.isArray(this.form.deviceId)) {
              this.form.deviceId = this.form.deviceId[1]
            }
            if (Array.isArray(this.form.accountType)) {
              this.form.accountType = this.form.accountType[0]
            }
            this.form.produceTaskPlanId = this.form.id //要求produceTaskPlanId的value值为派单详情列表的id
            delete this.form.id
            let obj = { ...this.form, type: '1', operateType: '2' } // type=1为零件工单；operateType=2为派单、重新派单
            produceTaskAssign(obj).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            }).catch(() => { });
          }
        }
      });
    },
    beforclose() {
      this.init();
      this.$emit('close', false);
    },
    init() {
      this.form = {
        productName: '',
        productCode: '',
        specificationModel: '',
        planYield: '',
        taskNumber: '',
        planStartTime: '',
        planEndTime: '',
        yieldList: []
      };
      this.value0 = '';
      this.value1 = '';
      this.value2 = '';
      this.value3 = '';
      this.value4 = '';
      this.value5 = '';
      this.num = 0;
      this.numlist = [];
      this.fileList = [];
      if (this.$refs.updata) {
        this.$refs.updata.clearFiles();
      }
    }
  }
};
</script>

<style lang="less">
.assignmodal {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    background-color: #409baf;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .dialog-footer {
    text-align: end;
  }
  .modalcont {
    padding: 25px 0;
    border: 1px dashed #aaa;
    margin-bottom: 25px;
    height: 90px;
  }
  .modaltit1 {
    padding: 10px 0;
    font-size: 18px;
    color: #324170;
  }
  .upload-demo {
    margin-bottom: 20px;
    .upload-demo1 {
      padding: 10px;
    }
    .el-upload {
      width: 80px;
      height: 32px;
      border: none;
    }
  }
}
</style>