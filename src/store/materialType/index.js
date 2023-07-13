/*
 * @Author: Andy
 * @Date: 2019-07-08 09:12:21
 * @LastEditors: Andy
 * @LastEditTime: 2019-07-08 09:12:21
 */
import { get as _get } from 'lodash';
import * as types from './types';

const initialState = {
  list: [],
  total: 0
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.GET_MATERIAL_TYPE_LIST:
      return {
        ...state,
        list: _get(action.data, 'content'),
        total: _get(action.data, 'totalElements')
      };
    default:
      return state;
  }
};

export const key = 'materialType';

reducer.reducer = key;

export default reducer;
