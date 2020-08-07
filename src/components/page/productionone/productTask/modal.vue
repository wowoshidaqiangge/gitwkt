<template>
  <div class="productTaskmodal">
    <el-dialog 
    :title="tit" 
    :destroy-on-close='isclose'
    :visible.sync="dialogFormVisible"
    width='65%' 
    :before-close='beforclose' 
    center>
        <el-row>
           <el-form :model="form" ref='ruleForm' :rules="rules">
               <el-col :span="24">
                    <el-col :span="11" v-if="tit==='修改产品'">
                        <el-form-item label="导轨任务单" :label-width="formLabelWidth" prop='taskNumber'>
                                <el-input v-model="form.taskNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="24">
                    <el-col :span="11">
                        <el-form-item label="物料编码" :label-width="formLabelWidth" prop='productCode'>
                                <el-select v-model="form.productCode" filterable  :disabled="editdisabled" @change="changesel" class="setwidth" placeholder="请选择">
                                    <el-option
                                        v-for="item in proptions"
                                        :key="item.productCode"
                                        :label="item.productCode"
                                        :value="item.productCode"
                                        >
                                        {{item.productCode}}__{{item.model}}
                                        </el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col style="border:1px dashed #aaa;padding:20px 10px 0 0;margin-bottom:18px">
                    <el-col :span="11">
                        <el-form-item label="物料名称" :label-width="formLabelWidth" prop='productName'>
                                <el-input v-model="form.productName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                                <el-input v-model="form.model" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                 <el-col :span="11">
                            <el-form-item label="计划产量" :label-width="formLabelWidth" prop='planYield'>
                                    <el-input v-model="form.planYield" @blur="planblur"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="计划时间" :label-width="formLabelWidth" prop='value6'>
                                 <el-date-picker
                                    v-model="form.value6"
                                    class="setwidth"
                                    @change="changetime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                        </el-form-item>
                    </el-col>
                    
                 <el-col :span="22">
                        <el-form-item label="备注" :label-width="formLabelWidth" prop='remark'>
                                 <el-input type="textarea" v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>
           </el-form>
        </el-row>
        
            <div class="inventory" v-if="productCodeList.length>0">
                <p>零件生产工单:</p>
                <div style="padding:15px;border:1px dashed #aaa">
                     <el-table
                        :data="productCodeList"
                        max-height="300"
                        stripe
                        border                     
                        >
                            <el-table-column
                                v-for="(item,index) in columnlist"
                                :key="index"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                            <el-table-column label="操作"  align="center" >
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    v-if="tit!=='修改产品' || scope.row.state==1  "
                                    plain
                                    class="red"
                                    icon='el-icon-edit-outline'
                                   @click="handleupdate(scope.row,true)"
                                ></el-button>
                            </template> 
                    </el-table-column>                 
                    </el-table>
                </div>
             </div>
              <div class="inventory" v-if="tableData.length>0">
                <p>产品装配工单:</p>
                <div style="padding:15px;border:1px dashed #aaa">
                     <el-table
                        :data="tableData"
                        stripe
                        border                     
                        >
                            <el-table-column
                                v-for="(item,index) in columnlist1"
                                :key="index"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                            <el-table-column label="操作"  align="center" >
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    plain
                                    class="red"
                                    icon='el-icon-edit-outline'
                                   @click="handleupdate(scope.row,false)"
                                ></el-button>
                            </template> 
                    </el-table-column>                 
                    </el-table>
                </div>
             </div>
            <el-dialog
                    width="45%"
                    :title="diatitle"
                    :visible.sync="innerVisible"
                    append-to-body>
                     <el-row>
                        <el-form :model="form1" :rules="rules1"  ref="form1">
                            <el-col style="padding:15px 5px 5px 5px;border:1px dashed #ccc;margin-bottom:20px">
                                <div v-if="isparts">
                                    <el-col :span="11">
                                        <el-form-item label="物料名称" :label-width="formLabelWidth"  prop="partName">
                                                <el-input v-model="form1.partName" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="物料编码" :label-width="formLabelWidth"  prop="partCode">
                                                <el-input v-model="form1.partCode" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="物料图号" :label-width="formLabelWidth"  prop="partNumber">
                                                <el-input v-model="form1.partNumber" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </div>
                                <div v-if="!isparts">
                                    <el-col :span="11">
                                        <el-form-item label="物料名称" :label-width="formLabelWidth"  prop="productName">
                                                <el-input v-model="form1.productName" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="物料编码" :label-width="formLabelWidth"  prop="productCode">
                                                <el-input v-model="form1.productCode" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </div>
                                <el-col :span="11">
                                    <el-form-item label="规格型号" :label-width="formLabelWidth"  prop="model">
                                            <el-input v-model="form1.model" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                               
                                <el-col :span="11">
                                    <el-form-item label="计划产量" :label-width="formLabelWidth"  prop="planYield">
                                            <el-input v-model="form1.planYield" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="数量" :label-width="formLabelWidth"  prop="partCount">
                                        <el-input v-model="form1.partCount" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="计划时间" :label-width="formLabelWidth"  prop="plantime">
                                        <el-date-picker
                                            v-model="form1.plantime"
                                            type="daterange"
                                            style="width:100%"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期">
                                            </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="innerVisible=false">取 消</el-button>
                        <el-button type="primary" @click="marksure1('form1')" >确 定</el-button>
                    </div>
             </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('ruleForm')" >确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
    productList,// 查询产品列表 物料编码
    getPlanListByProductCode,//根据产品编码查询工单
    produceTaskPost,// 产品新增
    produceTaskdetail,//产品详情
    produceTaskPut,// 产品修改
} from 'api/product'
import moment from 'moment'
export default {
    name: 'productTaskmodal',
    props:{
      dialogFormVisible:{
          type:Boolean
      },
      tit:{
          type:String
      }
    },
    data() {
        return {
            editdisabled:false,
            data:[],
            isclose:true,
            innerVisible:false,
            form:{

            },
            diatitle:'',
            form1:{},
            rules1:{
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
                plantime:[
                    {  required: true, message: '请输入', trigger: 'blur' },
                ]
            },
            formLabelWidth:'100px',
            value6:'',
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
                    {  required: true, message: '请输入', trigger: 'change' },
                ]
            },
           columnlist:[
            //    {label:'生产工单',prop:'index'},
               {label:'物料编码',prop:'partCode'},
               {label:'物料图号',prop:'partNumber'},
               {label:'物料名称',prop:'partName'},
               {label:'规格型号',prop:'model'},
               {label:'类型',prop:'typeName'},
               {label:'数量',prop:'partCount'},
               {label:'开始时间',prop:'planStartTime'},
               {label:'结束时间',prop:'planEndTime'},
           ],
           columnlist1:[
            //    {label:'生产工单',prop:'index'},
               {label:'物料编码',prop:'productCode'},
               {label:'物料名称',prop:'productName'},
               {label:'规格型号',prop:'model'},
               {label:'数量',prop:'partCount'},
               {label:'开始时间',prop:'planStartTime'},
               {label:'结束时间',prop:'planEndTime'},
           ],
           tableData:[],
           proptions:[],
           productCodeList:[],// 产品工单列表
           isparts:false
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
     
        // 产品详情
        getproduceTaskdetail(info){
            this.editdisabled = true
            let pro = JSON.parse(JSON.stringify(info))
            pro.value6 = [pro.planStartTime,pro.planEndTime]
            this.form = pro

            let columnlist = JSON.parse(JSON.stringify(this.columnlist))
            columnlist.unshift({label:'生产工单',prop:'taskNumber'},)
            this.columnlist = columnlist

            let columnlist1 = JSON.parse(JSON.stringify(this.columnlist1))
            columnlist1.unshift({label:'生产工单',prop:'taskNumber'},)
            this.columnlist1 = columnlist1

            produceTaskdetail({type:1,id:pro.id,operateType:'update'}).then(res=>{
               if(res.code==='0'){
                   let arr =[]
                   let arr1 =[]
                   res.data.planList.map((item)=>{
                       
                       item.planYield = pro.planYield
                       if(!item.partCount){
                           item.planEndTime = ''
                           item.planStartTime = ''
                       }
                       if(item.isProduct===0){
                           arr.push(item)
                       }else{
                           item.productCode = item.partCode
                           item.productName = item.partName
                           arr1.push(item)
                       }
                   })
                   this.tableData = arr1
                   this.productCodeList = arr
               }
            })
        },
        // 产品编码
       getproductList(){
           productList({type:1}).then(res=>{
               if(res.code==='0'){
                   this.proptions = res.data
               }
           })
       },
       // 删除工单号
       removearr(){
           this.columnlist.map((v,index)=>{
               if(v.prop ==='taskNumber'){
                   this.columnlist.splice(index,1)
               }
           })
           this.columnlist1.map((v,index)=>{
               if(v.prop ==='taskNumber'){
                   this.columnlist1.splice(index,1)
               }
           })
       },
       // 切换产品编码
       changesel(val){
           const info = this.proptions.filter(v=>v.productCode ===val)
           info[0].partCount = 0
           info[0].planStartTime = ''
           info[0].planEndTime = ''
           info[0].type = '3'
           this.form.productName = info[0].productName
           this.form.productId = info[0].id
           this.form.deptId = info[0].deptId
           this.form.model = info[0].model
           if(this.form.planYield){
                this.form.planYield = ''
           }
           this.form.type = 1
           this.tableData = info
           this.getPlanListByProductCode({productCode:val})
        //    this.$forceUpdate()
       },
       // 给工单添加计划产量
       planblur(){
          
           this.tableData.map(v=>{
               v.planYield = this.form.planYield
           })
           let arr = this.productCodeList.filter(v=>v.type==2)
            this.productCodeList.map(v=>{
                v.planYield = this.form.planYield
                if(v.type==2){
                    v.partCount = this.form.planYield * v.partCountNum
                }
               
           })
           
       },
       // 根据产品编码查工单
       getPlanListByProductCode(info){
           getPlanListByProductCode(info).then(res=>{
               if(res.code==='0'){
                //    let a = res.data.filter(v=>v.type===2)
                   let arr = []
                   res.data.map((item)=>{
                    
                       if(item.isProduct==='0'){
                          
                           // 如果先选产量 处理生产数量
                           if(item.type===2&&this.form.planYield){
                               item.partCount = this.form.planYield * item.partCountNum
                           }else{
                               item.partCount = 0
                           }
                           
                           item.planStartTime = ''
                           item.planEndTime = ''
                           arr.push(item)
                       }
                   })
                   this.productCodeList = arr
               }
           })
       },
       changetime(val){
         
           this.form.planStartTime = moment(val[0]).format('YYYY-MM-DD')
           this.form.planEndTime = moment(val[1]).format('YYYY-MM-DD')
       },
       //修改零件工单
       handleupdate(info,type){
           if(type){
               this.diatitle = '零件修改'
           }else{
               this.diatitle = '装配修改'
           }
           let parts = JSON.parse(JSON.stringify(info))
           if(parts.planStartTime){
               parts.plantime = [parts.planStartTime,parts.planEndTime]
           }
           this.isparts = type
           this.form1 = parts
           this.innerVisible = true
       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
           this.form = {}
           this.form1 = {}
           this.value6 = ''
           this.editdisabled = false
           this.productCodeList = []
           this.tableData = []
           this.checklist = []
           this.removearr()
       },
       // 新增产品数据处理
       record(){
        
           let obj = {}
           let arr = this.productCodeList
           let arr1 = []
           // 是否有空的时间
           let isstop = false
           arr.some(v=>{
              
               if(!v.planEndTime&&v.partCount&&v.type!=2){
                   isstop = true
                   this.$message.error('零件生产工单中时间不能为空')
                   return true
               }
               v.itemId = v.partId 
               v.itemCode = v.partCode
           })
           this.tableData.some(v=>{
               if(!v.planEndTime&&v.partCount){
                   isstop = true
                   this.$message.error('产品装配工单中时间不能为空')
                   return
               }
               arr1.push({itemCode:v.productCode,itemId:v.id?v.id:v.productId,type:3,partCount:v.partCount,planStartTime:v.planStartTime,planEndTime:v.planEndTime})
           })
           let arr2 = [...arr,...arr1]
            this.form.taskItemList= arr2
           // 判断时间是否有空
           if(isstop){
               return false
           }else {
               return true
           }
          
       },
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    if(!this.record()){
                        return
                    }
                    if(this.tit==="新增产品任务"){
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
       marksure1(ruleForm){
           this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    if(this.isparts){
                        this.productCodeList.map((item,index)=>{
                            if(item.partCode ===this.form1.partCode){
                                this.productCodeList[index].partCount = this.form1.partCount
                                this.productCodeList[index].planStartTime =  moment(this.form1.plantime[0]).format('YYYY-MM-DD') 
                                this.productCodeList[index].planEndTime = moment(this.form1.plantime[1]).format('YYYY-MM-DD') 
                            }
                        })
                    }else{
                        
                        let arr = JSON.parse(JSON.stringify(this.tableData))
                        arr[0].partCount = this.form1.partCount
                        arr[0].planStartTime =  moment(this.form1.plantime[0]).format('YYYY-MM-DD') 
                        arr[0].planEndTime = moment(this.form1.plantime[1]).format('YYYY-MM-DD') 
                        this.tableData = arr
                    }
                    
                     this.innerVisible = false
                    //   this.$forceUpdate()
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
    .productTaskmodal{
        .setwidth{
            width:100%;
        }
        .el-col-11{
            margin-bottom: 10px;
        }
        .inventory{
            p{
                 height: 50px;
                 line-height: 50px;
                font-size: 15px;
                font-weight: 600;
            }
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
    
    }
</style>
