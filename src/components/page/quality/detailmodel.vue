<template>
  <div class="partQualitymodal">
    <el-dialog 
    title="质检录入" 
    :destroy-on-close='isclose'
    :visible.sync="detailVisble"
    width='55%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                 <div style="margin-bottom:20px;font-size:16px;font-weight:600">基本信息:</div>
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px">
                    <el-col :span="8">
                        <el-form-item label="编号" :label-width="formLabelWidth" prop='index'>
                                <el-input v-model="form.index" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工种" :label-width="formLabelWidth" prop='workKind'>
                                <el-input v-model="form.workKind" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序" :label-width="formLabelWidth" prop='workprocessName'>
                                <el-input v-model="form.workprocessName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派工人员" :label-width="formLabelWidth" prop='assignUser'>
                                <el-input v-model="form.assignUser" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派工日期" :label-width="formLabelWidth" prop='createTime'>
                                <el-input v-model="form.createTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备编号" :label-width="formLabelWidth" prop='deviceNumber'>
                                <el-input v-model="form.deviceNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工作人员" :label-width="formLabelWidth" prop='createUser'>
                                <el-input v-model="form.createUser" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="结算方式" :label-width="formLabelWidth" prop='accountType'>
                          <el-select v-model="form.accountType"  style="width:100%" disabled="">
                            <el-option
                              v-for="(item) in accountTypeOptions"
                              :key="item.value"
                             
                              :label="item.label"
                              :value="item.value"
                            >
                            </el-option>
                          </el-select>
                              
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="派件数量" :label-width="formLabelWidth" prop='assignCount'>
                         
                                <el-input v-model="form.assignCount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                     <div style="margin-bottom:20px;font-size:16px;font-weight:600">质检结果:</div>
                </el-col>
                 <el-col :span="8">
                            <el-form-item label="工废" :label-width="formLabelWidth" prop='industrialWaste'>
                                    <el-input v-model="form.industrialWaste"  @keyup.native="changeAmount('industrialWaste')"></el-input>
                            </el-form-item>
                 </el-col>
                  
                 <el-col :span="8">
                            <el-form-item label="料废" :label-width="formLabelWidth" prop='scrapWaste'>
                                    <el-input v-model="form.scrapWaste" @keyup.native="changeAmount('scrapWaste')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步工H" :label-width="formLabelWidth" prop='concessionWork'>
                                    <el-input v-model="form.concessionWork" @keyup.native="changeAmount('concessionWork')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="降级工C" :label-width="formLabelWidth" prop='relegationWork'>
                                    <el-input v-model="form.relegationWork" @keyup.native="changeAmount('relegationWork')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步料H" :label-width="formLabelWidth" prop='concessionMaterial'>
                                    <el-input v-model="form.concessionMaterial" @keyup.native="changeAmount('concessionMaterial')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="降级料C" :label-width="formLabelWidth" prop='relegationMaterial'>
                                    <el-input v-model="form.relegationMaterial" @keyup.native="changeAmount('relegationMaterial')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="合格P" :label-width="formLabelWidth" prop='qualified'>
                                    <el-input v-model="form.qualified" @blur="blurinput" @keyup.native="changeAmount('qualified')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="补(扣)" :label-width="formLabelWidth" prop='supplement'>
                                    <el-input v-model="form.supplement" @keyup.native="changeAmount1('supplement')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="CPK值" :label-width="formLabelWidth" prop='cpkValue'>
                                    <el-input v-model="form.cpkValue" @keyup.native="changeAmount('cpkValue')"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="计时时间" :label-width="formLabelWidth" prop='manHour '>
                                    <el-input v-model="form.manHour " style="width:75%" @keyup.native="changeAmount('manHour')"></el-input>&nbsp; / 小时
                            </el-form-item>
                 </el-col>
                 <div v-if="!isproduct">
                      
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
                 </div>
                  
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
import {produceTaskQuality} from 'api/product'
export default {
    name: 'partQualitymodal',
    props:{
      detailVisble:{
          type:Boolean
      },
      tit:{
          type:String
      },
      isover:{
        type:Boolean
      }
    },
    data() {
        return {
            data:[],
            isclose:true,
            form:{},
            rules:{},
            formLabelWidth:'85px',
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
             accountTypeOptions: [
              { label: '方式一：计件', value: '1' },
              { label: '方式二：计时', value: '2' },
              { label: '方式三：计件和计时', value: '3' }
            ],
            fileList: [],
            isproduct:false,
        }
    },
    created(){
 
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
      changeAmount(info){
            let a = this.form[info].replace(/[^\d.]/g,'').split('.')
            if(a.length>2){
              this.$message.error('数据格式有误')
             
            }
            this.form[info] = this.form[info].replace(/[^\d.]/g,'')
        },
        changeAmount1(info){
            let a = this.form[info].replace(/[^\d.-]/g,'').split('.')
            if(a.length>2){
              this.$message.error('数据格式有误')
             
            }
            this.form[info] = this.form[info].replace(/[^\d.-]/g,'')
  
        },
        enterinfo(info,type,way,overtype){
      
            let pro = JSON.parse(JSON.stringify(info))
            let tail = JSON.parse(JSON.stringify(way))
            let obj = {...tail,...pro}
            if(overtype===2){
              this.isproduct = true
            }
            obj.type = type
            if(obj.accountType){
              obj.accountType = obj.accountType.toString()
            }
            // obj.qualityState = 1
            obj.checkType = 3
            delete obj.remark
            if (obj.workprocesscheckBillUrl&&obj.workprocesscheckBillName) {
              this.fileList.push({ name: obj.workprocesscheckBillName, url: obj.workprocesscheckBillUrl });
            }
             delete obj.createTime
            if(obj.finishTime){
              delete obj.finishTime
            }
            this.form= obj
      },
      blurinput(val){
         if(val<this.form.assignCount){
           this.form.qualityState = 2
         }else {
           this.form.qualityState = 1
         }
      },
      handleSuccess(res, file) {
        var a = this.host + '/' + this.ossParams.key;
        this.form.workprocesscheckBillUrl = a
        this.form.workprocesscheckBillName = file.name
  
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
             this.form.workprocesscheckBillUrl = ''
             this.form.workprocesscheckBillName = ''
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
          this.fileList = []
          this.form = {}
          this.isproduct = false
       },
      
       marksure(ruleForm){
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                  Object.keys(this.form).forEach((item)=>{
                    if(this.form[item]==='--'){
                      delete this.form[item]
                    }
                  })
                    produceTaskQuality(this.form).then(res=>{
                        if(res.code==='0'){
                           this.$message.success(res.msg)
                           this.init()
                           this.$emit('detailclose','0')
                        }
                    })
                }
            })
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
