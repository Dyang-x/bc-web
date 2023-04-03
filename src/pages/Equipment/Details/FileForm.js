import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Form, Row, Col
} from '@hvisions/h-ui';
import { ImportButtonShowImg } from '~/components';
import { i18n } from '@hvisions/core';
const getFormattedMsg = i18n.getFormattedMsg;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
};

const FileForm = ({
  form: { getFieldDecorator, setFieldsValue }
}) => {
  const [fileIds, setFileIds] = useState([]);

  useEffect(() => {
    setFieldsValue({ file: fileIds });
  }, [fileIds]);

  const handleChangeImg = id => {
    fileIds.push(id);
    setFileIds(fileIds);
  };

  const handleChangeRemove = index => {
    fileIds.splice(index, 1);
    setFileIds(fileIds);
  };

  return (
    <Form>
      <Row>
        <Col span={24}>
          <FormItem {...formItemLayout} label={getFormattedMsg('file.label.uploadForFile')}>
            {getFieldDecorator('file', {
              rules: [{ required: true, message: getFormattedMsg('file.validate.placeholderForFile') }]
            })(
              <ImportButtonShowImg
                handleChangeRemove={handleChangeRemove}
                fileIds={fileIds}
                handleChangeImg={handleChangeImg}
                listType="picture"
                accept="*"
              />
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};
 
FileForm.propTypes = {
  form: PropTypes.object
};

export default Form.create()(FileForm);
