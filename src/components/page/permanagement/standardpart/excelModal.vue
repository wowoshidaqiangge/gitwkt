<template>
  <div class="excelModal">
    <el-dialog
      :title="title"
      :destroy-on-close="isclose"
      :visible="dialogExcelVisible"
      width="40%"
      :before-close="beforeClose"
      center
    >
      <el-row>
        <excelupdate @childByValue="childByValue" />
        <div class="excel__button">
          <el-button size="small" type="add" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>
          <p class="login-tips">
            说明: 导入文件类型必须为excel格式，你可以先点击
            <a
              href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E5%A8%81%E8%82%AF%E7%89%B9-%E6%A0%87%E5%87%86%E4%BB%B6-%E6%A8%A1%E6%9D%BF.xlsx"
              >下载模板</a
            >。
          </p>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addStandList } from '@/api/permanagement/material';

export default {
  name: 'excelModal',
  components: {
    excelupdate: () => import('@/components/common/excelupdate')
  },
  props: {
    dialogExcelVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入物料'
    }
  },
  data() {
    return {
      isclose: true,
      sureload: false,
      excelData: []
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // 处理excel数据
    childByValue(val) {
      let arr = [];
      val.map((item, index) => {
        // TODO2: 解析每一列对应数据
        let obj = {};
        obj.partName = JSON.parse(JSON.stringify(item))['物料名称'];
        obj.partCode = JSON.parse(JSON.stringify(item))['物料编码'];
        obj.model = JSON.parse(JSON.stringify(item))['规格型号'];
        obj.unit = JSON.parse(JSON.stringify(item))['基本单位'];
        obj.deptName = JSON.parse(JSON.stringify(item))['所属部门'];
        arr[index] = obj;
      });
      Object.freeze(arr);
      this.excelData = arr;
      console.log(this.excelData);
    },
    UpData() {
      addStandList(this.excelData).then(res => {
        if (res.code === '0') {
          this.handleUpdate();
          this.$message({
            message: '上传成功',
            type: 'success'
          });
        } else {
          this.$message.error('上传失败');
        }
      });
    },
    beforeClose() {
      this.$emit('closeExcel');
    },
    handleUpdate() {
      this.beforeClose();
      this.$emit('updateData');
    }
  }
};
</script>

<style lang="less">
.excelModal {
  .el-dialog {
    border-radius: 5px;
    .el-dialog__header {
      background-color: #409baf;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .el-dialog__title {
        color: #fff;
        letter-spacing: 2px;
      }
      .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
      }
    }
    .excel__button {
      // text-align: center;
    }
  }
}
</style>
