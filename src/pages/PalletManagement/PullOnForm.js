import React, { useEffect,useState } from 'react';
import { Form, Input, Select } from '@hvisions/h-ui'
import { emptyInMid, taskType } from '~/enum/enum';

const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PullOnForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  const [emptyInMids, setEmptyInMids] = useState(emptyInMid);
  const [record, setRecord] = useState([]);
  const [newValue, setNewValue] = useState([]);

  const onChangeSelect = (value, index) => {

    //console.log('===============点击的value', value)
    record[index] = value || '';
    //console.log('===============record', record,record.length,typeof record[0],record[0]);
    this.setState({ record });
  }

  const onSearchSelect = (value, index) => {
    const { newValue } = this.state;
    if (!value) {
      newValue[index] = value || '';
      this.setState({ newValue });
    }
  }

  const onBlurSelect = (index) => {
    const { newValue } = this.state;
    const value = newValue[index];
    //console.log('===============输入的value', value)
    if (!value) {
      this.onChangeSelect(value, index);
      delete newValue[index]; // 在onBlur后将对应的key删除，防止当从下拉框中选择后再次触发onBlur时经过此处恢复成原来的值
    }
  }

  return (
    <Form >
            <Form.Item {...formItemLayout} label={'起点'}>
        {
          getFieldDecorator('origin', {
            rules: [
              {
                required: true,
                message: '请输入起点',
              },
            ],
          })(<Input placeholder={'请输入起点'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'中间点'}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请选择中间点',
              },
            ],
          })(
            <Select
              placeholder={'请选择中间点'}
              showSearch
              filterOption={false}
              // onChange={(e) => onChangeSelect(e, '0')}
              // // onSearch={value => onSearchSelect(value, '0')}
              // onBlur={() => onBlurSelect('0')}
              // value={emptyInMids[0] }
            >
              {
                emptyInMids.length && emptyInMids.map(item => {
                  return (<Option key={item.id} value={item.value}>{item.value}</Option>)
                })
              }
            </Select>
          )
        }
      </Form.Item>

    </Form>
  )
}

export default Form.create()(PullOnForm)
