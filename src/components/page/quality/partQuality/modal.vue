<template>
  <div class="partQualitymodal">
    <el-dialog 
    title="质检录入" 
    :destroy-on-close='isclose'
    :visible.sync="detailVisble"
    width='50%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                 <div style="margin-bottom:20px;font-size:16px;font-weight:600">基本信息:</div>
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px">
                    <el-col :span="8">
                        <el-form-item label="编号" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工种" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派工人员" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派工日期" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备编号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工作人员" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结算方式" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派件数量" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                     <div style="margin-bottom:20px;font-size:16px;font-weight:600">质检结果:</div>
                </el-col>
                 <el-col :span="8">
                            <el-form-item label="工废" :label-width="formLabelWidth" prop='industrialWaste'>
                                    <el-input v-model="form.industrialWaste" ></el-input>
                            </el-form-item>
                 </el-col>
                  
                 <el-col :span="8">
                            <el-form-item label="料废" :label-width="formLabelWidth" prop='scrapWaste'>
                                    <el-input v-model="form.scrapWaste" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步工H" :label-width="formLabelWidth" prop='concessionWorker'>
                                    <el-input v-model="form.concessionWorker"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="降级工C" :label-width="formLabelWidth" prop='relegationWork'>
                                    <el-input v-model="form.relegationWork" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步料H" :label-width="formLabelWidth" prop='concessionMaterial'>
                                    <el-input v-model="form.concessionMaterial"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="降级料C" :label-width="formLabelWidth" prop='relegationMaterial'>
                                    <el-input v-model="form.relegationMaterial" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="合格P" :label-width="formLabelWidth" prop='qualified'>
                                    <el-input v-model="form.qualified" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="补" :label-width="formLabelWidth" prop='supplement'>
                                    <el-input v-model="form.supplement" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="CPK值" :label-width="formLabelWidth" prop='cpkValue'>
                                    <el-input v-model="form.cpkValue" ></el-input>
                            </el-form-item>
                 </el-col>
                 <el-col :span="24">
                     <div style="margin-bottom:15px;font-size:16px;font-weight:600">工序检验记录单上传:</div>
                </el-col>
                 <el-col :span="24" class="upload-demo" >
                    <el-upload 
                      :action="host" 
                      :data="ossParams" 
                      ref="updata" 
                      :on-success="handleSuccess"
                      :before-upload="beforeUpload" 
                      :limit="limit" 
                      class="upload-demo1" 
                      :on-remove="handleRemove"
                      :on-exceed="exceed" 
                      :file-list="fileList">
                         <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-col>
           </el-form>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('ruleForm')" >确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { onenet } from 'api/onenet';
export default {
    name: 'partQualitymodal',
    props:{
      detailVisble:{
          type:Boolean
      },
      tit:{
          type:String
      },
    },
    data() {
        return {
            data:[],
            isclose:true,
            form:{},
            rules:{},
            formLabelWidth:'80px',
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
        }
    },
    created(){
 
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
    handleSuccess(res, file) {
      var a = this.host + '/' + this.ossParams.key;
      console.log(a)
    },
    // 上传之前的回调
    beforeUpload: async function (file) {
      
      await this.backOssInfo(file);
    },
    handleRemove(file, fileList) {
    //   二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功');
          this.fileList = [];
       
        })
        .catch(() => { });
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
       close(){
           this.init()
           this.$emit('detailclose',false)
       },
       //初始化
       init(){
          this.checklist = []
       },
      
       marksure(ruleForm){
           
       },
       beforclose(){
          this.init()
          this.$emit('detailclose',false)
       },
      
    }
}
</script>


<style lang='less'>
    .partQualitymodal{
        .el-dialog{
            border-radius: 5px;
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
           .el-dialog__title{
               color: #fff;
                 letter-spacing: 2px;
           }
           .el-dialog__headerbtn .el-dialog__close{
               color: #fff;
             
           }
        }
        .dialog-footer{
            text-align: end;
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
        .upload-demo {
        margin-bottom: 15px;
        .upload-demo1 {
        padding: 10px;
        margin-left:24px;
        }
        .el-upload {
        width: 80px;
        height: 32px;
        border: none;
        }
  }
    
    }
</style>
