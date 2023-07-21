import { Service } from '@hvisions/core';
const appName = '/warehouse-service/adjustOrder';
class AdjustService extends Service {
  async confirm(id) {
    return await this.put(`${appName}/confirm/${id}`);
  }

  async create(data) {
    return await this.post(`${appName}/create`, { ...data });
  }

  async createLine(data) {
    return await this.post(`${appName}/createLine`, data);
  }

  async deleteAdjustOrder(id) {
    return await this.delete(`${appName}/delete/${id}`);
  }

  async deleteLine(id) {
    await this.delete(`${appName}/deleteLine/${id}`);
  }

  async getLine(id) {
    return await this.get(`${appName}/getLine/${id}`);
  }

  async getPage(data) {
    return await this.post(`${appName}/getPage`, data);
  }

  async summary(id) {
    return await this.get(`${appName}/summary/${id}`);
  }
  async getHeader(id) {
    return await this.get(`${appName}/getHeader/${id}`);
  }
}
export default new AdjustService();
