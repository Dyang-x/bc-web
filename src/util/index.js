import { isEmpty, omitBy } from 'lodash';
import moment from 'moment';

export const formatExtendFields = (fields, columns) => {
  if (!isEmpty(fields.extend)) {
    // fields.extend = omitBy(fields.extend, val => !val);
    // 格式化扩展字段中的日期格式
    const dateTypeCols = columns.filter(col => col.columnType === 'date' || col.columnType === 'datetime');
    dateTypeCols.map(dtcol => {
      if (!fields.extend[dtcol.columnName]) {
        return null;
      }
      const format = dtcol.columnType === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss';
      return fields.extend[dtcol.columnName] = moment(fields.extend[dtcol.columnName]).format(format);
    });
  }
  return fields;
};
