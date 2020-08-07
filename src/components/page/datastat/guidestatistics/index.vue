<template>
  <div class="guidestatistics">
    <el-tabs type="card">
      <el-tab-pane label="分类统计" lazy>
          <Classify/>
      </el-tab-pane>
      <el-tab-pane label="汇总分析" lazy>
          <Summary/>
      </el-tab-pane>
      <el-tab-pane label="合格率汇总" lazy>
        <Qualified/>
      </el-tab-pane>
     
    </el-tabs>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import Classify from './classify'
import Qualified from './qualified'
import Summary from './summary'
export default {
  name: 'guidestatistics',
  components: {
      Classify,Qualified,Summary
  },
  computed: {
      
  },
  watch: {
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="less">
.guidestatistics {
   .el-tabs__header{
       border-bottom: none;
       .el-tabs__nav{
           border-bottom: 1px solid #e4e7ed;
           border-radius:4px;
           .is-active{
               background: #409EFF;
               color: #fff;
           }
           .el-tabs__item{
               border-bottom: none;
           } 
       }
   }
}
</style>