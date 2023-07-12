import BaseService from "~/api/BaseService";

class StockStatistics extends BaseService {
  getLocationStock(data) {
    return this.post('/warehouse-service/stock/locationStock', {
      ...data,
      direction: false,
      sort: false,
      sortCol: 'id'
    })
  }

  getMaterialStock(data) {
    return this.post('/warehouse-service/stock/materialStock', {
      ...data,
      direction: false,
      sort: false,
      // sortCol: 'id'
    })
  }
}

export default new StockStatistics();