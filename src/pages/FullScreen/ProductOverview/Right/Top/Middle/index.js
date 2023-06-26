import React, { useState, useEffect, useMemo } from 'react';
import { HVLayout, notification, Table } from '@hvisions/h-ui';
import styles from './style.scss';
// import EditableFormTable from './Table/index';
import TableRolling from './Table/index';
import { Icon } from 'antd';

const RightMiddle = ({ usedHeight }) => {
  const [rawData, setRawData] = useState({});
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      // LineEdgeLibraryApi.getByQuery({})
      //   .then(res => {
      //     console.log(res, 'res');
      //     setTableData(res);
      //   })
      //   .catch(err => {
      //     notification.warning({
      //       description: err.message
      //     });
      //   });
    };

    getData();
    const refreshData = setInterval(() => {
      getData();
      // }, 1000 * 60 * 30);
    }, 1000 * 5);
    return () => {
      clearInterval(refreshData);
    };
  }, []);


  // const { Table, SettingButton } = useMemo(
  //   () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_wireline_storage' }),
  //   []
  // );

  return (
    <div
      style={{
        marginTop: '1rem',
        // marginLeft: '4rem',
        // marginRight: '4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}
      className={styles.middle}
    >
      <HVLayout.Pane >
        <div className={styles.over}>
          <div key={'productPlan'} className={styles.productPlan}>
            <div className={styles.top} ><Icon type="area-chart" /></div>
            <div style={{ marginLeft: 10 ,color: '#5CEBFF'}}>计划主生产任务:1234567890条</div>
          </div>,
          <div key={'plan'} className={styles.plan}>
            <div className={styles.mid} ><Icon type="pie-chart" /></div>
            <div style={{ marginLeft: 10 ,color: '#5CEBFF' }}>缺料生产任务:1234567890条</div>
          </div>,
          <div key={'shortage'} className={styles.shortage}>
            <div style={{ marginLeft: 10 ,color: '#c15db4'}}>缺料项数:1234567890项</div>
          </div>
        </div>
        <TableRolling usedHeight={usedHeight} />
      </HVLayout.Pane>
    </div>
  );
};

export default RightMiddle;
