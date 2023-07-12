/*
 * @Author: Andy
 * @Date: 2019-08-14 16:34:21
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 11:21:50
 */
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Cascader } from '@hvisions/h-ui';
import { withPermission, i18n } from '@hvisions/core';
import { isEmpty } from 'lodash';
import MaterialService from '~/api/material';
const getFormattedMsg = i18n.getFormattedMsg;
const SearchButton = withPermission(Button, 'SEARCH');
const { Option } = Select;
const FormItem = Form.SearchItem;
const SearchForm = ({ form: { getFieldDecorator, getFieldsValue }, onSearch }) => {
  const [groupList, setGroupList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    MaterialService.getAllMaterialType().then(data => {
      const filterArr = data.filter(node => {
        if (!isEmpty(data)) {
          const children = data.filter(c => c.parentId === node.id);
          node.children = !isEmpty(children) ? children : [];
        }
        return node.parentId === 0;
      });
      setTypeList(filterArr);
    });
    MaterialService.getAllMaterialGroup().then(data => {
      setGroupList(data);
    });
  };

  return (
      <Form  style={{ whiteSpace: 'nowrap' }}>

            <FormItem label={getFormattedMsg('material.label.materialCode')}>
              {getFieldDecorator('materialCode')(
                <Input
                  allowClear
                  placeholder={getFormattedMsg('material.validate.placeholderForCode')}
                />
              )}
            </FormItem>

            <FormItem label={getFormattedMsg('material.label.materialName')}>
              {getFieldDecorator('materialName')(
                <Input
                  allowClear
                  placeholder={getFormattedMsg('material.validate.placeholderForName')}
                />
              )}
            </FormItem>

            {/* <FormItem label={getFormattedMsg('material.label.materialType')}>
              {getFieldDecorator('materialType')(
                <Cascader
                  options={typeList}
                  fieldNames={{ label: 'materialTypeName', value: 'id', children: 'children' }}
                  allowClear
                  expandTrigger="hover"
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnType')}
                ></Cascader>
              )}
            </FormItem> */}

            <FormItem label={getFormattedMsg('material.label.materialGroup')}>
              {getFieldDecorator('materialGroup')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnGroup')}
                  style={{ width: 150 }}
                >
                  {groupList.map(value => (
                    <Option value={value.id} key={value.id}>
                      {value.groupName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <FormItem>
              <SearchButton type="primary" icon="search" onClick={() => onSearch(getFieldsValue())}>
                {getFormattedMsg('global.btn.search')}
              </SearchButton>
            </FormItem>

      </Form>
  );
};

export default Form.create()(SearchForm);
