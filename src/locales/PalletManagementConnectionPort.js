/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 10:59:20
 */
module.exports = {
  en_US: {
    title:{
      trayNumber: 'Tray number',
      state: 'State',
      destination: 'Destination',
      DockingPort: 'Docking port',
      operation: 'operationoperation',
      delete:'Confirm the deletion ?',
      tableName:'Port pallet management',
      add: 'add',
      binding: 'Binding TransferCode',
      areaState:'areaState',
      updateState: 'update AreaState',
      unbind:'Confirm untying tray ?',
      
      handleTakedown:'Confirm pallet removal at port ',
      pullOff:' ',
    },
    button:{
      shelf:'shelf',
      transport:'transport',
      addTransfer:'addTransfer',
      unbind:'unbind',
      updateState:'updateState',
      delete:'delete',

      save:'save',
      cancel:'cancel',
      add:'add',
      takedown:'delist',
    },
    message:{
      addSuccess:'Added success',
      addFailure:'Add failure',
      deleteSuccess:'Deleted successfully',
      deleteFailure:'Deletion failure',
      bindingSuccess:'Binding successfully',
      bindingFailure:'Binding failure',
      updateSuccess:'Modified successfully',
      updateFailure:'Modification failure',
      portNumber:'Please enter the port number',
      unbindingSuccess:'Unbind successfully',
      unbindingFailure:'Unbinding failure',

      removedSuccess:'Removed successfully',
      removedFailure:'Removal failure',
    },
    label:{
      portNumber:'Port number'
    },
    placeholder:{
      portNumber:'Please enter the port number',
      transferCode: 'Please enter the tray number',
      areaState:'Please enter the material preparation area status',
    },
  },
  zh_CN: {
    title:{
      trayNumber: '托盘号',
      state: '状态',
      destination: '目的地',
      DockingPort: '接驳口',
      operation: '操作',
      delete:'确认删除?',
      tableName:'接驳口托盘管理',
      add: '新增',
      binding: '绑定托盘',
      areaState:'备料区状态',
      updateState: '更新备料口状态',
      unbind:'确认解绑托盘?',

      handleTakedown:'确认在接驳口',
      pullOff:'下架托盘',
    },
    button:{
      shelf:'上架',
      transport:'运输',
      addTransfer:'绑定托盘',
      unbind:'解绑托盘',
      updateState:'更新接驳口状态',
      delete:'删除',

      save:'保存',
      cancel:'取消',
      add:'新增',
      takedown:'下架',
    },
    message:{
      addSuccess:'新增成功',
      addFailure:'新增失败',
      deleteSuccess:'删除成功',
      deleteFailure:'删除失败',
      bindingSuccess:'绑定成功',
      bindingFailure:'绑定失败',
      updateSuccess:'修改成功',
      updateFailure:'修改失败',
      portNumber:'请输入接驳口编码',
      unbindingSuccess:'解绑成功',
      unbindingFailure:'解绑失败',

      removedSuccess:'托盘下架成功',
      removedFailure:'托盘下架失败',
    },
    label:{
      portNumber:'接驳口编码'
    },
    placeholder:{
      portNumber:'请输入接驳口编码',
      transferCode: '请输入托盘号',
      areaState:'请输入备料区状态',
    },
  }
};
