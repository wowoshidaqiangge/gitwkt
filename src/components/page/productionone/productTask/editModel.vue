<template>
  <div class="editmodel">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="editFormVisible"
    width='50%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
               
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px;position:relative" >
                    
                    <el-col :span="11">
                        <el-form-item label="物料编码" :label-width="formLabelWidth" prop="partCode">
                                <el-input v-model="form.partCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="物料名称" :label-width="formLabelWidth" prop="partName">
                                <el-input v-model="form.partName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" v-if="tit==='零件修改'">
                        <el-form-item label="物料图号" :label-width="formLabelWidth" prop="partNumber">
                                <el-input v-model="form.partNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop="model">
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="计划产量" :label-width="formLabelWidth" prop="planYield">
                                <el-input v-model="form.planYield" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
               
                 <el-col :span="11">
                            <el-form-item label="生产数量" :label-width="formLabelWidth" prop='partCount'>
                                    <el-input v-model="form.partCount" ></el-input>
                            </el-form-item>
                 </el-col>
                 <el-col :span="11">
                            <el-form-item label="计划时间" :label-width="formLabelWidth" >
                                   <el-date-picker
                                        v-model="form.value1"
                                        @change="changetime"
                                        style="width:100%"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                            </el-form-item>
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
import moment from 'moment'
import {produceTaskPlan} from 'api/product'
export default {
    name: 'editmodel',
    props:{
      editFormVisible:{
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
            form:{
              
            },
            rules:{
                partCount:[
                    { required: true, message: '请输入', trigger: 'blur' },
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
            },
            formLabelWidth:"100px",
          
        }
    },
    created(){
      
    },
    mounted(){
      
    },
    watch:{
      
    },
    methods: {
       getinfo(info,type){
        
           let pro = JSON.parse(JSON.stringify(info))
           pro.taskNumber = pro.taskNumber1
           if(type===3){
               pro.type = type
           }
           pro.value1 = [pro.planStartTime,pro.planEndTime]
           this.form= pro
       },
       changetime(val){
           this.form.planStartTime = moment(val[0]).format("YYYY-MM-DD")
           this.form.planEndTime = moment(val[1]).format("YYYY-MM-DD")
       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.form = {}
       },
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    this.form.id = this.form.produceTaskPlanId
                    delete this.form.produceTaskPlanId
                    produceTaskPlan(this.form).then(res=>{
                        if(res.code==='0'){
                            this.$message.success(res.msg)
                            this.init()
                            this.$emit('close','0')
                        }
                    })
                }
            })
       },
       beforclose(){
          this.init()
          this.$emit('close',false)
       },
      
    }
}
</script>


<style lang='less'>
    .editmodel{
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
    
    }
</style>
