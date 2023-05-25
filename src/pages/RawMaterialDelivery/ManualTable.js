import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  selectedRowKeys, setSelectedRowKeys
}) => {

  const [materialList, setMaterialList] = useState([])
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.count'),
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="takeOff" onClick={() => handleTakeOff(record)}>
          {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.takeOff')}
        </a>
      ],
      // width: 80,
      // fixed: 'right'
    }
  ]

  useEffect(() => {
    // getMaterial()
  }, [])

  const handleTakeOff = () => {

  }

  // const rowSelection = {
  //   hideDefaultSelections: false,
  //   type: 'radio',
  //   onSelect: (record, selected, selectedRows, nativeEvent) => {

  //   },
  //   selectedRowKeys,
  //   onChange: selectedRowKeys => {
  //     setSelectedRowKeys(selectedRowKeys);
  //   }
  // };

  // const onRowClick = record => {
  //   setSelectedRowKeys([record.id]);
  // };

  return (
    <Table
      pagination={false}
      scroll={{ x: 'max-content' }}
      dataSource={dataSource}
      columns={columns}
      rowKey={record => record.id}
    // rowSelection={rowSelection}
    // onRow={record => {
    //   return {
    //     onClick: () => {
    //       onRowClick(record);
    //     }
    //   };
    // }}
    />
  )
}

export default Form.create()(TrayForm)
