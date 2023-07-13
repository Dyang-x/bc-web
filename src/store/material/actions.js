/*
 * @Author: Andy
 * @Date: 2019-08-26 11:18:53
 * @LastEditors: Otway
 * @LastEditTime: 2019-09-12 16:59:45
 */
import * as types from './types';

const appName = '/materials-master-data';

export const getMaterial = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  const pageInfo = {
    pageSize: size,
    direction: false,
    sort: true,
    sortCol: 'id'
  };
  const data = await api.post(`${appName}/material/getMaterialByNameOrCode`, { ...pageInfo, page: page - 1, ...search });
  try {
    dispatch({
      type: types.GET_MATERIAL,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getMaterialByFeature = () => async ({ api, dispatch }) => {
  const data = await api.post(`${appName}/material/getAllProductAndByProductByQuery`, {pageSize: 10000000});
  try {
    dispatch({
      type: types.GET_MATERIAL,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createMaterial = data => ({ api }) => api.post(`${appName}/material/createMaterial`, data);

export const getAllUnit = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/unit/getAllUnit`);
    dispatch({
      type: types.GET_UNIT,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllType = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/materialType/getAllMaterialType`);
    dispatch({
      type: types.GET_TYPE,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllProductAndByProduct = (search = {}) => async ({ api, dispatch }) => {
  try {
    const data = await api.post(`${appName}/material/getAllProductAndByProductByQuery`, search);
    dispatch({
      type: types.GET_MATERIALBYPRODUCT,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getExtendColumns = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/material/getAllMaterialExtend`);
    dispatch({
      type: types.GET_EXTENDS_COLUMNS,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createExtendColumn = data => ({ api }) => api.post(`${appName}/material/createMaterialExtend`, data);

export const deleteBomMaterial = name => ({ api }) => api.delete(`${appName}/material/deleteBomMaterialByMaterialId/${name}`);

export const deleteExtendColumn = name => ({ api }) => api.delete(`${appName}/material/deleteMaterialExtend/${name}`);

export const deleteMaterial = id => ({ api }) => api.delete(`${appName}/material/deleteMaterial/${id}`);

export const updateMaterial = data => ({ api }) => api.put(`${appName}/material/updateMaterial/`, data);

export const exportMaterial = () => ({ api }) => api.get(`${appName}/material/exportMaterials`);

export const importMaterial = file => async ({ api }) => {
  try {
    const data = new window.FormData();
    data.append('file', file);
    const res = await api.post(
      `${appName}/material/importMaterial`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export const getBomCodeByVague = code => async ({ api, dispatch }) => {
  try {
    const data = await api.post(`${appName}/bom/findByBomCodeOrBomNameOrBomVersionsOrBomStatus`, { bomCode: code });
    dispatch({
      type: types.GET_BOMCODE,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getBomVersionByBomCode = code => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/bom/getBomVersionsByBomCode/${code}`);
    dispatch({
      type: types.GET_BOMVERSIONS,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const bindMaterialBom = data => async ({ api }) => {
  try {
    await api.post(`${appName}/material/createBomMaterial`, data);
  } catch (error) {
    throw new Error(error);
  }
};

export const regularBatchNum = code => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/material/regularBatchNum/${code}`);
    dispatch({
      type: types.GET_MATERIAL_BY_BARCH,
      data
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// 物料code和特征值查询物料
export const getMaterialByCodeOrValue = code => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/material/getMaterialByMaterialCodeAndEigenvalue/${code},1`);
    dispatch({
      type: types.GET_MATERIALBYCODEORVALUE,
      data
    });
  } catch (error) {
    throw new Error(error);
  }
};
export const getSetting = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/material/getSetting`);
    dispatch({
      type: types.GET_MATERIAL_SETTING,
      data
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getMaterialsImportTemplate = () => async ({ api }) => await api.get(`${appName}/material/getMaterialsImportTemplate`);

export const updateSetting = data => ({ api }) => api.post(`${appName}/material/updateSetting`, data);
