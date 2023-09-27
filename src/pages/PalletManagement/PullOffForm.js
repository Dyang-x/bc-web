import React, { useEffect } from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { emptyInMid, taskType } from '~/enum/enum';
import { i18n } from '@hvisions/core';

const { Option } = Select
const { getFormattedMsg } = i18n;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PullOffForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  return (
    <Form >
      {/* <Form.Item {...formItemLayout} label={'中间点'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.title.middle')}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                // message: '请选择中间点',
                message: getFormattedMsg('PalletManagement.placeholder.middle'),
              },
            ],
          })(
            <Select
              // placeholder={'请选择中间点'}
              placeholder={getFormattedMsg('PalletManagement.placeholder.middle')}
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
      {/* <Form.Item {...formItemLayout} label={'终点'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.title.destination')}>
        {
          getFieldDecorator('destination', {
            rules: [
              {
                required: true,
                // message: '请输入终点',
                message: getFormattedMsg('PalletManagement.placeholder.destination'),
              },
            ],
          // })(<Input placeholder={'请输入终点'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('PalletManagement.placeholder.destination')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(PullOffForm)
