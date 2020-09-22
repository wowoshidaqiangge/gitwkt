<template>
  <div class="workpriceexcel">
    <el-dialog :title="extitle" :destroy-on-close='isclose' :visible.sync="dialogExcelVisible" width='40%'
      :before-close='beforclose' center>
      <el-row>
        <excelupdate @childByValue='childByValue' />
        <div>
          <el-button size="small" type="primary" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>
          <p class="login-tips">说明: 导入文件类型必须为excel格式，你可以先点击 <a
              href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E5%A8%81%E8%82%AF%E7%89%B9-%E5%B7%A5%E4%BB%B7-%E6%A8%A1%E7%89%88.xlsx">下载模板</a>。
          </p>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import excelupdate from '@/components/common/excelupdate'
import { workpricesaveList } from 'api/product'
export default {
  name: "workpriceexcel",
  components: {
    excelupdate
  },
  props: {
    dialogExcelVisible: {
      type: Boolean
    },
    extitle: {
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
      
      let arr = []
      val.map((item, index) => {
      
            let obj = {}
            obj.itemCode = JSON.parse(JSON.stringify(item))["__EMPTY_1"]
            obj.workprocessCode = JSON.parse(JSON.stringify(item))["__EMPTY_4"]
            obj.timePrice = JSON.parse(JSON.stringify(item))["__EMPTY_6"]
            obj.qualifiedPrice = JSON.parse(JSON.stringify(item))["__EMPTY_7"]
            obj.concessionPrice = JSON.parse(JSON.stringify(item))["__EMPTY_8"]
            obj.demotionPrice = JSON.parse(JSON.stringify(item))["__EMPTY_9"]
            obj.deptName = JSON.parse(JSON.stringify(item))["__EMPTY_5"]
          
            arr[index] = obj
      })
      arr.shift()
      this.excelData = arr
      console.log(arr)
    },
    UpData() {
      workpricesaveList(this.excelData).then(res => {
        if (res.code === '0') {
          this.$emit('exclose', '0')
          this.$message({
            message: '上传成功',
            type: 'success'
          });
        }
      })
    },
    close(num) {
      this.$emit('exclose', num)
    },
    beforclose() {
      this.$emit('exclose', false)
    }
  }
}
</script>
<style lang="less">
.workpriceexcel {
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