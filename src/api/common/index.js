import request from '@/utils/request';

export const getProcessList = (deptId, itemType) => {
  return request({
    url: `/api/item/workprocess/list`,
    method: 'get',
    params: { deptId, itemType },
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const getRawList = (deptId, materialNameOrCode) => {
  return request({
    url: `/api/item/rawmaterial/list`,
    method: 'get',
    params: { deptId, materialNameOrCode },
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

//  查询部门下用户
export const userListByDept = query => {
  return request({
    url: `/api/auth/user/userListByDept`,
    method: 'get'
  });
};

// 查询设备统计下设备
export const deviceListByType = query => {
  return request({
    url: `/api/device/deviceListByType`,
    method: 'get',
    params: query
  });
};
