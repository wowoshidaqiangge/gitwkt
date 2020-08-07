<template>
  <div class="detailsProduct" v-loading="load" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <slot name="table1"></slot>
    <div class="detailTop">
        <p>产品任务详情</p>
        <el-button type="add" icon="el-icon-back" @click="backpro"> 返回</el-button>
    </div>
    <div class="detailcon">
        <div style="margin-bottom:15px">
            <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">产品任务基本信息</div>
            <div class="infolist">
                <div class="info" v-for="(item,index) in prolist" :key="index">
                    <p><span>{{item.name}}：</span></p>
                    <p :title="item.value" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{item.value}}</p>
                </div>
            </div>
        </div>
        <div style="padding-left:20px">
            <div style="padding:0 0 10px 00px;font-weight:600;font-size:15px">零件清单:</div>
            <el-table
                :data="tablelist"
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
                    <el-table-column label="加工路线"  align="center" >
                        <template slot-scope="scope">
                            <el-button
                                type="success"
                                plain
                                class="red"
                            @click="handleupdate(scope.row,1)"
                            >查看</el-button>
                        </template> 
                    </el-table-column>    
                    <el-table-column label="操作"  align="center" width="80px">
                        <template slot-scope="scope">
                            <el-button
                                type="success"
                                v-if="scope.row.state==1 || scope.row.state==2"
                                plain
                                class="red"
                                icon='el-icon-edit-outline'
                                @click="handledit(scope.row,1)"
                            ></el-button>
                        </template> 
                    </el-table-column>               -->
            </el-table>
        </div>
       
        <div style="padding-left:20px">
            <div style="padding:10px 0 10px 0px;font-weight:600;font-size:15px">装配:</div>
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
                    <el-table-column label="加工路线"  align="center" width="100px">
                        <template slot-scope="scope">
                            <el-button
                                type="success"
                                plain
                                class="red"
                            @click="handleupdate(scope.row,3)"
                            >查看</el-button>
                        </template> 
                    </el-table-column>    
                    <el-table-column label="操作"  align="center" width="80px">
                        <template slot-scope="scope">
                            <el-button
                                type="success"
                                v-if="scope.row.state==1 || scope.row.state==2"
                                plain
                                class="red"
                                icon='el-icon-edit-outline'
                                @click="handledit(scope.row,3)"
                            ></el-button>
                        </template> 
                    </el-table-column>                 
            </el-table>
        </div>
    </div>
    <DetailsModel :detailVisble="detailVisble"  @detailclose='detailclose' ref="detailModal"/>
    <EditModel :editFormVisible="editFormVisible" :tit="tit" @close="close" ref="editmodel"/>
  </div>
</template>
<script>
import DetailsModel from './detailsModal'
import EditModel from './editModel'
import {
     produceTaskdetail,//产品详情
     produceWorkprocessQualityPage,//质检产品单
} from 'api/product'
export default {
    name: 'detailsProduct',
    components:{
        DetailsModel,EditModel
    },
    props:{
     
    },
    data() {
        return {
            load:false,
           tablelist:[],
          tableData:[],
            columnlist:[
               {label:'生产工单',prop:'taskNumber'},
               {label:'物料编码',prop:'partCode'},
               {label:'物料图号',prop:'partNumber'},
               {label:'物料名称',prop:'partName'},
               {label:'规格型号',prop:'model'},
               {label:'数量',prop:'partCount'},
               {label:'类型',prop:'type1'},
               {label:'当前工序',prop:'produceTaskPlanState'},
               {label:'报工数',prop:'reportCount'},
               {label:'合格数',prop:'qualifiedCount'},
               {label:'开始时间',prop:'planStartTime'},
               {label:'结束时间',prop:'planEndTime'},
           ],
           columnlist1:[
               {label:'装配工单',prop:'taskNumber'},
               {label:'物料编码',prop:'partCode'},
               {label:'物料名称',prop:'partName'},
               {label:'规格型号',prop:'model'},
               {label:'数量',prop:'partCount'},
               {label:'当前工序',prop:'produceTaskPlanState'},
               {label:'报工数',prop:'reportCount'},
               {label:'合格数',prop:'qualifiedCount'},
               {label:'开始时间',prop:'planStartTime'},
               {label:'结束时间',prop:'planEndTime'},
           ],
           detailVisble:false,
           editFormVisible:false,
           prolist:[],
           wayinfo:'',
           tit:''
        }
    },
    created(){
       
    },
    mounted(){
       
    },
    watch:{
    
    },
    methods: {
      // 获取详情
      getproduceTaskdetail(info){
          let pro = JSON.parse(JSON.stringify(info))
          this.wayinfo = pro
          let arr = [
              {name:"产品任务单",value:pro.taskNumber},
              {name:"物料编码",value:pro.productCode},
              {name:"物料名称",value:pro.productName},
              {name:"规格型号",value:pro.model},
              {name:"计划产量",value:pro.planYield},
              {name:"开始时间",value:pro.planStartTime},
              {name:"结束时间",value:pro.planEndTime},
              {name:"下单人",value:pro.createUser},
              {name:"状态",value:pro.produceTaskState},
              {name:"生产用时",value:pro.produceDuration},
              {name:"生产部门",value:pro.deptName},
              {name:"备注",value:pro.remark},
          ]
          this.prolist = arr
          this.load =true
          produceTaskdetail({type:1,id:info.id,operateType:'find'}).then(res=>{
              
              if(res.code==='0'){
                   let arr =[]
                   let arr1 =[]
                   res.data.planList.map((item)=>{
                       item.taskNumber = item.taskNumber?item.taskNumber:'--'
                       item.reportCount = item.reportCount?item.reportCount:'--'
                       item.qualifiedCount = item.qualifiedCount?item.qualifiedCount:'--'
                       if(!item.partCount ){
                           item.planEndTime = ''
                           item.planStartTime = ''
                           item.produceTaskPlanState = ''
                       }
                       if(item.type===2 ){
                           item.produceTaskPlanState = ''
                       }
                       if(item.isProduct===0){
                           item.type===1? item.type1="零件" : item.type1="标准件"
                           arr.push(item)
                       }else{
                           arr1.push(item)
                       }
                   })
                   this.tableData = arr1
                   this.tablelist = arr
               }
               this.load = false
          })
      },
      backpro(){
          this.$emit('backpro',false)
      },
      detailclose(){
            this.detailVisble = false 
        },
     
        // 详情
        handleupdate(info,type){
            // this.detailVisble = true
            this.$refs.detailModal.getProcessListByPlanId(info,type,this.prolist)
            this.detailVisble = true
        },
        // 获取最大工号
        getmax(){
            let arr = []
            this.tablelist.map((item,index)=>{
                if(item.taskNumber&&item.taskNumber!=="--"){
                    let v = item.taskNumber.split('_')[2]
                    arr.push({n:item.taskNumber,v:v})
                }
            })
            arr.sort(this.getSortFun('asc','v'))
            return arr
        },
        //  工号排序
        getSortFun(order, sortBy) {
            let ordAlpah = (order == 'asc') ? '>' : '<';
            let sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
            return sortFun;
        },

        handledit(info,type){
            if(type===1){
                this.tit="零件修改"
                let a = this.getmax()
                info.taskNumber1 = a.length>0 ? a[a.length-1].n:this.wayinfo.taskNumber
            }else{
                this.tit="装配修改"
                info.taskNumber1 = this.wayinfo.taskNumber
            }
            
            info.planYield  = this.wayinfo.planYield
            this.$refs.editmodel.getinfo(info,type)
            this.editFormVisible = true
        },
        close(num){

            this.editFormVisible = false
            if(num==='0'){
                this.getproduceTaskdetail(this.wayinfo)
            }
        }
    }
}
</script>


<style lang='less'>
    .detailsProduct{
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
