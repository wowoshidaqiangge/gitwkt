import request from '@/utils/request';

/* 大屏一 */
// 左1：工单状态统计
export const orderState = () => {
  return request({
    url: `/api/producetask/dataScreen/selectProduceTaskPlanState`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 左2：成品生产情况
export const produceComplete = () => {
  return request({
    url: `/api/producetask/dataScreen/selectProduceTask`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 左3：零件生产情况
export const producePart = () => {
  return request({
    url: `/api/producetask/dataScreen/selectPartProduce`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 产量及合格率(右1)
export const produceYield = () => {
  return request({
    url: `/api/producetask/dataScreen/selectProduceYield`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 一周产量趋势（右2）
export const weekYield = () => {
  return request({
    url: `/api/producetask/dataScreen/selectProductWeekYield`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 产品Pareto图（右3,返回结果没有排序）
export const producePareto = query => {
  return request({
    url: `/api/producetask/dataScreen/selectProductPareto`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 成品分类统计（中下）
export const produceClass = () => {
  return request({
    url: `/api/producetask/dataScreen/selectProductType`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 基本信息（标题和banner）
export const baseInfoGet = () => {
  return request({
    url: `/api/producetask/dataScreen/selectBannerList`,
    method: 'get',
    headers: {},
    params: {}
  });
};
// 修改基本信息（标题和banner）
export const baseInfoPut = query => {
  return request({
    url: `/api/producetask/dataScreen/updateBanner`,
    method: 'put',
    headers: {},
    data: query
  });
};

/* 大屏二 */
// 左1：工单状态统计(线轨)
export const orderState2 = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideTaskPlanState`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 左2：年工序合格率
export const workprocessQuality = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideWorkprocessQualified`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 左3：产品录入质检情况
export const produceAddQuality = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideQuality`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 产品综合检验情况（中上）
export const produceStateQuality = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideSynthesizeQuality`,
    method: 'get',
    headers: {},
    params: {}
  });
};
// 不合格分类统计（中下）
export const unqualifiedClass = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideUnqualifiedType`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 计划达成率 (右1)
export const planFinish = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuidePlanFinish`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 一周产量趋势（右2）
export const weekYield2 = () => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideWeekYield`,
    method: 'get',
    headers: {},
    params: {}
  });
};

// 员工产量
export const staffYield = query => {
  return request({
    url: `/api/producetask/dataScreen/selectGuideUserProduct`,
    method: 'get',
    headers: {},
    params: {}
  });
};
