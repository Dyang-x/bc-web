/*
 * @Author: Andy
 * @Date: 2019-07-08 09:13:14
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 10:59:20
 */
module.exports = {
  en_US: {
    title:{
      bendingNumber: 'machine code ',
      bendingName: 'machine name',
      attribute: 'machine properties',
      ifout: 'out without completion',
      warhouseTime: 'in-store time',
      readyMaterials: 'preparation area',
      operation: 'operation',
      delete:'Confirm to delete?',
      information:'machine information',
      create:'add',
      update:'edit',

      bendingState: 'machine status',
      transferCode: 'pallet number',
      putOn: 'listing',
      middle:'middle point:',
      surplusForm:'recycle',

      orderCode:'order number',
      materialCode:'product code',
      materialName:'product name',
      quantity:'quantity',
      suborderNumber:'suborder number',
      figureNumber:'product drawing',

      productNum:'quantity (sheet)',
      description:'remark',

      owNumber:'order number',
      operatorName:'operator',
      status:'status',
      outStockTime:'outbound time',
      associateNumber:'associated number',
      attributeOne:'Attribute 1',
      attributeTwo:'Attribute 2',
      owNumberT:'material delivery list',
    },
    button:{
      update:'edit',
      delete:'delete',
      confirm:'confirm',
      cancel:'cancel',
      create:'add',

      picking:'pallet picking',
      takedown:'pallet off',
      shelving:'empty shelf',
      back:'back storage',
    },
    message:{
      addSuccess:'Add success',
      addFailure:'Add failure',
      updateSuccess:'Modified successfully',
      updateFailure:'Modification failure',
      deleteSuccess:'Delete successfully',
      deleteFailure:'Deletion failure',
      bendingNumber: 'Please enter the machine code',
      bendingName: 'Please enter the machine name',
      ifout: 'Please check whether to allow bending unfinished outbound',
      warhouseTime: 'Please enter the minimum time in the library',
      attribute: 'Please select press properties',
      readyMaterials:'Please select preparation area',

      addAndupShelvesSuccess:'Task was generated successfully',
      pullOffSuccess: 'Tray off the shelf successfully',
      pullOffFailed: 'Failed to remove tray from shelf',
      outSuccess:'Successful delivery',
      outFailure:'Delivery failure',
    },
    label: {
      bendingNumber: 'machine code ',
      bendingName: 'machine name',
      ifout: 'out without completion',
      warhouseTime: 'in-store time',
      attribute: 'machine properties',
      readyMaterials: 'preparation area',

      orderNumber:'order number',
      suborderNumber:'suborder number',
      description:'remark',
    },
    placeholder: {
      bendingNumber: 'Please enter the machine code',
      bendingName: 'Please enter the machine name',
      ifout: 'Please check whether to allow bending unfinished outbound',
      warhouseTime: 'Please enter the minimum time in the library',
      attribute: 'Please select press properties',
      readyMaterials:'Please select preparation area',

      middle:'Please select the middle point',
      orderNumber:'Please enter the order number',
      suborderNumber:'Please enter the suborder number',
      description:'Please enter remarks',

      owNumber:'Please enter the order number',
    },
    addonBefore:{
      orderNumber:'order number：',
      suborderNumber:'suborder number：',
    }
  },
  zh_CN: {
    title:{
      bendingNumber: '折弯机编码',
      bendingName: '折弯机名称',
      attribute: '折弯机属性',
      ifout: '是否允许切割未完成出库',
      warhouseTime: '最小在库时间',
      readyMaterials: '备料区',
      operation: '操作',
      delete:'确认删除？',
      information:'折弯机信息',
      create:'新增',
      update:'修改',

      bendingState: '折弯机状态',
      transferCode: '托盘号',
      putOn: '托盘上架',
      middle:'中间点：',
      surplusForm:'余料回库',

      orderCode:'订单号',
      materialCode:'产品代码',
      materialName:'产品名称',
      quantity:'数量',
      suborderNumber:'子订单号',
      figureNumber:'产品图号',

      productNum:'产品数量(张)',
      description:'备注',

      owNumber:'出库单号',
      operatorName:'操作人',
      status:'状态',
      outStockTime:'出库时间',
      associateNumber:'关联单号',
      attributeOne:'属性1',
      attributeTwo:'属性2',
      owNumberT:'物料出库列表',
    },
    button:{
      update:'修改',
      delete:'删除',
      confirm:'确认',
      cancel:'取消',
      create:'新增',

      picking:'托盘拣选',
      takedown:'托盘下架',
      shelving:'空托上架',
      back:'未完工回库',
    },
    message:{
      addSuccess:'新增成功',
      addFailure:'新增失败',
      updateSuccess:'修改成功',
      updateFailure:'修改失败',
      deleteSuccess:'删除成功',
      deleteFailure:'删除失败',
      bendingNumber: '请输入折弯机编码',
      bendingName: '请输入折弯机名称',
      ifout: '请勾选是否允许折弯未完成出库',
      warhouseTime: '请输入最小在库时间',
      attribute: '请选择折弯机属性',
      readyMaterials:'选择备料区',

      addAndupShelvesSuccess:'托盘入库任务生成成功',
      pullOffSuccess: '托盘下架成功',
      pullOffFailed: '托盘下架失败',
      outSuccess:'出库成功',
      outFailure:'出库失败',
    },
    label: {
      bendingNumber: '折弯机编码',
      bendingName: '折弯机名称',
      ifout: '允许切割未完成出库',
      warhouseTime: '最小在库时间',
      attribute: '折弯机属性',
      readyMaterials:'备料区',

      orderNumber:'主订单号',
      suborderNumber:'子订单号',
      description:'备注',
    },
    placeholder: {
      bendingNumber: '请输入折弯机编码',      
      bendingName: '请输入折弯机名称',
      ifout: '请勾选是否允许切割未完成出库',
      warhouseTime: '请输入最小在库时间',
      attribute: '请选择折弯机属性',
      readyMaterials:'选择备料区',

      middle:'请选择中间点',
      orderNumber:'请输入主订单号',
      suborderNumber:'请输入子订单号',
      description:'请输入备注信息',

      owNumber:'请输入出库单号',
    },
    addonBefore:{
      orderNumber:'主订单号：',
      suborderNumber:'子订单号：',
    }

  }
};
