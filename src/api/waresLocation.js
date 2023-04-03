import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class WaresLocation extends Service {
  async getLocationByQuery(data) {
    return await this.post(`${appName}/warehouse/getLocationByQuery`, { ...data, direction: false, sort: true, sortCol: 'id' });
  }

  async createWaresLocation(data) {
    try {
      return await this.post(`${appName}/warehouse/createWaresLocation`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateWaresLocation(data) {
    try {
      return await this.put(`${appName}/warehouse/updateWaresLocation`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteWareLocation(id) {
    try {
      await this.delete(`${appName}/warehouse/deleteWareLocation/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createLocationRule(data) {
    try {
      return await this.post(`${appName}/warehouse/createLocationRule`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateLocationRule(data) {
    try {
      return await this.put(`${appName}/warehouse/updateLocationRule`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRuleByLocationId(id) {
    try {
      return await this.get(`${appName}/warehouse/getRuleByLocationId/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllMaterials() {
    try {
      return await this.get(`/materials-master-data/materials/getAllMaterials`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteLocationRule(id) {
    try {
      return await this.delete(`${appName}/warehouse/deleteLocationRule/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByQuery() {
    try {
      return await this.post(`${appName}/warehouse/findAllByQuery`, {});
    } catch (error) {
      throw new Error(error);
    }
  }

  async synchronize(id) {
    try {
      return await this.put(`${appName}/warehouse/synchronize?locationId=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMaterials(params) {
    try {
      return await this.post(`/materials-master-data/material/getMaterial`, params);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new WaresLocation();
