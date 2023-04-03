import React, { useEffect, useState } from 'react';
import { DetachTable_Cache_Pro } from '@hvisions/h-ui';
const TableComponent = props => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    props.event.on('changeLoadData', array => {
      setValues(array);
    });
    return () => {
      props.event.removeAllListeners(['changeLoadData']);
    };
  }, []);

  return <DetachTable_Cache_Pro.CacheTable {...props} event={props.event} defaultValues={values} />;
};

export default TableComponent;
