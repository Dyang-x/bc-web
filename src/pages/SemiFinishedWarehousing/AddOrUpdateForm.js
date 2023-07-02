import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';
import { dockingPoints, sortPositions } from '~/enum/enum';
import PrepareAreaServices from '~/api/PrepareArea';
import style from './style.scss'

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const sortPosition = [
  { id: 1, name: 'J004', value: 'J004', },
  { id: 2, name: 'J005', value: 'J005', },
  { id: 3, name: 'J006', value: 'J006', },
]

const attributeTwos = [
  { id: 1, name: '切割完工', value: '切割完工', },
  { id: 2, name: '切割未完工', value: '切割未完工', },
]

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  type,
  attributeOneState,
  attributeTwoState,
  setAttributeOneState,
  setAttributeTwoState,
  attributeOne,
  attributeTwo,
  // dockingPoints,
  // sortPositions,
  setDataSource,
  dataSource, 
}) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([])

  // const [dataSource, setDataSource] = useState([])
  const [height, setHeight] = useState(0)


  useEffect(() => {
    // getTransfer()
  }, [])

  // const getTransfer = async (searchValue) => {
  //   const params = {
  //     code:searchValue,
  //     page: pageInfo.page - 1,
  //     pageSize: pageInfo.pageSize
  //   }
  //   await TransferBoxServices.getPage(params)
  //     .then(res => {
  //       setTransferList(res.content);
  //     }).catch(err => {
  //       notification.warning({
  //         message: getFormattedMsg('global.notify.fail'),
  //         description: err.message
  //       });
  //     });
  // };

  // const CheckboxChange = async (e) => {
  //   const automaticState = e.target.checked

  // }

  const sortPositionChange = async (e) => {
    const sortPosition = e
    console.log('sortPosition', sortPosition);
    await PrepareAreaServices.findByArea({ areaCode: sortPosition })
      .then(res => {
        console.log(res, 'res');
        if (res.content.length > 0) {
          const transferCode = res.content[0].transferCode
          setFieldsValue({ trayNumber: transferCode })
        }
      }).catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }



  const onKeyDowm = (e) => {

    const dataString = e.target.value
    const arr = dataString.split('|');
    console.log('arr', arr);

    // const materialCode = arr[0]
    // const quantity = arr[1]
    // const orderNumber = arr[2]
    // const materialName = arr[3]

    const addData = {
      id:dataSource.length+1,
      name: '主订单号',
      value: arr[2],
      Detail: [
        {id:1, name: '数量', value: arr[1], },
        {id:2, name: '产品代码', value: arr[0], },
        {id:3, name: '产品名称', value: arr[3], },
      ]
    }
    console.log([...dataSource, addData], '[...dataSource,addData]');
    setDataSource([...dataSource, addData])

    setFieldsValue({
      scan: '',
    })
  }

  const columns = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      className: style['table-name']
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      className: style.tableValue,
      render: (text, record) => {
        return (
          <Input
          defaultValue={text}
            onChange={(e) => {
              onInputChange(e,record)
            }}
          />
        )
      }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.operation'),
      key: 'opt',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
          {getFormattedMsg('SemiFinishedWarehousingReceipt.button.delete')}
        </a>,
      ],
    }
  ]

  const detailColumns = [
    {
      title: '属性名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      className: style['table-name']
    },
    {
      title: '属性值',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      className: style.tableValue,
      render: (text, record) => {
        return (
          <Input
          defaultValue={text}
            onChange={(e) => {
              onInputChange(e,record)
            }}
          />
        )
      }
    },
  ]

  const handleDelete = (record) => {
    console.log(record, 'record');
    const newD  = dataSource.filter(i=>i.value != record.value)
    console.log(newD, 'newD');
    setDataSource(newD)
  }

  const onInputChange = (e,record) => {
    console.log('edasdad', e.target.value);
    record.value = e.target.value
  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.sortPosition')}>
        {
          getFieldDecorator('sortPosition', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition'),
              },
            ],
            initialValue: modifyData ? modifyData['sortPosition'] : undefined
            // initialValue: modifyData ? parseInt(modifyData['sortPosition']) : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition')}
              showSearch
              filterOption={false}
              disabled={type}
              onChange={(e) => { sortPositionChange(e) }}
            >
              {sortPosition.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber'),
              },
            ],
            initialValue: modifyData ? modifyData['trayNumber'] : undefined
          })(
            <Input disabled={type} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.orderNumber')}>
        {
          getFieldDecorator('scan', {
          })(
            <Input
              disabled={type}
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')}
              style={{ width: '100%' }}
              onPressEnter={(e) => { onKeyDowm(e) }}
            />
          )
        }
      </Form.Item>
      <Form.Item   >
        <div className='div-Table' style={{ marginLeft: '10rem' }}>
          <Table
            className='Form-Table'
            rowKey={record => record.id}
            columns={columns}
            dataSource={dataSource}
            expandedRowRender={record => <Table
              columns={detailColumns}
              dataSource={record.Detail}
              showHeader={false}
              pagination={false}
              rowKey={record => record.id}
            />}
            showHeader={false}
            pagination={false}
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
            initialValue: modifyData && modifyData['attributeOne'] ? ((modifyData['attributeOne']).split(',')) : []
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne')}
              showSearch
              filterOption={false}
              disabled={type}
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeTwo')}>
        {
          getFieldDecorator('attributeTwo', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo'),
              },
            ],
            initialValue: modifyData && modifyData['attributeTwo'] ? modifyData['attributeTwo'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo')}
              showSearch
              filterOption={false}
              disabled={type}
            // mode="multiple"
            >
              {attributeTwos.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
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
            initialValue: modifyData ? modifyData['dockingPoint'] : 'J002'
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint')}
              showSearch
              filterOption={false}
              disabled={type}
            // mode="multiple"
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
      <Form.Item {...formItemLayout} label={'备注'}>
        {
          getFieldDecorator('description', {
            initialValue: modifyData ? modifyData['description'] : undefined
          })(
            <Input disabled={type} placeholder={'请输入备注'} style={{ width: '100%' }} />
          )}
      </Form.Item>
    </Form>

  )
}

export default Form.create()(TrayForm)
