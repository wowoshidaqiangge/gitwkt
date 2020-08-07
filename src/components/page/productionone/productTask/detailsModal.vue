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
                <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">{{recordtitle}}
                    <span style="float:right"><el-button type="add" @click="handleExcel">EXCEL导出</el-button></span>
                </div>
                <div class="infolist">
                    <div class="info" v-for="(item,index) in prolist" :key="index">
                        <p><span>{{item.name}}：</span></p>
                        <p :title="item.value" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{item.value}}</p>
                    </div>
                    <div class="info">
                        <p><span>{{recording}}：</span></p>
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
                                width="70px"
                                align="center"
                            >
                            </el-table-column> 
                            <el-table-column
                                    prop="firstcheckExamUser"
                                    label="检验员"
                                     width="70px"
                                    align="center"
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
    name: 'detailsmodal',
    props:{
      detailVisble:{
          type:Boolean
      },
    },
    data() {
        return {
            recording:'',
            recordtitle:"",
            data:[],
            isclose:true,
            tablelist:[],
            formLabelWidth:'80px',
            columnlist:[
                {label:'派工人员',prop:'assignUser',width:"50px"},
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
            innerVisible:false,
            form1:{},
            rules1:{},
            page:{
                current:1,
                size:10
            },
            pagesize:1,
            totals:0,
            prolist:[],
            wayinfo:'',
            waytype:'',
        }
    },
    created(){
        
    },
    mounted(){
     
    },
    watch:{
    
    },
    methods: {
        handleExcel() {
            const filterVal = ['workKind','workprocessName','assignUser','creatTime','deviceNumber','createUser',"accountType","timePrice","assignCount",
            "industrialWaste","scrapWaste","concessionWork","relegationWork","concessionMaterial","relegationMaterial","qualified","supplement",
            "firstcheckSquadUser","firstcheckExamUser","secondcheckaExamUser","finishcheckExamUser","cpkValue","finishTime"]
            export2Excel1(tHeader, this.tablelist, '产品任务加工路线详情',filterVal,multiHeader,multiHeader2,merges);
        },
        // 加工路线
        getProcessListByPlanId: async function(info,type,list){
            debugger
            let pro = JSON.parse(JSON.stringify(info))
            let arr = [
                {name:'物料编码',value:pro.partCode},
                {name:'物料名称',value:pro.partName},
                {name:'规格型号',value:pro.model},
                {name:'物料图号',value:pro.partNumber},
                {name:'计划产量',value:pro.partCount},
                {name:'开始时间',value:pro.planStartTime},
                {name:'结束时间',value:pro.planEndTime},
                {name:'状态',value:pro.produceTaskPlanState},
                
               
            ]
            if(type===1){
                this.recording="质检记录"
                this.recordtitle="零件基本信息"
               
                arr.unshift({name:'零件生产工单',value:pro.taskNumber})
            }else{
                this.recording="产品测试单"
                this.recordtitle="装配基本信息"
              
                arr.unshift({name:'产品装配工单',value:pro.taskNumber})
            }
            let obj ={
                ...this.page,produceTaskPlanId:info.produceTaskPlanId,type:type
            }
            
            this.wayinfo = pro
            this.waytype = type
            this.prolist = arr
           await getProcessListByPlanId(obj).then(res=>{
                if(res.code==='0'){
                    handle(res.data.records)
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                   
                    this.tablelist =  res.data.records
                }
            })
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
          this.tablelist = []
       },
      
       marksure(ruleForm){
           
       },
       marksure1(){

       },
       beforclose(){
          this.init()
          this.$emit('detailclose',false)
       },
       handleCurrentChange(val){
           this.page.current = val
           this.getProcessListByPlanId(this.wayinfo,this.waytype,this.prolist)
       }
      
    }
}
</script>


<style lang='less'>
    .detailsmodal{
        .page1{
            margin-top: 10px;
            text-align: end;
        }
        .el-pager li.active{
            background-color: #409baF !important;
            color: #fff;
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
