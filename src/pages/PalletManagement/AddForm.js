import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/core';
// import { palletState } from '~/enum/pallet';
import { palletState } from '~/enum/enum';
import { isEmpty } from 'lodash';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// const states=[
//     { id: 0, name: '空闲', value: '空闲', },
//     { id: 1, name: '使用中', value: '使用中', },
// ]

// const locations=[
//   { id: 0, name: '在库', value: '在库', },
//   { id: 1, name: 'J001', value: 'J001', },
//   { id: 1, name: 'J002', value: 'J002', },
//   { id: 1, name: 'J003', value: 'J003', },
// ]
const states = [
  '空闲', '使用中',
]

const locations = [
  '在库', 'J001', 'J002', 'J003',
]

const fontSizeArr = [
  { value: 8 },
  { value: 10 },
  { value: 12 },
  { value: 13 },
  { value: 14 },
  { value: 16 },
  { value: 18 },
  { value: 20 },
  { value: 24 },
  { value: 28 },
  { value: 36 },
  { value: 48 },
  { value: 72 },
  { value: 144 },
  { value: 288 }
]

const AddForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  palletTypeList,
  updateFormData,
}) => {

const [newValue, setNewValue] = useState(locations)
const [record, setRecord] = useState('在库')

useEffect(()=>{

},[newValue,record])


  const onChangeSelect = (value) => {
    setRecord(value)
    setFieldsValue({test:value})
  }

  const onSearchSelect = (value) => {
    const isIn = isEmpty(locations.filter(i => i.includes(value)))
    if (isIn) {
      const data = [value]
      setNewValue(data)
    }
  }

  const onBlurSelect = () => {
    setNewValue(locations)
    setRecord('在库')
  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.name')}>
        {
          getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.name'),
              },
            ],
            initialValue: updateFormData ? updateFormData['name'] : ''
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.name')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.code')}>
        {
          getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.code'),
              },
            ],
            initialValue: updateFormData ? updateFormData['code'] : ''
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.code')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.type')}>
        {
          getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.type'),
              },
            ],
            initialValue: updateFormData ? updateFormData['type'] : undefined
          })(
            <Select
              showSearch
              placeholder={getFormattedMsg('PalletManagement.message.type')}
              filterOption={false}
            >
              {palletTypeList.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.weight')}>
        {
          getFieldDecorator('weight', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.weight'),
              },
            ],
            initialValue: updateFormData ? updateFormData['weight'] : ''
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.weight')} />
          )
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'托盘状态'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.title.state')}>
        {
          getFieldDecorator('state', {
            rules: [
              {
                required: true,
                // message: '请输入托盘状态',
                message: getFormattedMsg('PalletManagement.placeholder.state'),
              },
            ],
            initialValue: !isEmpty(updateFormData) ? updateFormData['state'] : '空闲'
          })(
            <Select
              // placeholder={'请输入托盘状态'}
              placeholder={ getFormattedMsg('PalletManagement.placeholder.state')}
              disabled={isEmpty(updateFormData)}
              showSearch
              filterOption={false}
            >
              {states.map((value, index) => (
                <Option value={value} key={value}>
                  {value}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'托盘位置'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.title.location')}>
        {
          getFieldDecorator('location', {
            rules: [
              {
                required: true,
                // message: '请输入托盘位置',
                message: getFormattedMsg('PalletManagement.placeholder.locationA'),
              },
            ],
            initialValue: !isEmpty(updateFormData) ? updateFormData['location'] : '在库'
          })(
            <Select
              // placeholder={'请输入托盘位置'}
              placeholder={ getFormattedMsg('PalletManagement.placeholder.locationA')}
              // disabled={isEmpty(updateFormData)}
              // showSearch
              filterOption={false}
            >
              {locations.map((value, index) => (
                <Option value={value} key={value}>
                  {value}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'1111'}>
        {
          getFieldDecorator('test', {
            rules: [
              {
                required: true,
                message: '请输入test',
              },
            ],
            initialValue: record
          })(
            <Select
            allowClear
            showSearch
            placeholder="请选择"
            onChange={(e) => onChangeSelect(e)}
            onSearch={value => onSearchSelect(value)}
            onBlur={() => onBlurSelect()}
          >
            {newValue.map((item, index, arr) => <Option key={index} value={item}>{item}</Option>)}
          </Select>
          )
        }
      </Form.Item> */}
    </Form>
  )
}

export default Form.create()(AddForm)
