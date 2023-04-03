/*
 * @Author: Otway
 * @Date: 2019-08-20 13:51:23
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-29 17:21:02
 * @copyright: h-visions
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Form, Button,
  Divider, notification,
  Input, Table, Select, Modal
} from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import styles from './style.scss';

const FormItem = Form.Item;
const { getFormattedMsg } = i18n;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};

class ExtendForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: ''
    };
  }

  get columns() {
    return [{
      title: getFormattedMsg('extend.label.column'),
      dataIndex: 'columnName',
      key: 'columnName',
      render: this.editableCell('columnName', getFormattedMsg('extend.validate.placeholderForColumn'))
    }, {
      title: getFormattedMsg('extend.label.type'),
      dataIndex: 'columnType',
      key: 'columnType',
      render: this.editableCell('columnType', getFormattedMsg('extend.validate.placeholderForType'))
    }, {
      title: getFormattedMsg('extend.label.nameForCN'),
      dataIndex: 'chName',
      key: 'chName',
      render: this.editableCell('chName', getFormattedMsg('extend.validate.placeholderForCN'))
    }, {
      title: getFormattedMsg('extend.label.nameForEN'),
      dataIndex: 'enName',
      key: 'enName',
      render: this.editableCell('enName', getFormattedMsg('extend.validate.placeholderForEN'))
    }, {
      title: getFormattedMsg('global.label.operation'),
      dataIndex: 'options',
      key: 'options',
      render: (_, record) => {
        const isEditing = this.isEditing(record.columnName);
        if (!isEditing) {
          return [
            // 暂时不支持扩展字段修改，该功能先注释掉👇👇👇
            // <a href="#" key="edit" onClick={this.onHandleEdit(record.columnName)}>修改</a>,
            // <Divider type="vertical" key="split" />,
            <a href="#" key="remove" onClick={this.onHandleDelete(record)}>{ getFormattedMsg('global.btn.delete')}</a>
          ];
        }
        return [
          <a href="#" key="save" onClick={this.onHandleUpdate(record)}>{ getFormattedMsg('global.btn.save') }</a>,
          <Divider type="vertical" key="split" />,
          <a href="#" key="cancel" onClick={this.onHandleEdit('')}>{ getFormattedMsg('global.btn.cancel')}</a>
        ];
      }
    }];
  }

  onHandleEdit = editingKey => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ editingKey });
  }

  onHandleUpdate = () => {}

  onHandleCreate = () => {
    const {
      createExtendColumn, getExtendColumns, form: { validateFields, resetFields }
    } = this.props;
    validateFields(async (err, values) => {
      if (err) return;
      const action = getFormattedMsg('global.btn.create');
      try {
        await createExtendColumn(values);
        await getExtendColumns();
        notification.success({
          message: getFormattedMsg('global.notify.success', { action })
        });
        resetFields();
      } catch (err) {
        notification.warning({
          message: getFormattedMsg('global.notify.fail', { action }),
          description: err.message,
        });
      }
    });
  }

  onHandleDelete = data => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.columnName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        try {
          await this.props.deleteExtendColumn(data.columnName);
          await this.props.getExtendColumns();
          notification.success({
            message: getFormattedMsg('global.notify.success', { action })
          });
        } catch (err) {
          notification.warning({
            message: getFormattedMsg('global.notify.fail', { action }),
            description: err.message,
          });
        }
      }
    });
  }

  isEditing = editingKey => editingKey === this.state.editingKey;

  editableCell = (type, message) => (text, record) => {
    const isEditing = this.isEditing(record.columnName);
    if (!isEditing) {
      return text;
    }
    const { form: { getFieldDecorator } } = this.props;
    return (
      <FormItem style={{ margin: 0 }}>
        {getFieldDecorator(type, {
          rules: [{
            required: true,
            message,
          }],
          initialValue: text,
        })(
          <Input />
        )}
      </FormItem>
    );
  }

  render() {
    const { data, form: { getFieldDecorator } } = this.props;
    return (
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('extend.label.column')}>
              {getFieldDecorator('columnName', {
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('extend.validate.placeholderForColumn')
                  },
                  {
                    pattern: /^[a-zA-z].*/,
                    message: getFormattedMsg('extend.validate.placeholderForwaring')
                  }
                ]
              })(<Input placeholder={getFormattedMsg('extend.validate.placeholderForColumn')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('extend.label.type')}>
              {getFieldDecorator('columnType', {
                rules: [{ required: true, message: getFormattedMsg('extend.validate.placeholderForType') }]
              })(
                <Select placeholder={getFormattedMsg('extend.validate.placeholderForType')}>
                  <Option value="VARCHAR">字符类型</Option>
                  <Option value="INT">整数类型</Option>
                  <Option value="FLOAT">浮点数类型</Option>
                  <Option value="DECIMAL">带小数的数字</Option>
                  <Option value="DATE">日期</Option>
                  <Option value="DATETIME">日期+时间</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('extend.label.nameForCN')}>
              {getFieldDecorator('chName', {
                rules: [{ required: true, message: getFormattedMsg('extend.validate.placeholderForCN') }]
              })(<Input placeholder={getFormattedMsg('extend.validate.placeholderForCN')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('extend.label.nameForEN')}>
              {getFieldDecorator('enName', {
                rules: [{ required: true, message: getFormattedMsg('extend.validate.placeholderForEN') }]
              })(<Input placeholder={getFormattedMsg('extend.validate.placeholderForEN')} />)}
            </FormItem>
          </Col>
          <Col push={1} span={22} className={styles['extend-foot']}>
            <Button type="primary" icon="plus" onClick={this.onHandleCreate}>{getFormattedMsg('global.btn.create')}</Button>
          </Col>
        </Row>
        <div style={{ padding: 20 }}>
          <Table rowKey={record => record.columnName} columns={this.columns} dataSource={data} pagination={false} />
        </div>
      </Form>
    );
  }
}

ExtendForm.propTypes = {
  data: PropTypes.array,
  form: PropTypes.object,
  getExtendColumns: PropTypes.func,
  createExtendColumn: PropTypes.func,
  deleteExtendColumn: PropTypes.func
};

export default Form.create()(ExtendForm);
