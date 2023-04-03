import Service from './BaseService';
class CacheTable extends Service {
  getFormConfigByKey = async key => {
    try {
      return await this.get(`/auth/formConfig/getFormConfigByKey?tableKey=${key}`);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  saveFormConfig = async (key, data) => {
    try {
      return await this.post(`/auth/formConfig/saveFormConfig`, {
        columnMsg: data,
        tableKey: key
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

export default new CacheTable();
