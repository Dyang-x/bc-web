import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  dockingPoints,
  sortPositions,
}) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([])
  
  useEffect(() => {
    console.log(modifyData, 'modifyData');
    getTransfer()
  }, [])

  const getTransfer = async (searchValue) => {
    const params = {
      code:searchValue,
      page: pageInfo.page - 1,
      pageSize: pageInfo.pageSize
    }
    await TransferBoxServices.getPage(params)
      .then(res => {
        setTransferList(res.content);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  const CheckboxChange = async (e) => {
    const automaticState = e.target.checked

  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SurplusInStorage.placeholder.trayNumber'),
              },
            ],
            initialValue: modifyData ? modifyData['trayNumber'] : undefined
          })(
            <Input placeholder={getFormattedMsg('SurplusInStorage.placeholder.orderNumber')} style={{ width: '100%' }} />
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.orderNumber')}>
        {
          getFieldDecorator('orderNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SurplusInStorage.placeholder.orderNumber'),
              },
            ],
            initialValue: modifyData ? modifyData['orderNumber'] : ''
          })(<Input placeholder={getFormattedMsg('SurplusInStorage.placeholder.orderNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.attributeThree')}>
        {
          getFieldDecorator('attributeThree', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('SurplusInStorage.placeholder.attributeThree'),
              },
            ],
            initialValue: modifyData&&modifyData['attributeThree'] ? parseInt(modifyData['attributeThree']) : '余料'
          })(<Input disabled={true}  placeholder={getFormattedMsg('SurplusInStorage.placeholder.attributeThree')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.sortPosition')}>
        {
          getFieldDecorator('sortPosition', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('SurplusInStorage.placeholder.sortPosition'),
              },
            ],
            initialValue: modifyData ? parseInt(modifyData['sortPosition']) : undefined
          })(
            <Select
            placeholder={getFormattedMsg('SurplusInStorage.placeholder.sortPosition')}
            showSearch
            filterOption={false}
            // mode="multiple"
          >
            {sortPositions.map((value, index) => (
              <Option value={value.id} key={value.id}>
                {value.name}
              </Option>
            ))}
          </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.dockingPoint')}>
        {
          getFieldDecorator('dockingPoint', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('SurplusInStorage.placeholder.dockingPoint'),
              },
            ],
            initialValue: modifyData ? parseInt(modifyData['dockingPoint'])  : undefined
          })(
            <Select
            placeholder={getFormattedMsg('SurplusInStorage.placeholder.dockingPoint')}
            showSearch
            filterOption={false}
            // mode="multiple"
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

export default Form.create()(TrayForm)
