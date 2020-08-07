import request from '@/utils/request';

// 原材料
export const getRawPage = query => {
  return request({
    url: `/api/item/rawmaterial/page`,
    method: 'get',
    params: query,
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const addRaw = query => {
  return request({
    url: `api/item/rawmaterial`,
    method: 'post',
    data: query,
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const addRawList = query => {
  return request({
    url: `api/item/rawmaterial/saveList`,
    method: 'post',
    data: query,
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const putRaw = query => {
  return request({
    url: `api/item/rawmaterial`,
    method: 'put',
    data: query,
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const delRaw = id => {
  return request({
    url: `api/item/rawmaterial/${id}`,
    method: 'delete'
  });
};

// 零件
export const getPartPage = query => {
  return request({
    url: `/api/item/part/page`,
    method: 'get',
    params: { ...query, type: 1 },
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const addPart = query => {
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
    url: `api/item/part`,
    method: 'post',
    data: { ...query, type: 1 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const addPartList = query => {
  return request({
    url: `api/item/part/saveList`,
    method: 'post',
    data: { type: 1, partList: [...query] },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const putPart = query => {
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
    url: `api/item/part`,
    method: 'put',
    data: { ...query, type: 1 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const delPart = id => {
  return request({
    url: `api/item/part`,
    method: 'delete',
    data: {
      type: 1,
      id
    }
  });
};

//标准件
export const getStandPage = query => {
  return request({
    url: `/api/item/part/page`,
    method: 'get',
    params: { ...query, type: 2 },
    headers: {
      roleId: sessionStorage.getItem('roleId'),
      deptId: sessionStorage.getItem('deptId')
    }
  });
};

export const addStand = query => {
  return request({
    url: `api/item/part`,
    method: 'post',
    data: { ...query, type: 2 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const addStandList = query => {
  return request({
    url: `api/item/part/saveList`,
    method: 'post',
    data: { partList: [...query], type: 2 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const putStand = query => {
  return request({
    url: `api/item/part`,
    method: 'put',
    data: { ...query, type: 2 },
    headers: { userId: sessionStorage.getItem('userId') }
  });
};

export const delStand = id => {
  return request({
    url: `api/item/part`,
    method: 'delete',
    data: {
      type: 2,
      id
    }
  });
};
