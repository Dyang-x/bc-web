import { Service } from '@hvisions/core';

const appName = '/warehouse-service';

class PutInStorage extends Service {
  async getQueryList(data) {
    return await this.post(`${appName}/stockout/getPage`,{
      ...data,
      direction:false,
      sort: true,
      sortCol : 'id'
    });
  }
  // 完成出库库 /stockout/complete/{owId}
  async onInStore(id) {
    return await this.put(`${appName}/stockout/complete/${id}`);
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
  //  stockout/deleteBatch/{batchId} 删除批次详情

  async deleteDetail(id) {
    try {
      await this.delete(`${appName}/stockout/deleteBatch/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // 完成

  async handleInStore(id) {
    try {
      await this.put(`${appName}/stockout/complete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // /stockout/getByOwId/{owId}
  async getOrderById(id) {
    try {
      return await this.get(`${appName}/stockout/getByOwId/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // inWarehouseOrder/createOrder 创建手动出库单

  async createManual() {
    try {
      return await this.get(`${appName}/stockout/create`);
    } catch (error) {
      throw new Error(error);
    }
  }
  ///inWarehouseOrder/save 保存/只保存头表信息
  async saveHeaderInfo(data) {
    try {
      await this.post(`${appName}/stockout/save`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  //手动添加出库信息
  async addStoreManual(data) {
    try {
      return await this.post(`${appName}/stockout/out`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  // stockout/deleteDetail/{outingLineId}删除出库清单
  async deleteLine(id) {
    try {
      await this.delete(`${appName}/stockout/deleteDetail/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  // 根据出库单id删除出库单

  async deleteRetrievalById(id) {
    try {
      await this.delete(`${appName}/stockout/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 创建出库清单
  async createLine(data) {
    try {
      return await this.post(`${appName}/stockout/createLine`, data);
    } catch (error) {
      throw new Error(error);
    }
  }



// 下架
  async outShelf(owId) {
    try {
      await this.put(`${appName}/stockout/outShelf/${owId}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new PutInStorage();
