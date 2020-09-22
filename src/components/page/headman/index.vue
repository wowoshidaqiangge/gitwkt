<template>
  <div class="headman">
    <div class="headman-top">
      <v-head :fullScreenVis="false" :msgVis="false" :fixColorObj="{ color: '#fff' }"></v-head>
    </div>
    <div v-show="tabIndex === 0" class="headman-content">
      <div class="content-head">
        <el-button type="add" v-show="$_has('SALARYSELFONE') || $_has('SALARYSELFTWO')" @click="gotoSalary"
          >当月工资</el-button
        >
      </div>
      <div class="content-container">
        <div class="content-item" v-for="(item, index) in userList" :key="index">
          <div class="p1 p0">
            <p>{{ item.taskNumber }}</p>
            <p class="btn btn2" v-if="item.reportState === 2">
              未领单
            </p>
            <p class="btn btn1" v-if="item.reportState === 3 || item.reportState === 4">
              生产中
            </p>
          </div>
          <div class="p2 p0">
            <span>{{ item.itemName }}&nbsp;</span>
            <span v-show="item.itemCode"> ({{ item.itemCode }})</span>
          </div>
          <div class="p0">
            <p>规格型号:</p>
            <p>{{ item.itemModel }}</p>
          </div>
          <div class="p0">
            <p>派件数量:</p>
            <p>{{ item.assignCount }}</p>
          </div>
          <div class="p0">
            <p>工序:</p>
            <p>{{ item.workprocessName }}</p>
          </div>
          <div class="p0">
            <p>已生产数:</p>
            <p>{{ item.nowCount }}</p>
          </div>
          <div class="progre">
            <el-progress type="circle" :percentage="item.produceProgress" :width="60"></el-progress>
          </div>
          <div class="subBtn">
            <el-button
              type="info"
              size="mini"
              v-show="item.technology"
              @click="viewFile(item.technology, item.technologyName)"
              >查看工艺</el-button
            >
            <el-button type="add" size="mini" v-show="item.reportState === 2" @click="gotoClaim(item)">领单</el-button>
            <el-button
              type="add"
              size="mini"
              v-show="item.reportState === 3 || item.reportState === 4 || item.reportState === 5"
              @click="gotoDetail(item)"
              >详情</el-button
            >
          </div>
        </div>
      </div>
      <el-dialog
        title="领单"
        :visible.sync="dialogVisible"
        width="40%"
        :destroy-on-close="true"
        :before-close="beforeclose"
        center
      >
        <p class="modal__tip">请刷取您的员工卡或账号密码验证身份，完成领单！</p>
        <el-input
          class="modal__input"
          v-model="cardInput"
          placeholder="方式一：刷卡领单"
          ref="getFocus"
          @keyup.enter.native="cliamSubmit()"
        ></el-input>
        <el-input class="modal__input" v-model="passwordInput" placeholder="方式二：密码验证"></el-input>
        <el-button type="add" @click="cliamSubmit()" style="margin-left:1rem">确定</el-button>
      </el-dialog>
      <el-dialog
        title="查看工资"
        :visible.sync="dialogVisibleSalary"
        width="40%"
        :destroy-on-close="true"
        :before-close="beforeclose4"
        center
      >
        <p class="modal__tip">请刷取您的员工卡查看工资！</p>
        <el-input
          class="modal__input"
          v-model="cardInput3"
          placeholder="方式一：刷卡验证"
          ref="getFocus4"
          @keyup.enter.native="salarySubmit()"
        ></el-input>
        <el-input class="modal__input" v-model="passwordInput3" placeholder="方式二：密码验证"></el-input>
        <el-button type="add" @click="salarySubmit()" style="margin-left:1rem">确定</el-button>
      </el-dialog>
    </div>
    <div v-show="tabIndex === 1" class="detail">
      <div v-if="curItem.productType != 4" class="headman-detail">
        <div class="detail-head">
          <el-button type="add" @click="gotoHome">返 回</el-button>
        </div>
        <div class="detail-container">
          <div class="detail__item detail__item1">
            <h4 class="item__title">基本信息：</h4>
            <div class="item__container">
              <div class="item__left">
                <el-avatar
                  class="item__left--avatar"
                  shape="square"
                  :size="150"
                  fit="fill"
                  :src="userData.photoUrl"
                ></el-avatar>
              </div>
              <div class="item__right">
                <span class="item__text"
                  >姓名：
                  <span class="text__value">{{ userData.name }}</span>
                </span>
                <span class="item__text"
                  >手机号：
                  <span class="text__value">{{ userData.phone }}</span>
                </span>
                <span class="item__text"
                  >工号： <span class="text__value">{{ userData.officeNo }}</span> </span
                ><span class="item__text"
                  >IC卡号： <span class="text__value">{{ userData.icCard }}</span> </span
                ><span class="item__text"
                  >角色：
                  <span class="text__value">{{ userData.roleName }}</span>
                </span>
                <span class="item__text"
                  >所属部门：
                  <span class="text__value">{{ userData.deptName }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="detail__item detail__item2">
            <h4 class="item__title" v-if="curItem.productType == 1">零件基本信息：</h4>
            <h4 class="item__title" v-if="curItem.productType == 2">产品基本信息：</h4>
            <h4 class="item__title" v-if="curItem.productType == 3">滑块基本信息：</h4>
            <div class="item__container">
              <span class="item__text"
                >生产工单：<span class="text__value">{{ curItem.taskNumber }}</span></span
              >
              <span class="item__text"
                >物料编码：<span class="text__value">{{ curItem.itemCode }}</span></span
              >
              <span class="item__text"
                >物料图号：<span class="text__value">{{ curItem.itemNumber }}</span></span
              >
              <span class="item__text"
                >物料名称：<span class="text__value">{{ curItem.itemName }}</span></span
              >
              <span class="item__text"
                >规格型号：<span class="text__value">{{ curItem.itemModel }}</span></span
              >
              <span class="item__text"
                >计划产量：<span class="text__value">{{ curItem.planYield }}</span></span
              >
              <span class="item__text"
                >计划开始时间：<span class="text__value">{{ curItem.planStartTime }}</span></span
              >
              <span class="item__text"
                >计划结束时间：<span class="text__value">{{ curItem.planEndTime }}</span></span
              >
              <span class="item__text"
                >生产部门：<span class="text__value">{{ curItem.deptName }}</span></span
              >
              <span class="item__text" v-if="curItem.productType != 3 && curItem.productType != 4"
                >发料人：<span class="text__value">{{ curItem.billName }}</span></span
              >
              <span class="item__text"
                >特殊要求：<span class="text__value">{{ curItem.remark }}</span></span
              >
              <span class="item__text"
                ><el-button
                  type="info"
                  size="mini"
                  v-show="curItem.technology && curItem.technology !== ''"
                  @click="viewFile(curItem.technology, curItem.technologyName)"
                  >查看工艺</el-button
                ></span
              >
            </div>
          </div>
          <div class="detail__item detail__item2">
            <h4 class="item__title">工序基本信息：</h4>
            <div class="item__container">
              <span class="item__text"
                >工种：<span class="text__value">{{ curItem.workKind }}</span></span
              >
              <span class="item__text"
                >工序：<span class="text__value">{{ curItem.workprocessName }}</span></span
              >
              <span class="item__text"
                >派工人员：<span class="text__value">{{ curItem.createUser }}</span></span
              >
              <span class="item__text"
                >设备编号：<span class="text__value">{{ curItem.deviceNumber }}</span></span
              >
              <span class="item__text"
                >派工日期：<span class="text__value">{{ curItem.createTime }}</span></span
              >
              <span class="item__text"
                >计划结束时间：<span class="text__value">{{ curItem.planEndTime }}</span></span
              >
              <span class="item__text"
                >工作人员：<span class="text__value">{{ curItem.assignUserName }}</span></span
              >
              <span class="item__text"
                >结算方式：<span class="text__value">{{ curItem.accountTypeName }}</span></span
              >
              <span class="item__text"
                >派件数量：<span class="text__value">{{ curItem.assignCount }}</span></span
              >
              <span class="item__text"
                >已生产数量：<span class="text__value">{{ curItem.nowCount }}</span></span
              >
            </div>
          </div>
          <div class="detail__item detail__item3">
            <h4 class="item__title">报工记录</h4>
            <div class="table-box">
              <el-table :data="tableData" border height="300">
                <el-table-column
                  v-for="item in columnList"
                  :width="item.width"
                  :key="item.index"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="btn--group">
              <el-button type="add" class="btn-large__single" @click="gotoBook(curItem)">报工</el-button>
            </div>
          </div>
          <div class="detail__item detail__item4">
            <h4 class="item__title">质检记录：</h4>
            <div class="item__item">
              <p class="text__title">首检确认：</p>
              <p class="text__label">
                班组长：<span class="text__value">{{ qualityData.firstcheckSquadUser }}</span>
                <el-button type="add" @click="gotoQuality(0)">班组长确认</el-button>
              </p>
              <p class="text__label">
                质检员：<span class="text__value">{{ qualityData.firstcheckExamUser }}</span>
                <el-button type="add" @click="gotoQuality(1)">质检员确认</el-button>
              </p>
            </div>
            <div class="item__item">
              <p class="text__title">巡检确认：</p>
              <p class="text__label">
                质检员：<span class="text__value">{{ qualityData.secondcheckExamUser }}</span>
                <el-button type="add" @click="gotoQuality(2)">质检员确认</el-button>
              </p>
            </div>
          </div>
          <div
            class="detail__item detail__item3"
            id="elFullScreen"
            v-if="curItem.workprocessCode === specialWorkprocessCode"
          >
            <h4 class="item__title">
              装配测试信息录入：
              <span class="btn-fullscreen" @click="handleFullScreen"><i class="el-icon-rank"></i></span>
            </h4>
            <div class="table-box">
              <el-table :data="tableData4" border height="300" :default-sort="{ prop: 'partCode', order: 'ascending' }">
                <el-table-column label="序号" width="60" align="center">
                  <template slot-scope="scope"
                    ><span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-for="(item, index) in columnList4"
                  :width="item.width"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                >
                </el-table-column>
                <el-table-column label="附件" align="center" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="add"
                      v-show="scope.row.testbillUrl"
                      @click="viewFile(scope.row.testbillUrl, scope.row.testbillName)"
                      >查看</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="btn--group">
              <el-button type="add" @click="handleAssembleImport(0)">单个录入</el-button>
              <el-button type="add" class="btn-large__two" @click="handleAssembleImport(1)">批量录入</el-button>
            </div>
          </div>
        </div>
        <el-dialog
          :title="assembleModal.title"
          :visible="assembleModal.dialogVisibleAssemble"
          :before-close="beforeclose5"
          center
        >
          <el-row>
            <el-form :model="assembleForm" ref="assembleForm">
              <div class="modalcont">
                <el-col :span="11">
                  <el-form-item label="生产工单" label-width="80px" prop="taskNumber">
                    <el-input v-model="assembleForm.taskNumber" disabled autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="物料编码" label-width="80px" prop="itemCode">
                    <el-input v-model="assembleForm.itemCode" disabled autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="物料图号" label-width="80px" prop="itemNumber">
                    <el-input v-model="assembleForm.itemNumber" disabled autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="物料名称" label-width="80px" prop="itemName">
                    <el-input v-model="assembleForm.itemName" disabled autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <el-row>
                <el-col :span="11" v-if="assembleModal.assembleImportVol === false">
                  <el-form-item label="泵体编号" label-width="80px" prop="partCode">
                    <el-input v-model="assembleForm.partCode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-else>
                  <span style="color: red;"
                    >注意：批量录入的文件名格式为 “物料编码-泵体编码”，且一次最多上传20个。</span
                  >
                </el-col>
              </el-row>
              <el-col :span="24" class="uploadbox">
                <p style="line-height:32px;font-size: 18px;color: #324170;">装配测试信息录入:</p>
                <el-upload
                  class="upload-demo"
                  ref="updata"
                  drag
                  multiple
                  :action="upload.host"
                  :data="upload.ossParams"
                  :limit="upload.limit"
                  :file-list="upload.fileList"
                  accept=".xlsx,.xls"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :on-remove="handleRemove"
                  :on-exceed="exceed"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传（支持多个文件）</em></div>
                  <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件</div>
                </el-upload>
              </el-col>
            </el-form>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button @click="assembleModal.dialogVisibleAssemble = false">取 消</el-button>
            <el-button type="primary" @click="assembleImport()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div v-else class="headman-detail2">
        <div class="detail2__left">
          <div class="left__item detail2__item1">
            <h4 class="item__title">基本信息：</h4>
            <div class="item__container">
              <div class="item__left">
                <el-avatar
                  class="item__left--avatar"
                  shape="square"
                  :size="150"
                  fit="fill"
                  :src="userData.photoUrl"
                ></el-avatar>
              </div>
              <div class="item__right">
                <span class="item__text"
                  >姓名：
                  <span class="text__value">{{ userData.username }}</span>
                </span>
                <span class="item__text"
                  >工号： <span class="text__value">{{ userData.officeNo }}</span> </span
                ><span class="item__text"
                  >角色：
                  <span class="text__value">{{ userData.roleName }}</span>
                </span>
                <span class="item__text"
                  >工序：
                  <span class="text__value">{{ curItem.workprocessName }}</span>
                </span>
                <span class="item__text"
                  >设备编号： <span class="text__value">{{ curItem.deviceNumber }}</span>
                </span>
                <span class="item__text"
                  >设备名称：
                  <span class="text__value">{{ curItem.deviceName }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="left__item detail2__item2">
            <h4 class="item__title">导轨信息导入：</h4>
            <div class="item__item">
              <span class="text__title">设备编码：</span>
              <el-input
                v-model.trim="guideForm.deviceNumber"
                placeholder="请输入设备编码"
                @input="deviceNumberChange"
              ></el-input>
            </div>
            <div class="item__item">
              <span class="text__title">产品编码：</span>
              <el-input v-model.trim="guideForm.itemCode" placeholder="请输入产品编码"></el-input>
              <el-button type="add" @click="guideImport(0)">确认</el-button>
            </div>
            <div class="item__item">
              <span class="text__title">批量导入：</span>
              <el-button type="add" @click="guideImport(1)">批量导入</el-button>
            </div>
          </div>
          <div class="left__item detail2__item3">
            <h4 class="item__title">质检记录：</h4>
            <div class="item__item">
              <p class="text__title">首检确认：</p>
              <p class="text__label">
                班组长：<span class="text__value">{{ qualityData.firstcheckSquadUser }}</span>
                <el-button type="add" @click="gotoQuality(0)">班组长确认</el-button>
              </p>
              <p class="text__label">
                质检员：<span class="text__value">{{ qualityData.firstcheckExamUser }}</span>
                <el-button type="add" @click="gotoQuality(1)">质检员确认</el-button>
              </p>
            </div>
            <div class="item__item">
              <p class="text__title">巡检确认：</p>
              <p class="text__label">
                质检员：<span class="text__value">{{ qualityData.secondcheckExamUser }}</span>
                <el-button type="add" @click="gotoQuality(2)">质检员确认</el-button>
              </p>
            </div>
          </div>
        </div>
        <div class="detail2__right">
          <div class="right__top">
            <span class="top__title">导轨信息</span>
            <span class="top__item">计划生产量：{{ curItem.planYield }}</span>
            <span class="top__item">已生产数：{{ curItem.nowCount }}</span>
            <el-button type="add" plain class="btn--ahead" @click="gotoBook(curItem)">报工</el-button>
            <el-button class="btn--right" type="add" @click="gotoHome">返 回</el-button>
          </div>
          <div class="right__table">
            <el-table :data="tableData2" border stripe v-loading="loading2" size="medium">
              <el-table-column label="序号" prop="index" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in columnList2"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                align="center"
              >
              </el-table-column>
              <el-table-column prop="qualityState" label="状态" align="center" width="120">
                <template slot-scope="scope">
                  <span v-if="!scope.row.qualityState">待检验</span>
                  <span style="color:#67C23A" v-if="scope.row.qualityState == 1">合格</span>
                  <span style="color:#F56C6C" v-if="scope.row.qualityState == 2">不合格</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next"
              :total="page.total"
              :page-size.sync="page.size"
              :current-page.sync="page.current"
            >
            </el-pagination>
          </div>
        </div>
        <el-dialog
          title="批量录入"
          :visible.sync="dialogVisibleVol"
          width="40%"
          :destroy-on-close="true"
          :before-close="beforeclose3"
          center
        >
          <p class="modalVol__tip">产品编码：</p>
          <el-input
            class="modalVol__input"
            v-model="guideForm.itemCodeList"
            type="textarea"
            :rows="8"
            placeholder="产品编码 (回车换行)"
            ref="getFocus3"
          ></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleVol = false">取 消</el-button>
            <el-button type="add" @click="guideImportVol()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-dialog
        title="质检"
        :visible.sync="dialogVisibleQuality"
        width="40%"
        :destroy-on-close="true"
        :before-close="beforeclose2"
        center
      >
        <p class="modal__tip">请刷取您的员工卡或账号密码验证身份，完成质检确认！</p>
        <el-row>
          <el-col>
            <span class="modal__label">方式一：</span>
            <el-input
              class="modal__input2"
              style="padding-bottom: 50px"
              v-model="cardInput2"
              placeholder="质检员刷卡"
              ref="getFocus2"
              @keyup.enter.native="loginSubmit()"
            >
            </el-input
          ></el-col>
          <el-col>
            <span class="modal__label">方式二：</span>
            <el-input
              class="modal__input2"
              v-model="usernameInput2"
              placeholder="质检员的用户名或手机号"
              style="padding-bottom: 50px"
            ></el-input>
            <el-input class="modal__input2" v-model="passwordInput2" placeholder="质检员的密码"></el-input>
            <el-button type="add" @click="loginSubmit()" style="margin-left:1rem">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <bookingModal :dialogVisible="dialogVisibleBook" @close="close" ref="bookmodal" />
    </div>
    <div v-show="tabIndex === 2" class="headman-salary">
      <el-button type="add" @click="tabIndex = 0">返回</el-button>
      <el-table :data="tableData3" border stripe v-loading="loading3">
        <el-table-column label="序号" prop="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columnList3"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  taskPlanByUserId,
  updateTaskPlanClaimById,
  userDataById,
  getQualityRecord,
  postQuality,
  pageByProduceTaskPlanId,
  getGuidePage,
  postGuide,
  postGuideList,
  getSalaryList
} from 'api/headman';
import { login } from 'api/index';
import { onenet } from 'api/onenet';
import vHead from 'components/common/Header.vue';
import { getBlob, saveAs, isEmpty } from '@/utils/util';

export default {
  name: 'headman',
  components: {
    vHead,
    bookingModal: () => import('./bookingModal')
  },
  data() {
    return {
      icCard: '',
      password: '',
      username: '',
      roleId: '',
      userId: '',
      deptId: '',
      rawDeptId: '',
      tabIndex: 0,
      userList: [],
      timer: '',
      dialogVisible: false,
      cardInput: '',
      passwordInput: '',
      usernameInput2: '',
      passwordInput2: '',
      curItem: {},
      dialogVisibleBook: false,
      userData: {},
      qualityData: {
        firstcheckSquadUser: '--',
        firstcheckExamUser: '--',
        secondcheckExamUser: '--'
      },
      cardInput2: '',
      dialogVisibleQuality: false,
      checkType: '',
      dialogVisibleVol: false,
      tableData: [],
      columnList: [
        { prop: 'index', label: '序号', width: 60 },
        { prop: 'reportNumber', label: '报工流水号' },
        { prop: 'produceCount', label: '生产数量', width: 80 },
        { prop: 'totalCount', label: '累计产量', width: 80 },
        { prop: 'createTime', label: '报工时间' }
      ],
      tableData2: [],
      columnList2: [
        { prop: 'itemCode', label: '产品编号' },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'deviceNumber', label: '设备编号', width: 100 },
        { prop: 'workerUser', label: '操作工', width: 120 },
        { prop: 'createTime', label: '录入时间' },
        { prop: 'checkExamUser', label: '检验员', width: 120 },
        { prop: 'checkExamTime', label: '检验时间' }
      ],
      page: { current: 1, size: 10, total: 0, pages: 1 },
      loading2: false,
      guideForm: {
        deviceNumber: '',
        itemCode: '',
        itemCodeList: ''
      },
      specialWorkprocessCode: '0208', // 一部的装配测试工序有个特殊展示
      tableData3: [],
      loading3: false,
      columnList3: Object.freeze([
        { prop: 'userName', label: '姓名' },
        { prop: 'officeNo', label: '工号' },
        { prop: 'deptName', label: '部门' },
        { prop: 'itemCode', label: '物料编码' },
        { prop: 'itemName', label: '物料名称' },
        { prop: 'workprocessCode', label: '工序编号' },
        { prop: 'workprocessName', label: '工序' },
        { prop: 'accountTypeName', label: '结算方式' }, // 1-计件，2-计时，3-计件、计时组合
        { prop: 'hourlyPrice', label: '计时工价', width: 60 },
        { prop: 'manHour', label: '计时时间', width: 50 },
        { prop: 'concessionWork', label: '让步工H', width: 50 },
        { prop: 'relegationWork', label: '降级工C', width: 50 },
        { prop: 'concessionMaterial', label: '让步料H', width: 50 },
        { prop: 'relegationMaterial', label: '降级料C', width: 50 },
        { prop: 'qualified', label: '合格P', width: 50 },
        { prop: 'supplement', label: '补', width: 50 },
        { prop: 'finishTime', label: '完成时间' },
        { prop: 'salary', label: '工资(元)' },
        { prop: 'createTime', label: '结算时间' }
      ]),
      dialogVisibleSalary: false,
      cardInput3: '',
      passwordInput3: '',
      columnList4: [
        { prop: 'itemCode', label: '物料编号' },
        { prop: 'partCode', label: '泵体编号', width: 80 },
        { prop: 'createTime', label: '时间' }
      ],
      tableData4: [],
      assembleModal: {
        title: '测试信息单个录入',
        dialogVisibleAssemble: false,
        assembleImportVol: false
      },
      assembleForm: {},
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
        },
        fileList: []
      },
      itemList: []
    };
  },
  computed: {
    // roleFlag() {
    //   const roleId = parseInt(this.roleId);
    //   if (roleId >= 1100 && roleId <= 1199) {
    //     // 操作工
    //     return 0;
    //   }
    //   if (roleId >= 1000 && roleId <= 1099) {
    //     // 质检员 -> 质检员不进领单报工
    //     return 1;
    //   }
    // }
  },
  created() {
    this.icCard = sessionStorage.getItem('icCard') || '';
    this.password = sessionStorage.getItem('password') || '';
    this.username = sessionStorage.getItem('ms_username') || '';
    this.roleId = sessionStorage.getItem('roleId') || '';
    this.userId = sessionStorage.getItem('userId') || '';
    this.deptId = sessionStorage.getItem('deptId') || '';
    if (this.deptId == 7) {
      this.rawDeptId = 7;
    }
    if (this.deptId == 8 || this.deptId == 19 || this.deptId == 20) {
      this.rawDeptId = 8;
    }

    this.init();
  },
  methods: {
    init() {
      this.qualityData = {
        firstcheckSquadUser: '--',
        firstcheckExamUser: '--',
        secondcheckExamUser: '--'
      };
      this.tabIndex = 0;
      this.tableData.length = 0;
      this.getMainData();
    },

    // 主页数据
    getMainData() {
      taskPlanByUserId().then(res => {
        if (res.code === '0') {
          const accountTypeNames = ['', '计件', '计时', '计件和计时'];
          for (const i of res.data) {
            i.accountTypeName = accountTypeNames[i.accountType];
            i.nowCount = i.nowCount || 0;
            i.produceCount = i.produceCount || 0;
            i.produceProgress = parseInt(i.produceProgress) || 0;
            if (i.createTime) {
              i.createTime = i.createTime.split(' ')[0];
            }
            if (i.createUser) {
              i.createUser = i.createUser.split('"')[1];
            }
          }
          this.userList = res.data;
        }
      });
    },
    gotoHome() {
      this.init();
    },
    // 领单(领单成功后跳转到报工详情页)
    gotoClaim(val) {
      this.curItem = val;
      this.dialogVisible = true;
      this.$nextTick(function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
          this.$refs.getFocus.focus();
        }, 100);
      });
    },
    // 领单确认
    cliamSubmit() {
      if (this.icCard === this.cardInput || this.password === this.passwordInput) {
        const {
          produceTaskId,
          produceTaskPlanId,
          partTaskId,
          taskAssignId,
          produceState,
          workprocessType,
          itemId,
          itemCode,
          workprocessId,
          workprocessCode,
          productType
        } = this.curItem;
        const obj = {
          produceTaskId,
          produceTaskPlanId,
          partTaskId,
          taskAssignId,
          produceState,
          workprocessType,
          itemId,
          itemCode,
          workprocessId,
          workprocessCode,
          productType
        };
        updateTaskPlanClaimById(obj).then(res => {
          if (res.code === '0') {
            this.$message.success(res.msg);
            this.beforeclose();
            this.getMainData();
          } else {
            // this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error('卡号或密码与登录者不符！');
        this.cardInput = '';
        this.passwordInput = '';
      }
    },
    // 领单后关闭弹框
    beforeclose() {
      this.dialogVisible = false;
      this.cardInput = '';
      this.passwordInput = '';
    },

    // 报工详情，进详情页再进行报工
    gotoDetail(val) {
      console.log(val);
      this.curItem = val;
      this.tabIndex = 1;
      this.getUserData(this.userId);
      this.getQualityData(val.produceTaskPlanId, val.workprocessId);
      if (this.curItem.productType != 4) {
        this.getReportData(val.produceTaskPlanId, val.workprocessId, val.assignUserId);
        if (this.curItem.workprocessCode == this.specialWorkprocessCode) {
          this.getAssembleData();
        }
      } else {
        this.guideForm.deviceNumber = this.curItem.deviceNumber;
        this.deviceNumberChange();
        this.getGuideData(val);
      }
    },
    getUserData(uid) {
      userDataById(uid).then(res => {
        if (res.code === '0') {
          this.userData = res.data;
        }
      });
    },
    getQualityData(pid, wid) {
      const obj = { produceTaskPlanId: pid, workprocessId: wid };
      getQualityRecord(obj).then(res => {
        if (res.code === '0') {
          if (res.data) {
            for (const key in res.data) {
              if (res.data[key] !== '') {
                const tmp = res.data[key].split('"');
                res.data[key] = tmp[1];
              } else {
                res.data[key] = '--';
              }
            }
            this.qualityData = res.data;
          }
        }
      });
    },
    getReportData(pid, wid, uid) {
      const obj = { produceTaskPlanId: pid, workprocessId: wid, userId: uid };
      pageByProduceTaskPlanId(obj).then(res => {
        if (res.code === '0') {
          res.data.map((item, index) => {
            item.index = index + 1;
          });
          this.tableData = res.data;
        }
      });
    },
    updateReport() {
      this.getReportData(this.curItem.produceTaskPlanId, this.curItem.workprocessId, this.curItem.assignUserId);
    },
    getGuideData(val) {
      const { current, size } = this.page;
      const { produceTaskPlanId, workprocessId } = val;
      const obj = { produceTaskPlanId, workprocessId, current, size, type: 2 };
      this.loading2 = true;
      getGuidePage(obj).then(res => {
        if (res.code === '0') {
          res = res.data;
          res.records.map(item => {
            if (item.workerUser && item.workerUser.split('"').length > 1) {
              item.workerUser = item.workerUser.split('"')[1];
            }
            if (item.checkExamUser && item.checkExamUser.split('"').length > 1) {
              item.checkExamUser = item.checkExamUser.split('"')[1];
            }
          });
          this.tableData2 = res.records;
          res.total = parseInt(res.total);
          res.pages = parseInt(res.pages);
          res.current = parseInt(res.current);
          res.size = parseInt(res.size);
          const { total, pages, current, size } = res;
          this.page = { total, pages, current, size };
        }
      });
      this.loading2 = false;
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.getGuideData(this.curItem);
    },

    // 报工
    gotoBook(val) {
      console.log(val);
      this.dialogVisibleBook = true;
      this.$refs.bookmodal.getform(val);
    },
    close(num, val) {
      this.dialogVisibleBook = false;
      if (num === '0') {
        // 刷新报工记录表格
        this.curItem.nowCount = parseInt(val);
        this.updateReport();
      }
    },

    //质检
    gotoQuality(index) {
      this.checkType = index;
      this.dialogVisibleQuality = true;
      this.$nextTick(function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
          this.$refs.getFocus2.focus();
        }, 100);
      });
    },
    qualitySubmit() {
      const { produceTaskId, produceTaskPlanId, itemId, itemCode, workprocessId, workprocessCode, type } = this.curItem;
      const obj = { produceTaskId, produceTaskPlanId, itemId, itemCode, workprocessId, workprocessCode, type };
      obj.checkType = this.checkType;
      postQuality(obj)
        .then(res => {
          if (res && res.code === '0') {
            this.$message.success('质检成功');
            this.beforeclose2();
            this.getQualityData(this.curItem.produceTaskPlanId, this.curItem.workprocessId);
          } else {
            // this.$message.error(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loginSubmit() {
      let obj = {};
      if (this.cardInput2 == '') {
        obj = { username: this.usernameInput2, password: this.passwordInput2 };
      } else {
        obj = { icCard: this.cardInput2 };
      }
      login(obj).then(res => {
        if (res.code == 0) {
          res = res.data;
          if (this.rawDeptId == res.deptId && res.roleId >= 1000 && res.roleId <= 1099) {
            sessionStorage.setItem('quality_userName', JSON.stringify(res.name));
            sessionStorage.setItem('quality_userId', res.id);
            // const header = { userId: res.id, userName: encodeURI(res.name) };
            this.qualitySubmit();
          } else {
            this.$message.error('抱歉，请输入正确的卡号或账号密码');
            this.cardInput2 = '';
            this.usernameInput2 = '';
            this.passwordInput2 = '';
          }
        }
      });
    },
    beforeclose2() {
      this.dialogVisibleQuality = false;
      this.cardInput2 = '';
      this.usernameInput2 = '';
      this.passwordInput2 = '';
    },

    // 导轨信息导入
    deviceNumberChange(val) {
      // 五分钟清空设备编码
      if (timer) {
        clearTimeout(timer);
      }
      const timer = setTimeout(() => {
        this.guideForm.deviceNumber = '';
      }, 300000);
    },
    guideImport(index) {
      if (index === 0) {
        if (
          this.guideForm.deviceNumber &&
          this.guideForm.deviceNumber !== '' &&
          this.guideForm.itemCode &&
          this.guideForm.itemCode !== ''
        ) {
          const {
            produceTaskId,
            produceTaskPlanId,
            workprocessType,
            workprocessId,
            workprocessCode,
            productType
          } = this.curItem;
          const { deviceNumber, itemCode } = this.guideForm;
          const obj = {
            deviceNumber,
            itemCode,
            type: 2,
            produceTaskId,
            produceTaskPlanId,
            workprocessType,
            workprocessId,
            workprocessCode,
            productType,
            productId: this.curItem.itemId,
            productCode: this.curItem.itemCode,
            productModel: this.curItem.itemModel
          };
          postGuide(obj).then(res => {
            if (res.code === '0') {
              this.$message.success(res.msg);
              this.syncCount();
              this.guideForm.itemCode = '';
              this.getGuideData(this.curItem);
            } else {
              // this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.warning('请填写设备及产品编码');
        }
      }
      if (index === 1) {
        this.dialogVisibleVol = true;
      }
    },
    guideImportVol() {
      if (!isEmpty(this.guideForm.deviceNumber) && !isEmpty(this.guideForm.itemCodeList)) {
        const {
          produceTaskId,
          produceTaskPlanId,
          workprocessType,
          workprocessId,
          workprocessCode,
          productType
        } = this.curItem;
        const { deviceNumber, itemCodeList } = this.guideForm;
        let obj = {
          deviceNumber,
          type: 2,
          itemCodeList: [],
          produceTaskId,
          produceTaskPlanId,
          workprocessType,
          workprocessId,
          workprocessCode,
          productType,
          productId: this.curItem.itemId,
          productCode: this.curItem.itemCode,
          productModel: this.curItem.itemModel
        };
        let tmp = [];
        for (let item of itemCodeList.split('\n')) {
          if (!isEmpty(item)) {
            tmp.push(item);
          }
        }
        obj.itemCodeList = this.uniqueArr(tmp); // 批量添加时，产品编码去重
        postGuideList(obj).then(res => {
          if (res.code === '0') {
            this.$message.success(res.msg);
            this.guideForm.itemCodeList = '';
            this.dialogVisibleVol = false;
            this.getGuideData(this.curItem);
            this.syncCount();
          } else {
            // this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.warning('请填写设备及产品编码，产品编码以回车换行');
      }
    },
    // 刷新生产数量
    syncCount() {
      taskPlanByUserId().then(res => {
        for (const i of res.data) {
          if (
            i.produceTaskPlanId == this.curItem.produceTaskPlanId &&
            i.assignUserId == this.curItem.assignUserId &&
            i.workprocessId == this.curItem.workprocessId
          ) {
            this.curItem.nowCount = i.nowCount;
            return;
          } else {
            this.curItem.nowCount = this.curItem.nowCount;
          }
        }
      });
    },
    beforeclose3() {
      this.dialogVisibleVol = false;
      this.guideForm.itemCodeList = '';
    },

    // 工资页面：
    gotoSalary() {
      this.dialogVisibleSalary = true;
      this.$nextTick(function() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // 100毫秒延迟解决第二次打开弹框，输入框不自动获取焦点的bug
          this.$refs.getFocus4.focus();
        }, 100);
      });
    },
    salarySubmit() {
      if (this.icCard === this.cardInput3 || this.password === this.passwordInput3) {
        this.beforeclose4();
        this.tabIndex = 2;
        this.loading3 = true;
        getSalaryList()
          .then(res => {
            console.log(res);
            if (res.code == 0) {
              res = res.data;
              let accountTypeNames = ['-', '计件', '计时', '计件、计时组合'];
              for (let item of res) {
                item.accountTypeName = accountTypeNames[parseInt(item.accountType)];
                item.createTime = item.createTime ? item.createTime.split(' ')[0] : '';
                item.finishTime = item.finishTime ? item.finishTime.split(' ')[0] : '';
              }
              this.tableData3 = res;
            } else {
              // this.$message.error('无法获取数据，请稍后再试');
            }
          })
          .catch(error => {});
        this.loading3 = false;
      } else {
        this.$message.error('卡号与登录者卡号不符！');
        this.cardInput3 = '';
        this.passwordInput3 = '';
      }
    },
    beforeclose4() {
      this.dialogVisibleSalary = false;
      this.cardInput3 = '';
      this.passwordInput3 = '';
    },
    // 装配特殊工序
    getAssembleData() {
      const { produceTaskPlanId, workprocessId } = this.curItem;
      const obj = { produceTaskPlanId, workprocessId, current: 1, size: 500, type: 1 }; // 不分页了
      getGuidePage(obj).then(res => {
        if (res.code === '0') {
          res = res.data;
          // res.records.map(item => {
          //   item.createTime = item.createTime.split(' ')[0];
          // });
          this.tableData4 = res.records;
        }
      });
    },
    handleAssembleImport(index) {
      let { produceTaskPlanId, workprocessId, taskNumber, itemCode, itemNumber, itemName } = this.curItem;
      this.assembleForm = { produceTaskPlanId, workprocessId, taskNumber, itemCode, itemNumber, itemName };
      if (index === 0) {
        this.assembleModal.assembleImportVol = false;
        this.upload.limit = 1;
        this.assembleModal.title = '测试信息单个录入';
        this.assembleModal.dialogVisibleAssemble = true;
      }
      if (index === 1) {
        this.assembleModal.assembleImportVol = true;
        this.upload.limit = 20;
        this.assembleModal.title = '测试信息批量录入';
        this.assembleModal.dialogVisibleAssemble = true;
      }
    },
    assembleImport() {
      if (this.assembleModal.assembleImportVol === false) {
        if (this.assembleForm.partCode && this.assembleForm.partCode !== '') {
          const { produceTaskPlanId, workprocessId, itemCode, partCode, testbillUrl, testbillName } = this.assembleForm;
          const obj = { produceTaskPlanId, workprocessId, itemCode, partCode, testbillUrl, testbillName, type: 1 };
          postGuide(obj).then(res => {
            if (res.code === '0') {
              this.$message.success(res.msg);
              this.beforeclose5();
            }
          });
        } else {
          this.$message.warning('请填写泵体编码');
        }
      } else {
        //批量
        const { produceTaskPlanId, workprocessId } = this.assembleForm;
        const itemList = this.itemList;
        const obj = { produceTaskPlanId, workprocessId, itemList, type: 1 };
        postGuideList(obj).then(res => {
          if (res.code === '0') {
            this.$message.success(res.msg);
            this.beforeclose5();
          }
        });
      }
    },
    beforeclose5() {
      this.assembleForm = {};
      this.itemList = [];
      this.upload.limit = 1;
      this.upload.fileList = [];
      this.assembleModal.dialogVisibleAssemble = false;
      this.getAssembleData();
    },
    // 装配测试文件上传
    handleSuccess(res, file, fileList) {
      console.log(file, fileList);
      if (this.assembleModal.assembleImportVol === false) {
        const a = this.upload.host + '/' + this.upload.ossParams.key;
        this.assembleForm.testbillName = file.name;
        this.assembleForm.testbillUrl = a;
      } else {
        const a = this.upload.host + '/' + this.upload.ossParams.key;
        let obj = {};
        obj.testbillName = file.name;
        obj.testbillUrl = a;
        this.itemList.push(obj);
        console.log(this.itemList);
      }
    },
    // 上传之前的回调
    beforeUpload: async function(file) {
      await this.backOssInfo(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      if (this.assembleModal.assembleImportVol === false) {
        this.upload.fileList = [];
        this.assembleForm.testbillName = '';
        this.assembleForm.testbillUrl = '';
        this.$message.success('删除成功');
      } else {
        const nameList = [];
        for (let i of fileList) {
          nameList.push(i.name);
        }
        this.itemList.map((item, index) => {
          if (!nameList.includes(item.testbillName)) {
            this.itemList.splice(index, 1);
          }
        });
        console.log(fileList, this.itemList);
        this.$message.success('删除成功');
      }
    },
    exceed(files, fileList) {
      console.log(files, fileList);
      this.$message.error('文件个数超过限制！');
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

    // 全屏事件
    handleFullScreen() {
      const element = document.getElementById('elFullScreen');
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    },
    // 查看pdf
    // viewPdf(url) {
    //   window.open(url);
    //   // let pdfWindow = window.open();
    //   // pdfWindow.opener = null;
    //   // pdfWindow.location = url;
    //   // pdfWindow.target = '_blank';
    // },
    viewFile(url, name) {
      // 实际会下载
      getBlob(url).then(blob => {
        saveAs(blob, name);
      });
    },
    uniqueArr(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    }
  }
};
</script>

<style lang="less">
.headman {
  width: 100%;
  height: 100%;
  background: #e9e9e9;
  display: flex;
  flex-direction: column;
  .headman-top {
    background-color: #409baf;
    .header {
      color: #fff;
    }
  }
  .headman-content {
    flex: 1;
    overflow: auto;
    .content-head {
      position: relative;
      left: calc(100% - 130px);
      width: 130px;
      top: 10px;
    }
    .content-container {
      display: flex;
      flex-flow: row wrap;
    }
    .content-item {
      flex-basis: 23%;
      margin: 1%;
      padding: 5px 0;
      background-color: #fff;
      position: relative;
      border-radius: 5px;

      .p0 {
        display: flex;
        padding: 2px 4%;
        p {
          height: 22px;
          line-height: 22px;
          font-size: 15px;
        }
        .btn {
          padding: 0 8px;
          height: 22px;
          border-radius: 11px;
          border: 1px solid #bdbdbd;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
        }
        .btn1 {
          border: 1px solid #02a202;
          color: #02a202;
        }
        .btn2 {
          border: 1px solid #ff9800;
          color: #ff9800;
        }
        p:nth-of-type(1) {
          margin-right: 5px;
        }
      }
      .p1 {
        font-size: 13px;
        p:nth-of-type(1) {
          flex: 1;
        }
      }
      .p2 {
        margin: 10px 0;

        span {
          font-size: 18px;
          font-weight: bold;
        }
      }
      .progre {
        position: absolute;
        right: 5%;
        bottom: 30%;
      }
      .subBtn {
        float: right;
        padding: 12px 5%;
        height: 28px;
      }
    }
  }
  // 领单表单
  .el-dialog__header {
    background-color: #409baf;

    .el-dialog__title {
      color: #fff;
      letter-spacing: 2px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
  .modal__tip {
    text-align: center;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 40px 0;
  }
  .modal__input {
    width: 45%;
    margin-left: 26%;
    padding-bottom: 70px;
    /deep/ .el-input__inner:focus {
      border-color: #409baf;
      outline: 0;
    }
  }
  .modal__label {
    display: inline-block;
    width: 10%;
    margin-left: 40px;
    min-width: 60px;
  }
  .modal__input2 {
    width: calc(45% - 66px);
    padding-bottom: 50px;
    margin-right: 10px;
    /deep/ .el-input__inner:focus {
      border-color: #409baf;
      outline: 0;
    }
  }

  // 详情页：
  .detail {
    height: 100%;
  }
  // 报工详情
  .headman-detail {
    height: 96%;
    overflow-y: auto;

    .detail-head {
      position: relative;
      left: calc(100% - 110px);
      width: 110px;
      top: 0.5rem;
    }

    .detail-container {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-content: flex-start;
    }
    .detail__item {
      margin: 1rem 1% 2rem 2%;
      flex: 0 1 30%;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 3px;

      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;
      align-content: flex-start;

      .item__title {
        line-height: 1.5rem;
        padding: 1rem;
        color: #321970;
      }
      .item__text {
        color: #321970;
        .text__value {
          color: #333;
        }
      }
    }
    .detail__item1 {
      .item__container {
        margin: 0 1rem;
        display: flex;
        flex-flow: row wrap;
      }
      .item__left {
        flex-basis: 40%;
        margin-left: 2%;
        margin-right: 8%;
        align-self: center;
        // .item__left--avatar {
        //     margin-top: -10px;
        //   }
      }

      .item__right {
        flex-basis: 50%;
        display: inline-flex;
        flex-flow: row wrap;
        font-size: 0.875rem;

        // min-width: 200px;
        .item__text {
          margin: 0.5rem 0;
          flex-basis: 100%;
        }
        .item__text:nth-last-child(1) {
          margin-bottom: 1rem;
        }
      }
    }
    .detail__item2 {
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;
      align-content: flex-start;

      .item__container {
        margin: 0 1rem;
        display: inline-flex;
        flex-flow: row wrap;
        font-size: 0.875rem;
        .item__text {
          margin: 10px 1%;
          flex-basis: 48%;
          color: #321970;

          .text__value {
            color: #333;
          }
        }
      }
    }
    .detail__item3 {
      position: relative;
      .table-box {
        width: 100%;
      }
      .el-table {
        // margin-left: 8px;
        // max-width: calc(100% - 17px);
        width: calc(100% - 17px);
      }
      .el-table::before {
        height: 0px;
      }
      .btn--group {
        text-align: center;
      }
      .btn-large__single {
        width: 8rem;
        margin: 0.5rem 0 1rem 0;
      }
      .btn-large__two {
        margin: 0.5rem 0 1rem 1.5rem;
      }
    }
    .detail__item4 {
      display: block;
      .item__item {
        margin: 0.5rem 0 2rem 3rem;
        letter-spacing: 1px;
        font-size: 0.875rem;

        .text__title {
          color: #321970;
        }
        .text__label {
          line-height: 34px;
          color: #321970;
          margin-left: 2rem;
          margin-top: 0.5rem;
          .text__value {
            color: #333;
            margin-left: 0.5rem;
            margin-right: 2rem;
          }
        }
      }
    }
    .btn-fullscreen {
      transform: rotate(45deg);
      font-size: 1.5rem;
      display: block;
      cursor: pointer;
      position: absolute;
      right: 2rem;
      top: 1rem;
    }
  }
  // 报工详情页 - 导轨
  .headman-detail2 {
    // height: 100%;
    height: 96%;
    overflow-y: auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
    .detail2__left {
      flex-basis: 28%;
      height: 100%;
      .left__item {
        margin: 1rem;
        padding: 10px;
        background: #fff;
        border-radius: 3px;

        .item__title {
          line-height: 2rem;
          margin-bottom: 1rem;
          color: #321970;
        }
      }
      .left__item:nth-last-child(1) {
        margin-bottom: 0;
      }
      .detail2__item1 {
        padding-bottom: 10px;
        min-width: 420px;

        .item__container {
          margin: 0 1rem;
          display: flex;
          flex-flow: row wrap;
        }
        .item__left {
          flex-basis: 40%;
          margin-left: 2%;
          margin-right: 8%;
          align-self: center;
          // .item__left--avatar {
          //     margin-top: -10px;
          //   }
        }

        .item__right {
          flex-basis: 50%;
          display: inline-flex;
          flex-flow: row wrap;
          font-size: 0.875rem;

          .item__text {
            margin: 0.5rem 0;
            flex-basis: 100%;
          }
          .item__text:nth-last-child(1) {
            // margin-bottom: 1rem;
          }
        }
      }

      .detail2__item2 {
        .item__item {
          margin: 0.5rem 0 1.5rem 1rem;
        }
        .text__title {
          color: #321970;
        }
        .el-input {
          width: 50%;
          margin-left: 1.5rem;
        }
        .el-button {
          margin-left: 1.5rem;
        }
      }
      .detail2__item3 {
        display: block;
        .item__item {
          margin: 0.5rem 0 1rem 1rem;
          letter-spacing: 1px;

          .text__title {
            color: #321970;
          }
          .text__label {
            line-height: 34px;
            color: #321970;
            margin-left: 2rem;
            margin-top: 0.5rem;
            .text__value {
              color: #333;
              margin-left: 0.5rem;
              margin-right: 2rem;
            }
          }
        }
      }
    }
    .detail2__right {
      flex-basis: 70%;
      height: 100%;
      .right__top {
        background: #fff;
        margin: 1rem 0 2rem 0;
        line-height: 2rem;
        border: 1px solid #fff;
        border-radius: 3px;
        position: relative;
        .top__title {
          margin-left: 1rem;
          font-size: 20px;
        }
        .top__item {
          margin: 0 3rem;
          color: #321970;
          font-size: 18px;
        }
        .btn--ahead {
          line-height: 1.5;
          margin-left: 4rem;
        }
        .btn--right {
          line-height: 1.5;
          position: absolute;
          right: 0;
        }
      }
      .page {
        margin-top: 2rem;
        float: right;
      }
    }
    .el-dialog {
      .modalVol__tip {
        margin: 1rem 0;
        font-size: 18px;
      }
      .modalVol__input {
      }
    }
  }
  // 工资
  .headman-salary {
    position: relative;
    .el-button {
      position: absolute;
      right: 2%;
      top: 0.5rem;
    }
    .el-table {
      position: absolute;
      width: 96%;
      margin-left: 2%;
      top: 3rem;
    }
  }

  // 文件上传表单
  .modalcont {
    padding: 25px 0;
    border: 1px dashed #aaa;
    margin-bottom: 25px;
    height: 80px;
  }

  .uploadbox {
    margin: 15px 0;
    .el-upload {
      // width: 80px;
      // height: 32px;
      border: none;
    }
    // .el-upload-list {
    //   border: 1px solid #aaa;
    //   padding: 5px 5px 10px;
    //   margin-top: 5px;
    // }
  }
}
</style>
