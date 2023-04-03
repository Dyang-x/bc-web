import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class PrepareAreaServices extends Service {
  // 更新备料口状态
  async addTransfer(areaCode, transferCode) {
    try {
      return await this.put(`${appName}/prepareArea/addTransfer?areaCode=${areaCode}&transferCode=${transferCode}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //新增备料口
  async createPrepareArea(data) {
    try {
      return await this.post(`${appName}/prepareArea/create`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deletePrepare(id) {
    try {
      return await this.delete(`${appName}/prepareArea/deletePrepare/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //查询
  async findByArea(data) {
    try {
      return await this.post(`${appName}/prepareArea/findByArea`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // 修改
  async updatePrepareArea(data) {
    try {
      return await this.post(`${appName}/prepareArea/update`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 更新备料口状态
  async updateState(areaCode, state) {
    try {
      return await this.put(`${appName}/prepareArea/updateState?areaCode=${areaCode}&state=${state}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new PrepareAreaServices();
