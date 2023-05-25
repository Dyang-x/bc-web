import React, { useEffect } from 'react';
import { Form, Input } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';

const { getFormattedMsg } = i18n;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  useEffect(() => {

  }, [])

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('tyayNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.material')}>
        {
          getFieldDecorator('rawMaterial', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.material'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.material')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
