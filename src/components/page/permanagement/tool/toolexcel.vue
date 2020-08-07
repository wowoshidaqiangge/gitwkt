<template>
  <div class="metaexcel">
    <el-dialog :title="title" :destroy-on-close='isclose' :visible.sync="dialogExcelVisible" width='40%'
      :before-close='beforclose' center>
      <el-row>
        <excelupdate @childByValue='childByValue' />
        <div>
          <el-button size="small" type="primary" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>
          <p class="login-tips">说明: 导入文件类型必须为excel格式，你可以先点击 <a
              href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E5%A8%81%E8%82%AF%E7%89%B9-%E5%B7%A5%E5%85%B7-%E6%A8%A1%E6%9D%BF.xlsx">下载模板</a>。
          </p>
        </div>
      </el-row>
    </el-dialog>

  </div>
</template>
<script>
import excelupdate from '@/components/common/excelupdate'
import { toolsaveExcel } from 'api/tool'
export default {
  name: "toolExcel",
  components: {
    excelupdate
  },
  props: {
    dialogExcelVisible: {
      type: Boolean
    },
    title: {
      type: String
    },
  },
  data() {
    return {
      isclose: true,
      excelData: []
    }
  },
  methods: {
    // 处理excel数据
    childByValue(val) {
      console.log(val)
      let arr = []
      val.map((item, index) => {
        let obj = {}
        obj.toolName = JSON.parse(JSON.stringify(item))["工具名称"]
        obj.toolCode = JSON.parse(JSON.stringify(item))["工具编码"]
        obj.model = JSON.parse(JSON.stringify(item))["规格型号"]
        obj.deptName = JSON.parse(JSON.stringify(item))["所属部门"]
        arr[index] = obj
      })
      this.excelData = arr
      console.log(this.excelData)
    },
    UpData() {
      toolsaveExcel(this.excelData).then(res => {
        if (res.code === '0') {
          this.close(0)
          this.$message({
            message: '上传成功',
            type: 'success'
          });
        } else {
          this.$message.error('上传失败');
        }
      })
    },
    close(num) {
      this.$emit('close', num)
    },
    beforclose() {
      this.$emit('close', false)
    }
  }
}
</script>
<style lang="less">
.metaexcel {
  .el-dialog {
    border-radius: 5px;
  }
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
  .dialog-footer {
    text-align: end;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .el-select {
    width: 100%;
  }
  .el-col {
    margin-bottom: 20px;
  }
}
</style>