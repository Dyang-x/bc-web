import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EmptyForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
}) => {
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.feedPort')}>
        {
          getFieldDecorator('feedPort', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.feedPort'),
              },
            ],
          })(
            <Select
              showSearch
              placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.feedPort')}
            >
              {feedPorts.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.cuttingMachine')}>
        {
          getFieldDecorator('cuttingMachine', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.cuttingMachine'),
              },
            ],
          })(
            <Select
              showSearch
              placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.cuttingMachine')}
            >
              {cuttingMachines.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
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

export default Form.create()(EmptyForm)
