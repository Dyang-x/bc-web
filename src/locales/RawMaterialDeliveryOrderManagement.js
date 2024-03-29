/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 10:59:20
 */
module.exports = {
  en_US: {
    title:{
      orderNumber: 'orderNumber',
      orderCount: 'orderCount',
      finishNumber: 'finishNumber',
      surplusNumber: 'surplusNumber',
      orderPriority: 'orderPriority',
      // cuttingMachine: 'cuttingMachine',
      materialCode: 'materialCode',
      // materialName: 'materialName',
      operation: 'operation',
      delete:'Confirm delete the current task？',
      update:'update',
      manual:'Material details',
      empty:'Empty pallet back',
      surplus:'Surplus pallet back',
      // trayNumber:'trayNumber',
      count:'count',
      // specification:'specification',
      // tableName:'Raw material delivery sheet',
      tableName:'Cutting machine order management',
      add:'add',
      
      name:'add',
      sizeX:'Plan size X',
      sizeY:'Plan size Y',
      planState:'Plan status',
      cuttingMachine:'Cutting machine',
      materialName:'Material name',
      materialSizeX:'Material size X',
      materialSizeY:'Material size Y',
      materialThickness:'Material thickness',
      totalRuns:'Total (sheets)',
      outNum:'Outbound quantity (sheets)',
      remainRuns:'Surplus quantity (sheet)',
      abnormalDescription:'Abnormal description',
      handleManualFinish:'Confirm to complete the order',
      HandleSaveManualDown:'Confirm removal?',
      surplusForm:'material back',
      
      trayNumber:'trayNumber',
      materialNameM:'Material name',
      locationName:'Location name',
      quantity:'quantity',
      state:'status',
      unitName:'unit',
      materialType:'materialType',
      specification:'specification',
      length:'length',
      width:'width',
      thickness:'thickness',
      tableNameM1:'Line edge library selection',
      tableNameM2:'Inventory selection',
    },
    button:{
      update:'update',
      delete:'delete',
      save:'save',
      cancel:'cancel',
      return:'return',
      automatic:'automatic',
      manual:'manual',
      empty:'empty pallet back',
      surplus:'surplus pallet back',
      takeOff:'takeOff',
      add:'add',

      handleManualFinish:'Manual completion',
      handleManualDown:'Manual removal',
      leftRadius:'First-in, first-out',
      rightRadius:'Path optimal',
    },
    label: {
      orderNumber: 'orderNumber',
      creationTime: 'Date',

      orderCount: 'orderCount',
      finishNumber: 'finishNumber',
      surplusNumber: 'surplusNumber',
      orderPriority: 'orderPriority',
      cuttingMachine: 'cuttingMachine',
      materialCode: 'materialCode',
      materialName: 'materialName',
      material: 'material',
      count:'count',
      feedPort:'feedPort',
      trayNumber:'trayNumber',

      code:'Plan Name',
      origin:'Starting point',
      middle:'Middle point',
    },
    placeholder: {
      orderNumber: 'Please enter the order number',
      creationTime: 'Please enter the date',

      orderCount: 'Please enter the orderCount',
      finishNumber: 'Please enter the finishNumber',
      surplusNumber: 'Please enter the surplusNumber',
      orderPriority: 'Please enter the orderPriority',
      cuttingMachine: 'Please enter the cuttingMachine',
      materialCode: 'Please enter the materialCode',
      materialName: 'Please enter the materialName',
      material: 'Please enter the material info',
      count:'Please enter the count',
      feedPort:'Please select the feedPort',
      trayNumber:'Please enter the trayNumber',
      
      origin:'Please select a starting point',
      middle:'Please select the middle point',
    },
    message:{
      orderCount: 'Please enter the orderCount',
      finishNumber: 'Please enter the finishNumber',
      surplusNumber: 'Please enter the surplusNumber',
      orderPriority: 'Please enter the orderPriority',
      cuttingMachine: 'Please enter the cuttingMachine',
      materialCode: 'Please enter the materialCode',
      materialName: 'Please enter the materialName',
      material: 'Please enter the material info',
      count:'Please enter the count',
      feedPort:'Please select the feedPort',
      trayNumber:'Please enter the trayNumber',

      manualFinishSuccess: 'Complete successfully',
      manualSaveSuccess: 'Removed successfully',
    }
  },
  zh_CN: {
    title:{
      orderNumber: '订单号',
      orderCount: '订单数量',
      finishNumber: '已完成数量',
      surplusNumber: '剩余数量',
      orderPriority: '订单优先级',
      // cuttingMachine: '切割机',
      materialCode: '物料编码',
      // materialName: '物料名称',
      operation: '操作',
      delete:'确认删除？',
      update:'修改',
      manual:'物料详情',
      empty:'空托盘回库',
      surplus:'余料托盘回库',
      // trayNumber:'托盘号',
      count:'数量',
      // specification:'规格',
      // tableName:'原材料出库单',
      tableName:'切割机订单管理',
      add:'新增',
      
      name:'新增',
      sizeX:'计划大小 X',
      sizeY:'计划大小 Y',
      planState:'计划状态',
      cuttingMachine:'切割机',
      materialName:'材料名称',
      materialSizeX:'材料大小 X',
      materialSizeY:'材料大小 Y',
      materialThickness:'材料厚度',
      totalRuns:'总数(张)',
      outNum:'出库数量(张)',
      remainRuns:'剩余数量(张)',
      abnormalDescription:'异常描述',
      handleManualFinish:'确认完成订单',
      HandleSaveManualDown:'确认下架?',
      surplusForm:'余料托盘回库',
      
      trayNumber:'托盘号',
      materialNameM:'物料名称',
      locationName:'库位名称',
      quantity:'库存数量',
      state:'状态',
      unitName:'单位',
      materialType:'材质',
      specification:'规格',
      length:'长度',
      width:'宽度',
      thickness:'厚度',
      tableNameM1:'线边库选择',
      tableNameM2:'库存选择',
    },
    button:{
      update:'修改',
      delete:'删除',
      save:'保存',
      cancel:'取消',
      return:'返库',
      automatic:'自动生成出库单',
      manual:'手动生成出库单',
      empty:'空托盘回库',
      surplus:'余料托盘回库',
      takeOff:'下架',
      add:'新增',

      handleManualFinish:'手动完成',
      handleManualDown:'手动下架',
      leftRadius:'先入先出',
      rightRadius:'路径最优',
    },
    label: {
      orderNumber: '订单号',
      creationTime: '日期',

      orderCount: '订单数量',
      finishNumber: '已完成数量',
      surplusNumber: '剩余数量',
      orderPriority: '订单优先级',
      cuttingMachine: '切割机',
      materialCode: '物料编码',
      materialName: '物料名称',
      material: '物料信息',
      count:'数量',
      feedPort:'料口',
      trayNumber:'托盘号',

      code:'计划名称',
      origin:'起点',
      middle:'中间点',
    },
    placeholder: {
      orderNumber: '请输入订单号',
      creationTime: '请输入日期',

      orderCount: '请输入订单数量',
      finishNumber: '请输入已完成数量',
      surplusNumber: '请输入剩余数量',
      orderPriority: '请输入订单优先级',
      cuttingMachine: '请输入切割机',
      materialCode: '请输入物料编码',
      materialName: '请输入物料名称',
      material: '请输入物料信息',
      count:'请输入数量',
      feedPort:'请选择料口',
      trayNumber:'请输入托盘号',
      
      origin:'请选择起点',
      middle:'请选择中间点',
    },
    message:{
      orderCount: '请输入订单数量',
      finishNumber: '请输入已完成数量',
      surplusNumber: '请输入剩余数量',
      orderPriority: '请输入订单优先级',
      cuttingMachine: '请输入切割机',
      materialCode: '请输入物料编码',
      materialName: '请输入物料名称',
      material: '请输入物料信息',
      count:'请输入数量',
      feedPort:'请选择料口',
      trayNumber:'请输入托盘号',

      manualFinishSuccess: '订单手动完成成功',
      manualSaveSuccess: '手动下架成功',
    }
  }
};
