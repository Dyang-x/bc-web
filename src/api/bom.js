/*
 * @Author: Andy
 * @Date: 2019-08-18 15:29:35
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-20 23:41:09
 */
import { Service } from '@hvisions/core';
const appName = '/materials-master-data';

class Bom extends Service {

  getBomVersionByBomCode(code) {
    return this.get(`${appName}/bom/getBomVersionsByBomCode/${code}`);
  }

  getBomItemBomSubItemById(id) {
    return this.get(`${appName}/bom/getBomBomItemSubstituteItemById/${id}`);
  }

  async deleteBom(id) {
    try {
      await this.delete(`${appName}/bom/deleteBomById/${id}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createBom(data) {
    try {
      await this.post(`${appName}/bom/createBom`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async takeEffectBom(id) {
    try {
      await this.put(`${appName}/bom/setStatusTakeEffect/${id}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async copyNewBom(id, version) {
    try {
      await this.post(`${appName}/bom/copyBom/${id}/${version}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  getDetailTree(id) {
    return this.get(`${appName}/bom/getBomBomItemSubstituteItemById/${id}`);
  }
  getBomItem(id) {
    return this.get(`${appName}/bomItem/getBomItemById/${id}`);
  }
  getBomSubItem(id) {
    return this.get(`${appName}/SubstituteItem/getSubstituteItemById/${id}`);
  }
  async updateBom(data) {
    try {
      await this.put(`${appName}/bom/updateBom`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateBomItem(data) {
    try {
      await this.put(`${appName}/bomItem/updateBomItem`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async createBomItem(data) {
    try {
      await this.post(`${appName}/bomItem/createBomItem`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteBomItem(id) {
    try {
      await this.delete(`${appName}/bomItem/deleteBomItemById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createBomSubItem(data) {
    try {
      await this.post(`${appName}/SubstituteItem/createSubstituteItem`, data);
    } catch (error) {
      throw new Error(error);
    }
  }


  async updateBomSubItem(data) {
    try {
      await this.put(`${appName}/SubstituteItem/updateSubstituteItem`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteBomSubItem(data) {
    try {
      await this.delete(`${appName}/SubstituteItem/deleteSubstituteItemById/${data}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getExtendColumns() {
    return this.get(`${appName}/bom/getAllBomExtend`);
  }

  async getExtendBomItem() {
    return this.get(`${appName}/bomItem/getAllBomItemExtend`);
  }

  async getExtendBomSubItem() {
    return this.get(`${appName}/SubstituteItem/getAllSubstituteItemColumnExtend`);
  }
}
export default new Bom();
