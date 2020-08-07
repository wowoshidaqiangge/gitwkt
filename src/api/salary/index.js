import request from '@/utils/request';

// 当前工资
export const getSalaryPage = query => {
  return request({
    url: `/api/producetask/salary/display`,
    method: 'get',
    params: query,
    headers: {
      userId: sessionStorage.getItem('userId'),
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};
export const getSalaryInfo = query => {
  return request({
    url: `/api/producetask/salary/info`,
    method: 'get',
    params: query
  });
};

export const calcSalary = query => {
  return request({
    url: `/api/producetask/salary/calculate`,
    method: 'post',
    data: query,
    headers: {
      userId: sessionStorage.getItem('userId')
      // roleId: sessionStorage.getItem('roleId'),
      // deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const updateSalary = query => {
  return request({
    url: `/api/producetask/salary/flush`,
    method: 'post',
    data: query,
    headers: {
      // userId: sessionStorage.getItem('userId'),
      // roleId: sessionStorage.getItem('roleId'),
      // deptId: sessionStorage.getItem('deptId')
    }
  });
};

// 历史工资
export const getHisSalaryPage = query => {
  return request({
    url: `/api/producetask/salary/history`,
    method: 'get',
    params: query
    // headers: {
    //   userId: sessionStorage.getItem('userId'),
    //   roleId: sessionStorage.getItem('roleId'),
    //   deptId: sessionStorage.getItem('deptId')
    // }
  });
};

export const getHisSalaryDetail = query => {
  return request({
    // baseURL: 'http://yapi.thingcom.com/mock/113',
    url: `/api/producetask/salary/history/process`,
    method: 'get',
    params: query
    // headers: {
    //   userId: sessionStorage.getItem('userId'),
    //   roleId: sessionStorage.getItem('roleId'),
    //   deptId: sessionStorage.getItem('deptId')
    // }
  });
};

export const getProcessListById = userId => {
  return request({
    url: `/api/producetask/produceTaskQuality/getWorkprocessByUserId`,
    method: 'get',
    params: { userId }
  });
};
