import * as types from './types';

const appName = '/materials-master-data';

export const findUnitBySymbolOrDescription = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    const data = await api.post(`${appName}/unit/findUnitBySymbolOrDescription`, { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_UNIT_TYPE_LIST,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createUnit = data => ({ api }) => api.post(`${appName}/unit/createUnit`, data);

export const updateUnit = data => ({ api }) => api.put(`${appName}/unit/updateUnit`, data);

export const deleteUnit = id => ({ api }) => api.delete(`${appName}/unit/deleteUnit/${id}`);
