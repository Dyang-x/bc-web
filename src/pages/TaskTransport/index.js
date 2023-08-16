import React, { useEffect, useState, useMemo, Fragment, useRef } from 'react';
import { HVLayout, Button, Spin, Pagination, SearchForm, Select, DatePicker, Divider, Input, Modal } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
// import { taskState, taskType, taskKind } from '~/enum/enum';
import TaskTranSportServices from '~/api/TaskTranSport';
import { notification } from '~/../node_modules/antd/lib/index';
import AdjustForm from './AdjustForm';
import { withPermission } from '@hvisions/core';

const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page
const { Option } = Select;

const AdjustButton = withPermission('a', 'Adjust');
const DeleteButton = withPermission('a', 'Delete');
const PauseButton = withPermission('a', 'Pause');
const AgainButton = withPermission('a', 'Again');
const CompleteButton = withPermission('a', 'Complete');
const ContinueButton = withPermission('a', 'Continue');
const RollbackButton = withPermission('a', 'Rollback');

const Index = ({ taskKind ,taskType}) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({ taskKind: taskKind }); 
  const [nowTab, setNowTab] = useState(1);
  const [adjustModalVis, setAdjustModalVis] = useState(false);
  const [adjustModalData, setAdjustModalData] = useState({});
  const adjustRef = useRef();




  useEffect(() => {
    loadData(page, pageSize, { ...searchValue, taskState: nowTab });
  }, []);

  const columns = useMemo(() => {
    // const updateTimeTitle = nowTab==4?'任务完成时间':'任务启动时间'
    const updateTimeTitle = nowTab == 4 ? getFormattedMsg('TaskTransport.title.finishTime') : getFormattedMsg('TaskTransport.title.updateTime')
    return [
      {
        title: getFormattedMsg('TaskTransport.title.taskCode'),
        dataIndex: 'taskCode',
        key: 'taskCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.taskType'),
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
      {
        title: updateTimeTitle,
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.transferCode'),
        dataIndex: 'transferCode',
        key: 'transferCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.fromLocation'),
        dataIndex: 'fromLocation',
        key: 'fromLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.toLocation'),
        dataIndex: 'toLocation',
        key: 'toLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.priority'),
        dataIndex: 'priority',
        key: 'priority',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskTransport.title.operation'),
        key: 'opt',
        align: 'center',
        render: (_, record) => [
          nowTab == 1 && [
            <AdjustButton key="adjust" onClick={() => handleAdjust(record)}>{getFormattedMsg('TaskTransport.button.adjust')}</AdjustButton>,
            <Divider key="divider1" type="vertical" />,
            <DeleteButton key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)} >
              {getFormattedMsg('TaskTransport.button.delete')}
            </DeleteButton>,
            <Divider key="divider2" type="vertical" />,
            <PauseButton key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
              {getFormattedMsg('TaskTransport.button.pause')}
            </PauseButton>,
          ],
          nowTab == 2 && [
            // <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
            //   {getFormattedMsg('TaskTransport.button.pause')}
            // </a>,
            // <Divider key="divider2" type="vertical" />,
            <AgainButton key="again"  onClick={() => handleAgain(record)}>
              {/* 再次执行 */}
              {getFormattedMsg('TaskTransport.button.handleAgain')}
            </AgainButton>,
            <Divider key="divider2" type="vertical" />,
            <CompleteButton key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskTransport.button.complete')}</CompleteButton>
          ],
          nowTab == 3 && [
            <ContinueButton key="continue" onClick={() => handleContinue(record)} >{getFormattedMsg('TaskTransport.button.continue')}</ContinueButton>
          ],
          nowTab == 5 && [
            <RollbackButton key="rollback" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleRollback(record)} >
              {getFormattedMsg('TaskTransport.button.rollback')}
            </RollbackButton>,
            <Divider key="divider3" type="vertical" />,
            <CompleteButton key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskTransport.button.complete')}</CompleteButton>
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
    setSearchValue({ ...params, taskKind: taskKind });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params, taskKind: taskKind, taskState: nowTab });
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
      {getFormattedMsg('TaskTransport.button.confirm')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdjust}>
      {getFormattedMsg('TaskTransport.button.cancel')}
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
            message: getFormattedMsg('TaskTransport.message.adjustSuccess'),
          })
          loadData(page, pageSize, { ...searchValue, taskState: nowTab });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('TaskTransport.message.adjustFailure'),
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
          message: getFormattedMsg('TaskTransport.message.pauseSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('TaskTransport.message.pauseFailure'),
          description: err.message
        })
      })
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskTransport.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await TaskTranSportServices.deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskTransport.message.deleteSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskTransport.message.deleteFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleAgain = (record) => {
    Modal.confirm({
      // title: '确认再次执行任务？',
      title: getFormattedMsg('TaskTransport.title.handleAgain'),
      okType: 'danger',
      onOk: async () => {
        await TaskTranSportServices.manualRbg(record.id)
          .then(res => {
            notification.success({
              // message: '任务再次执行成功',
              message: getFormattedMsg('TaskTransport.message.againSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              // message: '任务再次执行失败',
              message: getFormattedMsg('TaskTransport.message.againFailure'),
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
          message: getFormattedMsg('TaskTransport.message.continueSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('TaskTransport.message.continueFailure'),
          description: err.message
        })
      })
  }

  const handleRollback = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskTransport.title.rollback'),
      okType: 'danger',
      onOk: async () => {
        await TaskTranSportServices.backTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskTransport.message.rollbackSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskTransport.message.rollbackFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleComplete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskTransport.title.complete'),
      onOk: async () => {
        if(taskKind ==1){
          await TaskTranSportServices.finishRBG(record.taskCode)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskTransport.message.completeSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskTransport.message.completeFailure'),
              description: err.message
            })
          })
          return
        }
        await TaskTranSportServices.finishTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskTransport.message.completeSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskTransport.message.completeFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const { Table, SettingButton } = useMemo(() => CacheTable({ columns: columns, scrollHeight: 'calc(100vh - 480px)', key: `bc_task_transport` }), [nowTab]);

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
              label={getFormattedMsg('TaskTransport.label.taskCode')}
              name="taskCode"
            >
              <Input
                placeholder={getFormattedMsg('TaskTransport.placeholder.taskCode')}
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('TaskTransport.label.taskType')}
              name="taskType"
            >
              <Select
                placeholder={getFormattedMsg('TaskTransport.placeholder.taskType')}
              >
                {taskType.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
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
            title={getFormattedMsg('TaskTransport.title.lineTab')}
            name='1'
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskTransport.title.executionTab')}
            name={2}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskTransport.title.pauseTab')}
            name={3}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskTransport.title.completeTab')}
            name={4}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
          {/* <Pane.Tab
            title={getFormattedMsg('TaskTransport.title.anomalyTab')}
            name={5}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab> */}
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