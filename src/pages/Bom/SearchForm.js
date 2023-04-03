/*
 * @Author: Andy
 * @Date: 2019-08-19 09:45:29
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-30 17:52:48
 */
import React from 'react';
import { Form, Row, Col, Button, Select, Input } from '@hvisions/h-ui';
import { i18n, withPermission } from '@hvisions/core';
const getFormattedMsg = i18n.getFormattedMsg;
const FormItem = Form.SearchItem;
const { Option } = Select;
const SearchForm = ({ form: { getFieldDecorator, getFieldsValue }, onSearch }) => {
  return (
    <Form style={{ whiteSpace: 'nowrap' }}>
      <FormItem label={getFormattedMsg('bom.label.bomCode')}>
        {getFieldDecorator('bomCode')(
          <Input allowClear placeholder={getFormattedMsg('bom.validate.placeholderForCode')} />
        )}
      </FormItem>

      <FormItem label={getFormattedMsg('bom.label.name')}>
        {getFieldDecorator('bomName')(
          <Input allowClear placeholder={getFormattedMsg('bom.validate.placeholderForName')} />
        )}
      </FormItem>

      <FormItem label={getFormattedMsg('bom.label.version')}>
        {getFieldDecorator('bomVersions')(
          <Input allowClear placeholder={getFormattedMsg('bom.validate.placeholderForVersion1')} />
        )}
      </FormItem>

      <FormItem label={getFormattedMsg('bom.label.type')}>
        {getFieldDecorator('bomStatus', {})(
          <Select allowClear placeholder={getFormattedMsg('bom.validate.placeholderForType')}>
            <Option key={0} value={0}>
              {getFormattedMsg('bom.type.new')}
            </Option>
            <Option key={1} value={1}>
              {getFormattedMsg('bom.type.tack_effect')}
            </Option>
            <Option key={2} value={2}>
              {getFormattedMsg('bom.type.pigeonhole')}
            </Option>
          </Select>
        )}
      </FormItem>

      <FormItem>
        <Button icon="search" type="primary" onClick={() => onSearch(getFieldsValue())}>
          {getFormattedMsg('global.btn.search')}
        </Button>
      </FormItem>
    </Form>
  );
};

export default Form.create()(SearchForm);
