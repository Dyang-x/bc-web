import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class TransferBoxServices extends Service {
  //添加中转箱物料
  async addMaterial(data) {
    try {
      return await this.post(`${appName}/transferBox/addMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 清除中转箱所有物料
  async clearBox(id) {
    try {
      return await this.delete(`${appName}/transferBox/clearBox/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //新增
  async createBox(data) {
    try {
      return await this.post(`${appName}/transferBox/create`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除中转箱信息
  async deleteBox(id) {
    try {
      return await this.delete(`${appName}/transferBox/delete/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据编号获取中转箱信息
  async findByCode(code) {
    try {
      return await this.get(`${appName}/transferBox/findByCode/${code}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 获取中转箱信息
  async findById(id) {
    try {
      return await this.get(`${appName}/transferBox/findById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //获取中转箱分页数据
  async getPage(data) {
    // try {
      return await this.post(`${appName}/transferBox/getPage`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    // } catch (error) {
    //   throw new Error(error);
    // }
  }

  // 托盘绑定
  async lockLocation(locationId, transferId) {
    try {
      return await this.put(`${appName}/transferBox/lockLocation?locationId=${locationId}&transferId=${transferId}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 移除中转箱物料
  async removeMaterial(id) {
    try {
      return await this.delete(`${appName}/transferBox/removeMaterial/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 托盘解绑
  async unLockLocation(transferId) {
    try {
      return await this.put(`${appName}/transferBox/unLockLocation?transferId=${transferId}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 修改
  async updateBox(data) {
    try {
      return await this.put(`${appName}/transferBox/update`, data);
    } catch (error) {
      throw new Error(error);
    }
  }


}

export default new TransferBoxServices();
