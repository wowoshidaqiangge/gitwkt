import request from '../utils/request';

// 配置管理

// 工序配置分页查询
export const workprocessPage = query => {
  return request({
    url: `/api/item/workprocess/page`,
    method: 'get',
    params: query
  });
};
// 工序列表
export const workprocessList = query => {
  return request({
    url: `/api/item/workprocess/list`,
    method: 'get',
    params: query
  });
};

// 新增工序
export const workprocess = query => {
  return request({
    url: `/api/item/workprocess`,
    method: 'post',
    data: query,
   
  });
};
// 工序详情
export const workprocessget = query => {
  return request({
    url: `/api/item/workprocess/${query.id}`,
    method: 'get'
  });
};
// 修改工序
export const workprocessput = query => {
  return request({
    url: `/api/item/workprocess`,
    method: 'put',
    data: query,
   
  });
};
// 工序删除
export const workprocessdelete = query => {
  return request({
    url: `/api/item/workprocess/${query.id}`,
    method: 'delete'
  });
};

// 工序导入
export const saveListpost = query => {
  return request({
    url: `/api/item/workprocess/saveList`,
    method: 'post',
    data: query,
   
  });
};



// 产品管理 导轨分页
export const productPage = query => {
  return request({
    url: `/api/item/product/page`,
    method: 'get',
    params: query,
  
  });
};
// 产品 新增
export const productPost = query => {
  return request({
    url: `/api/item/product`,
    method: 'post',
    data: query,
  
  });
};

//产品禁用
export const productupdateStateById = query => {
  return request({
    url: `/api/item/product/updateStateById`,
    method: 'put',
    data: query
  });
};


// 产品类别列表

export const productTypeList = query => {
  return request({
    url: `/api/item/productType/list`,
    method: 'get',
    params: query
  });
};

// 产品下零件列表
export const getListByIds = query => {
  return request({
    url: `/api/item/part/getListByIds`,
    method: 'get',
    params: query
   
  });
};
// 产品详情
export const productInfo = query => {
  return request({
    url: `/api/item/product/getById`,
    method: 'get',
    params: query
  });
};

// 产品修改
export const productPut = query => {
  return request({
    url: `/api/item/product`,
    method: 'put',
    data: query,
   
  });
};
// 产品删除
export const productDelete = query => {
  return request({
    url: `/api/item/product`,
    method: 'delete',
    data: query
  });
};

// 工价分页查询
export const workpricePage = query => {
  return request({
    url: `/api/item/workprice/page`,
    method: 'get',
    params: query,
  
  });
};

// 新增工价
export const workpricepost = query => {
  return request({
    url: `/api/item/workprice`,
    method: 'post',
    data: query,
   
  });
};

//修改工价
export const workpriceput = query => {
  return request({
    url: `/api/item/workprice`,
    method: 'put',
    data: query,
   
  });
};
//删除工价
export const workpricedelete = query => {
  return request({
    url: `/api/item/workprice/${query.id}`,
    method: 'delete',
    data: query
  });
};
//工价导入
export const workpricesaveList = query => {
  return request({
    url: `/api/item/workprice/saveList`,
    method: 'post',
    data: query,
   
  });
};



//物料列表查询
export const getItemList = query => {
  return request({
    url: `/api/item/item/getItemList`,
    method: 'get',
    params: query,
   
  });
};
// 根据物料查工序
export const getWorkprocessByItemCode = query => {
  return request({
    url: `/api/item/workprocess/getWorkprocessByItemCode`,
    method: 'get',
    params: query,
   
  });
};

// 部门列表
export const getProduceDeptList = query => {
  return request({
    url: `/api/auth/dept/getProduceDeptList`,
    method: 'get',
    params: query,
   
  });
};
// 零件 标准件列表
export const partList = query => {
  return request({
    url: `/api/item/part/list`,
    method: 'get',
    params: query,
   
  });
};

// g工具列表
export const toollist = query => {
  return request({
    url: `/api/item/tool/list`,
    method: 'get',
    params: query,
   
  });
};

// 生产管理

// 产品任务分页查询 导轨任务分页查询 （type区分1是产品  2是导轨）
export const produceTaskPage = query => {
  return request({
    url: `/api/producetask/produceTask/page`,
    method: 'get',
    params: query
  });
};

// 查询产品列表
export const productList = query => {
  return request({
    url: `/api/item/product/list`,
    method: 'get',
    params: query
  });
};
// 根据产品列表查询工单
export const getPlanListByProductCode = query => {
  return request({
    url: `/api/producetask/produceTask/getPlanListByProductCode`,
    method: 'get',
    params: query
   
  });
};

// 产品新增任务
export const produceTaskPost = query => {
  return request({
    url: `/api/producetask/produceTask`,
    method: 'post',
    data: query,
   
  });
};

//产品任务修改生产工单
export const produceTaskPlan = query => {
  return request({
    url: `/api/producetask/produceTaskPlan`,
    method: 'put',
    data: query,
   
  });
};


// 产品任务详情
export const produceTaskdetail = query => {
  return request({
    url: `/api/producetask/produceTask/detail`,
    method: 'get',
    params: query
   
  });
};

// 修改任务
export const produceTaskPut = query => {
  return request({
    url: `/api/producetask/produceTask`,
    method: 'put',
    data: query,
   
  });
};
//删除任务

export const produceTaskDelete = query => {
  return request({
    url: `/api/producetask/produceTask`,
    method: 'delete',
    data: query,
   
  });
};

// 产品任务锁定解锁
export const updateProduceTaskLockById = query => {
  return request({
    url: `/api/producetask/produceTask/updateProduceTaskLockById`,
    method: 'put',
    data: query,
   
  });
};

// 加工路线
export const getProcessListByPlanId = query => {
  return request({
    url: `/api/producetask/produceTaskPlan/getProcessListByPlanId`,
    method: 'get',
    params: query,
   
  });
};

// 零件任务分页查询
export const partTaskPage = query => {
  return request({
    url: `/api/producetask/partTask/page`,
    method: 'get',
    params: query,
    
  });
};

// 零件任物新增

export const partTaskPost = query => {
  return request({
    url: `/api/producetask/partTask`,
    method: 'post',
    data: query,
   
  });
};
/// 零件任务修改
export const partTaskPut = query => {
  return request({
    url: `/api/producetask/partTask`,
    method: 'put',
    data: query,
  
  });
};

// 零件解锁 锁定
export const updatePartTaskLockById = query => {
  return request({
    url: `/api/producetask/partTask/updatePartTaskLockById`,
    method: 'put',
    data: query,
    
  });
};

//零件加工路线
export const getProcessListByPartTaskId = query => {
  return request({
    url: `/api/producetask/partTask/getProcessListByPartTaskId`,
    method: 'get',
    params: query,
    
  });
};

// 零件删除
export const partTaskDelete = query => {
  return request({
    url: `/api/producetask/partTask/${query.id}`,
    method: 'delete'
  });
};

// 零件列表
export const partListGet = query => {
  return request({
    url: `/api/item/part/partList`,
    method: 'get',
    params: query,
    
  });
};

// 质检管理（type 1:产品 2 零件  3 导轨）
export const produceTaskQualityPage = query => {
  return request({
    url: `/api/producetask/produceTaskQuality/page`,
    method: 'get',
    params: query,
   
  });
};

//质检录入
export const produceTaskQuality = query => {
  return request({
    url: `/api/producetask/produceTaskQuality/`,
    method: 'post',
    data: query,
   
  });
};

// caikun:

// 生产工单分页查询（type 1 2 3：零件、导轨\装配）
export const produceTaskPlanpage = query => {
  return request({
    url: `/api/producetask/produceTaskPlan/page`,
    method: 'get',
    params: query,
   
  });
};

// 派单状态查询（type 1 2 3：零件、导轨、装配）
export const produceTaskPlanState = query => {
  return request({
    url: `/api/producetask/produceTaskPlan/getWorkprocessAssignListByPlanId`,
    method: 'get',
    params: query,
    
  });
};

// 工单分解（type 1 2 3：零件、导轨、装配）
export const saveProduceTaskPlan = query => {
  return request({
    url: `/api/producetask/produceTask/saveProduceTaskPlan`,
    method: 'post',
    data: query,
  
  });
};

// 派单 修改 重新派单
export const produceTaskAssign = query => {
  return request({
    url: `/api/producetask/produceTaskAssign`,
    method: 'post',
    data: query,
   
  });
};

// 工具信息公共查询
export const getTool = workprocessCode => {
  return request({
    url: `/api/item/tool/getListByWorkprocessCode`,
    method: 'get',
    params: { workprocessCode }
  });
};
// 报工记录
export const pageByProduceTaskPlanId = query => {
  return request({
    url: `/api/producetask/produceTaskReport/pageByProduceTaskPlanId`,
    method: 'get',
    params: query,
   
  });
};
// ---
// 零件&标准件清单
export const partBillPage = query => {
  return request({
    url: `/api/producetask/partBill/page`,
    method: 'get',
    params: query,
   
  });
};
export const setPartBillState = query => {
  return request({
    url: `/api/producetask/partBill/updateStateByPlanId`,
    method: 'put',
    data: query,
   
  });
};
// 零件&标准件详情
export const partBillDetail = query => {
  return request({
    url: `/api/producetask/partBill/detail`,
    method: 'get',
    params: query
    
  });
};
export const setPartState = query => {
  return request({
    url: `/api/producetask/partBill/updateStateById`,
    method: 'put',
    data: query,
   
  });
};
// 原材料清单
export const rawBillPage = query => {
  return request({
    url: `/api/producetask/rawmaterialBill/page`,
    method: 'get',
    params: query,
   
  });
};
export const setRawBillState = query => {
  return request({
    url: `/api/producetask/rawmaterialBill/updateStateById`,
    method: 'put',
    data: query
  });
};

// 质检测试单


//导轨质检  质检配置新增
export const qualityConfig = query => {
  return request({
    url: `/api/producetask/qualityConfig`,
    method: 'post',
    data: query
  });
};
//导轨质检  质检配置修改
export const qualityConfigput = query => {
  return request({
    url: `/api/producetask/qualityConfig`,
    method: 'put',
    data: query
  });
};
//导轨质检  质检配置列表

export const qualityConfigPage = query => {
  return request({
    url: `/api/producetask/qualityConfig/page`,
    method: 'get',
    params: query,
   
  });
};
//修改质检结果
export const produceWorkprocessQualityPut = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality`,
    method: 'put',
    data: query
  });
};



// 线轨 普通质检录入 质检结果列表      质检测试单
export const produceWorkprocessQualityPage = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/page`,
    method: 'get',
    params: query,
  });
};

//综合检验 产品编码列表
export const getSynthesizeQualityItemCode = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/getSynthesizeQualityItemCode`,
    method: 'get',
    params: query,
  });
};

// 综合检验录入
export const synthesizeQuality = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/synthesizeQuality`,
    method: 'post',
    data: query
  });
};

//综合录入等级列表
export const qualityConfigList = query => {
  return request({
    url: `/api/producetask/qualityConfig/list`,
    method: 'get',
    params: query,
  });
};
// 综合检验 行走精度批量导入
export const saveListTestbill = query => {
  return request({
    url: `/api/producetask/produceWorkprocessQuality/saveListTestbill`,
    method: 'post',
    data: query
  });
};


// 导轨 数据统计

// 获取型号列表
export const getGuideModelList = query => {
  return request({
    url: `/api/producetask/guideStatistics/getGuideModelList`,
    method: 'get',
    params: query,
  });
};



// 分类统计
export const getGuideQualityListByDay = query => {
  return request({
    url: `/api/producetask/guideStatistics/getGuideQualityListByDay`,
    method: 'get',
    params: query,
  });
};

// 分类统计某月
export const getGuideQualityListByMonth = query => {
  return request({
    url: `/api/producetask/guideStatistics/getGuideQualityListByMonth`,
    method: 'get',
    params: query,
  });
};


// 汇总分析
export const getGuideQualityListByModel = query => {
  return request({
    url: `/api/producetask/guideStatistics/getGuideQualityListByModel`,
    method: 'get',
    params: query,
  });
};

// 合格率汇总

export const getGuideQualityListByYear = query => {
  return request({
    url: `/api/producetask/guideStatistics/getGuideQualityListByYear`,
    method: 'get',
    params: query,
  });
};
