import React,{useEffect,useState} from 'react';
import {Form, Select,Input} from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import { dockingPoints } from '~/enum/enum';
import bendingMachineServices from '~/api/bendingMachine';
import { isEmpty } from 'lodash';

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

  useEffect(() => {
  }, []);

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.prepareArea')}>
        {
          getFieldDecorator('readyMaterials', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.prepareArea'),
              },
            ],
            initialValue: modifyData.readyMaterials
          })(
            <Input placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.prepareArea')} style={{ width: '100%' }} />
            // <Select
            //   placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.prepareArea')}
            //   showSearch
            //   filterOption={false}
            // >
            //   {readyMaterials.map((value, index) => (
            //     <Option value={value} key={value}>
            //       {value}
            //     </Option>
            //   ))}
            // </Select>
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
            initialValue: 'J003'
          })(
            <Select
              placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.dockingPoint')}
              showSearch
              filterOption={false}
            >
              {dockingPoints.map((value, index) => (
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

export default Form.create()(OutForm)
