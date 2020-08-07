<template>
  <div class="productTask">
     <div v-if="!isdetails">
          <div class="top">
            <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <el-row type='flex' justify="end">
                <div style="flex:1">
                    <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                </div>
                <el-col :span="5">
                        <el-form-item label="" prop="value1">
                            <el-date-picker
                                v-model="maintime"
                                type="daterange"
                                @change="changetime"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width:100%"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="margin:0 20px">
                        <el-form-item label="">
                            <el-select v-model="seachinfo.state" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                <el-col :span="3">
                    <el-form-item label=""  prop="productNameOrCode" >
                        <el-input  placeholder="请输入名称或编码" v-model="seachinfo.productNameOrCode" class="elinput"> </el-input>
                    </el-form-item>
                </el-col>
                <div style="margin:0 15px">
                    <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                    <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                </div>
              </el-row>
            </el-form>
     </div>
     <div class="bot">
           <el-table
                :data="tableData"
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
              
                <el-table-column label="操作" width="295" >
                            <template slot-scope="scope">
                                <el-button
                                    type="add"
                                    v-if="scope.row.state==='1' || scope.row.state==='2' ||scope.row.state==='3' || scope.row.state==='4'"
                                    plain
                                    @click="handledlock(scope.row,6)"
                                >锁定</el-button>
                                <el-button
                                    type="add"
                                    v-if="scope.row.state==='6'"
                                    plain
                                    @click="handledlock(scope.row,7)"
                                >解锁</el-button>
                                <el-button
                                    type="add"
                                     v-if="scope.row.state==='1' || scope.row.state==='2'"
                                    plain
                                    @click="handledelete(scope.row)"
                                >删除</el-button>
                                 <el-button
                                    type="add"
                                    plain
                                    v-if="scope.row.state==='1' || scope.row.state==='2'"
                                    @click="handlededit(scope.row)"
                                >编辑</el-button>
                                <el-button
                                    type="danger"
                                    v-if="scope.row.state==='1' || scope.row.state==='2' ||scope.row.state==='3' || scope.row.state==='4' ||scope.row.state==='5'"
                                    plain
                                    @click="handledistribute(scope.row)"
                                >查看</el-button>
                            </template>
                    </el-table-column>
           </el-table>
            <div class="page">
                <el-pagination
                    :background='true'
                    :current-page.sync="pagesize"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="totals">
                </el-pagination>
            </div>
     </div>     
     </div>
     
    
    
    <Detailsproduct v-if="isdetails" @backpro="backpro" ref="proDetails"/>
    <Modal :dialogFormVisible="dialogFormVisible" :tit="tit" @close='close' ref="proModal"/>
    
  </div>
</template>

<script>
import Modal from './modal'
import Detailsproduct from './detailsProduct'
import {
    produceTaskPage,
    updateProduceTaskLockById,//解锁锁定
    produceTaskDelete,//删除
} from 'api/product'
export default {
    name: 'productTask',
    components:{
        Modal,Detailsproduct
    },
    data() {
        return {
            seachinfo:{
            },
            dialogFormVisible:false,
            
            tit:'新增产品任务',
            page:{
                current:1,
                size:10,
                type:1
            },
             options:[
                {label:"未派单",value:1},
                {label:"未领单",value:2},
                {label:"生产中",value:3},
                {label:"装配",value:4},
                {label:"已完工",value:5},
                {label:"已锁定",value:6}
              
            ],
            maintime:'',
            pagesize:1,
            totals:0,
            tableData:[],
            columnlist:[
                {label:'序号',prop:"index",width:'50px'},
                {label:'生产部门',prop:"deptName"},
                {label:'任务单',prop:"taskNumber"},
                {label:'物料编码',prop:"productCode"},
                {label:'物料名称',prop:"productName"},
                {label:'规格型号',prop:"model"},
                {label:'计划生产量',prop:"planYield"},
                {label:'开始时间',prop:"planStartTime"},
                {label:'结束时间',prop:"planEndTime"},
                {label:'下单人',prop:"createUser"},
                {label:'状态',prop:"produceTaskState"},
                {label:'生产用时',prop:"produceDuration"},
                // {label:'备注',prop:"remark"},
            ],
            isdetails:false
        }
    },
    created(){
        this.getproduceTaskPage()
    },
    mounted(){
     
    },
    methods: {
         changetime(val){
            this.seachinfo.beginDate = moment(val[0]).format("YYYY-MM-DD")
            this.seachinfo.endDate = moment(val[1]).format("YYYY-MM-DD")
        },
        handledelete(info){
             this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
             })
            .then(() => {
                let obj = {type:1,id:info.id}
                produceTaskDelete(obj).then(res=>{
                    if(res.code==='0'){
                        this.$message.success(res.msg)
                        this.getproduceTaskPage()
                    }
                })
                    
            })
        },
        //解锁 锁定
        handledlock(num,state){
            let obj ={id:num.id,type:1,state:state}
            updateProduceTaskLockById(obj).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.getproduceTaskPage()
                }
            })
        },
        // 分页查询
        getproduceTaskPage(){
            let obj = {...this.seachinfo,...this.page}
            produceTaskPage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index+1
                        if(item.createTime){
                            item.createTime = item.createTime.split(' ')[0]
                        }
                    })
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                    this.tableData = res.data.records
                }
            })
        },
        //搜索
        seachinfo1(){
            this.page.current = 1
            this.getproduceTaskPage()
        },
        //重置
        resetting(){
            this.maintime = ''
            this.seachinfo={}
            this.page = {current:1,size:10,type:1}
            this.getproduceTaskPage()
        },
        //新增
        add(){
            this.tit='新增产品任务'
           this.dialogFormVisible = true   
        },
        close(num){
            this.dialogFormVisible = false   
            if(num==='0'){
                this.getproduceTaskPage()
            }
        },
        
        handleCurrentChange(val){
            this.page.current = val
            this.getproduceTaskPage()
        },
        //产品详情
        handlededit(info){
            this.dialogFormVisible = true 
            this.tit = "修改产品任务"
            this.$refs.proModal.getproduceTaskdetail(info)
        },
         // 产品任务详情
        handledistribute(info){
            // this.detailVisble = true
            this.isdetails = true
            setTimeout(()=>{
                 console.log(this.$refs.proDetails)
                 this.$refs.proDetails.getproduceTaskdetail(info)
            },100)
            
           
            

        },
        // 详情返回
        backpro(){
            this.isdetails = false
        }
    }
}
</script>


<style lang='less'>
    .productTask{
        height: 100%;
        .top{
                height: 50px;
                margin-top: 10px;
        }
        .page{
            margin-top: 10px;
            float: right;
        }
        .el-pager li.active{
            background-color: #409baF !important;
            color: #fff;
        }
    }
    
</style>
