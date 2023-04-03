import React, { useState, useEffect, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Select, Input, notification } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import waresLocationService from '~/api/waresLocation';

const getFormattedMsg = i18n.getFormattedMsg;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};



const DetailForm = ({
      formData,
      form: { getFieldDecorator },
      materialList
}) => {

  const [allMaterialList, setAllMaterialList] = useState([])

  useEffect(() => {
    getMaterial({page: 0, pageSize: 20})
  }, [])

  useEffect(() => {
      if (formData && formData.materialId) {
        getMaterial({
            page: 0, 
            pageSize: 20,
            id: formData.materialId
        })
      }
  }, [formData])


  const getMaterial = async (params) => {
    await waresLocationService
      .getMaterials(params)
      .then(result => {
        setAllMaterialList(result.content);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }
  const handleSearh = (e) => {
    getMaterial({
        page: 0, 
        pageSize: 20,
        keyWord: e
    })
  }

  return (
    <Form>
      <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.material')}>
        {getFieldDecorator('materialId', {
          initialValue: formData.materialId || undefined,
          rules: [
            {
              required: true,
              message: getFormattedMsg('waresLocation.validate.placeholderForMaterial')
            }
          ]
        })(
          <Select
            showSearch
            optionFilterProp="children"
            placeholder={getFormattedMsg('waresLocation.validate.placeholderForMaterial')}
            onSearch={handleSearh}
          >
            {allMaterialList && allMaterialList.length > 0 &&
              allMaterialList.map(i => (
                <Select.Option key={i.id} value={i.id}>
                  {i.materialName}
                </Select.Option>
              ))}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.storeMin')}>
        {getFieldDecorator('storeMin', {
          initialValue: formData.storeMin || undefined
        })(
          <InputNumber style={{ width: '100%' }} min={0} placeholder={getFormattedMsg('waresLocation.validate.placeholderForStoreMin')} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.storeMax')}>
        {getFieldDecorator('storeMax', {
          initialValue: formData.storeMax || undefined
        })(
          <InputNumber style={{ width: '100%' }} min={0} placeholder={getFormattedMsg('waresLocation.validate.placeholderForStoreMax')} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={getFormattedMsg('waresLocation.label.remark')}>
        {getFieldDecorator('remark', {
          initialValue: formData.remark || undefined
        })(
          <Input.TextArea style={{ width: '100%' }} placeholder={getFormattedMsg('waresLocation.validate.placeholderForRemark')} />
        )}
      </FormItem>
    </Form>
  );
}
DetailForm.propTypes = {
  formData: PropTypes.object,
  form: PropTypes.object
};

export default Form.create()(DetailForm);
