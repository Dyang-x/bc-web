import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/core';
import waresLocationServices from '~/api/waresLocation';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AdjustForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  formData,
}) => {

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskTransport.label.taskCode')}>
        <Input disabled={true} value={formData.taskCode} />
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskTransport.label.priorityOld')}>
        <Input disabled={true} value={formData.priority} />
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskTransport.label.priority')}>
        {getFieldDecorator('priority', {
          rules: [
            {
              required: true,
              message: getFormattedMsg('TaskTransport.message.priority')
            }
          ]
        })(
          <Input
            placeholder={getFormattedMsg('TaskTransport.placeholder.priority')}
          />
        )}
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AdjustForm)
