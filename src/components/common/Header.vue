<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <!-- <div style="height:40px;width:160px;margin-right:10px;float:left"><img style="width:100%;height:40px;margin-top:10px" src="~@/assets/logo.png"/></div> -->
    <div class="logo" @click="goGlobal">联通5G全连接工厂管理平台</div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="nowtime">{{ currentTime }} {{ nowWeek }}</div>
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen" v-if="fullScreenVis">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <el-popover placement="bottom" width="400" trigger="click" v-if="msgVis">
          <!-- <el-divider></el-divider> -->
          <el-table :data="tableData">
            <el-table-column property="deviceName" label="设备名称"></el-table-column>
            <el-table-column property="deviceNumer" label="设备编号"></el-table-column>
            <el-table-column property="dateTime" label="保养时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="gotoRecords(scope.row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-bell" slot="reference">
            <i class="el-icon-bell"></i>
            <span class="btn-bell-badge" v-if="totals > 0"></span>
          </div>
        </el-popover>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/wkt.png" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link" v-bind:style="fixColorObj">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mainrecordpage } from 'api/main';
import bus from '../common/bus';

export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: 'linxin',
      message: 2,
      timer: '', //定义一个定时器的变量
      currentTime: '', // 获取当前时间
      nowWeek: '',
      page: {
        current: 1,
        size: 10,
        deviceNameOrCode: '',
        state: 0,
        beginDate: '',
        endDate: ''
      },
      tableData: [],
      totals: 0,
      isheadman: false
    };
  },
  props: {
    fullScreenVis: {
      type: Boolean,
      default: true
    },
    msgVis: {
      type: Boolean,
      default: true
    },
    fixColorObj: {
      type: Object,
      default() {
        return {
          color: '#606266'
        };
      }
    }
  },
  computed: {
    username() {
      let username = sessionStorage.getItem('ms_username');
      return username ? username : this.name;
    }
  },
  beforeCreate() {
    var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function() {
      _this.setnowtime();
    }, 1000);
  },
  created() {
    this.page.beginDate = this.getToday();
    this.page.endDate = this.page.beginDate;
    this.getmainrecordpage();
    let that = this;
    //  bus.$on('isman', e=>{
    //     this.isheadman = true
    // })
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    goGlobal() {
      let enter = [];
      if (sessionStorage.getItem('checkbox')) {
        // 在sidebar组件中写的
        let menus = JSON.parse(sessionStorage.getItem('checkbox'));
        for (let menu of menus) {
          if (menu.id == '208') {
            enter.unshift('/bigscreenfirst');
          }
          if (menu.id == '209') {
            enter.push('/bigscreensecond');
          }
        }
        if (menus.length > 0) {
          this.$router.push(enter[0]);
        }
      }
    },
    setnowtime() {
      const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const wk = new Date().getDay();
      this.currentTime = //修改数据date
        new Date().getFullYear() +
        '/' +
        (new Date().getMonth() + 1) +
        '/' +
        new Date().getDate() +
        ' ' +
        this.appendZero(new Date().getHours()) +
        ':' +
        this.appendZero(new Date().getMinutes()) +
        ':' +
        this.appendZero(new Date().getSeconds());
      this.nowWeek = weeks[wk];
    },
    appendZero(obj) {
      if (obj < 10) {
        return '0' + obj;
      } else {
        return obj;
      }
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        sessionStorage.removeItem('ms_username');
        sessionStorage.removeItem('TagsList');
        this.$router.push('/login');
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    // 获得维保提醒（当日保养记录）
    getmainrecordpage() {
      mainrecordpage(this.page).then(res => {
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.createTime = item.createTime.split(' ')[0];
            item.states = item.state ? '已保养' : '未保养';
            item.index = index + 1;
          });
          this.pagesize = parseInt(res.data.current);
          this.totals = parseInt(res.data.total);
          this.tableData = res.data.records;
        }
      });
    },
    // 跳转到保养记录页面，并携带id，直接触发查看事件
    gotoRecords(e) {
      if (this.$route.fullPath !== '/mainrecord') {
        this.$router.push({ name: 'mainrecord', params: { id: e } });
      }
      bus.$emit('gotoRecords', e);
    },
    getToday() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      var nowData = year + '-' + month + '-' + day;
      return nowData;
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 22px;
  color: #2f4b76;
}
.nowtime {
  float: right;
  line-height: 60px;
  padding-right: 30px;
  font-size: 16px;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 60px;
}
.header .logo {
  cursor: pointer;
  float: left;
  width: 250px;
  line-height: 60px;
  letter-spacing: 2px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  /* color: #fff; */
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  /* color: #fff; */
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
