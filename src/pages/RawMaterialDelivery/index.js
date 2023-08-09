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
import ManualDownTable from './ManualDownTable';

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

  const [ManualDownVis, setManualDownVis] = useState(false);
  const [ManualDownData, setManualDownData] = useState({});
  const [ManualDownSelected, setManualDownSelected] = useState({});

  useEffect(() => {
    getStrategy()
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      // title: '订单号',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      // title: '计划大小 X',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.sizeX'),
      dataIndex: 'sizeX',
      key: 'sizeX',
      align: 'center',
    },
    {
      // title: '计划大小 Y',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.sizeY'),
      dataIndex: 'sizeY',
      key: 'sizeY',
      align: 'center',
    },
    // {
    //   title: '计划描述',
    //   dataIndex: 'description',
    //   key: 'description',
    //   align: 'center',
    // },
    {
      // title: '计划状态',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.planState'),
      dataIndex: 'planState',
      key: 'planState',
      align: 'center',
      render: (text, record) => {
        if (text == 0) {
          return '未开始'
        }
        if (text == 1) {
          return '运行中'
        }
        if (text == 2) {
          return '已完成'
        }
        return null
      }
    },
    {
      // title: '切割机',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.cuttingMachine'),
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center',
    },
    {
      // title: '材料名称',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      // title: '材料大小 X',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialSizeX'),
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center',
    },
    {
      // title: '材料大小 Y',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialSizeY'),
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center',
    },
    {
      // title: '材料厚度',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.materialThickness'),
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center',
    },
    {
      // title: '总数(张)',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.totalRuns'),
      dataIndex: 'totalRuns',
      key: 'totalRuns',
      align: 'center',
    },
    {
      // title: '出库数量(张)',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.outNum'),
      dataIndex: 'outNum',
      key: 'outNum',
      align: 'center',
    },
    {
      // title: '剩余数量(张)',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.remainRuns'),
      dataIndex: 'remainRuns',
      key: 'remainRuns',
      align: 'center',
    },
    {
      // title: '异常描述',
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.abnormalDescription'),
      dataIndex: 'abnormalDescription',
      key: 'abnormalDescription',
      align: 'center',
      width:200,
    },
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      // render: (_, record) => {
      //   if (record.remainRuns == 0) {
      //     return <a key="detail1" onClick={() => handleEmpty(record)}> 空托回库 </a>
      //   }
      //   return null
      // }
      render: (_, record) => [
        // (record.remainRuns == 0)
        //   ?
        //   <a key="detail1" onClick={() => handleEmpty(record)}>
        //     空托回库
        //   </a>
        //   :
        //   <a key="detail2" onClick={() => handleSurplus(record)}>
        //     余料回库
        //   </a>,
        
        // (record.remainRuns == 0) && [
        //   <a key="detail1" onClick={() => handleEmpty(record)}>空托回库</a>,
        // ],
        // (record.remainRuns == 0 && selectedstatus != 2) && [
        //   <Divider key="divider1" type="vertical" />
        // ],
        (selectedstatus != 2) && [
          // <a key="detail2" onClick={() => handleManualFinish(record)}>手动完成</a>,
          <a key="detail2" onClick={() => handleManualFinish(record)}>{getFormattedMsg('RawMaterialDeliveryOrderManagement.button.handleManualFinish')}</a>,
          <Divider key="divider2" type="vertical" />,
          // <a key="detail3" onClick={() => handleManualDown(record)}>手动下架</a>,
        ],
        // <a key="detail3" onClick={() => handleManualDown(record)}>手动下架</a>,
        <a key="detail3" onClick={() => handleManualDown(record)}>{getFormattedMsg('RawMaterialDeliveryOrderManagement.button.handleManualDown')}</a>,
      ],
      width: 300,
      // fixed: 'right'
    }
  ];

  const getStrategy = () => {
    ReadIOTServices.getStrategy()
      .then(res => {
        const strategy = res == true ? 1 : 0
        //console.log(strategy, 'strategy');
        setStrategy(strategy)
      })
  }

  const loadData = async (page, pageSize, searchValue) => {
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
    //console.log(state, 'state');
    await ReadIOTServices.updateStrategy(state)
      .then(res => {
        notification.success({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateSuccess')
        })
        // setStrategy(state)
        getStrategy()
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateFailure')
        })
      })
  }

  const handleManualFinish = (record) => {
    Modal.confirm({
      // title: `确认完成订单${record.name}?`,
      title: `${getFormattedMsg('RawMaterialDeliveryOrderManagement.title.handleManualFinish')}${record.name}?`,      
      onOk: async () => {
        await ReadIOTServices
          .manualFinish(record.id)
          .then(res => {
            notification.success({
              // message: '订单手动完成成功'
              message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.manualFinishSuccess')
            })
            loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('global.notify.fail'),
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  const handleManualDown = (record) => {
    setManualDownVis(true)
    setManualDownData(record)
  }

  const modalManualDownFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveManualDown}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelManualDown} style={{ marginRight: 30 }}>
      {getFormattedMsg('RawMaterialDeliveryOrderManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveManualDown = () => {
    //console.log('---',ManualDownSelected.lineId, ManualDownData.id, ManualDownSelected.stockId);
    Modal.confirm({
      // title: `确认下架?`,
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.HandleSaveManualDown'),
      onOk: async () => {
        await ReadIOTServices
          .manualOut(ManualDownSelected.lineId, ManualDownData.id, ManualDownSelected.stockId)
          .then(res => {
            notification.success({
              // message: '手动下架成功'
              message: getFormattedMsg('RawMaterialDeliveryOrderManagement.message.manualSaveSuccess'),
            })
                loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
            handleCancelManualDown()
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('global.notify.fail'),
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  const handleCancelManualDown = () => {
    setManualDownVis(false)
    setManualDownData({})
    setManualDownSelected({})
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
      //console.log('params', params);
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
      //console.log('params', params);

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
              // label={'计划名称'}
              label={getFormattedMsg('RawMaterialDeliveryOrderManagement.label.code')}
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
                //console.log(e, 'e');
                CheckboxChange(e)
              }}
            >
              {/* <Radio.Button value={1} className={styles.leftRadius}>先入先出</Radio.Button>
              <Radio.Button value={0} className={styles.rightRadius}>路径最优</Radio.Button> */}
              <Radio.Button value={1} className={styles.leftRadius}>{getFormattedMsg('RawMaterialDeliveryOrderManagement.button.leftRadius')}</Radio.Button>
              <Radio.Button value={0} className={styles.rightRadius}>{getFormattedMsg('RawMaterialDeliveryOrderManagement.button.rightRadius')}</Radio.Button>
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
              scroll={{ x: 100 }}
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
        destroyOnClose
      >
        <Drawer.DrawerContent>
          <EmptyForm ref={emptyRef} modifyData={emptyData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalEmptyFoot()}</Drawer.DrawerBottomBar>
      </Drawer>

      <Drawer
        // title="余料托盘回库"
        title={getFormattedMsg('RawMaterialDeliveryOrderManagement.title.surplusForm')}
        visible={surplusVis}
        onClose={handleCancelSurplus}
        width={400}
        destroyOnClose
      >
        <Drawer.DrawerContent>
          <SurplusForm ref={surplusRef} modifyData={surplusData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalSurplusFoot()}</Drawer.DrawerBottomBar>
      </Drawer>

      <Modal
        // title={'手动下架'}
        visible={ManualDownVis}
        // footer={modalManualFoot()}
        footer={null}
        onCancel={handleCancelManualDown}
        width={window.innerWidth - 300}
        bodyStyle={{
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        }}
        destroyOnClose
      >
        <ManualDownTable
          ManualDownData={ManualDownData}
          ManualDownSelected={ManualDownSelected}
          setManualDownSelected={setManualDownSelected}
          modalManualDownFoot={modalManualDownFoot}
        />
      </Modal>
    </>
  );
};
export default RawMaterialDeliveryOrderManagement;
