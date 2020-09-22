<template>
  <div class="workprocess">
       <div class="top">
            <el-form :model="seachinfo"  ref="seachinfo"  class="demo-ruleForm">
              <el-row type='flex' justify="end">
                <div style="flex:1">
                    <el-button type="add" v-if="$_has('WORKPROCESSADD')" icon='el-icon-circle-plus-outline' @click="add">新增</el-button>
                     <el-button type="add"  @click="addexcel">EXCEL导入</el-button>
                </div>
               <el-col :span="2" style="margin:0 20px" v-if="roleId<3">
                    <el-form-item label="" prop="deptId" >
                        <el-select v-model="seachinfo.deptId" placeholder="部门">
                            <el-option v-for="item in deptoption" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item label=""  prop="workprocessNameOrCode" >
                        <el-input  placeholder="请输入工序名或编码" v-model="seachinfo.workprocessNameOrCode" class="elinput"> </el-input>
                    </el-form-item>

                </el-col>
                <div style="margin:0 15px">
                    <el-button type="add" icon="el-icon-search" @click="seachinfo1">搜索</el-button>
                    <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
                    <el-button type="primary" @click="handleExcel">导出EXCEL</el-button>
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
                 <el-table-column label="操作"  align="center" width="170px">
                            <template slot-scope="scope">
                               
                                <el-button
                                    type="success"
                                    v-if="$_has('WORKPROCESSUPDATE')&&scope.row.isSpecial===0"
                                    plain
                                    @click="handleagin(scope.row)"
                                >修改</el-button>
                              
                                <el-button
                                    type="warning"
                                    v-if="$_has('WORKPROCESSDELETE')&&scope.row.isSpecial===0"
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
    <Modal :dialogFormVisible="dialogFormVisible" ref="workprocessmodal" :tit="tit" @close='close'/>
    <Workexcel :dialogExcelVisible="dialogExcelVisible" :extitle="extitle" @exclose="exclose"/>
  </div>
</template>

<script>
import {workprocessPage,workprocessdelete} from 'api/product'
import Workexcel from './workexcel'
import { export2Excel} from '@/utils/util.js';
import moment from 'moment'
import Modal from './modal'
export default {
    name: 'workprocess',
    components:{
        Modal,Workexcel
    },
    data() {
        return {
            roleId:sessionStorage.getItem('roleId'),
            seachinfo:{
            },
            dialogFormVisible:false,
            tit:'新增工序',
            page:{
                current:1,
                size:10
            },
            pagesize:1,
            totals:0,
            tableData:[],
            columnlist:[
                {prop:'index',label:'序号',width:'80'},
                {prop:'workprocessName',label:'工序名称'},
                {prop:'workprocessCode',label:'工序编码'},
                {prop:'type1',label:'工序类型'},
                {prop:'itemType1',label:'对应物料类型'},
                {prop:'workKind',label:'工种名称'},
                {prop:'toolCodes',label:'工具编码'},
                {prop:'deptName',label:'所属部门'},
                {prop:'createTime',label:'创建时间'},
            ],
            optionstype:[
                {label:'正常',id: 1},
                {label:'补充',id: 2},
                {label:'外协',id: 3},
                {label:'免检',id: 4},
                {label:'质检',id: 5},
                {label:'综合检验',id: 6},
            ],
            optionsitemType:[
                {label:'零件',id: 1},
                {label:'产品',id: 2},
                {label:'滑块',id: 3},
                {label:'线轨',id: 4},
            ],
             deptoption:[
                { value: '7', label: '生产一部' },
                { value: '8', label: '生产二部' },
            ],
            tableData1:[],
            dialogExcelVisible:false,
            extitle:'导入EXCEL'
        }
    },
    created(){
        this.getworkprocessPage()
    },
    mounted(){
        
    },
    methods: {
        addexcel(){
            this.dialogExcelVisible = true
        },
        exclose(num){
            this.dialogExcelVisible = false
            if(num==='0'){
                this.getworkprocessPage()
            }
        },
        handleExcel:async function(){
            let time = moment(new Date()).format("YYYYMMDD")
            await this.allgetworkprocessPage()
            export2Excel(this.columnlist, this.tableData1, `工序配置表-${time}`);
            this.$message.success('导出成功');
        },
        allgetworkprocessPage:async function(){
            let obj = {...this.seachinfo,current:1,size:3000}
            await workprocessPage(obj).then(res=>{
                if(res.code==='0'){
                    res.data.records.map((item,index)=>{
                     item.index= index+1
                     if(item.createTime){
                         item.createTime = item.createTime.split(' ')[0]
                     }
                     if(this.changeoptionstype(item.type).label){
                         item.type1 = this.changeoptionstype(item.type).label
                     }
                     if(this.changeoptionsitemType(item.itemType).label){
                         item.itemType1 = this.changeoptionsitemType(item.itemType).label
                     }
                 })
                this.tableData1 = res.data.records
             
                }
            })
        },
        // 数据列表
        getworkprocessPage(){
            let obj = {...this.seachinfo,...this.page}
            workprocessPage(obj).then(res=>{
                if(res.code==='0'){
                  
                    res.data.records.map((item,index)=>{
                   
                     item.index= index+1
                     if(item.createTime){
                         item.createTime = item.createTime.split(' ')[0]
                     }
                     console.log(this.changeoptionstype(item.type).label)
                     if(this.changeoptionstype(item.type).label){
                         item.type1 = this.changeoptionstype(item.type).label
                     }
                     if(this.changeoptionsitemType(item.itemType).label){
                         item.itemType1 = this.changeoptionsitemType(item.itemType).label
                     }
                   
                 })
                this.tableData = res.data.records
                this.pagesize = parseInt(res.data.current)
                this.totals = parseInt(res.data.total)
                }
            })
        },
        // 修改工序类型
        changeoptionstype(val){
            let proess = this.optionstype.filter(v=>v.id===val)[0]
            if(proess){
                 return proess
            }else{
                return {}
            }
        },
        // 修改对应物料类型
        changeoptionsitemType(val){
            let proess = this.optionsitemType.filter(v=>v.id===val)[0]
            if(proess){
                 return proess
            }else{
                return {}
            }
        },
        //搜索
        seachinfo1(){
            this.page.current = 1
            this.getworkprocessPage()
        },
        //重置
        resetting(){
             this.seachinfo={ }
            this.page.current = 1
            this.getworkprocessPage()
        },
        //新增
        add(){
            this.tit = '新增工序'
           this.dialogFormVisible = true   
        },
        close(num){
            this.dialogFormVisible = false   
            if(num==='0'){
                this.getworkprocessPage()
            }
        },
        handleCurrentChange(val){
            this.page.current = val
            this.getworkprocessPage()
        },
        // 修改
        handleagin(info){
            this.tit= "修改工序"
            this.$refs.workprocessmodal.getworkprocessget(info)
            this.dialogFormVisible = true

        },
        //删除
        handleUntie(info){
              this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
             })
            .then(() => {
                workprocessdelete(info).then(res=>{
                    if(res.code==='0'){
                        this.$message.success(res.msg)
                        this.getworkprocessPage()
                    }
                })
                
            })
            .catch(() => {});
           
        }
    }
}
</script>


<style lang='less'>
    .workprocess{
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
