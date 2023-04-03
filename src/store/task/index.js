import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0,
  listHistory: [],
  totalHistory: 0,
  taskCount: {},
  PriorityObj: {},
  taskInfo: {},
  taskInfoHistory: {},
  sparePartList: [],
  lubList: [],
  sparePartTotal: 0,
  lubListTotal: 0,
  statusData: {},
  lubHistory: [],
  sparePartHistory: [],
  lubApplyThrough: [],
  spareApplyThrough: [],
  applySpare: [],
  applyLub: [],
  historyList: [],
  historyTotal: 0
};


const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_TASK:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    case types.GET_TASKCOUNT:
      return {
        ...state,
        taskCount: action.data || {}
      };
    case types.GET_PRIORITYNAME:
      return {
        ...state,
        PriorityObj: action.data || {}
      };
    case types.GET_TASKBYTASKID:
      return {
        ...state,
        taskInfo: action.data || {}
      };
    case types.GET_SPAREBYPROCESSINSTANCEID:
      return {
        ...state,
        sparePartList: _get(action.data, 'content'),
        sparePartTotal: _get(action.data, 'totalElements')
      };
    case types.GET_LUBBYPROCESSINSTANCEID:
      return {
        ...state,
        lubList: _get(action.data, 'content'),
        lubListTotal: _get(action.data, 'totalElements')
      };
    case types.GET_LUBAPPLY:
      return {
        ...state,
        lubHistory: action.data || []
      };
    case types.GET_SPAREAPPLY:
      return {
        ...state,
        sparePartHistory: action.data || []
      };
    case types.GETLUBAPPLYTHROUGH:
      return {
        ...state,
        lubApplyThrough: action.data || []
      };
    case types.GETSPAREAPPLYTHROUGH:
      return {
        ...state,
        spareApplyThrough: action.data || []
      };
    case types.GET_HISTORIC:
      return {
        ...state,
        listHistory: _get(action.data, 'content'),
        totalHistory: _get(action.data, 'totalElements')
      };
    case types.GET_THISTORYPROCESSINSTANCEBYID:
      return {
        ...state,
        taskInfoHistory: action.data || {}
      };
    case types.GETSPAREAPPLYLIST:
      return {
        ...state,
        applySpare: action.data || []
      };
    case types.GETLUBAPPLYLIST:
      return {
        ...state,
        applyLub: action.data || []
      };
    case types.GET_HISTORICPROCESSINSTANCE:
      return {
        ...state,
        historyList: _get(action.data, 'content'),
        historyTotal: _get(action.data, 'totalElements')
      };
    default:
      return state;
  }
};

export const key = 'task';

reducer.reducer = key;

export default reducer;
