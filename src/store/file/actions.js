/*
 * @Author: Otway
 * @Date: 2019-08-22 17:42:03
 * @LastEditors: Otway
 * @LastEditTime: 2019-08-26 11:09:44
 * @copyright: h-visions
 */
import * as types from './types';
import { getAuthData } from '@hvisions/core/lib/utils/session';

const appName = '/file-management';

export const getFile = (search = {}, page = 1, size = 10) => async ({ api, dispatch }) => {
  try {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    const data = await api.post(`${appName}/file/getFileInfo`, { ...pageInfo, page: page - 1, ...search });
    dispatch({
      type: types.GET_FILE_LIST,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllType = () => async ({ api, dispatch }) => {
  try {
    const data = await api.get(`${appName}/fileType/findAllFileType`);
    dispatch({
      type: types.GET_TYPE,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getFileDetailBatch = list => async ({ api, dispatch }) => {
  try {
    const data = await api.post(`${appName}/file/getFileDetailBatch`, list);
    dispatch({
      type: types.GET_FILEDETAILBATCH,
      data
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const uploadFile = param => async ({ api }) => {
  try {
    const user = getAuthData();
    const data = new window.FormData();
    const res = await api.post(
      `${appName}/file/uploadFileByTypeName/${user.userName}?fileTypeName=${param.typeName}&tagNames=${param.tagNames}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res;
  } catch (err) {
    throw new Error(err);
  } 
};

export const deleteFile = id => ({ api }) => api.delete(`${appName}/file/deleteFileById/${id}`);

export const downloadFile = data => ({ api }) => api.get(`${appName}/file/downloadFileResult/${data.id}`);

export const getFileDetail = id => ({ api }) => api.get(`${appName}/file/getFileDetail/${id}`);
