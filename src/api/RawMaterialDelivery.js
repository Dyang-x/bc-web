import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class RawMaterialDelivery extends Service {
  //查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/RawMaterialOutWarehouse/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

    //手动出库单
    async handout(data) {
      try {
        return await this.post(`${appName}/RawMaterialOutWarehouse/handout`, data);
      } catch (error) {
        throw new Error(error);
      }
    }

}

export default new RawMaterialDelivery();
