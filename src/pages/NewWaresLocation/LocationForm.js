import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Switch, InputNumber, Checkbox, Select } from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import { i18n } from '@hvisions/toolkit';
const getFormattedMsg = i18n.getFormattedMsg;
const { Option } = Select;
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
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  formData,
  isLocation,
  onWeighingThicknessChange,
  setWeighingThickness,
  weighingThickness,
  onSelectionChange,
  setSelection,
  selection,
  onHeightLimitChange,
  setHeightLimit,
  heightLimit,
}) => {

  const weighingThicknesss = [
    { label: '是', value: true },
    { label: '否', value: false },
  ];

  const selections = [
    { label: '左', value: 1 },
    { label: '右', value: 2 },
  ];

  const heightLimits = [
    { label: 90, value: 90 },
    { label: 160, value: 160 },
  ];

  return (
    <Form>
      {/* <FormItem {...formItemLayout} label={'库位编码'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.codeL')}>
        {getFieldDecorator('code', {
          initialValue: formData.code || '',
          // rules: [{ required: true, message: '请输入库位编码' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.codeL') }]
        })(
          // <Input disabled={formData.id} placeholder={'请输入库位编码'} />
          <Input disabled={formData.id} placeholder={getFormattedMsg('newWaresLocation.message.codeL')} />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'库位名称'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.nameL')}>
        {getFieldDecorator('name', {
          initialValue: formData.name || '',
          // rules: [{ required: true, message: '请输入库位名称' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.nameL') }]
        })(
          // <Input placeholder={'请输入库位名称'} />
          <Input placeholder={getFormattedMsg('newWaresLocation.message.nameL')} />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'是否称重/测厚'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.weighingThickness')}>
        {getFieldDecorator('weighingThickness', {
          initialValue: formData.selection || weighingThickness,
          valuePropName: 'checked',
          // rules: [{ required: true, message: '请选择是否称重/测厚' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.weighingThickness') }]
        })(
          <Checkbox.Group
            options={weighingThicknesss}
            defaultValue={[true]}
            value={weighingThickness}
            onChange={(index) => onWeighingThicknessChange(index)}
          />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'左右架选择'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.selection')}>
        {getFieldDecorator('selection', {
          initialValue: formData.selection || selection,
          valuePropName: 'checked',
          // rules: [{ required: true, message: '请选择左架/右架' }]          
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.selection') }]
        })(
          <Checkbox.Group
            options={selections}
            defaultValue={[1]}
            value={selection}
            onChange={(index) => onSelectionChange(index)}
          />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'限高'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.heightLimit')}>
        {getFieldDecorator('heightLimit', {
          initialValue: formData.heightLimit || heightLimit,
          valuePropName: 'checked',
          // rules: [{ required: true, message: '请选择限高高度' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.heightLimit') }]
        })(
          <Checkbox.Group
            options={heightLimits}
            defaultValue={[1]}
            value={heightLimit}
            onChange={(index) => onHeightLimitChange(index)}
          />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'X轴坐标'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.xcoordinate')}>
        {getFieldDecorator('xcoordinate', {
          initialValue: formData.xcoordinate || '',
          // rules: [{ required: true, message: '请输入X轴坐标' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.xcoordinate') }]
        })(
          // <Input placeholder='请输入X轴坐标' />
          <Input placeholder={getFormattedMsg('newWaresLocation.message.xcoordinate')} />
        )}
      </FormItem>
      {/* <FormItem {...formItemLayout} label={'Y轴坐标'}> */}
      <FormItem {...formItemLayout} label={getFormattedMsg('newWaresLocation.label.ycoordinate')}>
        {getFieldDecorator('ycoordinate', {
          initialValue: formData.ycoordinate || '',
          // rules: [{ required: true, message: '请输入Y轴坐标' }]
          rules: [{ required: true, message: getFormattedMsg('newWaresLocation.message.ycoordinate') }]
        })(
          // <Input placeholder='请输入Y轴坐标' />
          <Input placeholder={getFormattedMsg('newWaresLocation.message.ycoordinate')} />
        )}
      </FormItem>
    </Form>
  );
}

export default Form.create()(DetailForm);
