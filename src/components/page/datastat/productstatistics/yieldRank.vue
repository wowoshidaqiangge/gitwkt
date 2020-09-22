<template>
  <div class="yieldRank">
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
        <div style="flex:1">
          <el-button type="primary" style="float:right" @click="handleExcel">EXCEL导出</el-button>
        </div>
      </el-row>

    </div>
    <div class="middle">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <div class="chartBox" id="yieldRankChart"></div>
    </div>
  </div>

</template>
<script>
import moment from 'moment';
import Echarts from 'echarts'
import ElementUI from 'element-ui';
import { yieldRank } from 'api/tool'
import { export2Excel } from '@/utils/util.js';
export default {
  name: 'yieldRank',
  components: {
  },
  data() {
    return {
      dayDate: [],
      tableData: [],
      chartData: [],
      columnlist: [
        { prop: 'rank', label: '成品产量排序' },
        { prop: 'productCode', label: '物料编码' },
        { prop: 'productName', label: '物料名称' },
        { prop: 'model', label: '规格型号' },
        { prop: 'produceCount', label: '产量' },
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
    this.dayDate[0] = `${moment(new Date()).format('YYYY')}-1-1`
    this.dayDate[1] = moment(new Date()).format('YYYY-MM-DD')
  },
  methods: {
    // 导出EXCEL
    handleExcel() {
      let time = moment(new Date()).format("YYYYMMDD")
      export2Excel(this.columnlist, this.tableData, `产量排序-${time}`).then(() => {
        this.$message.success('导出成功');
      })
    },
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
      yieldRank(obj).then(res => {
        if (res.code === '0') {
          this.chartData = res.data
          res.data.map((item, index) => {
            item.rank = res.data.length - index
          })
          this.tableData = res.data
        }
        this.getChart();
      })

    },
    getChart() {
      let myChart = Echarts.init(document.getElementById('yieldRankChart'));
      let xarr = []
      let yarr = []
      this.chartData.map((item, index) => {
        xarr.push(item.productName)
        yarr.push(item.produceCount)
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
          x: "90%",
          y: "45%",
          orient: 'vertical',
          data: ["成品产量"],

        },
        yAxis: [
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
        xAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            // max: 100,
            // interval: 50,
            // axisLabel: {
            //   formatter: '{value} %'
            // }
          }
        ],
        grid: {
          left: "5%",
          right: "13%",
          // height: "100%",
          // top: "20%",
          // bottom: "5%",
          containLabel: true
        },
        series: [
          {
            name: '成品产量',
            type: 'bar',
            barWidth: "50%",
            data: yarr,
            label: {
              show: true,
              position: 'right'
            }
          }
        ],
        color: ['rgb(79,129,189)']
      };
      myChart.setOption(option, (window.onresize = myChart.resize));
    },
  }
};
</script>

<style lang="less">
.yieldRank {
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