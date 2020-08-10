
<template>
  <div class="workpricemodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='50%' 
    :before-close='beforclose' 
    center>
          <el-row>
           <el-form :model="form" ref='form1' :rules="rules">
               <el-col :span="24">
                    <el-col :span="11">
                        <el-form-item label="物料选择" :label-width="formLabelWidth" prop="press">
                                <el-select v-model="form.press" 
                                 class="setwidth" @change="changesel" :filter-method="dataFilter" filterable placeholder="请输入物料名称或编码">
                                    <el-option
                                    v-for="item in optionstype"
                                    :key="item.itemCode"
                                    :label="item.itemName"
                                    :value="item.itemCode">
                                    {{item.itemName}}_{{item.itemCode}}
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
               </el-col>
                <el-col style="padding:25px 10px 0 10px;border:1px dashed #ccc;margin-bottom:20px">
                    <el-col :span="11">
                        <el-form-item label="物料名称" :label-width="formLabelWidth" prop='itemName'>
                                <el-input v-model="form.itemName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="物料编码" :label-width="formLabelWidth" prop='itemCode'>
                                <el-input v-model="form.itemCode" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="物料图号" :label-width="formLabelWidth" prop='itemNumber'>
                                <el-input v-model="form.itemNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
               
                <el-col>
                     <el-col :span="11">
                        <el-form-item label="工序信息" :label-width="formLabelWidth" prop='workprocessCode'>
                                <el-select v-model="form.workprocessCode" @change="changework"  class="setwidth" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in optionscode"
                                    :key="item.workprocessCode"
                                    :label="item.workprocessName"
                                    :value="item.workprocessCode">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
                 <el-col>
                     <el-col :span="11">
                        <el-form-item label="计时单价" :label-width="formLabelWidth" prop='timePrice'>
                                 <el-select v-model="form.timePrice" @blur="selectBlur" @change="selchange" class="setwidth1" filterable placeholder="请选择">
                                    <el-option
                                    v-for="item in timePriceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                               
                                 <span style="margin-left:10px;letter-spacing:2px">元/小时</span>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                         <div style="font-size:16px;font-weight:600">计价单价</div>
                </el-col>
                 <el-col style="padding:25px 10px 0 10px;border:1px dashed #ccc">
                  
                     <el-col :span="11">
                         <el-form-item label="合格P" :label-width="formLabelWidth" prop='qualifiedPrice'>
                                    <el-input v-model="form.qualifiedPrice" class="setwidth1" @keyup.native="form.qualifiedPrice =form.qualifiedPrice.replace(/[^\d.]/g,'')" ></el-input>
                                    <span style="margin-left:10px;letter-spacing:2px">元/件</span>
                            </el-form-item>
                         </el-col>
                         <el-col :span="11">
                            <el-form-item label="让步工H" :label-width="formLabelWidth" prop='concessionPrice'>
                                    <el-input v-model="form.concessionPrice" class="setwidth1" @keyup.native="form.concessionPrice =form.concessionPrice.replace(/[^\d.]/g,'')" ></el-input>
                                    <span style="margin-left:10px;letter-spacing:2px">元/件</span>
                            </el-form-item>
                         </el-col>
                         <el-col :span="11">
                            <el-form-item label="降级工C" :label-width="formLabelWidth" prop='demotionPrice'>
                                    <el-input v-model="form.demotionPrice" class="setwidth1" @keyup.native="form.demotionPrice =form.demotionPrice.replace(/[^\d.]/g,'')" ></el-input>
                                    <span style="margin-left:10px;letter-spacing:2px">元/件</span>
                            </el-form-item>
                    </el-col>
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

import {
    getItemList,
    getWorkprocessByItemCode,//根据物料查工序
    workpricepost,
    workpriceput,// 工价修改
} from 'api/product'
export default {
    name: 'workpricemodal',
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
                timePrice:null
            },
            rules:{
                press:[
                    { required: true, message: '请选择物料', trigger: 'blur' },
                ],
                workprocessCode:[
                    { required: true, message: '请选择工序', trigger: 'blur' },
                ],
                timePrice:[
                    //  {
                    //     validator(rule, value, callback) {
                    //     var reg = /^[0-9]+(\.?[0-9]+)?$/
                    //     if (reg.test(value)) {
                    //         callback()
                    //     } else {
                    //         callback(new Error('价格必须为整数或小数'))
                    //     }
                    //     },
                    //     trigger: 'change'
                    // }
                ],
               
            },
            optionstype:[],
            copy:[],
            optionscode:[],
            timePriceList:[
                {label:'25',value:'25'},
                {label:'18.75',value:'18.75'},
                {label:'16.25',value:'16.25'},
                {label:'15',value:'15'},

            ]
        }
    },
    created(){
      this.getItemList()
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        changework(val){
            let a = this.optionscode.filter(v=>v.workprocessCode ===val)
            this.form.workprocessId = a[0].id
        }, 
        selectBlur(e) {
            this.form.timePrice = e.target.value
            this.$forceUpdate()
           
        },
        selchange(e){
            this.form.timePrice = e
        },
       dataFilter(val) {
           
            if (val) { //val存在
                this.optionstype = this.copy.filter((item) => {
                    if (item.itemCode.indexOf(val)!==-1 || item.itemName.indexOf(val)!==-1) {
                        return true
                    }
                })
            }else{
                this.optionstype = this.copy
            }
        
        },
        //获取工价详情
        getworkprice: async function(info){
            let info1 = JSON.parse(JSON.stringify(info))
            info1.press = info1.itemCode
            await this.getWorkprocessByItemCode({itemCode:info1.itemCode,type:info1.itemType})
            this.form = info1
            // debugger
        },
        // 获取物料列表
        getItemList(){
            getItemList().then(res=>{
                if(res.code=='0'){
                    this.optionstype = res.data
                    this.copy = Object.assign(res.data)
                }
            })
        },
        changesel(e){
           let v =  this.optionstype.filter(v=>v.itemCode===e)
            if(this.form.workprocessCode){
                this.form.workprocessCode = ''
            }
           this.form.itemName = v[0].itemName
           this.form.itemCode = v[0].itemCode
           this.form.itemNumber = v[0].itemNumber
           this.form.itemType = v[0].itemType
           this.form.deptId = v[0].deptId
           this.form.model = v[0].model
           this.optionscode = []
           
        //    this.$forceUpdate()
           this.getWorkprocessByItemCode({itemCode:v[0].itemCode,type:v[0].itemType})
        },
        // 获取工序信息
        getWorkprocessByItemCode: async function(info){
          await  getWorkprocessByItemCode(info).then(res=>{
                if(res.code==='0'){
                   this.optionscode = res.data
                }
            })
        },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.optionscode = []
          this.form = {
              timePrice:null
          }
       },
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    if(!this.form.timePrice){
                        delete this.form.timePrice
                    }
                    if(this.tit==="新增工价"){
                       workpricepost(this.form).then(res=>{
                           if(res.code==='0'){
                               this.$message.success(res.msg)
                               this.init()
                               this.$emit('close','0')
                           }
                       })
                    }else{
                       workpriceput(this.form).then(res=>{
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
    .workpricemodal{
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
            margin-bottom: 5px;
        }
        .dialog-footer{
            text-align: end;
        }
        .setwidth{
            width: 100%;
        }
        .setwidth1{
            width: 65%;
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
