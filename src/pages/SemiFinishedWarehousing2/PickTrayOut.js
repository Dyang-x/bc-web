import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { isEmpty } from 'lodash';
// import { dockingPoints,sortPositions } from '~/enum/semiFinished';
import { dockingPoints,sortPositions } from '~/enum/enum';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const middles=[
  { id: 1, name: 'J002', value: 'J002', },
  { id: 2, name: 'J003', value: 'J003', },
]


const toLocations = [
  { id: 1, name: 'J007', value: 'J007', },
  { id: 2, name: 'J008', value: 'J008', },
  { id: 3, name: 'J009', value: 'J009', },
]

const PickTrayOutForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  selectedDatas
}) => {


  useEffect(() => {

  }, [])

  return (
    <Form >
        {/* <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}>
          {
            getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber'),
                },
              ],
              initialValue: selectedDatas[0].code
            })(
              <Input disabled={true} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
            )}
        </Form.Item> */}
      <Form.Item {...formItemLayout} label={"中间点"}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请选择中间点',
              },
            ],
            initialValue: 'J002'
          })(
            <Select
              placeholder={'请选择中间点'}
              showSearch
              filterOption={false}
            >
              {middles.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'目的地'}>
        {
          getFieldDecorator('toLocation', {
            rules: [
              {
                required: true,
                message: '请选择目的地',
              },
            ],
            initialValue: undefined
          })(
            <Select
              placeholder={'请选择目的地'}
              showSearch
              filterOption={false}
            >
              {toLocations.map((value, index) => (
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

export default Form.create()(PickTrayOutForm)
