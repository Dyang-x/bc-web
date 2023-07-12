import React, { useState, useEffect, useRef } from 'react';
import { HTable, Table, Button, HLayout, Modal, Pagination, notification, Form, Input, Select, Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import moment from 'moment';
import { tree } from '@hvisions/toolkit';
import { i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import TransferBoxServices from '~/api/TransferBox';
import joinAreaServices from '~/api/joinArea';

const { formatTree } = tree;
const { getFormattedMsg } = i18n;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const AddForm = ({
  form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
}) => {

  useEffect(() => {
    getTransfer()
  }, [])

  const getTransfer = async (searchValue) => {
    await joinAreaServices.findJoin()
    .then(res => {
      res.map(i => {
        if (i.joinCode == 'J002' && i.transferCode != null) {
          const transferCode = i.transferCode
          if(transferCode.includes('A')){
            setFieldsValue({ trayNumber: transferCode })
          }
        }
      })

    }).catch(err => {
      notification.warning({
        message: getFormattedMsg('global.notify.fail'),
        description: err.message
      });
    });
  };

  const fromLocation = [
    { id: 1, name: 'J004', value: 'J004', },
    { id: 2, name: 'J005', value: 'J005', },
    { id: 3, name: 'J006', value: 'J006', },
    { id: 4, name: 'J007', value: 'J007', },
    { id: 5, name: 'J008', value: 'J008', },
    { id: 6, name: 'J009', value: 'J009', },
  ]

  const middle = [
    { id: 1, name: 'J002', value: 'J002', },
    { id: 2, name: 'J003', value: 'J003', },
  ]

  return (
    <Form >
      <Form.Item {...formItemLayout} label={getFormattedMsg('SurplusInStorage.label.trayNumber')}>
        {
          getFieldDecorator('trayNumber', {
            rules: [
              {
                required: true,
                message: getFormattedMsg('SurplusInStorage.placeholder.trayNumber'),
              },
            ],
          })(
            <Input placeholder={getFormattedMsg('SurplusInStorage.placeholder.trayNumber')} style={{ width: '100%' }} />
            // <Select
            //   placeholder={getFormattedMsg('SurplusInStorage.placeholder.trayNumber')}
            //   showSearch
            //   filterOption={false}
            // >
            //   {transferList.map((value, index) => (
            //     <Option value={value.id} key={value.id}>
            //       {value.name}
            //     </Option>
            //   ))}
            // </Select>
          )}
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={"切割机"}>
        {
          getFieldDecorator('cuttingMachine', {
            rules: [
              {
                required: true,
                message: '请选择切割机',
              },
            ],
          })(<Input placeholder={'请选择切割机'} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
      {/* <Form.Item {...formItemLayout} label={'材料编码'}>
        {
          getFieldDecorator('materialCode', {
            rules: [
              {
                required: true,
                message: '请输入材料编码',
              },
            ],
          })(<Input placeholder={'请输入材料编码'} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
      <Form.Item {...formItemLayout} label={'材质'}>
        {
          getFieldDecorator('materialName', {
            rules: [
              {
                required: true,
                message: '请输入材质',
              },
            ],
          })(<Input placeholder={'请输入材质'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料大小 X'}>
        {
          getFieldDecorator('materialSizeX', {
            rules: [
              {
                required: true,
                message: '请输入材料大小 X',
              },
            ],
          })(<Input placeholder={'请输入材料大小 X'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'材料大小 Y'}>
        {
          getFieldDecorator('materialSizeY', {
            rules: [
              {
                required: true,
                message: '请输入材料大小 Y',
              },
            ],
          })(<Input placeholder={'请输入材料大小 Y'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'材料规格'}>
        {
          getFieldDecorator('materialSpecs', {
            rules: [
              {
                required: true,
                message: '请输入材料规格',
              },
            ],
          })(<Input placeholder={'请输入材料规格'} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
      <Form.Item {...formItemLayout} label={'材料厚度'}>
        {
          getFieldDecorator('materialThickness', {
            rules: [
              {
                required: true,
                message: '请输入材料厚度',
              },
            ],
          })(<Input placeholder={'请输入材料厚度'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'数量'}>
        {
          getFieldDecorator('quantity', {
            rules: [
              {
                required: true,
                message: '请输入数量',
              },
            ],
          })(<Input placeholder={'请输入数量'} style={{ width: '100%' }} />)
        }
      </Form.Item>
      {/* <Form.Item {...formItemLayout} label={'起始位置'}>
        {
          getFieldDecorator('fromLocation', {
            rules: [
              {
                required: true,
                message: '请输入起始位置',
              },
            ],
          })(
            <Select
              placeholder={'请输入起始位置'}
              showSearch
              filterOption={false}
            >
              {fromLocation.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'中间位置'}>
        {
          getFieldDecorator('middle', {
            rules: [
              {
                required: true,
                message: '请输入中间位置',
              },
            ],
          })(
            <Select
              placeholder={'请输入中间位置'}
              showSearch
              filterOption={false}
            >
              {middle.map((value, index) => (
                <Option value={value.value} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          )
        }
      </Form.Item>
      <Form.Item {...formItemLayout} label={'目标位置'}>
        {
          getFieldDecorator('toLocation', {
            rules: [
              {
                required: true,
                message: '请输入目标位置',
              },
            ],
          })(<Input placeholder={'请输入目标位置'} style={{ width: '100%' }} />)
        }
      </Form.Item> */}
    </Form>
  )
}

export default Form.create()(AddForm)
