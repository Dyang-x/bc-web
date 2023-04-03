import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { findPage, findByUserClassId } from "~/api/waresProperties";
import {
  Form, Select, Input, Switch, HTable, notification
} from '@hvisions/h-ui';
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

const UserPropertiesClassForm = ({ items, form: { getFieldDecorator, validateFields }, isCreate, formData }) => {
  const [list, setList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [selectValue, setSelectValue] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(1);
  
  useEffect(() => {
    setSelectValue(undefined);
    if (!isCreate) {
      loadData();
    } else {
      if (isEmpty(formData)) return;
      setType(formData.dateType);
    }
  }, [isCreate]);

  const loadData = async (search = '') => {
    await setLoading(true);
    await findPage({ codeOrName: search, page: 0, pageSize: 10 }).then(items => {
      setList(items.content);
    });
    await setLoading(false);
  };

  const onChangeSelect = async e => {
    await setType(e);
    await validateFields(['value']);
  };

  const renderPattern = (e = 1) => {
    switch (+e) {
      case 1:
        return '';
      case 2:
        return /^([1-9]\d*|0)?$/;
      case 3:
        return /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
    
      default:
        return '';
    }
  };

  const onSelectChange = e => {
    setSelectValue(e);
    findByUserClassId(e).then(items => {
      if (!isEmpty(items)) {
        setTableList(items);
      } else {
        setTableList([]);
      }
    }).catch(err => {
      notification.warning({
        message: err.message
      });
    });
  };
  const columns = [
    {
      title: getFormattedMsg('global.label.number'),
      dataIndex: 'serialNumber',
      width: 40
    }, {
      title: getFormattedMsg('waresProperties.label.propertyCode'),
      dataIndex: 'code',
      width: 80
    }, {
      title: getFormattedMsg('waresProperties.label.propertyName'),
      dataIndex: 'name',
      width: 80
    }, {
      title: getFormattedMsg('waresProperties.label.defaultvalue'),
      dataIndex: 'value',
      width: 80
    }
  ];
  return (
    <Form>
      {!isCreate && (
        <>
          <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.propertyClass')}>
            {getFieldDecorator('id', {
              initialValue: undefined,
              rules: [{ required: true, message: getFormattedMsg('waresProperties.validate.placeholderForpropertyClass') }]
            })(
              <Select showSearch onChange={onSelectChange} loading={loading} filterOption={false} onSearch={e => loadData(e)} placeholder={getFormattedMsg('waresProperties.validate.placeholderForpropertyClass')}>
                {!isEmpty(list) && list.map(i => <Select.Option disabled={items ? items.map(i => i.id).includes(i.id) : false} key={i.id}>{i.name}</Select.Option>)}
              </Select>
            )}
          </FormItem>
          {selectValue !== undefined && (
            <HTable
              rowKey={record => record.id}
              dataSource={tableList.map((item, index) => ({
                ...item,
                serialNumber: ++index
              }))}
              columns={columns}
              pagination={false}
            />
          )}
        </>
      )}
      {isCreate && (
        <>
          <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.propertyCode')}>
            {getFieldDecorator('code', {
              initialValue: formData.code || '',
              rules: [{ required: true, message: getFormattedMsg('waresProperties.validate.placeholderForpropertyCode') }]
            })(
              <Input disabled={formData.id !== undefined} placeholder={getFormattedMsg('waresProperties.validate.placeholderForpropertyCode')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.propertyName')}>
            {getFieldDecorator('name', {
              initialValue: formData.name || '',
              rules: [{ required: true, message: getFormattedMsg('waresProperties.validate.placeholderForpropertyName') }]
            })(
              <Input disabled={formData.id !== undefined} placeholder={getFormattedMsg('waresProperties.validate.placeholderForpropertyName')} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.dateType')}>
            {getFieldDecorator('dateType', {
              initialValue: formData.id ? formData.dateType + '' : '1',
              rules: [
                { required: true, 
                  message: getFormattedMsg('waresProperties.validate.placeholderFordateType') 
                }
              ]
            })(
              <Select disabled={formData.id !== undefined} onChange={onChangeSelect} placeholder={getFormattedMsg('waresProperties.validate.placeholderFordateType')}>
                <Select.Option key="1">字符串类型</Select.Option>
                <Select.Option key="2">整数类型</Select.Option>
                <Select.Option key="3">小数类型</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.value')}>
            {getFieldDecorator('value', {
              initialValue: formData.value || undefined,
              rules: [{
                pattern: renderPattern(type),
                message: '请根据数据类型输入正确格式'
              }]
            })(
              <Input placeholder={getFormattedMsg('waresProperties.validate.placeholderForvalue')} />
            )}
          </FormItem>
          {/* <FormItem {...formItemLayout} label={getFormattedMsg('waresProperties.label.isConst')}>
            {getFieldDecorator('isConst', {
              initialValue: formData.id ? formData.isConst : false,
            })(
              <Switch defaultChecked={formData.id ? formData.isConst : false} disabled={formData.id !== undefined} />
            )}
          </FormItem> */}
        </>
      )}
    </Form>
  );
};

UserPropertiesClassForm.propTypes = {
  items: PropTypes.array,
  form: PropTypes.object,
  isCreate: PropTypes.bool,
  formData: PropTypes.object
};

export default Form.create()(UserPropertiesClassForm);
