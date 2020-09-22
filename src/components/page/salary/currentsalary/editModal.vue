<template>
  <div class="editModal">
    <el-dialog :title="title" :visible="dialogVisible" id="myDialog" width="70%" :before-close="beforeClose" center>
      <div class="detail__info">
        <p class="info__title">基本信息：</p>
        <div class="info__items">
          <div class="info__item">
            <span class="item__label">生产工单：</span>
            <span class="item__value">{{ formData.taskNumber }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">物料编码：</span>
            <span class="item__value">{{ formData.itemCode }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">物料图号：</span>
            <span class="item__value">{{ formData.itemNumber }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">物料名称：</span>
            <span class="item__value">{{ formData.itemName }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">规格型号：</span>
            <span class="item__value">{{ formData.model }}</span>
          </div>
          <div class="info__item" v-if="type !== 1">
            <span class="item__label">生产数量：</span>
            <span class="item__value">{{ formData.produceCount }}</span>
          </div>
          <!-- <div class="info__item" v-if="type !== 1">
            <span class="item__label">计划产量：</span>
            <span class="item__value">{{ formData.planManhourAvgyield }}</span>
          </div> -->
          <div class="info__item" v-else>
            <span class="item__label">生产部门：</span>
            <span class="item__value">{{ formData.deptName }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">计划开始时间：</span>
            <span class="item__value">{{ formData.planStartTime }}</span>
          </div>
          <div class="info__item">
            <span class="item__label">计划结束时间：</span>
            <span class="item__value">{{ formData.planEndTime }}</span>
          </div>
        </div>
      </div>
      <div class="tablebox">
        <el-table :data="tableData" v-if="type !== 1" stripe border style="width: 96%;margin: 0 auto">
          <el-table-column label="序号" prop="index" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="加工内容" prop="" align="center">
            <el-table-column
              v-for="item in columnlist.slice(0, 2)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-for="item in columnlist.slice(2, 10)"
            :key="item.label"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
          </el-table-column>
          <el-table-column label="质量检验结果（件）" prop="" align="center">
            <el-table-column
              v-for="item in columnlist.slice(10, 18)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
            <el-table-column label="首检" prop="" align="center">
              <!-- <el-table-column label="班组长" prop="firstCheckSquadUser" align="center"></el-table-column>
              <el-table-column label="检验员" prop="firstCheckExamUser" align="center"></el-table-column> -->
              <el-table-column
                v-for="item in columnlist.slice(18, 20)"
                :key="item.label"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column
              v-for="item in columnlist.slice(20)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-table v-else :data="tableData" stripe border style="width: 96%;margin: 0 auto">
          <el-table-column label="序号" prop="index" width="60" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="加工内容" prop="" align="center">
            <el-table-column
              v-for="item in columnlist.slice(0, 2)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-for="item in columnlist.slice(2, 4)"
            :key="item.label"
            :width="item.width"
            :prop="item.prop"
            :label="item.label"
            align="center"
          >
          </el-table-column>
          <el-table-column label="质量检验结果（件）" prop="" align="center">
            <el-table-column
              v-for="item in columnlist.slice(4, 13)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
            <el-table-column label="首检" prop="" align="center">
              <!-- <el-table-column label="班组长" prop="firstCheckSquadUser" align="center"></el-table-column>
              <el-table-column label="检验员" prop="firstCheckExamUser" align="center"></el-table-column> -->
              <el-table-column
                v-for="item in columnlist.slice(13, 15)"
                :key="item.label"
                :width="item.width"
                :prop="item.prop"
                :label="item.label"
                align="center"
              >
              </el-table-column>
            </el-table-column>
            <el-table-column
              v-for="item in columnlist.slice(15)"
              :key="item.label"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
              align="center"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="detail__form">
        <p class="info__title">结算信息：</p>
        <el-form v-if="type !== 1" :model="formData" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item label="结算方式" prop="accountType">
            <el-select v-model="formData.accountType" placeholder="选择结算方式" @change="handleTypeChange">
              <el-option
                v-for="(item, index) in accountTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-num2" label="计时单价" prop="hourlyPrice">
            <el-select
              v-model="formData.hourlyPrice"
              filterable
              allow-create
              default-first-option
              placeholder="选择或创建计时单价"
              :disabled="disableFlag"
              @change="hourlyPriceChange"
            >
              <el-option v-for="item in hourlyPriceOptions" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
            <span>&nbsp;&nbsp;元/小时</span>
          </el-form-item>
          <el-form-item class="form-num2" label="计时时间" prop="manHour">
            <el-input v-model.number="formData.manHour" placeholder="" :disabled="disableFlag"></el-input>
            <span>&nbsp;&nbsp;小时</span>
          </el-form-item>
          <el-form-item label="计件单价" prop="">
            <div class="item__text">
              <span class="item__item">合格品P: {{ formData.qualifiedPrice }} 元/件</span>
              <span class="item__item">让步工H: {{ formData.concessionPrice }} 元/件</span>
              <span class="item__item">降级工C: {{ formData.demotionPrice }} 元/件</span>
            </div>
          </el-form-item>
          <el-form-item label="补" prop="supplement">
            <el-input v-model.number="formData.supplement" placeholder=""></el-input>
            <span>&nbsp;&nbsp;件</span>
          </el-form-item>

          <el-form-item label="班组长首检">
            <el-switch v-model="formData.firstCheckSquad" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="工资金额" prop="salary">
            <el-input v-model="formData.salary" placeholder="" disabled></el-input>
            <span>&nbsp;&nbsp;元</span>
          </el-form-item>
          <el-form-item label="点击计算">
            <el-button type="add" @click="handleCalc()">计算</el-button>
          </el-form-item>
          <el-form-item label="核对完毕" prop="state">
            <el-switch v-model="formData.state" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
        <el-form v-else :model="formData" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item label="计件单价" prop="">
            <div class="item__text">
              <span class="item__item">合格品P: {{ formData.qualifiedPrice }} 元/件</span>
              <span class="item__item">让步工H: {{ formData.concessionPrice }} 元/件</span>
              <span class="item__item">降级工C: {{ formData.demotionPrice }} 元/件</span>
            </div>
          </el-form-item>

          <el-form-item class="form2-num2" label="合格数量" prop="qualified">
            <el-input v-model.number="formData.qualified" placeholder="" :disabled="isSide"></el-input>
            <span>&nbsp;&nbsp;件</span>
          </el-form-item>
          <el-form-item class="form2-num2" label="不合格数量" prop="unQualified">
            <el-input v-model.number="formData.unQualified" placeholder="" :disabled="isSide"></el-input>
            <span>&nbsp;&nbsp;件</span>
          </el-form-item>
          <el-col :span="24"
            ><el-form-item class="form2-num3" label="P级数量" prop="pNums">
              <el-input v-model.number="formData.pNums" placeholder="" :disabled="!isSide"></el-input>
              <span>&nbsp;&nbsp;件</span>
            </el-form-item>
            <el-form-item class="form2-num3" label="H级数量" prop="hNums">
              <el-input v-model.number="formData.hNums" placeholder="" :disabled="!isSide"></el-input>
              <span>&nbsp;&nbsp;件</span>
            </el-form-item>
            <el-form-item class="form2-num3" label="C级数量" prop="cNums">
              <el-input v-model.number="formData.cNums" placeholder="" :disabled="!isSide"></el-input>
              <span>&nbsp;&nbsp;件</span>
            </el-form-item></el-col
          >

          <el-form-item class="form2-num2" label="报废数量" prop="scrapNums">
            <el-input v-model.number="formData.scrapNums" placeholder=""></el-input>
            <span>&nbsp;&nbsp;件</span>
          </el-form-item>
          <el-form-item class="form2-num2" label="补" prop="supplement">
            <el-input v-model.number="formData.supplement" placeholder=""></el-input>
            <span>&nbsp;&nbsp;件</span>
          </el-form-item>

          <el-form-item label="班组长首检" prop="firstCheckSquad">
            <el-switch v-model="formData.firstCheckSquad" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="工资金额" prop="salary">
            <el-input v-model="formData.salary" placeholder="" disabled></el-input>
            <span>&nbsp;&nbsp;元</span>
          </el-form-item>
          <el-form-item label="点击计算" prop="">
            <el-button type="add" @click="handleCalc()">计算</el-button>
          </el-form-item>
          <el-form-item label="核对完毕" prop="state">
            <el-switch v-model="formData.state" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button class="btn--cancel" @click="handleClose">取 消</el-button>
        <el-button type="add" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSalaryQuality, getSalaryInfo, calcSalary, updateSalary } from '@/api/salary';
import { isEmpty } from '@/utils/util';

export default {
  name: 'editModal',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      accountTypeOptions: [
        { label: '方式一：计件', value: 1 },
        { label: '方式二：计时', value: 2 },
        { label: '方式三：计件和计时', value: 3 }
      ],
      hourlyPriceOptions: [25, 18.75, 16.25, 15],
      disableFlag: false,
      tableData: [],
      columnlist: [],
      columnlist1: [
        { prop: 'workKind', label: '工种', width: 50 },
        { prop: 'workprocessName', label: '工序', width: 60 },

        { prop: 'assignUser', label: '派工人员' },
        { prop: 'assignTime', label: '派工日期' },
        { prop: 'deviceNumber', label: '设备编号' },
        { prop: 'name', label: '工作人员' },
        // { prop: 'accountType, label: '结算方式' }, // 1-计件，2-计时，3-计件、计时组合
        { prop: 'accountTypeName', label: '结算方式' }, // 1-计件，2-计时，3-计件、计时组合
        { prop: 'hourlyPrice', label: '计时工价', width: 50 },
        { prop: 'manHour', label: '计时时间', width: 50 },
        { prop: 'assignCount', label: '派件数量', width: 50 },
        { prop: 'industrialWaste', label: '工废', width: 50 },
        { prop: 'scrapWaste', label: '料废', width: 50 },
        { prop: 'gH', label: '让步工H', width: 50 },
        { prop: 'gC', label: '降级工C', width: 50 },
        { prop: 'lH', label: '让步料H', width: 50 },
        { prop: 'lC', label: '降级料C', width: 50 },
        { prop: 'qualified', label: '合格P', width: 50 },
        { prop: 'supplement', label: '补', width: 50 },

        { prop: 'firstCheckSquadUser', label: '班组长' },
        { prop: 'firstCheckExamUser', label: '检验员' },

        { prop: 'secondCheckExamUser', label: '巡检' },
        { prop: 'finishCheckExamUser', label: '完检' },
        { prop: 'finishTime', label: '完成时间' }
      ],
      columnlist2: [
        { prop: 'workKind', label: '工种', width: 50 },
        { prop: 'workprocessName', label: '工序', width: 60 },
        { prop: 'name', label: '工作人员' },
        { prop: 'assignCount', label: '派件数量' },
        { prop: 'produceCount', label: '实际完成数量' },
        { prop: 'qualified', label: '合格数量', width: 50 },
        { prop: 'unQualified', label: '不合格数量', width: 60 },
        { prop: 'pNums', label: 'P级数量', width: 50 },
        { prop: 'hNums', label: 'H级数量', width: 50 },
        { prop: 'cNums', label: 'C级数量', width: 50 },
        { prop: 'scrapNums', label: '报废数量', width: 50 },
        { prop: 'supplement', label: '补', width: 50 },
        { prop: 'remark', label: '不合格原因' },
        { prop: 'firstCheckSquadUser', label: '班组长' },
        { prop: 'firstCheckExamUser', label: '检验员' },
        { prop: 'secondCheckExamUser', label: '巡检' },
        { prop: 'finishCheckExamUser', label: '完检' },
        { prop: 'finishTime', label: '完成时间' }
      ],
      formData: {},
      rules: {
        accountType: [{ required: true, message: '请选择计价方式', trigger: 'blur' }],
        hourlyPrice: [
          { required: true, trigger: 'blur', message: '不能为空' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入数字,可保留两位小数'
          }
        ],
        manHour: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        // supplement: [{ type: 'number', required: true, message: '输入必须为整数', trigger: 'blur' }],
        supplement: [{ required: true, message: '输入必须为整数', trigger: 'blur' }],

        // 线轨：
        qualified: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        unQualified: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        pNums: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        hNums: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        cNums: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }],
        scrapNums: [{ type: 'number', required: true, min: 0, trigger: 'blur', message: '输入必须为正整数' }]
      },
      type: '', // 线轨1，非线轨（一部加二部滑块）空
      // specialWorkprocessCode: '2006', // 侧面磨编码
      isSide: false // 线轨工资下面还要分工序是否综合检验
    };
  },
  created() {},
  watch: {},
  methods: {
    getDetailData(row, type) {
      console.log(row, type);

      this.type = type || ''; // 是否线轨
      // this.isSide = row.workprocessCode === this.specialWorkprocessCode ? true : false; // 是否侧面磨
      this.isSide = row.workprocessType == 6 ? true : false; // 是否综合检验类型
      if (this.type === 1) {
        // 如果线轨
        this.columnlist = this.columnlist2;
      } else {
        this.columnlist = this.columnlist1;
      }
      // 深拷贝工资信息，但是这些信息还要查工资接口进行更新覆盖
      this.formData = JSON.parse(JSON.stringify(row));

      // 质检信息，必须查质检表中的数据：
      const obj1 = { qualityId: row.qualityId, staffId: row.staffId };
      getSalaryQuality(obj1).then(res => {
        this.tableData.length = 0;
        const accountTypeNames = ['-', '计件', '计时', '计件、计时组合'];
        if (res.data.accountType) {
          res.data.accountType = parseInt(res.data.accountType);
          res.data.accountTypeName = accountTypeNames[res.data.accountType];
        }
        res.data.state = res.data.state ? res.data.state.toString() : '0';
        res.data.firstCheckSquad = res.data.firstCheckSquad ? res.data.firstCheckSquad.toString() : '1';
        res.data.assignUser = res.data.assignUser ? res.data.assignUser.split('"')[1] : '';
        res.data.assignTime = res.data.assignTime ? res.data.assignTime.split(' ')[0] : '';
        res.data.firstCheckSquadUser = res.data.firstCheckSquadUser ? res.data.firstCheckSquadUser.split('"')[1] : '';
        res.data.firstCheckExamUser = res.data.firstCheckExamUser ? res.data.firstCheckExamUser.split('"')[1] : '';
        res.data.secondCheckExamUser = res.data.secondCheckExamUser ? res.data.secondCheckExamUser.split('"')[1] : '';
        res.data.finishCheckExamUser = res.data.finishCheckExamUser ? res.data.finishCheckExamUser.split('"')[1] : '';
        res.data.finishTime = res.data.finishTime ? res.data.finishTime.split(' ')[0] : '';
        this.tableData.push(res.data);
      });

      // 结算信息，查到后更新覆盖拿到的row：
      let salaryData = {};
      const { produceTaskPlanId, workprocessId, workprocessType, remark, state, pNums, hNums, cNums, scrapNums } = row;
      const obj2 = { produceTaskPlanId, workprocessId, workprocessType, remark, state, pNums, hNums, cNums, scrapNums };
      getSalaryInfo(obj2).then(res => {
        res = res.data;
        for (let key in res) {
          if (typeof res[key] == 'undefined' || res[key] == null || res[key] == '') {
            res[key] = 0;
          }
        }
        if (res.firstCheckSquad != null) {
          res.firstCheckSquad = res.firstCheckSquad.toString();
        } else {
          res.firstCheckSquad = '1';
        }
        salaryData = res;

        // 使用上次计算审核更新的数据，覆盖除表格之外的质检数据
        const keys1 = ['accountType', 'manHour', 'hourlyPrice', 'supplement', 'salary', 'firstCheckSquad'];
        const keys2 = [
          'qualified',
          'unQualified',
          'pNums',
          'cNums',
          'hNums',
          'scrapNums',
          'supplement',
          'salary',
          'firstCheckSquad'
        ];
        if (this.type == 1) {
          for (let key of keys2) {
            this.formData[key] = salaryData[key];
          }
        } else {
          for (let key of keys1) {
            this.formData[key] = salaryData[key];
          }
        }
        // this.$forceUpdate();
        console.log(this.formData);
        // debugger;
      });
      this.handleTypeChange(this.formData.accountType);

      // 如果质检返回的数据和查到的工资数据里面都没有这些字段值，就置0
      this.formData.qualifiedPrice = this.formData.qualifiedPrice || 0;
      this.formData.concessionPrice = this.formData.concessionPrice || 0;
      this.formData.demotionPrice = this.formData.demotionPrice || 0;
      this.formData.qualified = this.formData.qualified || 0;
      this.formData.unQualified = this.formData.unQualified || 0;
      this.formData.pNums = this.formData.pNums || 0;
      this.formData.hNums = this.formData.hNums || 0;
      this.formData.cNums = this.formData.cNums || 0;
      this.formData.scrapNums = this.formData.scrapNums || 0;
      this.formData.supplement = this.formData.supplement || 0;
      console.log(this.formData);
      this.$forceUpdate();
    },

    handleTypeChange(val) {
      console.log(typeof val, val);
      if (val == 1) {
        this.disableFlag = true;
        this.formData.hourlyPrice = this.formData.hourlyPrice || 0;
        this.formData.manHour = this.formData.manHour || 0;
      } else {
        this.disableFlag = false;
      }
    },
    hourlyPriceChange(val) {
      this.$forceUpdate();
    },
    handleCalc() {
      const {
        accountType,
        firstCheckSquad,
        hourlyPrice,
        manHour,
        qualifiedPrice,
        concessionPrice,
        demotionPrice,
        gH,
        gC,
        lC,
        lH,
        qualified,
        supplement,
        pNums,
        hNums,
        cNums,
        workprocessType
      } = this.formData;
      let obj = {
        type: this.type,
        isSide: this.isSide,
        accountType,
        firstCheckSquad,
        hourlyPrice: Number(hourlyPrice),
        manHour,
        qualifiedPrice,
        concessionPrice,
        demotionPrice,
        gH,
        gC,
        lC,
        lH,
        qualified,
        supplement,
        pNums,
        hNums,
        cNums,
        workprocessType
      };
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          calcSalary(obj).then(res => {
            if (res.code == 0) {
              this.$message.success(`计算成功`);
              this.formData.salary = res.data;
              this.$forceUpdate();
            }
          });
        } else {
          this.$message.error('请检查输入');
        }
      });
    },
    // 提交表单
    handleSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.formData.state == 1 && this.formData.salary !== '') {
            delete this.formData.firstCheckSquadUser;
            delete this.formData.firstCheckExamUser;
            delete this.formData.secondCheckExamUser;
            delete this.formData.firstCheckExamUser;
            this.formData.firstcheckSquad = this.formData.firstCheckSquad;

            updateSalary(this.formData).then(res => {
              if (res.code == 0) {
                this.$message.success(`更新成功`);
                this.handleUpdate();
              }
            });
          } else {
            this.$message.warning('注意：请先核算工资');
          }
        }
      });
    },
    handleUpdate() {
      this.handleClose();
      this.$emit('updateData');
    },
    beforeClose(done) {
      // this.$refs.ruleForm.resetFields();
      this.$refs.ruleForm.clearValidate();

      // this.formData = {};
      this.tableData.length = 0;
      this.$emit('closeDia');
      done();
    },
    handleClose() {
      this.$refs.ruleForm.resetFields();
      // this.formData = {};

      this.tableData.length = 0;
      this.$emit('closeDia');
    }
  }
};
</script>
<style lang="less" scoped>
.editModal {
  #myDialog {
    /deep/ .el-dialog {
      border-radius: 5px;
      border-color: #409baf;

      .el-dialog__header {
        background-color: #409baf;
        border-radius: 5px 5px 0 0;
        .el-dialog__title {
          color: #fff;
          letter-spacing: 2px;
        }
        .el-dialog__headerbtn .el-dialog__close {
          color: #fff;
        }
      }
      .el-dialog__body {
        padding: 20px 20px 25px;
      }
      .el-dialog__footer {
        border-radius: 0 0 5px 5px;
        text-align: center;

        .btn--cancel {
          margin-right: 15px;
        }
        .btn--cancel:focus,
        .btn--cancel:hover {
          border-color: #409baf;
          background-color: #fff;
          color: #409baf;
        }
      }
    }
  }
  .detail__info {
    display: flex;
    flex-direction: column;
    color: #324170;
    .info__title {
      line-height: 2.5rem;
    }
    .info__items {
      flex: 1 0 auto;
      margin: 0 2%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .info__item {
      flex: 0 1 24%;
      margin: 8px 0;
      .item__value {
        color: #444;
      }
    }
  }
  .tablebox {
    margin: 20px 0;
  }
  .detail__form {
    .info__title {
      line-height: 3rem;
      color: #324170;
    }

    .el-form {
      display: flex;
      flex-wrap: wrap;
      /deep/ .el-form-item__label {
        color: #324170;
      }
      .el-form-item {
        flex-basis: 100%;
        .el-select {
          width: 20%;
        }
        .el-input {
          width: 20%;
        }
      }
      .form-num2 {
        flex-basis: 30%;

        .el-input {
          width: 67%;
        }
        .el-select {
          width: 67%;
        }
      }
      // 线轨工资
      .form2-num2 {
        flex-basis: 30%;
        .el-input {
          width: 67%;
        }
      }
      .el-col {
        display: flex;
      }
      .form2-num3 {
        flex-basis: 30%;
        width: 30%;
        .el-input {
          width: 67%;
        }
      }

      .item__text {
        .item__item {
          margin-right: 25px;
          line-height: 1.5rem;
          letter-spacing: 0.5px;
        }
      }
    }
  }
}
</style>
