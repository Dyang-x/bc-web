import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class Supplier extends Service {
  async getSupplierByQuery(data) {
    return await this.post(`/auth/supplier/getSupplierByQuery`, { ...data, direction: false, sort: true, sortCol: 'id' });
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

  async createSupplierExtend(data) {
    try {
      await this.post(`${appName}/supplier/createSupplierExtend`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllSupplierExtend() {
    try {
      return await this.get(`${appName}/supplier/getAllSupplierExtend`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSupplierExtend(columnName) {
    try {
      await this.delete(`${appName}/supplier/deleteSupplierExtend/${columnName}`);
    } catch (error) {
      throw new Error(error);
    }
  }


  async importSupplier(file) {
    try {
      const data = new window.FormData();
      data.append('file', file);
      return await this.post(`${appName}/supplier/importSupplier`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async exportSupplier() {
    try {
      return await this.get(`${appName}/supplier/exportSupplier`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSupplierImportTemplate() {
    try {
      return await this.get(`${appName}/supplier/getSupplierImportTemplate`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new Supplier();
