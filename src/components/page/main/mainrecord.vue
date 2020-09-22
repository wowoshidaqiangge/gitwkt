<template>
  <div class="mainrecord">
    <div class="top">

      <el-form :model="seachinfo" ref="seachinfo" class="demo-ruleForm">
        <el-row type="flex" justify="end">
          <el-col :span="3" style="margin:0 20px">
            <el-form-item label="" prop="toType">
              <el-select v-if="roleId==1||roleId==0" v-model="toType" placeholder="选择部门" style="width:100%">
                <el-option v-for="item in deviceList" :label="item.enumValue" :key='item.enumKey' :value="item.enumKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="value1">
              <el-date-picker v-model="maintime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin:0 20px">
            <el-form-item label="">
              <el-select v-model="state" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="productNameOrCode">
              <el-input placeholder="请输入名称或编号" prefix-icon="el-icon-search" v-model="deviceNameOrCode"> </el-input>
            </el-form-item>
          </el-col>
          <div style="margin:0 15px">
            <el-button class="searchBtn" type="add" @click="searchmain()">查询</el-button>
            <el-button type="success" icon="el-icon-refresh-right" @click="resetting">重置</el-button>
          </div>
        </el-row>
      </el-form>

    </div>

    <div class="bot">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column v-for="(item, index) in columnlist" :key="index" :prop="item.prop" :label="item.label"
          align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state" type="success" plain @click="examine(scope.$index, scope.row)">查看
            </el-button>
            <el-button type="info" plain v-else class="red" @click="handledistribute(scope.$index, scope.row)">填报
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination :background="true" :current-page.sync="pagesize" @current-change="handleCurrentChange"
        layout="total, prev, pager, next" :total="totals"></el-pagination>
    </div>
    <recordmodal :dialogFormVisible="dialogFormVisible" @close="close" :tit="tit" :ifEdt="ifEdt" ref="recordmodal" />
  </div>
</template>

<script>
import { mainrecordpage, mainrecordid } from 'api/main';
import { deviceTypeList } from 'api/index'
import recordmodal from './recordmodal';
import bus from '@/components/common/bus';

export default {
  name: 'mainrecord',
  components: {
    recordmodal
  },
  data() {
    return {
      roleId: '',
      deviceNameOrCode: '',
      maintime: [],
      state: '',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '未保养',
          value: '0'
        },
        {
          label: '已保养',
          value: '1'
        }
      ],
      toType: '',
      deviceList: [], //设备类型列表
      tableData: [],
      page: {
        current: 1,
        size: 10
      },
      seachinfo: {},
      tit: '',
      ifEdt: false,
      totals: 0,
      pagesize: 1,
      screenWidth: document.body.clientHeight - 215 + 'px',
      dialogFormVisible: false,
      columnlist: [
        { prop: 'index', label: '序号' },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'deviceNumer', label: '设备编号' },
        { prop: 'deviceModel', label: '规格型号' },
        { prop: 'toTypeName', label: '设备类型' },
        { prop: 'category', label: '保养类别' },
        { prop: 'periods', label: '保养周期' },
        { prop: 'dateTime', label: '保养时间' },
        { prop: 'assumeUserName', label: '担当人' },
        { prop: 'dutyUserName', label: '责任人' },
        { prop: 'createTime', label: '新增时间' },
        { prop: 'content', label: '备注' },
        { prop: 'states', label: '状态' }
      ],
      init: {
        id: ''
      }
    };
  },
  computed: {},
  created() {
    this.roleId = sessionStorage.getItem('roleId')
    if(this.roleId==1||this.roleId==0){
      this.toType='1'
    }
    this.getdeviceTypeList()
    this.getmainrecordpage();
    if (this.$route.params.id) {
      this.init.id = this.$route.params.id;
    }
  },
  mounted() {
    if (this.init.id) {
      this.handledistribute(0, this.init);
    }
    bus.$on('gotoRecords', e => {
      this.init.id = e;
      this.handledistribute(0, this.init);
    });
  },
  methods: {
    // 获取部门(设备类型)
    getdeviceTypeList() {
      deviceTypeList().then(res => {
        if (res.code === '0') {
          this.deviceList = res.data
        }
      })
    },
    getmainrecordpage() {
      let obj = { ...this.seachinfo, ...this.page };
      mainrecordpage(obj).then(res => {
        if (res.code === '0') {
          res.data.records.map((item, index) => {
            item.createTime = item.createTime.split(' ')[0];
            item.states = item.state ? '已保养' : '未保养';
            item.periods = item.period === 'month' ? '月' : '年';
            item.index = index + 1;
            item.dateTime = item.dateTime + ':00'
          });
          this.pagesize = parseInt(res.data.current);
          this.totals = parseInt(res.data.total);
          this.tableData = res.data.records;
          console.log(this.tableData);
        }
      });
    },

    resetting() {
      this.seachinfo = { beginDate: '', endDate: '', state: '' };
      (this.state = ''), (this.deviceNameOrCode = '');
      this.maintime = [];
      this.page.current = 1;
      this.getmainrecordpage();
    },
    searchmain() {
      this.seachinfo.toType = this.toType
      this.seachinfo.beginDate = this.maintime[0];
      this.seachinfo.endDate = this.maintime[1];
      this.seachinfo.state = this.state;
      this.seachinfo.deviceNameOrCode = this.deviceNameOrCode;
      this.page.current = 1;
      this.getmainrecordpage();
    },
    // 查看
    examine(h, m) {
      this.tit = '查看';
      this.ifEdt = false;
      this.$refs.recordmodal.getmainrecordid({ id: m.id });
      this.dialogFormVisible = true;
    },
    // 填报
    handledistribute(h, m) {
      console.log(h);
      this.tit = '填报';
      this.ifEdt = true;
      this.$refs.recordmodal.getmainrecordid({ id: m.id });
      this.dialogFormVisible = true;
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getmainrecordpage();
    },
    close(num) {
      this.dialogFormVisible = false;
      if (num === '0') {
        this.getmainrecordpage();
      }
    }
  }
};
</script>

<style lang="less">
.mainrecord {
  .top {
    height: 50px;
    margin-top: 10px;
    // .searchBtn {
    //   height: 33px;
    //   margin-top: 5px;
    //   margin-left: 20px;
    // }
    // .el-range-editor--small.el-input__inner {
    //   height: 32px;
    //   margin-top: 7px;
    // }
    // .el-input--small {
    //   width: 220px;
    //   margin-left: 20px;
    // }
  }

  .page {
    margin-top: 10px;
    float: right;
  }
  .el-pager li.active {
    background-color: #409baf !important;
    color: #fff;
  }
}
</style>
