import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class EmptyPalletDelivery extends Service {
  //新增并下架
  async addAnddownShelves(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/addAnddownShelves`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  
  //自动空托盘出库
  async autoTransferOut(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/autoTransferOut`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //呼叫器空托盘出库
  // async callTransferOut(location) {
  //   try {
  //     return await this.put(`${appName}/PalletOutWarehouseController/callTransferOut?location=${location}`);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
  async callTransferOut(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/callTransferOut`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/PalletOutWarehouseController/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 下架
  async downShelves(id) {
    try {
      return await this.put(`${appName}/PalletOutWarehouseController/downShelves?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 完成
  async finishById(id) {
    try {
      return await this.put(`${appName}/PalletOutWarehouseController/finish?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据id查询单据
  async getById(id) {
    try {
      return await this.get(`${appName}/PalletOutWarehouseController/getById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //分页查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //新增/修改
  async saveOrUpdate(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/saveOrupdate`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //保存下架
  async saveStoreManual(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/saveStoreManual`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //手动空托出库
  async trayManual(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/trayManual`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 上架
  async upShelves(id) {
    try {
      return await this.put(`${appName}/PalletOutWarehouseController/upShelves/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new EmptyPalletDelivery();
