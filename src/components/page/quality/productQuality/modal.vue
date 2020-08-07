<template>
  <div class="productQualitymodal">
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
                                <el-input v-model="form.accountType" disabled></el-input>
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
                                    <el-input v-model="form.industrialWaste" ></el-input>
                            </el-form-item>
                 </el-col>
                  
                 <el-col :span="8">
                            <el-form-item label="料废" :label-width="formLabelWidth" prop='scrapWaste'>
                                    <el-input v-model="form.scrapWaste" ></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步工H" :label-width="formLabelWidth" prop='concessionWork'>
                                    <el-input v-model="form.concessionWork"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="降级工C" :label-width="formLabelWidth" prop='relegationWork'>
                                    <el-input v-model="form.relegationWork"></el-input>
                            </el-form-item>
                 </el-col>
                  <el-col :span="8">
                            <el-form-item label="让步料H" :label-width="formLabelWidth" prop='concessionMaterial'>
                                    <el-input v-model="form.concessionMaterial" ></el-input>
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
    produceTaskQuality,//质检录入
} from 'api/product'
export default {
    name: 'productQualitymodal',
    props:{
      detailVisble:{
          type:Boolean
      },
     
     
    },
    data() {
        return {
            data:[],
            isclose:true,
            form:{},
            rules:{},
            formLabelWidth:"80px"
        }
    },
    created(){
 
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        enterinfo(info,way){
            let pro = JSON.parse(JSON.stringify(info))
            let tail = JSON.parse(JSON.stringify(way))
            let obj = {...pro,...tail}
            obj.type = 2
            obj.qualityState = 1
            obj.checkType = 3
            delete obj.remark
            // delete obj.createTime
            console.log(obj)
            this.form= obj
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
            this.$refs[ruleForm].validate(valid => {
                if (valid) {
                    produceTaskQuality(this.form).then(res=>{
                        if(res.code==='0'){
                           this.$message.success(res.msg)
                           this.init()
                           this.$emit('detailclose','0')
                        }
                    })
                }
            })
           console.log(this.form)
       },
       beforclose(){
          this.init()
          this.$emit('detailclose',false)
       },
      
    }
}
</script>


<style lang='less'>
    .productQualitymodal{
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
