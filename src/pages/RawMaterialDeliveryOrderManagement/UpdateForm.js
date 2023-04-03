import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  updateData,
}) => {

  const [materialList, setMaterialList] = useState([])

  useEffect(() => {
    // getMaterial()
  }, [])

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.orderNumber')}>
        {
          getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.orderNumber'),
              },
            ],
            initialValue: updateData ? updateData['orderNumber'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.orderNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.orderCount')}>
        {
          getFieldDecorator('orderCountr', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.orderCountr'),
              },
            ],
            initialValue: updateData ? updateData['orderCountr'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.orderCountr')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.finishNumber')}>
        {
          getFieldDecorator('finishNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.finishNumber'),
              },
            ],
            initialValue: updateData ? updateData['finishNumber'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.finishNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.surplusNumber')}>
        {
          getFieldDecorator('surplusNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.surplusNumber'),
              },
            ],
            initialValue: updateData ? updateData['surplusNumber'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.surplusNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.orderPriority')}>
        {
          getFieldDecorator('orderPriority', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.orderPriority'),
              },
            ],
            initialValue: updateData ? updateData['orderPriority'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.orderPriority')} style={{ width: '100%' }} />)
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
            initialValue: updateData ? updateData['cuttingMachine'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.cuttingMachine')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.materialCode')}>
        {
          getFieldDecorator('materialCode', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.materialCode'),
              },
            ],
            initialValue: updateData ? updateData['materialCode'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.materialCode')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.materialName')}>
        {
          getFieldDecorator('materialName', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.materialName'),
              },
            ],
            initialValue: updateData ? updateData['materialName'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.materialName')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
