import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0,
  conditionList: {},
  equipmentList: [],
  equipmentLocation: {},
  allEnums: {},
  historyList: [],
  historyTotal: 0
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_ALLBYPLANNAMEANDEQUIPMENTANDCONDITIONID:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    case types.GET_PLANCONDITION:
      return {
        ...state,                                                                                                                                                                                                                     
        conditionList: action.data || {}
      };
    case types.GET_EQUIPMENTLISTBYEQUIPMENTTYPEID:
      return {
        ...state,                                                                                                                                                                                                                     
        equipmentList: action.data || {}
      };
    case types.GET_LOCATIONMSGDTOBYEQUIPMENTID:
      return {
        ...state,
        equipmentLocation: action.data || {}
      };
    case types.GET_ALLENUMS:
      return {
        ...state,
        allEnums: action.data || {}
      };
    case types.GET_HISTORYBYEQUIPMENTID:
      return {
        ...state,
        historyList: _get(action.data, 'content'),
        historyTotal: _get(action.data, 'totalElements')
      };
    default:
      return state;
  }
};

export const key = 'inspectItemPlan';

reducer.reducer = key;

export default reducer;
