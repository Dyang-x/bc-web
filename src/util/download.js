/*
 * @Author: Andy
 * @Date: 2019-08-20 10:56:57
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-26 09:55:06
 */
export function downFile(data) {
  const { userAgent } = window.navigator;
  const blob = new Blob([s2ab(atob(data.body))], { type: 'application/vnd.ms-excel' });
  if (~userAgent.indexOf('Chrome')) {
    const objectUrl = URL.createObjectURL(blob);
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
}

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export default {
  downFile
};
