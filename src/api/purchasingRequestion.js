import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class PurchasingRequisition extends Service {

  // 通过id获取采购单
  async getPurchaseById(id) {
    return await this.get(`${appName}/purchaseOrder/getPurchaseById/${id}`);
  }
  // 创建采购单
  async createPurchase(data) {
    try {
      return await this.post(`${appName}/purchaseOrder/createPurchase`, data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // 获取物料信息
  async getMaterial(data) {
    return await this.post(`/materials-master-data/material/getMaterial`, {
      ...data,
      direction: false,
      sort: true,
      sortCol: 'id'
    });
  }
  // 添加采购单行数据
  
  async createPurchaseLine(data) {
    return await this.post(`${appName}/purchaseOrder/createPurchaseLine`, data);
  }
  // 删除申请单行数据 purchaseOrder/deletePurchaseLine/{lineId}

  async deletePurchaseLine(id){
    return await this.delete(`${appName}/purchaseOrder/deletePurchaseLine/${id}`)
  }
  // 修改采购单
  async updatePurchase(data) {
    try {
      return await this.put(`${appName}/purchaseOrder/updatePurchase`, data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default new PurchasingRequisition();
