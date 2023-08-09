/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 10:59:20
 */
module.exports = {
  en_US: {
    label: {
      trayNumber: 'Tray number',
      orderNumber: 'Order number',
      attribute1: 'Attribute 1',
      attribute1status: 'Attribute 1 status',
      attribute2: 'Attribute 2',
      attribute2status: 'Attribute 2 status',
      sortingPosition: 'Sorting position',
      contactPpoint: 'Contact point',

      automaticState:'automaticState',
      transferCode:'transferCode',
      taskState:'taskState',
      areaCode:'areaCode',
      areaState:'areaState',
      joinArea:'joinArea',
      equipmentName:'equipmentName',
      automatic:'automatic',
    },
    placeholder: {
      trayNumber: 'Please enter the tray number',
      areaCode: 'Please enter the areaCode',
      transferCode: 'Please enter the tray number',

      areaState:'Please enter the areaState',
      automaticState:'Please choose the item',
      equipmentName:'Please enter the equipmentName',
      joinArea:'Please enter the joinArea',
    },
    title:{
      trayNumber: 'Tray number',
      taskStatus: 'Task status',
      palletStatus: 'Tray number',
      PickUpSelection: 'Pick up selection',
      DockingPort: 'Docking port',
      CuttingMachine: 'Cutting machine',
      operation: 'operationoperation',

      transferCode:'transferCode',
      taskState:'taskState',
      areaCode:'areaCode',
      areaState:'areaState',
      joinArea:'joinArea',
      equipmentName:'equipmentName',
      delete:'Confirm the deletion?',
      add: 'add',
      update: 'update',
      yes:'yes',
      no:'no',
      binding: 'Binding TransferCode',
      updateState: 'update AreaState',
      tableName:'Material position tray management',

      handleTakedown:'Confirm pallet removal at port ',
      pullOff:' ',
    },
    message: {
      trayNumber: 'Please input Tray number',
      orderNumber: 'Please input Order number',
      attribute1: 'Please select Attribute 1',
      attribute1status: 'Please configure Attribute 1 status',
      attribute2: 'Please select Attribute 2',
      attribute2status: 'Please configure Attribute 2 status',
      sortingPosition: 'Please select Sorting position',
      contactPpoint: 'Please select Contact point',

      addSuccess:'Added success',
      addFailure:'Add failure',
      updateSuccess:'Modified successfully',
      updateFailure:'Modification failure',
      bindingSuccess:'Binding success',
      bindingFailure:'Binding failure',
      
      removedSuccess:'Removed successfully',
      removedFailure:'Removal failure',
    },
    button:{
      addTransfer:'addTransfer',
      updateState:'updateState',
      update:'update',
      delete:'delete',
      checkbox:'Automatically',
      save:'save',
      cancel:'cancel',
      add:'add',

      takedown:'delist',
    },
  },
  zh_CN: {
    label: {
      trayNumber: '托盘号',
      orderNumber: '订单号',
      attribute1: '属性1',
      attribute1status: '属性1状态',
      attribute2: '属性2',
      attribute2status: '属性2状态',
      sortingPosition: '分拣位置',
      contactPpoint: '接驳点',

      automaticState:'是否托盘自动下架',
      transferCode:'托盘号',
      taskState:'任务状态',
      areaCode:'备料区编码',
      areaState:'备料区状态',
      joinArea:'接驳口',
      equipmentName:'设备名称',
      automatic:'托盘自动下架',

    },
    placeholder: {
      trayNumber: '请输入托盘号',
      areaCode:'请输入备料区编码',
      transferCode: '请输入托盘号',
      areaState:'请输入备料区状态',
      automaticState:'请配置托盘是否自动下架',
      equipmentName:'请输入设备名称',
      joinArea:'请输入接驳口',
    },
    title:{
      trayNumber: '托盘号',
      taskStatus: '任务状态',
      palletStatus: '托盘状态',
      PickUpSelection: '捡选区',
      DockingPort: '接驳口',
      CuttingMachine: '切割机',
      operation: '操作',

      transferCode:'托盘号',
      taskState:'任务状态',
      areaCode:'备料区编码',
      areaState:'备料区状态',
      joinArea:'接驳口',
      equipmentName:'设备名称',
      delete:'确认删除?',
      add: '新增',
      update: '修改',
      yes:'是',
      no:'否',
      binding: '绑定托盘',
      updateState: '更新备料口状态',
      tableName:'备料位托盘管理',

      handleTakedown:'确认在备料区',
      pullOff:'下架托盘',
    },
    message:{
      trayNumber: '请输入托盘号',
      orderNumber: '请输入订单号',
      attribute1: '请选择属性1',
      attribute1status: '请配置属性1状态',
      attribute2: '请选择属性2',
      attribute2status: '请配置属性2状态',
      sortingPosition: '请选择分拣位置',
      contactPpoint: '请选择接驳点',

      addSuccess:'新增成功',
      addFailure:'新增失败',
      updateSuccess:'修改成功',
      updateFailure:'修改失败',
      bindingSuccess:'绑定成功',
      bindingFailure:'绑定失败',
      
      removedSuccess:'托盘下架成功',
      removedFailure:'托盘下架失败',
    },
    button:{
      addTransfer:'绑定托盘',
      updateState:'更新备料口状态',
      update:'修改',
      delete:'删除',
      checkbox:'自动下架托盘',
      save:'保存',
      cancel:'取消',
      add:'新增',

      takedown:'下架',
    },
  }
};
