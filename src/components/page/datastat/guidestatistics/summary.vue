<template>
  <div class="summary" v-loading="load"  element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="top">
       <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="start">
         
          <el-col :span="4">
            <el-form-item label="月份" label-width="60px" >
              <el-date-picker
                @change="changetime"
                v-model="value2"
                style="width:100%"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <div style="margin:0 15px">
            <el-button type="success"  icon="el-icon-caret-left" @click="beforMonth">上月</el-button>
            <el-button type="success" @click="afterMonth" >下月  <i class="el-icon-caret-right" ></i></el-button>
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
      <div style="width:100%;height:650px;margin-top:20px">
        <div style="width:100%;height:650px" id="chartsum"></div>
      </div>
  </div>
</template>

<script>
import moment from 'moment';
import {getGuideQualityListByModel} from 'api/product'
import Echarts from 'echarts'
export default {
  name: 'summary.',
  components: {},
  computed: {
   
  },
  watch: {
  },
  data() {
    return {
      tableData1:[],
      columnlist1:[]  ,
      value2:moment(new Date()).format("YYYY-MM"),
      seachinfo:{},
      load:false
    };
  },
  created() {
    this.getGuideQualityListByModel()
    
  },
  mounted(){
    // this.getRightChart()
  },
  methods: {
    getGuideQualityListByModel(){
        this.load = true
      getGuideQualityListByModel({monthParam:this.value2}).then(res=>{
        this.load = false
        if(res.code==='0'){
          // 处理表格格式
          let arr = [{label:'规格',prop:'rankName'}]
          res.data.guideQualityTypeList.map((item,index)=>{
              item.guideModelQualityList.map((v,i)=>{
                let a = res.data.guideQualityModelList.filter(d=>d===v.productModel)
                if(a){
                  item[`value${a[0]}`]  = v.rankCount
                  item[`ratio${a[0]}`]  = v.rankCountRatio
                }
              })
          })
          res.data.guideQualityModelList.map(v=>{
            arr.push({label:v,chilend:[{label:'数量',prop:`value${v}`},{label:'占比',prop:`ratio${v}`}]})
          })

          // 处理echarts数据
          let series = []
          res.data.guideQualityTypeList.map((item,index)=>{
            let result = []
             res.data.guideQualityModelList.map(t=>{
                 if(item[`ratio${t}`]){
                   result.push(item[`ratio${t}`].split('%')[0])
                 }else{
                   result.push('-')
                 }
                 
             })
             if(index===0){
               series.push({ name: item.rankName,type: 'bar',label:{"show":true,formatter: '{@score}%'},barWidth:50,itemStyle:{color:"#9BBB59"},stack: '数量', data:result})
             }else{
               series.push({ name: item.rankName,type: 'bar',label:{"show":true,formatter: '{@score}%'},barWidth:50,stack: '数量', data:result})
             }
             
          })
          this.columnlist1 = arr
          this.tableData1 = res.data.guideQualityTypeList
        
          this.getRightChart(res.data.guideQualityModelList,series)
        }
      })
    },
    afterMonth(){
      this.value2 = moment(this.value2).add(1,'month').format("YYYY-MM")
      this.getGuideQualityListByModel()
    },
    beforMonth(){
      this.value2 = moment(this.value2).subtract(1,'month').format("YYYY-MM")
      this.getGuideQualityListByModel()
    
    },
     changetime(val){
      this.value2 = moment(val).format("YYYY-MM")
      this.getGuideQualityListByModel()
    },
    getRightChart(xdata,serieslist) {
      let myChart = Echarts.init(document.getElementById('chartsum'));
     
      let option = {
         tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: ''
          },
          legend: {
              // data: ['百度', '谷歌', '必应', '其他']
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top:50
          },
          grid: {
              left: '3%',
              right: '7%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: xdata,
                 
              }
          ],
          yAxis: [
              {
                  type: 'value',
                   axisLabel: {
                      formatter: '{value}%'
                  }
              }
          ],
          series: serieslist
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    },
  }
};
</script>

<style lang="less">
.summary {
  
}
</style>