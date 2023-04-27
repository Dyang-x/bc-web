import Example from '~/pages/Example';
import MaterialForCompent from '~/pages/Example';
import Bom from '~/pages/Bom';
import Equipment from '~/pages/Equipment';
import EquipmentDetails from '~/pages/Equipment/Details';


//备料位托盘管理
import PalletManagementStockLevel from '~/pages/PalletManagementStockLevel';
//接驳口托盘管理
import PalletManagementConnectionPort from '~/pages/PalletManagementConnectionPort';
//托盘管理
import PalletManagement from '~/pages/PalletManagement';

//空托盘入库
import EmptyPalletsWarehousing from '~/pages/EmptyPalletsWarehousing';
//空托盘出库
import EmptyPalletDelivery from '~/pages/EmptyPalletDelivery';

//原材料入库收料单
import RawMaterialWarehousingReceipt from '~/pages/RawMaterialWarehousingReceipt';
//原材料出库订单管理
import RawMaterialDeliveryOrderManagement from '~/pages/RawMaterialDeliveryOrderManagement';

//半成品入库收料单
import SemiFinishedWarehousingReceipt from '~/pages/SemiFinishedWarehousingReceipt';
//半成品出库托盘拣选
import SemiFinisheDeliveryPalletSelection from '~/pages/SemiFinisheDeliveryPalletSelection';

//折弯机配置
import BendingMachineConfiguration from '~/pages/BendingMachineConfiguration';

//转运系统
import TransportSystem from '~/pages/TransportSystem';
//任务总览
import TaskOverview from '~/pages/TaskOverview';
//库区PLC
import ReservoirPLC from '~/pages/ReservoirPLC';
//AGV
import AgvManagement from '~/pages/AgvManagement';

//上下料
import UpAndDownOn from '~/pages/UpAndDownOn';

//库位管理
import NewWaresLocation from '~/pages/NewWaresLocation';

//余料入库
import SurplusInStorage from '~/pages/SurplusInStorage';

//余料入库
import SemiFinishedReturn from '~/pages/SemiFinishedReturn';

export default [

  {
    path: '/pallet-management-stock-level',
    component: PalletManagementStockLevel
  },
  {
    path: '/pallet-management-connection-port',
    component: PalletManagementConnectionPort
  },
  {
    path: '/pallet-management',
    component: PalletManagement
  },
  {
    path: '/empty-pallets-warehousing',
    component: EmptyPalletsWarehousing
  },
  {
    path: '/empty-pallets-delivery',
    component: EmptyPalletDelivery
  },
  {
    path: '/raw-material-warehousing-receipt',
    component: RawMaterialWarehousingReceipt
  },
  {
    path: '/raw-material-delivery-order-management',
    component: RawMaterialDeliveryOrderManagement
  },
  {
    path: '/semi-finished-warehousing-receipt',
    component: SemiFinishedWarehousingReceipt
  },
  {
    path: '/semi-finishe-delivery-pallet-selection',
    component: SemiFinisheDeliveryPalletSelection
  },
  {
    path: '/bending-machine-configuration',
    component: BendingMachineConfiguration
  },
  {
    path: '/transport-system',
    component: TransportSystem
  },
  {
    path: '/taskOverview',
    component: TaskOverview
  },
  {
    path: '/reservoirPLC',
    component: ReservoirPLC
  },
  {
    path: '/agvManagement',
    component: AgvManagement
  },
  {
    path: '/upAndDownOn',
    component: UpAndDownOn
  },
  {
    path: '/wares-location-v2',
    component: NewWaresLocation
  },
  {
    path: '/surplus_putInStorage',
    component: SurplusInStorage
  },
  {
    path: '/semi_finishe_return',
    component: SemiFinishedReturn
  },
  
  // 以下是示例功能代码， 正式开发时请删除
  // {
  //   path: '/user',
  //   component: Example
  // },
  // {
  //   path: '/material',
  //   component: MaterialForCompent
  // },
  // {
  //   path: '/bom',
  //   component: Bom
  // },
  // {
  //   path: '/equipment',
  //   component: Equipment,
  //   children: {
  //     path: '/:id',
  //     component: EquipmentDetails
  //   }
  // }
];
