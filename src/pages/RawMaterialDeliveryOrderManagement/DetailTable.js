import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, HVLayout, Form, Drawer } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import AddSurplusForm from './AddSurplusForm';

const { getFormattedMsg } = i18n;

const DetailTable = ({
  dataSource
}) => {

  const columns = [
    {
      title: '托盘号',
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: '工位',
      dataIndex: 'station',
      key: 'station',
      align: 'center',
    },
    {
      title: '物料总数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
    {
      title: '已消耗数量',
      dataIndex: 'uesd',
      key: 'uesd',
      align: 'center',
    },
    {
      title: '剩余数量',
      dataIndex: 'surplus',
      key: 'surplus',
      align: 'center',
    },
  ]

  return (
    <Table
      pagination={false}
      scroll={{ x: 'max-content' }}
      dataSource={dataSource}
      columns={columns}
      rowKey={record => record.id}
    />
  )
}

export default DetailTable
