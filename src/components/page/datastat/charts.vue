<template>
  <div class="charts">
      <v-chart ref='chart' :options="option" :auto-resize="true" class="chart"/>
      <div class="popno" v-if='isshow'>暂无数据</div>
  </div>
</template>

<script>
// import { selectDeviceMaintainList } from 'api/index'
export default {
    name: 'charts',
    props:{
        numlist:{
            type:Array
        },
        devicelist:{
            type:Array
        },
        unit:{
            type:String
        }
    },
    data() {
        return {
            option:{},
            isshow:false,
            series:[],
            xAxisarr:[]
        }
    },
    created(){

    },
    methods: {
         chartclear(){
             this.$refs.chart.clear()
             this.isshow = true
        },
        showLoading(){},
        hideLoading(){},
        getoption(){
            this.isshow = false
            this.option={
                    title: {
                        text: this.unit,
                        left:30,
                        top:0,
                        fontSize:12,
                        textStyle:{
                            color:'#000000'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '8%',
                        top: '7%',
                        containLabel:true

                    },
                    toolbox: {
                        show: true,
                        feature: {
                            // dataView: {
                            //     show: true,
                            //     title:'数据视图',
                            //     // readOnly: false,
                            // },
                            // magicType: {show: true, type: ['line', 'bar']},
                            // restore: {show: true},
                            // saveAsImage: {show: true}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap:true,
                        data: this.xAxisarr
                    },
                    yAxis: {
                        type: 'value',
                        x:'right',
                    },
                    series: this.series
               }
            },
            getseries(obj){
                var series=[];
                if(Array.isArray(obj)){
                     obj.forEach(item=>{
                     series.push({
                           name: item.name,
                           type: item.type,
                           data: item.data,
                            stack:'总量',
                            barMaxWidth: 30
                       });
                })

                 this.series = series

                }
            },
            getxAxis(arr){
                this.xAxisarr = arr
            }
    }
}
</script>

<style lang='less'>
    .charts{
        width: 100%;
        height: 100%;
        .chart{
            width: 100%;
            height: 100%;
        }
        .popno{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            line-height: 300px;
            text-align: center;
            color: #999;
        }
    }

</style>
