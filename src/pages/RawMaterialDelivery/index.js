import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import styles from './style.scss';
import { CacheTable } from '~/components';
import moment from 'moment';
import UpdateForm from './UpdateForm';
import ManualTable from './ManualTable';
import EmptyForm from './EmptyForm';
import SurplusTable from './SurplusTable';
import DetailTable from './DetailTable';
import RawMaterialDeliveryServices from '~/api/RawMaterialDelivery';
import EmptyPalletsWarehousing from '~/api/EmptyPalletsWarehousing';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { showTotal } = page;

const RawMaterialDeliveryOrderManagement = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const state = {
    0: '新建', 1: '运行中', 2: '已完成'
  }
  const [selectedstatus, setSelectedstatus] = useState('0');

  const [updateVis, setUpdateVis] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const updateForm = useRef();

  const [manualVis, setManualVis] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [emptyVis, setEmptyVis] = useState(false);
  const emptyRef = useRef();

  const [surplusVis, setSurplusVis] = useState(false);
  const surplusRef = useRef();

  const [detailVis, setDetailVis] = useState(false);
  const [detailData, setDetailData] = useState([]);

  const [manualData ,setManualData] = useState({});
  const manualRef = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  // const columns = [
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.orderNumber'),
  //     dataIndex: 'orderNumber',
  //     key: 'orderNumber',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.orderCount'),
  //     dataIndex: 'orderCountr',
  //     key: 'orderCountr',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.finishNumber'),
  //     dataIndex: 'finishNumber',
  //     key: 'finishNumber',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.surplusNumber'),
  //     dataIndex: 'surplusNumber',
  //     key: 'surplusNumber',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.orderPriority'),
  //     dataIndex: 'orderPriority',
  //     key: 'orderPriority',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.cuttingMachine'),
  //     dataIndex: 'cuttingMachine',
  //     key: 'cuttingMachine',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialCode'),
  //     dataIndex: 'materialCode',
  //     key: 'materialCode',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialName'),
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: '原料编码',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: '原料名称',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: '原料规格',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: '需求数量',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: '已发货数量',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
  //     key: 'opt',
  //     align: 'center',
  //     render: (_, record) => [
  //       <a key="update" onClick={() => handleUpdate(record)}>
  //         {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.update')}
  //       </a>,
  //       <Divider key="divider1" type="vertical" />,
  //       <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
  //         {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.delete')}
  //       </a>,
  //       <Divider key="divider2" type="vertical" />,
  //       <a key="detail" onClick={() => handleOpenDetailModal(record)}>
  //         详情
  //       </a>,
  //     ],
  //     // width: 80,
  //     // fixed: 'right'
  //   }
  // ];

  //查询页面数据
  const columns =[
    {
      title: '切割机',
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center',
    },    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },    {
      title: '材料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },    {
      title: '材料大小 X',
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center',
    },    {
      title: '材料大小 Y',
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center',
    },    {
      title: '材料规格',
      dataIndex: 'materialSpecs',
      key: 'materialSpecs',
      align: 'center',
    },    {
      title: '材料厚度',
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center',
    },    {
      title: '订单名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },    {
      title: '需求数量',
      dataIndex: 'totalParts',
      key: 'totalParts',
      align: 'center',
    },    {
      title: '发货数量',
      dataIndex: 'sendParts',
      key: 'sendParts',
      align: 'center',
    },    {
      title: '剩余运行数量',
      dataIndex: 'remainRuns',
      key: 'remainRuns',
      align: 'center',
    }, {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="detail" onClick={() => handleOpenDetailModal(record)}>
          详情
        </a>,
      ],
    }
  ]

  const loadData = async (page, pageSize, searchValue) => {
    const data = [
      {
        id: 0,
        cuttingMachine: '切割机1',
        materialCode: '0402-0337',
        materialName: 'ONBC-25',
        materialSizeX: '600',
        materialSizeY: '6000',
        materialSpecs: '600*6000',
        materialThickness: '25',
        name: 'D0001',
        planState: 0,
        remainRuns: 20,
        sendParts: 100,
        totalParts: 100,
        lineEdgeLibraryDTOS:[
          {
            cuttingMachine: '切割机1',
            fromLocation: '111',
            id: 1,
            materialCode: '0402-0337',
            materialName: 'ONBC-25',
            materialSizeX: '600',
            materialSizeY: '6000',
            materialSpecs: '600*6000',
            materialThickness: '25',
            planName: '切割111111',
            quantity: 1000,
            remainderNum: 100,
            taskCode: 'ce1111111',
            toLocation: '222',
            trayLocation: '1-5',
            trayNumber: 'TP001',
            useNum: 80,
          },
          {
            cuttingMachine: '切割机1',
            fromLocation: '333',
            id: 2,
            materialCode: '0402-0337',
            materialName: 'ONBC-25',
            materialSizeX: '600',
            materialSizeY: '6000',
            materialSpecs: '600*6000',
            materialThickness: '25',
            planName: '切割22222',
            quantity: 1000,
            remainderNum: 0,
            taskCode: 'ce222222',
            toLocation: '444',
            trayLocation: '1-4',
            trayNumber: 'TP002',
            useNum: 20,
          },
        ]
      },
      {
        id: 13,
        orderNumber: 'D0002',
        orderCountr: 100,
        finishNumber: 0,
        surplusNumber: 100,
        orderPriority: 2,
        cuttingMachine: '切割机2',
        materialCode: 'PR001',
        materialName: '物料1',
        detail: [
          {
            id: 11,
            trayNumber: 'D0001',
            count: 100,
            uesd: 50,
            surplus: 50,
            station: 1,
          }, {
            id: 12,
            trayNumber: 'D0002',
            count: 100,
            uesd: 0,
            surplus: 100,
            station: 2,
          }
        ]
      },
    ]
    setTableData(data);
    // setLoading(true);
    // RawMaterialDeliveryServices
    //   .getByQuery({ ...searchValue, page: page - 1, pageSize })
    //   .then(res => {
    //     console.log('res.length != 0',res.length != 0 ,res);
    //     if(res.length != 0){
    //       setTableData(res.content);
    //       setTotalPage(res.totalElements);
    //       setPage(res.pageable.pageNumber + 1)
    //       setPageSize(res.pageable.pageSize)
    //     }
    //   })
    //   .catch(err => {
    //     notification.warning({
    //       message: getFormattedMsg('global.notify.fail'),
    //       description: err.message
    //     });
    //   });
    //   setLoading(false);
  };

  //刷新按钮
  const reFreshFunc = () => {
    return () => loadData(page, pageSize, { ...searchValue, state: selectedstatus });
  };

  const onShowSizeChange = (p, s) => {
    loadData(p, s, { ...searchValue, state: selectedstatus });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    loadData(p, s, { ...searchValue, state: selectedstatus });
    setPage(p);
  };

  const handleChangeStatus = e => {
    setTableData([]);
    setSelectedstatus(e.target.value);
    setPage(1);
    loadData(1, pageSize, { ...searchValue, state: e.target.value });
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data }
    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime)
      params.endTime = moment(params.creationTime[1]).format(dateTime)
    }
    delete params.creationTime
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params, state: selectedstatus });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'raw_material_delivery_order_management' }),
    []
  );

  // const handleUpdate = (record) => {
  //   setUpdateVis(true)
  //   setUpdateData(record)
  // }

  // const handleCancelUpdate = () => {
  //   const { resetFields } = updateForm.current;
  //   resetFields();
  //   setUpdateVis(false)
  //   setUpdateData(null)
  // }

  // const modalUpdateFoot = () => [
  //   <Button key="save" type="primary" onClick={HandleSaveUpdate}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
  //   </Button>,
  //   <Button key="cancel" onClick={handleCancelUpdate}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
  //   </Button>
  // ];

  // const HandleSaveUpdate = () => {
  //   const { getFieldsValue, validateFields, setFieldsValue } = updateForm.current;
  //   validateFields(async (err, values) => {
  //     if (err) return;
  //     const params = getFieldsValue();
  //     Object.keys(params).map(i => {
  //       updateData[i] = params[i]
  //     })

  //     handleCancelUpdate();
  //   });
  // }

  // const handleDelete = (record) => {
  //   Modal.confirm({
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.delete'),
  //     okType: 'danger',
  //     onOk: async () => {
  //       notification.warning({ message: '没有接口' })
  //     },
  //     onCancel() { },
  //   })
  // }

  const handleAutomatic = async () => {
    notification.warning({ message: '没有接口' })
  }

  const handleManual = () => {
    setManualVis(true)
  }

  const handleCancelManual = () => {
    setManualVis(false)
    setManualData({})
  }

  const modalManualFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveManual}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelManual}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const handleSaveManual = () => {
    const { getFieldsValue, validateFields } = manualRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      params.materialCode = manualData.materialCode
      params.materialName = manualData.materialName
      await RawMaterialDeliveryServices.handout(params)
        .then(res => {
          notification.warning({
            message: '出库单生成成功'
          });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        })
      handleCancelManual();
      reFreshFunc();
    });
  }

  // const handleEmpty = () => {
  //   setEmptyVis(true)
  // }

  // const handleCancelEmpty = () => {
  //   const { resetFields } = emptyRef.current;
  //   resetFields();
  //   setEmptyVis(false)
  // }

  // const modalEmptyFoot = () => [
  //   <Button key="save" type="primary" onClick={HandleSaveEmpty}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
  //   </Button>,
  //   <Button key="cancel" onClick={handleCancelEmpty}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
  //   </Button>
  // ];

  // const HandleSaveEmpty = () => {
  //   const { getFieldsValue, validateFields } = emptyRef.current;
  //   validateFields(async (err, values) => {
  //     if (err) return;
  //     const params = getFieldsValue();
  //     params.state = 0
  //     await EmptyPalletsWarehousing
  //     .saveOrUpdate(params)
  //     .then(res => {
  //       notification.success({
  //         message: getFormattedMsg('EmptyPalletsWarehousing.message.addSuccess')
  //       });
  //       reFreshFunc();
  //     })
  //     .catch(err => {
  //       notification.warning({
  //         description: err.message
  //       });
  //     });
  //     handleCancelEmpty();
  //   });
  // }

  // const handleSurplus = () => {
  //   setSurplusVis(true)
  // }

  // const handleCancelSurplus = () => {
  //   const { resetFields } = surplusRef.current;
  //   resetFields();
  //   setSurplusVis(false)
  // }

  // const modalSurplusFoot = () => [
  //   <Button key="return" type="primary" onClick={HandleSaveSurplus}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.return')}
  //   </Button>,
  //   <Button key="cancel" onClick={handleCancelSurplus}>
  //     {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
  //   </Button>
  // ];

  // const HandleSaveSurplus = () => {
  //   const { getFieldsValue, validateFields } = surplusRef.current;
  //   validateFields(async (err, values) => {
  //     if (err) return;
  //     const params = getFieldsValue();
  //     handleCancelSurplus();
  //   });
  // }

  const onHandleTableSelect = e => {
    setSelectedRowKeys([e.id])
    // if (selectedRowKeys.indexOf(e.id) === -1) {
    //   setSelectedRowKeys([...selectedRowKeys, e.id])
    //   setSelectedDatas([...selectedDatas, e])
    // } else {
    //   setSelectedRowKeys(selectedRowKeys.filter(i => i != e.id))
    //   setSelectedDatas(selectedDatas.filter(i => i.id != e.id))
    // }
  };

  const handleOpenDetailModal = (record)=>{
    setDetailVis(true)
    setDetailData(record.lineEdgeLibraryDTOS)
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.orderNumber')}
              name="orderNumber"
            >
              <Input
                placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.orderNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.creationTime')}
              name="creationTime"
            >
              <RangePicker
                placeholder={getFormattedMsg('RawMaterialDeliveryOrderManagement.placeholder.creationTime')}
                format={dateTime}
                showTime
                style={{ width: '100%' }}
              />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.tableName')}
          buttons={[
            <Radio.Group className={styles.Radio} key="Radio" defaultValue="1" buttonStyle="solid" style={{ marginRight: 16 }} size='small' onChange={(e) => { console.log(e.target.value); notification.warning({ message: '没有接口' }) }}>
              <Radio.Button value="1" className={styles.leftRadius}>先入先出</Radio.Button>
              <Radio.Button value="2" className={styles.rightRadius}>路径最优</Radio.Button>
            </Radio.Group>,
            <Button key="automatic" type="primary" onClick={() => handleAutomatic()} >
              {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.automatic')}
            </Button>,
            <Button key="manual" type="primary" onClick={() => handleManual()} >
              {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.manual')}
            </Button>,
            // <Button key="empty" type="primary" onClick={() => handleEmpty()} >
            //   {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.empty')}
            // </Button>,
            // <Button key="surplus" type="primary" onClick={() => handleSurplus()}>
            //   {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.surplus')}
            // </Button>
          ]}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
        >
          <div style={{ marginBottom: '12px' }}>
            <Radio.Group defaultValue={selectedstatus} onChange={handleChangeStatus} size="large">
              {state &&
                Object.keys(state).map(item => {
                  return (
                    <Radio.Button key={item} value={item}>
                      {state[item]}
                    </Radio.Button>
                  );
                })}
            </Radio.Group>
          </div>
          <Spin spinning={loading}>
            <Table
              // className={styles.mainTable}

              pagination={false}
              scroll={{ x: 'max-content' }}
              // dataSource={tableData.map((i, idx) => ({
              //   ...i,
              //   serialNumber: (page - 1) * pageSize + ++idx
              // }))}
              dataSource={tableData}
              columns={columns}
              rowKey={record => record.id}
              // rowSelection={{
              //   type: 'radio',
              //   onSelect: onHandleTableSelect,
              //   // onSelectAll: onHandleTableSelectAll,
              //   selectedRowKeys: selectedRowKeys,
              //   hideDefaultSelections: true,
              //   // getCheckboxProps={record => ({ 
              //   //   // 单行禁用
              //   //     disabled: record.status === 1
              //   //   })
              //   // } 
              // }}
              // onRow={record => {
              //   return {
              //     onClick: () => onHandleTableSelect(record)
              //   };
              // }}
            />
          </Spin>
          <HVLayout.Pane.BottomBar>
            <Pagination
              onShowSizeChange={onShowSizeChange}
              current={page}
              onChange={pageChange}
              defaultCurrent={page}
              total={totalPage}
              size="small"
              showSizeChanger
              showQuickJumper
              showTotal={showTotal}
              pageSize={pageSize}
            />
          </HVLayout.Pane.BottomBar>
        </HVLayout.Pane>
      </HVLayout>
      {/* <Drawer title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.update')} visible={updateVis} onClose={handleCancelUpdate} width={500}>
        <Drawer.DrawerContent>
          <UpdateForm ref={updateForm} updateData={updateData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer> */}
      {/* <Modal
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.manual')}
        visible={manualVis}
        // footer={null}
        footer={modalManualFoot()}
        onCancel={handleCancelManual}
        destroyOnClose
        width={800}
      >
         <ManualTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} setManualData={setManualData}/>
      </Modal> */}
      <Drawer
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.manual')}
        visible={manualVis}
        onClose={handleCancelManual}
        width={800}
      >
        <Drawer.DrawerContent>
          <ManualTable ref={manualRef} setManualData={setManualData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalManualFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      {/* <Modal
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.empty')}
        visible={emptyVis}
        footer={modalEmptyFoot()}
        onCancel={handleCancelEmpty}
        destroyOnClose
        width={800}
      >
        <EmptyForm ref={emptyRef} />
      </Modal> */}
      {/* <Modal
        // title="余料托盘回库"
        visible={surplusVis}
        footer={modalSurplusFoot()}
        onCancel={handleCancelSurplus}
        destroyOnClose
        width={800}
        bodyStyle={{
          paddingTop:0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        }}
      >
        <SurplusTable ref={surplusRef} />
      </Modal> */}
      <Modal
        title={'详情'}
        visible={detailVis}
        footer={null}
        onCancel={()=>{setDetailVis(false);setDetailData([])}}
        width={window.innerWidth - 300}
      >
        <DetailTable dataSource={detailData} />
      </Modal>
    </>
  );
};
export default RawMaterialDeliveryOrderManagement;
