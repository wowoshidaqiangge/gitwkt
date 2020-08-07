<template>
  <div class="productStatistics">
    <el-tabs type="card">
      <el-tab-pane label="同比分析" lazy>
        <YoYanalysis></YoYanalysis>
      </el-tab-pane>
      <el-tab-pane label="分类统计" lazy>
        <classify></classify>
      </el-tab-pane>
      <el-tab-pane label="产量排序" lazy>
        <yieldRank></yieldRank>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ElementUI from 'element-ui';
import YoYanalysis from './YoYanalysis';
import classify from './classify';
import yieldRank from './yieldRank';
export default {
  name: 'productStatistics',
  components: {
    YoYanalysis, classify, yieldRank
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
  },

  created() {
  },
  methods: {
  }
};
</script>

<style lang="less">
.productStatistics {
  width: 100%;
  height: auto;

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
}
</style>