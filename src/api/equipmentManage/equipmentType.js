import { Service } from '@hvisions/core';

const appName = '/equipment-master-data';
class equipmentType extends Service {
  getAllEquipmentTypeList() {
    return this.get(
      `/${appName}/equipmentType/getAllEquipmentTypeList`
    );
  }
}

export default new equipmentType();
