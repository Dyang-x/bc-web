import * as types from './types';
import { downFile } from '~/util/download';
const appName = '/materials-master-data';
export const getBom = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  const pageInfo = {
    pageSize: size,
    direction: false,
    sort: true,
    sortCol: 'id'
  };
  const data = await api.post(`${appName}/bom/findByBomCodeOrBomNameOrBomVersionsOrBomStatus`, {
    ...pageInfo,
    page: page - 1,
    ...search
  });
  try {
    dispatch({
      type: types.GET_BOM,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllBomItem = id => async ({ api, dispatch }) => {
  try {
    const datas = await api.get(`${appName}/bomItem/getAllByBomId/${id}`);
    dispatch({
      type: types.GET_ALLBOMITEM,
      data: datas
    });
  } catch (err) {
    throw new Error(err);
  }
};
export const ExportBomAll = () => ({ api }) =>
  api.get(`${appName}/bom/exportBomAndBomItemAndSubstituteItem`);

export const importBom = file => async ({ api }) => {
  try {
    const data = new window.FormData();
    data.append('file', file);
    const res = await api.post(`${appName}/bom/importBom`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export const getMaterial = data => async ({ api, dispatch }) => {
  try {
    const datas = await api.get(`${appName}/material/getMaterialById/${data}`);
    dispatch({
      type: types.GET_MATERIAL,
      data: datas
    });
  } catch (err) {
    throw new Error(err);
  }
};
export const ExportBomSingle = arr => async ({ api }) =>
  downFile(await api.post(`${appName}/bom/exportBomAllByIdList`, arr));

export const exportBomTemplate = () => async ({ api }) =>
  await api.get(`${appName}/bom/getImportTemplate`);

export const createExtendColumn = data => ({ api }) =>
  api.post(`${appName}/bom/createBomColumn`, data);

export const createExtendBomItemColumn = data => ({ api }) =>
  api.post(`${appName}/bomItem/createBomItemColumn`, data);

export const createExtendBomSubItemColumn = data => ({ api }) =>
  api.post(`${appName}/SubstituteItem/createSubstituteItemColumn`, data);

export const deleteExtendColumn = name => ({ api }) =>
  api.delete(`${appName}/bom/deleteBomColumn/${name}`);

export const deleteExtendBomItemColumn = name => ({ api }) =>
  api.delete(`${appName}/bomItem/deleteBomItemColumn/${name}`);

export const deleteExtendBomSubItemColumn = name => ({ api }) =>
  api.delete(`${appName}/SubstituteItem/deleteSubstituteItemColumn/${name}`);

export const getExtendColumns = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/bom/getAllBomExtend`);
    dispatch({
      type: types.GET_EXTENDS_COLUMNS,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getExtendBomItem = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/bomItem/getAllBomItemExtend`);
    dispatch({
      type: types.GET_EXTENDS_COLUMNS_BOMITEM,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getExtendBomSubItem = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/SubstituteItem/getAllSubstituteItemColumnExtend`);
    dispatch({
      type: types.GET_EXTENDS_COLUMNS_BOMSUBITEM,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};
