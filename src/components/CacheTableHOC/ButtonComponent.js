import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { DetachTable_Cache_Pro, notification } from '@hvisions/h-ui';
import Api from '~/api/cacheTable';

const ButtonComponent = props => {
  const [values, setValues] = useState([]);

  const options = props.columns.map(i => ({
    label: i.title,
    value: i.key,
    checked: !i.initialHidden
  }));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Api.getFormConfigByKey(props.tableKey)
      .then(res => {
        let defaultValues = options.filter(_o => _o.checked).map(_o => _o.value);
        if (res) {
          const data = Object.keys(res.columnMsg);
          if (!isEmpty(data)) {
            defaultValues = data;
          }
        }
        setValues(defaultValues);
        props.event.emit('changeLoadData', defaultValues);
      })
      .catch(err => {
        const defaultValues = options.filter(_o => _o.checked).map(_o => _o.value);
        setValues(defaultValues);
        props.event.emit('changeLoadData', defaultValues);
        notification.warning({
          message: '获取表格配置项失败',
          description: err.message
        });
      });
  };
  return (
    <DetachTable_Cache_Pro.CacheButton
      onHandleSave={props.onHandleTableConfigsSave}
      defaultValues={values}
      event={props.event}
      options={options}
    />
  );
};

export default ButtonComponent;
