import * as types from './types';

const appName = '/activiti';


export const getTask = (processDefinitionKey, search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
   
    const data = await api.post(`${appName}/task/getTaskWithVariables`, { ...pageInfo, page: page - 1, ...search, processDefinitionKey });
    dispatch({
      type: types.GET_TASK,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};
// 根据任务id，获取参数实例列表
export const getVariableInstances = data => ({ api }) => api.post(`${appName}/task/getVariableInstances`, data);
// 根据任务id,获取对应的参数信息
export const getVariables = data => ({ api }) => api.post(`${appName}/task/getVariables`, data);

export const completeTask = data => ({ api }) => api.put(`${appName}/task/completeTask`, data);

export const deleteTask = data => ({ api }) => api.delete(`${appName}/task/deleteTask`, data);

export const setAssignee = data => ({ api }) => api.put(`${appName}/task/setAssignee`, data);

export const startTask = data => ({ api }) => api.put(`${appName}/task/startTask`, data);

// 开始流程
export const startProcessInstance = data => ({ api }) => api.post(`/${appName}/runtime/startProcessInstance`, data);

export const getTaskCount = (userId = 0) => async ({ api, dispatch }) => {
  let data = {};
  if (userId === 0) {
    data = await api.get(`${appName}/task/getTaskCount`);
  } else {
    data = await api.get(`${appName}/task/getTaskCount?userId=${userId}`);
  }
  dispatch({
    type: types.GET_TASKCOUNT,
    data
  });
};

export const getPriorityName = () => async ({ api, dispatch }) => { 
  const data = await api.get(`${appName}/task/getPriorityName`);
  dispatch({
    type: types.GET_PRIORITYNAME,
    data
  });
};

// 设置参数信息
export const setVariables = data => ({ api }) => api.put(`/${appName}/task/setVariables`, data);

export const getTaskByTaskId = taskId => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/task/getTaskByTaskId/${taskId}`);
    dispatch({
      type: types.GET_TASKBYTASKID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getTaskByTaskId1 = taskId => async ({ api }) => {
  try {
    return await api.get(`${appName}/task/getTaskByTaskId/${taskId}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const getSpareByProcessInstanceId = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size
    };
   
    const data = await api.post('/spare-part/UseListingController/getSpareByProcessInstanceId', { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_SPAREBYPROCESSINSTANCEID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getLubByProcessInstanceId = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size
    };
   
    const data = await api.post('/spare-part/UseListingController/getLubByProcessInstanceId', { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_LUBBYPROCESSINSTANCEID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getLubApply = businessKey => async ({ api, dispatch }) => {
  const data = await api.get(`/spare-part/ActualUseController/getLubApply/${businessKey}`);
  dispatch({
    type: types.GET_LUBAPPLY,
    data
  });
};

export const getSpareApply = businessKey => async ({ api, dispatch }) => {
  const data = await api.get(`/spare-part/ActualUseController/getSpareApply/${businessKey}`);
  dispatch({
    type: types.GET_SPAREAPPLY,
    data
  });
};

export const getSpareApplyThrough = info => async ({ api, dispatch }) => {
  const data = await api.post('/spare-part/ActualUseController/getSpareApplyThrough', info);
  dispatch({
    type: types.GETSPAREAPPLYTHROUGH,
    data
  });
};

export const getLubApplyThrough = info => async ({ api, dispatch }) => {
  const data = await api.post('/spare-part/ActualUseController/getLubApplyThrough', info);
  dispatch({
    type: types.GETLUBAPPLYTHROUGH,
    data
  });
};

export const getSpareApplyList = businessKey => async ({ api, dispatch }) => {
  const data = await api.get(`/spare-part/ActualUseController/getSpareApplyList/${businessKey}`);
  dispatch({
    type: types.GETSPAREAPPLYLIST,
    data
  });
};

export const getLubApplyList = businessKey => async ({ api, dispatch }) => {
  const data = await api.get(`/spare-part/ActualUseController//getLubApplyList/${businessKey}`);
  dispatch({
    type: types.GETLUBAPPLYLIST,
    data
  });
};


export const createActualUseList = data => ({ api }) => api.post('/spare-part/ActualUseController/createActualUseList', data);

export const getHistoric = (processDefinitionKey, search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
   
    const data = await api.post(`${appName}/history/getHistoricTaskInstance`, { ...pageInfo, page: page - 1, ...search, processDefinitionKey });
    dispatch({
      type: types.GET_HISTORIC,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getHistoryProcessInstanceById = taskId => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/history/getHistoricTaskInstanceById/${taskId}`);
    dispatch({
      type: types.GET_THISTORYPROCESSINSTANCEBYID,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const returnGetHistoryProcessInstanceById = taskId => async ({ api }) => {
  try {
    return await api.get(`${appName}/history/getHistoricTaskInstanceById/${taskId}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const returnGetTaskByTaskId = taskId => async ({ api }) => {
  try {
    return await api.get(`${appName}/task/getTaskByTaskId/${taskId}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const getHistoryProcessInstance = (processDefinitionKey, search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
   
    const data = await api.post(`${appName}/history/getHistoryProcessInstance`, { ...pageInfo, page: page - 1, ...search, processDefinitionKey });
    dispatch({
      type: types.GET_HISTORICPROCESSINSTANCE,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};