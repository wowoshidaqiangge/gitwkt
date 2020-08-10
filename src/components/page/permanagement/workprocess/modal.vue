<template>
  <div class="workpressmodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='50%' 
    :before-close='beforclose' 
    center>
          <el-row>
           <el-form :model="form" ref='form1' :rules="rules">
               <el-col :span="11">
                    <el-form-item label="工序名称" :label-width="formLabelWidth" prop='workprocessName'>
                            <el-input v-model="form.workprocessName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="工序编码" :label-width="formLabelWidth" prop='workprocessCode'>
                            <el-input v-model="form.workprocessCode" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="工序类型" :label-width="formLabelWidth" prop='type'>
                            <el-select v-model="form.type"  class="setwidth" placeholder="请选择">
                                <el-option
                                v-for="item in optionstype"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                    <el-form-item label="物料类型" :label-width="formLabelWidth" prop='itemType'>
                            <el-select v-model="form.itemType" class="setwidth"  placeholder="请选择">
                                <el-option
                                v-for="item in optionsitemType"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                    <el-form-item label="生产部门" :label-width="formLabelWidth" prop='deptId'>
                            <el-select v-model="form.deptId" class="setwidth" @change="changsel"  placeholder="请选择">
                                <el-option
                                    v-for="item in deptList"
                                    :key="item.deptId"
                                    :label="item.deptName"
                                    :value="item.deptId">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                </el-col>
               <el-col :span="11">
                    <el-form-item label="工种名称" :label-width="formLabelWidth" prop='workKind'>
                            <el-input v-model="form.workKind" ></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                    <el-form-item label="关联工具" :label-width="formLabelWidth" prop='toolCodes'>
                            <el-select v-model="form.toolCodes" class="setwidth" :multiple="true" filterable placeholder="请选择">
                                <el-option
                                    v-for="item in toollist"
                                    :key="item.toolCode"
                                    :label="item.toolName"
                                    :value="item.toolCode">
                                    {{item.toolName}}{{item.model}}
                                    </el-option>
                                </el-select>
                    </el-form-item>
                </el-col>
                 
                 <el-col :span="11">
                    <div style="margin-left:20px"><el-button type="primary" @click="addtool">新 增</el-button></div>
                </el-col>
                <el-col :span="22" v-if="checktool.length>0">
                    <div class="toolinfo">
                        <span v-for="(item,index) in checktool" :key="item.id">{{item.toolCode}}{{item.toolName}}{{item.model}}<span v-if="checktool.length-1 !==index">、</span></span>
                    </div>
                </el-col>
           </el-form>
          </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('form1')" >确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>

import {toollist,getProduceDeptList,workprocess,workprocessget,workprocessput} from 'api/product'
export default {
    name: 'workpressmodal',
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
            formLabelWidth:'100px',
            form:{
               
            },
            rules:{
                workprocessName:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                workprocessCode:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                type:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                itemType:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                deptId:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                workKind:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                // toolCodes:[
                //     { required: true, message: '请选择', trigger: 'blur' },
                // ],
              
            },
            optionstype:[
                {label:'正常',id: 1},
                {label:'补充',id: 2},
                {label:'外协',id: 3},
                {label:'免检',id: 4},
                {label:'质检',id: 5},
                {label:'综合检验',id: 6},
            ],
            optionsitemType:[
                {label:'零件',id: 1},
                {label:'产品',id: 2},
                {label:'滑块',id: 3},
                {label:'线轨',id: 4},
            ],
            checktool:[],
            toollist:[],
            deptList:[],
            deptprop:{
                value:'id'
            }
        }
    },
    created(){
        this.getProduceDeptList()
        // this.gettoollist()
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        // 详情
        getworkprocessget: async function(info){
            let info1 = JSON.parse(JSON.stringify(info))
            await  this.gettoollist({deptId:info1.deptId})
            if(info1.toolCodes&&!Array.isArray(info1.toolCodes)){
                info1.toolCodes = info1.toolCodes.split(',') 
            }
           this.form = info1
           await this.addtool()
        },
        // 部门
       getProduceDeptList(){
           getProduceDeptList().then(res=>{
               if(res.code==='0'){
                   this.deptList = res.data
               }
           })
       },
       // 工具列表
       gettoollist:async function (info){
          await toollist(info).then(res=>{
               if(res.code==='0'){
                   this.toollist =res.data
               }
           })
       },
       changsel(val){
            this.toollist = []
            if(this.form.toolCodes){
                 this.form.toolCodes = ''
            }
            this.checktool = []
            this.gettoollist({deptId:val})
       },
       addtool(){
           let arr = []
        //    if(this.toollist.length<1){
        //        this.$message.error('请先选择关联工具')
        //        return
        //    }
           this.toollist.map((item)=>{
               if(this.form.toolCodes.findIndex(v=> v==item.toolCode)!==-1){
                   arr.push(item)
               }
           })
           this.checktool = arr
         
       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.checktool = []
          this.form = {}
       },
      
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    if(this.form.toolCodes===''){
                        delete this.form.toolCodes
                    }
                    if(this.tit==="新增工序"){
                        workprocess(this.form).then(res=>{
                            if(res.code==='0'){
                                this.$message.success(res.msg)
                                this.init()
                                this.$emit('close','0')
                            }
                        })
                    }else{
                        delete this.form.createTime
                        workprocessput(this.form).then(res=>{
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
    .workpressmodal{
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
        .el-col{
            margin-bottom: 10px;
        }
        .dialog-footer{
            text-align: end;
        }
        .setwidth{
            width: 100%;
        }
        .toolinfo{
            margin-left: 14px;
            padding: 15px 10px;
            background: #eee;
            span{
                font-size: 15px;
                height: 32px;
                display: inline-block;
                line-height: 32px;
            }
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
    
    }
</style>