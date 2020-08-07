
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