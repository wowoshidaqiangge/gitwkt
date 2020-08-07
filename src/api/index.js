import request from '../utils/request';



//关于权限

//登录
export const login = query => {

    return request({
      url: '/api/auth/user/login',
      data:query,
      method: 'post'
    })
}

// 左侧菜单栏

export const userListMenu = query => {
  return request({
      url: `/api/auth/user/listMenu`,
      method: 'get',
      params:query
  });
}

//  人员管理

// 权限列表

export const roleList = query => {
  return request({
      url: `/api/auth/role/list`,
      method: 'get',
      params:query
  });
}

// 员工管理中树状图
export const deptList = query => {
  return request({
      url: `/api/auth/dept/treeList`,
      method: 'get',
      params:query
  });
}

// 员工列表

export const userPage = query => {
  return request({
      url: `/api/auth/user/page`,
      method: 'get',
      params:query,
     
  });
}

// 员工禁用和启用

export const updateValid = query => {
  return request({
    url: '/api/auth/user/updateValid',
    data:query,
    method: 'put',
    
  })
}


// 角色列表

export const rolePage = query => {
  return request({
      url: `/api/auth/role/page`,
      method: 'get',
      params:query
  });
}

// 部门列表
export const dept = query => {
  return request({
      url: `/api/auth/dept/list`,
      method: 'get',
      params:query,
     
  });
}

//新增用户

export const authUser = query => {
      return request({
        url: '/api/auth/user',
        data:query,
        method: 'post',
        headers: {'userId': sessionStorage.getItem('userId')}
      })
  }

//查看用户详情

export const authputUserid = query => {
  return request({
      url: `/api/auth/user/${query.id}`,
      method: 'get',
  });
}


//编辑用户

export const authputUser = query => {
       return request({
         url: '/api/auth/user',
         data:query,
         method: 'put',
       })
   }

// 删除用户
export const userDelete = query => {
  return request({
      url: `/api/auth/user/${query.id}`,
      method: 'delete',
  });
}


// 新增角色
export const authrole = query => {
  return request({
    url: '/api/auth/role',
    data:query,
    method: 'post',
    headers: {'userId': sessionStorage.getItem('userId')}
  })
}

// 查看角色详情
export const authroleid = query => {
  return request({
      url: `/api/auth/role/${query.id}`,
      method: 'get',
  });
}

// 修改角色

export const authputrole = query => {
  return request({
    url: '/api/auth/role',
    data:query,
    method: 'put',
  })
}

// 删除角色
export const roleDelete = query => {
  return request({
      url: `/api/auth/role/${query.id}`,
      method: 'delete',
  });
}


// 设备管理

//设备维保列表
export const planPage = query => {
  return request({
      url: `/api/maintain/plan/page`,
      method: 'get',
      params:query,
      // headers: {'userId': sessionStorage.getItem('userId')}
  });
}

// 设备维保数据新增

export const maintain = query => {
  return request({
      url: `/api/maintain/plan`,
      data:query,
      method: 'post',
  });
}
// 设备维保数据修改
export const maintainput = query => {
  return request({
    url: '/api/maintain/plan',
    data:query,
    method: 'put',
  })
}

// 设备维保数据删除
export const maintaindelete = query => {
  return request({
      url: `/api/maintain/plan/${query.id}`,
      method: 'delete',
  });
}

// 设备维保数据详情
export const maintainget = query => {
  return request({
      url: `/api/maintain/plan/${query.id}`,
      method: 'get',
  });
}


// 设备维保中维保设备列表
export const deviceList = query => {
  return request({
      url: `/api/device/list`,
      method: 'get',
      params:query,
  });
}



//设备维保中维保类型

export const maintainStateList = query => {
  return request({
      url: `/api/maintain/maintenance/maintainStateList`,
      method: 'get',
      params:query,
  });
}

// 设备统计列表
export const selectDeviceRunData = query => {
  return request({
      url: `/api/device/deviceWorkStatistics/selectDeviceRunData`,
      method: 'get',
      params:query,
     
  });
}

// 查询设备统计下设备
export const deviceListByType = query => {
  return request({
      url: `/api/device/deviceListByType`,
      method: 'get',
      params:query,
     
  });
}

// 设备统计中车间种类

export const deviceTypeList = query => {
  return request({
      url: `/api/device/deviceTypeList`,
      method: 'get',
      params:query,
     
  });
}


// 运行监控

export const selectDeviceRunList = query => {
  return request({
      url: `/api/device/deviceWorkStatistics/selectDeviceRunList`,
      method: 'get',
      params:query
  });
}




// 生产管理

// 生产服务
export const produceTaskpage = query => {
  return request({
      url: `/api/producetask/produceTask/page`,
      method: 'get',
      params:query
  });
}


// 新增生产
export const produceTask = query => {
  return request({
      url: `/api/producetask/produceTask`,
      method: 'post',
      data:query,
      headers: {'userId': sessionStorage.getItem('userId')}
  });
}

// 查看详情
export const produceTaskid = query => {
  return request({
      url: `/api/producetask/produceTask/${query.id}`,
      method: 'get',
  });
}

// 查看进度
export const getProduceProgress = query => {
  return request({
      url: `/api/producetask/produceTask/getProduceProgress/${query.id}`,
      method: 'get',
    
  });
}

// 生产任务修改
export const produceTaskput = query => {
  return request({
    url: '/api/producetask/produceTask',
    data:query,
    method: 'put',
  })
}
// 删除生产任务
export const produceTaskdelete = query => {
  return request({
      url: `/api/producetask/produceTask/${query.id}`,
      method: 'delete',
  });
}

// 锁定解锁任务
export const updateProduceTaskLockById = query => {
  return request({
    url: '/api/producetask/produceTask/updateProduceTaskLockById',
    data:query,
    method: 'put',
  })
}




// 生产任务工单
export const produceTaskPlanpage = query => {
  return request({
      url: `/api/producetask/produceTaskPlan/page`,
      method: 'get',
      params:query
  });
}

//  查看工单详情
export const produceTaskPlanid = query => {
  return request({
      url: `/api/producetask/produceTaskPlan/${query.id}`,
      method: 'get',
  });
}


//工单状态查询

export const produceTaskStateList = query => {
  return request({
      url: `/api/producetask/produceTask/produceTaskStateList`,
      method: 'get',
      params:query
  });
}

// 工单分解
export const saveProduceTaskPlan = query => {
  return request({
      url: `/api/producetask/produceTask/saveProduceTaskPlan`,
      method: 'post',
      data:query
  });
}
//  查询部门下用户

export const userListByDept = query => {
  return request({
      url: `/api/auth/user/userListByDept`,
      method: 'get',
  });
}
// 派单 修改  重新派单
export const produceTaskAssign = query => {
  return request({
      url: `/api/producetask/produceTaskAssign`,
      method: 'post',
      data:query
  });
}

// 报工记录

export const pageByProduceTaskPlanId = query => {
  return request({
      url: `/api/producetask/produceTaskReport/pageByProduceTaskPlanId`,
      method: 'get',
      params:query
  });
}



//数据统计


//设备绩效

export const selectDeviceWorkTimeList = query => {
  return request({
      url: `/api/device/deviceWorkStatistics/selectDeviceWorkTimeList`,
      method: 'get',
      params:query
  });
}




// 维保统计  设备保养
export const selectDeviceMaintainData = query => {
  return request({
      url: `/api/device/deviceMaintain/selectDeviceMaintainData`,
      method: 'get',
      params:query
  });
}


//设备保养表格
export const selectDeviceMaintainList = query => {
  return request({
      url: `/api/device/deviceMaintain/selectDeviceMaintainList`,
      method: 'get',
      params:query
  });
}


// 设备维修
export const selectDeviceRepairData = query => {
  return request({
      url: `/api/device/deviceMaintain/selectDeviceRepairData`,
      method: 'get',
      params:query
  });
}


// 设备维修列表
export const selectDeviceRepairList = query => {
  return request({
      url: `/api/device/deviceMaintain/selectDeviceRepairList`,
      method: 'get',
      params:query
  });
}



// 生产绩效

export const selectProduceWorkRate = query => {
  return request({
      url: `/api/producetask/produceStatistics/selectProduceWorkRate`,
      method: 'get',
      params:query
  });
}






// 班组长

//首页列表
export const listByUserId = query => {
  return request({
      url: `/api/producetask/produceTaskAssign/listByUserId`,
      method: 'get',
      params:query,
      headers: {'userId': sessionStorage.getItem('userId')}
  });
}


//领单
export const updateTaskPlanClaimById = query => {
  return request({
      url: `/api/producetask/produceTaskAssign/updateTaskPlanClaimById`,
      method: 'put',
      params:query,
  });
}

// 报工

export const produceTaskReport = query => {
  return request({
      url: `/api/producetask/produceTaskReport`,
      method: 'post',
      data:query,
      headers: {'userId': sessionStorage.getItem('userId')}
  });
}


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


