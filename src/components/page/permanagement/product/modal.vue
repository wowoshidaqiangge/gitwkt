<template>
  <div class="productmodal">
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
                    <el-form-item label="产品名称" :label-width="formLabelWidth" prop='productName'>
                            <el-input v-model="form.productName" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品编码" :label-width="formLabelWidth" prop='productCode'>
                            <el-input v-model="form.productCode" ></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                    <el-form-item label="规格型号" :label-width="formLabelWidth" prop='model'>
                            <el-input v-model="form.model" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品类别" :label-width="formLabelWidth" prop='productType1'>
                            <el-select v-model="form.productType1" @blur="selectBlur" @change="selchange" class="setwidth" filterable placeholder="请选择">
                                <el-option
                                v-for="item in optionstype"
                                :key="item.id"
                                :label="item.productType"
                                :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                     <el-col :span="11">
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop='deptId'>
                            <el-select v-model="form.deptId" @change="changesel" class="setwidth"  placeholder="请选择">
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
                    <el-form-item label="基本单位" :label-width="formLabelWidth" prop='unit'>
                            <el-select v-model="form.unit" class="setwidth"  placeholder="请选择">
                                <el-option
                                v-for="item in unitList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                </el-col>
                 <el-col :span="11">
                    <el-form-item label="零件&标准件" :label-width="formLabelWidth" prop='toolIds'>
                         <el-cascader
                            class="setwidth"
                            v-model="form.toolIds"
                            :options="options"
                            ref="cascader"
                            filterable
                            collapse-tags
                            :props="casprop"
                        >
                        </el-cascader>
                    </el-form-item>
                </el-col>
                 <el-col :span="11">
                    <div style="margin-left:20px"><el-button type="primary"  @click="addtool('')">新 增</el-button></div>
                </el-col>
               
           </el-form>
             <el-col :span="22" >
               
             </el-col>
          </el-row>
            <div class="inventory" v-if="tableData.length>0">
                <p>零件&标准件清单:</p>
                <div style="padding:15px;border:1px dashed #aaa">
                     <el-table
                        :data="tableData"
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
                            <el-table-column label="操作"  align="center" width="160">
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    plain
                                    @click="handleupdate(scope.row)"
                                >修改</el-button>
                                <el-button
                                    type="warning"
                                    plain
                                    @click="handledelete( scope.row)"
                                >删除</el-button>
                            </template> 
                    </el-table-column>                 
                    </el-table>
                </div>
             </div>
             <div class="releva" v-if="cities.length>0">
                 <p>关联工序:</p>
                 <div class="toolinfo" v-if="citiesName.length>0">
                     <span v-for="(item,index) in citiesName" :key="index">{{item}}<span v-if="citiesName.length-1 !==index">、</span></span>
                     
                 </div>
                 <div class="releva_check">
                    <el-checkbox-group 
                        v-model="checkedCities"
                        @change="changecheck"
                    >
                        <el-checkbox v-for="city in cities" :label="city.workprocessCode" style="margin-top:10px;margin-bottom:10px" :key="city.workprocessCode">{{city.workprocessName}}</el-checkbox>
                    </el-checkbox-group>
                 </div>
             </div>
           
             <el-dialog
                    width="40%"
                    title="零件修改"
                    :visible.sync="innerVisible"
                    append-to-body>
                     <el-row>
                        <el-form :model="form1" :rules="rules1"  ref="form1">
                            <div style="height:90px;padding:15px 5px;border:1px dashed #ccc;margin-bottom:20px">
                                 <el-col :span="11">
                                    <el-form-item label="物料名称" :label-width="formLabelWidth" class="formitem formitem1" prop="partName">
                                            <el-input v-model="form1.partName" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="物料编码" :label-width="formLabelWidth" class="formitem formitem1" prop="partCode">
                                            <el-input v-model="form1.partCode" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="model">
                                            <el-input v-model="form1.model" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="物料图号" :label-width="formLabelWidth" class="formitem formitem1" prop="partNumber">
                                            <el-input v-model="form1.partNumber" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                            </div>
                            <el-col :span="11">
                                <el-form-item label="数量" :label-width="formLabelWidth" class="formitem formitem1" prop="partCount">
                                        <el-input v-model="form1.partCount" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="单位" :label-width="formLabelWidth" class="formitem formitem1" prop="unit">
                                        <el-input v-model="form1.unit" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="close1">取 消</el-button>
                        <el-button type="primary" @click="marksure1('form1')" >确 定</el-button>
                    </div>
             </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="marksure('form1')" >确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>

import {
    productTypeList,
    getProduceDeptList,
    partList,
    workprocessList,
    getListByIds,
    productPost,
    productInfo,//产品详情
    productPut,//产品修改
    } from 'api/product'
export default {
    name: 'productmodal',
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
            productCode:'',
            data:[],
            isclose:true,
            formLabelWidth:'110px',
            form:{
               productType1:null,
               type:1,
            },
            maxheight:"110px",
            unitList:[
                {label:'个',id:'个'},
                {label:'只',id:'只'},
                {label:'件',id:'件'},
                {label:'台',id:'台'},
                {label:'条',id:'条'},
                {label:'支',id:'支'},
                {label:'套',id:'套'},
                {label:'斤',id:'斤'},
                {label:'米',id:'米'},
                {label:'片',id:'片'},
                {label:'面',id:'面'},
                {label:'打',id:'打'},
            ],

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
                ]
            },
            rules:{
                productName:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                productCode:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                model:[
                     { required: true, message: '请输入', trigger: 'blur' },
                ],
                productType1:[
                     { required: true, message: '请选择', trigger: 'change' },
                ],
                deptId:[
                     { required: true, message: '请选择', trigger: 'change' },
                ],
                toolIds:[
                     { required: true, message: '请选择', trigger: 'change' },
                ]
            },
            optionstype:[
            ],
            options:[],
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
            },
            columnlist:[
                {prop:'partCode',label:'物料编码',},
                {prop:'partName',label:'物料名称'},
                {prop:'partNumber',label:'物料图号'},
                {prop:'partType',label:'类型'},
                {prop:'model',label:'规格型号'},
                {prop:'partCount',label:'数量'},
                {prop:'unit',label:'单位',width:"60px"},
            ],
            tableData:[],
            cities:[],
            citiesName:[],
            checkedCities:[],
            casprop:{
                value:'partCode',
                label:'partName',
                children:"partList",
                multiple:true
            }, 
            innerVisible:false,
            isover:false
        }
    },
    created(){
        this.getproductTypeList()
        this.getProduceDeptList()
       
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        // 产品详情
        getproductInfo:async function (info,iscopy){
           await productInfo({id:info.id,type:1}).then(res=>{
               debugger
                if(res.code ==='0'){
                    this.getpartList({deptId:res.data.deptId})
                    this.getworkprocessList({deptId:res.data.deptId})
                    let arr = []
                    let arr1 = []
                    let arr2 = []
                    let arr3 = []
                    res.data.productType1 = res.data.productTypeId
                    res.data.type = 1
                    res.data.partList.map((item)=>{
                        arr.push([res.data.part,item.partCode])
                        arr1.push(item.id)
                    })
                    res.data.standardPartList.map((item)=>{
                        arr.push([res.data.standardPart,item.partCode])
                        arr1.push(item.id)
                    })
                    
                     res.data.workprocessList.map((item)=>{
                        if(item){
                            arr2.push(item.workprocessCode)
                            arr3.push(item.workprocessName)
                            if(item.workprocessName==="完工"&&item.workprocessType=="5"){
                                this.isover = true
                            }   
                        }
                       
                    })
                    this.checkedCities = arr2
                    this.citiesName = arr3
                    this.form = res.data
                    this.form.toolIds = arr
                    this.productCode = res.data.productCode
                    this.addtool(arr1,res.data.productCode,iscopy)
                }
            })
        },
        // select 支持手动输入
        selectBlur(e) {
            this.form.productType1 = e.target.value
            this.$forceUpdate()
            this.form.productType = e.target.value
        },
        selchange(e){
            this.form.productTypeId = e
        },
        removetag(val){

        },
        changecheck(val){
            let arr = []
            let result = []
            let arr1 = []
       
            val.map(item=>{
                let a = this.cities.filter(v=>v.workprocessCode===item)
                if(a.length>0){
                    // arr.push(a[0].workprocessName)
                    result.push(a[0])
                }
            })
            result.map((item,index)=>{
                if(item.workprocessName==='完工'&&item.type==5){
                    arr.unshift(item.workprocessName)
                    arr1.unshift(item.workprocessCode)
                }else{
                    arr.push(item.workprocessName)
                    arr1.push(item.workprocessCode)
                }
            })
            if(result.filter(v=>v.workprocessName==='完工'&&v.type==5).length>0){
                 arr.push(arr.shift())
                 arr1.push(arr1.shift())
                 this.isover = true
            }else{
                this.isover = false
            }
            this.checkedCities = arr1
            this.citiesName = arr
        },
        // 产品类别
        getproductTypeList(){
            productTypeList({type:1}).then(res=>{
                if(res.code==='0'){
                    this.optionstype = res.data
                }
            })
        },
        // 部门
       getProduceDeptList(){
           getProduceDeptList().then(res=>{
               if(res.code==='0'){
                   this.deptList = res.data
               }
           })
       },
       // 切换部门
       changesel(val){
           this.form.toolIds = []
           this.citiesName = []
           this.checkedCities = []
           this.tableData = []
           this.getpartList({deptId:val})
           this.getworkprocessList({deptId:val})
           this.$nextTick(()=>{
             
          })
       },
       // 获取零件 标准件列表
       getpartList: async function(info){
         await partList({...info}).then(res=>{
               if(res.code==='0'){
                   this.options = []
                   res.data.map(item=>{
                       item.partCode = item.partId
                   })
                   this.options = res.data
               }
           })
       },
       // 新增
       addtool(info,code,iscopy){
           let arr = []
           let obj = {}
           if(Array.isArray(info)){
               arr = info
               obj = {partIds:arr.toString(),productCode:code}
           }else{
                if(this.$refs.cascader.getCheckedNodes(true).length<1){
                    this.$message.error('请先选择零件或标准件')
                    return
                }
                this.$refs.cascader.getCheckedNodes(true).map(res=>{
                    arr.push(res.data.id)
                })
                obj = {partIds:arr.toString(),productCode:this.productCode}
           }
           getListByIds(obj).then(res=>{
               if(res.code==='0'){
                   res.data.map(item=>{
                       item.partCount = item.partCount===''? 1 :item.partCount
                   })
                   this.tableData = res.data
                   if(iscopy){
                       let obj = {...this.form,part:this.tableData,workprocessCodes:this.checkedCities}
                       this.$emit('iscopy',obj)
                   }
               }
           })
       },
       // 工序列表
       getworkprocessList: async function (info){
           await workprocessList({itemType:2,...info}).then(res=>{
              if(res.code==='0'){
                  this.cities = res.data
              }
           })
       },
       close(){
           this.init()
           this.$emit('close',false)
       },
       //初始化
       init(){
          this.citiesName = []
          this.tableData = []
          this.cities=[]
          
          this.checkedCities=[],
          this.form = {
                productType1:null,
                type:1,
          }
          this.$nextTick(()=>{
              this.options = []
          })
       },
       marksure(ruleForm){
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                      
                       if(this.cities.length>0&&this.checkedCities.length<1){
                           this.$message.error('关联工序不能为空')
                           return
                       }
                       if(!this.isover){
                           this.$message.error('完工工序必选')
                           return
                       }
                       let obj = {...this.form,part:this.tableData,workprocessCodes:this.checkedCities}
                       if(this.tit==="新增产品"){
                           obj.isCopy = false
                           productPost(obj).then(res=>{
                                if(res.code==='0'){
                                    this.$message.success(res.msg)
                                    this.init()
                                    this.$emit('close','0')
                                }
                            })
                       }else{
                           delete obj.partList
                           delete obj.createTime
                           productPut(obj).then(res=>{
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
       marksure1(){
            this.$refs.form1.validate((valid) => {
                if (valid) {
                    this.tableData.map((item,index)=>{
                        if(item.id ===this.form1.id){
                            this.tableData[index].partCount = this.form1.partCount
                            this.tableData[index].unit = this.form1.unit
                        }
                    })
                    this.$forceUpdate()
                    this.innerVisible = false
                }
            })
            
        },
        close1(){
            this.innerVisible = false
        },
       // 零件修改
       handleupdate(info){
           this.form1 = JSON.parse(JSON.stringify(info))
           this.innerVisible = true
       },
       // 零件删除
       handledelete(info){
           this.tableData.map((item,index)=>{
               if(item.id===info.id){
                   this.tableData.splice(index, 1)
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


<style lang='less' scpoed>
  .el-dialog{
            border-radius: 5px;
        }
        .el-dialog__header{
            background-color: #409BAF;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            text-align: center;
           .el-dialog__title{
               color: #fff;
           }
           .el-dialog__headerbtn .el-dialog__close{
               color: #fff;
           }
        }
        .dialog-footer{
            text-align: end;
        }
    .productmodal{
        
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
           
            padding: 15px 10px;
            margin-bottom: 20px;
            background: #eee;
            span{
                font-size: 15px;
                height: 32px;
                display: inline-block;
                line-height: 32px;
            }
        }
        .releva{
            p{
                padding:15px 0;
                font-size: 15px;
                font-weight: 600;

            }
            p::before{
                content: '*';
                color: #F56C6C;
                margin-right: 4px
            }
            .releva_look{
                padding: 20px 15px;
                font-size: 14px;
                font-weight: 600;
                background: #eee;

            }
            .releva_check{
                padding: 20px 15px;
                border:1px dashed #999
            }
        }
        .inventory{
            p{
                padding-bottom: 20px;
                font-size: 15px;
                font-weight: 600;
            }
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
    
    }
</style>
