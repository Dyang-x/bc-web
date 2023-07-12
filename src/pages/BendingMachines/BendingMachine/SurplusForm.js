import React, { useState, useEffect, useRef } from 'react';
import { TreeSelect, notification, Form, Input, Select, Table,Button } from '@hvisions/h-ui'
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';
import SemiFinishedWarehousingReceiptServices from '~/api/SemiFinishedWarehousingReceipt';
import { dockingPoints } from '~/enum/enum';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const SurplusForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  attributeOne,
  attributeTwo,
}) => {

  const [searchValue, setSearchValue] = useState({})
  const [tableData, setTableData] = useState([])

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [orderNumbers, setOrderNumbers] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');

  const [detailSelectedRowKeys, setDetailSelectedRowKeys] = useState([]);
  const [suborderNumbers, setSuborderNumbers] = useState([]);
  const [suborderNumber, setSuborderNumber] = useState('');

  useEffect(() => {
    getAllOderByQuery()
  }, [])

  useEffect(() => {
  }, [selectedRowKeys,detailSelectedRowKeys])

  const getAllOderByQuery = async (orderNumber,suborderNumber) => {
    console.log(orderNumber,'orderNumber');
    console.log(suborderNumber,'suborderNumber');

    const params={}
    orderNumber == undefined||orderNumber == ''  ?delete params.orderNumber: params.orderNumber = orderNumber
    suborderNumber == undefined||suborderNumber == ''  ?delete params.suborderNumber: params.suborderNumber = suborderNumber
    console.log(params,'params');

    await SemiFinishedWarehousingReceiptServices.getAllOderByQuery(params)
      .then(res => {
        console.log('res', res);
        setTableData(res)
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderCode',
      key: 'orderCode',
      align: 'center',
    },
    {
      title: '产品代码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },
    {
      title: '产品名称',
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
  ]

  const detailColumns = [
    {
      title: '子订单号',
      dataIndex: 'suborderNumber',
      key: 'suborderNumber',
      align: 'center',
    },
    {
      title: '产品图号',
      dataIndex: 'figureNumber',
      key: 'figureNumber',
      align: 'center',
    },
  ]

  const onTableSelect = e => {
    let number=[]
    if (selectedRowKeys.indexOf(e.id) === -1) {
      setSelectedRowKeys([...selectedRowKeys, e.id])
      number = [...orderNumbers, e.orderCode]
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(i => i != e.id))
      number = orderNumbers.filter(i => i != e.orderCode)
    }
    setOrderNumbers(number)
    setFieldsValue({orderNumber:number.toString()})
  };

  const onDetailTableSelect = e => {
    let number=[]
    if (detailSelectedRowKeys.indexOf(e.id) === -1) {
      setDetailSelectedRowKeys([...detailSelectedRowKeys, e.id])
      number = [...suborderNumbers, e.suborderNumber]
    } else {
      setDetailSelectedRowKeys(detailSelectedRowKeys.filter(i => i != e.id))
      number = suborderNumbers.filter(i => i != e.suborderNumber)
    }
    setSuborderNumbers(number)
    setFieldsValue({suborderNumber:number.toString()})
  };

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber'),
              },
            ],
            initialValue: modifyData ? modifyData['transferCode'] : undefined
          })(
            <Input placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber')} style={{ width: '100%' }} />
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={'主订单号'}>
        {
          getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                message: '请选择主订单号',
              },
            ],
          })(
            <Input placeholder={'请选择主订单号'} style={{ width: '100%' }} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'子订单号'}>
        {
          getFieldDecorator('suborderNumber', {
            rules: [
              {
                required: true,
                message: '请选择子订单号',
              },
            ],
          })(
            <Input placeholder={'请选择子订单号'} style={{ width: '100%' }} />
          )
        }
      </Form.Item>
      <Form.Item>
        <div>
          <div style={{display:'flex',marginBottom:'1rem'}}>
          <Input addonBefore={'主订单号：'} style ={{marginLeft:'1rem'}} onChange={e=>{setOrderNumber(e.target.value)}}/>
          <Input addonBefore={'子订单号：'} style ={{marginLeft:'1rem'}} onChange={e=>{setSuborderNumber(e.target.value)}}/>
          <Button type="primary" shape="circle" icon="search" style ={{marginLeft:'1rem'}} onClick={()=>getAllOderByQuery(orderNumber,suborderNumber)}/>
          </div>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={tableData}
            expandedRowRender={
              record => <Table
                rowKey={record => record.id}
                columns={detailColumns}
                dataSource={record.suborderNumberDetails}
                // showHeader={false}
                pagination={false}
                rowSelection={{
                  // type: 'radio',
                  columnTitle: ' ',
                  onSelect: onDetailTableSelect,
                  selectedRowKeys: detailSelectedRowKeys,
                  hideDefaultSelections: true,
                }}
              />
            }
            // showHeader={false}
            pagination={false}
            rowSelection={{
              // type: 'radio',
              columnTitle: ' ',
              onSelect: onTableSelect,
              selectedRowKeys: selectedRowKeys,
              hideDefaultSelections: true,
            }}
          />
        </div>
      </Form.Item>

      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeOne')}>
        {
          getFieldDecorator('attributeOne', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne'),
              },
            ],
            // initialValue: modifyData ? modifyData['attributeOne'] : undefined
            initialValue: modifyData && modifyData['attribute'] ? ((modifyData['attribute']).split(',')) : []
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne')}
              showSearch
              filterOption={false}
              mode="multiple"
            >
              {attributeOne.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.sortPosition')}>
        {
          getFieldDecorator('sortPosition', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition'),
              },
            ],
            initialValue: modifyData ? modifyData['readyMaterials'] : undefined
          })(
            <Input placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.dockingPoint')}>
        {
          getFieldDecorator('dockingPoint', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint'),
              },
            ],
            initialValue: 'J003'
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint')}
              showSearch
              filterOption={false}
            >
              {dockingPoints.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>

    </Form>
  )
}

export default Form.create()(SurplusForm)
