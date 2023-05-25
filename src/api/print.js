import { Service } from '@hvisions/core';
// const appName = '/printer';
const appName = '/printer-origin';
class PrintService extends Service {
    async print(data) {
        return await this.post(`${appName}/print/print`, data);
      };
    
      async getPage() {
        return await this.post(`${appName}/printer/getPage`, { page: 0,
          pageSize: 10000, direction: false, sort: true, sortCol: 'id' });
      };

      async getTemplate(id) {
        try {
            return await this.get(`${appName}/printTemplate/getByPrinterId/${id}`);
        } catch (error) {
            throw new Error(error);
        }
    }

}
export default new PrintService();