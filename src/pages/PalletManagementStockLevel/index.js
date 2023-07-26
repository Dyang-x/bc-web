import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, notification, Drawer, Select, Button, SearchForm, Pagination, Input, Divider, Checkbox, Modal, Form } from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import TrayForm from './TrayForm';
import PrepareAreaServices from '~/api/PrepareArea';
import { PrepareAreaState } from '~/enum/enum';
import TransferBoxServices from '~/api/TransferBox';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery'

const getFormattedMsg = i18n.getFormattedMsg;
const { Option } = Select;
const { showTotal } = page
const PalletManagementStockLevel = () => {
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [addTrayVisible, setAddTrayVisible] = useState(false);
  const [updateTrayVisible, setUpdateTrayVisible] = useState(false);
  const [addTransferVis, setAddTransferVis] = useState(false);
  const [updateStateVis, setUpdateStateVisVis] = useState(false);

  const [transferList, setTransferList] = useState([]);
  const [modifyData, setModifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState();
  const [selectedUpdateState, setSelectedUpdateState] = useState();
  const [searchValue, setSearchValue] = useState(null);

  const [shelfVis, setShelfVis] = useState(false);
  const [shelfData, setShelfData] = useState({});
  const [location, setLocation] = useState('J002');
  const middles = [
    { id: 1, name: 'J002', value: 'J002', },
    { id: 2, name: 'J003', value: 'J003', },
  ]

  const searchRef = useRef(null);
  const addForm = useRef();
  const updateForm = useRef();

  useEffect(() => {
    loadData(pageInfo.page, pageInfo.pageSize, { ...setSearchValue });
    getTransfer();
  }, []);

  const columns = [
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.areaCode'),
      dataIndex: 'areaCode',
      key: 'areaCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.areaState'),
      dataIndex: 'areaState',
      key: 'areaState',
      align: 'center',
      render: (text, record) => {
        const a = text - 1
        return PrepareAreaState[a].name
      }
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.transferCode'),
      dataIndex: 'transferCode',
      key: 'transferCode',
      align: 'center',
    },
    // {
    //   title: getFormattedMsg('PalletManagementStockLevel.title.taskState'),
    //   dataIndex: 'taskState',
    //   key: 'taskState',
    //   align: 'center',
    // },
    // {
    //   title: getFormattedMsg('PalletManagementStockLevel.title.joinArea'),
    //   dataIndex: 'joinArea',
    //   key: 'joinArea',
    //   align: 'center',
    // },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.equipmentName'),
      dataIndex: 'equipmentName',
      key: 'equipmentName',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
                <a key="shelf" onClick={() => HandleShelf(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.shelf')}
        </a>,
        <Divider key="divider4" type="vertical" />,
        <a key="takedown" onClick={() => HandleTakedown(record)}>
          {/* {getFormattedMsg('PalletManagementConnectionPort.button.Takedown')} */}
          下架
        </a>,
        <Divider key="divider5" type="vertical" />,
        <a key="addTransfer" onClick={() => handleAddTransfer(record)}>
          {getFormattedMsg('PalletManagementStockLevel.button.addTransfer')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="updateState" onClick={() => handleUpdateState(record)}>
          {getFormattedMsg('PalletManagementStockLevel.button.updateState')}
        </a>,
        <Divider key="divider2" type="vertical" />,
        <a key="update" onClick={() => handleUpdate(record)}>
          {getFormattedMsg('PalletManagementStockLevel.button.update')}
        </a>,
        <Divider key="divider3" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
          {getFormattedMsg('PalletManagementStockLevel.button.delete')}
        </a>,
        // <Divider key="divider4" type="vertical" />,
        // <Checkbox key="checkbox" defaultChecked={record.automaticState} onChange={(e) => CheckboxChange(e, record)}>{getFormattedMsg('PalletManagementStockLevel.button.checkbox')}</Checkbox>
      ],
      width: 500,
      // fixed: 'right'
    }
  ];

  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    await PrepareAreaServices.findByArea({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setDataSource(res.content);
        setTotal(res.totalElements);
        const pageInfos = {
          page: res.pageable.pageNumber + 1,
          pageSize: res.pageable.pageSize
        }
        setPageInfo(pageInfos)
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
    setLoading(false);
  };

  //刷新按钮
  const reFreshFunc = () => {
    return () => loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
  };

  const onHandleChange = (page, pageSize) => {
    // loadData(page, pageSize, { ...setSearchValue });
    loadData(page, pageSize, { ...searchValue });
    setPageInfo({ page, pageSize });
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data }
    //console.log('params', params);
    setSearchValue({ ...params });
    setPageInfo({ page: 1, pageSize: 10 });
    loadData(1, 10, { ...params });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_quality1' }),
    []
  );

  const HandleShelf = record => {
    setShelfVis(true)
    setShelfData(record)
  };

  const shelfCancel = () => {
    setShelfVis(false)
    setShelfData({})
  }

  const modalShelfFoot = () => [
    <Button key="save" type="primary" onClick={shelfSave}>
    {getFormattedMsg('PalletManagementStockLevel.button.save')}
    </Button>,
    <Button key="cancel" onClick={shelfCancel}>
    {getFormattedMsg('PalletManagementStockLevel.button.cancel')}
    </Button>
  ];

  const shelfSave =()=>{

    const data = {
      origin: shelfData.areaCode,
      // middle: shelfData.areaCode,
      middle: location,
      trayNumber: shelfData.transferCode,
      state: 0,
      // { id: 5, name: '原料托盘回库', value: '原料托盘回库', },
      // { id: 7, name: '半成品托盘回库', value: '半成品托盘回库', },
      taskType: shelfData.areaCode == 'J001' ? 5 : 7,
      inType: shelfData.areaCode == 'J001' ? 5 : 7,
    }
    console.log('data', data);
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${shelfData.transferCode}?`,
      onOk: () => {
        addAndUpShelves(data)
      }
    });
  }

  
    //托盘上架  新增并上架
    const addAndUpShelves = async (data) => {
      await EmptyPalletsWarehousingApi
        .addAndupShelves(data)
        .then(res => {
          notification.success({
            message: '托盘入库任务生成成功'
          });
          loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
    }

    const HandleTakedown =  record => {
      Modal.confirm({
        // title: `${getFormattedMsg('PalletManagement.title.pullOffPallet')}${record.transferCode}?`,
        title: `确认在备料区${record.areaCode}下架托盘?`,
        onOk: async() => {
          await EmptyPalletDeliveryApi.callTransferOut({qrName:record.areaCode})
          .then(res => {
            notification.success({
              message: '托盘下架成功'
            })
            loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
          })
          .catch(err => {
            notification.warning({
              message: '托盘下架失败',
              description: err.message
            })
          })
        }
      });
  
    };

  const handleDelete = record => {
    Modal.confirm({
      title: getFormattedMsg('PalletManagementStockLevel.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await PrepareAreaServices.deletePrepare(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagement.message.deleteSuccess')
            })
            loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagement.message.deleteFailure'),
              description: err.message
            })
          })
      }
    });
  };

  const CheckboxChange = async (e, record) => {
    const automaticState = e.target.checked
    const data = record
    data.automaticState = automaticState
    await PrepareAreaServices.updatePrepareArea(data)
      .then(res => {
        notification.success({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateSuccess')
        })
        loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateFailure')
        })
      })
  }

  const showAddTray = () => {
    setAddTrayVisible(true)
  }

  const handleCancelAdd = () => {
    setAddTrayVisible(false)
    setUpdateTrayVisible(false)
    setModifyData(null)
    const { getFieldsValue, validateFields, resetFields } = addForm.current;
    resetFields()
  }

  const modalAddTrayFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveAdd}>
    {getFormattedMsg('PalletManagementStockLevel.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdd}>
    {getFormattedMsg('PalletManagementStockLevel.button.cancel')}
    </Button>
  ];

  const handleSaveAdd = () => {
    const { getFieldsValue, validateFields, resetFields } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (params.automaticState == null) {
        params.automaticState = false
        params.areaState = 0
      }
      await PrepareAreaServices.createPrepareArea(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('PalletManagementStockLevel.message.addSuccess')
          })
          loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('PalletManagementStockLevel.message.addFailure')
          })
        })
      resetFields()
      handleCancelAdd()
    });
  }

  const handleUpdate = record => {
    setUpdateTrayVisible(true)
    setModifyData(record)
  };

  const handleCancelUpdate = () => {
    setAddTrayVisible(false)
    setUpdateTrayVisible(false)
    setModifyData(null)
    const { getFieldsValue, validateFields, resetFields } = updateForm.current;
    resetFields()
  }

  const modalUpdateTrayFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveUpdate}>
      {getFormattedMsg('PalletManagementStockLevel.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelUpdate}>
      {getFormattedMsg('PalletManagementStockLevel.button.cancel')}
    </Button>
  ];

  const handleSaveUpdate = () => {
    const { getFieldsValue, validateFields, resetFields } = updateForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (modifyData != null) {
        Object.keys(modifyData).map(i => {
          if (params[i] == null) {
            params[i] = modifyData[i]
          }
        })
      }
      await PrepareAreaServices.updatePrepareArea(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('PalletManagementStockLevel.message.updateSuccess')
          })
          loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('PalletManagementStockLevel.message.updateFailure')
          })
        })
      resetFields()
      handleCancelUpdate()
    });
  }

  const handleAddTransfer = (record) => {
    setAddTransferVis(true)
    setModifyData(record)
  }

  const getTransfer = async (searchValue) => {
    //console.log(searchValue, 'searchValue');
    await TransferBoxServices.getPage({ code: searchValue, page: pageInfo.page - 1, pageSize: pageInfo.pageSize })
      .then(res => {
        setTransferList(res.content);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  const addTransferSave = async () => {
    await PrepareAreaServices.addTransfer(modifyData.areaCode, selectedTransfer)
      .then(res => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.bindingSuccess'),
        });
        loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.bindingFailure'),
          description: err.message
        });
      });
    addTransferCancel()
  }

  const addTransferCancel = () => {
    setAddTransferVis(false)
    setSelectedTransfer()
    setModifyData()
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleUpdateState = (record) => {
    setUpdateStateVisVis(true)
    setModifyData(record)
  }

  const updateStateSave = async () => {
    await PrepareAreaServices.updateState(modifyData.areaCode, selectedUpdateState)
      .then(res => {
        loadData(pageInfo.page, pageInfo.pageSize, { ...searchValue });
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementStockLevel.message.updateFailure'),
          description: err.message
        });
      });
    updateStateCancel()
  }

  const updateStateCancel = () => {
    setUpdateStateVisVis(false)
    setSelectedUpdateState()
    setModifyData()
  }
  return (
    <>
      <HVLayout>
        <HVLayout.Pane style={{ overflow: 'hidden' }} height="auto">
          <SearchForm onSearch={handleSearch} ref={searchRef}>
            <SearchForm.Item
              label={getFormattedMsg('PalletManagementStockLevel.label.areaCode')}
              name="areaCode"
            >
              <Input allowClear placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.areaCode')} />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('PalletManagementStockLevel.title.tableName')}
          buttons={[
            <Button
              key="add"
              h-icon="add"
              type="primary"
              onClick={showAddTray}
            >
              {getFormattedMsg('PalletManagementStockLevel.button.add')}
            </Button>
          ]}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
        >
          <Table
            loading={loading}
            rowKey={record => record.id}
            dataSource={dataSource}
            bordered
            columns={columns}
            pagination={false}
            scroll={{ x: 'max-content' }}
          // noIndex
          />
          <HVLayout.Pane.BottomBar>
            <Pagination
              current={pageInfo.page}
              pageSize={pageInfo.pageSize}
              showQuickJumper
              size="small"
              total={total}
              showSizeChanger
              onShowSizeChange={onHandleChange}
              onChange={onHandleChange}
              showTotal={(total, range) => showTotal(total, range)}
            />
          </HVLayout.Pane.BottomBar>
        </HVLayout.Pane>
      </HVLayout>
      <Modal
        title={getFormattedMsg('PalletManagementStockLevel.title.add')}
        visible={addTrayVisible}
        footer={modalAddTrayFoot()}
        onCancel={handleCancelAdd}
        destroyOnClose
        width={800}
      >
        <TrayForm
          ref={addForm}
          modifyData={modifyData}
          type={false}
        />
      </Modal>
      <Drawer title={getFormattedMsg('PalletManagementStockLevel.title.update')} visible={updateTrayVisible} onClose={handleCancelUpdate} width={500}>
        <Drawer.DrawerContent>
          <TrayForm
            ref={updateForm}
            modifyData={modifyData}
            type={true}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateTrayFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        title={getFormattedMsg('PalletManagementStockLevel.title.binding')}
        visible={addTransferVis}
        onOk={addTransferSave}
        onCancel={addTransferCancel}
        destroyOnClose
        width={500}
      >
        <Form {...formItemLayout}>
          <Form.Item label={getFormattedMsg('PalletManagementStockLevel.title.trayNumber')}>
            <Select
              placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.transferCode')}
              onSearch={getTransfer}
              showSearch
              filterOption={false}
              onChange={(value) => {
                setSelectedTransfer(value)
              }}
            >
              {transferList.map((value, index) => (
                <Option value={value.code} key={value.id}>
                  {value.code} -- {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={getFormattedMsg('PalletManagementStockLevel.title.updateState')}
        visible={updateStateVis}
        onOk={updateStateSave}
        onCancel={updateStateCancel}
        destroyOnClose
        width={500}
      >
        <Form {...formItemLayout}>
          <Form.Item label={getFormattedMsg('PalletManagementStockLevel.title.areaState')}>
            <Select
              placeholder={getFormattedMsg('PalletManagementStockLevel.placeholder.areaState')}
              // onSearch={() => getTransfer()}
              showSearch
              filterOption={false}
              onChange={(value) => {
                setSelectedUpdateState(value)
              }}
            >
              {PrepareAreaState.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'托盘上架'}
        visible={shelfVis}
        onCancel={shelfCancel}
        footer={modalShelfFoot()}
        destroyOnClose
      >
        <div style={{ display: 'flex' }}>
          <div style={{
            width: '15%',
            display: 'flex',
            justifyContent: 'middle',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            中间点：
          </div>
          <Select
            placeholder={'请选择中间点'}
            showSearch
            filterOption={false}
            onChange={(e) => {
              setLocation(e)
            }}
            value={location}
          >
            {
              middles.length && middles.map(item => {
                return (<Option key={item.id} value={item.value}>{item.value}</Option>)
              })
            }
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default PalletManagementStockLevel;
