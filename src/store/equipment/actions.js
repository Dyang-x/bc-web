import * as types from './types';

const appName = '/equipment-master-data';

export const getEquipmentList = (search = {}, page = 1, size = 100000) => async ({ api, dispatch }) => {
  const pageInfo = {
    pageSize: size,
    direction: false,
    sort: true,
    sortCol: 'id'
  };
  try {
    const data = await api.post(`${appName}/equipment/getEquipmentPageByNameOrCodeAndEquipmentTypeId`, { ...search, ...pageInfo, page: page - 1 });
    dispatch({
      type: types.GET_EQUIPMENT_LIST,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createEquipment = data => async ({ api, dispatch }) => {
  try {
    const res = await api.post(`${appName}/equipment/createEquipment`, data);
    dispatch({
      type: types.CREATE_EQUIPMENT,
      data: res
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const updateEquipment = data => async ({ api, dispatch }) => {
  try {
    const res = await api.put(`${appName}/equipment/updateEquipment`, data);
    dispatch({
      type: types.UPDATE_EQUIPMENT,
      data: res
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteEquipment = id => async ({ api, dispatch }) => {
  try {
    await api.delete(`${appName}/equipment/deleteEquipmentById/${id}`);
    dispatch({
      type: types.DELETE_EQUIPMENT,
      id
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getEquipmentById = id => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/equipment/getEquipmentById/${id}`);
    dispatch({
      type: types.GET_EQUIPMENTBYID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const renderGetEquipmentById = id => async ({ api }) => {
  try {
    return await api.get(`${appName}/equipment/getEquipmentById/${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const getFileIdsByEquipmentId = equipmentId => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/equipmentFile/getFileIdsByEquipmentId/${equipmentId}`);
    dispatch({
      type: types.GET_FILEIDSBYEQUIPMENTID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteEquipmentFileByEIdAndFileId = (equipmentId, fileId) => ({ api }) => api.delete(`${appName}/equipmentFile/deleteEquipmentFileByEIdAndFileId?equipmentId=${equipmentId}&fileId=${fileId}`);

export const exportEquipment = () => ({ api }) => api.get(`${appName}/equipment/exportEquipment`);

export const importEquipment = file => async ({ api }) => {
  try {
    const data = new window.FormData();
    data.append('file', file);
    const res = await api.post(
      `${appName}/equipment/importEquipment`,
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

export const getTreeEquipmentList = (id = 0) => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/equipment/getEquipmentListByParentId/${id}`);
    dispatch({
      type: types.GET_TREE_EQUIPMENT_LIST,
      id,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getTreeEquipmentTree = (id = 0) => async ({ api }) => {
  try {
    const data = await api.get(`${appName}/equipment/getEquipmentListByParentId/${id}`);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

// Extend Columns
export const getExtendColumns = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/equipment/getEquipmentExtendColumnInfo`);
    dispatch({
      type: types.GET_EXTEND_COLUMNS,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createEquipmentFile = data => ({ api }) => api.post(`${appName}/equipmentFile/createEquipmentFile`, data);

export const createExtendColumn = data => ({ api }) => api.post(`${appName}/equipment/createEquipmentColumn`, data);

export const deleteExtendColumn = name => ({ api }) => api.delete(`${appName}/equipment/deleteEquipmentColumnByColumnName/${name}`);

export const getAllEquipment = () => async ({ api, dispatch }) => {
  const data = await api.get(`${appName}/equipment/getAllEquipment`);
  dispatch({
    type: types.GET_ALLEQUIPMENT,
    data
  });
};

export const getEquipmentParamneterValue = equipmentCode => async ({ api, dispatch }) => {
  try {
    const data = await api.get(
      `/equipment-info-collection/equipmentParameterValue/getParameterValueByEquipment/${equipmentCode}`
    );
    dispatch({
      type: types.GET_EQUIPMENT_PARAMETER_VALUE,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getEquipmentEvent = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  const pageInfo = {
    pageSize: size,
    direction: false,
    sort: true,
    sortCol: 'id'
  };
  try {
    const data = await api.post('/equipment-info-collection/equipmentParameter/findEquipmentFunctionList', {
      ...search,
      ...pageInfo,
      page: page - 1
    });
    dispatch({
      type: types.GET_EQUIPMENT_EVENT,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};


export const getEquipmentTagValueList = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  const pageInfo = {
    pageSize: size,
    direction: false,
    sort: true,
    sortCol: 'id'
  };
  const data = await api.post('/equipment-info-collection/equipmentParameterValue/equipmentList', { ...search, ...pageInfo, page });
  dispatch({
    type: types.GET_EUQIPMENT_TAG_VALUE,
    data
  });
  return data;
};


export const getAllEquipmentTagValueList = (search = {}) => async ({ api, dispatch }) => {
  const data = await api.post('/equipment-info-collection/equipmentParameterValue/equipmentListNotPage', search);
  dispatch({
    type: types.GET_ALL_EQUIPMENT_TAG_VALUE,
    data
  });
  return data;
};

export const getEquipmentTypeList = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/equipmentType/getAllEquipmentTypeList`);
    dispatch({
      type: types.GET_EQUIPMENT_TYPE_LIST,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getEquipmentImportTemplate = () => ({ api }) => api.get(`${appName}/equipment/getEquipmentImportTemplate`);