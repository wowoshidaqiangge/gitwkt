<template>
  <div class="detailsProduct1">
    <slot name="table1"></slot>
    <div class="detailTop">
        <p>产品质检--操作</p>
        <el-button type="add" icon="el-icon-back" @click="backpro"> 返回</el-button>
    </div>
    <div class="detailcon">
        <div style="margin-bottom:15px">
            <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">产品基本信息</div>
            <div class="infolist">
                <div class="info" v-for="(item,index) in prolist" :key="index">
                    <p><span>{{item.name}}：</span></p>
                    <p>{{item.value}}</p>
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
                    <el-table-column label="操作" align="center" width="80px">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="add"
                                            v-if="(scope.row.produceState==1 || isall)&& scope.row.workprocessType!=3"
                                            plain
                                            icon="el-icon-edit"
                                            @click="handledit( scope.row)"
                                        ></el-button>
                                    </template>
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
    </div>
    <DetailsModel :detailVisble="detailVisble"  @detailclose='detailclose' ref="detailModal"/>
  </div>
</template>
<script>
import DetailsModel from '../detailmodel'
import {handle} from '@/utils/util'
import {
    getProcessListByPlanId
} from 'api/product'
export default {
    name: 'detailsProduct1',
    components:{
        DetailsModel
    },
    props:{
     
    },
    data() {
        return {
           tablelist:[],
          tableData:[],
            columnlist:[
                {label:'派工人员',prop:'assignUser',},
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
           detailVisble:false,
           prolist:[],
           page:{
               current:1,
               size:10,
               type:3
           },
           totals:0,
           pagesize:1,
           wayinfo:{},
           isall:false
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    watch:{
    
    },
    methods: {
         getall(){
            let arr = []
            this.tablelist.map((item)=>{
               if(item.workprocessType!=3){
                   arr.push(item)
               }
            })
            let a = arr.filter(v=>v.produceState==1)
            if(a.length===arr.length-1){
                // debugger
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
                   handle(res.data.records)
                   this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                    
                   this.tablelist =  res.data.records
                   this.getall()
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
        handledit(info,type){
            this.$refs.detailModal.enterinfo(info,2,this.wayinfo,2)
            this.detailVisble = true
        },
    }
}
</script>


<style lang='less'>
    .detailsProduct1{
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
           margin-top:10px;
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
