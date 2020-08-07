import request from '@/utils/request';

// 主页数据
export const taskPlanByUserId = query => {
  return request({
    url: `/api/producetask/produceTaskAssign/taskPlanByUserId`,
    method: 'get',
    params: query,
    headers: {
      userId: sessionStorage.getItem('userId'),
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

// 领单
export const updateTaskPlanClaimById = query => {
  return request({
    url: `/api/producetask/produceTaskAssign/updateTaskPlanClaimById`,
    method: 'put',
    data: query
  });
};

//详情页：
// 用户信息
export const userDataById = id => {
  return request({
    url: `/api/auth/user/${id}`,
    method: 'get'
  });
};

// 报工
export const produceTaskReport = query => {
  return request({
    url: `/api/producetask/produceTaskReport`,
    method: 'post',
    data: query,
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

// 报工记录
export const pageByProduceTaskPlanId = query => {
  return request({
    url: `/api/producetask/produceTaskReport/pageByProduceTaskPlanId`,
    method: 'get',
    params: query,
    headers: {
      userId: sessionStorage.getItem('userId'),
      roleId: sessionStorage.getItem('roleId')
    }
  });
};

// 质检记录
export const getQualityRecord = query => {
  return request({
    url: `/api/producetask/produceTaskQuality/getRecordByPlanId`,
    method: 'get',
    params: query
  });
};

// 质检确认
export const postQuality = query => {
  return request({
    url: `/api/producetask/produceTaskQuality`,
    method: 'post',
    data: query,
    headers: {
      // 这里会被请求拦截器覆盖，需要单独处理
      userId: sessionStorage.getItem('quality_userId'),
      userName: encodeURI(sessionStorage.getItem('quality_userName')),
      flagZ: 1
    }
  });
};

// 导轨信息分页
export const getGuidePage = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/page`,
    method: 'get',
    params: query
  });
};
// 导轨信息导入
export const postGuide = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality`,
    method: 'post',
    data: query,
    headers: {
      userId: sessionStorage.getItem('userId'),
      userName: encodeURI(sessionStorage.getItem('userName'))
    }
  });
};
//导轨信息导入批量
export const postGuideList = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/saveList`,
    method: 'post',
    data: query,
    headers: {
      userId: sessionStorage.getItem('userId'),
      userName: encodeURI(sessionStorage.getItem('userName'))
    }
  });
};

// 工资列表
export const getSalaryList = query => {
  return request({
    url: `/api/producetask/salary/listByUserId`,
    method: 'get',
    params: query,
    headers: {
      userId: sessionStorage.getItem('userId')
    }
  });
};
