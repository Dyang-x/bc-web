import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import {
  Form, Button, Select
} from '@hvisions/h-ui';

import MaterialService from '~/api/material';
import WaresLocationService from '~/api/waresLocation';

const FormItem = Form.SearchItem;
const { Option } = Select;

const SearchForm = ({ form: { getFieldsValue, getFieldDecorator, setFieldsValue }, onSearch }) => {

  const [materialOptions, setMaterialOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [wslOptions, setWslOptions] = useState([]);

  useEffect(() => {
    loadMaterialData();
    loadWaresLocationData();
  }, []);

  const loadMaterialData = async (value) => {
    const res = await MaterialService.getMaterial(value);
    setMaterialOptions(res.content);
  }

  const loadWaresLocationData = async () => {
    const res = await WaresLocationService.findAllByQuery();
    setWslOptions(res);
    setWarehouseOptions(res.filter(_r => _r.parentId === 0));
  }

  const onHandleSearch = () => {
    if (onSearch) {
      onSearch(getFieldsValue());
    }
  };

  const onChange = debounce(value => {
    loadMaterialData(value)
  }, 500)

  const onWsChange = value => {
    setFieldsValue({ locationId: undefined })
    setLocationOptions(wslOptions.filter(_w => _w.parentId === value));
  }

  return (
    <Form>
      <FormItem label="物料">
        {getFieldDecorator('materialId')(
          <Select showSearch allowClear filterOption={false} placeholder="请选择物料" onSearch={onChange}>
            {materialOptions.map(m => (
              <Option value={m.id} key={m.id}>{m.materialName}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="仓库">
        {getFieldDecorator('warehouseId')(
          <Select allowClear placeholder="请选择仓库" onChange={onWsChange}>
            {warehouseOptions.map(m => (
              <Option value={m.id} key={m.id}>{m.name}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="库位">
        {getFieldDecorator('locationId')(
          <Select allowClear placeholder="请选择库位">
            {locationOptions.map(m => (
              <Option value={m.id} key={m.id}>{m.name}</Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem>
        <Button type="primary" icon="search" onClick={onHandleSearch}>查询</Button>
      </FormItem>
    </Form>
  );
}

export default Form.create()(SearchForm);
