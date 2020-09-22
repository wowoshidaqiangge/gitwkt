<template>
  <div class="assignmodal">
    <el-dialog :title="tit" :visible.sync="dialogFormVisible" :before-close="beforclose" center>
      <p class="modaltit1">工单基本信息：</p>
      <el-row>
        <el-form :model="form" ref="form" :rules="rules">
          <div class="modalcont">
            <el-col :span="11">
              <el-form-item label="编号" :label-width="formLabelWidth" prop="index">
                <el-input v-model="form.index" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
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
          <el-row>
            <el-col :span="11">
              <el-form-item label="派单数量" :label-width="formLabelWidth" prop="assignCount">
                <el-input v-model.number="form.assignCount" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="tit !== '工单分解'">
              <el-form-item label="结算方式" prop="accountType" :label-width="formLabelWidth">
                <el-select v-model="form.accountType" placeholder="选择结算方式">
                  <el-option
                    v-for="(item, index) in accountTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-if="tit !== '工单分解'">
              <el-form-item label="计划结束时间" :label-width="formLabelWidth" prop="planEndTime">
                <el-date-picker
                  v-model="form.planEndTime"
                  type="date"
                  placeholder="请选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24" class="uploadbox" v-if="tit !== '工单分解'">
            <p style="line-height:32px;font-size: 18px;color: #324170;">工艺文件上传:</p>
            <el-upload
              :action="host"
              :data="ossParams"
              ref="updata"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :limit="limit"
              class="upload__content"
              :on-remove="handleRemove"
              :on-exceed="exceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
          <el-col :span="24" class="tablebox" v-if="tit !== '工单分解'">
            <p style="line-height:32px;font-size: 18px;color: #324170;padding:10px 0">工具信息:</p>
            <el-table :data="toolData" border stripe style="width: 100%">
              <el-table-column
                v-for="item in columnList"
                :width="item.width"
                :key="item.index"
                :prop="item.prop"
                :label="item.label"
              >
              </el-table-column> </el-table
          ></el-col>
          <el-col class="device__user" v-if="tit !== '工单分解'">
            <p style="line-height:32px;font-size: 18px;color: #324170;padding:10px 0">请选择派单设备和人员:</p>
            <el-col :span="12">
              <el-form-item label="生产设备" :label-width="formLabelWidth" prop="deviceId">
                <el-cascader v-model="form.deviceId" :options="deviceList" :props="casprops1"> </el-cascader>
                <!-- <el-select v-model="form.deviceId" placeholder="请选择">
                        <el-option v-for="item in deviceList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产人员" :label-width="formLabelWidth" prop="userId">
                <el-cascader v-model="form.userId" :options="userList" :props="casprops"> </el-cascader>
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
          <span style="line-height:32px">各工单计划产量:</span>
          <div v-for="(item, index) in numlist" :key="index" style="width:10%;display:inline-block;margin-left:17px">
            <el-input
              v-model="item.value"
              @change="
                e => {
                  changevalue(e, index);
                }
              "
            ></el-input>
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
import { userListByDept, deviceListByType } from 'api/tool';
import { getTool, produceTaskAssign, saveProduceTaskPlan } from 'api/product';
import { onenet } from 'api/onenet';

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
      accountTypeOptions: [
        { label: '方式一：计件', value: 1 },
        { label: '方式二：计时', value: 2 },
        { label: '方式三：计件和计时', value: 3 }
      ],
      form: {},
      num: 0,
      numlist: [],
      value0: '',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      deviceList: [],
      userList: [],
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
      rules: {
        assignCount: [{ type: 'number', required: true, message: '请填写整数型派单数量', trigger: 'blur' }],
        accountType: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
        planEndTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择部门和人员', trigger: 'blur' }],
        deviceId: [{ required: true, message: '请选择设备', trigger: 'blur' }]
      },
      toolData: [],
      columnList: [
        { prop: 'index', label: '序号', width: 120 },
        { prop: 'toolCode', label: '工具编码' },
        { prop: 'model', label: '规格型号' },
        { prop: 'toolName', label: '工具名称' }
        // { prop: 'id', label: '工具id' }
      ],
      parentObj: {}
    };
  },
  computed: {
    formLabelWidth: function() {
      if (this.tit === '工单分解') {
        return '80px';
      } else {
        return '110px';
      }
    }
  },
  created() {
    this.getuserListByDept();
    this.getdeviceListByType();
  },
  watch: {},

  methods: {
    // 所有设备
    getdeviceListByType() {
      deviceListByType().then(res => {
        if (res.code === '0') {
          this.deviceList = res.data;
        }
      });
    },
    //获取部门下用户
    getuserListByDept() {
      userListByDept().then(res => {
        if (res.code === '0') {
          this.userList = res.data;
        }
      });
    },
    // 从分页拿详情，并查询工具
    getDetailData(row, parentRow) {
      console.log(parentRow);
      this.parentObj = parentRow;
      row.accountType = row.accountType || 1;
      const {
        id,
        index,
        workKind,
        workprocessName,
        workprocessId,
        accountType,
        planEndTime,
        operateType,
        deviceId,
        deptId
      } = row;
      const assignCount = parseInt(row.assignCount);
      const userId = row.assignUserId;
      const {
        partTaskId,
        produceTaskId,
        produceTaskPlanId,
        itemId,
        itemCode,
        itemName,
        // itemNumber,
        taskNumber,
        planYield,
        planStartTime,
        remark
      } = parentRow;
      this.form = {
        id,
        index,
        workKind,
        workprocessName,
        workprocessId,
        assignCount,
        accountType,
        planEndTime,
        operateType,
        deviceId,
        deptId,
        userId,
        partTaskId,
        produceTaskId,
        produceTaskPlanId,
        itemId,
        itemCode,
        itemName,
        taskNumber,
        planYield,
        planStartTime,
        remark
      };
      this.num = 2;
      this.handleChange(2);

      console.log(this.form);
      if (this.tit !== '工单分解') {
        this.toolData.length = 0;
        getTool(row.workprocessCode).then(res => {
          if (res.code === '0') {
            res.data.map((item, index) => {
              item.index = index + 1;
            });
            this.toolData = res.data;
          }
        });
      }
    },

    handleSuccess(res, file) {
      var a = this.host + '/' + this.ossParams.key;
      this.form.technologyName = file.name;
      this.form.technology = a;
    },
    // 上传之前的回调
    beforeUpload: async function(file) {
      await this.backOssInfo(file);
    },
    handleRemove(file, fileList) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功');
          this.fileList = [];
          this.form.technologyName = '';
          this.form.technology = '';
        })
        .catch(() => {});
    },
    exceed(files, fileList) {
      this.$message.error('最多只能上传一个文件！');
    },
    // 获取oss签名数据
    backOssInfo: function(file) {
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
      return new Promise(
        function(resolve, reject) {
          onenet.ossInfo().then(
            function(response) {
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

    changevalue(value, index) {
      this[`value${index}`] = value.toString();
    },

    handleChange(val) {
      // debugger;
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
          if (this.tit === '工单分解') {
            let arr = [];
            this.numlist.map((item, index) => {
              arr.push(this[`value${index}`]);
            });
            this.form.yieldList = arr;
            const {
              id,
              partTaskId,
              produceTaskId,
              produceTaskPlanId,
              taskNumber,
              itemId,
              itemCode,
              workprocessId,
              workprocessCode,
              assignCount,
              planStartTime,
              planEndTime,
              operateType,
              remark,
              itemName,
              workprocessName
            } = this.form;
            const obj = {
              id,
              partTaskId,
              produceTaskId,
              produceTaskPlanId,
              taskNumber,
              itemId,
              itemCode,
              workprocessId,
              workprocessCode,
              assignCount,
              planStartTime,
              planEndTime,
              operateType,
              remark,
              itemName,
              workprocessName
            };
            obj.yieldList = this.form.yieldList;
            saveProduceTaskPlan({ ...obj, type: 2 }).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            });
          } else {
            // 派单
            if (Array.isArray(this.form.userId)) {
              // TODO:二部时，传二部门id还是线轨滑块
              // this.form.deptId = this.form.userId[0];
              this.form.deptId = this.form.userId[this.form.userId.length - 2];
              this.form.userId = this.form.userId[this.form.userId.length - 1];
            }
            if (Array.isArray(this.form.deviceId)) {
              this.form.deviceId = this.form.deviceId[1];
            }
            const {
              partTaskId,
              produceTaskId,
              deptId,
              userId,
              deviceId,
              workprocessId,
              workprocessCode,
              assignCount,
              accountType,
              technology,
              technologyName,
              planEndTime,
              operateType,
              itemCode,
              itemName,
              taskNumber,
              workprocessName
            } = this.form;
            const obj = {
              partTaskId,
              produceTaskId,
              deptId,
              userId,
              deviceId,
              workprocessId,
              workprocessCode,
              assignCount,
              accountType,
              technology,
              planEndTime,
              technologyName,
              operateType,
              itemCode,
              itemName,
              taskNumber,
              workprocessName
            };
            obj.produceTaskPlanId = this.form.id; // 派单的taskplanid应为工序工单返回的id
            produceTaskAssign({ ...obj, type: 2 }).then(res => {
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.close('0');
              }
            });
          }
        }
      });
    },
    beforclose() {
      this.$refs.form.resetFields();
      this.init();
      this.$emit('close', false);
    },
    init() {
      this.form = {
        id: '',
        index: '',
        workKind: '',
        workprocessName: '',
        assignCount: '',
        accountType: '',
        partTaskId: '',
        produceTaskId: '',
        produceTaskPlanId: '',
        deptId: '',
        userId: '',
        deviceId: '',
        itemId: '',
        itemCode: '',
        itemName: '',
        taskNumber: '',
        planYield: '',
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

  .modaltit1 {
    padding: 10px 0;
    font-size: 18px;
    color: #324170;
  }
  .modalcont {
    padding: 25px 0;
    border: 1px dashed #aaa;
    margin-bottom: 25px;
    height: 80px;
  }

  .uploadbox {
    margin: 15px 0;
    .upload__content {
      padding: 10px;
    }
    .el-upload {
      width: 80px;
      height: 32px;
      border: none;
    }
    // .el-upload-list {
    //   border: 1px solid #aaa;
    //   padding: 5px 5px 10px;
    //   margin-top: 5px;
    // }
  }
}
</style>
