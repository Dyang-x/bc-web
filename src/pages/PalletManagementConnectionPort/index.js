import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, notification, Drawer, Select, Button, SearchForm, Pagination, Input, Divider, Checkbox, Modal, Form } from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import { debounce } from 'lodash';
import { CacheTable } from '~/components';
import joinAreaServices from '~/api/joinArea';
import JoinAreaForm from './JoinAreaForm';
// import { state } from '~/enum/PalletManagementConnectionPort';
import { dockingPointState } from '~/enum/enum';
import TransferBoxServices from '~/api/TransferBox';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery'

import { withPermission } from '@hvisions/core';

const getFormattedMsg = i18n.getFormattedMsg;
const { Option } = Select;
const { showTotal } = page

const ShelfButton = withPermission('a', 'Shelf');
const TakedownButton = withPermission('a', 'Takedown');
const AddTransferButton = withPermission('a', 'AddTransfer');
const UnbindButton = withPermission('a', 'Unbind');
const UpdateStateButton = withPermission('a', 'UpdateState');

const PalletManagementConnectionPort = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [modifyData, setModifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const addForm = useRef();
  const [addJoinAreaVis, setAddJoinAreaVis] = useState(false);
  const [addTransferVis, setAddTransferVis] = useState(false);
  const [updateStateVis, setUpdateStateVisVis] = useState(false);
  const [transferList, setTransferList] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState();
  const [selectedUpdateState, setSelectedUpdateState] = useState();

  useEffect(() => {
    loadData();
    getTransfer();
  }, []);

  const columns = [
    {
      title: getFormattedMsg('PalletManagementConnectionPort.title.DockingPort'),
      dataIndex: 'joinCode',
      key: 'joinCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementConnectionPort.title.state'),
      dataIndex: 'joinState',
      key: 'joinState',
      align: 'center',
      render: (value, record, index) => {
        //  const joinState = state.filter(i=>i.id == value)
        //  //console.log(joinState,'joinState');
        //   return joinState[0].value
        return dockingPointState[value - 1].value
      }
    },
    {
      title: getFormattedMsg('PalletManagementConnectionPort.title.trayNumber'),
      dataIndex: 'transferCode',
      key: 'transferCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementConnectionPort.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <ShelfButton key="shelf" onClick={() => HandleShelf(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.shelf')}
        </ShelfButton>,
        <Divider key="divider1" type="vertical" />,
        <TakedownButton key="takedown" onClick={() => HandleTakedown(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.takedown')}
          {/* 下架 */}
        </TakedownButton>,
        <Divider key="divider2" type="vertical" />,
        <AddTransferButton key="addTransfer" onClick={() => handleAddTransfer(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.addTransfer')}
        </AddTransferButton>,
        <Divider key="divider3" type="vertical" />,
        <UnbindButton key="unbind" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleUnbind(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.unbind')}
        </UnbindButton>,
        <Divider key="divider4" type="vertical" />,
        <UpdateStateButton key="updateState" onClick={() => handleUpdateState(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.updateState')}
        </UpdateStateButton>,
        // <Divider key="divider5" type="vertical" />,
        // <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
        //   {getFormattedMsg('PalletManagementConnectionPort.button.delete')}
        // </a>,
      ],
      width: 500,
    }
  ];

  const loadData = async () => {
    setLoading(true);
    await joinAreaServices.findJoin()
      .then(res => {
        setDataSource(res);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
    setLoading(false);
  };

  const HandleShelf = async record => {
    const data = {
      origin: record.joinCode,
      middle: record.joinCode,
      trayNumber: record.transferCode,
      state: 0,
      // { id: 5, name: '原料托盘回库', value: '原料托盘回库', },
      // { id: 7, name: '半成品托盘回库', value: '半成品托盘回库', },
      taskType:record.joinCode == 'J001' ? 5 : 7,
      inType: record.joinCode == 'J001' ? 5 : 7,
    }
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${record.transferCode}?`,
      onOk: () => {
        addAndUpShelves(data)
      }
    });
  };

    //托盘上架  新增并上架
    const addAndUpShelves = async (data) => {
      await EmptyPalletsWarehousingApi
        .addAndupShelves(data)
        .then(res => {
          notification.success({
            // message: '托盘入库任务生成成功'
            message: getFormattedMsg('PalletManagement.message.addAndUpShelves')
          });
          loadData();
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
    }

  const HandleTakedown =  record => {
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagementConnectionPort.title.handleTakedown')}${record.joinCode}${getFormattedMsg('PalletManagementConnectionPort.title.pullOff')}?`,
      // title: `确认在接驳口${record.joinCode}下架托盘?`,
      onOk: async() => {
        await EmptyPalletDeliveryApi.callTransferOut({qrName:record.joinCode})
        .then(res => {
          notification.success({
            // message: '托盘下架成功',
            message: getFormattedMsg('PalletManagementConnectionPort.message.removedSuccess'),
          })
          loadData();
        })
        .catch(err => {
          notification.warning({
            // message: '托盘下架失败',
            message: getFormattedMsg('PalletManagementConnectionPort.message.removedFailure'),
            description: err.message
          })
        })
      }
    });

  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, key: 'pallet_management_connection_port' }),
    []
  );

  // const onHandleChange = (page, pageSize) => {
  //   setPageInfo({ page, pageSize });
  // };

  const rowSelection = {
    hideDefaultSelections: false,
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {

    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const onRowClick = record => {
    setSelectedRowKeys([record.id]);
  };

  const showAddJoinArea = () => {
    setAddJoinAreaVis(true)
  }

  const modalAddJoinAreaFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveAdd}>
      {getFormattedMsg('PalletManagementConnectionPort.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdd}>
      {getFormattedMsg('PalletManagementConnectionPort.button.cancel')}
    </Button>
  ];

  const handleCancelAdd = () => {
    setAddJoinAreaVis(false)
    const { getFieldsValue, validateFields, resetFields } = addForm.current;
    resetFields()
  }

  const handleSaveAdd = () => {
    const { getFieldsValue, validateFields, resetFields } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await joinAreaServices.addJoinAre(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('PalletManagementConnectionPort.message.addSuccess')
          })
          loadData();
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('PalletManagementConnectionPort.message.addFailure')
          })
        })
      resetFields()
      handleCancelAdd()
    });
  }

  const handleDelete = record => {
    Modal.confirm({
      title: getFormattedMsg('PalletManagementConnectionPort.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await joinAreaServices.deleteJoin(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagementConnectionPort.message.deleteSuccess')
            })
            loadData();
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagementConnectionPort.message.deleteFailure'),
              description: err.message
            })
          })
      }
    });
  };

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
    await joinAreaServices.addTransfer(modifyData.joinCode, selectedTransfer)
      .then(res => {
        notification.warning({
          message: getFormattedMsg('PalletManagementConnectionPort.message.bindingSuccess'),
        });
        loadData();
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementConnectionPort.message.bindingFailure'),
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

  const handleUnbind =(record)=>{
    Modal.confirm({
      title: getFormattedMsg('PalletManagementConnectionPort.title.unbind'),
      okType: 'danger',
      onOk: async () => {
        await joinAreaServices.deleteTransfer(record.joinCode,record.transferCode)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagementConnectionPort.message.unbindingSuccess')
            })
            loadData();
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagementConnectionPort.message.unbindingFailure'),
              description: err.message
            })
          })
      }
    });
  }

  const handleUpdateState = (record) => {
    setUpdateStateVisVis(true)
    setModifyData(record)
  }

  const updateStateSave = async () => {
    await joinAreaServices.updateState(modifyData.joinCode, selectedUpdateState)
      .then(res => {
        loadData();
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('PalletManagementConnectionPort.message.updateFailure'),
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
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('PalletManagementConnectionPort.title.tableName')}
          settingButton={<SettingButton />}
          onRefresh={loadData}
          // buttons={[
          //   <Button
          //     key="add"
          //     h-icon="add"
          //     type="primary"
          //     onClick={showAddJoinArea}
          //   >
          //     {getFormattedMsg('PalletManagementConnectionPort.button.add')}
          //   </Button>
          // ]}
        >
          <Table
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
            dataSource={dataSource}
            columns={columns}
            rowKey={record => record.id}
            rowSelection={rowSelection}
            onRow={record => {
              return {
                onClick: () => {
                  onRowClick(record);
                }
              };
            }}
          />
          {/* <HVLayout.Pane.BottomBar>
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
          </HVLayout.Pane.BottomBar> */}
        </HVLayout.Pane>
      </HVLayout>
      <Modal
        title={getFormattedMsg('PalletManagementConnectionPort.title.add')}
        visible={addJoinAreaVis}
        footer={modalAddJoinAreaFoot()}
        onCancel={handleCancelAdd}
        destroyOnClose
        width={800}
      >
        <JoinAreaForm
          ref={addForm}
          modifyData={modifyData}
          type={false}
        />
      </Modal>
      <Modal
        title={getFormattedMsg('PalletManagementConnectionPort.title.binding')}
        visible={addTransferVis}
        onOk={addTransferSave}
        onCancel={addTransferCancel}
        destroyOnClose
        width={500}
      >
        <Form {...formItemLayout}>
          <Form.Item label={getFormattedMsg('PalletManagementConnectionPort.title.trayNumber')}>
            <Select
              placeholder={getFormattedMsg('PalletManagementConnectionPort.placeholder.transferCode')}
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
        title={getFormattedMsg('PalletManagementConnectionPort.title.updateState')}
        visible={updateStateVis}
        onOk={updateStateSave}
        onCancel={updateStateCancel}
        destroyOnClose
        width={500}
      >
        <Form {...formItemLayout}>
          <Form.Item label={getFormattedMsg('PalletManagementConnectionPort.title.areaState')}>
            <Select
              placeholder={getFormattedMsg('PalletManagementConnectionPort.placeholder.areaState')}
              // onSearch={() => getTransfer()}
              showSearch
              filterOption={false}
              onChange={(value) => {
                setSelectedUpdateState(value)
              }}
            >
              {dockingPointState.map((value, index) => (
                <Option value={value.id} key={value.id}>
                  {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PalletManagementConnectionPort;
