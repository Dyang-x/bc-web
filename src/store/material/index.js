import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  columns: [],
  roles: [],
  total: 0,
  unitList: [],
  productList: [],
  materialInfo: {}
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_MATERIAL:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    case types.GET_UNIT:
      return {
        ...state,
        unitList: action.data,
      };
    case types.GET_MATERIALBYPRODUCT:
      return {
        ...state,
        productList: _get(action.data, 'content'),
      };
    case types.GET_TYPE:
      return {
        ...state,
        typeList: action.data  
      };  
    case types.GET_EXTENDS_COLUMNS:
      return {
        ...state,
        columns: action.data,
      };  
    case types.GET_BOMCODE:
      return {
        ...state,
        bomCode: _get(action.data, 'content')
      };
    case types.GET_BOMVERSIONS:
      return {
        ...state,
        bomVersion: action.data
      };
    case types.GET_MATERIAL_BY_BARCH: 
      return {
        ...state,
        materialDto: action.data
      };
    case types.GET_MATERIALBYCODEORVALUE: 
      return {
        ...state,
        materialInfo: action.data
      }; 
    case types.GET_MATERIAL_SETTING:
      return {
        ...state,
        materialSetting: action.data
      };   
    default:
      return state;
  }
};

export const key = 'material';

reducer.reducer = key;

export default reducer;
