<template>
  <div class="hisSalary-detail" v-show="tabIndex === 1">
    <div class="detail__top">
      <h4 class="top__left">历史工资 — 详情</h4>
      <el-button type="add" icon="el-icon-back" @click="handleClose">返回</el-button>
    </div>
    <el-row :gutter="10" class="content__top" type="flex" justify="start">
      <el-col :span="3">
        <span class="param__label">日期：</span>
        <span class="param__value">{{ param.startTime }}</span>
      </el-col>
      <el-col :span="6">
        <span class="param__label">工序选择：</span>
        <el-select v-model="param.workprocessId" placeholder="请选择工序" clearable filterable>
          <el-option
            v-for="(item, index) in workprocessOptions"
            :key="index"
            :label="item.workprocessName"
            :value="item.workprocessId"
            @click.native="workprocessChange(item)"
          >
          </el-option>
        </el-select>
      </el-col>
      <div class="top__btn">
        <el-button type="add" @click="handleQuery">查询</el-button>
        <el-button type="add" v-show="$_has('HISTORYSALARYEXPORT')" @click="handleExcel">EXCEL 导出</el-button>
      </div>
    </el-row>
    <div class="content__box">
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column label="生产日期" prop="day" width="120" align="center"> </el-table-column>
        <el-table-column
          v-show="!isSide"
          v-for="(item, index) in columnlist"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-show="isSide"
          v-for="(item, index) in columnlist2"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <el-table-column
            v-for="(item, index) in item.children"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column label="parentData.name" prop="total" align="center"> </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import { getHisSalaryDetail, getProcessListById } from 'api/salary';
import { export2Excel, export2Excel1, isNum } from '@/utils/util.js';
export default {
  name: 'hisSalaryDetail',
  props: { tabIndex: { type: Number, default: 0 } },
  data() {
    return {
      param: {
        userId: '',
        workprocessId: '',
        startTime: '' // 2020-06
      },
      parentData: {},
      workprocessOptions: [],
      loading: false,
      tableData: [],
      tableFooter: {
        price: '',
        pprice: '',
        cprice: ''
      },
      columnlist: [],
      columnlist2: [], // 侧面磨
      specialWorkprocessId: '60', // 侧面磨Id
      specialWorkprocessCode: '2006', // 侧面磨编码
      isSide: false,
      curWorkprocessName: ''
    };
  },
  created() {},
  computed: {},
  methods: {
    async init(row, param) {
      this.parentData = row || {};
      this.param.userId = row.userId || '';
      this.param.startTime = param.startTime;
      this.getWorkprocessList(row.userId, param.startTime);
    },
    getWorkprocessList(id, startTime) {
      const obj = {
        userId: id,
        startTime: startTime
      };
      getProcessListById(obj).then(res => {
        this.workprocessOptions = res.data;
        this.workprocessChange(this.workprocessOptions[0]); // 选中第一个
      });
    },
    workprocessChange(val) {
      this.param.workprocessId = val.workprocessId;
      this.param.workprocessType = val.workprocessType;
      this.curWorkprocessName = val.workprocessName;
      if (val.workprocessType == 6) {
        // 只有侧面磨的工序类型是6
        this.isSide = true;
      } else {
        this.isSide = false;
      }
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      this.columnlist.length = 0;
      this.columnlist2.length = 0;
      this.tableData.length = 0;
      this.loading = true;
      for (const key in this.param) {
        if (this.param[key] === '') {
          delete this.param[key];
        }
      }
      getHisSalaryDetail(this.param)
        .then(res => {
          if (res.code == 0) {
            res = res.data;

            if (this.isSide) {
              // 侧面磨工资
              // 处理表头列
              for (let i = 0; i < res.colInfo.length; i++) {
                const obj = {
                  label: res.colInfo[i],
                  prop: `model${i + 1}`,
                  children: [
                    { label: 'P', prop: `model${i + 1}P` },
                    { label: 'C', prop: `model${i + 1}C` }
                  ]
                };
                this.columnlist2.push(obj);
              }
              this.columnlist2.push({
                label: '统计',
                prop: 'static',
                children: [
                  { label: 'P', prop: `staticP` },
                  { label: 'C', prop: `staticC` }
                ]
              });
              this.columnlist2.push({
                label: `${this.parentData.name}`,
                prop: 'staticPC',
                children: []
              });
              console.table(this.columnlist2);

              const { price, pprice, cprice } = res.dataInfo[0];
              this.tableFooter = { price, pprice, cprice };
              const originLen = res.dataInfo.length; // 返回的天数

              // 处理每天下，每个型号的产量
              res.dataInfo.map((item, index) => {
                item.productList.map((i, x) => {
                  const key1 = this.columnlist2[x].children[0].prop;
                  const val1 = i.pcount && i.pcount !== '' ? parseInt(i.pcount) : 0;
                  item[key1] = val1;
                  const key2 = this.columnlist2[x].children[1].prop;
                  const val2 = i.ccount && i.ccount !== '' ? parseInt(i.ccount) : 0;
                  item[key2] = val2;
                });
                item['staticPC'] = item['staticC'] + item['staticP'];
              });

              // 处理产量：对应型号的 每一天产量和。但侧面磨需要分p c的产量和
              const obj = { day: '月产量' };
              for (let i = 0; i < this.columnlist2.length - 1; i++) {
                const key1 = this.columnlist2[i].children[0].prop;
                let modelCountP = 0;
                for (let j = 0; j < originLen; j++) {
                  if (isNum(res.dataInfo[j][key1])) {
                    modelCountP += parseInt(res.dataInfo[j][key1]);
                  } else {
                    modelCountP += 0;
                  }
                }
                obj[key1] = modelCountP;

                const key2 = this.columnlist2[i].children[1].prop;
                let modelCountC = 0;
                for (let j = 0; j < originLen; j++) {
                  if (isNum(res.dataInfo[j][key2])) {
                    modelCountC += parseInt(res.dataInfo[j][key2]);
                  } else {
                    modelCountC += 0;
                  }
                }
                obj[key2] = modelCountC;
              }
              obj['staticPC'] = obj['staticC'] + obj['staticP'];
              res.dataInfo.push(obj);

              //处理单价：都一样，但侧面磨需要分p c
              const obj2 = { day: '单价（元/支）' };
              for (let i = 0; i < this.columnlist2.length - 2; i++) {
                const key1 = this.columnlist2[i].children[0].prop;
                obj2[key1] = this.tableFooter.pprice;
                const key2 = this.columnlist2[i].children[1].prop;
                obj2[key2] = this.tableFooter.cprice;
              }
              obj2['staticP'] = 'P工资';
              obj2['staticC'] = 'C工资';
              obj2['staticPC'] = '月工资';
              res.dataInfo.push(obj2);

              // 处理工资：产量*单价,总工资再累加
              let totalP = 0,
                totalC = 0;
              const obj3 = { day: '实得工资（元）' };
              for (let i = 0; i < this.columnlist2.length - 2; i++) {
                const key1 = this.columnlist2[i].children[0].prop;
                // obj3[key1] = (obj[key1] * obj2[key1]).toFixed(2);
                obj3[key1] = res.salaryResult[2 * i]; // 单列工资
                // total += parseFloat(obj3[key]); //总工资

                if (isNum(obj3[key1])) {
                  totalP += parseFloat(obj3[key1]);
                } else {
                  totalP += 0;
                }

                const key2 = this.columnlist2[i].children[1].prop;
                // obj3[key2] = obj[key2] * obj2[key2];
                obj3[key2] = res.salaryResult[2 * i + 1]; // 单列工资

                if (isNum(obj3[key2])) {
                  totalC += parseFloat(obj3[key2]);
                } else {
                  totalC += 0;
                }
              }
              obj3['staticP'] = totalP;
              obj3['staticC'] = totalC;
              obj3['staticPC'] = (totalP + totalC).toFixed(2);
              res.dataInfo.push(obj3);

              this.tableData = res.dataInfo;
              console.log(this.tableData);
            } else {
              // 正常非侧面磨
              // 处理表头列
              console.log(this.isSide);
              for (let i = 0; i < res.colInfo.length; i++) {
                const obj = {
                  label: res.colInfo[i],
                  prop: `model${i + 1}`
                };
                this.columnlist.push(obj);
              }
              this.columnlist.push({ label: `${this.parentData.name}`, prop: 'static' });
              console.table(this.columnlist);

              const { price, pprice, cprice } = res.dataInfo[0];
              this.tableFooter = { price, pprice, cprice };
              const originLen = res.dataInfo.length; // 返回的天数

              // 处理每天下，每个型号的产量
              res.dataInfo.map((item, index) => {
                item.productList.map((i, x) => {
                  const key = this.columnlist[x].prop;
                  const val = i.count && i.count !== '' ? parseInt(i.count) : 0;
                  item[key] = val;
                });
              });

              // 处理产量：对应型号的 每一天产量和。但侧面磨需要分p c的产量和
              const obj = { day: '月产量' };
              this.columnlist.map((item, index) => {
                const key = item.prop;
                let modelCount = 0;
                for (let i = 0; i < originLen; i++) {
                  if (isNum(res.dataInfo[i][key])) {
                    modelCount += parseInt(res.dataInfo[i][key]);
                  } else {
                    modelCount += 0;
                  }
                }
                obj[key] = modelCount;
              });
              res.dataInfo.push(obj);

              //处理单价：都一样，但侧面磨需要分p c
              const obj2 = { day: '单价（元/支）' };
              for (let item of this.columnlist) {
                const key = item.prop;
                obj2[key] = this.tableFooter.price;
              }
              obj2['static'] = '月工资';
              res.dataInfo.push(obj2);

              // 处理工资：产量*单价,总工资再累加
              // console.log(res.salaryResult);
              let total = 0;
              const obj3 = { day: '实得工资（元）' };
              for (let i = 0; i < this.columnlist.length - 1; i++) {
                const key = this.columnlist[i].prop;
                // obj3[key] = (obj[key] * obj2[key]).toFixed(2); // 单列工资
                // total += parseFloat(obj3[key]); //总工资
                obj3[key] = res.salaryResult[i]; // 单列工资
                total += parseFloat(obj3[key]); //总工资
              }
              obj3['static'] = total;
              res.dataInfo.push(obj3);
              this.tableData = res.dataInfo;
            }
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error);
        });
    },

    // 条件查询
    handleQuery() {
      this.getTableData();
    },
    // Excel
    handleExcel() {
      let suffix = `${this.parentData.name}-${this.param.startTime}`;
      if (this.curWorkprocessName !== '') {
        suffix = `${suffix}-${this.curWorkprocessName}`;
      }
      if (this.isSide) {
        //侧面磨的多表头表格导出
        const colLen = this.columnlist2.length; // 所有原始列（型号列（不定）、统计列、最后人名的统计列）
        let filterVal = ['day'];
        let columns = ['']; // 一级表头列
        let multiHeader = []; // 二级，最后必须是二维数组
        let multiHeaderChild = ['生产日期'];

        for (let item of this.columnlist2) {
          if (item.children && item.children.length > 1) {
            filterVal.push(item.children[0].prop);
            filterVal.push(item.children[1].prop);

            multiHeaderChild.push(item.label);
            multiHeaderChild.push('');
            columns.push('P');
            columns.push('C');
          } else {
            filterVal.push(item.prop);
            multiHeaderChild.push(item.label);
            columns.push('');
          }
        }
        multiHeader[0] = multiHeaderChild;
        // TODO：列不定，不好做。不过由于实际列数不是太多，暂时可以这么做:
        const mergesOption = [
          'A1:A2',
          'B1:C1',
          'D1:E1',
          'F1:G1',
          'H1:I1',
          'J1:K1',
          'L1:M1',
          'N1:O1',
          'P1:Q1',
          'R1:S1',
          'T1:U1',
          'V1:W1',
          'X1:Y1',
          'Z1:AA1',
          'AB1:AC1',
          'AD1:AE1',
          'AF1:AG1',
          'AH1:AI1',
          'ABJ:AK1',
          'AL1:AM1',
          'AN1:AO1',
          'AP1:AQ1',
          'AR1:AS1',
          'AT1:AU1',
          'AV1:AW1',
          'AX1:AY1',
          'AZ1:BA1',
          'BB1:BC1',
          'BD1:BE1',
          'BF1:BG1',
          'BH1:BI1',
          'BJ1:BK1',
          'BL1:BM1',
          'BN1:BO1',
          'BP1:BQ1',
          'BR1:BS1',
          'BT1:BU1',
          'BV1:BW1',
          'BX1:BY1'
        ];
        const mergesOption2 = [
          'A1:A2',
          'B1:B2',
          'C1:C2',
          'D1:D2',
          'E1:E2',
          'F1:F2',
          'G1:G2',
          'H1:H2',
          'I1:I2',
          'J1:J2',
          'K1:K2',
          'L1:L2',
          'M1:M2',
          'N1:N2',
          'O1:O2',
          'P1:P2',
          'Q1:Q2',
          'R1:R2',
          'S1:S2',
          'T1:T2',
          'U1:U2',
          'V1:V2',
          'W1:W2',
          'X1:X2',
          'Y1:Y2',
          'Z1:Z2',
          'AA1:AA2',
          'AB1:AB2',
          'AC1:AC2',
          'AD1:AD2',
          'AE1:AE2',
          'AF1:AF2',
          'AG1:AG2',
          'AH1:AH2',
          'AI1:AI2',
          'AJ1:AJ2',
          'AK1:AK2',
          'AL1:AL2',
          'AM1:AM2',
          'AN1:AN2',
          'AO1:AO2',
          'AP1:AP2',
          'AQ1:AQ2',
          'AR1:AR2',
          'AS1:AS2',
          'AT1:AT2',
          'AU1:AU2',
          'AV1:AV2',
          'AW1:AW2',
          'AX1:AX2',
          'AY1:AY2',
          'AZ1:AZ2',
          'BA1:BA2',
          'BB1:BB2',
          'BC1:BC2',
          'BD1:BD2',
          'BE1:BE2',
          'BF1:BF2',
          'BG1:BG2',
          'BH1:BH2',
          'BI1:BI2',
          'BJ1:BJ2',
          'BK1:BK2',
          'BL1:BL2',
          'BM1:BM2',
          'BN1:BN2',
          'BO1:BO2',
          'BP1:BP2',
          'BQ1:BQ2',
          'BR1:BR2',
          'BS1:BS2',
          'BT1:BT2',
          'BU1:BU2',
          'BV1:BV2',
          'BW1:BW2',
          'BX1:BX2',
          'BY1:BY2',
          'BZ1:BZ2'
        ];
        let merges = mergesOption.splice(0, colLen);
        merges.push(mergesOption2[2 * colLen - 1]);
        export2Excel1(columns, this.tableData, `历史工资详情-${suffix}`, filterVal, multiHeader, [], merges);
        this.$message.success('导出成功');
      } else {
        const arr = [{ label: '生产日期', prop: 'day' }];
        const cols = arr.concat(this.columnlist);
        export2Excel(cols, this.tableData, `历史工资详情-${suffix}`);
        debugger;
        this.$message.success('导出成功');
      }
    },
    // 返回
    handleClose() {
      this.param.userId = '';
      this.param.startTime = '';
      this.param.workprocessId = '';
      this.columnlist.length = 0;
      this.columnlist2.length = 0;
      this.tableData.length = 0;
      this.$emit('closeModal');
    }
  }
};
</script>

<style lang="less" scoped>
.hisSalary-detail {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 0 0 2rem 0;

  .detail__top {
    border: 1px solid #e6ebf1;
    height: 50px;
    background-color: rgb(230, 235, 241);
    padding: 0 10px;
    display: flex;
    align-items: center;
    .top__left {
      flex: 1;
      color: rgb(50, 25, 112);
      font-weight: 600;
    }
  }
  .el-row {
    margin: 1rem 0;
    .el-col {
      display: flex;
      margin: 1rem 0;

      .param__label {
        color: rgb(50, 25, 112);
        line-height: 2rem;
      }
      .param__value {
        line-height: 2rem;
      }
    }
    .el-col:nth-child(1) {
      margin-left: 1rem;
      min-width: 120px;
    }

    .top__btn {
      min-width: 205px;
      margin: 1rem 0;

      .el-button {
        margin-left: 1rem;
      }
      .el-button:nth-child(2) {
        margin-left: 2rem;
      }
    }
  }

  .content__box {
    .el-table {
      width: 98%;
      margin-left: 1%;
    }
  }
}
</style>
