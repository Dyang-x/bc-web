import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class EmptyPalletsWarehousing extends Service {
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
    async finishById(data) {
      try {
        return await this.put(`${appName}/PalletInWarehouseController/finish`, data);
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

  //修改
  async saveOrUpdate(data) {
    try {
      return await this.post(`${appName}/PalletInWarehouseController/saveOrupdate`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new EmptyPalletsWarehousing();
