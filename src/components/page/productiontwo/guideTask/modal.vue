<template>
  <div class="guidetTaskmodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='50%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
                <el-col :span="24">
                    <el-col :span="11" v-if="tit==='修改导轨'">
                        <el-form-item label="导轨任务单" :label-width="formLabelWidth" prop='taskNumber'>
                                <el-input v-model="form.taskNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="11">
                       <el-form-item label="物料选择" :label-width="formLabelWidth" prop='productCode'>
                                <el-select v-model="form.productCode" filterable  @change="changesel" class="setwidth" placeholder="请输入物料名称">
                                    <el-option
                                        v-for="item in proptions"
                                        :key="item.productCode"
                                        :label="item.productCode"
                                        :value="item.productCode"
                                    >
                                        {{item.productCode}}_{{item.productName}}
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:18px 10px 0 0;margin-bottom:18px">
                    <el-col :span="11">
                        <el-form-item label="物料名称" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="11">
                            <el-form-item label="计划产量" :label-width="formLabelWidth" prop='planYield'>
                                    <el-input v-model="form.planYield" ></el-input>
                            </el-form-item>
                        </el-col>
                    <el-col :span="11">
                        <el-form-item label="计划时间" :label-width="formLabelWidth"  prop='value6'>
                                 <el-date-picker
                                    v-model="form.value6"
                                    class="setwidth"
                                    type="daterange"
                                    @change="changetime"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="22">
                        <el-form-item label="特殊要求" :label-width="formLabelWidth" prop='remark'>
                                 <el-input type="textarea" v-model="form.remark"></el-input>
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
    productList,//零件编码
    produceTaskPost,// 新增
    produceTaskPut,//修改
} from 'api/product'
import moment from 'moment'
export default {
    name: 'guidetTaskmodal',
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
            form:{},
            rules:{
                productCode:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                 planYield:[
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
                value6:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            },
            value6:'',
            formLabelWidth:"100px",
            proptions:[]
        }
    },
    created(){
        this.getproductList()
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        //详情
        getdetails(info){
            let pro = JSON.parse(JSON.stringify(info))
            pro.value6 = [pro.planStartTime,pro.planEndTime]
            pro.type = 2
            this.form = pro
        },
        //查询产品编码
        getproductList(){
            productList({type:2}).then(res=>{
                if(res.code==="0"){
                    this.proptions = res.data
                }
            })
        },
         changetime(val){
           this.form.planStartTime = moment(val[0]).format('YYYY-MM-DD')
           this.form.planEndTime = moment(val[1]).format('YYYY-MM-DD')
       },
        changesel(val){
             const info = this.proptions.filter(v=>v.productCode ===val)
            this.form.productName = info[0].productName
            this.form.model = info[0].model
            this.form.productId = info[0].id
            this.form.deptId = info[0].deptId
            this.form.type = 2
        },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.form = {}
          this.value6 = ''
       },
      
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    if(this.tit==="新增导轨"){
                        produceTaskPost(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.init()
                                this.$emit('close','0')
                            }
                        })
                    }else{
                        delete this.form.createTime
                        produceTaskPut(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.init()
                                this.$emit('close','0')
                            }
                        })
                    }
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
    .guidetTaskmodal{
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
        .setwidth{
            width:100%
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
    
    }
</style>
