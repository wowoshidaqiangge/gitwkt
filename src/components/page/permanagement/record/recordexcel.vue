<template>	
  <div class="metaexcel">	
   <el-dialog 	
   :title="tit" 	
   :destroy-on-close='isclose'	
   :visible.sync="dialogFormVisible1"	
   width='40%' 	
   :before-close='beforclose' 	
   center>	
   <el-row>	
          <excelupdate @childByValue ='childByValue'/>	
          <div>	
               <el-button size="small" type="primary" @click="UpData" style="margin:25px 0 15px 0">点击导入</el-button>    	
                <p class="login-tips">说明: 导入文件类型必须为excel格式，你可以先点击 <a href="https://thingcom-test.oss-cn-hangzhou.aliyuncs.com/%E8%87%BB%E8%88%AA-%E8%AE%BE%E5%A4%87%E6%A1%A3%E6%A1%88-%E6%A8%A1%E6%9D%BF.xlsx">下载模板</a>。</p>	
            </div>	
    </el-row>	
    </el-dialog>	
	
  </div>	
</template>	
	
<script>	
import excelupdate from './../../../common/excelupdate'	
import {devicesaveExcel} from 'api/main'	
export default {	
    name: 'metaexcel',	
    components:{	
       excelupdate	
    },	
    props:{	
        dialogFormVisible1:{	
            type:Boolean	
        },	
        tit:{	
            type:String	
        },	
       	
    },	
    data() {	
        return {	
            isclose:true,	
            sureload:false,	
            excelData: []	
           	
        }	
    },	
    created(){	
       	
    },	
    mounted(){	
        	
    },	
    watch:{	
     	
    },	
    methods: {	
       // 处理excel数据	
        childByValue(val){	
          let arr = []	
          val.map((item,index)=>{	
            let obj = {}	
            obj.number = JSON.parse(JSON.stringify(item))["编号"]	
            obj.toType = JSON.parse(JSON.stringify(item))["所属类型"]	
            obj.name = JSON.parse(JSON.stringify(item))["名称"]	
            obj.type = JSON.parse(JSON.stringify(item))["车间"]	
            obj.model = JSON.parse(JSON.stringify(item))["型号"]	
            obj.manufacturers = JSON.parse(JSON.stringify(item))["厂家"]	
            obj.suppliers = JSON.parse(JSON.stringify(item))["供应商"]	
            arr[index] = obj	
          })	
          this.excelData = arr	
          console.log(this.excelData)	
        },	
        UpData () {	
           devicesaveExcel(this.excelData).then(res=>{	
               if(res.code==='0'){	
                   this.close(0)	
                   this.$message({	
                        message: '上传成功',	
                        type: 'success'	
                    });	
               } else {	
                   this.$message.error('上传失败');	
               }	
           })	
        },	
       close(num){	
         	
           this.$emit('close',num)	
       },	
   	
    	
       beforclose(){	
        	
          this.$emit('close',false)	
       }	
    }	
}	
</script>	
	
	
<style lang='less'>	
    .metaexcel{	
        .el-dialog{	
            border-radius: 5px;	
        }	
        .el-dialog__header{	
            background-color: #409BAF;	
           border-top-left-radius: 5px;	
           border-top-right-radius: 5px;	
           .el-dialog__title{	
               color: #fff;	
                 letter-spacing: 2px;	
           }	
           .el-dialog__headerbtn .el-dialog__close{	
               color: #fff;	
             	
           }	
        }	
        .dialog-footer{	
            text-align: end;	
        }	
        .el-form{	
            display: flex;	
            flex-wrap: wrap;	
        }	
        .el-select {	
            width: 100%;	
        }	
        .el-col{	
            margin-bottom: 20px;	
        }	
        // .formitem{	
        //     width: 45%;	
         	
        //     margin-bottom: 40px;	
        // }	
        // .formitem1{	
        //     margin-right: 5%;	
        // }	
    }	
	
</style>