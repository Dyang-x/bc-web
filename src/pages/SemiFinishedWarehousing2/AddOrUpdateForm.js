import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce, isEmpty } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';
import { dockingPoints, sortPositions } from '~/enum/enum';
import PrepareAreaServices from '~/api/PrepareArea';
import style from './style.scss'

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const sortPosition = [
  { id: 1, name: 'J007', value: 'J007', },
  { id: 2, name: 'J008', value: 'J008', },
  { id: 3, name: 'J009', value: 'J009', },
]

const attributeTwos = [
  { id: 1, name: '切割完工', value: '切割完工', },
  { id: 2, name: '切割未完工', value: '切割未完工', },
]

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  type,
  attributeOne,
  setDataSource,
  dataSource, 
}) => {
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDatas, setSelectedDatas] = useState([]);

  const [expandedRowKey, setExpandedRowKey] = useState([])
  const [keyV, setKeyV] = useState(dataSource.length)
  const [inputV, setInputV] = useState()

  const [masterId, setMasterId] = useState()

  const [detailDataSource, setDetailDataSource] = useState([]);
  const [detailExpandedRowKey, setDetailExpandedRowKey] = useState([])
  const [detailKeyV, setDetailKeyV] = useState(0)
  const [detailInputV, setDetailInputV] = useState()

  useEffect(() => {

  }, [expandedRowKey, detailExpandedRowKey])

  const sortPositionChange = async (e) => {
    const sortPosition = e
    //console.log('sortPosition', sortPosition);
    await PrepareAreaServices.findByArea({ areaCode: sortPosition })
      .then(res => {
        //console.log(res, 'res');
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
              onInputChange(e, record)
            }}
          />
        )
      }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.operation'),
      key: 'opt',
      align: 'center',
      // width: 200,
      render: (_, record) => [
        // !isEmpty(selectedRowKeys) && <a key="add Detail" onClick={() => manualAddSuborder(record)}>手动新增子订单</a>,
        // !isEmpty(selectedRowKeys) && <Divider key="divider" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
          {getFormattedMsg('SemiFinishedWarehousingReceipt.button.delete')}
        </a>,
      ],
    }
  ]

  const columnsR = [
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
              onDetailInputChange(e, record)
            }}
          />
        )
      }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDetailDelete(record)}>
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
              onInputChange(e, record)
            }}
          />
        )
      }
    },
  ]

  const onKeyDowm = (e) => {
    const dataString = e.target.value
    const arr = dataString.split('|');

    const addData = {
      // id: dataSource.length + 1,
      id: keyV + 1,
      name: '主订单号',
      value: arr[2],
      Detail: [
        { id: 1, name: '数量', value: arr[1], },
        { id: 2, name: '产品代码', value: arr[0], },
        { id: 3, name: '产品名称', value: arr[3], },
      ],
      suborder: []
    }
    setDataSource([...dataSource, addData])

    setFieldsValue({scan:[...dataSource, addData].length})

    setExpandedRowKey([])
    setKeyV(keyV + 1)

    setInputV()
  }

  const handleDelete = (record) => {
    //console.log(record, 'record');
    const newD = dataSource.filter(i => i.id != record.id)
    //console.log(newD, 'newD');
    setDataSource(newD)

    setFieldsValue({ scan: newD.length == 0 ? '' : newD.length })
    
    if(newD.length == 0){
      setSelectedRowKeys([])
    }
  }

  const onInputChange = (e, record) => {
    //console.log('edasdad', e.target.value);
    record.value = e.target.value
  }

  const manualAdd = () => {
    const addData = {
      // id: dataSource.length + 1,
      id: keyV + 1,
      name: '主订单号',
      value: '',
      Detail: [
        { id: 1, name: '数量', value: '', },
        { id: 2, name: '产品代码', value: '', },
        { id: 3, name: '产品名称', value: '', },
      ],
      suborder: []
    }
    setDataSource([...dataSource, addData])

    setFieldsValue({scan:[...dataSource, addData].length})

    setExpandedRowKey([dataSource.length + 1])

    setSelectedRowKeys([])
    setSelectedDatas([])
    setDetailDataSource([])

    setKeyV(keyV + 1)
  }

  const onHandleTableSelect = e => {
    //console.log('e.suborder', e.suborder);
    if (selectedRowKeys.indexOf(e.id) === -1) {
      setSelectedRowKeys([e.id])
      setSelectedDatas(e)
      setDetailDataSource(e.suborder)
      setDetailKeyV(e.suborder.length)
    } else {
      setSelectedRowKeys([])
      setSelectedDatas([])
      setDetailDataSource([])
      setDetailKeyV(0)
    }
    setDetailExpandedRowKey([])
  };

  const onDetailKeyDowm = (e) => {
    const dataString = e.target.value
    const arr = dataString.split('|');

    const a = detailKeyV + 1
    const addData = {
      // id: detailDataSource.length + 1,
      id: selectedRowKeys[0] +'00' +a,
      key: 'slave' + selectedRowKeys[0] + a,
      name: '子订单号',
      value: arr[5],
      Detail: [
        { id: 1, name: '产品代码', value: arr[0], },
        { id: 2, name: '数量', value: arr[1], },
        { id: 3, name: '主订单号', value: arr[2], },
        { id: 4, name: '产品图号', value: arr[3], },
        { id: 5, name: '产品名称', value: arr[4], },
        { id: 6, name: '子订单号', value: arr[5], },
      ]
    }
    setDetailDataSource([...detailDataSource, addData])
    setDetailExpandedRowKey([])
    setDetailKeyV(detailKeyV + 1)

    setDetailInputV()

    selectedDatas.suborder = [...detailDataSource, addData]
    const detail = dataSource.map(t => {
      return t.id === selectedDatas.id ? selectedDatas : t;
    });
    //console.log(detail, 'detail');
    setDataSource(detail)
  }

  const handleDetailDelete = (record) => {
    const newD = detailDataSource.filter(i => i.id != record.id)
    setDetailDataSource(newD)

    selectedDatas.suborder = newD
    const detail = dataSource.map(t => {
      return t.id === selectedDatas.id ? selectedDatas : t;
    });
    //console.log(detail, 'detail');
    setDataSource(detail)
  }

  const onDetailInputChange = (e, record) => {
    record.value = e.target.value
  }

  const manualAddSuborder = () => {
    if (isEmpty(selectedRowKeys)) {
      notification.warning({
        message: '请先选择相关主订单'
      })
      return
    }
    //console.log(detailDataSource.length, 'detailDataSource.length');
    const a = detailKeyV + 1
    const addData = {
      // id: detailDataSource.length + 1,
      id: selectedRowKeys[0] +'00' +a,
      key: 'slave' + selectedRowKeys[0] + a,
      name: '子订单号',
      value: '',
      Detail: [
        { id: 1, name: '产品代码', value: '', },
        { id: 2, name: '数量', value: '', },
        { id: 3, name: '主订单号', value: '', },
        { id: 4, name: '产品图号', value: '', },
        { id: 5, name: '产品名称', value: '', },
        { id: 6, name: '子订单号', value: '', },
      ],
    }
    setDetailDataSource([...detailDataSource, addData])
    setDetailExpandedRowKey([selectedRowKeys[0] +'00' +a])

    setDetailKeyV(detailKeyV + 1)

    selectedDatas.suborder = [...detailDataSource, addData]
    const detail = dataSource.map(t => {
      return t.id === selectedDatas.id ? selectedDatas : t;
    });
    //console.log(detail, 'detail');
    setDataSource(detail)
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
            <Input disabled={type} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber')} style={{ width: '100%' }} />
          )}
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'订单数量'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.scan')}>
      {
          getFieldDecorator('scan', {
            rules: [
              {
                required: true,
                // message: '请完善订单信息',
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.label.scan'),
              },
            ],
          })(
            <Input
              disabled={true}
              // placeholder={'订单数量'}
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.message.scan')}
              style={{ width: '100%' }}
            />
          )
        }
      </Form.Item>
      {/* <Form.Item  {...formItemLayout} label={'订单信息'} > */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.info')}>
        <div style={{ display: 'flex' }}>
        <div style={{ width: '10%',display: 'gird', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}>
            {/* <Button type="link" style={{ marginLeft: 0}} onClick={() => manualAdd()}>手动新增主订单</Button> */}
            <Button type="link" style={{ marginLeft: 0}} onClick={() => manualAdd()}>{getFormattedMsg('SemiFinishedWarehousingReceipt.button.orderAdd')}</Button>
            {/* <Button type="link" style={{ marginLeft: 0 }} disabled={isEmpty(selectedRowKeys)} onClick={() => manualAddSuborder()}>手动新增子订单</Button> */}
            <Button type="link" style={{ marginLeft: 0 }} disabled={isEmpty(selectedRowKeys)} onClick={() => manualAddSuborder()}>{getFormattedMsg('SemiFinishedWarehousingReceipt.button.suborderAdd')}</Button>
          </div>
          <div className='div-Table' style={{ width: '50%', display: 'flex' }}>
            <div style={{ marginLeft: '1rem', flex: 1 }}>
              <Input
                // placeholder={'请输入主订单号'}
                placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderAdd')}
                style={{ width: '100%', marginBottom: 16 }}
                onPressEnter={(e) => { onKeyDowm(e) }}
                value={inputV}
                onChange={e => setInputV(e.target.value)}
              />
              <Table
                className='Form-Table'
                rowKey={record => record.id}
                columns={columns}
                dataSource={dataSource}
                expandedRowKeys={expandedRowKey}
                onExpand={(expanded, record) => {
                  if (expanded) {
                    const expandedRowKeys = [...expandedRowKey, record.id]
                    setExpandedRowKey(expandedRowKeys)
                  } else {
                    const expandedRowKeys = expandedRowKey.filter(i => i != record.id)
                    setExpandedRowKey(expandedRowKeys)
                  }
                }}
                expandedRowRender={record => <Table
                  columns={detailColumns}
                  dataSource={record.Detail}
                  showHeader={false}
                  pagination={false}
                  rowKey={record => record.id}
                />}
                showHeader={false}
                pagination={false}
                rowSelection={{
                  // type: 'radio',
                  onSelect: onHandleTableSelect,
                  selectedRowKeys: selectedRowKeys,
                  hideDefaultSelections: true,
                }}
              />
            </div>
          </div>
          <div className='div-TableR' style={{ width: '50%', display: 'flex' }}>
            <div style={{ marginLeft: '1rem', flex: 1 }}>
              <Input
                disabled={isEmpty(selectedRowKeys)}
                // placeholder={'请输入子订单号'}
                placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.suborderAdd')}
                style={{ width: '100%', marginBottom: 16 }}
                onPressEnter={(e) => { onDetailKeyDowm(e) }}
                value={detailInputV}
                onChange={e => setDetailInputV(e.target.value)}
              />
              <Table
                className='Form-Table'
                rowKey={record => record.id}
                // rowKey={record => record.key}
                columns={columnsR}
                dataSource={detailDataSource}
                expandedRowKeys={detailExpandedRowKey}
                onExpand={(expanded, record) => {
                  //console.log('expanded', expanded);
                  //console.log('record', record);
                  if (expanded) {
                    const expandedRowKeys = [...detailExpandedRowKey, record.id]
                    //console.log('expandedRowKeys111', expandedRowKeys);
                    setDetailExpandedRowKey(expandedRowKeys)
                  } else {
                    const expandedRowKeys = detailExpandedRowKey.filter(i => i != record.id)
                    //console.log('expandedRowKeys222', expandedRowKeys);
                    setDetailExpandedRowKey(expandedRowKeys)
                  }
                }}
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
          </div>
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
      {/* <Form.Item {...formItemLayout} label={'备注'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.desc')}>
        {
          getFieldDecorator('desc', {
            initialValue: modifyData ? modifyData['desc'] : undefined
          })(
            // <Input disabled={type} placeholder={'请输入备注'} style={{ width: '100%' }} />
            <Input disabled={type}  placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.desc')} style={{ width: '100%' }} />
          )}
      </Form.Item>
    </Form>

  )
}
//   const [expandedRowKey, setExpandedRowKey] = useState([])


//   useEffect(() => {
//     // getTransfer()
//   }, [expandedRowKey])

//   const sortPositionChange = async (e) => {
//     const sortPosition = e
//     //console.log('sortPosition', sortPosition);
//     await PrepareAreaServices.findByArea({ areaCode: sortPosition })
//       .then(res => {
//         //console.log(res, 'res');
//         if (res.content.length > 0) {
//           const transferCode = res.content[0].transferCode
//           setFieldsValue({ trayNumber: transferCode })
//         }
//       }).catch(err => {
//         notification.warning({
//           description: err.message
//         });
//       });
//   }

//   const onKeyDowm = (e) => {

//     const dataString = e.target.value
//     const arr = dataString.split('|');
//     //console.log('arr', arr);

//     // const materialCode = arr[0]
//     // const quantity = arr[1]
//     // const orderNumber = arr[2]
//     // const materialName = arr[3]

//     const addData = {
//       id:dataSource.length +1,
//       name: '主订单号',
//       value: arr[2],
//       Detail: [
//         {id:1, name: '数量', value: arr[1], },
//         {id:2, name: '产品代码', value: arr[0], },
//         {id:3, name: '产品名称', value: arr[3], },
//       ]
//     }
//     //console.log([...dataSource, addData], '[...dataSource,addData]');
//     setDataSource([...dataSource, addData])

//     setFieldsValue({
//       scan: '',
//     })
//     setExpandedRowKey([])
//   }

//   const columns = [
//     {
//       title: '属性名称',
//       dataIndex: 'name',
//       key: 'name',
//       align: 'center',
//       className: style['table-name']
//     },
//     {
//       title: '属性值',
//       dataIndex: 'value',
//       key: 'value',
//       align: 'center',
//       className: style.tableValue,
//       render: (text, record) => {
//         return (
//           <Input
//           defaultValue={text}
//             onChange={(e) => {
//               onInputChange(e,record)
//             }}
//           />
//         )
//       }
//     },
//     {
//       title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.operation'),
//       key: 'opt',
//       align: 'center',
//       width: 200,
//       render: (_, record) => [
//         <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
//           {getFormattedMsg('SemiFinishedWarehousingReceipt.button.delete')}
//         </a>,
//       ],
//     }
//   ]

//   const detailColumns = [
//     {
//       title: '属性名称',
//       dataIndex: 'name',
//       key: 'name',
//       align: 'center',
//       className: style['table-name']
//     },
//     {
//       title: '属性值',
//       dataIndex: 'value',
//       key: 'value',
//       align: 'center',
//       className: style.tableValue,
//       render: (text, record) => {
//         return (
//           <Input
//           defaultValue={text}
//             onChange={(e) => {
//               onInputChange(e,record)
//             }}
//           />
//         )
//       }
//     },
//   ]

//   const handleDelete = (record) => {
//     //console.log(record, 'record');
//     const newD  = dataSource.filter(i=>i.value != record.value)
//     //console.log(newD, 'newD');
//     setDataSource(newD)
//   }

//   const onInputChange = (e,record) => {
//     //console.log('edasdad', e.target.value);
//     record.value = e.target.value
//   }

//   const manualAdd = () => {
//     //console.log(dataSource.length, 'dataSource.length');
//     const addData = {
//       id: dataSource.length + 1,
//       name: '主订单号',
//       value: '',
//       Detail: [
//         { id: 1, name: '数量', value: '', },
//         { id: 2, name: '产品代码', value: '', },
//         { id: 3, name: '产品名称', value: '', },
//       ]
//     }
//     //console.log([...dataSource, addData], '[...dataSource,addData]');
//     setDataSource([...dataSource, addData])
//     //console.log(dataSource.length, 'dataSource.length');
//     setExpandedRowKey([dataSource.length+1])
//   }

//   return (
//     <Form >
//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.sortPosition')}>
//         {
//           getFieldDecorator('sortPosition', {
//             rules: [
//               {
//                 required: true,
//                 message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition'),
//               },
//             ],
//             initialValue: modifyData ? modifyData['sortPosition'] : undefined
//             // initialValue: modifyData ? parseInt(modifyData['sortPosition']) : undefined
//           })(
//             <Select
//               placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition')}
//               showSearch
//               filterOption={false}
//               disabled={type}
//               onChange={(e) => { sortPositionChange(e) }}
//             >
//               {sortPosition.map((value, index) => (
//                 <Option value={value.value} key={value.id}>
//                   {value.name}
//                 </Option>
//               ))}
//             </Select>
//           )
//         }
//       </Form.Item>
//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}>
//         {
//           getFieldDecorator('trayNumber', {
//             rules: [
//               {
//                 required: true,
//                 message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber'),
//               },
//             ],
//             initialValue: modifyData ? modifyData['trayNumber'] : undefined
//           })(
//             <Input disabled={type} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
//           )}
//       </Form.Item>
//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.orderNumber')}>
//         {
//           getFieldDecorator('scan', {
//           })(
//             <Input
//               disabled={type}
//               placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')}
//               style={{ width: '100%' }}
//               onPressEnter={(e) => { onKeyDowm(e) }}
//             />
//           )
//         }
//       </Form.Item>
//       <Form.Item   >
//       <div className='div-Table' style={{ display: 'flex' }}>
//           <div style={{ marginLeft: '5rem' }}>
//             <Button type="link" onClick={()=>manualAdd()}>手动新增</Button>
//           </div>
//           <div style={{ marginLeft: '1rem', flex: 1 }}>
//           <Table
//             className='Form-Table'
//             rowKey={record => record.id}
//             columns={columns}
//             dataSource={dataSource}
//             expandedRowKeys={expandedRowKey}
//             onExpand={(expanded, record)=>{
//               if(expanded){
//                 const expandedRowKeys = [...expandedRowKey,record.id]
//                 setExpandedRowKey(expandedRowKeys)
//               }else{
//                 const expandedRowKeys = expandedRowKey.filter(i=>i != record.id)
//                 //console.log(expandedRowKeys,'expandedRowKeys');
//                 setExpandedRowKey(expandedRowKeys)
//               }
//             }}
//             expandedRowRender={record => <Table
//               columns={detailColumns}
//               dataSource={record.Detail}
//               showHeader={false}
//               pagination={false}
//               rowKey={record => record.id}
//             />}
//             showHeader={false}
//             pagination={false}
//           />
//           </div>
//         </div>
//       </Form.Item>


//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeOne')}>
//         {
//           getFieldDecorator('attributeOne', {
//             rules: [
//               {
//                 required: true,
//                 message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne'),
//               },
//             ],
//             initialValue: modifyData && modifyData['attributeOne'] ? ((modifyData['attributeOne']).split(',')) : []
//           })(
//             <Select
//               placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne')}
//               showSearch
//               filterOption={false}
//               disabled={type}
//               mode="multiple"
//             >
//               {attributeOne.map((value, index) => (
//                 <Option value={value.value} key={value.id}>
//                   {value.name}
//                 </Option>
//               ))}
//             </Select>
//           )
//         }
//       </Form.Item>
//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeTwo')}>
//         {
//           getFieldDecorator('attributeTwo', {
//             rules: [
//               {
//                 required: true,
//                 message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo'),
//               },
//             ],
//             initialValue: modifyData && modifyData['attributeTwo'] ? modifyData['attributeTwo'] : undefined
//           })(
//             <Select
//               placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo')}
//               showSearch
//               filterOption={false}
//               disabled={type}
//             // mode="multiple"
//             >
//               {attributeTwos.map((value, index) => (
//                 <Option value={value.value} key={value.id}>
//                   {value.name}
//                 </Option>
//               ))}
//             </Select>
//           )
//         }
//       </Form.Item>

//       <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.dockingPoint')}>
//         {
//           getFieldDecorator('dockingPoint', {
//             rules: [
//               {
//                 required: true,
//                 message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint'),
//               },
//             ],
//             initialValue: modifyData ? modifyData['dockingPoint'] : 'J002'
//           })(
//             <Select
//               placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint')}
//               showSearch
//               filterOption={false}
//               disabled={type}
//             // mode="multiple"
//             >
//               {dockingPoints.map((value, index) => (
//                 <Option value={value.value} key={value.id}>
//                   {value.name}
//                 </Option>
//               ))}
//             </Select>
//           )
//         }
//       </Form.Item>
//       <Form.Item {...formItemLayout} label={'备注'}>
//         {
//           getFieldDecorator('desc', {
//             initialValue: modifyData ? modifyData['desc'] : undefined
//           })(
//             <Input disabled={type} placeholder={'请输入备注'} style={{ width: '100%' }} />
//           )}
//       </Form.Item>
//     </Form>

//   )
// }

export default Form.create()(TrayForm)
