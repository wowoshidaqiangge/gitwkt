<template>
  <div class="guideTask">
       <div class="top">
            <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <el-row type='flex' justify="end">
                <div style="flex:1">
                    <el-button type="add" icon='el-icon-circle-plus-outline' v-if="$_has('GUIDETASKADD')" @click="add">新增</el-button>
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
                <el-table-column label="路线" align="center" >
                            <template slot-scope="scope">
                                <el-button
                                    type="danger"
                                    v-if="$_has('GUIDETASKDETAIL')"
                                    plain
                                    class="red"
                                    @click="handledistribute( scope.row)"
                                >查看</el-button>
                            </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250px">
                            <template slot-scope="scope">
                                <el-button
                                    type="add"
                                    v-if="scope.row.state==='6' && $_has('GUIDETASKUNLOCK')"
                                    plain
                                    @click="handledlock(scope.row,7)"
                                >解锁</el-button>
                                <el-button
                                    type="add"
                                    v-if="scope.row.state!='6'&&scope.row.state!='5' && $_has('GUIDETASKLOCK') "
                                    plain
                                    @click="handledlock(scope.row,6)"
                                >锁定</el-button>
                                <el-button
                                    type="add"
                                    v-if="(scope.row.state==='1'||scope.row.state==='2') && $_has('GUIDETASKUPDATE')"
                                    plain
                                    @click="handlededit(scope.row)"
                                >编辑</el-button>
                                <el-button
                                    type="add"
                                    plain
                                     v-if="(scope.row.state==='1'||scope.row.state==='2') &&$_has('GUIDETASKDELETE')"
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
     <DetailsModel :detailVisble="detailVisble"  @detailclose='detailclose' :isdaogui="isdaogui" ref="detailpartModal"/>
    <Modal :dialogFormVisible="dialogFormVisible" :tit="tit" @close='close' ref="guiModal"/>
  </div>
</template>

<script>
import Modal from './modal'
import DetailsModel from './detailsModal'
import {produceTaskPage,updateProduceTaskLockById,produceTaskDelete} from 'api/product'
import moment from 'moment'
export default {
    name: 'guideTask',
    components:{
        Modal,DetailsModel
    },
    data() {
        return {
            seachinfo:{
            },
            dialogFormVisible:false,
            tit:'新增导轨',
            page:{
                current:1,
                size:10,
                type:2
            },
            options:[
                {label:"未派单",value:1},
                {label:"未领单",value:2},
                {label:"生产中",value:3},
                // {label:"装配",value:4},
                {label:"已完工",value:5},
                {label:"已锁定",value:6}
            ],
            maintime:'',
            pagesize:1,
            totals:0,
            tableData:[],
            columnlist:[
                {label:'序号',prop:"index",width:"50px"},
                {label:'生产部门',prop:"deptName"},
                {label:'任务单',prop:"taskNumber"},
                {label:'物料编码',prop:"productCode"},
                {label:'物料名称',prop:"productName"},
                {label:'规格型号',prop:"model"},
                {label:'计划生产量',prop:"planYield"},
                {label:'开始时间',prop:"planStartTime"},
                {label:'结束时间',prop:"planEndTime"},
                {label:'下单人',prop:"createUser"},
                {label:'生产用时',prop:"produceDuration"},
                {label:'状态',prop:"produceTaskState"},
                // {label:'备注',prop:"remark"},

            ],
            detailVisble:false,
            isdaogui:false
        }
    },
    created(){
        this.getproduceTaskPage()
    },
    mounted(){

    },
    methods: {
        //
        changetime(val){
            this.seachinfo.beginDate = moment(val[0]).format("YYYY-MM-DD")
            this.seachinfo.endDate = moment(val[1]).format("YYYY-MM-DD")
        },
        detailclose(){
            this.detailVisble = false
        },
        handledistribute(info){
            this.detailVisble = true
           
            if(info.productTypeId=='4'){
                this.isdaogui = true
            }else{
                this.isdaogui = false
            }
            this.$refs.detailpartModal.getProcessListByPlanId(info)
            
        },
        // 导轨任务分页查询
        getproduceTaskPage(){
            let obj = {...this.seachinfo,...this.page}
            produceTaskPage(obj).then(res=>{
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
            this.getproduceTaskPage()
        },
        //重置
        resetting(){
            this.page={
                current:1,
                size:10,
                type:2
            }
            this.maintime = ""
            this.seachinfo = {}
            this.getproduceTaskPage()
        },

        //新增
        add(){
            this.tit="新增导轨"
            this.dialogFormVisible = true   
        },
        close(num){
            this.dialogFormVisible = false
            if(num==='0'){
                this.getproduceTaskPage()
            }
        },
        // 分页
        handleCurrentChange(val){
            this.page.current = val
            this.getproduceTaskPage()
        },
        //编辑
        handlededit(info){
            this.tit = '修改导轨'
            this.dialogFormVisible = true
            this.$refs.guiModal.getdetails(info)
        },
        //解锁
        handledlock(num,state){
            let obj ={id:num.id,type:2,state:state}
            updateProduceTaskLockById(obj).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.getproduceTaskPage()
                }
            })
        },
        // 删除
         handledDelete(info){
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
            .catch(() => {});
           
        },
    }
}
</script>


<style lang='less'>
    .guideTask{
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
