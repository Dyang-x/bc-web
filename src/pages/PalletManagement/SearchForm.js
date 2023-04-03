import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import {
  Form, Button, Select,DatePicker,Input
} from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import MaterialService from '~/api/material';
import WaresLocationService from '~/api/waresLocation';

const FormItem = Form.SearchItem;
const { Option } = Select;

const SearchForm = ({ 
  form: { getFieldsValue, getFieldDecorator, setFieldsValue }, 
  onSearch ,
  onHandleSearch,
  disabled,
  specs,
  date,
}) => {
  const dateTime = 'YYYY-MM-DD';
  const getFormattedMsg = i18n.getFormattedMsg;
  return (

    <Form >
      <FormItem label={getFormattedMsg('PalletManagement.label.code')} styles={{marginBottom:'10'}}>
        {getFieldDecorator('code')(
          <Input
          placeholder={getFormattedMsg('PalletManagement.message.code')}
          allowClear
            style={{ width: '100%' }}
            disabled={disabled}
          />
        )}
      </FormItem>
      <FormItem style={{margin:'auto'}}>
        <Button type="primary" icon="search" onClick={onHandleSearch}>查询</Button>
      </FormItem>
    </Form>
  );
}

export default Form.create()(SearchForm);
