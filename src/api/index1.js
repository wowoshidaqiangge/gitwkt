import axios from 'axios';
const url = 'http://124.70.220.117:7050';

export const api = {
    // 设备运行情况
    deviceOperation() {
        return axios({
                url: `${url}/api/device/deviceWorkStatistics/selectDeviceRunState`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 设备综合利用率
    devUseRate() {
        return axios({
                url: `${url}/api/device/deviceWorkStatistics/selectDeviceSynthesizeUseRate`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 一周产量趋势
    weekYield() {
        return axios({
                url: `${url}/api/producetask/produceStatistics/selectWeekYieldList`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 计划达成率
    planAchieveRate() {
        return axios({
                url: `${url}/api/producetask/produceStatistics/selectTaskPlanFinishRate`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 工单状态统计
    workStatus() {
        return axios({
                url: `${url}/api/producetask/produceStatistics/selectProduceTaskPlanState`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 设备工作效率排行
    deviceEfficiency() {
        return axios({
                url: `${url}/api/device/deviceWorkStatistics/selectDeviceWorkpieceRate`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 设备运行监控
    deviceMonitor() {
        return axios({
                url: `${url}/api/device/deviceWorkStatistics/selectDeviceRunList`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 顶部圈内数据
    getCircleDate() {
        return axios({
                url: `${url}/api/producetask/produceStatistics/selectMonthYield`,
                method: 'get',
                headers: {},
                data: {}
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
            });
    }
};