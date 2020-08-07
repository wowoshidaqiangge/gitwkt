<template>
  <div class="processCount">
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
      <div class="chartBox" id="processChart"></div>
    </div>
  </div>

</template>
<script>
import moment from 'moment';
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { processCount } from 'api/tool'
export default {
  name: 'processCount',
  components: {
  },
  data() {
    return {
      year: '',
      tableData: [],
      chartData: [],
      columnlist: [
        { prop: 'time', label: '月份' },
        { prop: 'assignCount', label: '月度工序' },
        { prop: 'unQualifyNum', label: '报废工序' },
        { prop: 'qualifyNum', label: '合格工序' },
        { prop: 'qualifyRate', label: '工序合格率' },
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
      processCount(obj).then(res => {
        if (res.code === '0') {
          this.chartData = res.data
          res.data.map((item, index) => {
            if (parseInt(item.time)) {
              item.time += '月'
            }
            item.qualifyRate = (item.qualifyRate * 100).toFixed(3) + '%'
          })
          this.tableData = res.data
        }
        this.getChart()
      })
    },
    // el-table自带计算合计
    /*getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        else if (index === 1 || index === 2 || index === 3) {
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
        else if (index === 4) {
          const values = []
          data.map(item => {
            values.push(parseFloat(item.qualifyRate.split('%')[0]))
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
    getChart() {
      let myChart = Echarts.init(document.getElementById('processChart'));
      let xarr = []
      let yarr1 = []
      let yarr2 = []
      this.chartData.map((item, index) => {
        if (index < (this.chartData.length - 1)) {
          xarr.push(item.time)
          yarr1.push(item.assignCount)
          yarr2.push(item.qualifyRate.split('%')[0])
        }
      })
      let chartTitle = this.year + '年工序合格率'
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
            // interval: 10000,
          },
          {
            type: 'value',
            name: '',
            // min: 99.840,
            // max: 30.960,
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
            name: '月度工序',
            type: 'bar',
            barWidth: "50%",
            data: yarr1,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '工序合格率',
            type: 'line',
            yAxisIndex: 1,
            data: yarr2,
            // itemStyle: {
            //   normal: {
            //     fomatter: '{c}+%%',
            //     label: {
            //       fomatter: '{c}%%',
            //       show: true
            //     }
            //   }
            // },
            label: {
              show: true,
              formatter: '{c}%'
            }
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
.processCount {
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
    justify-content: center;
    .chartBox {
      border: 1px solid #e4e7ed;
      width: 55%;
      height: 400px;
    }
  }
}
</style>