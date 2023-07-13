import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { key } from '.';
export const listSelector = state => state[key].list || [];
export const listProductSelector = state => state[key].productList || [];
export const unitSelector = state => state[key].unitList || [];
export const typeSelector = state => state[key].typeList || [];
export const totalSelector = state => state[key].total || 0;
export const columnsSelector = state => state[key].columns || [];
export const materialListSelector = createSelector(
  listSelector,
  list => list
);

export const unitListSelector = createSelector(
  unitSelector,
  list => list
);

export const typeListSelector = createSelector(
  typeSelector,
  list => list
);

export const bomSelector = state => state[key].bomCode || [];

export const bomVersionSelector = state => state[key].bomVersion || [];

export const materialBindSelector = state => {
  const arr = [];
  if (!isEmpty(state[key].list)) {
    state[key].list.map(value => {
      if (value.bomCode) {
        arr.push(value);
      }
      return 1;
    });
  }
  return arr;
};

export const materialDtoSelector = state => state[key].materialDto || {};

export const productMaterialListSelector = createSelector(
  listSelector,
  list => list.filter(item => (item.materialGroup == 3 || item.materialGroup == 5))
);

export const materialInfoSelector = state => state[key].materialInfo || {};
export const materialSettingSelector = state => state[key].materialSetting || {};
