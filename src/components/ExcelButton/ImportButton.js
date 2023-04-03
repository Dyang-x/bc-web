/*
 * @Author: Andy
 * @Date: 2019-08-26 09:47:33
 * @LastEditors: Otway
 * @LastEditTime: 2019-08-29 15:41:33
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Upload, Button, notification } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';

const { getFormattedMsg } = i18n;

class ImportButton extends PureComponent {
  state = {
    btnLoading: false
  }
  handleBeforeUpload = file => {
    this.onHandleImport(file);
    return false;
  }

  // action:内容，比如新增成功中的{新增},导入成功中的{导入}；
  // ImportClose: 关闭窗口方法
  // acceptStr: 文件类型过滤，如{.txt,.xlxs}

  onHandleImport = async file => {
    try {
      const {
        paramter, action, ImportClose, getFileId
      } = this.props;
      let data;
      await this.setState({ btnLoading: true });
      if (paramter) {
        data = await this.props.onUpload({ file, ...paramter });
      } else {
        data = await this.props.onUpload(file);
      }
      if (data && !isEmpty(data.errorLines)) {
        Object.keys(data.errorLines).forEach(line => {
          notification.warning({
            message: `第${line}行异常`,
            description: data.errorLines[line]
          });
        });
      }
      if (getFileId) {
        getFileId(data.id);
      }
      await this.setState({ btnLoading: false });
      if (ImportClose) {
        ImportClose();
      }
      if (action) {
        notification.success({
          message: getFormattedMsg('global.notify.success', { action })
        });
      }
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  }

  render() {
    const { Widget, acceptStr, style, type, icon } = this.props;
    return (
      <Upload showUploadList={false} accept={acceptStr} beforeUpload={this.handleBeforeUpload}>
        <Widget loading={this.state.btnLoading} icon={icon} style={style} type={type}>{this.props.children}</Widget>
      </Upload>
    );
  }
}

ImportButton.propTypes = {
  paramter: PropTypes.object,
  onUpload: PropTypes.func,
  getFileId: PropTypes.func,
  children: PropTypes.any,
  Widget: PropTypes.any,
  acceptStr: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  action: PropTypes.string,
  ImportClose: PropTypes.func,
  icon: PropTypes.string
};

ImportButton.defaultProps = {
  Widget: Button
};

export default ImportButton;
