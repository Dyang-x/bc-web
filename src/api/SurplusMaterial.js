import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class SurplusMaterial extends Service {

  // 新增入库
  async addSurplus(data) {
    try {
      return await this.post(`${appName}/SurplusMaterialController/addSurplus`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/SurplusMaterialController/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 查询
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/SurplusMaterialController/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new SurplusMaterial();
