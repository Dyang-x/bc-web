import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, DatePicker,Divider,InputNumber,  Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/core';
import { debounce } from 'lodash';
import purchasingReqService from '~/api/purchasingRequestion'

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

const AddMatreialForm = ({
    form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
    modifyData,
    inMaterialList,
    treeData
}) => {

    const [materialList, setMaterialList] = useState([])

    useEffect(() => {
        getMaterial()
    }, [])


    const changeModel = (value) => {

    }
    const getMaterial = async (keyWord='') => {
        const params = {
            keyWord,
            pageSize: 20,
            page: 0
        }
        await purchasingReqService.getMaterial(params).then(res => {
            setMaterialList(res.content)
        }).catch(err => {
            notification.warning({
                description: err.message
            });
        })

    }
    const handleChangeMaterial = (e) => {
        setTimeout(() => {
            getMaterial(e)
        }, 500)
    }

    return (
        <Form >
        <Form.Item {...formItemLayout} label="物料">
        {
            getFieldDecorator('materialId', {
              rules: [
                {
                  required: true,
                  message: '请选择物料编码',
                },
              ],
              initialValue: modifyData ? modifyData['materialId'] : undefined
            })(<Select
                placeholder="请选择物料编码"
                onSearch={handleChangeMaterial}
                showSearch
                disabled = {modifyData && modifyData['materialId']}
                filterOption={false}
                // filterOption={
                //   (input, option) => {
                //     if (option && option.props && option.props.title) {
                //       return option.props.title === input || option.props.title.indexOf(input) !== -1
                //     } else {
                //       return false
                //     }
                //   }
                // }
              >
              {

                materialList.length && materialList.map(item => {
                  return (<Option key={item.id} value={item.id} title={item.materialName}>{item.materialName} -- {item.materialCode}</Option>)
                })
              }
            </Select>)
          }
        </Form.Item>



        <Form.Item {...formItemLayout} label="批次号">
          {
            getFieldDecorator('batchNumber', {
              rules: [
                {
                  required: true,
                  message: '请扫描或输入批次号',
                },
              ],
              initialValue: modifyData ? modifyData['batchNumber'] : ''
            })(<Input placeholder="请输入批次号"  style={{width: '100%'}} />)
          }
        </Form.Item>
        <Form.Item {...formItemLayout} label="数量">
          {
            getFieldDecorator('num', {
              rules: [
                {
                  required: true,
                  message: '请输入数量',
                },
              ],
              initialValue: modifyData ? modifyData['num'] : ''
            })(<InputNumber min={0} placeholder="请输入数量" style={{width: '100%'}} />)
          }
        </Form.Item>



        <Form.Item {...formItemLayout} label="库房/库位" >
        {
            getFieldDecorator('locationId', {
              rules: [
                {
                  required: true,
                  message: '请选择库房/库位',
                },
              ],
              initialValue: modifyData ? modifyData['locationId'] : ''
            })(
              <Cascader
                fieldNames={{ label: 'name', value: 'id' }}
                changeOnSelect
                options={formatTree(treeData)}
                placeholder={getFormattedMsg('deliver.validate.placeholderForToLocationName')}
              />
            )
          }
        </Form.Item>

        <Form.Item {...formItemLayout} label="备注" >
        {
            getFieldDecorator('description', {
              initialValue: modifyData ? modifyData['description'] : ''
            })(
              <Input.TextArea placeholder="请输入备注"  style={{width: '100%'}} />
            )
          }
        </Form.Item>
      </Form>
    )
}

export default Form.create()(AddMatreialForm)
