import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { key } from '.';

export const list = state => state[key].list;

export const totalSelector = state => state[key].total;

export const columnsSelector = state => state[key].columns;

const formatTree = nodes => nodes.filter(node => {
  if (!isEmpty(nodes)) {
    const children = nodes.filter(c => c.parentId === node.id);
    node.children = !isEmpty(children) ? children : [];
  }  
  return node.parentId === 0;
});

export const listSelector = createSelector(list, formatTree);

export const equipmentListSelector = state => state[key].equipmentList || [];

const formatTreeNoChildren = nodes => nodes.filter(node => {
  if (!isEmpty(nodes)) {
    const children = nodes.filter(c => c.parentId === node.id);
    if (!isEmpty(children)) {
      node.children = children;
    }
  }
  return node.parentId === 0;
});

export const alllistTreeSelector = createSelector(equipmentListSelector, formatTreeNoChildren);

export const equipmentInfoSelector = state => state[key].equipmentInfo || {};

export const fileIdsSelector = state => state[key].fileIds || [];

export const allTagListSelector = state => state[key].allTagList || [];

export const eventListSelector = state => state[key].eventList || [];

export const eventTotalSelector = state => state[key].eventTotal || 0;

export const equipmentParameterValueSelector = state => state[key].equipmentParamenterValueList || [];

export const tagTotalSelector = state => state[key].tagTotal || 0;

export const tagListSelector = state => state[key].tagList || [];

export const equipmentTypeListAllSelect = state => state[key].typeList || [];

export const equipmentTypeTreeSelect = createSelector(
  equipmentTypeListAllSelect,
  formatTree
);