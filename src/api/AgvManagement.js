import { Service } from '@hvisions/core';
const appName = '/warehouse-service';
class TaskOverviewServices extends Service {
  // 调整任务优先级
  async adjustPriority(id, priority) {
    try {
      return await this.put(`${appName}/taskagv/adjustPriority?id=${id}&priority=${priority}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 回退任务
  async backTask(id) {
    try {
      return await this.put(`${appName}/taskagv/backTask?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 继续任务
  async continueTask(id) {
    try {
      return await this.put(`${appName}/taskagv/continueTask?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 新增任务
  async createTaskview(data) {
    try {
      return await this.post(`${appName}/taskagv/create`, data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除任务
  async deleteById(id) {
    try {
      return await this.delete(`${appName}/taskagv/deleteById/${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 查询
  async findTaskView(data) {
    try {
      return await this.post(`${appName}/taskagv/findTaskView`, {
        ...data,
        direction: false,
        sort: true,
        sortCol: 'id'
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // 完成任务
  async finishTask(id) {
    try {
      return await this.put(`${appName}/taskagv/finishTask?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  // 暂停任务
  async suspendTask(id) {
    try {
      return await this.put(`${appName}/taskagv/suspendTask?id=${id}`);
    } catch (error) {
      throw new Error(error);
    }
  }


  async agvStatus(data) {
    try {
      return await this.post(`${appName}/task-management/agvStatus`,data);
    } catch (error) {
      throw new Error(error);
    }
  }

  async agvRequestIn(taskCode) {
    try {
      return await this.put(`${appName}/task-management/agvRequestIn?taskCode=${taskCode}`);
    } catch (error) {
      throw new Error(error);
    }
  }
  
}

export default new TaskOverviewServices();
