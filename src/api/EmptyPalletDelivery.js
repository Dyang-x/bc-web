import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class EmptyPalletDelivery extends Service {
  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/PalletOutWarehouseController/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 下架
  async downShelves(data) {
    try {
      return await this.put(`${appName}/PalletOutWarehouseController/downShelves`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

    // 完成
    async finishById(data) {
      try {
        return await this.put(`${appName}/PalletOutWarehouseController/finish`, data);
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

  //修改
  async saveOrUpdate(data) {
    try {
      return await this.post(`${appName}/PalletOutWarehouseController/saveOrupdate`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new EmptyPalletDelivery();
