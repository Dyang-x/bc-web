/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 17:51:46
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Input, Select, InputNumber, notification, DatePicker } from '@hvisions/h-ui';
import { i18n, withPermission } from '@hvisions/core';
import { omit, isEmpty } from 'lodash';
import bomService from '~/api/bom';
import moment from 'moment';
import materialService from '~/api/material';
import styles from './style.scss';
const getFormattedMsg = i18n.getFormattedMsg;
const SaveButton = withPermission(Button, 'SAVE');
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
let flag = false;

class BomItemForm extends PureComponent {
  state = {
    materialList: [],
    btnLoading: false
  };

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
          component = (
            <InputNumber
              className={styles['component-w']}
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
          initialValue = !isEmpty(formData) && formData.extend[col.columnName] ? moment(formData.extend[col.columnName]) : undefined;
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


  handleSelectOption = (value, option) => {
    if (value && option) {
      const { setFieldsValue } = this.props.form;
      const { materialCode, materialName } = option.props.data;
      setFieldsValue({ bomItemCode: materialCode, bomItemName: materialName });
      flag = true;
    }
  };

  handleSubmit = () => {
    this.props.form.validateFields(async (err, value) => {
      if (err) return;
      try {
        await this.setState({ btnLoading: true });
        if (this.props.add) {
          await bomService.createBomItem({ bomId: this.props.formData.records[0], ...value });
          setTimeout(() => {
            this.props.refreshTree();
          }, 1000);
          await this.props.cancelDrawer();
          notification.success({
            message: getFormattedMsg('global.notify.createSuccess')
          });
          await this.props.form.resetFields();
          return;
        } else {
          if (!Number.isInteger(+value.materialsId)) {
            value = omit(value, 'materialsId');
          }
          await bomService.updateBomItem({ ...this.props.formData, ...value });
          setTimeout(() => {
            this.props.cancel();
            this.props.refreshTree();
          }, 1000);
          notification.success({
            message: getFormattedMsg('global.notify.modifySuccess')
          });
        }
      } catch (error) {
        notification.warning({
          message: getFormattedMsg('global.notify.submitFail'),
          description: error.message
        });
      } finally {
        await this.setState({ btnLoading: false });
      }
    });
  };

  handleSearch = data => {
    materialService.getHvBmMaterialByMaterialCodeLike({ materialName: data }).then(data => {
      this.setState({
        materialList: data
      });
    });
  };

  render() {
    const {
      formData,
      form: { getFieldDecorator },
      treeData,
      add
    } = this.props;
    const { materialList, btnLoading } = this.state;
    const options = materialList.map(d => (
      <Option data={d} key={d.id}>{`${d.materialName}-${d.materialCodeEigenvalue}`}</Option>
    ));
    return (
      <Form style={{ height: '100%', width: '100%', position: 'relative' }}>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.material_eigen')}>
              {getFieldDecorator('materialsId', {
                initialValue: formData.materialCodeEigenvalue
                  ? `${formData.materialName}-${formData.materialCodeEigenvalue}`
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('bom.validate.placeholderForMaterial')
                  }
                ]
              })(
                <Select
                  allowClear
                  showSearch
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={null}
                  onChange={this.handleSelectOption}
                  onSearch={this.handleSearch}
                  placeholder={getFormattedMsg('bom.validate.placeholderForMaterial')}
                >
                  {options}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.bomitem_Code')}>
              {getFieldDecorator('bomItemCode', {
                initialValue: formData.bomItemCode || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('bom.validate.placeholderForItemCode')
                  }
                ]
              })(
                <Input
                  onChange={() => {
                    flag = true;
                  }}
                  placeholder={getFormattedMsg('bom.validate.placeholderForItemCode')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.bomitem_Name')}>
              {getFieldDecorator('bomItemName', {
                initialValue: formData.bomItemName || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('bom.validate.placeholderForItemName')
                  }
                ]
              })(
                <Input
                  onChange={() => {
                    flag = true;
                  }}
                  placeholder={getFormattedMsg('bom.validate.placeholderForItemName')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.type')}>
              {getFieldDecorator('bomItemType', {
                initialValue: formData.bomItemType || 1,
                rules: [{ required: true }]
              })(
                <Select
                  onChange={() => {
                    flag = true;
                  }}
                >
                  <Option value={1} key={1}>
                    {getFormattedMsg('bom.type.input')}
                  </Option>
                  <Option value={2} key={2}>
                    {getFormattedMsg('bom.type.output')}
                  </Option>
                  <Option value={3} key={3}>
                    {getFormattedMsg('bom.type.choosable')}
                  </Option>
                  <Option value={4} key={4}>
                    {getFormattedMsg('bom.type.semi_finished')}
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={getFormattedMsg('bom.label.number')}>
              {getFieldDecorator('bomItemCount', {
                initialValue: formData.bomItemCount || 1
              })(
                <InputNumber
                  onChange={() => {
                    flag = true;
                  }}
                  min={1}
                  placeholder={getFormattedMsg('material.validate.placeholderForName')}
                />
              )}
            </FormItem>
          </Col>
          {
            this.renderExtendColumn()
          }
        </Row>
        <div className={styles[`drawer-control2${formData.id ? '' : 2}`]}>
          {add && (
            <Button onClick={() => this.props.cancelDrawer()}>
              {getFormattedMsg('global.btn.cancel')}
            </Button>
          )}
          <SaveButton type="primary" loading={btnLoading} disabled={treeData.bomStatus !== 0} onClick={() => this.handleSubmit()}>
            {getFormattedMsg('global.btn.save')}
          </SaveButton>
        </div>
      </Form>
    );
  }
}

BomItemForm.propTypes = {
  formData: PropTypes.object,
  onOk: PropTypes.func,
  materialId: PropTypes.func,
  onExtend: PropTypes.func,
  partNumber: PropTypes.array
};

export default Form.create()(BomItemForm);
