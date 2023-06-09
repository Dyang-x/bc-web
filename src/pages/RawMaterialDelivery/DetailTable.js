import React, { useState, useEffect, useRef } from 'react';
import { Table, notification, Modal, Button, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';

import EmptyPalletsWarehousing from '~/api/EmptyPalletsWarehousing';
import SurplusMaterialApi from '~/api/SurplusMaterial';

const { getFormattedMsg } = i18n;
const { Option } = Select

const DetailTable = ({
  dataSource
}) => {

  const [emptyVis, setEmptyVis] = useState(false);
  const [emptyData, setEmptyData] = useState([]);
  const [feedPort, setFeedPort] = useState();
  

  const feedPorts = [
    { key: 1, name: '上料口', value: '上料口', },
    { key: 2, name: '下料口', value: '下料口', }
  ]

  // const columns = [
  //   {
  //     title: '托盘号',
  //     dataIndex: 'trayNumber',
  //     key: 'trayNumber',
  //     align: 'center',
  //   },
  //   {
  //     title: '工位',
  //     dataIndex: 'station',
  //     key: 'station',
  //     align: 'center',
  //   },
  //   {
  //     title: '物料总数量',
  //     dataIndex: 'count',
  //     key: 'count',
  //     align: 'center',
  //   },
  //   {
  //     title: '已消耗数量',
  //     dataIndex: 'uesd',
  //     key: 'uesd',
  //     align: 'center',
  //   },
  //   {
  //     title: '剩余数量',
  //     dataIndex: 'surplus',
  //     key: 'surplus',
  //     align: 'center',
  //   },
  // ]
  const columns = [
    {
      title: '切割机',
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center',
    }, {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    }, {
      title: '材料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    }, {
      title: '材料大小 X',
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center',
    }, {
      title: '材料大小 Y',
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center',
    }, {
      title: '材料厚度',
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center',
    }, {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      align: 'center',
    }, {
      title: '出库总数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    }, {
      title: '剩余数量',
      dataIndex: 'remainderNum',
      key: 'remainderNum',
      align: 'center',
    }, {
      title: '任务编码',
      dataIndex: 'taskCode',
      key: 'taskCode',
      align: 'center',
    }, {
      title: '托盘交接位',
      dataIndex: 'fromLocation',
      key: 'fromLocation',
      align: 'center',
    }, {
      title: '托盘到达位',
      dataIndex: 'toLocation',
      key: 'toLocation',
      align: 'center',
    }, {
      title: '托盘位置',
      dataIndex: 'trayLocation',
      key: 'trayLocation',
      align: 'center',
    }, {
      title: '托盘号',
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    }, {
      title: '使用数量',
      dataIndex: 'useNum',
      key: 'useNum',
      align: 'center',
    }, {
      title: '使用状态',
      dataIndex: 'useState',
      key: 'useState',
      align: 'center',
    }, {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => {
        if (record.remainderNum == 0) {
          return (
            <a key="detail" onClick={() => handleEmpty(record)}>
              空托回库
            </a>
          )
        }
        if (record.remainderNum != 0) {
          return (
            <a key="detail" onClick={() => handleSurplus(record)}>
              余料回库
            </a>
          )
        }
      }
    }
  ]

  
  const handleEmpty = (record) => {
    setEmptyVis(true)
    setEmptyData(record)
  }

  const handleCancelEmpty = () => {
    setEmptyVis(false)
    setEmptyData([])
    setFeedPort()
  }

  const modalEmptyFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveEmpty}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelEmpty}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveEmpty = async() => {
 
      const params = {
        feedPort:feedPort,
        cuttingMachine:emptyData.cuttingMachine,
        trayNumber:emptyData.trayNumber,
        origin:emptyData.toLocation,
        middle:emptyData.fromLocation,
      }
      params.state = 0
      console.log('params',params);
      await EmptyPalletsWarehousing
      .saveOrUpdate(params)
      .then(res => {
        notification.success({
          message: getFormattedMsg('EmptyPalletsWarehousing.message.addSuccess')
        });
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
      handleCancelEmpty();
 
  }

const handleSurplus =async (record)=>{
  const params ={
    trayNumber:record.trayNumber,
    cuttingMachine:record.cuttingMachine,
    materialCode:record.materialCode,
    materialName:record.materialName,
    materialSizeX:record.materialSizeX,
    materialSizeY:record.materialSizeY,
    materialSpecs:record.materialSpecs,
    materialThickness:record.materialThickness,
    quantity:record.remainderNum,
    fromLocation:record.toLocation,
    middle:record.fromLocation,
    // toLocation:record.   ,
  }

  await SurplusMaterialApi
        .addSurplus(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SurplusInStorage.message.addSuccess')
          });
          // loadData(page, pageSize, { ...searchValue});
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SurplusInStorage.message.addFailure'),
            description: err.message
          });
        });
}

  return (
    <>
        <Table
      pagination={false}
      scroll={{ x: 'max-content' }}
      dataSource={dataSource}
      columns={columns}
      rowKey={record => record.id}
    />
          <Modal
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.empty')}
        visible={emptyVis}
        footer={modalEmptyFoot()}
        onCancel={handleCancelEmpty}
        destroyOnClose
        width={800}
      >
        {/* <EmptyForm ref={emptyRef} /> */}
        <Select
              showSearch
              placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.feedPort')}
              onChange ={(e)=>{
                
                setFeedPort(e)
              }}
            >
              {feedPorts.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
      </Modal></>

  )
}

export default DetailTable
