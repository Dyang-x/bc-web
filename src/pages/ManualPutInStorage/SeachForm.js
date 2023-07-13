import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Button, Checkbox, Select, Row, Col } from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const dateTime = 'YYYY-MM-DD HH:mm:ss'
const getFormattedMsg = i18n.getFormattedMsg;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16},
};

const formItemLayoutMu = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16},
};
const SearchForm = ({ 
  form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue },
  handleSearch,
  testCycle
}) => {
  
  const search = () => {
    const params = { ...getFieldsValue()}
    if (params.deliveryDate && params.deliveryDate.length > 0) {
      params.startTime = moment(params.deliveryDate[0]).format(dateTime)
      params.endTime = moment(params.deliveryDate[1]).format(dateTime)
    }
    handleSearch(params)
  }
  
  return (
        <>
        <Form>
          <Row>
            <Col span={6}>
                    <FormItem label="入库单号" {...formItemLayout} style={{marginBottom: 0}}>
                    {getFieldDecorator('receiptNumber', {
                    })(<Input placeholder="请输入入库单号" allowClear />)}
                    </FormItem>
            </Col>
            <Col span={6}>
                <FormItem label={getFormattedMsg('procurement.label.deliveryDate')} {...formItemLayout} style={{marginBottom: 0}}>
                    {getFieldDecorator('deliveryDate', {
                    })(
                      <RangePicker
                          format={dateTime}
                          placeholder={['起始时间', '结束时间']}
                          style={{ width: '100%' }}
                          showTime
                      />
                    )}
                </FormItem>
            </Col>
            
            
            <Col span={6}>
                <FormItem {...formItemLayout} style={{marginBottom: 0}}>
                <Button type="primary" onClick={search}>查询</Button>
                </FormItem>
            </Col>
          </Row>
          
        </Form>
      </>
  )
}
export default Form.create()(SearchForm)