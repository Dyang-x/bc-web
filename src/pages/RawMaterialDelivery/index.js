import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import styles from './style.scss';
import { CacheTable } from '~/components';
import moment from 'moment';
import UpdateForm from './UpdateForm';
import ManualTable from './ManualTable';
import EmptyForm from './EmptyForm';
import SurplusTable from './SurplusTable';
import SurplusForm from './SurplusForm';
import DetailTable from './DetailTable';
import RawMaterialDeliveryServices from '~/api/RawMaterialDelivery';
import EmptyPalletsWarehousing from '~/api/EmptyPalletsWarehousing';
import ReadIOTServices from '~/api/ReadIOT';
import SurplusMaterialApi from '~/api/SurplusMaterial';

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

  const [strategy, setStrategy] = useState()

  const [emptyVis, setEmptyVis] = useState(false);
  const [emptyData, setEmptyData] = useState([]);
  const emptyRef = useRef();

  const [surplusVis, setSurplusVis] = useState(false);
  const [surplusData, setSurplusData] = useState([]);
  const surplusRef = useRef();

  useEffect(() => {
    getStrategy()
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, [strategy]);

  const columns = [
    {
      title: '订单号',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '计划大小 X',
      dataIndex: 'sizeX',
      key: 'sizeX',
      align: 'center',
    },
    {
      title: '计划大小 Y',
      dataIndex: 'sizeY',
      key: 'sizeY',
      align: 'center',
    },
    {
      title: '计划描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '计划状态',
      dataIndex: 'planState',
      key: 'planState',
      align: 'center',
    },
    {
      title: '切割机',
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center',
    },
    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      title: '材料大小 X',
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center',
    },
    {
      title: '材料大小 Y',
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center',
    },
    {
      title: '材料厚度',
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center',
    },
    {
      title: '总数',
      dataIndex: 'totalRuns',
      key: 'totalRuns',
      align: 'center',
    },
    {
      title: '出库数量',
      dataIndex: 'outNum',
      key: 'outNum',
      align: 'center',
    },
    {
      title: '剩余数量',
      dataIndex: 'remainRuns',
      key: 'remainRuns',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        (record.remainRuns == 0)
          ?
          <a key="detail1" onClick={() => handleEmpty(record)}>
            空托回库
          </a>
          :
          <a key="detail2" onClick={() => handleSurplus(record)}>
            余料回库
          </a>,
        // <Divider key="divider2" type="vertical" />,
        // <a key="detail" onClick={() => handleOpenDetailModal(record)}>
        //   详情
        // </a>,
      ],
      // width: 80,
      // fixed: 'right'
    }
  ];

  //查询页面数据
  // const columns =[
  //   {
  //     title: '切割机',
  //     dataIndex: 'cuttingMachine',
  //     key: 'cuttingMachine',
  //     align: 'center',
  //   },    {
  //     title: '材料名称',
  //     dataIndex: 'materialName',
  //     key: 'materialName',
  //     align: 'center',
  //   },    {
  //     title: '材料编码',
  //     dataIndex: 'materialCode',
  //     key: 'materialCode',
  //     align: 'center',
  //   },    {
  //     title: '材料大小 X',
  //     dataIndex: 'materialSizeX',
  //     key: 'materialSizeX',
  //     align: 'center',
  //   },    {
  //     title: '材料大小 Y',
  //     dataIndex: 'materialSizeY',
  //     key: 'materialSizeY',
  //     align: 'center',
  //   },    {
  //     title: '材料规格',
  //     dataIndex: 'materialSpecs',
  //     key: 'materialSpecs',
  //     align: 'center',
  //   },    {
  //     title: '材料厚度',
  //     dataIndex: 'materialThickness',
  //     key: 'materialThickness',
  //     align: 'center',
  //   },    {
  //     title: '订单名称',
  //     dataIndex: 'name',
  //     key: 'name',
  //     align: 'center',
  //   },    {
  //     title: '需求数量',
  //     dataIndex: 'totalParts',
  //     key: 'totalParts',
  //     align: 'center',
  //   },    {
  //     title: '发货数量',
  //     dataIndex: 'sendParts',
  //     key: 'sendParts',
  //     align: 'center',
  //   },    {
  //     title: '剩余运行数量',
  //     dataIndex: 'remainRuns',
  //     key: 'remainRuns',
  //     align: 'center',
  //   }, {
  //     title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
  //     key: 'opt',
  //     align: 'center',
  //     render: (_, record) => [
  //       <a key="detail" onClick={() => handleOpenDetailModal(record)}>
  //         详情
  //       </a>,
  //     ],
  //   }
  // ]

  const getStrategy = () => {
    ReadIOTServices.getStrategy()
      .then(res => {
        const strategy = res == true ? 1 : 0
        setStrategy(strategy)
      })
  }

  const loadData = async (page, pageSize, searchValue) => {
    // const data = [
    //   {
    //     id: 0,
    //     cuttingMachine: '切割机1',
    //     materialCode: '0402-0337',
    //     materialName: 'ONBC-25',
    //     materialSizeX: '600',
    //     materialSizeY: '6000',
    //     materialSpecs: '600*6000',
    //     materialThickness: '25',
    //     name: 'D0001',
    //     planState: 0,
    //     remainRuns: 20,
    //     sendParts: 100,
    //     totalParts: 100,
    //     lineEdgeLibraryDTOS:[
    //       {
    //         cuttingMachine: '切割机1',
    //         fromLocation: '111',
    //         id: 1,
    //         materialCode: '0402-0337',
    //         materialName: 'ONBC-25',
    //         materialSizeX: '600',
    //         materialSizeY: '6000',
    //         materialSpecs: '600*6000',
    //         materialThickness: '25',
    //         planName: '切割111111',
    //         quantity: 1000,
    //         remainderNum: 100,
    //         taskCode: 'ce1111111',
    //         toLocation: '222',
    //         trayLocation: '1-5',
    //         trayNumber: 'TP001',
    //         useNum: 80,
    //       },
    //       {
    //         cuttingMachine: '切割机1',
    //         fromLocation: '333',
    //         id: 2,
    //         materialCode: '0402-0337',
    //         materialName: 'ONBC-25',
    //         materialSizeX: '600',
    //         materialSizeY: '6000',
    //         materialSpecs: '600*6000',
    //         materialThickness: '25',
    //         planName: '切割22222',
    //         quantity: 1000,
    //         remainderNum: 0,
    //         taskCode: 'ce222222',
    //         toLocation: '444',
    //         trayLocation: '1-4',
    //         trayNumber: 'TP002',
    //         useNum: 20,
    //       },
    //     ]
    //   },
    //   {
    //     id: 13,
    //     orderNumber: 'D0002',
    //     orderCountr: 100,
    //     finishNumber: 0,
    //     surplusNumber: 100,
    //     orderPriority: 2,
    //     cuttingMachine: '切割机2',
    //     materialCode: 'PR001',
    //     materialName: '物料1',
    //     detail: [
    //       {
    //         id: 11,
    //         trayNumber: 'D0001',
    //         count: 100,
    //         uesd: 50,
    //         surplus: 50,
    //         station: 1,
    //       }, {
    //         id: 12,
    //         trayNumber: 'D0002',
    //         count: 100,
    //         uesd: 0,
    //         surplus: 100,
    //         station: 2,
    //       }
    //     ]
    //   },
    // ]
    // setTableData(data);
    setLoading(true);
    ReadIOTServices
      .findPlan({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        if (res.length != 0) {
          setTableData(res.content);
          setTotalPage(res.totalElements);
          setPage(res.pageable.pageNumber + 1)
          setPageSize(res.pageable.pageSize)
        }
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
    setLoading(false);
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

  const CheckboxChange = async (e) => {
    const state = e.target.value
    console.log(state, 'state');
    await ReadIOTServices.updateStrategy(state)
      .then(res => {
        notification.success({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateSuccess')
        })
        setStrategy(state)
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateFailure')
        })
      })
  }

  const handleEmpty = (record) => {
    setEmptyVis(true)
    setEmptyData(record)
  }

  const handleCancelEmpty = () => {
    const { resetFields } = emptyRef.current;
    resetFields();
    setEmptyVis(false)
    setEmptyData([])
  }

  const modalEmptyFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveEmpty}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelEmpty}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveEmpty = () => {
    const { getFieldsValue, validateFields } = emptyRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      params.state = 0
      console.log('params', params);
      await EmptyPalletsWarehousing
        .saveOrUpdate(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('EmptyPalletsWarehousing.message.addSuccess')
          });
          reFreshFunc();
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
      handleCancelEmpty();
    });
  }

  const handleSurplus = (record) => {
    setSurplusVis(true)
    setSurplusData(record)
  }

  const handleCancelSurplus = () => {
    const { resetFields } = surplusRef.current;
    resetFields();
    setSurplusVis(false)
    setSurplusData([])
  }

  const modalSurplusFoot = () => [
    <Button key="return" type="primary" onClick={HandleSaveSurplus}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.return')}
    </Button>,
    <Button key="cancel" onClick={handleCancelSurplus}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveSurplus = () => {
    const { getFieldsValue, validateFields } = surplusRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log('params', params);

      await SurplusMaterialApi
        .addSurplus(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SurplusInStorage.message.addSuccess')
          });
          reFreshFunc();
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SurplusInStorage.message.addFailure'),
            description: err.message
          });
        });

      handleCancelSurplus();
    });
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={'计划名称'}
              name="code"
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
            <Radio.Group
              className={styles.Radio}
              key="Radio"
              // defaultValue={strategy}
              value={strategy}
              buttonStyle="solid"
              style={{ marginRight: 16, marginLeft: 'auto' }}
              size='small'
              onChange={(e) => {
                console.log(e, 'e');
                CheckboxChange(e)
              }}
            >
              <Radio.Button value={1} className={styles.leftRadius}>先入先出</Radio.Button>
              <Radio.Button value={0} className={styles.rightRadius}>路径最优</Radio.Button>
            </Radio.Group>
          ]}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
        >
          <div style={{ marginBottom: '12px', display: 'flex' }}>
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
              dataSource={tableData}
              columns={columns}
              rowKey={record => record.id}
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

      <Drawer
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.empty')}
        visible={emptyVis}
        onClose={handleCancelEmpty}
        width={400}
      >
        <Drawer.DrawerContent>
          <EmptyForm ref={emptyRef} modifyData={emptyData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalEmptyFoot()}</Drawer.DrawerBottomBar>
      </Drawer>

      <Drawer
        title="余料托盘回库"
        visible={surplusVis}
        onClose={handleCancelSurplus}
        width={400}
      >
        <Drawer.DrawerContent>
          <SurplusForm ref={surplusRef} modifyData={surplusData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalSurplusFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};
export default RawMaterialDeliveryOrderManagement;
