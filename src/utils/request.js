import axios from 'axios';
import { Message } from 'element-ui';
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境

  // baseURL: 'http://124.70.220.117:7050', //请求路径
  // baseURL: 'http://192.168.110.24:7054',
  // baseURL: 'http://zh.thingcom.com',
  baseURL:  'http://116.62.153.134:7050',
  // baseURL: 'http://112.16.67.72:8005', //请求路径
  timeout: 10000
});

service.interceptors.request.use(
  config => {
    // console.log(config);
    if (config.headers.flagZ) {
      // 质检确认比较特殊
      delete config.headers.flagz;
      const userId = sessionStorage.getItem('quality_userId');
      const userName = encodeURI(sessionStorage.getItem('quality_userName'));
      config.headers = {
        userId: userId,
        userName
      };
    } else {
      let userId = sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : '';
      let deptId = sessionStorage.getItem('deptId') ? sessionStorage.getItem('deptId') : '';
      let roleId = sessionStorage.getItem('roleId') ? sessionStorage.getItem('roleId') : '';
      let userName = sessionStorage.getItem('userName') ? encodeURI(sessionStorage.getItem('userName')) : '';
      config.headers = {
        userId: userId,
        deptId: deptId,
        roleId: roleId,
        userName: userName
      };
    }
    return config;
  },
  error => {
    return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code !== '0') {
        Message.error(response.data.msg);
      }
      return response.data;
    } else {
      Message.error(response.data.error);
      return Promise.reject();
    }
  },
  error => {
    return Promise.reject();
  }
);

export default service;
