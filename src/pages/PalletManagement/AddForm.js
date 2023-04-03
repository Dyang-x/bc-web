import React from 'react';
import { Form, Input, Select} from '@hvisions/h-ui'
import { i18n } from '@hvisions/core';
// import { palletState } from '~/enum/pallet';
import { palletState } from '~/enum/enum';

const { getFormattedMsg } = i18n;
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const AddForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  palletTypeList,
}) => {

  
  // const [locationList, setLocationList] = useState([])

  // useEffect(() => {
  //   handleSearchLocation()
  // }, [])

  // const handleSearchLocation = async (param) => {
  //   const params = {
  //     code: param,
  //     pageSize: 10,
  //     page: 0
  //   }
  //   await waresLocationServices.getLocationByQuery(params).then(res => {
  //     setLocationList(res.content)
  //   }).catch(err => {
  //     notification.warning({
  //       description: err.message
  //     });
  //   })
  // }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.name')}>
        {
          getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.name'),
              },
            ],
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.name')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.code')}>
        {
          getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.code'),
              },
            ],
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.code')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.type')}>
        {
          getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.type'),
              },
            ],
          })(
            <Select
              showSearch
              placeholder={getFormattedMsg('PalletManagement.message.type')}
            >
              {palletTypeList.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.weight')}>
        {
          getFieldDecorator('weight', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.weight'),
              },
            ],
          })(
            <Input placeholder={getFormattedMsg('PalletManagement.message.weight')} />
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('PalletManagement.label.location')}>
        {
          getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('PalletManagement.message.location'),
              },
            ],
          })(
            <Select
            placeholder={getFormattedMsg('PalletManagement.placeholder.location')}
            // onSearch={handleSearchLocation}
            showSearch
            filterOption={false}
          >
            {palletState.map((value, index) => (
              <Option value={value.value} key={value.id}>
                {value.name}
              </Option>
            ))}
          </Select>
          )
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddForm)
