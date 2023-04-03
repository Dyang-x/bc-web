import React, { useState, useEffect } from 'react';
import { Table } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
const { getFormattedMsg } = i18n;

const ManualTable = ({
  selectedRowKeys, setSelectedRowKeys
}) => {

  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.taskStatus'),
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.palletStatus'),
      dataIndex: 'palletStatus',
      key: 'palletStatus',
      align: 'center',
    },
  ]

  useEffect(() => {
    
  }, [])



  const rowSelection = {
    hideDefaultSelections: false,
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {

    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const onRowClick = record => {
    setSelectedRowKeys([record.id]);
  };

  return (
    <Table
    pagination={false}
    scroll={{ x: 'max-content' }}
    dataSource={dataSource}
    columns={columns}
    rowKey={record => record.id}
    rowSelection={rowSelection}
    onRow={record => {
      return {
        onClick: () => {
          onRowClick(record);
        }
      };
    }}
  />
  )
}

export default ManualTable
