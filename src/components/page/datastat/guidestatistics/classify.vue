<template>
  <div class="classify" v-loading="load"  element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="top">
       <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="start">
          <el-col :span="3">
            <el-form-item label="型号" label-width="60px"  >
              <el-select v-model="productModel" @change="changesel" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.productModel"
                  :label="item.productModel"
                  :value="item.productModel">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="月份" label-width="60px" >
              <el-date-picker
                v-model="value2"
                @change="changetime"
                style="width:100%"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div style="margin:0 15px">
            <el-button type="primary"  icon="el-icon-caret-left" @click="beforMonth">上月</el-button>
            <el-button type="success" @click="afterMonth" >下月  <i class="el-icon-caret-right" ></i></el-button>
          </div>
          <div style="flex:1">
            <el-button type="primary" style="float:right"  @click="handleExcel">EXCEL导出</el-button>
          </div>
        </el-row>
      </el-form>
    </div>
    <div >
          <el-table
          :data="tableData"
          border
          max-height="500px"
          style="width: 100%">
              <el-table-column 
              prop="rankName" 
              fixed
              label="型号"
              width="120px"
              align="center">
              </el-table-column>
              <el-table-column 
              v-for="(item, index) in columnlist" 
              :key="index" 
              :width="item.width"
              :prop="item.prop" 
              :label="item.label"
              align="center">
              </el-table-column>
          </el-table>
      </div>
      <div >
        <h2 style="margin:20px 0">{{typeof(value2)=='string'?value2.split('-')[1]:value2}}月汇总分布图</h2>
        <div style="height:580px">
           <div style="float:left;width:25%">
              <el-table
              :data="tableList"
              :max-height="550"
              border
              style="width: 100%">
                  <el-table-column 
                  v-for="(item, index) in columnlist1" 
                  :key="index" 
                  :width="item.width"
                  :prop="item.prop" 
                  :label="item.label"
                  align="center">
                  </el-table-column>
              </el-table>
           </div>
           <div style="float:left;width:75%"> 
              <ve-histogram height="550px" :data="chartData" :settings="chartSettings" :extend="extend" :grid="grid" :legend-visible="false"></ve-histogram>
           </div>
        </div>
        
      </div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getGuideQualityListByDay,// 
  getGuideModelList,// 种类列表
  getGuideQualityListByMonth,// 按月统计
} from 'api/product'
import { export2Excel,} from '@/utils/util.js';
export default {
  name: 'classifyStatistics.',
  components: {},
  computed: {
  },
  watch: {
  },
  data() {
  
    return {
      chartData: {
          columns: ['time', '下单率'],
          rows: [
            { 'time': '1/1',   '下单率': 0.32 },
            { '日期': '1/2', '下单率': 0.26 },
            { '日期': '1/3',  '下单率': 0.76 },
            { '日期': '1/4',   '下单率': 0.49 },
            { '日期': '1/5',   '下单率': 0.323 },
            { '日期': '1/6',  '下单率': 0.78 }
          ]
        },
        grid:{},
        extend:{},
        chartSettings:{},
        seachinfo:{},
        value2:moment(new Date()).format("YYYY-MM"),
        tableData:[],
        columnlist:[
        ],
        load:false,
        nowMonth:moment(new Date()).format("YYYY-MM"),
        options:[],
        productModel:'全部',
        tableList:[],
        columnlist1:[
          {label:'名称',prop:'rankName'},
          {label:'数量',prop:'rankCount',width:'60px'},
          {label:'名称',prop:'rankNameradio'},
          {label:'占比率',prop:'rankCountRatio'},
        ]
    };
  },
  created() {
    this.getGuideQualityListByDay() 
    this.getGuideModelList()
    this.getnowday()
    this.getGuideQualityListByMonth()
  },
  methods: {
     handleExcel() {
     
      export2Excel(this.columnlist, this.tableData, `分类统计-${this.value2}`);
      this.$message.success('导出成功');
    },
    changetime(val){
      this.value2 = moment(val).format("YYYY-MM")
    
      this.getGuideQualityListByDay()
      this.getGuideQualityListByMonth()
    },
    changesel(val){
    
      this.getGuideQualityListByDay()
      this.getGuideQualityListByMonth()
    },
    // 获取型号列表
    getGuideModelList(){
      getGuideModelList().then(res=>{
        if(res.code ==='0'){
          res.data.unshift({productModel:"全部"})
          this.options = res.data
        }
      })
    },
    // 获取当前时间
    getnowday(){
       let nowday = moment(new Date()).format("D")
       return nowday
    },
    // 表格
    getGuideQualityListByDay(){
      this.load = true
      getGuideQualityListByDay({monthParam:this.value2,productModel:this.productModel}).then(res=>{
        this.load = false
        if(res.code==='0'){
          let arr = []
          let obj = {rankName:'报检数量'}
          let arr1 = JSON.parse(JSON.stringify(res.data))
          res.data.map((item,de)=>{
            item.guideQualityList.map((v,index)=>{
              if(de===0){
                   arr.push({label:v.dateList.split('-')[2]?v.dateList.split('-')[2]:v.dateList,prop:`time${index}`})
                   if( v.dayTotal){
                      obj[`time${index}`] =  v.dayTotal
                   }
              }
              if(item.rankName==="不合格占比"){
                if(v.rankDayCountRatio){
                  item[`time${index}`] = v.rankDayCountRatio
                }
              }else{
                if(v.rankCount){
                  item[`time${index}`] =  v.rankCount
                }
              }
            })
          })
          arr1.map((item)=>{
            if(item.rankName==="P级"){
              item.rankName = "合格率占比"
            }else {
              item.rankName = item.rankName+'占比'
            }
               
            item.guideQualityList.map((v,index)=>{
                if(v.rankDayCountRatio){
                  item[`time${index}`] = v.rankDayCountRatio
                }
              })
           })
          arr1.pop()
          res.data.unshift(obj)
          this.columnlist = arr
          this.tableData = [...res.data,...arr1]
        }
      })
    },
    afterMonth(){
      this.value2 = moment(this.value2).add(1,'month').format("YYYY-MM")
      this.getGuideQualityListByDay()
      this.getGuideQualityListByMonth()
    },
    beforMonth(){
      this.value2 = moment(this.value2).subtract(1,'month').format("YYYY-MM")
      this.getGuideQualityListByDay()
      this.getGuideQualityListByMonth()
    },
    getGuideQualityListByMonth(){
      getGuideQualityListByMonth({monthParam:this.value2,productModel:this.productModel}).then(res=>{
        if(res.code==="0"){
          let arr = []
          let obj = {}
          res.data.map((item,index)=>{
            if(index===0){
               obj.rankCount = item.total
               obj.rankName = "报检数量"
            }
            item.rankNameradio = item.rankName+'占比'
            arr.push(item)
            if(item.rankCountRatio){
              item.per = parseFloat(item.rankCountRatio.split('%')[0])/100
              item['占比率']= (parseFloat(item.rankCountRatio.split('%')[0])/100).toFixed(2)
            }
          })
          this.chartSettings = {
              // axisSite: { right: ['占比率'] },
              yAxisType: [ 'percent'],
              // yAxisName: [ '比率']
              // metrics: ['占比率']
              // labelMap: {
              //   per: '占比率',
              // }
          }
          this.extend = {
            series: {
              label: { show: true},
            },
            series (v) {
                v.forEach(i => {
                  i.barWidth = 50
                })
                return v
            },
          }
          this.grid = {
            top:10,
            left: 20,
            bottom:10
          }
          this.chartData = {
            columns:['rankName','占比率'],
            rows:res.data
          }
          arr.unshift(obj)
          this.tableList = arr
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.classify {

}
</style>