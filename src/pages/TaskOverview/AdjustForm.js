import React from 'react';
import { Form, Input, Select } from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';

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
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskOverview.label.taskCode')}>
        <Input disabled={true} value={formData.taskCode} />
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskOverview.label.priorityOld')}>
        <Input disabled={true} value={formData.priority} />
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('TaskOverview.label.priority')}>
        {getFieldDecorator('priority', {
          rules: [
            {
              required: true,
              message: getFormattedMsg('TaskOverview.message.priority')
            }
          ]
        })(
          <Input
            placeholder={getFormattedMsg('TaskOverview.placeholder.priority')}
          />
        )}
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AdjustForm)
