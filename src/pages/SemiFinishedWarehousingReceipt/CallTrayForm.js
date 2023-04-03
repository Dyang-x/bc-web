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

const CallTrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  inMaterialList,
  treeData,
  selectedDatas
}) => {

  const [materialList, setMaterialList] = useState([])

  // const attribute1 = [
  //   { key: 0, name: '大', value: '大', },
  //   { key: 1, name: '中', value: '中', },
  //   { key: 2, name: '小', value: '小', }
  // ]

  // const attribute2 = [
  //   { key: 0, name: '切割完成', value: '切割完成', },
  //   { key: 1, name: '切割未完成', value: '切割未完成', },
  //   { key: 2, name: '折弯完成', value: '折弯完成', },
  //   { key: 3, name: '折弯未完成', value: '折弯未完成', }
  // ]

  // const dockingPoints = [
  //   { id: 1, name: 'J002', value: 'J002', },
  //   { id: 2, name: 'J003', value: 'J003', },
  // ]

  // const sortPositions = [
  //   { id: 1, name: 'J004', value: 'J004', },
  //   { id: 2, name: 'J005', value: 'J005', },
  //   { id: 3, name: 'J006', value: 'J006', },
  //   { id: 4, name: 'J007', value: 'J007', },
  //   { id: 5, name: 'J008', value: 'J008', },
  //   { id: 6, name: 'J009', value: 'J009', },
  // ]

  useEffect(() => {
    // getMaterial()
  }, [])

  return (
    <Form >
      {!isEmpty(selectedDatas) &&
        <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}>
          {
            getFieldDecorator('trayNumber', {
              rules: [
                {
                  required: true,
                  message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber'),
                },
              ],
              initialValue: selectedDatas[0].trayNumber
            })(
              <Input disabled={true} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
            )}
        </Form.Item>}
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
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition')}
              showSearch
              filterOption={false}
            >
              {sortPositions.map((value, index) => (
                <Option value={value.id} key={value.id}>
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
              {dockingPoints.map((value, index) => (
                <Option value={value.id} key={value.id}>
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
