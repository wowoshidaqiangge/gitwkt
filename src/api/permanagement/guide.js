import request from '@/utils/request';

// 导轨
export const getGuidePage = query => {
  return request({
    url: `/api/item/product/page`,
    method: 'get',
    params: { ...query, type: 2 },
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const addGuide = query => {
  // if (
  //   query.rawmaterialCodes &&
  //   typeof query.rawmaterialCodes !== 'string'
  // ) {
  //   query.rawmaterialCodes = query.rawmaterialCodes.join(',');
  // }
  // if (
  //   query.workprocessCodes &&
  //   typeof query.workprocessCodes !== 'string'
  // ) {
  //   query.workprocessCodes = query.workprocessCodes.join(',');
  // }
  return request({
    url: `api/item/product`,
    method: 'post',
    data: { ...query, type: 2 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const addGuideList = query => {
  return request({
    url: `api/item/product/saveList`,
    method: 'post',
    data: { type: 2, productList: [...query] },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const putGuide = query => {
  // if (
  //   query.rawmaterialCodes &&
  //   typeof query.rawmaterialCodes !== 'string'
  // ) {
  //   query.rawmaterialCodes = query.rawmaterialCodes.join(',');
  // }
  // if (
  //   query.workprocessCodes &&
  //   typeof query.workprocessCodes !== 'string'
  // ) {
  //   query.workprocessCodes = query.workprocessCodes.join(',');
  // }
  return request({
    url: `api/item/product`,
    method: 'put',
    data: { ...query, type: 2 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const delGuide = id => {
  return request({
    url: `api/item/product`,
    method: 'delete',
    data: {
      id,
      type: 2
    }
  });
};
