import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class SemiFinisheDeliveryPalletSelection extends Service {
    //分页查询接口
    async getByQuery(data) {
      try {
        return await this.post(`${appName}/SemiMaterialOutWarehouseController/getByquery`, {
          ...data,
          direction: false,
          sort: true,
          sortCol: 'id'
        });
      } catch (error) {
        throw new Error(error);
      }
    }

  // 出库
  async outStore(dockingPoint,ids,readyMaterials) {
    try {
      return await this.put(`${appName}/SemiMaterialOutWarehouseController/outStore?dockingPoint=${dockingPoint}&ids=${ids}&readyMaterials=${readyMaterials}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new SemiFinisheDeliveryPalletSelection();
