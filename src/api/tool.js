import request from '../utils/request';

// 工具管理分页查询
export const toolpage = query => {
    return request({
        url: `/api/item/tool/page`,
        method: 'get',
        headers: {},
        params: query
    });
};

// 工具管理新增
export const tooladd = query => {
    return request({
        url: `/api/item/tool`,
        method: 'post',
        headers: {},
        data: query
    });
};

// 工具管理修改
export const toolupdate = query => {
    return request({
        url: `/api/item/tool`,
        method: 'put',
        headers: {},
        data: query
    });
};

// 工具管理删除
export const tooldelete = query => {
    return request({
        url: `/api/item/tool/${query.id}`,
        method: 'delete',
        headers: {}
    });
};

// 工具导入
export const toolsaveExcel = query => {
    return request({
        url: `/api/item/tool/saveList`,
        data: query,
        method: 'post'
    });
};

//工单状态查询
export const produceTaskStateList = query => {
    return request({
        url: `/api/producetask/produceTask/produceTaskStateList`,
        method: 'get',
        params: query
    });
};

// 获取生产追溯
export const getProduceRetrospect = query => {
    return request({
        url: `/api/producetask/data/track`,
        method: 'get',
        params: query
    });
};

//产品、零件装配工单分页查询
export const ProduceAssemblePage = query => {
    return request({
        url: `/api/producetask/produceTaskPlan/page`,
        method: 'get',
        params: query,
        headers: {}
    });
};

//产品、零件装配工单派单状态
export const assignList = query => {
    return request({
        url: `/api/producetask/produceTaskPlan/getWorkprocessAssignListByPlanId`,
        method: 'get',
        params: query,
        headers: {}
    });
};

//产品、零件装配工单 派单、修改、重新派单
export const produceTaskAssign = query => {
    return request({
        url: `/api/producetask/produceTaskAssign`,
        method: 'post',
        data: query
    });
};

//产品、零件装配工单 派单 查询工具信息
export const getToolInfo = query => {
    return request({
        url: `/api/item/tool/getListByWorkprocessCode`,
        method: 'get',
        params: query
    });
};

//  查询部门下用户
export const userListByDept = query => {
    return request({
        url: `/api/auth/user/userListByDept`,
        method: 'get'
    });
};

// 查询设备统计下设备
export const deviceListByType = query => {
    return request({
        url: `/api/device/deviceListByType`,
        method: 'get',
        params: query
    });
};

// 产品、零件工单 查看报工记录
export const pageByProduceTaskPlanId = query => {
    return request({
        url: `/api/producetask/produceTaskReport/pageByProduceTaskPlanId`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 产品、零件工单 工单分解
export const saveProduceTaskPlan = query => {
    return request({
        url: `/api/producetask/produceTask/saveProduceTaskPlan`,
        method: 'post',
        data: query,
        headers: {}
    });
};

// 数据统计 产品统计 同比分析
export const analysis = query => {
    return request({
        url: `/api/producetask/data/analysis`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 数据统计 产品统计 分类统计
export const classify = query => {
    return request({
        url: `/api/producetask/data/class`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 数据统计 产品统计 产品排序
export const yieldRank = query => {
    return request({
        url: `/api/producetask/data/sort`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 数据统计 零件统计 零件生产
export const partProduct = query => {
    return request({
        url: `/api/producetask/data/produce`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 数据统计 零件统计 工序统计
export const processCount = query => {
    return request({
        url: `/api/producetask/data/assign`,
        method: 'get',
        params: query,
        headers: {}
    });
};
// 数据统计 零件统计 员工CPK
export const staffCPK = query => {
    return request({
        url: `/api/producetask/data/cpk`,
        method: 'get',
        params: query,
        headers: {}
    });
};

// 数据统计 零件统计 员工CPK
export const workprocessCost = query => {
    return request({
        url: `/api/producetask/data/time`,
        method: 'get',
        params: query,
        headers: {}
    });
};