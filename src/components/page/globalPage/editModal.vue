<template>
  <div class="editModal">
    <el-dialog :title="title" :visible="dialogVisible" id="myDialog" width="50%" :before-close="beforeClose" center>
      <el-form class="myForm" :model="form" :rule="rule" ref="form" label-width="120px">
        <!-- <el-form-item label="标题语" prop="bannerTitle">
          <template>
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3 }"
              placeholder=""
              maxlength="30"
              show-word-limit
              v-model="form.bannerTitle"
            >
            </el-input>
          </template>
        </el-form-item> -->
        <el-form-item label="轮播图" prop="bannerPicList" class="banner-container">
          <template>
            <div class="banner-item hasLink" v-for="(item, index) in form.bannerPicList" :key="index">
              <el-image :src="item" fit="cover">
                <div slot="error" class="image-slot"></div>
              </el-image>
              <span v-if="item.trim() != ''">
                <i class="el-icon-upload2 icon__action1" @click="showUpload(index + 1)"></i>
                <i class="el-icon-delete icon__action2" @click="removeItem(index)"></i>
              </span>
              <i v-else class="el-icon-upload2 icon__action2" @click="showUpload(index + 1)"></i>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="图片上传" v-if="index > 0">
          <template>
            <span>第 {{ index }} 张轮播图 （至多可上传5张）</span>
            <el-upload
              ref="upload"
              list-type="picture-card"
              :show-file-list="false"
              drag
              :action="upload.host"
              :data="upload.ossParams"
              :limit="5"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :on-exceed="exceed"
            >
              <el-image v-if="imageUrl" :src="imageUrl" style="width: 360px; height: 180px" fit="cover"></el-image>
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </template>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button class="btn--cancel" @click="handleClose">取 消</el-button>
        <el-button type="add" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { baseInfoPut } from 'api/globalPage';
import { onenet } from 'api/onenet';
import { isEmpty } from '@/utils/util';

export default {
  name: 'editModal',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改信息'
    }
  },
  data() {
    return {
      index: 0,
      form: {
        bannerTitle: '',
        bannerPicList: []
      },
      rule: [],
      upload: {
        limit: 1,
        host: 'http://thingcom-dianliuji.oss-cn-hangzhou.aliyuncs.com',
        ossParams: {
          OSSAccessKeyId: '',
          policy: '',
          signature: '',
          expire: '',
          key: '', // key后面有用，先默认设空字符串
          success_action_status: '200' // 默认200
        }
      },
      imageUrl: '',
      disabled: true
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {},
    getParentData(val) {
      const l = val.bannerPicList.length;
      for (let i = l; i < 5; i++) {
        val.bannerPicList[i] = '';
      }
      this.form = val;
      console.log(val);
    },
    showUpload(index) {
      this.index = index;
      this.imageUrl = '';
    },

    removeItem(index) {
      console.log(index);
      this.form.bannerPicList[index] = '';
      this.$forceUpdate();
      // this.form.bannerPicList.splice(index, 1);
      // this.form.bannerPicList[4] = '';
      const l = this.form.bannerPicList.length;
      for (let i = l; i < 5; i++) {
        this.form.bannerPicList[i] = '';
      }
      // this.$forceUpdate();
    },
    // 处理文件上传
    handleSuccess(res, file, fileList) {
      console.log(file, fileList);
      // this.imageUrl = URL.createObjectURL(file.raw);
      const a = this.upload.host + '/' + this.upload.ossParams.key;
      console.log(a);
      this.imageUrl = a;
      if (this.index > 0) {
        const i = this.index - 1;
        this.form.bannerPicList[i] = this.imageUrl;
      }
    },
    handleRemove(file, fileList) {
      this.imageUrl = '';
      this.$refs.upload.clearFiles();
      this.$message.success('删除成功');
    },
    // 上传之前的回调
    beforeUpload: async function(file) {
      await this.backOssInfo(file);
      // let _this = this;
      // const is1M = file.size / 1024 / 1024 < 1; // 限制小于1M
      // if (!is1M) {
      //   _this.$message.error('图片大小不可超过1MB');
      //   return false;
      // }
      // const isSize = new Promise(function(resolve, reject) {
      //   let width = 654; // 限制图片尺寸为654X270
      //   let height = 270;
      //   let _URL = window.URL || window.webkitURL;
      //   let img = new Image();
      //   img.onload = function() {
      //     let valid = img.width < width && img.height < height;
      //     valid ? resolve() : reject();
      //   };
      //   img.src = _URL.createObjectURL(file);
      // })
      //   .then(() => {
      //     return file;
      //   })
      //   .catch(() => {
      //     _this.$message.error('图片尺寸限制为654 x 270');
      //     return Promise.reject();
      //   });
    },
    exceed(files, fileList) {
      console.log(files, fileList);
      this.$message.error('最多上传5张图片！');
    },
    // 获取oss签名数据
    backOssInfo: function(file) {
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
      return new Promise(
        function(resolve, reject) {
          onenet.ossInfo().then(
            function(response) {
              if (response === undefined) {
                this.$message.error(response.error);
                reject();
              } else {
                this.upload.ossParams.OSSAccessKeyId = response.accessid;
                this.upload.ossParams.policy = response.policy;
                this.upload.ossParams.signature = response.signature;
                this.upload.ossParams.key =
                  sessionStorage.getItem('userId') + this.randomWord(true, 9, 12) + '.' + fileName;
                resolve();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    randomWord(randomFlag, min, max) {
      let str = '';
      let range = min;
      let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },

    // 确认修改
    handleSubmit() {
      const tmp = [];
      this.form.bannerPicList.map((item, index) => {
        if (item.trim() != '') {
          tmp.push(item);
        }
      });
      this.form.bannerPicList = tmp;
      console.log(this.form);
      baseInfoPut(this.form).then(res => {
        if (res.code == 0) {
          this.$message.success('更新成功');
          this.handleClose();
        } else {
          this.$message.error('更新失败，请稍后再试');
          debugger;
        }
      });
    },
    beforeClose(done) {
      this.handleClose();
      done();
    },
    handleClose() {
      this.index = 0;
      this.imageUrl = '';
      this.$refs.form.resetFields();
      this.$emit('closeDia');
    }
  }
};
</script>

<style lang="less" scoped>
.editModal {
  .el-form-item {
    margin-bottom: 2rem;

    .el-textarea {
      /deep/ .el-textarea__inner {
        letter-spacing: 2px;
      }
    }
    /deep/ .el-form-item__label {
      color: #888;
    }
  }
  .banner-container /deep/ .el-form-item__content {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }
  .banner-item {
    position: relative;
    margin-right: 3%;
    margin-bottom: 3%;
    height: 120px;

    .el-image {
      width: 200px;
      height: 100%;
      border: 1px dashed #ccc;
      border-radius: 5px;
    }
    .el-icon-delete {
      position: absolute;
      bottom: 0.75vh;
      font-size: 2.5vh;
      color: rgba(199, 0, 57, 0.7);
    }

    .el-icon-upload2 {
      position: absolute;
      bottom: 0.75vh;
      font-size: 2.75vh;
      color: rgba(199, 0, 57, 0.7);
    }

    .icon__action1 {
      right: 4vh;
    }

    .icon__action2 {
      right: 1vh;
    }
  }

  .avatar-uploader {
    margin-top: 1rem;
  }
}
</style>
