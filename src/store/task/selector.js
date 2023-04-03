import { key } from '.';

export const listSelector = state => state[key].list || [];
export const totalSelector = state => state[key].total || 0;
export const taskCountSelector = state => state[key].taskCount || {};
export const PriorityObjSelector = state => state[key].PriorityObj || {};
export const taskInfoSelector = state => state[key].taskInfo || {};
export const sparePartListSelector = state => state[key].sparePartList || [];
export const lubListSelector = state => state[key].lubList || [];
export const sparePartTotalSelector = state => state[key].sparePartTotal || 0;
export const lubListTotalSelector = state => state[key].lubListTotal || 0;
export const lubHistorySelector = state => state[key].lubHistory || [];
export const sparePartHistorySelector = state => state[key].sparePartHistory || [];
export const lubApplyThroughSelector = state => state[key].lubApplyThrough || [];
export const spareApplyThroughSelector = state => state[key].spareApplyThrough || [];
export const listHistorySelector = state => state[key].listHistory || [];
export const totalHistorySelector = state => state[key].totalHistory || 0;
export const taskInfoHistorySelector = state => state[key].taskInfoHistory || {};

export const applyLubSelector = state => state[key].applyLub || [];

export const applySpareSelector = state => state[key].applySpare || [];

export const historyListSelector = state => state[key].historyList || [];
export const historyTotalSelector = state => state[key].historyTotal || 0;