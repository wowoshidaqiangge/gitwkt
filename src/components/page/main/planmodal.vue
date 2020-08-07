<template>
    <div class="planmodal">
        <el-dialog
            :title="tit"
            :destroy-on-close="isclose"
            :visible.sync="dialogFormVisible"
            width="50%"
            :before-close="beforclose"
            center
        >
            <el-row>
                <el-form :model="form" :rules="rules" ref="form">
                    <el-col :span="24">
                        <el-form-item
                            label="设备类型"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="toType"
                        >
                            <el-select
                                placeholder="请选择"
                                @change="changeselect"
                                v-model="form.toType"
                            >
                                <el-option
                                    v-for="item in deptlist"
                                    :key="item.enumKey"
                                    :label="item.enumValue"
                                    :value="item.enumKey"
                                >{{item.enumValue}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="设备编号"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="deviceId"
                        >
                            <el-select v-model="form.deviceId" placeholder="请选择">
                                <el-option
                                    v-for="item in devicelist"
                                    :key="item.deviceId"
                                    :label="item.deviceName"
                                    :value="item.deviceId"
                                >{{item.deviceName}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                            label="所属类别"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="category"
                        >
                            <el-radio-group v-model="form.category">
                                <el-radio label="A型"></el-radio>
                                <el-radio label="B型"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="保养周期"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="period"
                        >
                            <el-select v-model="form.period" @change="changesel" placeholder="请选择">
                                <el-option
                                    v-for="item in timelist"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="保养时间"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="dateTime1"
                        >
                            <el-date-picker
                                v-model="form.dateTime1"
                                @change="changetime"
                                :format="formatime"
                                type="datetime"
                                placeholder="选择日期"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                     <el-col :span="11">
                        <el-form-item
                            label="担当人"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="assumeUserId"
                        >
                            <el-cascader
                                v-model="form.assumeUserId"
                                :options="userlist"
                                :props="casprops"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            label="责任人"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="dutyUserId"
                        >
                            <el-cascader
                                v-model="form.dutyUserId"
                                :options="userlist"
                                :props="casprops"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item
                            label="备注"
                            :label-width="formLabelWidth"
                            class="formitem formitem1"
                            prop="remark"
                        >
                            <el-input v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="marksure('form')" :loading="sureload">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { deviceToTypeList, getListByToType, maintenanceadd, maintenanceid, maintenanceput } from 'api/main';
import { userListByDept, deviceTypeList } from 'api/index';
import moment from 'moment';
export default {
    name: 'planmodal',
    props: {
        dialogFormVisible: {
            type: Boolean
        },
        tit: {
            type: String
        }
    },
    data() {
        return {
            isclose: true,
            sureload: false,
            deptlist: [],
            rolelist: [],
            devicelist: [],
            form: {
                category: 'A型',
                deviceId: '',
                period: 'year',
                dateTime: '',
                assumeUserId: '',
                dutyUserId: '',
                remark: ''
            },
            formatime: 'MM-dd HH',
            formLabelWidth: '90px',
            rules: {
                toType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
                deviceId: [{ required: true, message: '请选择设备编号', trigger: 'blur' }],
                period: [{ required: true, message: '请选择保养周期', trigger: 'blur' }],
                dateTime1: [{ required: true, message: '请选择保养时间', trigger: 'blur' }],
                assumeUserId: [{ required: true, message: '请选择担当人', trigger: 'blur' }],
                dutyUserId: [{ required: true, message: '请选择责任人', trigger: 'blur' }]
            },
            timelist: [
                { value: 'year', label: '按年' },
                { value: 'month', label: '按月' }
            ],
            userlist: [],
            casprops: {
                label: 'title',
                value: 'id',
                children: 'userList'
            }
        };
    },
    created() {
        this.getdeviceToTypeList();
        this.getuserPage();
        console.log(this.getday(false));
    },
    mounted() {},
    watch: {},
    computed: {},
    methods: {
        //查看详情
        getmaintenanceid(id) {
            maintenanceid(id).then(res => {
                if (res.code === '0') {
                    if (res.data.period === 'year') {
                        this.formatime = 'MM-dd HH';
                        res.data.dateTime1 = this.getday(true) + res.data.dateTime + ':00:00';
                    } else {
                        this.formatime = 'dd HH';
                        res.data.dateTime1 = this.getday(false) + res.data.dateTime + ':00:00';
                    }
                    res.data.toType = res.data.toType.toString();
                    this.getListByToType({ toTypeId: res.data.toType });
                    console.log(res.data);
                    this.form = res.data;
                }
            });
        },
        getday(isyear) {
            let nowtime = new Date();
            let a;
            if (isyear) {
                a = moment(nowtime).format('YYYY-');
            } else {
                a = moment(nowtime).format('YYYY-MM-');
            }
            return a;
        },
        // 获取用户列表
        getuserPage() {
            userListByDept().then(res => {
                 if (res.code === '0') {
                    this.userlist = res.data;
                }
            });
        },
        // 设备类型
        getdeviceToTypeList() {
            deviceToTypeList().then(res => {
                if (res.code === '0') {
                    this.deptlist = res.data;
                }
            });
        },
        //选择年 月
        changesel(val) {
            if (val === 'month') {
                this.formatime = 'dd HH';
            } else {
                this.formatime = 'MM-dd HH';
            }
        },
        // 修改设备
        changeselect(val) {
            this.devicelist = [];
            this.form.deviceId = '';
            this.getListByToType({ toTypeId: val });
        },
        // 根据类型查设备编号
        getListByToType(id) {
            getListByToType(id).then(res => {
                if (res.code === '0') {
                    this.devicelist = res.data;
                }
            });
        },
        // 修改时间
        changetime(val) {
            if (this.form.period === 'year') {
                this.form.dateTime = moment(val).format('MM-DD HH');
            } else {
                this.form.dateTime = moment(val).format('DD HH');
            }
        },
        close(num) {
            this.init();
            this.$emit('close', num);
        },
        //初始化
        init() {
            this.form = {
                category: 'A型',
                deviceId: '',
                period: 'year',
                dateTime: '',
                assumeUserId: '',
                dutyUserId: '',
                remark: ''
            };
        },
        marksure(form) {
            this.$refs[form].validate(valid => {
                let formObj = this.form
                if (Array.isArray(this.form.assumeUserId)) {
                    formObj.assumeUserId = this.form.assumeUserId[1]
                } else {
                    formObj.assumeUserId = this.form.assumeUserId
                }
                if (Array.isArray(this.form.dutyUserId)) {
                    formObj.dutyUserId = this.form.dutyUserId[1]
                } else {
                    formObj.dutyUserId = this.form.dutyUserId
                }
                if (valid) {
                    if (this.tit === '新增') {
                        maintenanceadd(formObj).then(res => {
                            if (res.code === '0') {
                                this.$message.success(res.msg);
                                this.close('0');
                            }
                        });
                    } else {
                        maintenanceput(formObj).then(res => {
                            if (res.code === '0') {
                                this.$message.success(res.msg);
                                this.close('0');
                            }
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        beforclose() {
            this.init();
            this.$emit('close', false);
        }
    }
};
</script>


<style lang='less'>
.planmodal {
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
