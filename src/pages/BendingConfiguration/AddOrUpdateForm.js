import React from 'react';
import { Form, Input, Select, Radio } from '@hvisions/h-ui'
import { i18n } from '@hvisions/core';
import { attributeOne,prepareAreas } from '~/enum/enum';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AddOrUpdateForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
}) => {

  return (
    <Form >
       <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.bendingNumber')}>
        {
          getFieldDecorator('bendingNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('BendingMachineConfiguration.message.bendingNumber'),
              },
            ],
            initialValue: modifyData?modifyData['bendingNumber'] : ''
          })(
            <Input placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.bendingNumber')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.bendingName')}>
        {
          getFieldDecorator('bendingName', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('BendingMachineConfiguration.message.bendingName'),
              },
            ],
            initialValue: modifyData?modifyData['bendingName'] : ''
          })(
            <Input placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.bendingName')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.ifout')}>
      {/* <Form.Item {...formItemLayout} label={'允许切割未完成出库'}> */}
        {
          getFieldDecorator('ifout', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('BendingMachineConfiguration.message.ifout'),
              },
            ],
            initialValue: modifyData?modifyData['ifout'] : ''
          })(
            <Radio.Group>
            <Radio value="true">是</Radio>
            <Radio value="false">否</Radio>
          </Radio.Group>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.warhouseTime')}>
        {
          getFieldDecorator('warhouseTime', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('BendingMachineConfiguration.message.warhouseTime'),
              },
            ],
            initialValue: modifyData?modifyData['warhouseTime'] : ''
          })(
            <Input placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.warhouseTime')} />
          )
        }
      </Form.Item>
     <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.attribute')}>
        {
          getFieldDecorator('attribute', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('BendingMachineConfiguration.message.attribute'),
              },
            ],
            // initialValue: modifyData&&modifyData['attribute'] ? parseInt(modifyData['attribute']) : []
            initialValue: modifyData&&modifyData['attribute'] ? ((modifyData['attribute']).split(',')) : []
          })(
            <Select
            placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.attribute')}
            showSearch
            filterOption={false}
            // disabled={type}
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('BendingMachineConfiguration.label.readyMaterials')}>
        {
          getFieldDecorator('readyMaterials', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('BendingMachineConfiguration.message.readyMaterials'),
              },
            ],
            initialValue: modifyData?modifyData['readyMaterials'] : ''
          })(
            <Select
            placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.readyMaterials')}
            showSearch
            filterOption={false}
          >
            {prepareAreas.map((value, index) => (
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

export default Form.create()(AddOrUpdateForm)
