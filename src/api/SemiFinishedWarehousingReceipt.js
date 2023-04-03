import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class SemiFinishedWarehousingReceipt extends Service {
  //新增
  async bindSemiMaterial(data) {
    try {
      return await this.post(`${appName}/SemiMaterialInWarehouseController/bindSemiMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/SemiMaterialInWarehouseController/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据id查询单据
  async getById(id) {
    try {
      return await this.get(`${appName}/SemiMaterialInWarehouseController/getById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 称重
  async getWeigh(id) {
    try {
      return await this.put(`${appName}/SemiMaterialInWarehouseController/getWeigh?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 入库
  async inStore(id) {
    try {
      return await this.put(`${appName}/SemiMaterialInWarehouseController/inStore/${id}` );
    } catch (error) {
      throw new Error(error);
    }
  }

  //分页查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/SemiMaterialInWarehouseController/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //修改
  async updateSemiMaterial(data) {
    try {
      return await this.post(`${appName}/SemiMaterialInWarehouseController/updateSemiMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new SemiFinishedWarehousingReceipt();
