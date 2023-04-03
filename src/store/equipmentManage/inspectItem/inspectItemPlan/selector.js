import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { key } from '.';

export const listSelector = state => state[key].list || [];
export const equipmentByIdlistSelector = state => state[key].equipmentList || [];
export const conditionListSelector = state => state[key].conditionList || {};
export const equipmentLocationSelector = state => state[key].equipmentLocation || {};
export const totalSelector = state => state[key].total || 0;
export const allEnumsSelector = state => state[key].allEnums || {};
const formatTree = nodes => {
  if (!isEmpty(nodes)) {
    if (!isEmpty(nodes.enterpriseDto)) {
      return `${nodes.enterpriseDto.name}>${nodes.siteDto.name}>${nodes.areaDto.name}>${nodes.cellDto.name}`;
    } else {
      return '设备位置为空';
    }
  }
  return '';
};
export const equipmentLocationStr = createSelector(equipmentLocationSelector, formatTree);
export const historyListSelector = state => state[key].historyList || [];
export const historyTotalSelector = state => state[key].historyTotal || 0;
