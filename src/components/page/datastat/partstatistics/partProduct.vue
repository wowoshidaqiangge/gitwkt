<template>
  <div class="partProduct">
    <div class="top">
      <el-row type="flex" justify="start">
        <el-col :span="3">
          <el-date-picker v-model="year" type="year" placeholder="选择年份" class="box" value-format="yyyy"
            @change="getTableData()">
          </el-date-picker>
        </el-col>
        <el-col :span="1.5" style="margin:0 20px;">
          <el-button icon="el-icon-arrow-left" @click="preYear">上一年</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button @click="nextYear">下一年<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-col>
      </el-row>
    </div>
    <div class="middle">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="chartBox" id="partProduct"></div>
      <div class="chartBox" id="partStatus"></div>
    </div>
  </div>

</template>
<script>
import moment from 'moment';
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { partProduct } from 'api/tool'
export default {
  name: 'partProduct',
  components: {
  },
  data() {
    return {
      year: '',
      chartData: [],
      tableData: [],
      columnlist: [
        { prop: 'headFiled', label: '月份' },
        { prop: 'produceCount', label: '零件月度生产' },
        { prop: 'industrialWaste', label: '工废' },
        { prop: 'scrapWaste', label: '料废' },
        { prop: 'gh', label: '让步工H' },
        { prop: 'gc', label: '降级工C' },
        { prop: 'lh', label: '让步料H' },
        { prop: 'lc', label: '降级料C' },
        { prop: 'qualified', label: '合格品P' },
        { prop: 'rate', label: '零件合格率' },
      ]
    };

  },
  computed: {
  },
  watch: {
  },
  mounted() {

  },
  created() {
    this.year = moment(new Date()).format('YYYY');
    this.getTableData();

  },
  methods: {
    // 上一年、下一年按钮
    preYear() {
      this.year = (parseInt(this.year) - 1).toString();
      this.getTableData()
    },
    nextYear() {
      this.year = (parseInt(this.year) + 1).toString();
      this.getTableData()
    },
    getTableData() {
      let obj = {
        year: this.year,
      }
      partProduct(obj).then(res => {
        if (res.code === '0') {
          // let a = Math.pow(2, 3)
          // console.log(a)
          // let arr = { 1: 3, 2: 4 }
          // console.log(arr[1])
          // let month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          // let result = []
          // month.map((item, index) => {
          //   result = res.data.monthInfo.filter(v => v.headFiled == item)
          //   res.data.monthInfo.map(v => {
          //     if (v.headFiled == item) {
          //       // debugger
          //     }
          //   })
          // })'headFiled','produceCount',,'rate'
          this.tableData = []
          let headList = ['industrialWaste', 'scrapWaste', 'gh', 'gc', 'lh', 'lc', 'qualified']
          if (res.data) {
            this.chartData = res.data
            res.data.monthInfo.map((item, index) => {
              if (item.headFiled) {
                item.headFiled = item.headFiled + '月'
              }
              item.rate = item.rate + '%'
            })
            let tableObj = {}
            tableObj['produceCount'] = 0
            res.data.total.map((v, i) => {
              let key = headList[i]
              tableObj[key] = v
              tableObj['headFiled'] = '合计'
              tableObj['produceCount'] += parseInt(v)
            });
            if (tableObj.qualified) {
              tableObj['rate'] = (parseFloat((tableObj.qualified+tableObj.gh+tableObj.gc+tableObj.lh+tableObj.lc) / tableObj.produceCount) * 100).toFixed(2) + '%'
            } else {
              tableObj['rate'] = 0 + '%'
            }
            let rateObj = {}
            res.data.rate.map((v, i) => {
              let key = headList[i]
              rateObj[key] = v * 100 + '%'
              rateObj['headFiled'] = '占比'
            });
            let rankObj = {}
            res.data.rank.map((v, i) => {
              let key = headList[i]
              rankObj[key] = v
              rankObj['headFiled'] = '排序'
            });
            res.data.monthInfo.push(tableObj, rateObj, rankObj)
            console.log(res.data.monthInfo)
            this.tableData = res.data.monthInfo
          }
          this.getLeftChart()
          this.getRightChart()
        }

      })
    },
    /*getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        else if (index !== 9) {
          const values = data.map(item => Number(item[column.property]));
          // debugger
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
          }
        }
        else if (index === 9) {
          const values = []
          data.map(item => {
            values.push(parseFloat(item.partRate.split('%')[0]))
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

            sums[index] = (sums[index] / values.length).toFixed(3) + '%';
          } else {
          }
        }
      });

      return sums;
    },*/
    getLeftChart() {
      let myChart = Echarts.init(document.getElementById('partProduct'));
      let xarr = []
      let yarr1 = []
      let yarr2 = []
      
      this.tableData.map((item, index) => {
        if (index < (this.tableData.length - 3)) {
          xarr.push(item.headFiled)
          yarr1.push(item.produceCount)
          yarr2.push(item.rate.split('%')[0])
        }
      })
      let max= Math.max(...yarr1)*1.2
      let chartTitle = this.year + '年零件生产及合格率情况'
      let option = {
        title: {
          text: chartTitle,
          top: '5%',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },

        legend: {
          show: true,
          bottom: '5%',
          // data: ['月度生产', '成品同比']
        },
        xAxis: [
          {
            type: 'category',
            data: xarr,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            max: max,
            // interval: 5000,
          },
          {
            type: 'value',
            name: '',
            // min: 92,
            // max: 99,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        grid: {
          left: "7%",
          right: "7%",
          // height: "100%",
          // top: "20%",
          // bottom: "5%",
          containLabel: true
        },
        series: [
          {
            name: '零件月度生产',
            type: 'bar',
            barWidth: "50%",
            data: yarr1,
            label: {
              show: true,
              position: 'top',
            }
          },
          {
            name: '零件合格率',
            type: 'line',
            yAxisIndex: 1,
            data: yarr2,
            label: {
              show: true,
              formatter: '{c}%'
            }
            // itemStyle: {
            //   normal: {
            //     fomatter: '{c}%',
            //     label: {
            //       fomatter: '{c}%',
            //       show: true
            //     }
            //   }
            // }
          }
        ],
        color: ['rgb(79,129,189)', 'rgb(191,78,75)']
      };
      myChart.setOption(option, true, (window.onresize = myChart.resize));
    },
    getRightChart() {
      let myChart = Echarts.init(document.getElementById('partStatus'));
      let xarr = ['工废', '料废', '让步工H', '降级工C', '让步料H', '降级料C', '合格品',]
      let yarr1 = []
      let yarr2 = []
      let total = 0
      for (let i in this.chartData.total) {
        yarr1.push(this.chartData.total[i])
      }
      this.chartData.rate.map(item => {
        total += item
        yarr2.push((total * 100).toFixed(3))
      })
      let max= Math.max(...yarr1)*1.2
      let chartTitle = this.year + '年零件各状态柏拉图'
      let option = {
        title: {
          text: chartTitle,
          top: '5%',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },

        legend: {
          show: true,
          bottom: '5%',
          // data: ['月度生产', '成品同比']
        },
        xAxis: [
          {
            type: 'category',
            data: xarr,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            max:max,
            // interval: 10000,
          },
          {
            type: 'value',
            name: '',
            // min: 93,
            // max: 100,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        grid: {
          left: "7%",
          right: "7%",
          // height: "100%",
          // top: "20%",
          // bottom: "5%",
          containLabel: true
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: "50%",
            data: yarr1,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '累加',
            type: 'line',
            yAxisIndex: 1,
            data: yarr2,

          }
        ],
        color: ['rgb(79,129,189)', 'rgb(191,78,75)']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    },
  }
};
</script>

<style lang="less">
.partProduct {
  width: 100%;
  height: auto;
  .box {
    width: 100%;
  }
  .margin {
    margin: 0 20px;
  }
  .top {
    margin: 0 30px;
    .el-button {
      color: white;
      background: #409baf;
    }
  }
  .middle {
    margin: 20px 30px;
  }
  .bottom {
    margin: 0 30px 30px;
    display: flex;
    justify-content: space-between;
    .chartBox {
      border: 1px solid #e4e7ed;
      width: 45%;
      height: 350px;
    }
  }
}
</style>