import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, notification, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import RawMaterialWarehousingReceiptApi from '~/api/RawMaterialWarehousingReceipt';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ManualTable = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  setManualData,
}) => {

  const [materialList, setMaterialList] = useState([])

  useEffect(() => {
    getMaterial()
  }, [])

  const getMaterial = async (keyWord = '') => {
    const params = {
      keyWord,
      pageSize: 20,
      page: 0,
      materialType: '3'
    }
    await RawMaterialWarehousingReceiptApi.getMaterialByNameOrCode(params)
      .then(res => {

        const data = res.content
        data.map(item => {
          const extend = item.extend
          item.length = 'length' in extend ? extend.length : '   ',
            item.width = 'width' in extend ? extend.width : '   ',
            item.thickness = 'thickness' in extend ? extend.thickness : '   ',
            item.thickness = 'materialType' in extend ? extend.materialType : '   '
        })


        //console.log(data, 'materialList');

        setMaterialList(data)
      }).catch(err => {
        notification.warning({
          description: err.message
        });
      })

  }

  const handleChangeMaterial = (e) => {
    // setTimeout(() => {
    getMaterial(e)
    // }, 500)
  }

  const onMaterialChange = async (value) => {
    const materialInfo = materialList.filter(i => i.id == value)
    setManualData(materialInfo[0])
  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.material')}>
        {
          getFieldDecorator('materialId', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialWarehousingReceipt.message.material'),
              },
            ],
          })(
            <Select
              placeholder="请选择物料"
              onSearch={handleChangeMaterial}
              showSearch
              filterOption={false}
              onChange={onMaterialChange}
            >
              {
                materialList.length && materialList.map(item => {
                  return (<Option key={item.id} value={item.id} title={item.materialName}>{item.materialName} -- {item.materialCode} -- {item.materialType} -- {item.length} -- {item.width} -- {item.thickness}</Option>)
                })
              }
            </Select>
          )}
      </Form.Item>

      <Form.Item {...formItemLayout} label={'物料批号'}>
        {
          getFieldDecorator('batchNumber', {
            rules: [
              {
                required: true,
                message: '请输入物料批号',
              },
            ],
          })(<Input  placeholder={'请输入物料批号'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'上料口'}>
        {
          getFieldDecorator('feedingName', {
            rules: [
              {
                required: true,
                message: '请输入上料口',
              },
            ],
          })(<Input  placeholder={'请输入上料口'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'中间位置'}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请输入中间位置',
              },
            ],
          })(<Input  placeholder={'请输入中间位置'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'目标位置'}>
        {
          getFieldDecorator('toLocation', {
            rules: [
              {
                required: true,
                message: '请输入目标位置',
              },
            ],
          })(<Input  placeholder={'请输入目标位置'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'物料数量'}>
        {
          getFieldDecorator('num', {
            rules: [
              {
                required: true,
                message: '请输入物料数量',
              },
            ],
          })(<Input placeholder={'请输入物料数量'} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(ManualTable)



// import React, { useState, useEffect, useRef } from 'react';
// import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
// import moment from 'moment';
// import { tree } from '@hvisions/toolkit';
// import { i18n } from '@hvisions/toolkit';
// import { debounce } from 'lodash';

// const { formatTree } = tree;
// const { getFormattedMsg } = i18n;
// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
// const { Option } = Select
// const formItemLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 18 },
// };

// const TrayForm = ({
//   form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
//   selectedRowKeys, setSelectedRowKeys
// }) => {

//   const [materialList, setMaterialList] = useState([])
//   const [dataSource, setDataSource] = useState([]);

//   const columns = [
//     {
//       title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.trayNumber'),
//       dataIndex: 'trayNumber',
//       key: 'trayNumber',
//       align: 'center',
//     },
//     {
//       title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialCode'),
//       dataIndex: 'materialCode',
//       key: 'materialCode',
//       align: 'center',
//     },
//     {
//       title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialName'),
//       dataIndex: 'materialName',
//       key: 'materialName',
//       align: 'center',
//     },
//     {
//       title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.count'),
//       dataIndex: 'count',
//       key: 'count',
//       align: 'center',
//     },
//     {
//       title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
//       key: 'opt',
//       align: 'center',
//       render: (_, record) => [
//         <a key="takeOff" onClick={() => handleTakeOff(record)}>
//           {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.takeOff')}
//         </a>
//       ],
//       // width: 80,
//       // fixed: 'right'
//     }
//   ]

//   useEffect(() => {
//     // getMaterial()
//   }, [])

//   const handleTakeOff = () => {

//   }

//   // const rowSelection = {
//   //   hideDefaultSelections: false,
//   //   type: 'radio',
//   //   onSelect: (record, selected, selectedRows, nativeEvent) => {

//   //   },
//   //   selectedRowKeys,
//   //   onChange: selectedRowKeys => {
//   //     setSelectedRowKeys(selectedRowKeys);
//   //   }
//   // };

//   // const onRowClick = record => {
//   //   setSelectedRowKeys([record.id]);
//   // };

//   return (
//     <Table
//       pagination={false}
//       scroll={{ x: 'max-content' }}
//       dataSource={dataSource}
//       columns={columns}
//       rowKey={record => record.id}
//     // rowSelection={rowSelection}
//     // onRow={record => {
//     //   return {
//     //     onClick: () => {
//     //       onRowClick(record);
//     //     }
//     //   };
//     // }}
//     />
//   )
// }

// export default Form.create()(TrayForm)
