import React from 'react';
import {Form, Select} from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import { prepareAreas,dockingPoints } from '~/enum/enum';

const { Option } = Select
const getFormattedMsg = i18n.getFormattedMsg;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const OutForm = ({
  form: { getFieldDecorator},
  modifyData,
}) => {

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.prepareArea')}>
        {
          getFieldDecorator('prepareArea', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.prepareArea'),
              },
            ],
            initialValue: modifyData ? modifyData['prepareArea'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.prepareArea')}
              showSearch
              filterOption={false}
            >
              {prepareAreas.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.dockingPoint')}>
        {
          getFieldDecorator('dockingPoint', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.dockingPoint'),
              },
            ],
            initialValue: modifyData ? modifyData['dockingPoint'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.dockingPoint')}
              showSearch
              filterOption={false}
            >
              {dockingPoints.map((value, index) => (
                <Option value={value.id} key={value.id}>
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

export default Form.create()(OutForm)
