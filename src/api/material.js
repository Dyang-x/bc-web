import { Service } from '@hvisions/core';
const appName = '/materials-master-data';
class Material extends Service {
  getMaterial(search = {}, page = 1, size = 10) {
    const pageInfo = {
      pageSize: size,
      direction: false,
      sort: true,
      sortCol: 'id'
    };
    return this.post(`${appName}/material/getMaterialByNameOrCode`, {
      ...pageInfo,
      page: page - 1,
      ...search
    });
  }

  getMaterialSetting() {
    return this.get(`${appName}/material/getSetting`);
  }
  async updateSetting(data) {
    try {
      await this.post(`${appName}/material/updateSetting`, data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  getMaterialGroup() {
    return this.get(`${appName}/materialType/getAllMaterialType`);
  }
  async createMaterial(data) {
    try {
      await this.post(`${appName}/material/createMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMaterial(data) {
    try {
      await this.put(`${appName}/material/updateMaterial/`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteMaterial(id) {
    try {
      await this.delete(`${appName}/material/deleteMaterial/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  getAllUnit() {
    return this.get(`${appName}/unit/getAllUnit`);
  }
  exportMaterial() {
    return this.get(`${appName}/material/exportMaterials`);
  }
  async bindMaterialBom(data) {
    try {
      await this.post(`${appName}/material/createBomMaterial`, data);
    } catch (error) {
      throw new Error(error);
    }
  }
  getMaterialById(id) {
    return this.get(`${appName}/material/getMaterialById/${id}`);
  }
  getHvBmMaterialByMaterialCodeLike(datas) {
    return this.post(`${appName}/material/getHvBmMaterialByMaterialCodeLike`, datas);
  }
  getExtendColumns() {
    return this.get(`${appName}/material/getAllMaterialExtend`);
  }
  // getMaterial(data) {
  //   return this.post(`${appName}/material/getMaterialByNameOrCode`, data);
  // }

  // 添加物料类型
  async createMaterialType(data) {
    try {
      return await this.post(`${appName}/materialType/createMaterialType`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除物料类型
  async deleteMaterialTypeById(id) {
    try {
      await this.delete(`${appName}/materialType/deleteTypeById/${id}`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // 根据父级ID获取子节点
  async getMaterialTypeByParentId(id) {
    try {
      return await this.get(`${appName}/materialType/getMaterialTypeByParentId/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 根据分页信息以及物料类型查询物料类型列表

  async getMaterialTypeByQuery(data) {
    try {
      return await this.post(`${appName}/materialType/getMaterialTypeByQuery`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 更新物料类型列表
  async updateMaterialType(data) {
    try {
      await this.put(`${appName}/materialType/updateMaterialType`, data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // 获取所有的物料分组列表
  async getAllMaterialGroup() {
    try {
      return await this.get(`${appName}/materialGroup/getAllMaterialGroup`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 获取所有的物料类型列表
  async getAllMaterialType() {
    try {
      return await this.get(`${appName}/materialType/getAllMaterialType`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMaterialTypeArrByNodeId(id) {
    try {
      return await this.get(`${appName}/materialType/getParentIdBySonId/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMaterialByFeature() {
    return await this.post(`${appName}/material/getAllProductAndByProductByQuery`, {
      pageSize: 10000000
    });
  }

  async importMaterial(file) {
    try {
      const data = new window.FormData();
      data.append('file', file);
      return await this.post(`${appName}/material/importMaterial`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new Material();
