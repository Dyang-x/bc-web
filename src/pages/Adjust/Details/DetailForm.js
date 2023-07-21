import React, { PureComponent ,useEffect} from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Cascader, InputNumber, Select, Spin } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import { v1 } from 'uuid';

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

class EquipmentClassForm extends PureComponent {

  render() {
    const {
      formData,
      form: { getFieldDecorator },
      locationTree
    } = this.props;

    return (
      <Form className="uom-scss">
        {!formData.id && (
          <FormItem {...formItemLayout} label="库位">
            {getFieldDecorator('locationId', {
              initialValue: formData.locationId || [],
              rules: [{ required: true, message: '请选择库位' }]
            })(
              <Cascader
                fieldNames={{ label: 'name', value: 'id' }}
                changeOnSelect
                options={locationTree}
                placeholder="请选择库位"
              />
            )}
          </FormItem>
        )}
        {formData.id && (
          <FormItem {...formItemLayout} label="库位">
            <Input disabled style={{ border: 'none' }} value={formData.locationName} />
          </FormItem>
        )}
        {/* <FormItem {...formItemLayout} label="物料批次">
          {getFieldDecorator('materialBatchNum', {
            // initialValue: formData.materialBatchNum || '',
            initialValue: formData.materialBatchNum || v1(),
            rules: [
              {
                required: true,
                message: '请输入物料批次'
              }
            ]
          })(<Input placeholder="请输入物料批次" />)}
        </FormItem> */}
        <FormItem {...formItemLayout} label="物料">
          {getFieldDecorator('materialId', {
            initialValue: formData.materialId || undefined,
            rules: [{ required: true, message: '请选择物料' }]
          })(
            <Select
              allowClear
              placeholder={getFormattedMsg('stock.validate.placeholderForMaterial')}
              showSearch
              onSearch={this.props.materialSearch}
              notFoundContent={this.props.fetching ? <Spin size="small" /> : null}
              filterOption={false}
              style={{ width: '100%' }}
            >
              {this.props.materialList.map(d => (
                <Select.Option key={d.value} value={d.value}>
                  {d.showValue}
                </Select.Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="增减数量">
          {getFieldDecorator('quantity', {
            initialValue: formData.quantity || null,
            rules: [
              {
                required: true,
                message: '请输入增减数量'
              }
            ]
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入增减数量" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="原因">
          {getFieldDecorator('description', {
            initialValue: formData.description || ''
          })(<Input.TextArea placeholder="请填写原因" />)}
        </FormItem>
      </Form>
    );
  }
}

EquipmentClassForm.propTypes = {
  formData: PropTypes.object,
  form: PropTypes.object
};

export default Form.create()(EquipmentClassForm);
