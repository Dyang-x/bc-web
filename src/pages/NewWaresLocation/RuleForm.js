import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Select, Input } from '@hvisions/h-ui';
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
    const {
      formData,
      form: { getFieldDecorator },
      materialList
    } = this.props;
    return (
      <Form>
        <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.material')}>
          {getFieldDecorator('materialId', {
            initialValue: formData.materialId || undefined,
            rules: [
              {
                required: true,
                message: getFormattedMsg('waresLocation.validate.placeholderForMaterial')
              }
            ]
          })(
            <Select
              showSearch
              optionFilterProp="children"
              placeholder={getFormattedMsg('waresLocation.validate.placeholderForMaterial')}
            >
              {materialList &&
                materialList.map(i => (
                  <Select.Option key={i.id} value={i.id}>
                    {i.materialName}
                  </Select.Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.storeMin')}>
          {getFieldDecorator('storeMin', {
            initialValue: formData.storeMin || undefined
          })(
            <InputNumber style={{ width: '100%' }} min={0} placeholder={getFormattedMsg('waresLocation.validate.placeholderForStoreMin')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.storeMax')}>
          {getFieldDecorator('storeMax', {
            initialValue: formData.storeMax || undefined
          })(
            <InputNumber style={{ width: '100%' }} min={0} placeholder={getFormattedMsg('waresLocation.validate.placeholderForStoreMax')} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.remark')}>
          {getFieldDecorator('remark', {
            initialValue: formData.remark || undefined
          })(
            <Input.TextArea style={{ width: '100%' }} placeholder={getFormattedMsg('waresLocation.validate.placeholderForRemark')} />
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
