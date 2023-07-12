import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isChineseLocale } from '@hvisions/core/lib/store/session/selector.js';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  notification,
  Modal,
  Icon,
  InputNumber,
  DatePicker,
  Cascader,
  Divider
} from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';
import moment from 'moment';
import { session } from '@hvisions/toolkit';
import { isEmpty } from 'lodash';
import materialService from '~/api/material';
import { uploadFile } from 'store/templateManage/actions';
const getFormattedMsg = i18n.getFormattedMsg;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const MateialForm = ({
  form: { getFieldDecorator, setFieldsValue },
  formData,
  uploadFile,
  setFileId,
  fileId,
  columns,
  isChinese
}) => {
  const [groupList, setGroupList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [typeArr, setTypeArr] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if(formData.photoId) {
      setFileList([{
        uid: formData.photoId,
        name: '',
        status: 'done',
        url: `${session.getApiAddress()}/file-management/file/downloadFile/${formData.photoId}`
      }]);
    }
  }, [formData]);

  const renderExtendColumn = () => {
    return columns.map((col, idx) => {
      let component;
      let initialValue;
      switch (col.columnType) {
        case 'int':
        case 'float':
        case 'decimal':
          component = (
            <InputNumber
              style={{ width: '100%' }}
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : 0;
          break;
        case 'date':
          component = <DatePicker style={{ width: '100%' }} placeholder={getFormattedMsg('user.validate.placeholderForExtend', { key: isChinese ? col.chName : col.enName })} />;
          initialValue = !isEmpty(formData) && formData.extend[col.columnName] ? moment(formData.extend[col.columnName]) : undefined;
          break;
        case 'datetime':
          component = (
            <DatePicker
              style={{ width: '100%' }}
              showTime
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue =
            !isEmpty(formData) && formData.extend[col.columnName]
              ? moment(formData.extend[col.columnName])
              : undefined;
          break;
        default:
          component = (
            <Input
              placeholder={getFormattedMsg('user.validate.placeholderForExtend', {
                key: isChinese ? col.chName : col.enName
              })}
            />
          );
          initialValue = !isEmpty(formData) ? formData.extend[col.columnName] : '';
      }

      return (
        <Col span={12} key={idx}>
          <FormItem {...formItemLayout} label={`${isChinese ? col.chName : col.enName}`}>
            {getFieldDecorator(`extend.${col.columnName}`, {
              initialValue
            })(component)}
          </FormItem>
        </Col>
      );
    });
  };

  const loadData = () => {
    materialService.getAllMaterialGroup().then(data => {
      setGroupList(data);
    });
    materialService.getAllMaterialType().then(data => {
      const filterArr = data.filter(node => {
        if (!isEmpty(data)) {
          const children = data.filter(c => c.parentId === node.id);
          node.children = !isEmpty(children) ? children : [];
        }
        return node.parentId === 0;
      });
      setTypeList(filterArr);
    });
    materialService.getAllUnit().then(data => {
      setUnit(data);
    });
  };

  useEffect(() => {
    if (!formData.materialType) return;
    materialService.getMaterialTypeArrByNodeId(formData.materialType).then(data => {
      setTypeArr(data);
    });
  }, [formData]);

  const onHandleImport = async file => {
    try {
      const datas = await uploadFile({ file, id: undefined });
      setFileId(datas.id);
      notification.success({
        message: getFormattedMsg('message.notify.success', { action: '上传' })
      });
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  };

  const handleBeforeUpload = file => {
    onHandleImport(file);
    return false;
  };

  const UploadButton = () => (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">{getFormattedMsg('material.action.upload')}</div>
    </div>
  );

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleChange = file => {
    if(isEmpty(file.fileList) ) {
      setFileList([]);
      return;
    }
    setFileList([file.fileList[file.fileList.length - 1]]);
  }

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line require-atomic-updates
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const renderPhoto = () => {
    if (formData.photoId) {
      return (
        <Upload
          listType="picture-card"
          onRemove={() => {
            setFieldsValue({ photoId: undefined })
            setFileId(undefined);
            setFileList([]);
          }}
          onPreview={handlePreview}
          beforeUpload={handleBeforeUpload}
          fileList={fileList}
          onChange={handleChange}
        >
          <UploadButton />
        </Upload>
      );
    }
    return (
      <Upload
        listType="picture-card"
        onRemove={() => {
          setFieldsValue({ photoId: undefined })
          setFileId(undefined);
          setFileList([]);
        }}
        onPreview={handlePreview}
        beforeUpload={handleBeforeUpload}
        fileList={
          fileId
            ? [
                {
                  uid: fileId,
                  name: '',
                  status: 'done',
                  url: `${session.getApiAddress()}/file-management/file/downloadFile/${fileId}`
                }
              ]
            : undefined
        }
      >
        {!fileId && <UploadButton />}
      </Upload>
    );
  };

  return (
    <div>
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialCode')}>
              {getFieldDecorator('materialCode', {
                initialValue: formData.materialCode || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForCode')
                  },
                  {
                    max:50,
                    message: '物料编码不能大于50字符',
                  }
                ]
              })(
                <Input
                  disabled={!!formData.materialCode}
                  placeholder={getFormattedMsg('material.validate.placeholderForCode')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={getFormattedMsg('material.label.materialEigenvalue')}
            >
              {getFieldDecorator('eigenvalue', {
                initialValue: formData.eigenvalue || 1,
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForeigenvalue')
                  }
                ]
              })(
                <Input
                disabled={!!formData.eigenvalue}
                  placeholder={getFormattedMsg('material.validate.placeholderForeigenvalue')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialName')}>
              {getFieldDecorator('materialName', {
                initialValue: formData.materialName || '',
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForName')
                  },
                  {
                    max:50,
                    message: '物料名称不能大于50字符',
                  }
                ]
              })(<Input placeholder={getFormattedMsg('material.validate.placeholderForName')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialUom')}>
              {getFieldDecorator('uom', {
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForColumnUom')
                  }
                ],
                initialValue: formData.uom || undefined
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnUom')}
                >
                  {unit.map(value => (
                    <Option value={value.id} key={value.id}>
                      {value.symbol + '/' + value.description}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialType')}>
              {getFieldDecorator('materialType', {
                rules: [
                  {
                    required: true,
                    message: getFormattedMsg('material.validate.placeholderForColumnType')
                  }
                ],
                initialValue: typeArr 
              })(
                <Cascader
                  options={typeList}
                  fieldNames={{ label: 'materialTypeName', value: 'id', children: 'children' }}
                  changeOnSelect
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnType')}
                ></Cascader>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialGroup')}>
              {getFieldDecorator('materialGroup', {
                initialValue: formData.materialGroup || undefined
              })(
                <Select
                  showSearch
                  optionFilterProp="children"
                  allowClear
                  placeholder={getFormattedMsg('material.validate.placeholderForColumnGroup')}
                >
                  {groupList.map(value => (
                    <Option value={value.id} key={value.id}>
                      {`${value.groupCode}/${value.groupName}`}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayout}
              label={getFormattedMsg('material.label.serialNumberProfileForMaterial')}
            >
              {getFieldDecorator('serialNumberProfile', {
                initialValue: formData.serialNumberProfile || false
              })(
                <RadioGroup name="radiogroup">
                  <Radio value>{getFormattedMsg('global.judge.yes')}</Radio>
                  <Radio value={false}>{getFormattedMsg('global.judge.no')}</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          {renderExtendColumn()}
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialDesc')}>
              {getFieldDecorator('materialDesc', {
                initialValue: formData.materialDesc || '',
                rules: [{ message: getFormattedMsg('material.validate.placeholderForDesc') }]
              })(
                <TextArea
                  rows={4}
                  placeholder={getFormattedMsg('material.validate.placeholderForDesc')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label={getFormattedMsg('material.label.materialPic')}>
              {getFieldDecorator('photoId')(
                <div className="clearfix">
                  {renderPhoto()}
                  <Modal footer={null} visible={previewVisible} onCancel={() => setPreviewVisible(false)}>
                    <img alt="example" style={{ width: '100%' }}  src={previewImage}/>
                  </Modal>
                </div>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = state => ({
  isChinese: isChineseLocale(),
});

export default Form.create()(
  connect(
    mapStateToProps,
    {
      uploadFile
    }
  )(MateialForm)
);
