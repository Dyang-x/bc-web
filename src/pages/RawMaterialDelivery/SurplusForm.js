import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { emptyInMid } from '~/enum/enum';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const AddSurplusForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
}) => {

  const [materialList, setMaterialList] = useState([])

  const feedPorts = [
    { key: 1, name: '上料口', value: '上料口', },
    { key: 2, name: '下料口', value: '下料口', }
  ]

  const cuttingMachines = [
    { key: 1, name: '切割机1', value: '切割机1', },
    { key: 2, name: '切割机2', value: '切割机2', }
  ]

  useEffect(() => {
    // getMaterial()
  }, [])

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.cuttingMachine')}>
        {
          getFieldDecorator('cuttingMachine', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.cuttingMachine'),
              },
            ],
            initialValue: modifyData ? modifyData['cuttingMachine'] : ''
          })(
            <Input disabled placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.cuttingMachine')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料名称'}>
        {
          getFieldDecorator('materialName', {
            rules: [
              {
                required: true,
                message: '请输入材料名称',
              },
            ],
            initialValue: modifyData ? modifyData['materialName'] : ''
          })(
            <Input placeholder={'请输入材料名称'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料编码'}>
        {
          getFieldDecorator('materialCode', {
            rules: [
              {
                required: true,
                message: '请输入材料编码',
              },
            ],
            initialValue: modifyData ? modifyData['materialCode'] : ''
          })(
            <Input placeholder={'请输入材料编码'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料大小 X'}>
        {
          getFieldDecorator('materialSizeX', {
            rules: [
              {
                required: true,
                message: '请输入材料大小 X',
              },
            ],
            initialValue: modifyData ? modifyData['materialSizeX'] : ''
          })(
            <Input placeholder={'请输入材料大小 X'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料大小 Y'}>
        {
          getFieldDecorator('materialSizeY', {
            rules: [
              {
                required: true,
                message: '请输入材料大小 Y',
              },
            ],
            initialValue: modifyData ? modifyData['materialSizeY'] : ''
          })(
            <Input placeholder={'请输入材料大小 Y'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料规格'}>
        {
          getFieldDecorator('materialSpecs', {
            rules: [
              {
                required: true,
                message: '请输入材料规格',
              },
            ],
            initialValue: modifyData ? modifyData['materialSpecs'] : ''
          })(
            <Input placeholder={'请输入材料规格'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料厚度'}>
        {
          getFieldDecorator('materialThickness', {
            rules: [
              {
                required: true,
                message: '请输入材料厚度',
              },
            ],
            initialValue: modifyData ? modifyData['materialThickness'] : ''
          })(
            <Input placeholder={'请输入材料厚度'} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.count')}>
        {
          getFieldDecorator('quantity', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.count'),
              },
            ],
            initialValue: modifyData ? modifyData['remainRuns'] : ''
          })(
            <Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.count')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'起点'}>
        {
          getFieldDecorator('fromLocation', {
            rules: [
              {
                required: true,
                message: '请选择起点',
              },
            ],
          })(<Input placeholder={'请选择起点'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'中间点'}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请选择中间点',
              },
            ],
          })(
            <Select
              placeholder={'请选择中间点'}
              showSearch
              filterOption={false}
            >
              {
                emptyInMid.length && emptyInMid.map(item => {
                  return (<Option key={item.id} value={item.value}>{item.value}</Option>)
                })
              }
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.trayNumber'),
              },
            ],
          })(
            <Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.trayNumber')} />
          )
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddSurplusForm)
