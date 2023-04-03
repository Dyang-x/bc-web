import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, notification } from '@hvisions/h-ui';

import ToolBar from './ToolBar';
import styles from './style.scss';

class Item extends Component {
  onHandleItemClick = () => {
    const { data, onItemClick } = this.props;
    if (onItemClick) {
      onItemClick(data);
    }
  }

  handleClick = type => {
    const {
      data,
      onEdit,
      onRemove, 
      onCopy,
      onFile
    } = this.props;
    if (type === 'edit' && onEdit) {
      onEdit(data);
    }
    if (type === 'delete' && onRemove) {
      onRemove(data);
    }
    if (type === 'copy' && onCopy) {
      onCopy(data);
    }
    if (type === 'search' && onFile) {
      this.onHandleFile(data);
    }
  }

  onHandleFile = async data => {
    const { onFile } = this.props;
    try {
      const fileData = await onFile(data);
      const suffixArray = fileData.fileName.split('.');
      const suffix = suffixArray[suffixArray.length - 1];
      const suffixImgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
      const suffixTxtList = ['txt'];
      const suffixPdfList = ['pdf'];
      let types = '';
      if (suffixImgList.indexOf(suffix) !== -1) {
        types = 'image/jpeg';
      } else if (suffixTxtList.indexOf(suffix) !== -1) {
        types = 'text/plain';
      } else if (suffixPdfList.indexOf(suffix) !== -1) {
        types = 'application/pdf';
      } else {
        notification.warning({
          message: `不支持${suffix}类型的预览`
        });
        return;
      }
      const { userAgent } = window.navigator;
      const blob = new Blob([this.s2ab(atob(fileData.body))], { type: types });
      if (~userAgent.indexOf('Chrome')) {
        const url = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = url;
        tempLink.setAttribute('target', '_blank');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(url);
      } else {
        window.navigator.msSaveBlob(blob, fileData.fileName);
      }
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  }

  s2ab = s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }


  renderItemTitle = () => {
    const {
      title,
      data,
      renderItemTitle,
      tools
    } = this.props;
    if (renderItemTitle) {
      return (
        <Fragment>
          <div className={styles['card-title-style']}>
            {renderItemTitle(data)}
          </div>
          <ToolBar tools={tools} onClick={this.handleClick} />
        </Fragment>
      );
    }
    if (title) {
      return data[title];
    }
    return null;
  }

  renderactionsTitle = () => {
    const { data, renderactionsTitle } = this.props;
    if (renderactionsTitle) {
      return renderactionsTitle(data);
    }
    return null;
  }

  render() {
    const {
      url,
      data,
      isAdd, 
      width,
      height,
      children,
      onAdd,
      className,
      onItemClick,
      cardHeadStyle,
      cardBodyStyle
    } = this.props;

    const itemStyle = {
      width,
      height,
      position: 'relative',
      cursor: onItemClick || url ? 'pointer' : 'auto',
      borderRadius: 4
    };
    if (isAdd) {
      return (
        <Card
          className={styles['card-add']}
          style={{
            width,
            height,
            lineHeight: `${height - 20}px`,
            borderRadius: 4
          }}
          onClick={onAdd}
        >
          <span>+</span>
        </Card>
      );
    }
    let cardItem;
    if (this.renderactionsTitle() === null) {
      cardItem = (
        <Card
          className={[styles['card-item'], className]}
          style={itemStyle}
          onClick={this.onHandleItemClick}
          title={this.renderItemTitle()}
          headStyle={cardHeadStyle}
          bodyStyle={cardBodyStyle}
        >
          {children}
        </Card>
      );
    } else {
      cardItem = (
        <Card
          className={[styles['card-item'], className]}
          style={itemStyle}
          onClick={this.onHandleItemClick}
          actions={[this.renderactionsTitle()]}
          title={this.renderItemTitle()}
          headStyle={cardHeadStyle}
          bodyStyle={cardBodyStyle}
        >
          {children}
        </Card>
      );
    }
    

    if (url) {
      let formatUrl = url;
      Object.keys(data).forEach(key => {
        formatUrl = formatUrl.replace(new RegExp('\\{' + key + '\\}', 'g'), data[key]);
      });
      return <Link to={formatUrl}>{cardItem}</Link>;
    }

    return cardItem;
  }
}

Item.propTypes = {
  /**
   * Link跳转的URL
   */
  url: PropTypes.string,
  /**
   * Card外部传入的自定义样式
   */
  className: PropTypes.string,
  /**
   * Card外部传入的title样式
   */
  cardHeadStyle: PropTypes.object,
  /**
   * Card外部传入的body样式
   */
  cardBodyStyle: PropTypes.object,
  /**
   * 配置显示标题的KEY
   */
  title: PropTypes.string,
  /**
   * action
   */
  renderactionsTitle: PropTypes.func,
  /**
   * 每一个Item渲染的数据
   */
  data: PropTypes.object,
  /**
   * 当前Item是否是添加样式
   */
  isAdd: PropTypes.bool,
  /**
   * 工具栏
   * e.g. ['edit', 'delete']
   */
  tools: PropTypes.array,
  /**
   * 外部配置Card宽度和高度，支持数值(px)和字符串(px, %)
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  /**
   * 自定义标题内容
   * @param data 当前Card的数据
   * e.g. <div>{data.xxx}</div>
   */
  renderItemTitle: PropTypes.func,
  /** 新增按钮事件 */
  onAdd: PropTypes.func,
  /** 编辑按钮事件 */
  onEdit: PropTypes.func,
  /** 复制事件 */
  onCopy: PropTypes.func,
  /** 预览文件方法 */
  onFile: PropTypes.func,
  /** 删除按钮事件 */
  onRemove: PropTypes.func,
  /** Card单击按钮事件 */
  onItemClick: PropTypes.func,
};

Item.defaultProps = {
  isAdd: false,
  width: 200,
  height: 200,
};

export default Item;
