<template>
  <div class="workprice">
       <div class="top">
            <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <el-row type='flex' justify="end">
                <div style="flex:1">
                    <el-button type="add" v-if="$_has('WORKPRICEADD')" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                    <el-button type="add"  @click="addexcel">EXCEL导入</el-button>
                </div>
                <el-col :span="2" style="margin:0 20px" v-if="roleId<3">
                    <el-form-item label="" prop="deptId">
                        <el-select v-model="seachinfo.deptId" placeholder="部门">
                            <el-option v-for="item in deptoption" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item label=""  prop="itemNameOrCode" >
                        <el-input  placeholder="请输入物料名或编码" v-model="seachinfo.itemNameOrCode" class="elinput"> </el-input>
                    </el-form-item>

                </el-col>
                <div style="margin:0 15px">
                    <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                    <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                    <el-button type="primary" @click="handleExcel">EXCEL 导出</el-button>
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
                 <el-table-column label="计件单价" align="center">
                     <el-table-column
                        prop="qualifiedPrice"
                        label="合格品P"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="concessionPrice"
                        label="让步工H"
                        align="center"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="demotionPrice"
                        align="center"
                        label="降级工C"
                       >
                    </el-table-column>
                 </el-table-column>
                 <el-table-column label="操作"  align="center" width="170px">
                            <template slot-scope="scope">
                                <el-button
                                    type="success"
                                    v-if="$_has('WORKPRICEUPDATE')"
                                    plain
                                    @click="handleagin(scope.row)"
                                >修改</el-button>
                                <el-button
                                    type="warning"
                                    v-if="$_has('WORKPRICEDELETE')"
                                    plain
                                    @click="handleUntie( scope.row)"
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
    <Modal :dialogFormVisible="dialogFormVisible" ref="workpricemodal" :tit="tit" @close='close'/>
    <Workexcel :dialogExcelVisible="dialogExcelVisible" :extitle="extitle" @exclose="exclose"/>
  </div>
</template>

<script>
import {
    workpricePage,//分页
    workpricedelete
    } from 'api/product'
import Modal from './modal'
import moment from 'moment'
import { export2Excel2,} from '@/utils/util.js';
import Workexcel from './workpriceexcel.vue'
export default {
    name: 'workprice',
    components:{
        Modal,Workexcel
    },
    data() {
        return {
            roleId:sessionStorage.getItem('roleId'),
            seachinfo:{
            },
            dialogFormVisible:false,
            tit:'新增工价',
            page:{
                current:1,
                size:10
            },
            pagesize:1,
            totals:0,
            tableData:[],
            columnlist:[
                {prop:'index',label:'序号',width:'80'},
                {prop:'itemName',label:'物料名称'},
                {prop:'itemCode',label:'物料编码'},
                {prop:'model',label:'规格型号'},
                {prop:'workprocessName',label:'工序名称'},
                {prop:'workprocessCode',label:'工序编码'},
                {prop:'deptName',label:'所属部门'},
                {prop:'timePrice',label:'计时单价'},
                // {prop:'createTime',label:'合格品P'},
                // {prop:'createTime',label:'让步工H'},
                // {prop:'createTime',label:'降级工C'},
            ],
            deptoption:[
                { value: '7', label: '生产一部' },
                { value: '8', label: '生产二部' },
            ],
            extitle:'导出EXCEL',
            dialogExcelVisible:false,
            tableData1:[]
        }
    },
    created(){
        this.getworkpricePage()
    },
    mounted(){
        
    },
    methods: {
        addexcel(){
            this.dialogExcelVisible= true
        },
        exclose(num){
            this.dialogExcelVisible = false
            if(num==='0'){
                this.getworkpricePage()
            }
        },
        handleExcel:async function(){
            await this.allgetworkpricePage()
            const multiHeader = [['序号',"物料名称","物料编码","规格型号","工序名称","工序编码","所属部门","计时单价","计件单价","",""]]
            const header = ["","","","","","","","","合格品P","让步工H","降级工C"]
            const filterVal =['index','itemName','itemCode','model','workprocessName','workprocessCode','deptName','timePrice','qualifiedPrice','concessionPrice','demotionPrice',]
            const data = this.tableData1
            const merges = ['A1:A2','B1:B2','C1:C2','D1:D2','E1:E2','F1:F2','G1:G2','H1:H2','I1:K1']
            let time = moment(new Date()).format("YYYYMMDD")
            export2Excel2(header,data,`工价管理列表${time}`,filterVal,multiHeader,merges)
        },
        allgetworkpricePage:async function(){
            let obj = {...this.seachinfo,current:1,size:10000}
            await workpricePage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                     item.index= index+1
                     if(item.createTime){
                         item.createTime = item.createTime.split(' ')[0]
                     }
                 })
                this.tableData1 = res.data.records
             
                }
            })
        },  
        // 数据列表
        getworkpricePage(){
            let obj = {...this.seachinfo,...this.page}
            workpricePage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                     item.index= index+1
                     if(item.createTime){
                         item.createTime = item.createTime.split(' ')[0]
                     }
                 })
                this.tableData = res.data.records
                this.pagesize = parseInt(res.data.current)
                this.totals = parseInt(res.data.total)
                }
            })
        },
        //搜索
        seachinfo1(){
            this.page.current = 1
            this.getworkpricePage()
        },
        //重置
        resetting(){
             this.seachinfo={ }
            this.page.current = 1
            this.getworkpricePage()
        },
        //新增
        add(){
           this.dialogFormVisible = true   
        },
        close(num){
            this.dialogFormVisible = false   
            if(num==='0'){
                this.getworkpricePage()
            }
        },
        handleCurrentChange(val){
            this.page.current = val
            this.getworkpricePage()
        },
        // 修改
        handleagin(info){
            this.tit= "修改工价"
            this.$refs.workpricemodal.getworkprice(info)
            this.dialogFormVisible = true

        },
        //删除
        handleUntie(info){
              this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
             })
            .then(() => {
                workpricedelete(info).then(res=>{
                    if(res.code==='0'){
                        this.$message.success(res.msg)
                        this.getworkpricePage()
                    }
                })
                
            })
            .catch(() => {});
           
        }
    }
}
</script>


<style lang='less'>
    .workprice{
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
