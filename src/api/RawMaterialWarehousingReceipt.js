import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class RawMaterialWarehousingReceipt extends Service {
  //绑定物料
  async bindRawMaterial(data) {
    try {
      return await this.post(`${appName}/RawMaterialInWarehouse/bindRawMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/RawMaterialInWarehouse/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据id查询单据
  async getById(id) {
    try {
      return await this.get(`${appName}/RawMaterialInWarehouse/getById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //分页查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/RawMaterialInWarehouse/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // 称重
  async getWeigh(id) {
    try {
      return await this.put(`${appName}/RawMaterialInWarehouse/getWeigh?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 手动上架(receiptNumber入库单号,trayNumber托盘号)
  async handInStore(receiptNumber, trayNumber) {
    try {
      return await this.put(`${appName}/RawMaterialInWarehouse/handInStore?receiptNumber=${receiptNumber}&trayNumber=${trayNumber}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 入库
  async inStore(data) {
    try {
      return await this.post(`${appName}/RawMaterialInWarehouse/inStore/${data}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //修改
  async updateRawMaterial(data) {
    try {
      return await this.post(`${appName}/RawMaterialInWarehouse/updateRawMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new RawMaterialWarehousingReceipt();
