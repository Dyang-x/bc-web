import React, { useEffect } from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { emptyInMid, taskType } from '~/enum/enum';

const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PullOffForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  return (
    <Form >
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
      <Form.Item {...formItemLayout} label={'终点'}>
        {
          getFieldDecorator('destination', {
            rules: [
              {
                required: true,
                message: '请选择终点',
              },
            ],
          })(<Input placeholder={'请选择终点'} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(PullOffForm)
