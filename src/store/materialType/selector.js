/*
 * @Author: Andy
 * @Date: 2019-07-08 09:12:21
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-18 22:18:33
 */
import { key } from '.';

export const materialTypeListSelect = state => state[key].list;
export const totalSelector = state => state[key].total || 0;
