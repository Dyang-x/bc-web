import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const SurplusForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  attributeOne,
  attributeTwo,
  dockingPoints,
  sortPositions,
}) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([])
  
  useEffect(() => {
    getTransfer()
  }, [])

  const getTransfer = async (searchValue) => {
    const params = {
      code:searchValue,
      page: pageInfo.page - 1,
      pageSize: pageInfo.pageSize
    }
    await TransferBoxServices.getPage(params)
      .then(res => {
        setTransferList(res.content);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  const CheckboxChange = async (e) => {
    const automaticState = e.target.checked

  }

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
            <Input placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.orderNumber')}>
        {
          getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber'),
              },
            ], 
          })(<Input  placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeOne')}>
        {
          getFieldDecorator('attributeOne', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne'),
              },
            ], 
            initialValue: modifyData ? modifyData['attributeOne'] : undefined
          })(
            <Select
            placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne')}
            showSearch
            filterOption={false}
            mode="multiple"
          >
            {attributeOne.map((value, index) => (
              <Option value={value.id} key={value.id}>
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
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition'),
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
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint'),
              },
            ],
            initialValue:'J002'
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

export default Form.create()(SurplusForm)
