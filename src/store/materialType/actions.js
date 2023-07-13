/*
 * @Author: Andy
 * @Date: 2019-07-08 09:12:21
 * @LastEditors: Andy
 * @LastEditTime: 2019-07-08 09:12:21
 */
import * as types from './types';

const appName = '/materials-master-data';

export const findMaterialTypeByCodeOrDesc = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    const data = await api.post(`${appName}/materialGroup/findMaterialGroupByCodeOrDesc`, { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_MATERIAL_TYPE_LIST,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createMaterialType = data => ({ api }) => api.post(`${appName}/materialGroup/createMaterialGroup`, data);

export const updateMaterialType = data => ({ api }) => api.put(`${appName}/materialGroup/updateMaterialGroup`, data);

export const deleteMaterialType = id => ({ api }) => api.delete(`${appName}/materialGroup/deleteMaterialGroupById/${id}`);
