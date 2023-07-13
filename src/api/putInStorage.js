import { Service } from '@hvisions/core';

const appName = '/warehouse-service';

class PutInStorage extends Service {
  async getQueryList(data) {
    return await this.post(`${appName}/inWarehouseOrder/query`,{
      ...data,
      direction:false,
      sort: true,
      sortCol : 'id'
    });
  }
  // 入库 inWarehouseOrder/inStore/{id}
  async onInStore(id) {
    return await this.put(`${appName}/inWarehouseOrder/inStore/${id}`);
  }
  // 根据采购单创建入库单 inWarehouseOrder/createOrderByPurchaseOrder
  async createOrderByPurchaseOrder(number) {
    try {
      return await this.post(`${appName}/inWarehouseOrder/createOrderByPurchaseOrder?purchaseOrderNum=${number}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // inWarehouseOrder/addStoreByMaterial 采购单添加入库信息
  async addStoreByMaterial(data) {
    try {
      return await this.post(`${appName}/inWarehouseOrder/addStoreByMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  // /inWarehouseOrder/deleteDetail/{id} 删除入库单行信息

  async deleteDetail(id) {
    try {
      await this.delete(`${appName}/inWarehouseOrder/deleteDetail/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // 提交 /inWarehouseOrder/save

  async handleInStore(id) {
    try {
      await this.put(`${appName}/inWarehouseOrder/inStore/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // inWarehouseOrder/getById/{id}  根据id查询单据数量'
  async getOrderById(id) {
    try {
      return await this.get(`${appName}/inWarehouseOrder/getById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // inWarehouseOrder/createOrder 创建手动入库单

  async createManual() {
    try {
      return await this.post(`${appName}/inWarehouseOrder/createOrder`);
    } catch (error) {
      throw new Error(error);
    }
  }
  ///inWarehouseOrder/save 保存/只保存头表信息
  async saveHeaderInfo(data) {
    try {
      return await this.put(`${appName}/inWarehouseOrder/save`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  // inWarehouseOrder/addStoreManual 手动添加入库信息
  async addStoreManual(data) {
    try {
      return await this.post(`${appName}/inWarehouseOrder/addStoreManual`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  // /inWarehouseOrder/deleteLine/{id} 删除入库单行信息
  async deleteLine(id) {
    try {
      await this.delete(`${appName}/inWarehouseOrder/deleteLine/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  //删除入库单
  async deleteOrder(id) {
    try {
      await this.delete(`${appName}/inWarehouseOrder/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }


  async inShelf(owId) {
    try {
      return await this.put(`${appName}/inWarehouseOrder/inShelf/${owId}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new PutInStorage();
