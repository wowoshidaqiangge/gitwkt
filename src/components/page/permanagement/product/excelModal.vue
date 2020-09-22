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
        <excelUploadNerd @childByValue="childByValue" />
        <div class="excel__button">
          <el-button size="small" type="add" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>
          <p class="login-tips">
            说明: 导入文件类型必须为excel格式，你可以先点击
            <a
              href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E5%A8%81%E8%82%AF%E7%89%B9-%E4%BA%A7%E5%93%81-%E6%A8%A1%E7%89%88.xlsx"
              >下载模板</a
            >。
          </p>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addProductList } from '@/api/permanagement/guide';

export default {
  name: 'excelModal',
  components: {
    excelUploadNerd: () => import('@/components/common/excelUploadNerd')
  },
  props: {
    dialogExcelVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入产品'
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
      let newVal = [];
      console.log('val', val);

      for (const item of val) {
        // TODO1: 解析子数组中的对应数据
        item.child = {
          partCode: JSON.parse(JSON.stringify(item))['零件编码'],
          partName: JSON.parse(JSON.stringify(item))['零件名称'],
          // partNumber: JSON.parse(JSON.stringify(item))['零件图号'],
          // model: JSON.parse(JSON.stringify(item))['零件规格型号'],
          // unit: JSON.parse(JSON.stringify(item))['单位'],
          partCount: JSON.parse(JSON.stringify(item))['数量']
        };
        // TODO2:用一个子数组对应的唯一标识判断父级的合并单元格
        // 非空则说明是合并单元格的第一个，此后的空值只需要拿到其子数组即可。
        if (item['物料编码'] !== '') {
          item.children = [];
          item.children.push(item.child);
        }
      }
      // 把导入的不规则数据转化为想要的结构化数据
      val.forEach((item, index, array) => {
        if (item.children) {
          let curIndex = index;
          let aidVal = val.slice(curIndex + 1);
          let nextIndex = aidVal.findIndex(el => {
            return el.children;
          });
          if (nextIndex > -1) {
            for (let i = curIndex; i < nextIndex; i++) {
              item.children.push(aidVal[i].child);
            }
          } else {
            for (let i = curIndex + 1; i < val.length; i++) {
              item.children.push(val[i].child);
            }
          }
          console.log(curIndex, nextIndex);
          newVal.push(item);
        }
      });
      // TODO3: 解析每一列对应的数据
      newVal.map((item, index) => {
        let obj = {};
        obj.productName = JSON.parse(JSON.stringify(item))['物料名称'];
        obj.productCode = JSON.parse(JSON.stringify(item))['物料编码'];
        obj.productType = JSON.parse(JSON.stringify(item))['物料类别'];
        obj.model = JSON.parse(JSON.stringify(item))['规格型号'];
        obj.unit = JSON.parse(JSON.stringify(item))['基本单位'];
        obj.deptName = JSON.parse(JSON.stringify(item))['所属部门'];
        obj.workprocessCodes = JSON.parse(JSON.stringify(item))
          ['关联工序(编码)'].split('\n')[0]
          .split('、');
        // obj.partBillList = JSON.parse(JSON.stringify(item))['children'];
        obj.part = JSON.parse(JSON.stringify(item))['children'];

        arr[index] = obj;
      });
      this.excelData = arr;
      console.log('excel', this.excelData);
    },
    UpData() {
      addProductList(this.excelData).then(res => {
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
