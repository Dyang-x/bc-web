import { Service } from '@hvisions/core';
const appName = '/warehouse-service';

class LineEdgeLibraryController extends Service {

      // 新增修改
      async addOrUpdate(data) {
        try {
          return await this.post(`${appName}/LineEdgeLibraryController/addORupdate`, data);
        } catch (error) {
          throw new Error(error);
        }
      }

      //清空托盘号/任务号
      async cleanTrayNumberTaskCode(LocaltionName, fromLocation) {
        try {
          return await this.put(`${appName}/LineEdgeLibraryController/cleanTrayNumberTaskCode?LocaltionName=${LocaltionName}&fromLocation=${fromLocation}`);
        } catch (error) {
          throw new Error(error);
        }
      }

        // 删除
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/LineEdgeLibraryController/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

    // 根据id查询单据
    async getById(id) {
        try {
          return await this.get(`${appName}/LineEdgeLibraryController/getById/${id}`);
        } catch (error) {
          throw new Error(error);
        }
      }

      //查询接口
  async getByQuery(data) {
    try {
      return await this.post(`${appName}/LineEdgeLibraryController/getByquery`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  //手动剩余物料退库
  async handMaterialReturn(lineid) {
    try {
      return await this.put(`${appName}/LineEdgeLibraryController/handMaterialReturn?lineid=${lineid}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //更新上下料数据
  async updateHighLevel(lineid) {
    try {
      return await this.put(`${appName}/LineEdgeLibraryController/updateHighLevel?lineid=${lineid}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  //手动更新使用数量/剩余数量


  //任务更新使用数量/剩余数量
  async updateRemainderNum(LocaltionName, addremove, cuttingMachine) {
    try {
      return await this.put(`${appName}/LineEdgeLibraryController/updateRemainderNum?LocaltionName=${LocaltionName}&addremove=${addremove}&cuttingMachine=${cuttingMachine}`);
    } catch (error) {
      throw new Error(error);
    }
  }

}

export default new LineEdgeLibraryController();
