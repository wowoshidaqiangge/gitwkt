<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">联通5G全连接工厂管理平台</div>
      <el-form :model="param" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input
            type="text"
            v-if="isshow"
            v-model="param.username"
            areadonly
            placeholder="请输入账号"
            ref="getFocus"
            @keyup.enter.native="submitForm('0')"
          >
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-if="isshow"
            auto-complete="new-password"
            placeholder="请输入密码"
            v-model="param.password"
            @keyup.enter.native="submitForm('1')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, userListMenu } from 'api/index';
import { mapActions, mapState } from 'vuex';
import bus from './../common/bus';
export default {
  data: function() {
    return {
      param: {
        username: 'wkt',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      isshow: false,
      enter: []
    };
  },
  mounted() {
    setTimeout(() => {
      this.isshow = true;
    }, 1);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
      this.$refs.getFocus.focus();
    }, 100);
  },
  methods: {
    ...mapActions(['handleLogin']),

    async submitForm(id) {
      var that = this;
      this.$refs.login.validate(valid => {
        if (valid) {
          var obj = {};
          if (id === '0') {
            obj = { icCard: that.param.username };
          } else {
            obj = { ...that.param };
          }
          this.handleLogin(obj).then(res => {
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success',
              duration: 700
            });
            sessionStorage.setItem('ms_username', res.username);
            sessionStorage.setItem('password', res.password);
            sessionStorage.setItem('TagsList', '');
            this.enter = [];
            this.getMenuData(res.id, res.roleId);
          });
        } else {
          this.$message.error('请输入账号和密码');
          console.log('error submit!!');
          return false;
        }
      });
    },
    getMenuData(uid, rid) {
      userListMenu({
        userId: uid,
        type: 'menu'
      }).then(res => {
        if (res.code == '0') {
          for (let item of res.data) {
            if (item.id == '208') {
              this.enter.unshift('/bigscreenfirst');
            }
            if (item.id == '209') {
              this.enter.push('/bigscreensecond');
            }
          }
          if (Array.isArray(res.data[0].children) && res.data[0].children.length > 0) {
            this.enter.push('/' + res.data[0].children[0].obj.index);
          } else {
            this.enter.push('/');
          }
        } else {
          this.enter.push('/');
        }
        rid = parseInt(rid);
        if (rid >= 1100 && rid <= 1199) {
          this.$router.replace('/headman');
        } else {
          this.$router.replace(this.enter[0]);
        }
        // console.log(rid, this.enter);
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/wms31.png);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  background-image: url(../../assets/img/login.png);
  background-size: 100% 100%;
  position: absolute;
  left: 76%;
  top: 60%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  /* background: rgba(255, 255, 255, 0.3); */
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
