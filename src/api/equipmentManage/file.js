import { Service } from '@hvisions/core';

const appName = '/file-management';
class equipmentType extends Service {
  uploadFile(param) {
    try {
      // const user = getAuthData();
      const data = new window.FormData();
      data.append('file', param);
      return this.post(
        `/${appName}/file/uploadFile/test`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    } catch (err) {
      throw new Error(err);
    } 
  };
}

export default new equipmentType();
