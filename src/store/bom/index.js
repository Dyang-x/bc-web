import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0,
  material: {},
  allBomItem: []
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_BOM:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
      case types.GET_ALLBOMITEM:
      return {
        ...state,
        allBomItem: action.data
      };
      case types.GET_MATERIAL:
      return {
        ...state,
        material: action.data
      };
      case types.GET_EXTENDS_COLUMNS:
        return {
          ...state,
          columns: action.data
        };
      case types.GET_EXTENDS_COLUMNS_BOMITEM:
        return {
          ...state,
          bomItemColums: action.data
        };
      case types.GET_EXTENDS_COLUMNS_BOMSUBITEM:
        return {
          ...state,
          bomSubItemColums: action.data
        };
    default:
      return state;
  }
};

export const key = 'bom';

reducer.reducer = key;

export default reducer;
