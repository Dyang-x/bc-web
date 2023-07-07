import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, Button, Spin, Pagination, SearchForm, Select, Divider, Input, Modal } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import { taskState, taskType } from '~/enum/enum';
import TaskOverviewServices from '~/api/TaskOverview';
import { notification } from '~/../node_modules/antd/lib/index';
import AdjustForm from './AdjustForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page
const { Option } = Select;

const Index = ({ history }) => {

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [nowTab, setNowTab] = useState(1);
  const [adjustModalVis, setAdjustModalVis] = useState(false);
  const [adjustModalData, setAdjustModalData] = useState({});
  const adjustRef = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, taskState: nowTab });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: getFormattedMsg('TaskOverview.title.taskCode'),
        dataIndex: 'taskCode',
        key: 'taskCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.taskType'),
        dataIndex: 'taskType',
        key: 'taskType',
        align: 'center',
        render: (text) => {
          if (text == null) {
            return
          }
          return taskType[text - 1].name
        }
      },
      {
        title: getFormattedMsg('TaskOverview.title.priority'),
        dataIndex: 'priority',
        key: 'priority',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.transferCode'),
        dataIndex: 'transferCode',
        key: 'transferCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.orderCode'),
        dataIndex: 'orderCode',
        key: 'orderCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.fromLocation'),
        dataIndex: 'fromLocation',
        key: 'fromLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.middle'),
        dataIndex: 'middle',
        key: 'middle',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.toLocation'),
        dataIndex: 'toLocation',
        key: 'toLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('TaskOverview.title.agvState'),
        dataIndex: 'agvState',
        key: 'agvState',
        align: 'center',
        render: (text) => {
          if (text == null) {
            return
          }
          return taskState[text - 1].name
        }
      },
      {
        title: getFormattedMsg('TaskOverview.title.transportState'),
        dataIndex: 'transportState',
        key: 'transportState',
        align: 'center',
        render: (text) => {
          if (text == null) {
            return
          }
          return taskState[text - 1].name
        }
      },
      {
        title: getFormattedMsg('TaskOverview.title.operation'),
        key: 'opt',
        align: 'center',
        render: (_, record) => [
          nowTab == 1 && [
            <a key="adjust" onClick={() => handleAdjust(record)}>{getFormattedMsg('TaskOverview.button.adjust')}</a>,
            <Divider key="divider1" type="vertical" />,
            <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)} >
              {getFormattedMsg('TaskOverview.button.delete')}
            </a>,
            <Divider key="divider2" type="vertical" />,
            <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
              {getFormattedMsg('TaskOverview.button.pause')}
              </a>,
          ],
          nowTab == 2 && [
            // <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
            //   {getFormattedMsg('TaskOverview.button.pause')}
            //   </a>,
            // <Divider key="divider2" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskOverview.button.complete')}</a>
          ],
          nowTab == 3 && [
            <a key="continue" onClick={() => handleContinue(record)} >{getFormattedMsg('TaskOverview.button.continue')}</a>
          ],
          nowTab == 5 && [
            <a key="rollback" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleRollback(record)} >
              {getFormattedMsg('TaskOverview.button.rollback')}
            </a>,
            <Divider key="divider3" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('TaskOverview.button.complete')}</a>
          ],
        ],
        width: 300,
      }
    ];
  }, [nowTab]);

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    TaskOverviewServices
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
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params, taskState: nowTab });
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
      {getFormattedMsg('TaskOverview.button.confirm')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdjust}>
      {getFormattedMsg('TaskOverview.button.cancel')}
    </Button>
  ]

  const HandleSaveAdjust = () => {
    const { getFieldsValue, validateFields, resetFields } = adjustRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await TaskOverviewServices.adjustPriority(adjustModalData.id, params.priority)
        .then(res => {
          notification.success({
            message: getFormattedMsg('TaskOverview.message.adjustSuccess'),
          })
          loadData(page, pageSize, { ...searchValue, taskState: nowTab });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('TaskOverview.message.adjustFailure'),
            description: err.message
          })
        })
      resetFields()
      handleCancelAdjust()
    });
  }

  const handlePause = async (record) => {
    await TaskOverviewServices.suspendTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('TaskOverview.message.pauseSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('TaskOverview.message.pauseFailure'),
          description: err.message
        })
      })
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskOverview.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await TaskOverviewServices.deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskOverview.message.deleteSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskOverview.message.deleteFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleContinue = async (record) => {
    await TaskOverviewServices.continueTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('TaskOverview.message.continueSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('TaskOverview.message.continueFailure'),
          description: err.message
        })
      })
  }

  const handleRollback = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskOverview.title.rollback'),
      okType: 'danger',
      onOk: async () => {
        await TaskOverviewServices.backTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskOverview.message.rollbackSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskOverview.message.rollbackFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleComplete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('TaskOverview.title.complete'),
      onOk: async () => {
        await TaskOverviewServices.finishTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('TaskOverview.message.completeSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('TaskOverview.message.completeFailure'),
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
              label={getFormattedMsg('TaskOverview.label.taskCode')}
              name="taskCode"
            >
              <Input
                placeholder={getFormattedMsg('TaskOverview.placeholder.taskCode')}
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('TaskOverview.label.taskType')}
              name="taskType"
            >
              <Select
                placeholder={getFormattedMsg('TaskOverview.placeholder.taskType')}
              >
                {taskType.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('TaskOverview.label.orderCode')}
              name="oderCode"
            >
              <Input
                placeholder={getFormattedMsg('TaskOverview.placeholder.orderCode')}
              />
            </SearchForm.Item>
          </SearchForm>
        </Pane>
        <Pane
          tab
          onTabChange={e => {
            console.log(e, 'e');

            setNowTab(+e);
            loadData(page, pageSize, { ...searchValue, taskState: e });
          }}
        >
          <Pane.Tab
            title={getFormattedMsg('TaskOverview.title.lineTab')}
            name='1'
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskOverview.title.executionTab')}
            name={2}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskOverview.title.pauseTab')}
            name={3}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('TaskOverview.title.completeTab')}
            name={4}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
          {/* <Pane.Tab
            title={getFormattedMsg('TaskOverview.title.anomalyTab')}
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
