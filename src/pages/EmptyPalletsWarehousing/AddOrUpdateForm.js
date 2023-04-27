import React from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import { emptyInMid } from '~/enum/enum';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  addOrUpdateData,
}) => {

  const state = [
    { id: 0, value: '新建' },
    { id: 1, value: '下发中' },
    { id: 2, value: '已完成' },
  ]

  return (
    <Form >
      {/* <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletsWarehousing.title.receiptNumber')}>
        {
          getFieldDecorator('receiptNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('EmptyPalletsWarehousing.message.receiptNumber'),
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['receiptNumber'] : ''
          })(<Input placeholder={getFormattedMsg('EmptyPalletsWarehousing.message.receiptNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletsWarehousing.title.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('EmptyPalletsWarehousing.message.trayNumber'),
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['trayNumber'] : ''
          })(<Input placeholder={getFormattedMsg('EmptyPalletsWarehousing.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>

      <Form.Item {...formItemLayout} label={'起点'}>
        {
          getFieldDecorator('origin', {
            rules: [
              {
                required: true,
                message: '请选择起点',
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['origin'] : ''
          })(<Input placeholder={'请选择起点'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'中间点'}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请选择中间点',
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['middle'] : ''
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

{/* 
      <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletsWarehousing.title.state')}>
        {
          getFieldDecorator('state', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('EmptyPalletsWarehousing.message.state'),
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['state'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('EmptyPalletsWarehousing.message.state')}
              showSearch
              filterOption={false}
            >
              {
                state.length && state.map(item => {
                  return (<Option key={item.id} value={item.id}>{item.value}</Option>)
                })
              }
            </Select>
          )
        }
      </Form.Item> */}
    </Form>
  )
}

export default Form.create()(TrayForm)
