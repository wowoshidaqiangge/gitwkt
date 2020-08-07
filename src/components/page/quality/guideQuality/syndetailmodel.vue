<template>
  <div class="syndetailmodel">
    <el-dialog 
    title="综合检验" 
    :destroy-on-close='isclose'
    :visible.sync="syndetailVisble"
    width='68%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                    <el-col :span="8">
                        <el-form-item label="产品编码" :label-width="formLabelWidth" prop="itemCode">
                                <el-select v-model="form.itemCode" filterable @blur="selectBlur" @change="selchange" style="width:100%" placeholder="请选择" size="small ">
                                    <el-option
                                    v-for="item in proCode"
                                    :key="item.itemCode"
                                    :label="item.itemCode"
                                    :value="item.itemCode">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px;position:relative" >
                    
                    <el-col :span="6">
                        <el-form-item label="产品编号" :label-width="formLabelWidth" prop="itemCode">
                                <el-input v-model="form.itemCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="等级" :label-width="formLabelWidth" prop="rank">
                               <el-select v-model="form.rank"  style="width:100%" placeholder="请选择" size="small ">
                                    <el-option
                                    v-for="item in gradeList"
                                    :key="item.id"
                                    :label="item.rank"
                                    :value="item.id">
                                    {{item.rank}}{{item.remark}}
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="轨高1" :label-width="formLabelWidth" prop="guideHeight">
                                <el-input v-model="form.guideHeight" @keyup.native="changeAmount('guideHeight')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="轨宽" :label-width="formLabelWidth" prop="guideWidth">
                                <el-input v-model="form.guideWidth" @keyup.native="changeAmount('guideWidth')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="组合头" :label-width="formLabelWidth" prop="combinationHeader"> 
                                <el-input v-model="form.combinationHeader" @keyup.native="changeAmount('combinationHeader')"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="6">
                        <el-form-item label="组合中1" :label-width="formLabelWidth" prop="combinationCentreOne"> 
                                <el-input v-model="form.combinationCentreOne" @keyup.native="changeAmount('combinationCentreOne')"></el-input>
                        </el-form-item>
                    </el-col> <el-col :span="6">
                        <el-form-item label="组合中2" :label-width="formLabelWidth" prop="combinationCentreTwo"> 
                                <el-input v-model="form.combinationCentreTwo" @keyup.native="changeAmount('combinationCentreTwo')"></el-input>
                        </el-form-item>
                    </el-col> <el-col :span="6">
                        <el-form-item label="组合中3" :label-width="formLabelWidth" prop="combinationCentreThree"> 
                                <el-input v-model="form.combinationCentreThree" @keyup.native="changeAmount('combinationCentreThree')"></el-input>
                        </el-form-item>
                    </el-col> <el-col :span="6">
                        <el-form-item label="组合尾" :label-width="formLabelWidth" prop="combinationFoot"> 
                                <el-input v-model="form.combinationFoot" @keyup.native="changeAmount('combinationFoot')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="平行度" :label-width="formLabelWidth" prop="parallel">
                                <el-input v-model="form.parallel" @keyup.native="changeAmount('parallel')"></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="12">
                      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                           <el-input v-model="form.remark" type="textarea" :rows="1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-col :span="6">
                      <el-form-item label="行走精度" :label-width="formLabelWidth" >
                           <el-upload 
                                :action="host" 
                                :data="ossParams" 
                                ref="updata" 
                                :on-success="handleSuccess1"
                                :before-upload="beforeUpload1" 
                                :limit="1" 
                                 class="upload-demo" 
                                :on-exceed="exceed" 
                                 :file-list="fileList"
                                >
                                <el-button size="small"  type="add" >EXCEL导入</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                            </el-upload>
                      </el-form-item>
                    </el-col>
                   
                     <el-col :span="8">
                         <el-form-item label="" :label-width="formLabelWidth">
                           <el-button type="success" @click="quality" :disabled="!form.itemCode">确认</el-button>
                       </el-form-item>
                        
                    </el-col>
                    </el-col>
                    
                </el-col>
                 <el-col :span="24">
                      <el-form-item label="质检结果" class="item" :label-width="formLabelWidth">
                            <el-upload 
                                :action="host" 
                                :data="ossParams" 
                                ref="updata" 
                                :on-success="handleSuccess"
                                :before-upload="beforeUpload" 
                                :limit="5" 
                                class="upload-demo1" 
                                multiple
                                :on-exceed="exceed" 
                                :show-file-list="false"
                                >
                                <el-button size="small"  type="add" >行走精度导入</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                            </el-upload>
                      </el-form-item>
                    </el-col>
                <el-col :span="24">
                      <el-table
                        :data="tableData"
                        max-height="300px"
                        style="width: 100%">
                        <el-table-column
                            v-for="(item,index) in tableList"
                            :key="index"
                            :prop="item.value"
                            :label="item.label"
                            :width="item.width"
                            align="center"
                           >
                        </el-table-column>
                        <el-table-column
                            label="组合"
                            align="center"
                           >
                             <el-table-column
                                v-for="(item,index) in tableList1"
                                :key="index+100"
                                :prop="item.value"
                                :label="item.label"
                                :width="item.width"
                                align="center"
                            >
                            </el-table-column>
                        </el-table-column>
                        
                        <el-table-column
                            v-for="(item,index) in tableList2"
                            :key="index+500"
                            :prop="item.value"
                            :label="item.label"
                            :width="item.width"
                            align="center"
                           >
                        </el-table-column>
                        <el-table-column label="行走精度"  align="center" >
                            <template slot-scope="scope">
                                <el-button type="success" size="mini" v-if="scope.row.testbillName" @click="down(scope.row)">查看</el-button>
                                <!-- <a :href="scope.row.testbillUrl" v-if="scope.row.testbillName">
                                    <i class="el-icon-edit down" ></i>
                                </a> -->
                            </template>
                        </el-table-column>
                      </el-table>  
                </el-col>
                <el-col :span="24">
                    <div style="text-align: end;margin-top:10px">
                            <el-pagination
                                :background='true'
                                :current-page.sync="pagesize"
                                @current-change="handleCurrentChange"
                                layout="total, prev, pager, next"
                                :total="totals">
                            </el-pagination>
                </div>
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
import {
    getSynthesizeQualityItemCode,//产品编码列表
    produceWorkprocessQualityPage,// 质检结果
    synthesizeQuality,// 质检录入
    qualityConfigList,//等级
    saveListTestbill,// 导入精度
} from 'api/product'
import { onenet } from 'api/onenet';
import {getBlob,saveAs} from '@/utils/util'
export default {
    name: 'syndetailmodel',
    props:{
      syndetailVisble:{
          type:Boolean
      },
    },
    data() {
        return {
            textarea:'',
            data:[],
            isclose:true,
            form:{
               itemCode:null
            },
            ruleForm:{},
            rules:{},
            formLabelWidth:"80px",
            formLabelWidth1:'60px',
            options: [{
                value: '选项1',
                label: '合格'
                }, {
                value: '选项2',
                label: '不合格:调机报废'
                }, {
                value: '选项3',
                label: '不合格:打孔工废'
                }],
            tableData:[],
            tableList:[
                {label:'序号',value:"index",width:"50px"},
                {label:'产品编码',value:"itemCode"},
                {label:'日期',value:"checkExamTime"},
                {label:'等级',value:"rank"},
                {label:'轨高',value:"guideHeight"},
                {label:'轨宽',value:"guideWidth"},
            ],
            tableList1:[
                {label:'头',value:"combinationHeader"},
                {label:'中1',value:"combinationCentreOne"},
                {label:'中2',value:"combinationCentreTwo"},
                {label:'中3',value:"combinationCentreThree"},
                {label:'尾',value:"combinationFoot"},
            ],
            tableList2:[
                {label:'平行度',value:"parallel"},
                {label:'检验员',value:"checkExamUser"},
                {label:'备注',value:"remark",},
            ],
            gradeList:[
                
            ],
            proCode:[],
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
            page:{
                current:1,
                size:10
            },
            pagesize:1,
            totals:0,
            wayinfo:'',
            before:0,
            after:0,
            testbillList:[],
            ossParamskey:[],
            isall:false,
        }
    },
    created(){
     
        // this.$forceUpdate()
    },
    mounted(){
      this.getqualityConfigList()
    },
    watch:{
       
    },
    methods: {
        changeAmount(info){
           
            this.form[info] = this.form[info].replace(/[^\d.]/g,'')
            if(this.form[info]>999){
                this.$message.error('最大不能超过1000')
            }
        },
        down(info){
          getBlob(info.testbillUrl).then(blob => {
            saveAs(blob, info.testbillName);
          });
       },
        //精度导入
        getsaveListTestbill(){
            let obj = {
                produceTaskPlanId:this.ruleForm.produceTaskPlanId,
                workprocessId:this.ruleForm.workprocessId,
                testbillList:this.testbillList
            }
            saveListTestbill(obj).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.getproduceWorkprocessQualityPage(this.wayinfo)          
                }
                this.quailInit()
            })
        },
        //录入
        quality(){
            let obj = {
               produceTaskId:this.ruleForm.produceTaskId,
               produceTaskPlanId:this.ruleForm.produceTaskPlanId,
               workprocessId:this.ruleForm.workprocessId,
               workprocessCode:this.ruleForm.workprocessCode,
               productId:this.ruleForm.produceTaskId,

               productModel:this.ruleForm.model,
               productCode:this.ruleForm.itemCode,
               ...this.form
            }
           synthesizeQuality(obj).then(res=>{
               if(res.code==='0'){
                   this.getproduceWorkprocessQualityPage(this.wayinfo)
                   this.$message.success(res.msg)
                   this.form = {
                       itemCode:null
                   }
                   this.fileList = []
               }
           }) 
        },
        //等级列表
        getqualityConfigList(){
            qualityConfigList().then(res=>{
                if(res.code==='0'){
                   this.gradeList = res.data
                }
            })
        },
        // 手动输入产品编码
        selectBlur(e) {
            this.form.itemCode = e.target.value
            this.$forceUpdate()
            // this.form.productType = e.target.value
        },
        selchange(e){
            this.form.itemCode = e
        },
       getall(info,val){
          
           let pro = JSON.parse(JSON.stringify(info))
           let tail = JSON.parse(JSON.stringify(val))
           let obj = {...tail,...pro}
           this.wayinfo = pro
           this.ruleForm = obj
           this.getSynthesizeQualityItemCode(info)
           this.getproduceWorkprocessQualityPage(info)
       },
       // 编码
       getSynthesizeQualityItemCode(info){
           let obj = {produceTaskPlanId:info.produceTaskPlanId,workprocessId:info.workprocessId}
           getSynthesizeQualityItemCode(obj).then(res=>{
               if(res.code==='0'){
                   this.proCode = res.data
               }
           })
       },
       //  质检结果列表
       getproduceWorkprocessQualityPage:async function(info){
           let obj = {produceTaskPlanId:info.produceTaskPlanId,workprocessId:info.workprocessId,type:2,...this.page }
           await produceWorkprocessQualityPage(obj).then(res=>{
               if(res.code==='0'){
                   res.data.records.map((item,index)=>{
                       item.index= index+1
                       if(item.checkExamUser){
                           item.checkExamUser = item.checkExamUser.split('"')[1]
                       }
                       if(item.checkExamTime){
                           item.checkExamTime = item.checkExamTime.split(' ')[0]
                       }
                   })
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                   this.tableData = res.data.records
               }
           })
       },
       handleCurrentChange(val){

       },
       close(){
           this.init()
           this.$emit('synclose',false)
       },
       //初始化
        init(){
          this.proCode = []
          this.form = {
              itemCode:null
          }
       },
       quailInit(){
            this.before = 0
            this.after = 0
            this.testbillList = []
            this.ossParamskey = []
            this.isall = false
       },
       marksure(ruleForm){
           this.$emit('synclose','0')
       },
       beforclose(){
          this.init()
          this.$emit('synclose',false)
       },
       handleSuccess1(res, file) {
            let a = this.host + '/' + this.ossParams.key;
            this.form.testbillName = file.name
            this.form.testbillUrl = a
        },
        handleSuccess(res, file) {
            this.after++
            this.testbillList.push({testbillName:file.name})
            if(this.after ===this.before){
                this.ossParamskey.map((item,index)=>{
                    this.testbillList[index].testbillUrl = this.host + '/' + item
                })
                this.getsaveListTestbill()
            }
            
        },
      // 上传之前的回调
      beforeUpload: async function (file) {
        this.isall = true
        this.before++
        await this.backOssInfo(file);
      },
      beforeUpload1: async function (file) {
          this.isall = false
        await this.backOssInfo(file);
      },
      exceed(files, fileList) {
        this.$message.error('最多只能上传一个文件！');
      },
      // 获取oss签名数据
      backOssInfo:async function (file) {
        let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
        return new Promise(
         await function (resolve, reject) {
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
                  if(this.isall){
                      this.ossParamskey.push(this.ossParams.key)
                  }
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
      
    }
}
</script>


<style lang='less'>
    .syndetailmodel{
        .down{
        font-size: 16px;
      }
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
        .item .el-form-item__label{
            font-weight: 600;
        }
        .upload-demo1 {
        
        margin-left:24px;
        .el-upload {
            width: 104px;
            height: 33px;
            border: none;
            float:right;
            border-radius: 0;
            }
        }
        .upload-demo{
        
       
        .el-upload {
            width: 104px;
            height: 33px;
            border: none;
       
            border-radius: 0;
            }
        }
        
    }
</style>
