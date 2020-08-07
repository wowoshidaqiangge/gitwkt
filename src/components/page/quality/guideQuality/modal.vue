<template>
  <div class="guideQualitymodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='40%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                   <div style="margin-bottom:15px;font-size:16px;font-weight:600;">新增: </div>
                   
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px;position:relative" >
                    <el-col :span="11">
                        <el-form-item label="等级" :label-width="formLabelWidth" prop="rank">
                                <el-select v-model="form.rank" style="width:100%">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="等级描述" :label-width="formLabelWidth" prop="remark">
                                <el-input v-model="form.remark" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="工资等级" :label-width="formLabelWidth" prop="salaryRank">
                                <el-select v-model="form.salaryRank" style="width:100%">
                                    <el-option
                                    v-for="item in options1"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-button type="add" style="margin-left:20px" @click="add">添加</el-button>
                    </el-col>
                </el-col>
                <el-col :span="24">
                     <div style="margin-bottom:20px;font-size:16px;font-weight:600">配置表:</div>
                </el-col>
                 <el-col :span="24">
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
                      </el-table>  
                 </el-col>
                   <div class="page">
                        <el-pagination
                            :background='true'
                            :current-page.sync="pagesize"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :total="totals">
                        </el-pagination>
                    </div>
           </el-form>
        </el-row>
        <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('ruleForm')" >确 定</el-button>
        </div> -->
    </el-dialog>
  </div>
</template>
<script>
import {qualityConfigPage,qualityConfig} from 'api/product'
export default {
    name: 'guideQualitymodal',
    props:{
      dialogFormVisible:{
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
               dept:8
            },
            rules:{},
            formLabelWidth:"80px",
            options:[
                {label:'P级',value:'P级'},
                {label:'C级',value:'C级'},
                {label:'H级',value:'H级'},
                {label:'报废',value:'报废'},
               
            ],
            options1:[
                {label:'正常',value:'1'},
                {label:'降级',value:'2'},
                {label:'无效',value:'3'},
              
               
            ],
            tableData:[],
            tableList:[
                {label:'序号',value:"index",},
                {label:'等级',value:"rank"},
                {label:'等级描述',value:"remark"},
                {label:'工资等级',value:"salaryRank"},
            ],
            page:{
                current:1,
                size:10,
            },
            totals:0,
            pagesize:1
        }
    },
    created(){
      
    },
    mounted(){
        this.getqualityConfigPage()
    },
    watch:{
      
    },
    methods: {
       getqualityConfigPage(){
           qualityConfigPage(this.page).then(res=>{
               if(res.code==='0'){
                   res.data.records.map((item,index)=>{
                       item.index= index+1
                       switch (item.salaryRank) {
                        case 1:
                            item.salaryRank = "正常";
                            break;
                        case 2:
                            item.salaryRank = "降级";
                            break;
                        case 3:
                            item.salaryRank = "无效";
                    } 
                   })
                   this.pagesize = parseInt(res.data.current)
                   this.totals = parseInt(res.data.total)
                   this.tableData = res.data.records
               }
           })
       },
       add(){
           qualityConfig(this.form).then(res=>{
               if(res.code==='0'){
                   this.$message.success(res.msg)
                   
                   this.getqualityConfigPage()
                   this.form = {}
               }
           })
       },
       handleCurrentChange(){

       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.checklist = []
       },
      
       marksure(ruleForm){
           
       },
       beforclose(){
          this.init()
          this.$emit('close',false)
       },
      
    }
}
</script>


<style lang='less'>
    .guideQualitymodal{
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
