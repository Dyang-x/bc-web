import React, { useState, useEffect } from 'react';
import {notification, Form, Select } from '@hvisions/h-ui'
import { i18n } from '@hvisions/core';
import waresLocationServices from '~/api/waresLocation';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const SelectForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  const [locationList, setLocationList] = useState([])

  useEffect(() => {
    handleSearchLocation()
  }, [])

  const handleSearchLocation = async (param) => {
    const params = {
      code: param,
      pageSize: 10,
      page: 0
    }
    await waresLocationServices.getLocationByQuery(params).then(res => {
      setLocationList(res.content)
    }).catch(err => {
      notification.warning({
        description: err.message
      });
    })
  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.locationNumber')}>
        {
          getFieldDecorator('locationId', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.location'),
              },
            ],
          })(
            <Select
              placeholder={getFormattedMsg('PalletManagement.placeholder.location')}
              onSearch={handleSearchLocation}
              showSearch
              filterOption={false}
            >
              {locationList.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.code} -- {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(SelectForm)
