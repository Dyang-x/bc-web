import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0,
  fileList: []
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_FILE_LIST:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    case types.GET_TYPE:
      return {
        ...state,
        typeList: action.data 
      };
    case types.GET_FILEDETAILBATCH:
      return {
        ...state,
        fileList: action.data 
      };
      
    default: 
      return state;
  }
};

export const key = 'file';

reducer.reducer = key;

export default reducer;
