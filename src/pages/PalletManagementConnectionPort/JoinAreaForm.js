import React, { useState, useEffect } from 'react';
import { notification, Form, Input } from '@hvisions/h-ui'
import { i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';

const { getFormattedMsg } = i18n;
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

const JoinAreaForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
}) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([])

  useEffect(() => {
    console.log(modifyData, 'modifyData');
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
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagementConnectionPort.label.portNumber')}>
        {
          getFieldDecorator('joinCode', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagementConnectionPort.message.portNumber'),
              },
            ],
            initialValue: modifyData ? modifyData['joinCode'] : ''
          })(<Input placeholder={getFormattedMsg('PalletManagementConnectionPort.placeholder.portNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(JoinAreaForm)
