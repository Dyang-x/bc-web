import React, { useState, useEffect,forwardRef,useImperativeHandle } from 'react';
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
  onHandlecreate,
  detail,
  supplierList,
  goBack,
  handleSubmiit,
  state,
  type,setSelectedType
},ref) => {
  
  const [supplier, setSupplier] = useState('')
  const save = () => {
    const params = { ...getFieldsValue()}
    handleSave(params)
  }
  const handleCreate = (e) => {
    if (e.keyCode == 13) {
        const params = { ...getFieldsValue()}
        onHandlecreate(params)
    }
  }
  useImperativeHandle(
    ref,
    () => ({
      save,
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
          
              <FormItem label='入库单号'>
                      {getFieldDecorator('receiptNumber', {
                      })(<div  style={{width:200}}>{detail && detail.receiptNumber}</div>)}
              </FormItem>   

              {/* <FormItem label='供应商'  >
                  {getFieldDecorator('supplierId', {
                      initialValue: detail && detail.supplierId ? detail['supplierId'] : undefined
                  })(
                      <Select placeholder="请选择供应商" allowClear style={{width:200}} disabled={state==2 ? true: false}>
                        {supplierList &&
                          supplierList.map(i => (
                          <Select.Option key={i.id} value={i.id}>
                              {i.supplierName}
                          </Select.Option>
                          ))}
                      </Select>
                  )}
                  </FormItem> */}
                            <FormItem label='入库单类型' >
            {getFieldDecorator('type', {
              initialValue: detail ? detail['type'] : undefined
            })(<Select
              placeholder="请选择入库单类型"
              onChange={(key, value) => { onHandleChange(key, value) }}
              disabled={detail && detail['type']}
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