<template>
  <div class="YoYanalysis">
    <div class="top">
      <el-row type="flex" justify="start">
        <el-col :span="3">
          <el-date-picker v-model="startYear" type="year" placeholder="选择年份" class="box" value-format="yyyy"
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
      <el-table :data="YoYtableData" :span-method="arraySpanMethod" border style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="chartBox">
        <div class="chart" id="monthProduct"></div>
        <div class="label">
          <table>
            <tr class="tableRow">
              <th class="tableHead">
                <div></div>
              </th>
              <td v-for="(item, index) in tableList1" :key="index" class="tableList" align="center">{{item}}
              </td>
            </tr>
            <tr class="tableRow">
              <th>
                <div class="tableHead">
                  <div class="legend1"></div>
                  月度生产
                </div>
              </th>
              <td v-for="(item, index) in tableList2" :key="index" class="tableList">{{item}}</td>
            </tr>
            <tr class="tableRow">
              <th class="tableHead">
                <div class="legend2"></div>
                成品同比
              </th>
              <td v-for="(item, index) in tableList3" :key="index" class="tableList">{{item}}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="chartBox" id="finishProduct"></div>
    </div>
  </div>

</template>
<script>
import moment from 'moment';
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { analysis } from 'api/tool'
export default {
  name: 'productStatistics',
  components: {
  },
  data() {
    return {
      startYear: '',
      chartData: [],

      YoYtableData: [],
      columnlist: [
        { prop: 'year', label: '年度' },
        { prop: 'yearProduct', label: '全年生产' },
        { prop: 'quarter', label: '季度' },
        { prop: 'quarterProduct', label: '季度产量' },
        { prop: 'month', label: '月份' },
        { prop: 'thisCount', label: '本期' },
        { prop: 'preCount', label: '同期' },
        { prop: 'rate', label: '同比(%)' },
      ],
      tableList1: [],
      tableList2: [],
      tableList3: [],
      columnlist2: [],
      nowmonth: 0
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.nowmonth = parseFloat(moment(new Date()).format("MM"))

  },
  created() {
    this.startYear = moment(new Date()).locale('zh-cn').format('YYYY');
    this.getYoYTableData();
  },
  methods: {
    // 上一年、下一年按钮
    preYear() {
      this.startYear = (parseInt(this.startYear) - 1).toString();
      this.getYoYTableData()
    },
    nextYear() {
      this.startYear = (parseInt(this.startYear) + 1).toString();
      this.getYoYTableData()
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [12, 1];
        } else {
          return [0, 0];
        }
      } else if (columnIndex === 1) {
        if (rowIndex === 0) {
          return [12, 1];
        } else {
          return [0, 0];
        }
      } else if (columnIndex === 2 || columnIndex === 3) {
        if (rowIndex % 3 === 0) {
          return [3, 1];
        } else {
          return [0, 0];
        }
      }
    },
    charTableData() {
      this.chartData.map((item, index) => {
        this.tableList1.push(item.mouth + '月')
        this.tableList2.push(item.thisCount)
        if (item.rate) {
          this.tableList3.push(item.rate + '%')
        } else {
          this.tableList3.push(0 + '%')
        }
      })
      // this.tableList1 = ['1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月', '1月',]
    },
    getYoYTableData() {
      let obj = {
        startYear: this.startYear
      }
      this.YoYtableData = [
        { year: '', quarter: '第一季度', month: '1月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第一季度', month: '2月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第一季度', month: '3月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第二季度', month: '4月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第二季度', month: '5月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第二季度', month: '6月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第三季度', month: '7月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第三季度', month: '8月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第三季度', month: '9月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第四季度', month: '10月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第四季度', month: '11月', preCount: '--', thisCount: '--', rate: '--' },
        { year: '', quarter: '第四季度', month: '12月', preCount: '--', thisCount: '--', rate: '--' },
      ],
        this.tableList1 = [],
        this.tableList2 = [],
        this.tableList3 = [],
        analysis(obj).then(res => {
          if (res.code === '0') {
            this.chartData = res.data

            res.data.map((item, index) => {
              if (item.mouth) {            //志杰重新定义月份的英语
                if (this.YoYtableData[item.mouth - 1].month.indexOf(item.mouth) != -1) {
                  if (item.preCount) {
                    this.YoYtableData[item.mouth - 1].preCount = item.preCount
                  }
                  else if (item.thisCount) {
                    this.YoYtableData[item.mouth - 1].thisCount = item.thisCount
                  }
                  if (Number(item.rate)) {
                    this.YoYtableData[item.mouth - 1].rate = item.rate * 100
                  }
                }
              }
            })
            let yearTotal = 0
            let monthTotal1 = 0
            let monthTotal2 = 0
            let monthTotal3 = 0
            let monthTotal4 = 0
            this.YoYtableData.map((item, index) => {
              if (item.thisCount != '--') {
                if (index <= 2) {
                  monthTotal1 += item.thisCount
                } else if (index > 2 & index <= 5) {
                  monthTotal2 += item.thisCount
                } else if (index > 5 & index <= 8) {
                  monthTotal3 += item.thisCount
                } else if (index > 8 & index <= 11) {
                  monthTotal4 += item.thisCount
                }
              }
              if (Number(item.thisCount)) {
                yearTotal += parseFloat(item.thisCount)
              }
            })
            this.YoYtableData[0].quarterProduct = monthTotal1
            this.YoYtableData[3].quarterProduct = monthTotal2
            this.YoYtableData[6].quarterProduct = monthTotal3
            this.YoYtableData[9].quarterProduct = monthTotal4
            this.YoYtableData[0].yearProduct = yearTotal
            if (this.startYear === '') {
              this.YoYtableData[0].year = moment(new Date()).format('YYYY') + '年';
            } else {
              this.YoYtableData[0].year = this.startYear + '年'
            }
            console.log(this.YoYtableData)
            this.charTableData();
            this.getLeftChart();
            this.getRightChart()
          }
        })
    },
    getLeftChart() {
      let myChart = Echarts.init(document.getElementById('monthProduct'));
      let xarr = []
      let yarr1 = []
      let yarr2 = []
      this.chartData.map((item, index) => {
        item.mouth += '月'
        xarr.push(item.mouth)
        yarr1.push(item.thisCount)
        yarr2.push(item.rate)
      })
      let chartTitle = this.startYear + '年成品月度生产情况'
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
          show: false,
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
            name: '数量(台)',
          },
          {
            type: 'value',
            name: '',
            // min: 0,
            // max: 25,
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
          bottom: "0%",
          containLabel: true
        },
        series: [

          {
            name: '月度生产',
            type: 'bar',
            barWidth: "50%",
            data: yarr1,
          },
          {
            name: '成品同比',
            type: 'line',
            yAxisIndex: 1,
            data: yarr2,
          }
        ],
        color: ['rgb(79, 129, 189)', 'rgb(158, 188, 95)']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    },
    //处理季度数据
    getquartval(val) {
      let res = ''
      this.chartData.map((item) => {
        if (Math.ceil(item.mouth.split('月')[0] / 3) === val) {
          res = res + item.thisCount
        }
      })
      return res

    },
    getRightChart() {
      let myChart = Echarts.init(document.getElementById('finishProduct'));
      let monthdata = []
      let yeardata = [
        { value: 100, name: this.startYear + '年' }
      ]

      this.chartData.map((item, index) => {

        if (item.mouth) {
          monthdata.push({ value: item.thisCount, name: item.mouth })
        }

      })
      let arr = []
      for (let a = 1; a <= Math.ceil(this.nowmonth / 3); a++) {
        arr.push({ name: a + '季度', value: this.getquartval(a) })
      }
      let chartTitle = this.startYear + '年成品生产情况'
      let chartYear = this.startYear + '年'
      let option = {
        name: chartTitle,
        title: {
          text: chartTitle,
          top: '5%',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          containLabel: true
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: chartTitle,
            type: 'pie',
            radius: ['5%', '25%'],
            center: ['50%', '55%'],
            label: {
              position: 'inside',
              // show: false
              formatter: '{b} \n{d}%'
            },
            labelLine: {
              show: false
            },
            hoverAnimation: false,
            data: [
              { value: this.YoYtableData[0].yearProduct, name: chartYear },
            ]
          },
          {
            name: chartTitle,
            type: 'pie',
            radius: ['25%', '50%'],
            center: ['50%', '55%'],
            label: {
              position: 'inside',
              // show: false
              formatter: '{b} \n{d}%'
            },
            labelLine: {
              show: false
            },
            hoverAnimation: false,
            data: arr
          },
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            name: chartTitle,
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '55%'],
            label: {
              position: 'inside',
              // show: false
              formatter: '{b} \n{d}%'
            },
            data: monthdata,
          }

        ],
        // color: ['#E24AFF', '#0B76FF', '#00E676']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    },
  }
};
</script>

<style lang="less">
.YoYanalysis {
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
      width: 48%;
      height: 430px;
      .chart {
        width: 100%;
        height: 300px;
      }
      .label {
        padding: 20px;
        display: flex;
        flex: 1;
        table {
          border-collapse: collapse;
          border: 1px solid black;
          width: 100%;
          tr {
            width: 100%;
            font-size: 14px;
            th {
              width: 13%;
              padding: 5px 0;
              border: 1px solid black;
              // vertical-align: center;
              text-align: center;
              .legend1 {
                height: 10px;
                width: 15px;
                background: rgb(79, 129, 189);
                display: inline-block;
              }
              .legend2 {
                height: 6px;
                width: 15px;
                background: rgb(158, 188, 95);
                display: inline-block;
              }
            }
            td {
              padding: 5px 0;
              width: 7%;
              border: 1px solid black;
              // vertical-align: center;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>