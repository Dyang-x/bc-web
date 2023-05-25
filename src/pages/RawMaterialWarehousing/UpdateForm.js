import React, { useState, useEffect, useRef } from 'react';
import { Form, Input } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';

const { getFormattedMsg } = i18n;
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

  }, [])

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.receiptNumber')}>
        {
          getFieldDecorator('receiptNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.receiptNumber'),
              },
            ],
            initialValue: updateData ? updateData['receiptNumber'] : ''
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.receiptNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.lineNumber')}>
        {
          getFieldDecorator('lineNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.lineNumber'),
              },
            ],
            initialValue: updateData ? updateData['lineNumber'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.lineNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.createTime')}>
        {
          getFieldDecorator('createTime', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.createTime'),
              },
            ],
            initialValue: updateData ?moment(updateData['createTime'])  : ''

          })(<DatePicker placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.createTime')} style={{ width: '100%' }} format={"YYYY-MM-DD"}/>)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.creator')}>
        {
          getFieldDecorator('creator', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.creator'),
              },
            ],
            initialValue: updateData ? updateData['creator'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.creator')} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.associatedNumber')}>
        {
          getFieldDecorator('associatedNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.associatedNumber'),
              },
            ],
            initialValue: updateData ? updateData['associatedNumber'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.associatedNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.number')}>
        {
          getFieldDecorator('number', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.number'),
              },
            ],
            initialValue: updateData ? updateData['number'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.number')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.materialCode')}>
        {
          getFieldDecorator('materialCode', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.materialCode'),
              },
            ],
            initialValue: updateData ? updateData['materialCode'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.materialCode')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.materialName')}>
        {
          getFieldDecorator('materialName', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.materialName'),
              },
            ],
            initialValue: updateData ? updateData['materialName'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.materialName')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber'),
              },
            ],
            initialValue: updateData ? updateData['trayNumber'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.specifications')}>
        {
          getFieldDecorator('specifications', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.specifications'),
              },
            ],
            initialValue: updateData ? updateData['specifications'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.specifications')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.actualWeight')}>
        {
          getFieldDecorator('actualWeight', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.actualWeight'),
              },
            ],
            initialValue: updateData ? updateData['actualWeight'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.actualWeight')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.actualNumber')}>
        {
          getFieldDecorator('actualNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.actualNumber'),
              },
            ],
            initialValue: updateData ? updateData['actualNumber'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.actualNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.realityMaterialCode')}>
        {
          getFieldDecorator('realityMaterialCode', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.realityMaterialCode'),
              },
            ],
            initialValue: updateData ? updateData['realityMaterialCode'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.realityMaterialCode')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.title.realityMaterialName')}>
        {
          getFieldDecorator('realityMaterialName', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.realityMaterialName'),
              },
            ],
            initialValue: updateData ? updateData['realityMaterialName'] : ''

          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.realityMaterialName')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
