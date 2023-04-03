import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isEmpty } from 'lodash';

import {
  Row, Col, Form, Button,
  Input, DatePicker, Cascader,
  InputNumber, Drawer
} from '@hvisions/h-ui';
import { ImportButtonShowImg } from '~/components';
import styles from './style.scss';
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

class DetailForm extends PureComponent {
  state = {
    photoId: []
  }

  UNSAFE_componentWillMount() {
    const { formData } = this.props;
    if (formData.photoId) {
      this.setState({ photoId: [formData.photoId] });
    }
  }

  handleChangeImg = id => {
    const { photoId } = this.state;
    photoId.push(id);
    this.setState({ photoId });
  }

  handleChangeRemove = index => {
    const { photoId } = this.state;
    photoId.splice(index, 1);
    this.setState({ photoId });
  }

  renderExtendColumn = () => {
    const {
      columns,
      formData,
      isChinese,
      form: { getFieldDecorator }
    } = this.props;
    return columns.map((col, idx) => {
      let component;
      let initialValue;
      switch (col.columnType) {
        case 'int':
        case 'float':
        case 'decimal':
          component = <InputNumber className={styles['component-w']} placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : 0;
          break;
        case 'date':
          component = <DatePicker placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) && formData.extend[col.columnName] ? moment(formData.extend[col.columnName]) : undefined;
          break;
        case 'datetime':
          component = <DatePicker showTime placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) && formData.extend[col.columnName] ? moment(formData.extend[col.columnName]) : undefined;
          break;
        default:
          component = <Input placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
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
    const { photoId } = this.state;
    const {
      formData,
      onOk,
      onClose,
      types,
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.code')}>
              {getFieldDecorator('equipmentCode', {
                initialValue: formData.equipmentCode || '',
                rules: [{ required: true, message: getFormattedMsg('equipment.input.code') }]
              })(<Input readOnly={formData.id} placeholder={getFormattedMsg('equipment.input.code')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.name')}>
              {getFieldDecorator('equipmentName', {
                initialValue: formData.equipmentName || '',
                rules: [{ required: true, message: getFormattedMsg('equipment.input.name') }]
              })(<Input placeholder={getFormattedMsg('equipment.input.name')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.type')}>
              {getFieldDecorator('equipmentTypeId', {
                initialValue: formData.equipmentTypeId || [],
                rules: [{ required: true, message: getFormattedMsg('equipment.input.type') }]
              })(
                <Cascader showSearch style={{ width: '100%' }} options={types} fieldNames={{ label: 'equipmentTypeName', value: 'id', children: 'children' }} changeOnSelect placeholder={getFormattedMsg('equipmentType.input.type')} />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.type_id')}>
              {getFieldDecorator('equipmentModel', {
                initialValue: formData.equipmentModel || ''
              })(<Input placeholder={getFormattedMsg('equipment.input.type_id')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.number')}>
              {getFieldDecorator('equipmentSerialNum', {
                initialValue: formData.equipmentSerialNum || ''
              })(<Input placeholder={getFormattedMsg('equipment.input.number')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.manufacturer')}>
              {getFieldDecorator('manufacturer', {
                initialValue: formData.manufacturer || ''
              })(<Input placeholder={getFormattedMsg('equipment.input.manufacturer')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.present_time')}>
              {getFieldDecorator('arrivalDate', {
                initialValue: !isEmpty(formData.arrivalDate) ? moment(formData.arrivalDate) : null,
              })(<DatePicker style={{ width: '100%' }} placeholder={getFormattedMsg('equipment.input.present_time')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.service_time')}>
              {getFieldDecorator('useDate', {
                initialValue: !isEmpty(formData.useDate) ? moment(formData.useDate) : null,
              })(<DatePicker style={{ width: '100%' }} placeholder={getFormattedMsg('equipment.input.service_time')} />)}
            </FormItem>
          </Col>
          {this.renderExtendColumn()}
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('equipment.label.photo')}>
              {getFieldDecorator('photoId', {
                initialValue: photoId || null,
              })(
                <ImportButtonShowImg count={1} handleChangeRemove={this.handleChangeRemove} fileIds={photoId} handleChangeImg={this.handleChangeImg} />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

DetailForm.propTypes = {
  isChinese: PropTypes.bool,
  formData: PropTypes.object,
  form: PropTypes.object,
  types: PropTypes.array,
  columns: PropTypes.array,
  onOk: PropTypes.func,
  onClose: PropTypes.func
};

export default Form.create()(DetailForm);
