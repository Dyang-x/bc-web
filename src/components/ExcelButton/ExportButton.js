/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-26 13:19:37
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, notification } from '@hvisions/h-ui';

class ExportButton extends PureComponent {
  s2ab = s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

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
  };

  render() {
    const { Widget, type, style, icon } = this.props;
    return (
      <Widget style={style} type={type} icon={icon} onClick={this.onHandleExport}>
        {this.props.children}
      </Widget>
    );
  }
}

ExportButton.propTypes = {
  paramter: PropTypes.object,
  onExport: PropTypes.func,
  children: PropTypes.any,
  Widget: PropTypes.any,
  type: PropTypes.string,
  style: PropTypes.object,
  icon: PropTypes.any
};

ExportButton.defaultProps = {
  Widget: Button
};

export default ExportButton;
