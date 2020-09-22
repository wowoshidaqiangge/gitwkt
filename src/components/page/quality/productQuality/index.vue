<template>
  <div class="productQuality">
       <div v-if="!isdetails">
           <div class="top">
                    <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
                    <el-row type='flex' justify="end">
                        <div style="flex:1">
                            <!-- <el-button type="add" icon='el-icon-circle-plus-outline' @click="add">新增</el-button> -->
                        </div>
                        <el-col :span="5">
                            <el-form-item label="" prop="value1">
                                <el-date-picker
                                    v-model="maintime"
                                    @change="changetime"
                                    type="daterange"
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
                            <el-form-item label=""  prop="itemNameOrCode" >
                                <el-input  placeholder="请输入产品名称或编码" v-model="seachinfo.itemNameOrCode" class="elinput"> </el-input>
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
                        <el-table-column label="查看" align="center">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="add"
                                            plain
                                            v-if="$_has('PRODUCTQUALITYOPERATION')"
                                            class="red"
                                            @click="handledistribute( scope.row)"
                                        >加工路线</el-button>
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

  </div>
</template>
<script>
import Detailsproduct from './detailsProduct'
import {produceTaskPlanpage} from 'api/product'
import moment from 'moment'
export default {
    name: 'productQuality',
    components:{
      Detailsproduct
    },
    data() {
        return {
            isdetails:false,
            seachinfo:{
            },
            dialogFormVisible:false,
            tit:'新增',
            page:{
                current:1,
                size:10,
                type:3
            },
             options:[
                {label:"未派单",value:1},
                {label:"未领单",value:2},
                {label:"零件生产",value:3},
                {label:"装配",value:4},
                {label:"已完工",value:5},
                {label:"已锁定",value:6}
              
            ],
            maintime:'',
            pagesize:1,
            totals:0,
            tableData:[],
            columnlist:[
                {label:'序号',prop:"index"},
                {label:'生产部门',prop:"deptName"},
                {label:'装配工单',prop:"taskNumber"},
                {label:'物料编码',prop:"itemCode"},
                {label:'物料名称',prop:"itemName"},
                {label:'规格型号',prop:"model"},
                {label:'计划生产量',prop:"planYield"},
                {label:'开始时间',prop:"planStartTime"},
                {label:'结束时间',prop:"planEndTime"},
                {label:'下单人',prop:"createUser"},
                {label:'状态',prop:"produceTaskPlanState"},
                {label:'生产用时',prop:"produceDuration"},
            ]
        }
    },
    created(){
        this.getproduceTaskPlanpage()
    },
    mounted(){

    },
    methods: {
        // 产品质检列表
        getproduceTaskPlanpage(){
            let obj = {...this.seachinfo,...this.page}
            produceTaskPlanpage(obj).then(res=>{
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
            this.page.current =1
            this.getproduceTaskPlanpage()
        },
        //重置
        resetting(){
            this.page.current =1
            this.seachinfo = {}
            this.maintime = ''
            this.getproduceTaskPlanpage()
        },
        //分页
        handleCurrentChange(val){
            this.page.current = val
            this.getproduceTaskPlanpage()
        },
        // 操作
        handledistribute(info){
            this.isdetails = true
             setTimeout(()=>{
                 this.$refs.proDetails.getproduceTaskdetail(info)
            },100)
        },
        backpro(){
            this.isdetails = false
            this.getproduceTaskPlanpage()
        },
        changetime(val){
            this.seachinfo.beginDate = moment(val[0]).format("YYYY-MM-DD")
            this.seachinfo.endDate = moment(val[1]).format("YYYY-MM-DD")
        },
       
    }
}
</script>


<style lang='less'>
    .productQuality{
        height: 99%;
        .top{
                height: 50px;
                margin-top: 10px;
        }
        .page{
            margin-top: 10px;
            float: right;
        }
     
    }

</style>
