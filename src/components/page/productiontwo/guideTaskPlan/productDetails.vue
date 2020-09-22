<template>
  <div class="detailsPart">
    <detailsInfo :infolist="infolist" :title="title" :infotitle="infotitle" @goback="goback">
      <div slot="content" style="padding:0 20px">
        <el-table :data="tableData" stripe border>
          <el-table-column prop="index" label="编号" align="center" width="60px"> </el-table-column>
          <el-table-column label="加工内容" align="center">
            <el-table-column prop="workKind" label="工种" align="center"> </el-table-column>
            <el-table-column prop="workprocessName" label="工序" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column
            v-for="item in columnlist"
            :key="item.index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span v-if="scope.row.reportState == 1" style="font-weight:600;color:#E6A23C">未派单</span>
                <span v-if="scope.row.reportState == 2" style="font-weight:600;color:#409EFF">未领单</span>
                <span
                  v-if="scope.row.reportState == 3 || scope.row.reportState == 4"
                  style="font-weight:600;color:#67C23A"
                  >生产中</span
                >
                <span v-if="scope.row.reportState == 5" style="font-weight:600;color:#909399">已完工</span>
                <span v-if="scope.row.reportState == 6" style="font-weight:600;color:#F56C6C">已锁定</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="175">
            <template slot-scope="scope">
              <div class="showButton">
                <el-button
                  type="add"
                  plain
                  v-if="
                    $_has('GUIDETASKPLANPLAN') &&
                      scope.row.reportState == 1 &&
                      scope.row.taskPlanType != 4 &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工'
                  "
                  class="red"
                  @click="handlesplit(scope.$index, scope.row, parentRow)"
                  >工单分解</el-button
                >
                <el-button
                  type="add"
                  plain
                  v-if="
                    $_has('GUIDETASKPLANPLAN') &&
                      scope.row.reportState == 1 &&
                      scope.row.taskPlanType == 4 &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工'
                  "
                  class="red"
                  style="background-color: #999 !important; border-color: #999 !important;"
                  @click="handlesplit(scope.$index, scope.row, parentRow)"
                  disabled
                  >工单分解</el-button
                >
                <el-button
                  type="add"
                  plain
                  v-if="
                    $_has('GUIDETASKPLANASSIGN') &&
                      scope.row.reportState == 1 &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工'
                  "
                  class="red"
                  @click="handledistribute(scope.$index, scope.row, parentRow, 2)"
                  >派单</el-button
                >
                <el-button
                  type="add"
                  v-if="
                    $_has('GUIDETASKPLANUPDATE') &&
                      scope.row.reportState == 2 &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工'
                  "
                  plain
                  @click="handleEdit(scope.$index, scope.row, parentRow, 1)"
                >
                  修改</el-button
                >
                <el-button
                  type="add"
                  plain
                  v-if="
                    $_has('GUIDETASKPLANREPEAT') &&
                      scope.row.reportState == 5 &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工' &&
                      !scope.row.taskFinishFlag
                  "
                  class="red"
                  @click="handleagin(scope.$index, scope.row, parentRow, 3)"
                  >重新派单</el-button
                >
                <el-button
                  type="add"
                  plain
                  v-if="
                    $_has('GUIDETASKPLANREPORT') &&
                      (scope.row.reportState == 3 || scope.row.reportState == 4 || scope.row.reportState == 5) &&
                      scope.row.workprocessType != 3 &&
                      scope.row.workprocessName !== '完工'
                  "
                  class="red"
                  @click="handleUntie(scope.$index, scope.row, parentRow)"
                  >报工记录</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </detailsInfo>
    <assignModal :dialogFormVisible="modal.dialogFormVisible" :tit="modal.title" @close="close" ref="assignModal" />
    <recordModal :dialogFormVisible1="modal.dialogFormVisible1" @close1="close1" ref="recordModal" />
  </div>
</template>
<script>
import detailsInfo from '@/components/common/detailsinfo';
import { produceTaskPlanState } from 'api/product';

export default {
  name: 'productDetails',
  components: {
    detailsInfo,
    assignModal: () => import('./assignModal'),
    recordModal: () => import('./recordModal')
  },
  props: {},
  data() {
    return {
      infolist: [],
      title: '导轨生产工单-派单',
      infotitle: '基本信息：',
      columnlist: [],
      columnlist1: [
        { label: '派工人员', prop: 'createUser' },
        { label: '派工日期', prop: 'createTime' },
        { label: '计划结束时间', prop: 'planEndTime' },
        { label: '设备编号', prop: 'deviceNumber' },
        { label: '工作人员', prop: 'assignUser' },
        { label: '结算方式', prop: 'accountTypeName' },
        { label: '派件数量', prop: 'assignCount' },
        { prop: 'industrialWaste', label: '工废', width: 50 },
        { prop: 'scrapWaste', label: '料废', width: 50 },
        { prop: 'concessionWork', label: '让步工H', width: 50 },
        { prop: 'relegationWork', label: '降级工C', width: 50 },
        { prop: 'concessionMaterial', label: '让步料H', width: 50 },
        { prop: 'relegationMaterial', label: '降级料C', width: 50 },
        { prop: 'qualified', label: '合格P', width: 50 },
        { label: '生产用时', prop: 'produceDuration', width: 50 },
        { label: '完成时间', prop: 'finishTime' }
      ],
      columnlist2: [
        { label: '派工人员', prop: 'createUser' },
        { label: '派工日期', prop: 'createTime' },
        { label: '计划结束时间', prop: 'planEndTime' },
        { label: '设备编号', prop: 'deviceNumber' },
        { label: '工作人员', prop: 'assignUser' },
        { label: '结算方式', prop: 'accountTypeName' },
        { label: '派件数量', prop: 'assignCount' },
        { prop: 'produceCount', label: '实际完成数量', width: 60 },
        { prop: 'qualified', label: '合格数量', width: 50 },
        { prop: 'pNums', label: 'P级数量', width: 50 },
        { prop: 'hNums', label: 'H级数量', width: 50 },
        { prop: 'cNums', label: 'C级数量', width: 50 },
        { prop: 'scrapNums', label: '报废数量', width: 50 },
        { label: '生产用时', prop: 'produceDuration', width: 50 },
        { label: '完成时间', prop: 'finishTime' }
      ],
      tableData: [],
      modal: {
        title: '',
        dialogFormVisible: false,
        dialogFormVisible1: false
      },
      parentRow: {},
      taskNumberArr: [],
      param: {}
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // API：数据获取
    getBaseInfo(row) {
      this.parentRow = row;
      // 带过来的详情数据，表格数据另需接口请求
      if (row.productTypeId == 3) {
        this.columnlist = this.columnlist1;
      } else {
        this.columnlist = this.columnlist2;
      }
      this.infolist = [
        { name: '生产工单', value: row.taskNumber },
        { name: '物料编码', value: row.itemCode },
        { name: '物料名称', value: row.itemName },
        { name: '规格型号', value: row.model },
        { name: '生产部门', value: row.deptName },
        { name: '生产数量', value: row.planYield },
        { name: '计划开始时间', value: row.planStartTime },
        { name: '计划结束时间', value: row.planEndTime },
        { name: '特殊要求', value: row.remark }
      ];
    },
    getTableData(obj) {
      this.param = obj;
      produceTaskPlanState({ ...this.param }).then(res => {
        if (res.code === '0') {
          // let index1 = 0;
          const accountTypeNames = ['-', '计件', '计时', '计件、计时组合'];
          const arr = [
            'createUser',
            'createTime',
            'planEndTime',
            'assignCount',
            'deviceNumber',
            'assignUser',
            'accountType',
            'qualify',
            'produceDuration',
            'finishTime',
            'reportState',
            'produceWorkprocessState',
            'industrialWaste',
            'scrapWaste',
            'concessionWork',
            'relegationWork',
            'concessionMaterial',
            'relegationMaterial',
            'qualified',
            'produceCount',
            'pNums',
            'hNums',
            'cNums',
            'scrapNums'
          ];
          res.data.map((item, index) => {
            if (item.workprocessType == 3 || (item.workprocessName === '完工' && item.workprocessType == 5)) {
              // 外协类型的工序、质检类型的完工啥都不展示
              for (let i of arr) {
                delete item[i];
              }
            }
            item.index = index + 1;
            if (res.data[res.data.length - 1].qualityState && res.data[res.data.length - 1].qualityState == 1) {
              item.taskFinishFlag = true;
            }
            if (item.accountType) {
              item.accountTypeName = accountTypeNames[parseInt(item.accountType)];
            }
            if (item.createUser) {
              item.createUser = item.createUser.split('"')[1];
            }
            if (item.createTime) {
              item.createTime = item.createTime.split(' ')[0];
            }
            if (item.finishTime) {
              item.finishTime = item.finishTime.split(' ')[0];
            }

            // 处理编号
            // item.taskNumber = item.taskNumber || ''; // 避免字段缺失报错
            // const tmpArr = item.taskNumber.split('#');
            // if (tmpArr.length > 1) {
            //   // 如果是分解,拼接后缀
            //   item.splitFlag = 1;
            //   const body = tmpArr[0];
            //   const suffix = parseInt(tmpArr[1]);

            //   if (!this.taskNumberArr.includes(body)) {
            //     // 分解的第一个需要递增index，其他各分解子单都不要
            //     this.taskNumberArr.push(body);
            //     indexa += 1;
            //   }
            //   item.index = `${indexa}-${suffix}`;
            // } else {
            //   // 如果正常，则也要正常递增index
            //   indexa += 1;
            //   item.index = indexa;
            // }

            // if (item.taskNumber) {
            //   if (item.taskNumber.indexOf('#') != -1) {
            //     item.splitFlag = 1; // 加一个工单被分解标志
            //     if (!index1 || item.taskNumber.substring(item.taskNumber.length - 1) == 1) {
            //       index1 = index1 + 1;
            //     }
            //     item.index = index1 + '-' + item.taskNumber.substring(item.taskNumber.length - 1);
            //   } else {
            //     item.index = index1 + 1;
            //     index1 = index1 + 1;
            //   }
            // } else {
            //   item.index = index1 + 1;
            //   index1 = index1 + 1;
            // }
          });
          this.tableData = res.data;
        }
      });
    },
    // 报工记录
    handleUntie(h, m, n) {
      console.log(m, n);
      this.modal.dialogFormVisible1 = true;
      this.$refs.recordModal.getpageByProduceTaskPlanId(m.produceTaskPlanId, m.workprocessId, m.assignUserId);
    },
    // 工单分解
    handlesplit(h, m, n) {
      console.log(m, n);
      this.modal.title = '工单分解';
      // this.$refs.assignModal.getproduceTaskPlanid(m);
      this.modal.dialogFormVisible = true;
      this.$refs.assignModal.getDetailData(m, n);
    },
    // 派单
    handledistribute(h, m, n, x) {
      this.modal.title = '派单';
      this.modal.dialogFormVisible = true;
      m.operateType = x;
      this.$refs.assignModal.getDetailData(m, n);
      // this.$refs.assignModal.getproduceTaskPlanid(m); //不需要查询
    },
    // 派单修改
    handleEdit(h, m, n, x) {
      this.modal.title = '工单修改';
      this.modal.dialogFormVisible = true;
      m.operateType = x;
      this.$refs.assignModal.getDetailData(m, n);
      // this.$refs.assignModal.getproduceTaskPlanid(m);
    },
    // 重新派单
    handleagin(h, m, n, x) {
      let that = this;
      this.$confirm('请注意，重新派单前请确保当前生产人员已完成报工、质检员检验完毕！', '提示', {
        type: 'warning',
        confirmButtonText: '重新派单'
      })
        .then(() => {
          that.handledistribute(h, m, n, x);
        })
        .catch(() => {});
    },

    // 页面操作：
    goback() {
      this.$emit('goback', false);
      this.tableData.length = 0;
    },
    detailclose() {
      this.detailVisble = false;
    },
    close(num) {
      this.modal.dialogFormVisible = false;
      if (num === '0') {
        this.getTableData({ ...this.param });
      }
    },
    close1() {
      this.modal.dialogFormVisible1 = false;
    }
  }
};
</script>

<style lang="less">
.detailsPart {
  height: 100%;
  .showButton {
    .el-button {
      padding: 9px 0px;
      width: 70px;
    }
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
