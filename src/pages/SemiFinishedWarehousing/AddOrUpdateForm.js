import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';
import {  dockingPoints,sortPositions } from '~/enum/enum';


const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

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
            initialValue: modifyData ? modifyData['trayNumber'] : undefined
          })(
            <Input disabled={type} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />
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
            initialValue: modifyData ? modifyData['orderNumber'] : ''
          })(<Input disabled={type} placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.orderNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeOneState')}>
        {
          getFieldDecorator('attributeoneState', {
            valuePropName: 'checked',
            initialValue: modifyData ? modifyData['attributeoneState'] : false
          })(
          <Checkbox
           key="checkbox1" 
           placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.message.attributeOneState')}
           onChange={(e)=>{setAttributeOneState(e.target.checked);}}
            >{getFormattedMsg('SemiFinishedWarehousingReceipt.label.required')}
            </Checkbox>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeOne')}>
        {
          getFieldDecorator('attributeOne', {
            rules: [
              {
                required: attributeOneState,
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeOne'),
              },
            ],
            initialValue: modifyData&&modifyData['attributeOne'] ? ((modifyData['attributeOne']).split(',')).map(Number) : []
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeTwoState')}>
        {
          getFieldDecorator('attributetwoState', {
            valuePropName: 'checked',
            initialValue: modifyData ? modifyData['attributetwoState'] : false
          })(
          <Checkbox 
          key="checkbox2" 
          placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.message.attributeTwoState')}
          onChange={(e)=>{setAttributeTwoState(e.target.checked);}}
          >{getFormattedMsg('SemiFinishedWarehousingReceipt.label.required')}
          </Checkbox>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.attributeTwo')}>
        {
          getFieldDecorator('attributeTwo', {
            rules: [
              {
                required: attributeTwoState,
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo'),
              },
            ],
            initialValue: modifyData&&modifyData['attributeTwo'] ? parseInt(modifyData['attributeTwo']) : undefined
          })(
            <Select
            placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.attributeTwo')}
            showSearch
            filterOption={false}
            disabled={type}
            // mode="multiple"
          >
            {attributeTwo.map((value, index) => (
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
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition'),
              },
            ],
            initialValue: modifyData ? parseInt(modifyData['sortPosition']) : undefined
          })(
            <Select
            placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.sortPosition')}
            showSearch
            filterOption={false}
            disabled={type}
            // mode="multiple"
          >
            {sortPositions.map((value, index) => (
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
                message:getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.dockingPoint'),
              },
            ],
            initialValue: modifyData ? parseInt(modifyData['dockingPoint'])  : undefined
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
    </Form>
  )
}

export default Form.create()(TrayForm)
