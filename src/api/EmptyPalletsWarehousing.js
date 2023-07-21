import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class EmptyPalletsWarehousing extends Service {
  //新增并上架
  async addAndupShelves(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/addAndupShelves`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //自动空托盘入库
  async autoTransferIn(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/autoTransferIn`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //呼叫器托盘回库
  // async callTransferIn(location) {
  //   try {
  //     return await this.put(`${appName}/PalletInWarehouseController/callTransferIn?location=${location}`);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
  async callTransferIn(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/callTransferIn`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/PalletInWarehouseController/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 下架
  async downShelves(id) {
    try {
      return await this.put(`${appName}/PalletInWarehouseController/downShelves?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 完成
  async finishById(id) {
    try {
      return await this.put(`${appName}/PalletInWarehouseController/finish?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据id查询单据
  async getById(id) {
    try {
      return await this.get(`${appName}/PalletInWarehouseController/getById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //分页查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/getByquery`, {
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
      return await this.post(`${appName}/PalletInWarehouseController/saveOrupdate`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //手动空托入库
  async trayManual(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/trayManual`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //上架
  async upShelves(id) {
    try {
      return await this.put(`${appName}/PalletInWarehouseController/upShelves?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new EmptyPalletsWarehousing();
