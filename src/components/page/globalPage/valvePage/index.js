import axios from 'axios';

//  方圆大屏
export const api = {
  //  巡检维修（左1）
  inspection() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/maintain/statistics/quantity`,
      method: 'get',
      headers: {
        // 'Content-Type': 'application/json',
        // 'api-key': param.apiKey
      },
      data: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  月巡检维修次数（左2）
  repair() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/maintain/statistics/month`,
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
  //  试压列表（左3）
  pressureList(param) {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpPressure/page`,
      method: 'get',
      headers: {},
      params: param
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  业务数量（中1-1）
  orderStatistics() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpOrder/statistics/year`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  各客户销售订单列表（中1-2）
  clientStatistics() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpOrder/statistics/client`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  设备信息（中2）
  deviceInfo() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/device/statistics/state`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  本月每日工单数（中3）
  monthOrder() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpProduce/statistics/month`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  考勤数据统计（右1）
  checkin() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/device/statistics/checkin`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  工单完成数统计（右2-1）
  orderComplete() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpProduce/statistics/complete`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  工单状态统计（右2-2）
  orderState() {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpProduce/statistics/state`,
      method: 'get',
      headers: {},
      params: {}
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  //  工单列表（右3）
  erpProduceList(param) {
    return axios({
      url: `http://yapi.thingcom.com/mock/137/api/erp/erpProduce/page`,
      method: 'get',
      headers: {},
      params: param
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
