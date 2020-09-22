
<template>
  <div class="qualified" v-loading="load"  element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="top">
       <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="start">
         
          <el-col :span="4">
            <el-form-item label="年份" label-width="60px" >
              <el-date-picker
                v-model="value2"
                @change="changetime"
                style="width:100%"
                type="year"
                placeholder="选择年">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div style="margin:0 15px">
            <el-button type="primary"  icon="el-icon-caret-left" @click="beforeYear">上一年</el-button>
            <el-button type="primary" @click="afterYear" >下一年  <i class="el-icon-caret-right" ></i></el-button>
          </div>
          <div style="flex:1;text-align:end">
              <el-button type="primary" @click="handleExcel">EXCEL 导出</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table
          :data="tableData1"
          border
          style="width: 100%">
              <el-table-column 
              v-for="(item, index) in columnlist1" 
              :key="index" 
              :label="item.label"
              :prop="item.prop" 
               width="82px"
              align="center">
                   <el-table-column 
                      v-for="(v,i) in item.chilend" 
                      :key="i+100" 
                      :label="v.label"
                      :prop="v.prop" 
                      align="center">
                    </el-table-column>
              </el-table-column>
          
          </el-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {getGuideQualityListByYear} from 'api/product'
import { export2Excel2,} from '@/utils/util.js';
export default {
  name: 'qualified',
  components: {},
  computed: {
  },
  watch: {
  },
  data() {
    return {
      tableData1:[],
      columnlist1:[],
      seachinfo:{},
      value2:moment(new Date()).format("YYYY"),
      load:false
    };
  },
  created() {
    this.getGuideQualityListByYear()
  },
  methods: {
    handleExcel(){
      const arr = []
      const header = []
      const filterVal =[]
      const data = this.tableData1
      const merges = ['A1:A2','B1:C1','D1:E1','F1:G1','H1:I1','J1:K1','L1:M1','N1:O1','P1:Q1','R1:S1','T1:U1','V1:W1','X1:Y1',"Z1:AA1"]
      this.columnlist1.map((item,index)=>{
         if(index===0){
           arr.push(item.label)
           header.push('')
           filterVal.push(item.prop)
         }else{
           item.chilend.map((v,i)=>{
              header.push(v.label)
              filterVal.push(v.prop)
              if(i%2===0){
                 arr.push(item.label)
              }else{
                arr.push('')
              }
           })
          
         }
      })
      let multiHeader = [arr]
      console.log(header,data,merges)
      //  const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
      //   const header = ['', 'Title', 'Author', 'Readings', '']
      //   const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //   const list = this.list
      //   const data = this.formatJson(filterVal, list)
      //   const merges = ['A1:A2', 'B1:D1', 'E1:E2']
        export2Excel2(header,data,`${this.value2}年合格率汇总`,filterVal,multiHeader,merges)
    },
    getGuideQualityListByYear(){
      this.load = true 
      getGuideQualityListByYear({yearParam:this.value2}).then(res=>{
        this.load = false
        if(res.code==='0'){
          let arr =[{label:'规格',prop:'rankName'}]
          res.data.map((item,index)=>{
              item.guideQualityList.map((v,i)=>{
                if(index===0){
                  arr.push({label:v.dateList,chilend:[{label:'数量',prop:`value${i}`},{label:'占比',prop:`ratio${i}`}]})
                }
                item[`value${i}`]  = v.rankCount
                item[`ratio${i}`]  = v.rankCountRatio
              })
          })
          this.columnlist1 = arr
          this.tableData1 = res.data
        }
      })
    },
    afterYear(){
      this.value2 = moment(this.value2).add(1,'year').format("YYYY")
      this.getGuideQualityListByYear()
    },
    beforeYear(){
      this.value2 = moment(this.value2).subtract(1,'year').format("YYYY")
      this.getGuideQualityListByYear()
    },
     changetime(val){
      this.value2 = moment(val).format("YYYY")
      this.getGuideQualityListByYear()
    },
  }
};
</script>

<style lang="less">
.qualified {
  
}
</style>