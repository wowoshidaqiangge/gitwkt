<template>
  <div class="excelupdate">
    <div>
      <el-upload
        class="upload-demo"
        drag
        :on-change="change"
        id="excel-file"
        ref="upload"
        action=""
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx';
export default {
  name: 'excelupdate',
  prop: {
    nerd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      persons: [],
      fileList: []
    };
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    change(file) {
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
      let that = this;
      if (fileName != 'xls' && fileName != 'xlsx') {
        this.$refs.upload.clearFiles();
        this.$message({
          type: 'error',
          showClose: true,
          duration: 3000,
          message: '不是excel文件'
        });
      } else {
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
          console.log(ev, 'ev');
          try {
            var data = ev.target.result,
              workbook = xlsx.read(data, {
                type: 'binary'
              }), // 以二进制流方式读取得到整份excel表格对象
              persons = []; // 存储获取到的数据
          } catch (e) {
            console.log('文件类型不正确');
            return;
          }
          let children = [];
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              let sheetData = workbook.Sheets[sheet];
              console.log(workbook.Sheets[sheet]);

              const regexp = /A1/;
              let range = workbook.Sheets[sheet]['!ref'];
              if (range) {
                range = range.replace(regexp, 'A2');
              }
              const sheet2JSONOpts = {
                range: range, // 读取的表格的表格范围(这里舍弃第一行)
                defval: '' //给未定义值赋值为空字符串
              };
              console.log(sheet2JSONOpts);
              const person = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], sheet2JSONOpts);
              persons = persons.concat(person);
              // break; // 如果只取第一张表，就取消注释这行
            }
          }
          console.log(persons);
          that.deliver(persons);
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file.raw);
      }
    },
    deliver(val) {
      this.$emit('childByValue', val);
    }
  }
};
</script>

<style lang="less">
.excelupdate {
  .fileinput-button {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .fileinput-button input {
    position: absolute;
    left: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
  }
}
</style>
