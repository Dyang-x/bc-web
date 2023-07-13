import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, Button, Spin, Pagination, SearchForm, Select, Divider, Input, Modal } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import { taskType, taskKind,TransportTaskType } from '~/enum/enum';
import AgvManagementServices from '~/api/AgvManagement';
import { notification } from '~/../node_modules/antd/lib/index';
import AdjustForm from './AdjustForm';
import { isNull } from 'lodash';

const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page
const { Option } = Select;

const Index = () => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [nowTab, setNowTab] = useState(6);
  const [adjustModalVis, setAdjustModalVis] = useState(false);
  const [adjustModalData, setAdjustModalData] = useState({});
  const adjustRef = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, taskState: nowTab });
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: getFormattedMsg('AgvManagement.title.taskCode'),
        dataIndex: 'taskCode',
        key: 'taskCode',
        align: 'center',
      },
      {
        title: getFormattedMsg('AgvManagement.title.taskType'),
        dataIndex: 'taskType',
        key: 'taskType',
        align: 'center',
        render: (text) => {
          if (text == null) {
            return
          }
          return TransportTaskType[text - 1].name
        }
      },
      {
        title: getFormattedMsg('AgvManagement.title.priority'),
        dataIndex: 'priority',
        key: 'priority',
        align: 'center',
      },
      {
        title: getFormattedMsg('AgvManagement.title.transferCode'),
        dataIndex: 'transferCode',
        key: 'transferCode',
        align: 'center',
      },
      // {
      //   title: getFormattedMsg('AgvManagement.title.overviewCode'),
      //   dataIndex: 'overviewCode',
      //   key: 'overviewCode',
      //   align: 'center',
      // },
      {
        title: getFormattedMsg('AgvManagement.title.fromLocation'),
        dataIndex: 'fromLocation',
        key: 'fromLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('AgvManagement.title.toLocation'),
        dataIndex: 'toLocation',
        key: 'toLocation',
        align: 'center',
      },
      {
        title: getFormattedMsg('AgvManagement.title.operation'),
        key: 'opt',
        align: 'center',
        render: (_, record) => [
          nowTab == 1 && [
            <a key="carIn" onClick={() => handleCarIn(record)}>
              agv请求进入
            </a>,
            <Divider key="divider4" type="vertical" />,

            <a key="adjust" onClick={() => handleAdjust(record)}>{getFormattedMsg('AgvManagement.button.adjust')}</a>,
            <Divider key="divider1" type="vertical" />,
            <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)} >
              {getFormattedMsg('AgvManagement.button.delete')}
            </a>,
            <Divider key="divider2" type="vertical" />,
            <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
              {getFormattedMsg('AgvManagement.button.pause')}
            </a>,
          ],
          nowTab == 2 && [
            // <a key="pause" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handlePause(record)}>
            //   {getFormattedMsg('AgvManagement.button.pause')}
            //   </a>,
            // <Divider key="divider2" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('AgvManagement.button.complete')}</a>
          ],
          nowTab == 3 && [
            <a key="continue" onClick={() => handleContinue(record)} >{getFormattedMsg('AgvManagement.button.continue')}</a>
          ],
          nowTab == 5 && [
            <a key="rollback" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleRollback(record)} >
              {getFormattedMsg('AgvManagement.button.rollback')}
            </a>,
            <Divider key="divider3" type="vertical" />,
            <a key="complete" onClick={() => handleComplete(record)}>{getFormattedMsg('AgvManagement.button.complete')}</a>
          ],
          nowTab == 7 && [
            <a key="agvRequestIn" onClick={() => agvRequestIn(record)} >agv请求进入</a>
          ],
        ],
        width: 300,
      }
    ];
  }, [nowTab]);

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    AgvManagementServices
      .findTaskView({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        if (!isNull(res)) {
          setTableData(res.content);
          setTotalPage(res.totalElements);
          setPage(res.pageable.pageNumber + 1)
          setPageSize(res.pageable.pageSize)
        }
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
      {getFormattedMsg('AgvManagement.button.confirm')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdjust}>
      {getFormattedMsg('AgvManagement.button.cancel')}
    </Button>
  ]

  const HandleSaveAdjust = () => {
    const { getFieldsValue, validateFields, resetFields } = adjustRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await AgvManagementServices.adjustPriority(adjustModalData.id, params.priority)
        .then(res => {
          notification.success({
            message: getFormattedMsg('AgvManagement.message.adjustSuccess'),
          })
          loadData(page, pageSize, { ...searchValue, taskState: nowTab });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('AgvManagement.message.adjustFailure'),
            description: err.message
          })
        })
      resetFields()
      handleCancelAdjust()
    });
  }

  const handlePause = async (record) => {
    await AgvManagementServices.suspendTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('AgvManagement.message.pauseSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('AgvManagement.message.pauseFailure'),
          description: err.message
        })
      })
  }

  const handleCarIn = (record)=>{
    const data ={
      orderId:record.taskCode,
      status:10
    }
    Modal.confirm({
      title: '确认AGV进入',
      onOk: async () => {
        await AgvManagementServices.agvStatus(data)
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

  const agvRequestIn = (record)=>{
    Modal.confirm({
      title: 'AGV请求进入',
      onOk: async () => {
        await AgvManagementServices.agvRequestIn(record.taskCode)
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

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('AgvManagement.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await AgvManagementServices.deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('AgvManagement.message.deleteSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('AgvManagement.message.deleteFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleContinue = async (record) => {
    await AgvManagementServices.continueTask(record.id)
      .then(res => {
        notification.success({
          message: getFormattedMsg('AgvManagement.message.continueSuccess'),
        })
        loadData(page, pageSize, { ...searchValue, taskState: nowTab });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('AgvManagement.message.continueFailure'),
          description: err.message
        })
      })
  }

  const handleRollback = (record) => {
    Modal.confirm({
      title: getFormattedMsg('AgvManagement.title.rollback'),
      okType: 'danger',
      onOk: async () => {
        await AgvManagementServices.backTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('AgvManagement.message.rollbackSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('AgvManagement.message.rollbackFailure'),
              description: err.message
            })
          })
      }
    })
  }

  const handleComplete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('AgvManagement.title.complete'),
      onOk: async () => {
        await AgvManagementServices.finishTask(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('AgvManagement.message.completeSuccess'),
            })
            loadData(page, pageSize, { ...searchValue, taskState: nowTab });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('AgvManagement.message.completeFailure'),
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
              label={getFormattedMsg('AgvManagement.label.taskCode')}
              name="taskCode"
            >
              <Input
                placeholder={getFormattedMsg('AgvManagement.placeholder.taskCode')}
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('AgvManagement.label.taskType')}
              name="taskType"
            >
              <Select
                placeholder={getFormattedMsg('AgvManagement.placeholder.taskType')}
              >
                {TransportTaskType.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('AgvManagement.label.taskKind')}
              name="taskKind"
            >
              <Select
                placeholder={getFormattedMsg('AgvManagement.placeholder.taskKind')}
              >
                {taskKind.map((value, index) => (
                  <Option value={value.id} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('AgvManagement.label.orderCode')}
              name="oderCode"
            >
              <Input
                placeholder={getFormattedMsg('AgvManagement.placeholder.orderCode')}
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
            title={'就绪'}
            name='6'
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('AgvManagement.title.lineTab')}
            name={1}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('AgvManagement.title.executionTab')}
            name={2}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('AgvManagement.title.pauseTab')}
            name={3}
            isComponent
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={'准备进入'}
            name={7}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
          <Pane.Tab
            title={getFormattedMsg('AgvManagement.title.completeTab')}
            name={4}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc()}
            isComponent
          >
            {renderTable}
          </Pane.Tab>
          {/* <Pane.Tab
            title={getFormattedMsg('AgvManagement.title.anomalyTab')}
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
        title={getFormattedMsg('AgvManagement.title.adjustPriority')}
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
