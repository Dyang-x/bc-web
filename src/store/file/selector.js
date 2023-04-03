import { createSelector } from 'reselect';
import { key } from '.';

export const fileListSelect = state => state[key].list;
export const typeSelector = state => state[key].typeList || [];
export const totalSelector = state => state[key].total || 0;
export const columnsSelector = state => state[key].columns || [];

export const typeListSelector = createSelector(
  typeSelector,
  list => list
);
export const fileListSelector = state => state[key].fileList || [];
