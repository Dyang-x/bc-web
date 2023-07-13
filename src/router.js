//备料位托盘管理
import PalletManagementStockLevel from '~/pages/PalletManagementStockLevel';
//接驳口托盘管理
import PalletManagementConnectionPort from '~/pages/PalletManagementConnectionPort';
//托盘管理
import PalletManagement from '~/pages/PalletManagement';

//空托盘入库
import EmptyPalletWarehousing from '~/pages/EmptyPalletWarehousing';
//空托盘出库
import EmptyPalletDelivery from '~/pages/EmptyPalletDelivery';

//原材料入库收料单
import RawMaterialWarehousing from '~/pages/RawMaterialWarehousing';
//原材料出库订单管理
import RawMaterialDelivery from '~/pages/RawMaterialDelivery';

//半成品入库收料单
import SemiFinishedWarehousing from '~/pages/SemiFinishedWarehousing';
import SemiFinishedWarehousing2 from '~/pages/SemiFinishedWarehousing2';
//半成品出库托盘拣选
import SemiFinisheDelivery from '~/pages/SemiFinisheDelivery';

//折弯机配置
import BendingConfiguration from '~/pages/BendingConfiguration';
import BendingMachine from './pages/BendingMachines/BendingMachine/index';
import BendingMachine1 from './pages/BendingMachines/BendingMachine1/index';
import BendingMachine2 from './pages/BendingMachines/BendingMachine2/index';
import BendingMachine3 from './pages/BendingMachines/BendingMachine3/index';
import BendingMachine4 from './pages/BendingMachines/BendingMachine4/index';
import BendingMachine5 from './pages/BendingMachines/BendingMachine5/index';


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

//看板总览
import ProductOverView from './pages/FullScreen/ProductOverview/index';
import J001OverView from './pages/FullScreen/J001/index';
import J002OverView from './pages/FullScreen/J002/index';
import J003OverView from './pages/FullScreen/J003/index';

//线边库
import WirelineStorage from './pages/WirelineStorage/index';

import StockStatistics from '~/pages/StockStatistics';

import Material from '~/pages/MaterialBlock';
import MaterialDetail from '~/pages/Material/Component/Detail';

import ManualPutInStorage from '~/pages/ManualPutInStorage'
import ManualInStorageOperate from '~/pages/ManualInStorageOperate'

import RetrievalManagerment from '~/pages/RetrievalManagerment'
import RetrievalOperate from '~/pages/RetrievalOperate'

export default [
  {
    path: '/product-fullScreen',
    component: ProductOverView
  }, {
    path: '/J001-fullScreen',
    component: J001OverView
  }, {
    path: '/J002-fullScreen',
    component: J002OverView
  }, {
    path: '/J003-fullScreen',
    component: J003OverView
  },


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
    component: EmptyPalletWarehousing
  },
  {
    path: '/empty-pallets-delivery',
    component: EmptyPalletDelivery
  },
  {
    path: '/raw-material-warehousing-receipt',
    component: RawMaterialWarehousing
  },
  {
    path: '/raw-material-delivery-order-management',
    component: RawMaterialDelivery
  },
  {
    path: '/semi-finished-warehousing-receipt',
    component: SemiFinishedWarehousing
  },
  {
    path: '/semi-finished-warehousing-receipt2',
    component: SemiFinishedWarehousing2
  },
  {
    path: '/semi-finishe-delivery-pallet-selection',
    component: SemiFinisheDelivery
  },
  {
    path: '/bending-machine-configuration',
    component: BendingConfiguration
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
    path: '/wireline_storage',
    component: WirelineStorage
  },


  {
    path: '/bending-machine',
    component: BendingMachine
  },
  {
    path: '/bending-machine1',
    component: BendingMachine1
  },
  {
    path: '/bending-machine2',
    component: BendingMachine2
  },
  {
    path: '/bending-machine3',
    component: BendingMachine3
  },
  {
    path: '/bending-machine4',
    component: BendingMachine4
  },
  {
    path: '/bending-machine5',
    component: BendingMachine5
  },

  {
    path: '/stock-statistics',
    component: StockStatistics
  },

  {
    path: '/manual-putInStorage',
    component: ManualPutInStorage,
    children: {
      path: '/manual-inStorage-operate',
      component: ManualInStorageOperate
    }
  },

  {
    path: '/retrieval-managerment',
    component: RetrievalManagerment,
    children: {
      path: '/retrieval-operate',
      component: RetrievalOperate
    }
  },


  {
    path: '/material',
    component: Material,
    children: {
      path: '/detail',
      component: MaterialDetail
    }
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
