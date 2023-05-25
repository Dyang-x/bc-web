import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select,Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TrayForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
  modifyData,
  inMaterialList,
  treeData
}) => {

  const [materialList, setMaterialList] = useState([])

  const attribute1 = [
    {key:0,name:'大',value:'大',},
    {key:1,name:'中',value:'中',},
    {key:2,name:'小',value:'小',}
  ]

  const attribute2 = [
    {key:0,name:'切割完成',value:'切割完成',},
    {key:1,name:'切割未完成',value:'切割未完成',},
    {key:2,name:'折弯完成',value:'折弯完成',},
    {key:3,name:'折弯未完成',value:'折弯未完成',}
  ]

  const sortingPosition = [
    {key:0,name:'J004',value:'J004',},
    {key:1,name:'J005',value:'J005',},
    {key:2,name:'J006',value:'J006',},
    {key:3,name:'J007',value:'J007',},
    {key:4,name:'J008',value:'J008',},
    {key:5,name:'J009',value:'J009',}
  ]

  const contactPpoint = [
    {key:0,name:'J002',value:'J002',},
    {key:1,name:'J003',value:'J003',}
  ]

  useEffect(() => {
    // getMaterial()
  }, [])


  const changeModel = (value) => {

  }

  const getMaterial = async (params) => {


  }
  const handleChangeMaterial = (e) => {


  }

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.trayNumber')}>
        {
          getFieldDecorator('tyayNumber', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.trayNumber')} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={getFormattedMsg('RawMaterialWarehousingReceipt.label.material')}>
        {
          getFieldDecorator('rawMaterial', {
            rules: [
              {
                required: true,
                message:getFormattedMsg('RawMaterialWarehousingReceipt.message.material'),
              },
            ],
          })(<Input placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.message.material')} style={{ width: '100%' }} />)
        }
      </Form.Item>
    </Form>
  )
}

export default Form.create()(TrayForm)
