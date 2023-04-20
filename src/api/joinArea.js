
import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class joinAreaServices extends Service {

  // 更新接驳口状态
  async addTransfer(joinCode, transferCode) {
    try {
      return await this.put(`${appName}/joinArea/addTransfer?joinCode=${joinCode}&transferCode=${transferCode}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //新增接驳口
  async addJoinAre(data) {
    try {
      return await this.post(`${appName}/joinArea/create`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  async deleteJoin(id) {
    try {
      return await this.delete(`${appName}/joinArea/deleteJoin/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 移动接驳口托盘
  async deleteTransfer(joinCode, transferCode) {
    try {
      return await this.put(`${appName}/joinArea/deleteTransfer?joinCode=${joinCode}&transferCode=${transferCode}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 查询
  async findJoin() {
    try {
      return await this.get(`${appName}/joinArea/findJoin`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //修改接驳口
  async updateJoinAre(data) {
    try {
      return await this.post(`${appName}/joinArea/update`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 更新接驳口状态
  async updateState(joinCode, state) {
    try {
      return await this.put(`${appName}/joinArea/updateState?joinCode=${joinCode}&state=${state}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new joinAreaServices();
