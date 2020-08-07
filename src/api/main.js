import request from '../utils/request';

//设备档案列表
export const devicepage = query => {
    return request({
        url: `/api/device/page`,
        method: 'get',
        params: query
    });
};

// 设备所属类型
export const deviceToTypeList = query => {
    return request({
        url: `/api/device/deviceToTypeList`,
        method: 'get',
        params: query
    });
};

//新增设备
export const devicesave = query => {
    return request({
        url: `/api/device/save`,
        method: 'post',
        data: query
    });
};

// 修改
export const deviceupdate = query => {
    return request({
        url: `/api/device/update`,
        data: query,
        method: 'put'
    });
};
// 设备导入
export const devicesaveExcel = query => {
    return request({
        url: `/api/device/saveList`,
        data: query,
        method: 'post'
    });
};

//查看设备详情
export const deviceid = query => {
    return request({
        url: `/api/device/${query.id}`,
        method: 'get',
        params: query
    });
};

// 设备报废和启用
export const updateState = query => {
    return request({
        url: `/api/device/updateState`,
        data: query,
        method: 'put'
    });
};

// 删除设备
export const devicedelete = query => {
    return request({
        url: `/api/device/${query.id}`,
        method: 'delete',
        params: query
    });
};

// 根据设备类型查询设备编号
export const getListByToType = query => {
    return request({
        url: `/api/device/getListByToType`,
        method: 'get',
        params: query
    });
};

//保养计划
export const maintenancepage = query => {
    return request({
        url: `/api/maintain/maintenance/page`,
        method: 'get',
        params: query
    });
};

// 新增保养计划
export const maintenanceadd = query => {
    return request({
        url: `/api/maintain/maintenance`,
        method: 'post',
        data: query
    });
};

// 查看保养计划详情
export const maintenanceid = query => {
    return request({
        url: `/api/maintain/maintenance/${query.id}`,
        method: 'get',
        params: query
    });
};

//修改
export const maintenanceput = query => {
    return request({
        url: `/api/maintain/maintenance`,
        data: query,
        method: 'put'
    });
};
// 删除
export const maintenancedelete = query => {
    return request({
        url: `/api/maintain/maintenance/${query.id}`,
        data: query,
        method: 'delete'
    });
};

//保养记录分页查询
export const mainrecordpage = query => {
    return request({
        url: `/api/maintain/maintenance/pageRecord`,
        method: 'get',
        params: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};
// 查看保养计划详情
export const mainrecordid = query => {
    return request({
        url: `/api/maintain/maintenance/getRecord/${query.id}`,
        method: 'get',
        params: query
    });
};
//填报保养记录
export const mainrecordput = query => {
    return request({
        url: `/api/maintain/maintenance/updateContent`,
        data: query,
        method: 'put'
    });
};

//维修记录分页查询
export const repairrecordpage = query => {
    return request({
        url: `/api/maintain/repair/page`,
        method: 'get',
        params: query
    });
};
// 查看维修记录详情
export const mainrepairid = query => {
    return request({
        url: `/api/maintain/repair/${query.id}`,
        method: 'get'
    });
};

//修改维修记录
export const mainrepairput = query => {
    return request({
        url: `/api/maintain/repair`,
        data: query,
        method: 'put'
    });
};
//新增维修记录
export const mainrepairadd = query => {
    return request({
        url: `/api/maintain/repair`,
        data: query,
        method: 'post'
    });
};
//删除维修记录
export const mainrepairdel = query => {
    return request({
        url: `/api/maintain/repair/${query.id}`,
        data: query,
        method: 'delete'
    });
};
//查看设备详情
export const devInfo = query => {
    return request({
        url: `/api/device/${query.id}`,
        data: query,
        method: 'get'
    });
};

// 物料管理

// 获取列表
export const producetaskpage = query => {
    return request({
        url: `/api/producetask/item/page`,
        method: 'get',
        params: query
    });
};

// 新增
export const producetaskadd = query => {
    return request({
        url: `/api/producetask/item`,
        method: 'post',
        data: query
    });
};
// 物料导入
export const producetaskaddExcel = query => {
    return request({
        url: `/api/producetask/item/saveList`,
        data: query,
        method: 'post'
    });
};

// 详情
export const producetaskid = query => {
    return request({
        url: `/api/producetask/item/${query.id}`,
        data: query,
        method: 'get'
    });
};
// 修改
export const producetaskput = query => {
    return request({
        url: `/api/producetask/item`,
        method: 'put',
        data: query
    });
};

// 删除

export const producetaskdelete = query => {
    return request({
        url: `/api/producetask/item/${query.id}`,
        data: query,
        method: 'delete'
    });
};

// 禁用和启用
export const producetaskupdateState = query => {
    return request({
        url: `/api/producetask/item/updateState`,
        method: 'put',
        data: query
    });
};

// 产品管理
export const productpage = query => {
    return request({
        url: `/api/producetask/product/page`,
        method: 'get',
        params: query
    });
};
//产品中物料 列表

export const producetasklist = query => {
    return request({
        url: `/api/producetask/item/list`,
        method: 'get',
        params: query
    });
};

//产品导入
export const productaddExcel = query => {
    return request({
        url: `/api/producetask/product/saveList`,
        method: 'post',
        data: query
    });
};

// 根据物料列表查询
export const getListByIds = query => {
    return request({
        url: `/api/producetask/item/getListByIds`,
        method: 'get',
        params: query
    });
};

// 新增产品
export const productadd = query => {
    return request({
        url: `/api/producetask/product`,
        method: 'post',
        data: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};

// 获取产品详情
export const productid = query => {
    return request({
        url: `/api/producetask/product/${query.id}`,
        params: query,
        method: 'get'
    });
};
// x修改
export const productput = query => {
    return request({
        url: `/api/producetask/product`,
        method: 'put',
        data: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};

// 删除产品
export const productdelete = query => {
    return request({
        url: `/api/producetask/product/${query.id}`,
        data: query,
        method: 'delete'
    });
};

// 禁用和启用
export const productupdateState = query => {
    return request({
        url: `/api/producetask/product/updateState`,
        method: 'put',
        data: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};

// 订单管理
export const orderpage = query => {
    return request({
        url: `/api/producetask/order/page`,
        method: 'get',
        params: query
    });
};
// 新增订单
export const orderadd = query => {
    return request({
        url: `/api/producetask/order`,
        method: 'post',
        data: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};
// 订单锁定
export const orderupdateState = query => {
    return request({
        url: `/api/producetask/order/updateState`,
        method: 'put',
        data: query
    });
};

// 详情
export const orderid = query => {
    return request({
        url: `/api/producetask/order/${query.id}`,
        params: query,
        method: 'get'
    });
};

// 修改订单
export const orderput = query => {
    return request({
        url: `/api/producetask/order`,
        method: 'put',
        data: query,
        headers: { userId: sessionStorage.getItem('userId') }
    });
};

// 删除
export const orderdelete = query => {
    return request({
        url: `/api/producetask/order/${query.id}`,
        data: query,
        method: 'delete'
    });
};
// d订单编号列表
export const orderlist = query => {
    return request({
        url: `/api/producetask/order/list`,
        params: query,
        method: 'get'
    });
};

// 产品编码列表
export const productlist = query => {
    return request({
        url: `api/producetask/product/list`,
        params: query,
        method: 'get'
    });
};

// 根据产品编码 查询物料列表

export const getItemListByProductId = query => {
    return request({
        url: `/api/producetask/product/getItemListByProductId`,
        params: query,
        method: 'get'
    });
};

// 订单状态列表
export const orderTypeList = query => {
    return request({
        url: `/api/producetask/order/orderTypeList`,
        params: query,
        method: 'get'
    });
};

//采购信息页

export const taskitemBuypage = query => {
    return request({
        url: `/api/producetask/taskitemBuy/page`,
        params: query,
        method: 'get'
    });
};

// 生产部门、车间列表
export const getProduceDeptList = query => {
    return request({
        url: `/api/auth/dept/getProduceDeptList`,
        params: query,
        method: 'get'
    });
};
