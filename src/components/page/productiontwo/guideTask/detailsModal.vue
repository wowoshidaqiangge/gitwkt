<template>
  <div class="detailsmodal">
    <el-dialog 
    title="加工路线详情" 
    :destroy-on-close='isclose'
    :visible.sync="detailVisble"
    width='81%' 
    :before-close='beforclose' 
    center>
        <div class="detailinfo">
            <div style="margin-bottom:15px">
                <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">产品任务基本信息
                    <span style="float:right"><el-button type="add" @click="handleExcel">EXCEL导出</el-button></span>
                </div>
                <div class="infolist">
                    <div class="info" v-for="(item,index) in prolist" :key="index">
                        <p><span>{{item.name}}:</span></p>
                        <p>{{item.value}}</p>
                    </div>
                    <div class="info">
                        <p><span>质检记录:</span></p>
                        <p><el-button
                            type="add"
                            size="mini" 
                            @click="looktest"
                        >查看</el-button></p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div v-if="!isdaogui">
                <el-table
                    :data="tablelist"
                    stripe
                    border                     
                    >
                         <el-table-column
                                    prop="index"
                                    label="序号"
                                    align="center"
                                    width="50px"
                            >
                            </el-table-column>
                        <el-table-column label="加工内容" align="center">
                            <el-table-column
                                    prop="workKind"
                                    label="工种"
                                    align="center"
                            >
                            </el-table-column> 
                            <el-table-column
                                    prop="workprocessName"
                                    label="工序"
                                    align="center"
                            >
                            </el-table-column> 
                        </el-table-column>
                        <el-table-column
                            v-for="(item,index) in columnlist"
                            :key="index"
                            :width="item.width"
                            :prop="item.prop"
                            :label="item.label"
                            align="center"
                        >
                        </el-table-column> 
                        <el-table-column label="质量检验结果(件)" align="center">
                            <el-table-column
                                v-for="(item,index) in columnlist1"
                                :key="index+50"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                            <el-table-column label="首检" align="center">
                                <el-table-column
                                    prop="firstcheckSquadUser"
                                    label="班组长"
                                    align="center"
                                    width="70px"
                                >
                                </el-table-column> 
                                <el-table-column
                                        prop="firstcheckExamUser"
                                        label="检验员"
                                        align="center"
                                    width="70px"
                                >
                                </el-table-column> 
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in columnlist2"
                                :key="index+100"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                        </el-table-column>
                </el-table>
            </div>
            <div v-if="isdaogui"> 
                <el-table
                    :data="tablelist"
                    stripe
                    border                     
                    >
                        <el-table-column
                                    prop="index"
                                    label="序号"
                                    align="center"
                                width="50px"
                            >  
                        </el-table-column>  
                        <!-- <el-table-column
                                    prop="taskNumber"
                                    label="生产工单号"
                                    align="center"
                               
                            >  
                        </el-table-column>   -->
                         
                        <el-table-column label="加工内容" align="center">
                            <el-table-column
                                    prop="workKind"
                                    label="工种"
                                    align="center"
                                   
                            >
                            </el-table-column> 
                            <el-table-column
                                    prop="workprocessName"
                                    label="工序"
                                    align="center"
                                   
                            >
                            </el-table-column> 
                        </el-table-column>
                        <el-table-column
                            v-for="(item,index) in columnlist3"
                            :key="index"
                            :width="item.width"
                            :prop="item.prop"
                            :label="item.label"
                            align="center"
                        >
                        </el-table-column> 
                        <el-table-column label="质量检验结果(件)" align="center">
                            <el-table-column
                                v-for="(item,index) in columnlist4"
                                :key="index+50"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                            <el-table-column label="首检" align="center">
                                <el-table-column
                                    prop="firstcheckSquadUser"
                                    label="班组长"
                                    align="center"
                                    width="70px"
                                >
                                </el-table-column> 
                                <el-table-column
                                        prop="firstcheckExamUser"
                                        label="检验员"
                                        align="center"
                                    width="70px"
                                >
                                </el-table-column> 
                            </el-table-column>
                            <el-table-column
                                v-for="(item,index) in columnlist5"
                                :key="index+100"
                                :width="item.width"
                                :prop="item.prop"
                                :label="item.label"
                                align="center"
                            >
                            </el-table-column> 
                        </el-table-column>
                        
                </el-table>
            </div>
            <div class="page1">
                <el-pagination
                    :background='true'
                    :current-page.sync="pagesize"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="totals">
                </el-pagination>
            </div>
        </div>
         <el-dialog
                    width="45%"
                    title="产品测试记录单"
                    :visible.sync="innerVisible"
                    append-to-body>
                     <el-row>
                        <el-form :model="form1" :rules="rules1"  ref="form1">
                            <el-col :span="11">
                                <el-form-item label="数量" :label-width="formLabelWidth"  prop="partCount">
                                        <el-input v-model="form1.partCount" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11"> <el-button type="add" >查看</el-button></el-col>
                        </el-form>
                    </el-row>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="innerVisible=false">取 消</el-button>
                        <el-button type="primary" @click="marksure1('form1')" >确 定</el-button>
                    </div>
             </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import {getProcessListByPlanId} from 'api/product'
import {export2Excel1,multiHeader,tHeader,multiHeader2,merges,handle,getBlob, saveAs } from '@/utils/util.js';
export default {
    name:"guidedetails",
    props:{
      detailVisble:{
          type:Boolean
      },
      isdaogui:{
          type:Boolean
      }
    },
    data() {
        return {
            data:[],
            isclose:true,
            tablelist:[],
            formLabelWidth:'80px',
            columnlist:[
                {label:'派工人员',prop:'assignUser',width:"70px"},
                {label:'派工日期',prop:'createTime'},
                {label:'设备编号',prop:'deviceNumber'},
                {label:'工作人员',prop:'createUser',width:"70px"},
                {label:'结算方式',prop:'accountType1',width:"50px"},
                {label:'计时工价',prop:'timePrice',width:"50px"},
                {label:'计时时间',prop:'manHour',width:"50px"},
                {label:'派件数量',prop:'assignCount',width:"50px"},
            ],
            columnlist1:[
                {label:'工废',prop:'industrialWaste',width:"50px"},
                {label:'料废',prop:'scrapWaste',width:"50px"},
                {label:'让步工H',prop:'concessionWork',width:"50px"},
                {label:'降级工C',prop:'relegationWork',width:"50px"},
                {label:'让步料H',prop:'concessionMaterial',width:"50px"},
                {label:'降级料C',prop:'relegationMaterial',width:"50px"},
                {label:'合格P',prop:'qualified',width:"50px"},
                {label:'补',prop:'supplement',width:"50px"},
            ],
            columnlist2:[
                {label:'巡检',prop:'secondcheckaExamUser',width:"70px"},
                {label:'完检',prop:'finishcheckExamUser',width:"70px"},
                {label:'CPK值',prop:'cpkValue',width:"50px"},
                {label:'完成时间',prop:'finishTime'},
               
            ],
            columnlist3:[
                {label:'工作人员',prop:'createUser',width:"80px"},
                {label:'设备编号',prop:'deviceNumber'},
                {label:'派件数量',prop:'assignCount',width:"80px"},
            ],
            columnlist4:[
                {label:'实际完成数量',prop:'realityCount',width:"80px"},
                {label:'合格数量',prop:'qualified',width:"80px"},
                {label:'不合格数量',prop:'unQualified',},
                {label:'P级数量',prop:'pNums',width:"70px"},
                {label:'H级数量',prop:'hNums',width:"70px"},
                {label:'C级数量',prop:'cNums',width:"70px"},
                {label:'报废数量',prop:'scrap',width:"70px"},
                {label:'补',prop:'supplement',width:"70px"},
                {label:'不合格原因',prop:'remark',},
            ],
            columnlist5:[
                {label:'巡检',prop:'secondcheckaExamUser',width:"70px"},
                {label:'完检',prop:'finishcheckExamUser',width:"70px"},
                {label:'完成时间',prop:'finishTime'}
            ],
            innerVisible:false,
            form1:{},
            rules1:{},
            prolist:[],
            page:{
                current:1,
                size:10,
                type:2
            },
            pagesize:1,
            totals:0,
            wayinfo:''
        }
    },
    created(){
 
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        // 加工路线
        getProcessListByPlanId:async function(info){
             let pro = JSON.parse(JSON.stringify(info))
             this.wayinfo = pro
             let arr = [
                    {name:"生产工单",value:pro.taskNumber},
                    {name:"物料编码",value:pro.productCode},
                    {name:"物料名称",value:pro.productName},
                    {name:"规格型号",value:pro.model},
                    {name:"计划产量",value:pro.planYield},
                    {name:"开始时间",value:pro.planStartTime},
                    {name:"结束时间",value:pro.planEndTime},
                    // {name:"发料人",value:pro.createUser},
                    {name:"状态",value:pro.produceTaskState},
                    {name:"生产部门",value:pro.deptName},
                    {name:"备注",value:pro.remark},
                ]
                this.prolist = arr
                let obj ={
                    ...this.page,id:info.id
                }
                await getProcessListByPlanId(obj).then(res=>{
                        if(res.code==='0'){
                            handle(res.data.records)
                            res.data.records.map((item,index)=>{
                                if(item.workprocessType!=6){
                                    if(item.workprocessType!=5){
                                        if(item.pNums!==undefined){
                                            item.pNums = '--'
                                        }
                                        if(item.hNums!==undefined){
                                            item.hNums = '--'
                                        }
                                        if(item.cNums!==undefined){
                                            item.cNums = '--'
                                        }
                                    }
                                }else{

                                    if(item.qualified!==undefined){
                                        item.qualified = '--'
                                    }
                                    if(item.unQualified!==undefined){
                                        item.unQualified = '--'
                                    }
                                    if(item.remark!==undefined){
                                        item.remark = '--'
                                    }
                                
                                }
                            })
                            this.pagesize = parseInt(res.data.current)
                            this.totals = parseInt(res.data.total)
                            this.tablelist =  res.data.records
                        }
                })
        },
        handleExcel() {
            const filterVal = ['workKind','workprocessName','assignUser','creatTime','deviceNumber','createUser',"accountType","timePrice","assignCount",
            "industrialWaste","scrapWaste","concessionWork","relegationWork","concessionMaterial","relegationMaterial","qualified","supplement",
            "firstcheckSquadUser","firstcheckExamUser","secondcheckaExamUser","finishcheckExamUser","cpkValue","finishTime"]
            export2Excel1(tHeader, this.tablelist, '产品任务加工路线详情',filterVal,multiHeader,multiHeader2,merges);
        },
        looktest(){
            // this.innerVisible = true
             if(!this.wayinfo.workprocesscheckBillUrl){
                this.$message.error('暂无文件')
                return
            }
            getBlob(this.wayinfo.workprocesscheckBillUrl).then(blob => {
                saveAs(blob, this.wayinfo.workprocesscheckBillName);
            });
        },
       close(){
           this.init()
           this.$emit('detailclose',false)
       },
       //初始化
       init(){
          this.checklist = []
       },
       marksure(ruleForm){
       },
       marksure1(){
       },
       handleCurrentChange(val){
           this.page.current = val 
           this.getProcessListByPlanId(this.wayinfo)
       },
       beforclose(){
          this.init()
          this.$emit('detailclose',false)
       },
      
    }
}
</script>

<style lang='less'>
    .detailsmodal{
        .page1{
            text-align: end;
            margin-top:10px;
        }
        .detailinfo{
           p{
               height: 35px;
               line-height: 35px;
           }
           .infolist{
               display: flex;
               flex-wrap: wrap;
               .info{
                   width: 25%;
                   display: flex;

                   p{
                       flex:1
                   }
               }
               .info p:nth-of-type(1){
                   text-align: end;
                   span{
                       margin-right: 15px;
                   }

               } 
              
           }
        }
        // .el-form-item__label{
        //     width: 80px !important;
        // }
    
    }
</style>
