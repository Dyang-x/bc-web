/*
 * @Author: Andy
 * @Date: 2019-07-08 09:12:21
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-09 12:02:03
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Form,
  Input, InputNumber,DatePicker
} from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import moment from "moment";
import { i18n } from '@hvisions/core';
const getFormattedMsg = i18n.getFormattedMsg;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

class MaterialForm extends PureComponent {

  renderExtendColumn = () => {
    const {
      columns,
      formData,
      isChinese,
      form: { getFieldDecorator },
    } = this.props;
    return columns.map((col, idx) => {
      let component;
      let initialValue;
      switch (col.columnType) {
        case 'int':
        case 'float':
        case 'decimal':
          component = (
            <InputNumber
              style={{ width: '100%' }}
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : 0;
          break;
        case 'date':
        case 'datetime':
          component = (
            <DatePicker
              showTime
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue = !isEmpty(formData) && formData.extend[col.columnName]
            ? moment(formData.extend[col.columnName])
            : undefined;
          break;
        default:
          component = (
            <Input
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : '';
      }

      return (
        <Col span={12} key={idx}>
          <FormItem {...formItemLayout} label={`${isChinese ? col.chName : col.enName}`}>
            {getFieldDecorator(`extend.${col.columnName}`, {
              initialValue
            })(component)}
          </FormItem>
        </Col>
      );
    });
  };

  render() {
    const {
      formData,
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialCode')}>
              {getFieldDecorator('materialCode', {
                initialValue: formData.materialCode || '',
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialEigenvalue')}>
              {getFieldDecorator('eigenvalue', {
                initialValue: formData.eigenvalue || '',
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialName')}>
              {getFieldDecorator('materialName', {
                initialValue: formData.materialName || '',
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialDesc')}>
              {getFieldDecorator('materialDesc', {
                initialValue: formData.materialDesc || '',
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialUom')}>
              {getFieldDecorator('uomName', {
                initialValue: formData.uomName || '',
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.serialNumberProfileForMaterial')}>
              {getFieldDecorator('serialNumberProfile', {
                initialValue: (formData.serialNumberProfile ? getFormattedMsg('global.judge.yes') : getFormattedMsg('global.judge.no')) ||  getFormattedMsg('global.judge.no'),
              })(<Input readOnly style={{ border: 'none', backgroundColor: '#f7f7f7' }} />)}
            </FormItem>
          </Col>
          {/* {this.renderExtendColumn()} */}
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
  onClose: PropTypes.func
};

export default Form.create()(MaterialForm);
