import { key } from '.';

export const listSelector = state => state[key].list || [];
export const totalSelector = state => state[key].total || 0;
export const allBomItemSelector = state => state[key].allBomItem;
export const materialSelector = state => state[key].material || [];
export const columnsSelector = state => state[key].columns || [];
export const columnsBomSelector = state => state[key].bomItemColums || [];
export const columnsBomSubSelector = state => state[key].bomSubItemColums || [];
