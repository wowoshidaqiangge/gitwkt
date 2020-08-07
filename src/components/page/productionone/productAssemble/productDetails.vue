<template>
  <div class="detailsPart" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <Detailsinfo :infolist="infolist" :title="title" :infotitle="infotitle" @goback="goback" style="overflow: auto;">
      <div slot="content" style="padding:0 20px">
        <el-table :data="tablelist" stripe border>
          <el-table-column prop="index" label="编号" align="center" width="50px">
          </el-table-column>
          <el-table-column label="加工内容" align="center">
            <el-table-column prop="workKind" label="工种" align="center">
            </el-table-column>
            <el-table-column prop="workprocessName" label="工序" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column v-for="(item,index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
            align="center">
          </el-table-column>
          <el-table-column label="结算方式" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span v-if="scope.row.accountType == 1">计件</span>
                <span v-if="scope.row.accountType == 2">计时</span>
                <span v-if="scope.row.accountType == 3">计件和计时</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper" v-if="scope.row.workprocessType != '5'">
                <span v-if="scope.row.reportState == 1" style="font-weight:600;color:blue">待派单</span>
                <span v-if="scope.row.reportState == 2" style="font-weight:600;color:orange">待领单</span>
                <span v-if="scope.row.reportState == 3||scope.row.reportState == 4"
                  style="font-weight:600;color:green">生产中</span>
                <span v-if="scope.row.reportState == 5" style="font-weight:600;color:gray">已完成</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="175">
            <template slot-scope="scope">
              <div class="showButton" v-if="scope.row.workprocessType != '5'">
                <el-button type="add" plain
                  v-if="(scope.row.reportState == '3' ||scope.row.reportState == '4'||scope.row.reportState == '5')&& scope.row.workprocessType != '3'&& $_has('PRODUCTASSEMBLEREPORT')"
                  class="red" @click="handleUntie(scope.$index, scope.row)">报工记录</el-button>
                <el-button :type="scope.row.disabled ? 'info' : 'add'" :disabled="scope.row.disabled" plain
                  v-if="scope.row.reportState == '1' && scope.row.workprocessType != '3'" class="red"
                  @click="handlesplit(scope.$index, scope.row) && $_has('PRODUCTASSEMBLEPLAN')">工单分解
                </el-button>
                <el-button type="add" plain
                  v-if="((scope.row.reportState == '5' && scope.row.workprocessType == '2')||scope.row.reportState == '3'||scope.row.reportState == '4') && $_has('PRODUCTASSEMBLEREPEAT')"
                  class="red" @click="handleagin(scope.$index, scope.row)">重新派单</el-button>
                <el-button type="add" v-if="scope.row.reportState == '2'&& $_has('PRODUCTASSEMBLEUPDATE')" plain
                  @click="handleEdit(scope.$index, scope.row)">
                  修改</el-button>
                <el-button type="add" plain
                  v-if="scope.row.reportState == '1'&& scope.row.workprocessType != '3' && scope.row.workprocessType != '5' && $_has('PRODUCTASSEMBLEASSIGN')"
                  class="red" @click="handledistribute(scope.$index, scope.row)">派单</el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>
      </div>
    </Detailsinfo>
    <assingModal :dialogFormVisible='dialogFormVisible' :tit='tit' @close='close' ref='assignmodal' />
    <recordmodal :dialogFormVisible1='dialogFormVisible1' @close1='close1' ref='recordmodal' />
  </div>
</template>
<script>
import Detailsinfo from './../../../common/detailsinfo'
import assingModal from './assignModal'
import recordmodal from './recordmodal'
import { assignList } from 'api/tool'
export default {
  name: 'productDetails',
  components: {
    Detailsinfo, assingModal, recordmodal
  },
  props: {

  },
  data() {
    return {
      loading: false,
      infolist: [],
      title: "生产装配工单-派单",
      infotitle: "产品基本信息：",
      columnlist: [
        { label: '派工人员', prop: 'createUser', },
        { label: '派工日期', prop: 'createTime' },
        { label: '计划结束时间', prop: 'planEndTime', },
        { label: '设备编号', prop: 'deviceNumber', },
        { label: '工作人员', prop: 'assignUser', },
        { label: '派件数量', prop: 'assignCount', },
        { label: '合格P', prop: 'qualified', },
        { label: '生产用时', prop: 'productTime', },
        { label: '完成时间', prop: 'finishTime', },
      ],
      tablelist: [],
      tit: '',
      produceTask: {},
      dialogFormVisible: false,
      dialogFormVisible1: false,
    }
  },
  created() {

  },
  mounted() {

  },
  watch: {

  },
  methods: {
    getBaseInfo(index, row) {
      this.infolist = [
        { name: '装配工单', value: row.taskNumber },
        { name: '物料编码', value: row.itemCode },
        { name: '规格型号', value: row.model },
        { name: '物料名称', value: row.itemName },
        { name: '计划生产量', value: row.planYield },
        { name: '计划开始时间', value: row.planStartTime },
        { name: '计划结束时间', value: row.planEndTime },
        { name: '发料人', value: row.createUser },
        { name: '生产用时', value: row.produceDuration },
        { name: '特殊要求', value: row.remark },
      ]

    },
    getTableData(row) {
      if (row) {
        this.produceTask = row
      }
      let obj = { type: '3', produceTaskPlanId: this.produceTask.produceTaskPlanId };
      this.loading = true
      assignList(obj).then(res => {
        this.loading = false
        if (res.code === '0') {
          let index1 = 0
          res.data.map((item, index) => {
            item.produceDuration = this.produceTask.produceDuration
            if (item.workprocessType != '5') {
              item.planEndTime = this.produceTask.planEndTime
            }
            // 编号分级
            if (item.taskNumber) {
              if (item.taskNumber.indexOf('#') != -1) {
                if (!index1 || item.taskNumber.substring(item.taskNumber.length - 1) == 1) {
                  index1 = index1 + 1
                }
                item.index = index1 + '-' + item.taskNumber.substring(item.taskNumber.length - 1)
                item.disabled = true
              } else {
                item.index = index1 + 1
                index1 = index1 + 1
              }
            } else {
              item.index = index1 + 1
              index1 = index1 + 1
            }
            // 派工人员去掉序号、冒号
            if (item.createUser) {
              item.createUser = item.createUser.split('"')[1]
            }
            // 完工不显示派件数量 其余本来就没有数据所以没删
            if (item.workprocessType == '5') {
              delete item.assignCount
            }
          })
          this.tablelist = res.data
        }
      })

    },
    goback() {
      this.$emit('goback', false)
    },
    detailclose() {
      this.detailVisble = false
    },

    close(num) {
      this.dialogFormVisible = false
      if (num === '0') {
        this.getTableData()
      } else if (num === '1') {
        this.goback()
      }

    },
    close1() {
      this.dialogFormVisible1 = false
    },
    // 分解
    handlesplit(h, m) {
      this.tit = '工单分解'
      this.$refs.assignmodal.getproduceTaskPlanid(m, this.produceTask)
      this.dialogFormVisible = true
    },
    // 派单
    handledistribute(h, m) {
      this.tit = '派单'
      this.$refs.assignmodal.getproduceTaskPlanid(m, this.produceTask)
      this.dialogFormVisible = true
    },
    // 修改
    handleEdit(h, m) {
      this.tit = '修改'
      this.$refs.assignmodal.getproduceTaskPlanid(m, this.produceTask)
      this.dialogFormVisible = true
    },
    // 重新派单
    handleagin(h, m) {
      var that = this
      this.$confirm('请注意，重新派单前请确保当前生产人员已完成报工！', '提示', {
        type: 'warning',
        confirmButtonText: '重新派单',
      })
        .then(() => {
          this.tit = '重新派单'
          this.$refs.assignmodal.getproduceTaskPlanid(m, this.produceTask)
          this.dialogFormVisible = true
        })
        .catch(() => { });
    },
    // 报工记录
    handleUntie(h, m) {

      this.$refs.recordmodal.getpageByProduceTaskPlanId(m, this.produceTask)
      this.dialogFormVisible1 = true
    }
  }
}
</script>


<style lang='less'>
.detailsPart {
  height: 100%;
  overflow: auto;
  .showButton {
    .el-button {
      padding: 9px 0px;
      width: 70px;
    }
  }
}
</style>
