import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select,Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';


const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PickTrayTable = ({
  selectedRowKeys, setSelectedRowKeys,setSelectedDatas
}) => {

  const [materialList, setMaterialList] = useState([])
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.location'),
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.attributeTwo'),
      dataIndex: 'attributeTwo',
      key: 'attributeTwo',
      align: 'center',
    },
    {
      title: '原捡料点',
      dataIndex: 'pickingPoint',
      key: 'pickingPoint',
      align: 'center',
    },
  ]

  useEffect(() => {
    const data = [
      { id: 1, trayNumber: 'J004', location: 'J004', attributeTwo: 'J004', pickingPoint: 'J004', },
      { id: 2, trayNumber: 'J005', location: 'J005', attributeTwo: 'J005', pickingPoint: 'J005', },
      { id: 3, trayNumber: 'J006', location: 'J006', attributeTwo: 'J006', pickingPoint: 'J006', },
      { id: 4, trayNumber: 'J007', location: 'J007', attributeTwo: 'J007', pickingPoint: 'J007', },
      { id: 5, trayNumber: 'J008', location: 'J008', attributeTwo: 'J008', pickingPoint: 'J008', },
      { id: 6, trayNumber: 'J009', location: 'J009', attributeTwo: 'J009', pickingPoint: 'J009', },
    ]
    setDataSource(data)
    notification.warning({
      message: '查询接口'
    });
  }, [])

  const PickTrayData = async (page, pageSize, searchValue) => {

    console.log({ ...searchValue, page: page - 1, pageSize });
    await TransferBoxServices.getPage({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setDataSource(res.content);
        // setTotal(res.totalElements);
        // const pageInfos = {
        //   page: res.pageable.pageNumber + 1,
        //   pageSize: res.pageable.pageSize
        // }
        // setPageInfo(pageInfos)
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };


  const rowSelection = {
    hideDefaultSelections: false,
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      setSelectedDatas([record])
    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
      
    }
  };

  const onRowClick = record => {
    setSelectedRowKeys([record.id]);
    setSelectedDatas([record])
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

export default PickTrayTable
