import React, { useEffect } from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import { emptyInMid } from '~/enum/enum';
import { isEmpty } from 'lodash';


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

  const taskType = [
    { id: 6, name: '原料托盘出库', value: '原料托盘出库', },
    { id: 8, name: '半成品托盘出库', value: '半成品托盘出库', },
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

      {/* <Form.Item {...formItemLayout} label={'中间点'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletDelivery.title.middle')}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                // message: '请选择中间点',
                message: getFormattedMsg('EmptyPalletDelivery.message.middle'),
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['middle'] : ''
          })(
            <Select
              // placeholder={'请选择中间点'}
              placeholder={getFormattedMsg('EmptyPalletDelivery.message.middle')}
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletDelivery.title.toLocation')}>
        {
          getFieldDecorator('toLocation', {
            rules: [
              {
                required: true,
                // message: '请选择终点',
                message: getFormattedMsg('EmptyPalletDelivery.message.toLocation'),
              },
            ],
            initialValue: addOrUpdateData ? addOrUpdateData['toLocation'] : ''
          // })(<Input placeholder={'请选择终点'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('EmptyPalletDelivery.message.toLocation')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'出库类型'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('EmptyPalletDelivery.title.inType')}>
        {
          getFieldDecorator('inType', {
            rules: [
              {
                required: true,
                // message: '请选择出库类型',
                message: getFormattedMsg('EmptyPalletDelivery.message.inType'),
              },
            ],
            initialValue: !isEmpty(addOrUpdateData) ? Number(addOrUpdateData['inType']) : undefined
          })(
            <Select
              // placeholder={'请选择出库类型'}
              placeholder={getFormattedMsg('EmptyPalletDelivery.message.inType')}
              showSearch
              filterOption={false}
            >
              {
                taskType.length && taskType.map(item => {
                  return (<Option key={item.id} value={item.id}>{item.value}</Option>)
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
