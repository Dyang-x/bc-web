const user = require('./user').zh_CN;
const material = require('./material').zh_CN;
const bom = require('./bom').zh_CN;
const equipment = require('./equipment').zh_CN;
const PalletManagementStockLevel = require('./PalletManagementStockLevel').zh_CN;
const PalletManagementConnectionPort = require('./PalletManagementConnectionPort').zh_CN;
const EmptyPalletsWarehousing = require('./EmptyPalletsWarehousing').zh_CN;
const EmptyPalletDelivery = require('./EmptyPalletDelivery').zh_CN;
const RawMaterialWarehousingReceipt = require('./RawMaterialWarehousingReceipt').zh_CN;
const RawMaterialDeliveryOrderManagement = require('./RawMaterialDeliveryOrderManagement').zh_CN;
const SemiFinishedWarehousingReceipt = require('./SemiFinishedWarehousingReceipt').zh_CN;
const SemiFinisheDeliveryPalletSelection = require('./SemiFinisheDeliveryPalletSelection').zh_CN;
const BendingMachineConfiguration = require('./BendingMachineConfiguration').zh_CN;
const TaskOverview = require('./TaskOverview').zh_CN;
const AgvManagement = require('./AgvManagement').zh_CN;
const PalletManagement = require('./PalletManagement').zh_CN;
const global = require('./global').zh_CN;
const newWaresLocation = require('./newWaresLocation').zh_CN;
const SurplusInStorage = require('./SurplusInStorage').zh_CN;
const SemiFinishedReturn = require('./SemiFinishedReturn').zh_CN;
const TaskTransport = require('./TaskTransport').zh_CN;
const WirelineStorage = require('./WirelineStorage').zh_CN;

module.exports = {
  user,
  material,
  bom,
  equipment,
  PalletManagementStockLevel,
  PalletManagementConnectionPort,
  EmptyPalletsWarehousing,
  EmptyPalletDelivery,
  RawMaterialWarehousingReceipt,
  RawMaterialDeliveryOrderManagement,
  SemiFinishedWarehousingReceipt,
  SemiFinisheDeliveryPalletSelection,
  BendingMachineConfiguration,
  TaskOverview,
  AgvManagement,
  PalletManagement,
  global,
  newWaresLocation,
  SurplusInStorage,
  SemiFinishedReturn,
  TaskTransport,
  WirelineStorage
};
