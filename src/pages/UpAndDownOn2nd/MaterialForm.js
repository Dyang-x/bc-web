/*
 * @Author: Otway
 * @Date: 2019-01-09 11:16:08
 * @LastEditors: Otway
 * @LastEditTime: 2019-08-30 18:50:09
 * @copyright: h-visions
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio
} from '@hvisions/h-ui'; // 使用慧程的组件库
import { i18n } from '@hvisions/toolkit';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { getFormattedMsg } = i18n;
const { Option } = Select;
const formItemLayout = {   // 抽屉里面Form。二列的布局比例
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

class MaterialForm extends PureComponent {
  render() {
    const {
      formData,
      unitlist,
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.codeForMaterial')}>
              {getFieldDecorator('materialCode', {
                initialValue: formData.materialCode || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForCode')
                  }
                ]
              })(<Input placeholder={getFormattedMsg('material.validate.placeholderForCode')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={getFormattedMsg('material.label.eigenvalueForMaterial')}
            >
              {getFieldDecorator('eigenvalue', {
                initialValue: formData.eigenvalue || 1,
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForeigenvalue')
                  }
                ]
              })(
                <Input
                  placeholder={getFormattedMsg('material.validate.placeholderForeigenvalue')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.nameForMaterial')}>
              {getFieldDecorator('materialName', {
                initialValue: formData.materialName || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForName')
                  }
                ]
              })(<Input placeholder={getFormattedMsg('material.validate.placeholderForName')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.uomForMaterial')}>
              {getFieldDecorator('uom', {
                initialValue: formData.uom || undefined,
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForColumnUom')
                  }
                ]
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnUom')}
                >
                  {unitlist.map((value, index) => (
                    <Option value={value.id} key={value.id}>
                      {value.symbol + '/' + value.description}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.typeForMaterial')}>
              {getFieldDecorator('materialType', {
                initialValue: formData.materialType || undefined,
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForColumnType')
                  }
                ]
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnType')}
                >
                    <Option value={1} key={1}>
                      成品
                    </Option>
                    <Option value={5} key={5}>
                      半成品
                    </Option>
                    <Option value={3} key={3}>
                      原材料
                    </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={getFormattedMsg('material.label.serialNumberProfileForMaterial')}
            >
              {getFieldDecorator('serialNumberProfile', {
                initialValue: formData.serialNumberProfile || false
              })(
                <RadioGroup name="radiogroup">
                  <Radio value>{getFormattedMsg('global.judge.yes')}</Radio>
                  <Radio value={false}>{getFormattedMsg('global.judge.no')}</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.descForMaterial')}>
              {getFieldDecorator('materialDesc', {
                initialValue: formData.materialDesc || '',
                rules: [{ message: getFormattedMsg('material.validate.placeholderForDesc') }]
              })(
                <TextArea
                  rows={4}
                  placeholder={getFormattedMsg('material.validate.placeholderForDesc')}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

MaterialForm.propTypes = {
  isChinese: PropTypes.bool,
  locale: PropTypes.string,
  formData: PropTypes.object,
  form: PropTypes.object,
  columns: PropTypes.array,
  roles: PropTypes.array,
  onOk: PropTypes.func,
  onClose: PropTypes.func,
  unitlist: PropTypes.array
};

export default Form.create()(MaterialForm);
