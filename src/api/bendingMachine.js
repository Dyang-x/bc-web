import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class bendingMachineServices extends Service {
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

  //修改
  async addOrUpdate(data) {
    try {
      return await this.post(`${appName}/BendingMachineController/addORupdate`, data);
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
}

export default new bendingMachineServices();
