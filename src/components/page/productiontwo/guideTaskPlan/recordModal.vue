<template>
  <div class="recordmodal">
    <el-dialog title="报工记录" :visible.sync="dialogFormVisible1" :before-close="beforclose" center width="50%">
      <!-- <p class="modaltit1">工单信息：</p>
      <el-row>
        <el-form :model="form" ref="form">
          <div class="modalcont">
            <el-col :span="11">
              <el-form-item label="工单号" :label-width="formLabelWidth" prop="taskNumber">
                <el-input v-model="form.taskNumber" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="部门" :label-width="formLabelWidth" prop="deptName">
                <el-input v-model="form.deptName" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="物料名称" :label-width="formLabelWidth" prop="itemName">
                <el-input v-model="form.itemName" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="物料编码" :label-width="formLabelWidth" prop="itemCode">
                <el-input v-model="form.itemCode" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="规格型号" :label-width="formLabelWidth" prop="model">
                <el-input v-model="form.model" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="计划产量" :label-width="formLabelWidth" prop="planYield">
                <el-input v-model="form.planYield" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </el-row> -->

      <el-table :data="tableData1" border stripe style="width: 100%">
        <el-table-column
          v-for="item in columnList"
          :width="item.width"
          :key="item.index"
          :prop="item.prop"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="add" @click="marksure('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageByProduceTaskPlanId } from 'api/product';

export default {
  name: 'recordmodal',
  props: {
    dialogFormVisible1: {
      type: Boolean
    },
    tit: {
      type: String
    }
  },
  data() {
    return {
      formLabelWidth: '80px',
      tableData1: [],
      page: {
        current: 1,
        size: 10
      },
      columnList: [
        { prop: 'index', label: '序号', width: 80 },
        { prop: 'reportNumber', label: '报工流水号' },
        { prop: 'reportUser', label: '生产员工' },
        { prop: 'produceCount', label: '生产数量' },
        { prop: 'totalCount', label: '累计产量' },
        { prop: 'createTime', label: '报工时间' }
      ],
      form: {}
    };
  },
  created() {},
  methods: {
    getpageByProduceTaskPlanId(pid, wid) {
      const obj = { produceTaskPlanId: pid, workprocessId: wid };
      pageByProduceTaskPlanId(obj).then(res => {
        if (res.code === '0') {
          res.data.map((item, index) => {
            item.index = index + 1;
          });
          this.tableData1 = res.data;
        }
      });
    },
    close(num) {
      this.$emit('close1', num);
    },

    marksure(form) {
      this.$emit('close1', false);
    },
    beforclose() {
      this.$emit('close1', false);
    }
  }
};
</script>

<style lang="less">
.recordmodal {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    background-color: #409baf;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button:nth-child(1) {
      margin-right: 20px;
    }
  }
  .modalcont {
    padding: 25px 0;
    border: 1px dashed #aaa;
    margin-bottom: 25px;
    height: 140px;
  }
  .modaltit1 {
    padding: 10px 0;
    font-size: 18px;
    color: #324170;
  }
}
</style>
