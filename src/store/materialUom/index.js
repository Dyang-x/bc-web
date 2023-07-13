import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_UNIT_TYPE_LIST:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    default:
      return state;
  }
};

export const key = 'materialUom';

reducer.reducer = key;

export default reducer;
