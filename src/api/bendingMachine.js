import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class bendingMachineServices extends Service {
  //新增/修改
  async addOrUpdate(data) {
    try {
      return await this.post(`${appName}/BendingMachineController/addORupdate`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

    //余料入库
    async addSurplusMaterial(data) {
      try {
        return await this.post(`${appName}/BendingMachineController/addSurplusMaterial`, data);
      } catch (error) {
        throw new Error(error);
      }
    }

  //新增托盘
  async addTransfer(bendingNumber, transferCode) {
    try {
      return await this.put(`${appName}/BendingMachineController/addTransfer?bendingNumber=${bendingNumber}&transferCode=${transferCode}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/BendingMachineController/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //移除托盘
  async deleteTransfer(bendingNumber) {
    try {
      return await this.put(`${appName}/BendingMachineController/deleteTransfer?bendingNumber=${bendingNumber}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //分页查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/BendingMachineController/getByquery`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  //更新状态
  async updateState(bendingNumber, state) {
    try {
      return await this.put(`${appName}/BendingMachineController/updateState?bendingNumber=${bendingNumber}&state=${state}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new bendingMachineServices();
