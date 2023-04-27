import React, { useEffect, useState, useMemo, Fragment, useRef } from 'react';
import { HVLayout, Button, Spin, Pagination, SearchForm, Select, DatePicker, Divider, Input, Modal } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import { taskState, taskType, taskKind } from '~/enum/enum';
import TaskTranSportServices from '~/api/TaskTranSport';
import { notification } from '~/../node_modules/antd/lib/index';
import AdjustForm from './AdjustForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page
const { Option } = Select;

const Index = ({ taskKind }) => {
  const [workOrderList, setWorkOrderList] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({ taskKind: 1 }); //库区转运
  const [nowTab, setNowTab] = useState(1);
  const [adjustModalVis, setAdjustModalVis] = useState(false);
  const [adjustModalData, setAdjustModalData] = useState({});
  const adjustRef = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...searchValue, taskState: nowTab });
  }, []);

  useEffect(() => {

  }, [workOrderList]);

  const columns = useMemo(() => {
    return [
      {
        title: getFormattedMsg('ReservoirPLC.title.taskCode'),
        dataIndex: 'taskCode',
        key: 'taskCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('ReservoirPLC.title.taskType'),
        dataIndex: 'taskType',
        key: 'taskType',
        align: 'center',
        render: (text, recoed, index) => {
          if (text == null) {
            return
          }
          return taskType[text - 1].name
        }
      },
      // {
      //   title: getFormattedMsg('ReservoirPLC.title.taskKind'),
      //   dataIndex: 'taskKind',
      //   key: 'taskKind',
      //   align: 'center',
      //   render: (text, recoed, index) => {
      //     if (text == null) {
      //       return
      //     }
      //     return taskKind[text - 1].name
      //   }
      // },
      {
        title: '托盘号',
        dataIndex: 'transferCode',
        key: 'transferCode',
        align: 'center',
      },
      {
        title: '起始位置',
        dataIndex: 'fromLocation',
        key: 'fromLocation',
        align: 'center',
      },
      {
        title: '中间位置',
        dataIndex: 'middle',
        key: 'middle',
        align: 'center',
      },
      {
        title: '目标位置',
        dataIndex: 'toLocation',
        key: 'toLocation',
        align: 'center',
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        align: 'center',
      },
      {
        title: getFormattedMsg('ReservoirPLC.title.operation'),
        key: 'opt',
        align: 'center',
        render: (_, record) => [
          nowTab == 1 && [
            <a key="adjust" onClick={() => handleAdjust(record)}>{getFormattedMsg('ReservoirPLC.button.adjust')}</a>,
            <Divider key="divider1" type="vertical" />,
            <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)} >
              {getFormattedMsg('ReservoirPLC.button.delete')}
            </a>
          ],
          nowTab == 2 && [
            <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
              {getFormattedMsg('ReservoirPLC.button.pause')}
            </a>,
            <Divider key="divider2" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('ReservoirPLC.button.complete')}</a>
          ],
          nowTab == 3 && [
            <a key="continue" onClick={() => handleContinue(record)} >{getFormattedMsg('ReservoirPLC.button.continue')}</a>
          ],
          nowTab == 5 && [
            <a key="rollback" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleRollback(record)} >
              {getFormattedMsg('ReservoirPLC.button.rollback')}
            </a>,
            <Divider key="divider3" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('ReservoirPLC.button.complete')}</a>
          ],
        ],
        width: 300,
      }
    ];
  }, [nowTab]);

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    TaskTranSportServices
      .findTaskView({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setTableData(res.content);
        setTotalPage(res.totalElements);
        setPage(res.pageable.pageNumber + 1)
        setPageSize(res.pageable.pageSize)
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  //刷新按钮
  const reFreshFunc = () => {
    return () => loadData(page, pageSize, { ...searchValue, taskState: nowTab });
  };

  const onShowSizeChange = (p, s) => {
    loadData(p, s, { ...searchValue, taskState: nowTab });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    loadData(p, s, { ...searchValue, taskState: nowTab });
    setPage(p);
  };

  //查询按钮
  const handleSearch = data => {
    if (data.taskCode == "") { delete data.taskCode }
    if (data.taskType == undefined) { delete data.taskType }
    if (data.oderCode == "") { delete data.oderCode }
    const params = { ...data }
    setSearchValue({ ...params, taskKind: 1 });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params, taskKind: 1, taskState: nowTab });
  };

  const handleAdjust = (record) => {
    setAdjustModalVis(true)
    setAdjustModalData(record)
  }

  const handleCancelAdjust = () => {
    setAdjustModalVis(false)
    setAdjustModalData({})
  }

  const modalAdjustFoot = () => [
    <Button key="confirm" type="primary" onClick={HandleSaveAdjust}>
      {getFormattedMsg('ReservoirPLC.button.confirm')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdjust}>
      {getFormattedMsg('ReservoirPLC.button.cancel')}
    </Button>
  ]

  const HandleSaveAdjust = () => {
    const { getFieldsValue, validateFields, resetFields } = adjustRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await TaskTranSportServices.adjustPriority(adjustModalData.id, params.priority)
        .then(res => {
          notification.success({
            message: getFormattedMsg('ReservoirPLC.message.adjustSuccess'),
          })
          loadData(page, pageSize, { ...searchValue, taskState: nowTab });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('ReservoirPLC.message.adjustFailure'),
            description: err.message
          })
        })
      resetFields()
      handleCancelAdjust()
    });
  }

  const handlePause = async (record) => {
    await TaskTranSportServices.suspendTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('ReservoirPLC.message.pauseSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('ReservoirPLC.message.pauseFailure'),
          description: err.message
        })
      })
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('ReservoirPLC.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await TaskTranSportServices.deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('ReservoirPLC.message.deleteSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('ReservoirPLC.message.deleteFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleContinue = async (record) => {
    await TaskTranSportServices.continueTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('ReservoirPLC.message.continueSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('ReservoirPLC.message.continueFailure'),
          description: err.message
        })
      })
  }

  const handleRollback = (record) => {
    Modal.confirm({
      title: getFormattedMsg('ReservoirPLC.title.rollback'),
      okType: 'danger',
      onOk: async () => {
        await TaskTranSportServices.backTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('ReservoirPLC.message.rollbackSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('ReservoirPLC.message.rollbackFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleComplete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('ReservoirPLC.title.complete'),
      onOk: async () => {
        await TaskTranSportServices.finishTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('ReservoirPLC.message.completeSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('ReservoirPLC.message.completeFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const { Table, SettingButton } = useMemo(() => CacheTable({ columns: columns, scrollHeight: 'calc(100vh - 480px)', key: `work_process_execute` }), [nowTab]);

  const renderTable = useMemo(() => {
    return (
      <>
        <Pane.Content>
          <Spin spinning={loading}>
            <Table
              rowKey={record => record.id}
              dataSource={tableData}
              columns={columns}
              filterMultiple={false}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Spin>
        </Pane.Content>
        <Pane.BottomBar>
          <Pagination
            current={page}
            pageSize={pageSize}
            defaultCurrent={page}
            total={totalPage}
            size="small"
            showSizeChanger
            showQuickJumper
            showTotal={showTotal}
            onChange={pageChange}
            onShowSizeChange={onShowSizeChange}
          />
        </Pane.BottomBar>
      </>
    );
  }, [tableData, page, pageSize, totalPage, loading, nowTab]);

  return (
    <>
      <HVLayout >
        <Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('ReservoirPLC.label.taskCode')}
              name="taskCode"
            >
              <Input
                placeholder={getFormattedMsg('ReservoirPLC.placeholder.taskCode')}
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('ReservoirPLC.label.taskType')}
              name="taskType"
            >
              <Select
                placeholder={getFormattedMsg('ReservoirPLC.placeholder.taskType')}
              >
                {taskType.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('ReservoirPLC.label.taskKind')}
              name="taskKind"
            >
              <Select
                placeholder={getFormattedMsg('ReservoirPLC.placeholder.taskKind')}
              >
                {taskKind.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('ReservoirPLC.label.orderCode')}
              name="oderCode"
            >
              <Input
                placeholder={getFormattedMsg('ReservoirPLC.placeholder.orderCode')}
              />
            </SearchForm.Item>
          </SearchForm>
        </Pane>
        <Pane
          tab
          onTabChange={e => {
            setNowTab(+e);
            loadData(page, pageSize, { ...searchValue, taskState: e });
          }}
        >
          <Pane.Tab
            title={getFormattedMsg('ReservoirPLC.title.lineTab')}
            name='1'
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('ReservoirPLC.title.executionTab')}
            name={2}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('ReservoirPLC.title.pauseTab')}
            name={3}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('ReservoirPLC.title.completeTab')}
            name={4}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('ReservoirPLC.title.anomalyTab')}
            name={5}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
        </Pane>
      </HVLayout>
      <Modal
        title={getFormattedMsg('TaskOverview.title.adjustPriority')}
        visible={adjustModalVis}
        onCancel={handleCancelAdjust}
        footer={modalAdjustFoot()}
        destroyOnClose
        width={900}
      >
        <AdjustForm ref={adjustRef} formData={adjustModalData} />
      </Modal>
    </>
  );
};

export default Index;
