import { get as _get, uniqBy } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  columns: [],
  total: 0,
  equipmentList: [],
  equipmentInfo: {},
  fileIds: [],
  eventTotal: 0,
  eventList: [],
  allTagList: [],
  equipmentParamenterValueList: [],
  tagTotal: 0,
  tagList: [],
  typeList: []
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_EQUIPMENT_LIST:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    case types.CREATE_EQUIPMENT:
      return {
        ...state,
        list: state.list.concat(action.data)
      };
    case types.UPDATE_EQUIPMENT:
      return {
        ...state,
        list: state.list.map(n => {
          if (n.id === action.data.id) {
            return action.data;
          }
          return n;
        })
      };
    case types.DELETE_EQUIPMENT:
      return {
        ...state,
        list: state.list.filter(n => n.id !== action.id)
      };
    case types.GET_TREE_EQUIPMENT_LIST:
      return {
        ...state,
        list: action.id === 0 ? action.data : uniqBy(state.list.concat(action.data), 'id') || []
      };
    case types.GET_EXTEND_COLUMNS:
      return {
        ...state,
        columns: action.data
      };
    case types.GET_ALLEQUIPMENT:
      return {
        ...state,
        equipmentList: action.data || []
      };
    case types.GET_EQUIPMENTBYID:
      return {
        ...state,
        equipmentInfo: action.data || []
      };
    case types.GET_FILEIDSBYEQUIPMENTID:
      return {
        ...state,
        fileIds: action.data || []
      };
    case types.GET_EQUIPMENT_PARAMETER_VALUE:
      return {
        ...state,
        equipmentParamenterValueList: action.data
      };
    case types.GET_ALL_EQUIPMENT_TAG_VALUE:
      return {
        ...state,
        allTagList: action.data
      };
    case types.GET_EQUIPMENT_EVENT:
      return {
        ...state,
        eventList: _get(action.data, 'content'),
        eventTotal: _get(action.data, 'totalElements')
      };
    case types.GET_EUQIPMENT_TAG_VALUE:
      return {
        ...state,
        tagList: action.data,
        tagTotal: action.data ? action.data[0].total : 0
      };
    case types.GET_EQUIPMENT_TYPE_LIST:
      return {
        ...state,
        typeList: action.data || []
      };
    default:
      return state;
  }
};

export const key = 'equipment';

reducer.reducer = key;

export default reducer;
