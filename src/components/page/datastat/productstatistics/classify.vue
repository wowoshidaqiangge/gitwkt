<template>
  <div class="classify">
    <div class="top">
      <el-row type="flex" justify="start">
        <el-col :span="4">
          <el-date-picker v-model="dayDate" type="daterange" range-separator="——" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" class="box">
          </el-date-picker>
        </el-col>
        <el-col :span="2" class="margin">
          <el-button @click="search">查询</el-button>
        </el-col>
      </el-row>

    </div>
    <div class="middle">
      <el-table :data="classifyData" border :summary-method="getSummaries" show-summary style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="chartBox" id="classifyChart"></div>
    </div>
  </div>

</template>
<script>
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { classify } from 'api/tool'
export default {
  name: 'classify',
  components: {
  },
  data() {
    return {
      chartData: [],
      dayDate: '',
      classifyData: [],
      columnlist: [
        { prop: 'index', label: '序号' },
        { prop: 'productType', label: '存货大类' },
        { prop: 'productName', label: '存货名称' },
        { prop: 'produceCount', label: '分类合计' },
        { prop: 'rate', label: '占比(%)' },
        { prop: 'preRate', label: '累加(%)' },
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
    this.getTableData();
  },
  methods: {
    search() {
      this.getTableData()
    },
    getTableData() {
      let obj = {}
      if (this.dayDate) {
        obj = {
          startTime: this.dayDate[0],
          endTime: this.dayDate[1]
        }
      } else {
        obj = {
          startTime: '',
          endTime: ''
        }
      }
      classify(obj).then(res => {
        if (res.code === '0') {
          this.chartData = res.data
          res.data.map((item, index) => {
            item.index = index + 1
            item.rate = (item.rate * 100).toFixed(3)
            item.preRate = (item.preRate * 100).toFixed(3)
          })
          this.classifyData = res.data
        }
        this.getChart()
      })

    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '生产合计(件)';
          return;
        }
        if (index === 3) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // sums[index] += ' 元';
          } else {
            // sums[index] = 'N/A';
          }
        }
      });

      return sums;
    },
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     if (rowIndex === 12) {
    //       return [1, 3];
    //     } else {
    //       return [0, 0];
    //     }
    //   }
    // },
    getChart() {
      let myChart = Echarts.init(document.getElementById('classifyChart'));
      let xarr = []
      let yarr1 = []
      let yarr2 = []
      this.chartData.map((item, index) => {
        xarr.push(item.productName)
        yarr1.push(item.produceCount)
        yarr2.push(item.preRate)
      })
      let option = {
        title: {
          text: '各成品柏拉图',
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
            name: '数量(台)',
          },
          {
            type: 'value',
            name: '',
            // min: 60,
            // max: 100,
            // interval: 10,
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
            name: '月度生产',
            type: 'bar',
            barWidth: "50%",
            data: yarr1,
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '成品同比',
            type: 'line',
            smooth: true,
            symbolSize: 6,
            yAxisIndex: 1,
            data: yarr2
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
.classify {
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