import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class ReadIOT extends Service {
  //更新状态
  async updateStrategy(state) {
    try {
      return await this.get(`${appName}/readiot/updateStrategy?state=${state}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //获取策略状态
  async getStrategy() {
    try {
      return await this.get(`${appName}/readiot/getStrategy`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findPlan(data) {
    try {
      return await this.post(`${appName}/readiot/findPlan`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new ReadIOT();
