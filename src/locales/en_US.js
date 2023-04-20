const user = require('./user').en_US;
const material = require('./material').en_US;
const bom = require('./bom').en_US;
const equipment = require('./equipment').en_US;
const PalletManagementStockLevel = require('./PalletManagementStockLevel').en_US;
const PalletManagementConnectionPort = require('./PalletManagementConnectionPort').en_US;
const EmptyPalletsWarehousing = require('./EmptyPalletsWarehousing').en_US;
const EmptyPalletDelivery = require('./EmptyPalletDelivery').en_US;
const RawMaterialWarehousingReceipt = require('./RawMaterialWarehousingReceipt').en_US;
const RawMaterialDeliveryOrderManagement = require('./RawMaterialDeliveryOrderManagement').en_US;
const SemiFinishedWarehousingReceipt = require('./SemiFinishedWarehousingReceipt').en_US;
const SemiFinisheDeliveryPalletSelection = require('./SemiFinisheDeliveryPalletSelection').en_US;
const BendingMachineConfiguration = require('./BendingMachineConfiguration').en_US;
const TransportSystem = require('./TransportSystem').en_US;
const TaskOverview = require('./TaskOverview').en_US;
const ReservoirPLC = require('./ReservoirPLC').en_US;
const AgvManagement = require('./AgvManagement').en_US;
const UpAndDown = require('./UpAndDown').en_US;
const PalletManagement = require('./PalletManagement').en_US;
const global = require('./global').en_US;
const newWaresLocation = require('./newWaresLocation').en_US;
const SurplusInStorage = require('./SurplusInStorage').en_US;
const SemiFinishedReturn = require('./SemiFinishedReturn').en_US;

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
  TransportSystem,
  TaskOverview,
  ReservoirPLC,
  AgvManagement,
  UpAndDown,
  PalletManagement,
  global,
  newWaresLocation,
  SurplusInStorage,
  SemiFinishedReturn,
};
