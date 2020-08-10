<template>
  <div class="detailsProduct3">
    <div class="detailTop">
        <p>导轨质检--操作</p>
        <el-button type="add" icon="el-icon-back" @click="backpro"> 返回</el-button>
    </div>
    <div class="detailcon">
        <div style="margin-bottom:15px">
            <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">导轨基本信息</div>
            <div class="infolist">
                <div class="info" v-for="(item,index) in prolist" :key="index">
                    <p><span>{{item.name}}：</span></p>
                    <p>{{item.value}}</p>
                </div>
               
            </div>
        </div>
        <div >
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
                        <el-table-column
                                    prop="taskNumber"
                                    label="生产工单号"
                                    align="center"
                               
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
                        <el-table-column label="操作" align="center" width="80px">
                                        <template slot-scope="scope">
                                            <el-button
                                                type="add"
                                                v-if="(scope.row.produceState==1 || isall)&&scope.row.workprocessType!=3"
                                                plain
                                                icon="el-icon-edit"
                                                @click="handledit(scope.row)"
                                            ></el-button>
                                        </template>
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
                        <el-table-column
                                    prop="taskNumber"
                                    label="生产工单号"
                                    align="center"
                               
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
                        <el-table-column label="操作" align="center" width="80px">
                        
                                        <template slot-scope="scope">
                                            <el-button
                                                type="add"
                                                v-if="(scope.row.produceState==1 || isall)&&scope.row.workprocessType!=3&&scope.row.workprocessType!=6"
                                                plain
                                                icon="el-icon-edit"
                                                @click="handledit1(scope.row)"
                                            ></el-button>
                                            <el-button
                                                type="add"
                                                v-if=" (scope.row.produceState==1 || isall)&&scope.row.workprocessType!=3&&scope.row.workprocessType==6"
                                                plain
                                                icon="el-icon-edit"
                                                @click="handledit2(scope.row)"
                                            ></el-button>
                                        </template>
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
    </div>
    <DetailsModel :detailVisble="detailVisble"  @detailclose='detailclose' ref="detailModal"/>
    <XgdetailModel :xgdetailVisble="xgdetailVisble" @xgclose="xgclose" ref="Xgdetail" :isover="isover"/>
    <SyndetailModel :syndetailVisble="syndetailVisble" @synclose="synclose" ref="Syndetail"/>
  </div>
</template>
<script>
import DetailsModel from '../detailmodel'
import XgdetailModel from './xgdetailmodel'
import SyndetailModel from './syndetailmodel'
import {handle} from '@/utils/util'
import {
    getProcessListByPlanId
} from 'api/product'
export default {
    name: 'detailsProduct3',
    components:{
        DetailsModel,XgdetailModel,SyndetailModel
    },
    props:{
        isdaogui:{
            type:Boolean
        }
    },
    data() {
        return {
            syndetailVisble:false,
            xgdetailVisble:false,
           tablelist:[],
           tableData:[], 
            columnlist:[
                {label:'派工人员',prop:'assignUser',},
                {label:'派工日期',prop:'createTime'},
                {label:'设备编号',prop:'deviceNumber'},
                {label:'工作人员',prop:'assignUser',},
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
                {label:'完成时间',prop:'finishTime'}
            ],
            columnlist3:[
                {label:'工作人员',prop:'assignUser',width:"80px"},
                {label:'派件数量',prop:'assignCount',width:"80px"},
            ],
            columnlist4:[
                {label:'实际完成数量',prop:'realityCount',width:"80px"},
                {label:'合格数量',prop:'qualified',width:"80px"},
                {label:'不合格数量',prop:'unQualified',},
                {label:'P级数量',prop:'pNums'},
                {label:'H级数量',prop:'hNums',},
                {label:'C级数量',prop:'cNums',},
                {label:'报废数量',prop:'scrap',},
                {label:'补',prop:'supplement',},
                {label:'不合格原因',prop:'remark',},
            ],
            columnlist5:[
                {label:'巡检',prop:'secondcheckaExamUser',width:"70px"},
                {label:'完检',prop:'finishcheckExamUser',width:"70px"},
                {label:'完成时间',prop:'finishTime'}
            ],
           detailVisble:false,
           prolist:[],
           page:{
               current:1,
               size:10,
               type:2
           },
           pagesize:1,
           totals:0,
           
           wayinfo:'',
           isall:false,
           isover:false
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    watch:{
    
    },
    methods: {
      isalltrue(){
          let arr = []
            this.tablelist.map((item)=>{
               if(item.workprocessType!=3){
                   arr.push(item)
               }
            })
            let a = arr.filter(v=>v.produceState==1)
            if(a.length===arr.length-1){
                this.isall = true
            }
      },
      // 获取详情
      getproduceTaskdetail(info){
          let pro = JSON.parse(JSON.stringify(info))
          this.wayinfo = pro
          let arr = [
              {name:"产品任务单",value:pro.taskNumber},
              {name:"物料编码",value:pro.itemCode},
              {name:"物料名称",value:pro.itemName},
              {name:"规格型号",value:pro.model},
              {name:"计划产量",value:pro.planYield},
              {name:"开始时间",value:pro.planStartTime},
              {name:"结束时间",value:pro.planEndTime},
              {name:"下单人",value:pro.createUser},
              {name:"状态",value:pro.produceTaskPlanState},
              {name:"生产用时",value:pro.produceDuration},
              {name:"生产部门",value:pro.deptName},
              {name:"备注",value:pro.remark},
          ]
          this.prolist = arr
          getProcessListByPlanId({...this.page,produceTaskPlanId:pro.produceTaskPlanId}).then(res=>{
              if(res.code==='0'){
                //   let index1 = 0
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
                            }else{
                                 if(this.isdaogui){
                                        if(item.qualified!==undefined){
                                            item.qualified = '--'
                                        }
                                        if(item.unQualified!==undefined){
                                            item.unQualified = '--'
                                        }
                                    }
                            }
                        }else{
                            if(item.qualified!==undefined){
                                item.qualified = '--'
                            }
                            if(item.unQualified!==undefined){
                                item.unQualified = '--'
                            }
                           
                        }
                  })
                  this.pagesize = parseInt(res.data.current)
                  this.totals = parseInt(res.data.total)
                  this.tablelist =  res.data.records
                  this.isalltrue()
               }
          })
      },
      handleCurrentChange(val){
          this.page.current = val
          this.getproduceTaskdetail(this.wayinfo)
      },
      backpro(){
          this.$emit('backpro',false)
      },
      detailclose(num){
            this.detailVisble = false 
            if(num==='0'){
                this.getproduceTaskdetail(this.wayinfo)
            }
        },
        // 详情
        handledit(info){
            // this.detailVisble = true
            // this.$refs.detailModal.getProcessListByPlanId(info)
            if(info.workprocessType==5&&info.workprocessName==='完工'){
                this.$refs.detailModal.enterinfo(info,4,this.wayinfo)
            }else{
                 this.$refs.detailModal.enterinfo(info,4,this.wayinfo,2)
            }
           
            this.detailVisble = true

        },
        //导轨详情
        handledit1(info){
           
            this.xgdetailVisble = true
            // 修改完工质检的样式
            if(info.workprocessType==5&&info.workprocessName==='完工'){
                this.isover = true
            }else{
                this.isover = false
            }
            this.$refs.Xgdetail.getall(info,this.wayinfo)
        },
        xgclose(num){
            this.xgdetailVisble = false
            if(num==='0'){
                this.getproduceTaskdetail(this.wayinfo)
            }
        },
        //综合检验
        handledit2(info){
            this.syndetailVisble = true
            this.$refs.Syndetail.getall(info,this.wayinfo)
        },
        synclose(num){
            this.syndetailVisble = false
            if(num==='0'){
                this.getproduceTaskdetail(this.wayinfo)
            }
        }
    }
}
</script>


<style lang='less'>
    .detailsProduct3{
       width: 100%;
       height:99%;
       border:1px solid #ccc;
       border-radius: 3px;
       overflow: auto;
       .detailTop{
           height: 50px;
           background: rgb(230,235,241);
           padding: 0 10px;
           display: flex;
           align-items: center;
           p{
               flex: 1;
               color:rgb(50,25,112);
               font-weight: 600;
           }
       }
       .page1{
          text-align: end;
          margin-top: 10px;
       }
       .detailcon{
           padding: 10px 20px;
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
    }
</style>
