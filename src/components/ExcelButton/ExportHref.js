/*
 * @Author: Andy
 * @Date: 2019-08-26 09:47:33
 * @LastEditors: Otway
 * @LastEditTime: 2019-08-26 14:45:30
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { notification } from '@hvisions/h-ui';

class ExportHref extends PureComponent {
  s2ab = s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  onHandleExport = async () => {
    const { onExport, paramter } = this.props;
    if (!onExport) return;
    try {
      let data;
      if (paramter) {
        data = await onExport(paramter);
      } else {
        data = await onExport();
      }

      const { userAgent } = window.navigator;
      const blob = new Blob([this.s2ab(atob(data.body))], { type: 'application/vnd.ms-excel' });
      if (~userAgent.indexOf('Chrome')) {
        const objectUrl = URL.createObjectURL(blob);
        // window.location.href = objectUrl
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = objectUrl;
        tempLink.setAttribute('download', data.fileName);
        tempLink.setAttribute('target', '_blank');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(objectUrl);
      } else {
        window.navigator.msSaveBlob(blob, data.fileName);
      }
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  }

  render() {
    const { type, style } = this.props;
    return <a style={style} type={type} onClick={this.onHandleExport}>{this.props.children}</a>;
  }
}

ExportHref.propTypes = {
  paramter: PropTypes.object,
  onExport: PropTypes.func,
  children: PropTypes.any,
  type: PropTypes.string,
  style: PropTypes.object
};

export default ExportHref;
