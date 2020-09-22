<template>
  <div class="productStatistics">
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="零件生产" lazy>
        <partProduct></partProduct>
      </el-tab-pane>
      <el-tab-pane label="工序统计" lazy>
        <processCount></processCount>
      </el-tab-pane>
      <el-tab-pane label="员工CPK" lazy>
        <staffCPK></staffCPK>
      </el-tab-pane>
      <el-tab-pane label="工序用时" lazy>
        <processTime></processTime>
      </el-tab-pane>
    </el-tabs>
    <div class="botRemark" v-if="this.paneName=='2'">{{remark}}</div>
  </div>
</template>
<script>
import ElementUI from 'element-ui';
import partProduct from './partProduct';
import processCount from './processCount';
import staffCPK from './staffCPK';
import processTime from './processTime';
export default {
  name: 'productStatistics',
  components: {
    partProduct, processCount, staffCPK, processTime
  },
  data() {
    return {
      paneName: '',
      remark: ''
    };
  },
  computed: {},
  watch: {},
  created() { },
  methods: {
    handleClick(tab, event) {
      this.paneName = tab.paneName
      this.remark = '备注：A+,CPK≥1.67；A,1.33≤CPK<1.67；B,1.00≤CPK<1.33；C,0.67≤CPK<1.00；D,CPK<0.67；'
    }
  }
};
</script>

<style lang="less">
.productStatistics {
  width: 100%;
  height: 100%;
  .el-tabs__header {
    margin: 20px 30px;
    // border-bottom: none;
    .is-active {
      color: white;
      background: #409baf !important;
    }
    .el-tabs_nav {
      border: 1px solid #e4e7ed !important;
      border-bottom: 1px solid #e4e7ed !important;
      .el-tabs__item {
        border-bottom: 1px solid #e4e7ed !important;
      }
    }
  }
  .botRemark {
    position: absolute;
    bottom: 3%;
    margin: 0 20px;
  }
}
</style>