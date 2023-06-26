import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { HVLayout, notification, Table } from '@hvisions/h-ui';
import RectangleImg from '../../../assets/slices/Rectangle.svg';
import LineEdgeLibraryApi from '~/api/LineEdgeLibraryController';
import { CacheTable } from '~/components';
import styles from './style.scss';
// import EditableFormTable from './Table/index';
import TableRolling from './Table/index';
import { Icon } from 'antd';
import { LargeRectRight } from '../../container';

const ContentFour = ({ usedHeight }) => {
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
        marginTop: '4rem',
        marginLeft: '4rem',
        // display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        // height: usedHeight * 0.6
        height: '50rem'
      }}
    >
      <LargeRectRight style={{ flex: '1', }}>
        <div className={styles.over}>
          <div key={'alert'} className={styles.alert}>
            <div className={styles.top} ><Icon type="alert" /></div>
            <div style={{ marginLeft: 10 }}>生产异常</div>
          </div>,
        </div>
        <TableRolling usedHeight={usedHeight} />
      </LargeRectRight>
    </div>
    // <div
    //   style={{
    //     marginTop: '1rem',
    //     marginLeft: '4rem',
    //     marginRight: '4rem',
    //     display: 'flex',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     width: '100%',
    //   }}
    //   className={styles.middle}
    // >
    //   <HVLayout.Pane >
    //     <div className={styles.over}>
    //       <div key={'alert'} className={styles.alert}>
    //         <div className={styles.top} ><Icon type="alert" /></div>
    //         <div style={{ marginLeft: 10 }}>生产异常</div>
    //       </div>,
    //     </div>
    //     <TableRolling usedHeight={usedHeight} />
    //   </HVLayout.Pane>
    // </div>
  );
};

export default ContentFour;
