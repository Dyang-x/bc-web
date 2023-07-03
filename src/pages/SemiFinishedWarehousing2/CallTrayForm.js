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

const CallTrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  inMaterialList,
  treeData,
  selectedDatas
}) => {


  useEffect(() => {

  }, [])

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
            initialValue: modifyData ? modifyData['sortPosition'] : 'J002'
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition')}
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.dockingPoint')}>
        {
          getFieldDecorator('dockingPoint', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint'),
              },
            ],
            initialValue: modifyData ? modifyData['dockingPoint'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint')}
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

export default Form.create()(CallTrayForm)
