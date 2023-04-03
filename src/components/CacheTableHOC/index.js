import React from 'react';
import Api from '~/api/cacheTable';
import { notification } from '@hvisions/h-ui';
import ButtonComponent from './ButtonComponent';
import EventEmitter from 'events';

import TableComponent from './TableComponent';
const CacheTableHOC = ({ columns, key, scrollHeight }) => {
  const event = new EventEmitter();
  const onHandleSave = async options => {
    let items = {};
    options.forEach(i => {
      items = { ...items, [i]: true };
    });
    await Api.saveFormConfig(key, items)
      .then(() => {
        notification.success({
          message: '保存配置项成功'
        });
      })
      .catch(err => {
        notification.warning({
          message: '保存配置项失败',
          description: err.message
        });
      });
  };
  return {
    Table: props => <TableComponent {...props} event={event} scrollHeight={scrollHeight} />,
    SettingButton: () => (
      <ButtonComponent
        columns={columns}
        event={event}
        tableKey={key}
        onHandleTableConfigsSave={onHandleSave}
      />
    )
  };
};

export default CacheTableHOC;
