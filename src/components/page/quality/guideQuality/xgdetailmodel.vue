<template>
  <div class="xgdetailmodel">
    <el-dialog 
    title="质检录入" 
    :destroy-on-close='isclose'
    :visible.sync="xgdetailVisble"
    width='65%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                   <div style="margin-bottom:15px;font-size:16px;font-weight:600;">基本信息: </div>
                   
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px;position:relative" >
                    
                    <el-col :span="7">
                        <el-form-item label="编号" :label-width="formLabelWidth" prop="index">
                                <el-input v-model="form.index" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工序" :label-width="formLabelWidth" prop="workprocessName">
                                <el-input v-model="form.workprocessName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="工种" :label-width="formLabelWidth" prop="workKind">
                                <el-input v-model="form.workKind" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="工作人员" :label-width="formLabelWidth" prop="createUser">
                                <el-input v-model="form.createUser" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报工数量" :label-width="formLabelWidth" prop="assignCount">
                                <el-input v-model="form.assignCount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="派件数量" :label-width="formLabelWidth" prop="assignCount">
                                <el-input v-model="form.assignCount" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <div v-if="!isover">
                <el-col :span="24">
                    <el-col :span="7">
                      <el-form-item label="质检扫码:" class="item" :label-width="formLabelWidth">
                        <el-select v-model="form.qualityState" style="width:100%" placeholder="请选择" size="small ">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <el-form-item ></el-form-item>
                    </el-col>
                    <el-col :span="16">
                      <el-form-item label="质检结果:" class="item" :label-width="formLabelWidth">
                          <span style="color:#aaa;font-weight:600" v-if="suc || err"> ( 质检合格数量 {{suc}}  ；质检不合格数量 {{err}} ) </span>
                          <el-upload 
                            :action="host" 
                            :data="ossParams" 
                            ref="updata" 
                            :on-success="handleSuccess"
                            :before-upload="beforeUpload" 
                            :limit="limit" 
                            class="upload-demo1" 
                            multiple
                            :on-exceed="exceed" 
                            :show-file-list="false"
                            >
                              <el-button size="small" type="primary" >质检表单上传</el-button>
                          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                          </el-upload>
                          
                      </el-form-item>
                    </el-col>
                </el-col>
                 <el-col :span="7">
                            <el-form-item >
                                    <el-input v-model="codeList" type="textarea" :rows="12" placeholder="按 Enter 键实现换行"></el-input>
                            </el-form-item>
                 </el-col>
                 <el-col :span="1">
                      <el-form-item >
                        
                      </el-form-item>
                </el-col>
                <el-col :span="16">
                      <el-table
                        :data="tableData"
                        max-height="250px"
                 
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
                        <el-table-column label="质检查看" align="center"> 
                                    <template slot-scope="scope">
                                      <el-button type="success" size="mini" v-if="scope.row.testbillName" @click="down(scope.row)">查看</el-button>
                                      <!-- <a :href="scope.row.testbillUrl" >
                                         <i class="el-icon-edit down" ></i>
                                      </a> -->
                                    </template>
                            </el-table-column>
                      </el-table>  
                </el-col>
                 <el-col :span="24">
                     <el-col :span="8">
                        <el-button type="primary" @click="clearCode">清空</el-button>
                        <el-button type="success" @click="sureCode">确认</el-button>
                     </el-col>
                     <el-col :span="16">
                        <div style="text-align: end">
                            <el-pagination
                                :background='true'
                                :current-page.sync="pagesize"
                                @current-change="handleCurrentChange"
                                :page-size= 5
                                layout="total, prev, pager, next"
                                :total="totals">
                            </el-pagination>
                        </div>
                     </el-col>
                 </el-col>
                </div>
                 <el-col :span="24">
                   <div style="margin: 15px 0;font-size:16px;font-weight:600;">产量确认: </div>
                </el-col>
                 <div v-if="!isover">
                  <el-col :span="24">
                     <el-col :span="5">
                        <el-form-item label="合格" :label-width="formLabelWidth1" prop="qualified">
                                <el-input v-model="form.qualified" @keyup.native="changeAmount('qualified')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset='1'>
                        <el-form-item label="不合格" :label-width="formLabelWidth1" prop="unQualified">
                                <el-input v-model="form.unQualified" @keyup.native="changeAmount('unQualified')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset='1'>
                        <el-form-item label="报废" :label-width="formLabelWidth1" prop="scrap">
                                <el-input v-model="form.scrap" @keyup.native="changeAmount('scrap')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset='1'>
                        <el-form-item label="补" :label-width="formLabelWidth1" prop="supplement">
                                <el-input v-model="form.supplement" placeholder="负数表示扣除" @keyup.native="changeAmount1('supplement')"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                      <el-form-item label="不合格原因" :label-width="formLabelWidth1" prop="remark">
                           <el-input v-model="form.remark" :rows="3" type="textarea"></el-input>
                      </el-form-item>
                 </el-col>
                 </div>
                 <div v-if="isover">
                   <el-col :span="24">
                      <el-col :span="5">
                          <el-form-item label="P级" :label-width="formLabelWidth1" prop="pNums">
                                  <el-input v-model="form.pNums" @blur="blurinput" @keyup.native="changeAmount('pNums')"></el-input> 
                          </el-form-item>
                      </el-col>
                      <el-col :span="5" :offset='1'>
                          <el-form-item label="C级" :label-width="formLabelWidth1" prop="cNums">
                                  <el-input v-model="form.cNums" @keyup.native="changeAmount('cNums')"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="5" :offset='1'>
                          <el-form-item label="H级" :label-width="formLabelWidth1" prop="hNums">
                                  <el-input v-model="form.hNums" @keyup.native="changeAmount('hNums')"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="5" :offset='1'>
                          <el-form-item label="报废" :label-width="formLabelWidth1" prop="scrap">
                                  <el-input v-model="form.scrap" placeholder="" @keyup.native="changeAmount('scrap')"></el-input>
                          </el-form-item>
                      </el-col>
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
import {
    produceWorkprocessQualityPage,//质检结果
    produceTaskQuality,// 质检录入
    produceWorkprocessQualityPut,// 质检结果修改
} from 'api/product'
import {debounce,getBlob,saveAs} from '@/utils/util'
export default {
    name: 'xgdetailmodel',
    props:{
      xgdetailVisble:{
          type:Boolean
      },
      isover:{
        type:Boolean
      }
    },
    data() {
        return {
            load:true,
            qualityState:'',
            textarea:'',
            data:[],
            isclose:true,
            form:{
               qualityState:'1'
            },
            rules:{},
            formLabelWidth:"80px",
            formLabelWidth1:'60px',
            options: [{
                value: '1',
                label: '合格'
                }, {
                value: '2',
                label: '不合格'
                }],
            tableData:[],
            tableList:[
                {label:'序号',value:"index",width:"50px"},
                {label:'产品编号',value:"itemCode"},
                {label:'设备名称',value:"deviceName"},
                {label:'设备编号',value:"deviceNumber"},
                {label:'操作工',value:"workerUser"},
                {label:'录入时间',value:"createTime"},
                {label:'检验员',value:"checkExamUser"},
                {label:'检验时间',value:"checkExamTime"},
                {label:'状态',value:"qualityState",width:"60px"},
            ],
            codeList:'',
            page:{
                current:1,
                size:5,
                type:2
            },
            pagesize:1,
            totals:0,
            radio:'',
            wayinfo:"",
            limit: 5,
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
            before:0,
            after:0,
            testbillList:[],
            ossParamskey:[],
            suc:0,
            err:0,
            tableData1:[]
        }
    },
    created(){
     
        // this.$forceUpdate()
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
        
       down(info){
          getBlob(info.testbillUrl).then(blob => {
            saveAs(blob, info.testbillName);
          });
       },
        //情况编码
        clearCode(){
           this.codeList = ''
        },
        // 编码确认
        sureCode(){
            
             if(!this.codeList){
               this.$message.error('请先输入编码')
               return
             }
             
             this.getproduceWorkprocessQualityPut()
        },
        removenull(list){
           let arr = []
           list.map((item=>{
               arr.push(item.replace(/\s+/g, "")) 
            }))
          return arr
        },
        // 修改结果
        getproduceWorkprocessQualityPut(info){
           let obj = {
               productCodeList:this.testbillList.length>0 ? []:this.removenull(this.codeList.split(/[(\r\n)\r\n]+/)),
               produceTaskId:this.form.produceTaskId,
               produceTaskPlanId:this.form.produceTaskPlanId,
               workprocessId:this.form.workprocessId,
               workprocessCode:this.form.workprocessCode,
               itemId:this.form.itemId,
               itemCode:this.form.itemCode,
               qualityState:this.form.qualityState,
               testbillList:this.testbillList
             }
             let att = []
             this.removenull(this.codeList.split(/[(\r\n)\r\n]+/)).map((item=>{
                 if(item){
                   let a = this.tableData1.filter(v=>v.itemCode===item)
                    if(a.length<1){
                      att.push(item)
                    }
                 }
             }))
             if(att.length>0){
               let a = att.toString()
               this.$message.error(`产品编号 ${a} 不存在`)
               return
             }
            produceWorkprocessQualityPut(obj).then(res=>{
             
               if(res.code==='0'){
                  this.$message.success(res.msg)
                  this.inittable()
                  this.getproduceWorkprocessQualityPage(this.wayinfo)
                  this.allgetproduceWorkprocessQualityPage(this.wayinfo)
               }
            })
        },
        getall(info,val){
         
            let pro = JSON.parse(JSON.stringify(info))
            let tail = JSON.parse(JSON.stringify(val))
            delete tail.remark
            let obj = {...tail,...pro}
            this.getproduceWorkprocessQualityPage(info)
            this.allgetproduceWorkprocessQualityPage(info)
            obj.type=3
            obj.checkType = 3
            obj.qualityState='1'
            delete obj.createTime
            if(obj.finishTime){
              delete obj.finishTime
            }
            this.form = obj
        },
        // 质检结果
        allgetproduceWorkprocessQualityPage(info){
          let obj = {produceTaskPlanId:info.produceTaskPlanId,workprocessId:info.workprocessId,type:2,current:1,size:500,type:2 }
          produceWorkprocessQualityPage(obj).then(res=>{
               if(res.code==='0'){
                   let suc = 0
                   let err = 0
                   res.data.records.map((item,index)=>{
                     
                       if(item.qualityState){
                         switch (item.qualityState) {
                            case '1':
                                item.qualityState = "合格";
                                suc++
                                break;
                            case '2':
                                item.qualityState = "不合格";
                                err++
                        } 
                       }
                   })
                   this.suc = suc
                   this.err = err
                   this.tableData1 = res.data.records
               }
           })
        },
       getproduceWorkprocessQualityPage(info){
           this.wayinfo = info
           let obj = {produceTaskPlanId:info.produceTaskPlanId,workprocessId:info.workprocessId,type:2,...this.page }
           produceWorkprocessQualityPage(obj).then(res=>{
               if(res.code==='0'){
                  //  let suc = 0
                  //  let err = 0
                   res.data.records.map((item,index)=>{
                       item.index= index+1
                       item.workerUser = item.workerUser.split('"')[1]
                       item.createTime = item.createTime.split(' ')[0]
                       if(item.checkExamTime){
                          item.checkExamTime = item.checkExamTime.split(' ')[0]
                       }
                       if(item.checkExamUser){
                         item.checkExamUser = item.checkExamUser.split('"')[1]
                       }
                       if(item.qualityState){
                         switch (item.qualityState) {
                            case '1':
                                item.qualityState = "合格";
                                // suc++
                                break;
                            case '2':
                                item.qualityState = "不合格";
                                // err++
                        } 
                       }
                   })
                  //  this.suc = suc
                  //  this.err = err
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                   this.tableData = res.data.records
               }
           })
       },
       blurinput(val){
         if(val<this.form.assignCount){
           this.form.qualityState = 2
         }else {
           this.form.qualityState = 1
         }
      },
       close(){
           this.init()
           this.$emit('xgclose',false)
       },
       //初始化
       init(){
          this.form = { qualityState:'1'}
          this.codeList = ''
      
       },
       inittable(){
         this.codeList = ''
                  this.before= 0
                  this.after = 0
                  this.testbillList  = []
                  this.ossParamskey = []
       },
       marksure(ruleForm){
            
            this.$refs[ruleForm].validate(valid => {
                Object.keys(this.form).forEach((item)=>{
                  if(this.form[item]==='--'){
                    delete this.form[item]
                  }
                })
                // if(this.form.createTime){
                //   delete this.form.createTime
                // }
                // // if(this.from.finishTime){
                //   delete this.from.finishTime
                // // }
                
                if (valid) {
                    produceTaskQuality(this.form).then(res=>{
                        if(res.code==='0'){
                            this.$message.success(res.msg)
                            this.init()
                            this.inittable()
                            this.$emit('xgclose','0')
                        }
                    })
                }
            })
       },
       beforclose(){
          this.init()
          this.inittable()
          this.$emit('xgclose',false)
       },
       handleCurrentChange(val){
           this.page.current = val
            this.getproduceWorkprocessQualityPage(this.wayinfo)
       },
       handleSuccess(res, file) {
        console.log(file.name)
        this.after++
        
        this.testbillList.push({testbillName:file.name})
        if(this.after ===this.before){
          this.ossParamskey.map((item,index)=>{
            this.testbillList[index].testbillUrl = this.host + '/' + item
          })
          // console.log(this.ossParamskey,this.testbillList)
           this.getproduceWorkprocessQualityPut()
        }
       
  
      },
      geta(){
        console.log(123456789)
      },
      // 上传之前的回调
      beforeUpload: async function (file) {
      
        this.before++
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
                  console.log(this.ossParams.key)
                  this.ossParamskey.push(this.ossParams.key)
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
    .xgdetailmodel{
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
        .item .el-form-item__content{
          display: flex;
        }
        .upload-demo1 {
        
          flex: 1;
        }
        .el-upload {
        width: 104px;
        height: 33px;
        border: none;
        float:right;
        border-radius:3px ;
        }
    }
</style>
