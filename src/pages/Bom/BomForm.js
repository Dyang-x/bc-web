/*
 * @Author: Andy
 * @Date: 2019-08-19 17:34:07
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 17:49:30
 */
import React, { useEffect, useState } from 'react';
import { i18n, withPermission } from '@hvisions/core';
import { Form, Row, Col, Input, Select, InputNumber, Button, notification, DatePicker } from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import moment from 'moment';
import materialService from '~/api/material';
import bomService from '~/api/bom';
import styles from './style.scss';
const SaveButton = withPermission(Button, 'SAVE');
const getFormattedMsg = i18n.getFormattedMsg;
const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 14
  }
};
const BomForm = ({
  form: { getFieldDecorator, validateFields },
  formData,
  bottomBar,
  loadData,
  refreshTree,
  treeData,
  columns,
  isChinese
}) => {
  const [unit, setUnit] = useState([]);
  useEffect(() => {
    materialService.getAllUnit().then(data => {
      setUnit(data);
    });
  }, []);

  const handleSubmit = () => {
    validateFields(async (err, value) => {
      if (err) return;
      try {
        await bomService.updateBom({ ...formData, ...value });
        await refreshTree();
        notification.success({
          message: getFormattedMsg('global.notify.modifySuccess')
        });
        await loadData();
      } catch (error) {
        notification.warining({
          message:getFormattedMsg('global.notify.modifyFail'),
          description: error.message
        });
      }
    });
  };

  const renderExtendColumn = () => {
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
        case 'datetime':
          component = <DatePicker showTime placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) && formData.extend[col.columnName] ? moment(formData.extend[col.columnName]) : undefined;
          break;
        default:
          component = <Input placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : '';
      }

      return (
        <Col span={24} key={idx}>
          <FormItem {...formItemLayout} label={`${isChinese ? col.chName : col.enName}`}>
            {getFieldDecorator(`extend.${col.columnName}`, {
              initialValue
            })(component)}
          </FormItem>
        </Col>
      );
    });
  };

  return (
    <Form>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.bomCode')}>
            {getFieldDecorator('bomCode', {
              initialValue: formData.bomCode || '',
              rules: [
                { required: true, message: getFormattedMsg('bom.validate.placeholderForCode') }
              ]
            })(<Input placeholder={getFormattedMsg('bom.validate.placeholderForCode')} />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.name')}>
            {getFieldDecorator('bomName', {
              initialValue: formData.bomName || '',
              rules: [
                { required: true, message: getFormattedMsg('bom.validate.placeholderForName') }
              ]
            })(<Input placeholder={getFormattedMsg('material.validate.placeholderForName')} />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.version')}>
            {getFieldDecorator('bomVersions', {
              initialValue: formData.bomVersions || '',
              rules: [
                { required: true, message: getFormattedMsg('bom.validate.placeholderForVersion1') }
              ]
            })(<Input placeholder={getFormattedMsg('bom.validate.placeholderForVersion1')} />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.unit')}>
            {getFieldDecorator('unitId', {
              initialValue: formData.unitId || undefined,
              rules: [
                { required: true, message: getFormattedMsg('bom.validate.placeholderForUnit') }
              ]
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={getFormattedMsg('bom.validate.placeholderForUnit')}

              >
                {unit.map(value => (
                  <Option value={value.id} key={value.id}>
                    {value.symbol + '/' + value.description}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.number')}>
            {getFieldDecorator('bomCount', {
              initialValue: formData.bomCount || 1
            })(<InputNumber style={{ width: 100 }} min={1} />)}
          </FormItem>
        </Col>
        {
          renderExtendColumn()
        }
      </Row>
      {bottomBar && (
        <div className={styles['drawer-control']}>
          <SaveButton style={{ marginRight: '20px' }} disabled={treeData.bomStatus !== 0} type="primary" onClick={handleSubmit}>
            {getFormattedMsg('global.btn.save')}
          </SaveButton>
        </div>
      )}
    </Form>
  );
};

export default Form.create()(BomForm);
