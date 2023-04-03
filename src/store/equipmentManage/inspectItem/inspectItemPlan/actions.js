import * as types from './types';

const appName = '/equipment-inspect';
export const getAllByPlanNameAndEquipmentAndConditionId = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    const data = await api.post(`${appName}/inspectPlan/getAllByPlanNameAndConditionId`, { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_ALLBYPLANNAMEANDEQUIPMENTANDCONDITIONID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getPlanCondition = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/inspectPlan/getPlanCondition`);
    dispatch({
      type: types.GET_PLANCONDITION,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getEquipmentListByEquipmentTypeId = id => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`/equipment-master-data/equipment/getEquipmentListByEquipmentTypeId/${id}`);
    dispatch({
      type: types.GET_EQUIPMENTLISTBYEQUIPMENTTYPEID,
      data
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getLocationMsgDtoByEquipmentId = id => async ({ api, dispatch }) => {
  try {
    if (id === 0) {
      const data = {};
      dispatch({
        type: types.GET_LOCATIONMSGDTOBYEQUIPMENTID,
        data
      });
    } else {
      const data = await api.get(`/equipment-master-data/equipment/getLocationMsgDtoByEquipmentId/${id}`);
      dispatch({
        type: types.GET_LOCATIONMSGDTOBYEQUIPMENTID,
        data
      });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllEnums = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get('/timer/timerEnum/getAllEnums');
    dispatch({
      type: types.GET_ALLENUMS,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const createInspectPlan = data => ({ api }) => api.post(`/${appName}/inspectPlan/createInspectPlan`, data);

export const updateInspectPlan = data => ({ api }) => api.put(`/${appName}/inspectPlan/updateInspectPlan`, data);

export const deleteInspectPlanByIdList = data => ({ api }) => api.delete(`/${appName}/inspectPlan/deleteInspectPlanByIdList`, data);

export const refusePlan = data => ({ api }) => api.put(`/${appName}/inspectPlan/refusePlan`, data);

export const startPlan = data => ({ api }) => api.put(`/${appName}/inspectPlan/startPlan`, data);

export const completeTaskAndStatistical = taskId => ({ api }) => api.put(`/${appName}/inspectStatistical/completeTaskAndStatistical/${taskId}`);


export const getHistoryByEquipmentId = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    const data = await api.post(`${appName}/inspectStatistical/getHistoryByEquipmentId`, { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_HISTORYBYEQUIPMENTID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};
