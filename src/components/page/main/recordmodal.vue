<template>
    <div class="recordmodal1">
        <el-dialog :title="tit" :destroy-on-close="isclose" :visible.sync="dialogFormVisible" width="50%" :before-close="beforclose" center>
            <el-row>
                <el-form :model="form" :rules="rules" ref="form">
                    <el-col :span="24" class="dialogTitle">保养设备信息</el-col>
                    <div style="border:1px dashed #ccc;padding:20px 0 5px 0;margin-bottom:20px">
                        <el-col :span="11">
                            <el-form-item label="设备名称" :label-width="formLabelWidth" class="formitem formitem1" prop="category">
                                <el-input placeholder="请输入内容" v-model="form.deviceName" :disabled="true"> </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="设备编号" :label-width="formLabelWidth" class="formitem formitem1" prop="id">
                                <el-input placeholder="请输入内容" v-model="form.deviceNumer" :disabled="true"> </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                                <el-input placeholder="请输入内容" v-model="form.deviceModel" :disabled="true"> </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item
                                label="设备类型"
                                v-if="ifEdt"
                                :label-width="formLabelWidth"
                                class="formitem formitem1"
                                prop="toTypeName"
                            >
                                <el-input placeholder="请输入内容" v-model="form.toTypeName" :disabled="true"> </el-input>
                            </el-form-item>
                            <el-form-item label="保养月份" v-else :label-width="formLabelWidth" class="formitem formitem1" prop="toType">
                                <el-input placeholder="请输入内容" v-model="form.monthTime" :disabled="true"> </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item
                                label="保养时间"
                                v-if="ifEdt"
                                :label-width="formLabelWidth"
                                class="formitem formitem1"
                                prop="dateTime"
                            >
                                <el-input placeholder="请输入内容" v-model="form.dateTime" :disabled="true"> </el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :span="24" class="dialogTitle">保养内容</el-col>
                    <el-col :span="24">
                        <el-form-item class="formitem formitem1" prop="content">
                            <el-input type="textarea" :rows="3" :disabled="!ifEdt" v-model="form.content"></el-input>
                        </el-form-item>
                    </el-col>
                     <!--<el-col :span="11">
                        <el-form-item label="设备编号" :label-width="formLabelWidth" class="formitem formitem1" prop="id">
                            <el-input
                                placeholder="请输入内容"
                                v-model="form.deviceId"
                                :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="规格型号" :label-width="formLabelWidth" class="formitem formitem1" prop="period">
                                <el-input
                                placeholder="请输入内容"
                                v-model="form.deviceNumer"
                                :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="设备类型" v-if="ifEdt" :label-width="formLabelWidth" class="formitem formitem1" prop="toType">
                            <el-input
                                placeholder="请输入内容"
                                v-model="form.toTypeName"
                                :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="保养月份" v-else :label-width="formLabelWidth" class="formitem formitem1" prop="toType">
                            <el-input
                                placeholder="请输入内容"
                                v-model="form.monthTime"
                                :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="保养时间" v-if="ifEdt" :label-width="formLabelWidth" class="formitem formitem1" prop="dateTime">
                            <el-input
                                placeholder="请输入内容"
                                v-model="form.dateTime"
                                :disabled="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
           
             <el-col :span="24" class="dialogTitle">保养内容</el-col>
             <el-col :span="24">
                 <el-form-item  class="formitem formitem1" prop="content">
                        <el-input type="textarea" :rows="3"  :disabled="!ifEdt" v-model="form.content" ></el-input>
                </el-form-item>
             </el-col> -->
           
        </el-form>
    </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" v-if="ifEdt" @click="marksure()" :loading="sureload">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { mainrecordid, mainrecordput } from 'api/main';
import moment from 'moment';
export default {
    name: 'recordmodal1',

    props: {
        dialogFormVisible: {
            type: Boolean
        },
        tit: {
            type: String
        },
        ifEdt: {
            type: Boolean
        }
    },
    data() {
        return {
            isclose: true,
            sureload: false,
            deptlist: [],
            rolelist: [],
            devicelist: [],
            input: '',
            param: {},
            form: {
              deviceName:'',
              id:'',
              deviceNumer:'',
              toType:'',
              dateTime:'',
              content:''
            },
            formLabelWidth: '90px',
            rules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }]
            },
            timelist: [
                { value: 'year', label: '按年' },
                { value: 'month', label: '按月' }
            ],
            userlist: []
        };
    },
    created() {
        //   this.getdeviceToTypeList()
        //   this.getuserPage()
    },
    mounted() {
    },
    watch: {},
    methods: {
        //查看详情
        getmainrecordid(id) {
            mainrecordid(id).then(res => {
                if (res.code === '0') {
                    this.form = res.data;
                    this.form.monthTime = res.data.dateTime.slice(0, 7);
                    console.log(this.form);
                }
            });
        },
        close(num) {
            this.init();
            this.$emit('close', num);
        },
       close(num){
           this.init()
           this.$emit('close',num)
       },
       //初始化
       init(){
           this.form= {
              deviceName:'',
              id:'',
              deviceNumer:'',
              toType:'',
              dateTime:'',
              content:''
            }
       },
       marksure(){
           this.param.id = this.form.id
           this.param.content = this.form.content
            mainrecordput(this.param).then(res=>{
                if(res.code==='0'){
                    this.$message.success(res.msg)
                    this.close('0')
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

<style lang="less">
.recordmodal1 {
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
    .dialogTitle {
        margin-left: 20px;
        font-size: 15px;
        font-weight: 600;
        // color: #409BAF
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
