<template>
  <div class="repairexamodal">
    <el-dialog 
    title="查看" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible1"
    width='50%' 
    :before-close='beforclose' 
    center>
    <el-row>
         <el-form :model="form" :rules="rules" ref="form">
             <el-col :span="11">
                 <el-form-item label="故障设备：" :label-width="formLabelWidth" class="formitem formitem1" prop="category">
                    {{form.deviceName}}
                </el-form-item>
             </el-col>
             <el-col :span="11">
                 <el-form-item label="规格型号：" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
                   {{model}}
                </el-form-item>
             </el-col>
             <el-col :span="11">
                 <el-form-item label="设备类型：" :label-width="formLabelWidth" class="formitem formitem1" prop="category">
                    {{form.toType}}
                </el-form-item>
             </el-col>
             <el-col :span="11">
                 <el-form-item label="设备编号：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.deviceNumer}}
                </el-form-item>
             </el-col>
             <el-col :span="24">
                 <el-form-item label="故障时间：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.dateTime}}
                </el-form-item>
             </el-col>
             <el-col :span="24">
                 <el-form-item label="故障原因：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.fault}}
                </el-form-item>
             </el-col>
             <el-col :span="24">
                 <el-form-item label="解决办法：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.solution}}
                </el-form-item>
             </el-col>
             <el-col :span="11">
                 <el-form-item label="维修人：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.repairUserName}}
                </el-form-item>
             </el-col>
             <el-col :span="11">
                 <el-form-item label="验收人：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.checkUserName}}
                </el-form-item>
             </el-col>
             <el-col :span="24">
                 <el-form-item label="当前状态：" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                   {{form.states}}
                </el-form-item>
             </el-col>
        </el-form>
    </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="close">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { mainrepairid, devInfo} from 'api/main'
export default {
    name: 'repairexamodal',
  
    props:{
        dialogFormVisible1:{
            type:Boolean
        },
        tit:{
            type:String
        },
       
    },
    data() {
        return {
            isclose:true,
            sureload:false,
            deptlist:[],
            rolelist:[],
            devicelist:[],
            model: '',
            form: {
              deviceName: ''
            },
            formLabelWidth: '90px',
            rules: {
                name: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
               
            },
            timelist:[{value:'year',label:'按年'},{value:'month',label:'按月'}],
            userlist:[]
        }
    },
    created(){
    //   this.getdeviceToTypeList()
    //   this.getdeviceList()
    },
    mounted(){
        
    },
    watch:{
     
    },
    methods: {
        //查看详情
        getmainrepairid(id){
            mainrepairid(id).then(res=>{
                if(res.code==='0'){
                    this.form = res.data
                    this.form.states = res.data.state? '已完成' : '待维修'
                    this.changeselect(res.data.deviceId)
                }
            })
        },
      // 查看设备详情
      changeselect(val){
          console.log(val)
          devInfo({id:val}).then(res=>{
              if(res.code==='0'){
                   this.model = res.data.model
                    console.log(this.form)
                }
          })
      },
       close(){
           this.$emit('close',false)
       },
       beforclose(){
          this.$emit('close',false)
       },
    }
}
</script>


<style lang='less'>
    .repairexamodal{
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
        .el-form{
            display: flex;
            flex-wrap: wrap;
        }
        .el-select {
            width: 100%;
        }
        .el-col{
            margin-bottom: 20px;
        }
    
    }

</style>
