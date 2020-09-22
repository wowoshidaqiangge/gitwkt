<template>
  <div class="moadl">
    <el-dialog :title="tit" :destroy-on-close="isclose" :visible.sync="dialogFormVisible" width="40%"
      :before-close="beforclose" center>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="员工姓名" :label-width="formLabelWidth" class="formitem formitem1" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="员工手机" :label-width="formLabelWidth" class="formitem" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号名称" :label-width="formLabelWidth" class="formitem formitem1" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号密码" :label-width="formLabelWidth" class="formitem" prop="password">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>

        <el-form-item label="所属部门" :label-width="formLabelWidth" class="formitem formitem1" prop="deptId">
          <SelectTree :props="props" :options="optionData" :value="form.deptId" :clearable="isClearable"
            :accordion="isAccordion" @getValue="getValue($event)" v-if="isedit" style="width:100%;" />
          <SelectTree :props="props" :options="optionData" :clearable="isClearable" :accordion="isAccordion"
            @getValue="getValue($event)" v-else style="width:100%;" />
        </el-form-item>
        <el-form-item label="IC卡号" :label-width="formLabelWidth" class="formitem" prop="icCard">
          <el-input v-model="form.icCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth" class="formitem" prop="officeNo">
          <el-input v-model="form.officeNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" class="formitem">
        </el-form-item>
        <el-form-item label="员工照片" :label-width="formLabelWidth" class="formitem">
          <el-upload class="avatar-uploader" :data="ossParams" :action="host" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeUpload" :limit="limit" :on-exceed="exceed"
            ref="upload">
            <el-avatar shape="square" size="200" v-if="imageUrl" fit="fill" :src="imageUrl" class="avatar">
            </el-avatar>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="imageUrl" class="el-icon-delete deleteIcon" @click="(e)=>{handleRemove(e)}"></i>

          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" class="formitem">
        </el-form-item>
        <el-form-item label="员工角色" :label-width="formLabelWidth" class="formitem formitem1" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择" style="width:100%;">
            <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id">{{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dept, roleList, authUser, authputUser, authputUserid } from 'api/index';
import { onenet } from 'api/onenet';
import SelectTree from '../../common/treeSelect';
export default {
  name: 'staffmodal',
  components: {
    SelectTree
  },
  props: {
    dialogFormVisible: {
      type: Boolean
    },
    tit: {
      type: String
    },
    isedit: {
      type: Boolean
    }
  },
  data() {
    return {
      host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com',
      ossParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        expire: '',
        key: '', // key后面有用，先默认设空字符串
        success_action_status: '200' // 默认200
      },
      limit: 1,
      imageUrl: '',
      isclose: true,
      sureload: false,
      deptlist: [],
      rolelist: [],
      form: {
        name: '',
        phone: '',
        roleId: '',
        icCard: '',
        deptId: '',
        username: '',
        password: '',
        officeNo:''
      },
      formLabelWidth: '80px',
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[345789]\d{9}$/, message: '手机号格式有误' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入员工名', trigger: 'blur' }],
        icCard: [
          { required: true, message: '请输入IC卡号', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: 'IC卡号格式有误' }
        ],
        roleId: [{ required: true, message: '请选择员工角色', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        officeNo: [{ required: true, message: '请填写工号', trigger: 'blur' }]
      },
      //树形选择器组件
      isClearable: false, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0, // 初始ID（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children',
        // disabled:true
      }
    };
  },
  created() {
    this.getdept();
    this.getroleList();
  },
  mounted() {
    setTimeout(() => {
      this.$set(this.$data, 'valueId', 6);
    }, 1000);
  },
  watch: {},
  computed: {
    /* 转树形数据 */
    optionData() {
      let cloneData = JSON.parse(JSON.stringify(this.deptlist)); // 对源数据深度克隆
      return cloneData.filter(father => {
        // 循环所有项，并添加children属性
        let branchArr = cloneData.filter(child => father.id == child.parentId); // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ''; //给父级添加一个children属性，并赋值
        return father.parentId == 0; //返回第一层
      });
    }
  },
  methods: {
    /* 树形选择器取值 */
    getValue(value) {
      this.form.deptId = value;
    },
    getauthputUserid(id) {
      authputUserid(id).then(res => {
        if (res.code === '0') {
          this.form = res.data;
          this.imageUrl = res.data.photoUrl
        }
      });
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
    exceed(files, fileList) {
      this.$message.error('最多只能上传一个头像！');
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = this.host + '/' + this.ossParams.key
      this.form.photoUrl = this.host + '/' + this.ossParams.key
      console.log(this.form.photoUrl)
    },
    beforeUpload: async function (file) {
      await this.backOssInfo(file);
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;

    },
    handleRemove(e, file, fileList) {
      e.stopPropagation()
      this.imageUrl = ''
      this.form.photoUrl = ''
      this.$refs.upload.clearFiles();
    },
    getroleList() {
      roleList().then(res => {
        if (res.code === '0') {
          //    this.rolelist =[{name:'班组长',id:'1000'}]
          this.rolelist.push(...res.data);
        }
      });
    },
    getdept() {
      dept().then(res => {
        if (res.code === '0') {
          this.deptlist = res.data;
          // console.log(this.deptlist)
        }
      });
    },
    close() {
      this.init();
      this.$emit('close', false);
    },
    //初始化
    init() {
      this.form = {
        name: '',
        phone: '',
        roleId: '',
        icCard: '',
        deptId: '',
        username: '',
        password: ''
      },
        this.imageUrl = ''
    },
    marksure(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.sureload = true;
          // 判断是编辑还是新增
          // console.log(this.isedit)
          if (!this.isedit) {
            authUser(this.form).then(res => {
              this.sureload = false;
              if (res.code === '0') {
                this.$message.success(res.msg);
                this.init();

                this.$emit('close', '0');
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            authputUser(this.form).then(res => {
              this.sureload = false;
              if (res.code === '0') {
                this.$message.success(res.msg);

                this.init();
                this.$emit('close', '0');
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    beforclose() {
      this.init();
      this.$emit('close', false);
    }
  }
};
</script>


<style lang='less'>
.moadl {
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
  .formitem {
    width: 45%;

    margin-bottom: 40px;
  }
  .formitem1 {
    margin-right: 5%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 130px;
    height: 130px;
  }
  .avatar-uploader .el-upload:hover .deleteIcon {
    border-color: #409eff;
    display: block;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
  .deleteIcon {
    z-index: 99 !important;
    font-size: 25px;
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
  }
}
</style>
