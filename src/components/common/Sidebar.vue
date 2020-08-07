<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#4c5e79"
      text-color="#fff"
      active-text-color="#fff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.children">
          <el-submenu :index="item.obj.index" :key="item.obj.index">
            <template slot="title">
              <i :class="item.obj.icon"></i>
              <span slot="title">{{ item.label }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children"
                :index="subItem.obj.index"
                :key="subItem.obj.index"
              >
                <template slot="title">{{ subItem.label }}</template>
                <el-menu-item
                  v-for="threeItem in subItem.children"
                  :key="threeItem.obj.index"
                  :index="threeItem.obj.index"
                  >{{ threeItem.label }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.obj.index"
                :key="subItem.obj.index"
                >{{ subItem.label }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.obj.index" :key="item.obj.index">
            <i :class="item.obj.icon"></i>
            <span slot="title">{{ item.label }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
import { mapState } from 'vuex';
import { userListMenu } from 'api/index';
export default {
  data() {
    return {
      collapse: false,
      items: [
        // {
        //     icon: 'el-icon-lx-home',
        //     index: 'dashboard',
        //     title: '系统首页'
        // },
        // {
        //     icon: 'el-icon-s-claim',
        //     index: '2',
        //     title: '设备管理',
        //     children: [
        //         {
        //             index: 'control',
        //             title: '运行监控'
        //         },
        //         {
        //             index: 'maintenance',
        //             title: '设备维保'
        //         },
        //         {
        //             index: 'statistics',
        //             title: '设备统计'
        //         }
        //     ]
        // },
        //  {
        //     icon: 'el-icon-s-cooperation',
        //     index: '4',
        //     title: '生产管理',
        //     children: [
        //         {
        //             index: 'production',
        //             title: '生产任务'
        //         },
        //         {
        //             index: 'assignment',
        //             title: '任务统计'
        //         }
        //     ]
        // },
        //  {
        //     icon: 'el-icon-s-data',
        //     index: '5',
        //     title: '数据统计',
        //     children: [
        //         {
        //             index: 'eqperformance',
        //             title: '设备绩效'
        //         },
        //         {
        //             index: 'poperformance',
        //             title: '人员绩效'
        //         },
        //         {
        //             index: 'mainstatistics',
        //             title: '维保统计'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-s-custom',
        //     index: '6',
        //     title: '人员管理',
        //     children: [
        //         {
        //             index: 'staff',
        //             title: '员工管理'
        //         },
        //         {
        //             index: 'jurisdiction',
        //             title: '权限管理'
        //         },
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-cascades',
        //     index: 'table',
        //     title: '基础表格'
        // },
        // {
        //     icon: 'el-icon-lx-calendar',
        //     index: '3',
        //     title: '表单相关',
        //     children: [
        //         {
        //             index: 'form',
        //             title: '基本表单'
        //         },
        //         {
        //             index: 'upload',
        //             title: '文件上传'
        //         }
        //     ]
        // },
        // {
        //     icon: 'el-icon-lx-warn',
        //     index: '7',
        //     title: '错误处理',
        //     children: [
        //         {
        //             index: 'permission',
        //             title: '权限测试'
        //         },
        //         {
        //             index: '404',
        //             title: '404页面'
        //         }
        //     ]
        // }
      ]
    };
  },
  computed: {
    //  ...mapState({
    //     userId:state=> state.userId
    // }),
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
    this.getuserListMenu();
  },
  methods: {
    getuserListMenu() {
      userListMenu({
        userId: sessionStorage.getItem('userId'),
        type: 'menu'
      }).then(res => {
        if (res.code === '0') {
          var arr = [];
          this.items = res.data;
          res.data.map(h => {
            if (h.id) {
              arr.push({ id: h.id, name: h.label });
            }
          });
          this.items.unshift({
            icon: 'el-icon-lx-home',
            index: 'dashboard',
            label: '系统首页',
            obj: {
              icon: 'el-icon-lx-home',
              index: 'dashboard'
            }
          });
          // 设置人员设置中角色权限
          sessionStorage.setItem('checkbox', JSON.stringify(arr));
        }
      });
    }
  }
};
</script>

<style>
.el-menu-item.is-active {
  background-color: #409baf !important;
}

.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 215px;
}
.sidebar > ul {
  height: 100%;
}
</style>
