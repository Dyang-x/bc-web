import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, DatePicker, Input, Button, Checkbox, Select, Row, Col, notification } from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';
import moment from 'moment';
import purchasingReqService from '~/api/purchasingRequestion'
const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const dateTime = 'YYYY-MM-DD HH:mm:ss'
const getFormattedMsg = i18n.getFormattedMsg;


const InfoForm = forwardRef(({
  form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue },
  handleSave,
  detail,
  supplierList,
  goBack,
  handleSubmiit,
  type, setSelectedType,
}, ref) => {

  const [supplier, setSupplier] = useState('')
  const save = () => {
    const params = { ...getFieldsValue() }
    handleSave(params)
  }
  useImperativeHandle(
    ref,
    () => ({
      save
    }),
    [handleSave]
  )

  const onHandleChange = (key, value) => {
    setSelectedType(key)
  }

  return (
    <>
      <div className={'hv-search-form'} >
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

          <FormItem label='出库单号'>
            {getFieldDecorator('owNumber', {
            })(<div style={{ width: 200 }}>{detail && detail.owNumber}</div>)}
          </FormItem>

          {/* <FormItem label='操作人员'  >
                    {getFieldDecorator('operatorName', {
                    })(<div  style={{width:200}}>{detail && detail.operatorName}</div>)}
            </FormItem>   

            <FormItem label='出库时间' >
                    {getFieldDecorator('outStockTime', {
                    })(<div  style={{width:200}}>{detail && detail.outStockTime}</div>)}
            </FormItem>   

                <FormItem label="关联单号" >
                {getFieldDecorator('associateNumber', {
                  initialValue: detail ? detail['associateNumber'] : ''
                })(<Input placeholder="请输入关联单号" allowClear  style={{width:200}} />)}
                </FormItem> */}

          {/* <FormItem label="关联单号">
                {getFieldDecorator('purchaseReceiptNumber', {
                })(<Input placeholder="请输入关联单号" allowClear />)}
                </FormItem> */}
          <FormItem label='出库单类型' >
            {getFieldDecorator('type', {
              initialValue: detail ? detail['stockType'] : ''
            })(<Select
              placeholder="请选择出库单类型"
              onChange={(key, value) => { onHandleChange(key, value) }}
              disabled={detail && detail['stockType']}
            >
              {
                type.map(item => {
                  return (<Option key={item.key} value={item.key} >{item.value}</Option>)
                })
              }
            </Select>)}
          </FormItem>
        </div>
      </div>
    </>
  )
});
export default Form.create()(InfoForm)