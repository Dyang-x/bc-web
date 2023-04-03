import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { concat, indexOf } from 'lodash';
import { Upload, Button, notification, Icon, Modal } from '@hvisions/h-ui';
import { styles } from './ImportButtonShowImg.scss';
import fileSerivcs from '~/api/equipmentManage/file';
import { i18n } from '@hvisions/toolkit';

const { getFormattedMsg } = i18n;

class ImportButtonShowImg extends Component {
  state = {
    previewImage: '',
    previewVisible: false,
    fileList: [],
    list: []
  };

  async componentDidMount() {
    const { fileIds } = this.props;
    const { fileList } = this.state;
    fileIds.forEach((item, index) => {
      fileList.push({
        uid: index,
        name: item,
        status: 'done',
        url: `http://${process.env.__API_HOST__}:${process.env.__API_PORT__}/file-management/file/downloadFile/${item}`
      });
      this.setState({
        fileList
      });
    });
  }

  handleBeforeUpload = file => {
    this.onHandleImport(file);
    return false;
  }

  onHandleImport = async file => {
    try {
      const data = await fileSerivcs.uploadFile(file);
      this.props.handleChangeImg(data.id);
      notification.success({
        message: '导入成功'
      });
    } catch (err) {
      notification.warning({
        message: err.message
      });
    }
  }

  handleBeforeUpload = file => {
    this.onHandleImport(file);
    return false;
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl || file.body,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  onRemoveImg = file => {
    const { fileList } = this.state;
    try {
      const index = indexOf(fileList, file);
      if (index > -1) {
        this.props.handleChangeRemove(index);
        notification.success({
          message: '删除成功'
        });
      }
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  }

  renderButton = () => {
    if (this.props.accept === '*') {
      return <Button type="primary" icon="upload">{getFormattedMsg('file.label.uploadForFile')}</Button>;
    } else {
      return (
        <div>
          <Icon type="plus" />
          <div>{getFormattedMsg('file.label.uploadForFile')}</div>
        </div>
      );
    }
  }

  render() {
    const { previewImage, previewVisible, fileList, list } = this.state;
    const { listType, accept } = this.props;
    const props = {
      beforeUpload: this.handleBeforeUpload,
      listType,
      accept,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      fileList,
      onRemove: this.props.isRemove ? this.onRemoveImg : false,
      headers: {
        authorization: 'authorization-text',
      }
    };

    return (
      <Fragment>
        <Upload {...props}>
          {fileList.length >= this.props.count || !this.props.btn ? null : this.renderButton()}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  }
}

ImportButtonShowImg.propTypes = {
  handleChangeImg: PropTypes.func,
  uploadFile: PropTypes.func,
  deleteFile: PropTypes.func,
  fileIds: PropTypes.array,
  count: PropTypes.number,
  handleChangeRemove: PropTypes.func,
  downloadFile: PropTypes.func,
  btn: PropTypes.bool,
  isRemove: PropTypes.bool,
  listType: PropTypes.string,
  accept: PropTypes.string,
};

ImportButtonShowImg.defaultProps = {
  count: 100,
  btn: true,
  isRemove: true,
  listType: 'picture-card',
  accept: 'image/*'
};

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
})(ImportButtonShowImg);
