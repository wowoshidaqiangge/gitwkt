<template>
  <div class="devicerepair">
      <div class="top">
         
        <el-form :model="terms"  ref="terms"  class="demo-ruleForm">
             <el-row type="flex" justify="end">
              <div style="flex:1">
                  
                  <el-col :span="3">
                        <el-form-item prop="yearParam" style="margin-left:15px">
                                <el-date-picker
                                    v-model="terms.yearParam"
                                        @change="changeyear"
                                        class="datetime"
                                        type="year" format="yyyy"
                                        placeholder="选择年份">
                                </el-date-picker>
                            </el-form-item>
                    </el-col>
                    <el-col :span="3" style="margin:0 20px">
                        <el-form-item label="" prop='toType'  >
                                <el-select v-if="roleId==1||roleId==0" v-model="terms.toType"   @change='changeselcet' placeholder="选择部门" style="width:100%">
                                    <el-option v-for="item in deviceList" :label="item.enumValue" :key='item.enumKey' :value="item.enumKey"></el-option>
                                </el-select>
                            </el-form-item>
                    </el-col>
                    <el-col :span="4" >
                        <el-form-item label="" prop='deviceId' >
                            <el-select v-model="terms.deviceId"  clearable filterable placeholder="选择设备">
                                    <el-option v-for="item in stateArr" :label="item.deviceName" :key='item.deviceId' :value="item.deviceId"></el-option>
                                </el-select>
                            </el-form-item>
                        
                    </el-col>
              </div>
               
              <div>
                     <el-button type="primary" @click="onReset" style="float:right;margin-left:10px">重置</el-button>
                     <el-button type="danger" @click="onSubmit" style="float:right">查询</el-button>
              </div>
            </el-row>
        </el-form>
          
     </div>
      
       <div class="titimg">
           <p>
                <span v-if='isshow'><img src="~@/assets/img/circle.png"/> 维修</span>
                <span  v-if='isshow'><img src="~@/assets/img/nocircle.png"/> 待维修</span>
           </p>
            
             <span class="tit"> 设备年度维修情况</span>
       </div>
      <div class="bot">
           <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="图形" name="first">
                    <el-table
                        :data="tableData"
                        :height="tableHeight"
                        border
                        v-loading='isload'
                        element-loading-text="加载中..."
                        element-loading-spinner="el-icon-loading"
                        style="width: 100%">
                        <el-table-column
                            prop="deviceName"
                            label="名称"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="deviceNumber"
                            label="设备编号"
                        >
                        </el-table-column>
                        <el-table-column
                            v-for="(item,index) in columnlist"
                            :key="index"
                            :index='index'
                            :prop="item.prop"
                            :label="item.label"
                            align="center"
                            >
                            <template slot-scope="scope">
                                <p>
                                    <img  v-if="scope.row.deviceRepairList[scope.column.index]&&(scope.row.deviceRepairList[scope.column.index].isRepairCount!==0)" src="~@/assets/img/circle.png"/>
                                <span v-if="scope.row.deviceRepairList[scope.column.index].isRepairCount > 0"> X {{scope.row.deviceRepairList[scope.column.index].isRepairCount}}</span>
                                </p>
                                <p>
                                    <img  v-if="scope.row.deviceRepairList[scope.column.index]&&(scope.row.deviceRepairList[scope.column.index].unRepairCount!==0)" src="~@/assets/img/nocircle.png" />
                                <span v-if="scope.row.deviceRepairList[scope.column.index].unRepairCount > 0"> X {{scope.row.deviceRepairList[scope.column.index].unRepairCount}}</span>
                                </p>
                                <!-- <img  v-if="scope.row.deviceRepairList[scope.column.index]&&(scope.row.deviceRepairList[scope.column.index].state.split(',').findIndex(v=> v=='1')!==-1)" src="~@/assets/img/circle.png"/> -->
                                <!-- <img  v-if="scope.row.deviceRepairList[scope.column.index]&&(scope.row.deviceRepairList[scope.column.index].state.split(',').findIndex(v=> v=='0')!==-1)" src="~@/assets/img/nocircle.png"/> -->
                                <!-- <img  v-if="scope.row.deviceRepairList[scope.column.index]&&(scope.row.deviceRepairList[scope.column.index].state.split(',').findIndex(v=> v=='')!==-1)" src="~@/assets/img/nocircle.png"/> -->
                                <!-- <span v-if="scope.row.deviceRepairList[scope.column.index].repairCount > 1"> X {{scope.row.deviceRepairList[scope.column.index].repairCount}}</span> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="列表" name="second">
                    <el-table
                        :data="mainlist"
                        :height="tableHeight"
                        border
                        style="width: 100%">
                        <el-table-column
                            v-for='(item,index) in maincolumnlist'
                            :key='index'
                            :prop="item.prop"
                            :label="item.label"
                        >
                        </el-table-column>
                         <el-table-column label="状态"  align="center">
                            <template slot-scope="scope">
                                 <span v-if="scope.row.state=='0' " style="color:red">待检修</span>
                                 <span v-if="scope.row.state=='1' ">已完成</span>
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
                </el-tab-pane>
              
            </el-tabs>
           
      </div>
  </div>
</template>

<script>
import { selectDeviceRepairData,deviceTypeList,selectDeviceRepairList } from 'api/index'
import {getListByToType} from 'api/main'
import { export2Excel } from './../../../utils/util'
import moment from 'moment'
export default {
    name: 'devicerepair',
    data() {
        return {
            roleId: '',
            tableData:[],
            columnlist:[],
            deviceList:[],
            isload:false,
            isshow:true,
            terms: {
                    yearParam: '',
                    toType: '',
                    deviceId: '',
                    state: ''
                },
            stateArr:[],
            activeName:'first',
            page:{
                current:1,
                size:10
            },
            mainlist:[],
            maincolumnlist:[
                {prop:'index',label:'序号'},
                {prop:'deviceName',label:'设备名称'},
                {prop:'deviceNumber',label:'设备编号'},
                {prop:'model',label:'规格型号'},
                {prop:'toTypeName',label:'设备类别'},
             
                {prop:'fault',label:'故障原因'},
                {prop:'dateTime',label:'故障时间'},
                {prop:'finishDateTime',label:'维修时间'},
                {prop:'repairUser',label:'维修人'},
                {prop:'checkUser',label:'验收人'},
            ],
            pagesize:1,
            totals:0,
            tableHeight:(document.body.clientHeight - 260) + 'px'
        }
    },
    created(){
        this.roleId = sessionStorage.getItem('roleId')
        if(this.roleId==1||this.roleId==0){
          this.terms.toType='1'
        }
        console.log(this.toType)
        this.getselectDeviceRepairData()
        this.getdeviceTypeList()
        this.getselectDeviceRepairList()
    },
    methods: {
        test(){
            
            export2Excel(this.maincolumnlist,this.mainlist,'设备年度维修情况列表')
        },
      getselectDeviceRepairData(){
          this.isload = true
          selectDeviceRepairData(this.terms).then(res=>{
               this.isload = false
              if(res.code==='0'){
                let arr = []
                var arr1 = {}
                this.columnlist= []
                res.data.map((item,index) => {
                    arr1 = {}
                    //处理数据格式
                    item.deviceRepairList.map((h,j)=>{
                        if(index=='0'){
                            this.columnlist.push({label: h.dateTime,prop:`state${j}`})
                        }
                        arr1[`dateTime${j}`] = h.dateTime
                        arr1[`state${j}`] = h.state
                        arr[`repairCount${j}`] = h.repairCount
                    })
                        arr.push({ ...item,...arr1})
                    });
                    this.$nextTick(()=>{
                        this.tableData = arr
                    })
                }
          })
        },
        getdeviceTypeList(){
                deviceTypeList().then(res=>{
                    if(res.code==='0'){
                        this.deviceList = res.data
                    }
                })
        },
         // 获取设备
        getgetListByToType(id){
            getListByToType(id).then(res=>{
                if(res.code==='0'){
                    this.stateArr = res.data
                }
            })
        },
        // 修改设备
        changeselcet(val){
             this.stateArr = []
            this.terms.deviceId = ''
            this.getgetListByToType({toTypeId:val})
        },
        // 设备维修列表
        getselectDeviceRepairList(){
            let obj = {...this.terms,...this.page}
            selectDeviceRepairList(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                        item.index = index+1
                        if(item.finishDateTime){
                            item.finishDateTime = item.finishDateTime.split(' ')[0]
                        }
                    })
                    this.pagesize = parseInt(res.data.current)
                    this.totals = parseInt(res.data.total)
                    this.mainlist = res.data.records
                }
            })
        },
        changeyear(i){
          this.terms.yearParam =  moment(i).format('YYYY')
        },
       
        onSubmit(){
            this.getselectDeviceRepairData()
            this.getselectDeviceRepairList()
        },
        onReset(){
            this.terms= {
                    yearParam: '',
                    toType: '',
                    deviceId: '',
                    state: ''
            }
            this.page.current =1
            this.stateArr = []
            this.getselectDeviceRepairData()
            this.getselectDeviceRepairList()
        },
        //切换卡片
        handleClick(val){
            if(val.index==='1'){
                this.isshow = false
            }else{
                this.isshow = true
            }
        },
        // 切换页码
        handleCurrentChange(val){
            this.page.current =val
            this.getselectDeviceRepairList()
        }
    }
}
</script>


<style lang='less'>
    .devicerepair{
        width: 100%;
        height: 100%;
        display: flex;
        padding: 0 5px;
        flex-direction: column;
        .top{
            margin-top: 10px;
            height: 50px;
            .datetime{
                width: 100% !important;
            }
        }
        .el-form-item__content{
            
            .el-date-editor{
                width: 120px;
            }
            .el-select{
                width: 140px;
            }
            
        }
        .el-table .cell{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            p{
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img{
                width: 18px;
                margin: 1px;
            }
        }
        .titimg{
            display: flex;
            padding-bottom: 10px;
            padding-left: 15px;
            margin-bottom: -58px;
            p{
                width: 25%;
                display: flex;
                align-items: center;
                justify-content: start;
            }
            span{
                display: flex;
                align-items: center;
                height: 30px;
                line-height: 30px;
                margin-right: 15px;
                img{
                    width: 20px;
                    margin-right: 5px;
                }
            }
            .tit{
                margin-left: 20%;
                font-size: 17px;
                letter-spacing: 1px;
                font-weight: 600;
                color:rgb(50,65,112)
            }
        }
        .bot{
            padding: 10px ;
            .el-tabs__header{
                border:none;
                .el-tabs__nav{
                    border-bottom: 1px solid #e4e7ed;
                    float: right;
                    .is-active{
                        color: #fff;
                        background-color: #409efe;
                    }
                }
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
    }
</style>
