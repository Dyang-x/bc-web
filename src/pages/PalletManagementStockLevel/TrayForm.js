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
  type,
}) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([])

  useEffect(() => {
    getTransfer()
  }, [])

  const getTransfer = async (searchValue) => {
    await TransferBoxServices.getPage({ ...searchValue, page: pageInfo.page - 1, pageSize: pageInfo.pageSize })
      .then(res => {
        setTransferList(res.content);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  return (
    <Form >
      {type && <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementStockLevel.label.transferCode')}>
        {
          getFieldDecorator('transferId', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagementStockLevel.placeholder.transferCode'),
              },
            ],
            initialValue: modifyData ? modifyData['transferCode'] : undefined
          })(
            <Select
              placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.transferCode')}
              onSearch={() => getTransfer()}
              showSearch
              filterOption={false}
              disabled={type}
            >
              {transferList.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.code} -- {value.name}
                </Option>
              ))}
            </Select>
          )}
      </Form.Item>}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementStockLevel.label.areaCode')}>
        {
          getFieldDecorator('areaCode', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagementStockLevel.placeholder.areaCode'),
              },
            ],
            initialValue: modifyData ? modifyData['areaCode'] : ''
          })(<Input disabled={type} placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.areaCode')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {type && <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementStockLevel.label.automaticState')}>
        {
          getFieldDecorator('automaticState', {
            valuePropName: 'checked',
            initialValue: modifyData ? modifyData['automaticState'] : true
          })(
          <Checkbox key="checkbox1" placeholder={getFormattedMsg('PalletManagementStockLevel.message.automaticState')}>{getFormattedMsg('PalletManagementStockLevel.label.automatic')}</Checkbox>
          )
        }
      </Form.Item>}
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementStockLevel.label.equipmentName')}>
        {
          getFieldDecorator('equipmentName', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagementStockLevel.placeholder.equipmentName'),
              },
            ],
            initialValue: modifyData ? modifyData['equipmentName'] : ''
          })(<Input placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.equipmentName')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementStockLevel.label.joinArea')}>
        {
          getFieldDecorator('joinArea', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagementStockLevel.placeholder.joinArea'),
              },
            ],
            initialValue: modifyData ? modifyData['joinArea'] : ''
          })(<Input placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.joinArea')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
