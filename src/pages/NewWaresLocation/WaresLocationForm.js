import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input, Switch, InputNumber
} from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import { i18n } from '@hvisions/toolkit';
const getFormattedMsg = i18n.getFormattedMsg;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

class DetailForm extends PureComponent {
  render() {
    const { formData, isLocation, form: { getFieldDecorator } } = this.props;
    return (
      <Form>
        {/* <FormItem {...formItemLayout} label={'仓位编码'}> */}
        <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.code')}>
          {getFieldDecorator('code', {
            initialValue: formData.code || '',
            // rules: [{ required: true, message:  '请输入仓位编码' }]
            rules: [{ required: true, message:  getFormattedMsg('newWaresLocation.message.code') }]
          })(
            // <Input disabled={formData.id} placeholder={'请输入仓位编码'} />
            <Input disabled={formData.id} placeholder={getFormattedMsg('newWaresLocation.message.code')} />
          )}
        </FormItem>
        {/* <FormItem {...formItemLayout} label={'仓位名称'}> */}
        <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.name')}>
          {getFieldDecorator('name', {
            initialValue: formData.name || '',
            // rules: [{ required: true, message: '请输入仓位名称' }]
            rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.name') }]
          })(
            // <Input placeholder={'请输入仓位名称'} />
            <Input placeholder={getFormattedMsg('newWaresLocation.message.name')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.maxCount')}>
          {getFieldDecorator('maxCount', {
            initialValue: formData.maxCount|| '',
          })(
            <InputNumber min={0} placeholder={getFormattedMsg('waresLocation.validate.placeholderForMaxCounts')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={getFormattedMsg('supplier.label.description')}>
          {getFieldDecorator('description', {
            initialValue: formData.description || '',
          })(
            <Input.TextArea placeholder={getFormattedMsg('supplier.validate.placeholderForDescription')} />
          )}
        </FormItem>
      </Form>
    );
  }
}

DetailForm.propTypes = {
  formData: PropTypes.object,
  form: PropTypes.object
};

export default Form.create()(DetailForm);
