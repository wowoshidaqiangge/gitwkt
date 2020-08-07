<template>
  <div class="partTask" >
       <div  v-if="!isdetails">
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
                    <el-form-item label=""  prop="partNameOrCode" >
                        <el-input  placeholder="请输入名称或编码" v-model="seachinfo.partNameOrCode" class="elinput"> </el-input>
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
                <el-table-column label="加工路线" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    v-if="scope.row.state!=6"
                                    plain
                                    class="red"
                                    @click="handledistribute(scope.row)"
                                >详情</el-button>
                            </template>
                    </el-table-column>
                    <el-table-column label="操作" width="210px">
                            <template slot-scope="scope">
                                <el-button
                                    type="add"
                                    v-if="scope.row.state==6"
                                    plain
                                    @click="handledlock(scope.row,7)"
                                >解锁</el-button>
                                <el-button
                                    type="add"
                                    v-if="scope.row.state!=6&&scope.row.state!=5"
                                    plain
                                    @click="handledlock(scope.row,6)"
                                >锁定</el-button>
                                <el-button
                                    type="add"
                                    v-if="scope.row.state==1||scope.row.state==2"
                                    plain
                                    @click="handlededit(scope.row)"
                                >编辑</el-button>
                                <el-button
                                    type="add"
                                    plain
                                     v-if="scope.row.state==1||scope.row.state==2"
                                    @click="handledDelete(scope.row)"
                                >删除</el-button>
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
     <DetailsPartmodal :detaVisible="detaVisible" @detailclose='detailclose' ref="detailpartModal"/>    
    <Modal :dialogFormVisible="dialogFormVisible" :tit="tit" @close='close' ref="partModal"/>
  </div>
</template>

<script>
import Modal from './modal'
import DetailsPartmodal from './detailsPartModal'
import {
    partTaskPage,
    updatePartTaskLockById,//解锁 锁定
    partTaskDelete,//删除
} from 'api/product'
export default {
    name: 'partTask',
    components:{
        Modal,DetailsPartmodal
    },
    data() {
        return {
            isdetails:false,
            detaVisible:false,
            seachinfo:{
            },
            dialogFormVisible:false,
            tit:'新增零件',
            page:{
                current:1,
                size:10
            },
            pagesize:1,
            totals:0,
            options:[
                {label:"未派单",value:1},
                {label:"未领单",value:2},
                {label:"生产中",value:3},
                {label:"装配",value:4},
                {label:"已完工",value:5},
                {label:"已锁定",value:6}
            ],
            maintime:'',
            tableData:[],
            columnlist:[
                {label:'序号',prop:"index",width:'50px'},
                {label:'生产部门',prop:"deptName"},
                {label:'任务单',prop:"taskNumber"},
                {label:'物料编码',prop:"partCode"},
                {label:'物料名称',prop:"partName"},
                {label:'物料图号',prop:"model"},
                {label:'计划生产量',prop:"planYield"},
                {label:'开始时间',prop:"planStartTime"},
                {label:'结束时间',prop:"planEndTime"},
                {label:'下单人',prop:"createUser"},
                {label:'状态',prop:"partTaskState"},
                {label:'生产用时',prop:"produceDuration"},

            ]
        }
    },
    created(){
        this.getpartTaskPage()
    },
    mounted(){
     
    },
    methods: {
        changetime(val){
            this.seachinfo.beginDate = moment(val[0]).format("YYYY-MM-DD")
            this.seachinfo.endDate = moment(val[1]).format("YYYY-MM-DD")
        },
        // 零件数据分页列表
        getpartTaskPage(){
            let obj = {...this.page,...this.seachinfo}
            partTaskPage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index+1
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
            this.getpartTaskPage()
        },
        //重置
        resetting(){
            this.maintime = ''
            this.seachinfo = {}
            this.page= {current:1,size:10}
            this.getpartTaskPage()
        },
        handleCurrentChange(val){
            this.page.current = val
            this.getpartTaskPage()
        },
        //新增
        add(){
           this.tit = "新增零件"
           this.dialogFormVisible = true   
        },
        close(num){
            this.dialogFormVisible = false
             
            if(num==='0'){
                this.getpartTaskPage()
            }
        },
        detailclose(){
            this.detaVisible = false
        },
        handledistribute(info){
            this.$refs.detailpartModal.getProcessListByPartTaskId(info)
            this.detaVisible = true
        },
         
        // 编辑
        handlededit(info){
            this.tit="修改零件"
            this.$refs.partModal.getdetails(info)
            this.dialogFormVisible = true  
        },
        //删除
        handledDelete(info){
             this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
             })
            .then(() => {
                partTaskDelete(info).then(res=>{
                    if(res.code==='0'){
                        this.$message.success(res.msg)
                        this.getpartTaskPage()
                    }
                })
            })
            .catch(() => {});
            
        },
        //解锁 锁定
        handledlock(info,type){
            updatePartTaskLockById({id:info.id,state:type}).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.getpartTaskPage()
                }
            })
        }
    }
}
</script>


<style lang='less'>
    .partTask{
        height: 100%;
        .top{
                height: 50px;
                margin-top: 10px;
        }
        .page{
            margin-top: 10px;
            float: right;
        }
        // .el-pager li.active{
        //     background-color: #409baF !important;
        //     color: #fff;
        // }
    }

</style>
