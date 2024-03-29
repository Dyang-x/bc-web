import React, { useEffect } from 'react';
import { Form, Input,notification } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import joinAreaServices from '~/api/joinArea';

const { getFormattedMsg } = i18n;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  useEffect(() => {
    sortPositionChange()
  }, [])

  const sortPositionChange = async (e) => {
    await joinAreaServices.findJoin()
      .then(res => {
        res.map(i => {
          if (i.joinCode == 'J001' && i.transferCode != null) {
            const transferCode = i.transferCode
            setFieldsValue({ trayNumber: transferCode })
          }
        })
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  }


  const onKeyDowm = (e) => {

    const dataString = e.target.value
    const arr = dataString.split('|');
    //console.log('arr', arr);

    const orderNumber = arr[0]
    const lineNumber = arr[1]
    const associatedNumber = arr[2]
    const other = arr[3]
    const materialCode = arr[4]
    const number = arr[5]
    const unit = arr[6]

    setFieldsValue({
      scan: '',
      orderNumber: orderNumber,
      lineNumber: lineNumber,
      materialCode: materialCode,
      number: number,

      associatedNumber: associatedNumber,
      unit: unit,
    })
  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.material')}>
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
      </Form.Item> */}
      {/* <Form.Item {...formItemLayout} label={'收料单扫码'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.scan')}>
        {
          getFieldDecorator('scan', {
          })(
            <Input
              // placeholder={'请扫描收料单条码'}
              placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.scan')}
              style={{ width: '100%' }}
              onPressEnter={(e) => { onKeyDowm(e) }}
            />
          )
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'采购订单号'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.orderNumber2')}>
        {
          getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                // message: '请输入采购订单号',
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.orderNumber2')
              },
            ],
          // })(<Input placeholder={'请输入采购订单号'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.orderNumber2')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'送货单行号'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.lineNumber2')}>
        {
          getFieldDecorator('lineNumber', {
            rules: [
              {
                required: true,
                // message: '请输入送货单行号',
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.lineNumber2')
              },
            ],
          // })(<Input placeholder={'请输入送货单行号'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.lineNumber2')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'物料编码'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.materialCode2')}>
        {
          getFieldDecorator('materialCode', {
            rules: [
              {
                required: true,
                // message: '请输入物料编码',
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.materialCode2')
              },
            ],
          // })(<Input placeholder={'请输入物料编码'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.materialCode2')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'数量'}> */}
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.number2')}>
        {
          getFieldDecorator('number', {
            rules: [
              {
                required: true,
                // message: '请输入数量',
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.number')
              },
            ],
          // })(<Input placeholder={'请输入数量'} style={{ width: '100%' }} />)
        })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.number')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
