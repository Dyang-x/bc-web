import React, { useEffect, useState, useMemo, Fragment, useRef } from 'react';
import { HVLayout, Button, Spin, Pagination, SearchForm, Select, DatePicker, Divider, Input, Modal } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
// import { taskState, taskType, taskKind } from '~/enum/enum';
import TaskTranSportServices from '~/api/TaskTranSport';
import { notification } from '~/../node_modules/antd/lib/index';
import AdjustForm from './AdjustForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page
const { Option } = Select;

const Index = ({ taskKind, taskType }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({ taskKind: taskKind });
  const [nowTab, setNowTab] = useState(6);
  const [adjustModalVis, setAdjustModalVis] = useState(false);
  const [adjustModalData, setAdjustModalData] = useState({});
  const adjustRef = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...searchValue, taskState: nowTab });
  }, []);

  const columns = useMemo(() => {
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
      // {
      //   title: getFormattedMsg('TaskTransport.title.middle'),
      //   dataIndex: 'middle',
      //   key: 'middle',
      //   align: 'center',
      // },
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
          nowTab == 6 && [
            <a key="start" onClick={() => handleStart(record)} >手动开始</a>
          ],
          nowTab == 1 && [
            <a key="adjust" onClick={() => handleAdjust(record)}>{getFormattedMsg('TaskTransport.button.adjust')}</a>,
            <Divider key="divider1" type="vertical" />,
            <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)} >
              {getFormattedMsg('TaskTransport.button.delete')}
            </a>,
            <Divider key="divider2" type="vertical" />,
            <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
              {getFormattedMsg('TaskTransport.button.pause')}
            </a>,
          ],
          nowTab == 2 && [
            // <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
            //   {getFormattedMsg('TaskTransport.button.pause')}
            // </a>,
            // <Divider key="divider2" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskTransport.button.complete')}</a>
          ],
          nowTab == 3 && [
            <a key="continue" onClick={() => handleContinue(record)} >{getFormattedMsg('TaskTransport.button.continue')}</a>
          ],
          nowTab == 5 && [
            <a key="rollback" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleRollback(record)} >
              {getFormattedMsg('TaskTransport.button.rollback')}
            </a>,
            <Divider key="divider3" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskTransport.button.complete')}</a>
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

  const handleStart =(record)=>{
    Modal.confirm({
      title: '确认任务开始？',
      onOk: async () => {
        await TaskTranSportServices.manualSt2(record.taskCode)
          .then(res => {
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              description: err.message
            })
          })
      }
    })
  }

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
        if (taskKind == 1) {
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
            title={'就绪'}
            name='6'
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskTransport.title.lineTab')}
            name={1}
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
