import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class Stock extends Service {
  async getAllByQuery(data) {
    return await this.post(`${appName}/stock/getAllByQuery`, {
      ...data,
      direction: false,
      sort: true,
      sortCol: 'id'
    });
  }

  async export() {
    try {
      return await this.get(`${appName}/stock/exportLinker`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createSupplier(data) {
    try {
      await this.post(`${appName}/supplier/createSupplier`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSupplier(data) {
    try {
      await this.put(`${appName}/supplier/updateSupplier`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSupplierById(id) {
    try {
      await this.delete(`${appName}/supplier/deleteSupplierById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getHistoryByQuery(data) {
    return await this.post(`${appName}/history/getHistoryByQuery`, {
      ...data,
      direction: false,
      sort: true,
      sortCol: 'id'
    });
  }

  async getOccupy(id) {
    try {
      return await this.get(`${appName}/stock/getOccupy/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new Stock();
