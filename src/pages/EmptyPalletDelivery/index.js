import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
// import styles from './style.scss';
import { CacheTable } from '~/components';
import moment from 'moment';
import EmptyPalletDelivery from '~/api/EmptyPalletDelivery';
import AddOrUpdateForm from './AddOrUpdateForm';
import { isEmpty } from 'lodash';
import { taskType } from '~/enum/enum';

const getFormattedMsg = i18n.getFormattedMsg;
const { showTotal } = page;

const EmptyPalletDeliveryPage = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const state = {
    0: '新建', 1: '下架中', 2: '已完成'
  }
  const [selectedstatus, setSelectedstatus] = useState('0');

  const [addOrUpdateVis, setAddOrUpdateVis] = useState(false);
  const [addOrUpdateData, setAddOrUpdateData] = useState({});
  const addOrUpdateForm = useRef();


  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('EmptyPalletDelivery.title.receiptNumber'),
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('EmptyPalletDelivery.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: '起点',
      dataIndex: 'fromLocation',
      key: 'fromLocation',
      align: 'center',
    },
    {
      title: '中间点',
      dataIndex: 'middle',
      key: 'middle',
      align: 'center',
    },
    {
      title: '终点',
      dataIndex: 'toLocation',
      key: 'toLocation',
      align: 'center',
    },
    {
      title: '出库类型',
      dataIndex: 'inType',
      key: 'inType',
      align: 'center',
      render: (text) => {
        if (text != undefined) {
          return taskType[text - 1].name
        }
      }
    },
    {
      title: getFormattedMsg('EmptyPalletDelivery.title.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: getFormattedMsg('EmptyPalletDelivery.title.creator'),
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: getFormattedMsg('EmptyPalletDelivery.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        record.state == 0 && [<a key="downShelves" onClick={() => handleDownShelves(record)}>
          下架
        </a>,
        <Divider key="divider2" type="vertical" />],
        record.state == 0 && [
          <a key="update" onClick={() => handleUpdate(record)}>
            {getFormattedMsg('EmptyPalletDelivery.button.update')}
          </a>,
          <Divider key="divider1" type="vertical" />,
          <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
            {getFormattedMsg('EmptyPalletDelivery.button.delete')}
          </a>
        ],
        record.state == 1 && [<a key="finishOrder" onClick={() => handleFinishOrder(record)}>
          完成
        </a>,
          // <Divider key="divider3" type="vertical" />
        ],
      ],
      // width: 80,
      // fixed: 'right'
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    EmptyPalletDelivery
      .getByQuery({ ...searchValue, page: page - 1, pageSize })
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
    return () => loadData(page, pageSize, { ...searchValue, state: selectedstatus });
  };

  const onShowSizeChange = (p, s) => {
    loadData(p, s, { ...searchValue, state: selectedstatus });
    // loadData(p, s, { ...setSearchValue });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    // loadData(p, s, { ...setSearchValue });
    loadData(p, s, { ...searchValue, state: selectedstatus });
    setPage(p);
  };

  const handleChangeStatus = e => {
    setTableData([]);
    setSelectedstatus(e.target.value);
    setPage(1);
    // setPageSize(10);
    loadData(1, pageSize, { ...searchValue, state: e.target.value });
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data }
    // setSearchValue({ ...params, state: selectedstatus });
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params, state: selectedstatus });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_quality' }),
    []
  );

  const handleCreate = () => {
    setAddOrUpdateVis(true)
    console.log('addOrUpdateData', addOrUpdateData);
    setAddOrUpdateData({})
  }

  const handleCancelAddOrUpdate = () => {
    const { resetFields } = addOrUpdateForm.current;
    resetFields();
    setAddOrUpdateVis(false)
    setAddOrUpdateData({})
  }

  const modalAddOrUpdateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveAddOrUpdate}>
      {getFormattedMsg('EmptyPalletDelivery.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAddOrUpdate}>
      {getFormattedMsg('EmptyPalletDelivery.button.cancel')}
    </Button>
  ];

  const HandleSaveAddOrUpdate = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = addOrUpdateForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      Object.keys(params).map(i => {
        if (i == 'createTime') {
          addOrUpdateData[i] = moment(params[i], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
          return
        }
        addOrUpdateData[i] = params[i]
      })
      if (!Object.keys(addOrUpdateData).includes('id')) {
        addOrUpdateData.state = 0
      }

      await EmptyPalletDelivery
        .saveOrUpdate(addOrUpdateData)
        .then(res => {
          notification.success({
            message: addOrUpdateData.id == null ? getFormattedMsg('EmptyPalletDelivery.message.addSuccess') : getFormattedMsg('EmptyPalletDelivery.message.updateSuccess')
          });
          loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
      handleCancelAddOrUpdate();
    });
  }

  const handleUpdate = (record) => {
    console.log('record', record);
    setAddOrUpdateVis(true)
    setAddOrUpdateData(record)
  }

  const handleDownShelves = (record) => {
    Modal.confirm({
      title: '确认下架？',
      onOk: async () => {
        await EmptyPalletDelivery
          .downShelves(record.id)
          .then(res => {
            notification.success({
              message: '下架开始成功'
            });
            loadData(page, pageSize, { ...searchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              message: '下架开始失败',
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  const handleFinishOrder = (record) => {
    Modal.confirm({
      title: '确认完成任务？',
      onOk: async () => {
        await EmptyPalletDelivery
          .finishById(record.id)
          .then(res => {
            notification.success({
              message: '任务完成成功'
            });
            loadData(page, pageSize, { ...searchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              message: '任务完成失败',
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('EmptyPalletDelivery.operation.delete'),
      onOk: async () => {
        await EmptyPalletDelivery
          .deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('EmptyPalletDelivery.message.deleteSuccess')
            });
            loadData(page, pageSize, { ...searchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('EmptyPalletDelivery.label.receiptNumber')}
              name="receiptNumber"
            >
              <Input
                placeholder={getFormattedMsg('EmptyPalletDelivery.placeholder.receiptNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('EmptyPalletDelivery.label.trayNumber')}
              name="trayNumber"
            >
              <Input
                placeholder={getFormattedMsg('EmptyPalletDelivery.placeholder.trayNumber')}
                allowClear
              />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('EmptyPalletDelivery.title.tableName')}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
          buttons={[
            <Button key="weighing" type="primary" icon='plus' onClick={() => handleCreate()} >
              {getFormattedMsg('EmptyPalletDelivery.button.create')}
            </Button>,
          ]}
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
              pagination={false}
              scroll={{ x: 'max-content' }}
              dataSource={tableData.map((i, idx) => ({
                ...i,
                serialNumber: (page - 1) * pageSize + ++idx
              }))}
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
      {/* <Drawer
        title={isEmpty(addOrUpdateData)?'新增':'修改'}
        visible={addOrUpdateVis}
        onClose={handleCancelAddOrUpdate}
        width={500}
      >
        <Drawer.DrawerContent>
          <AddOrUpdateForm addOrUpdateData={addOrUpdateData} ref={addOrUpdateForm} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddOrUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer> */}
      <Modal
        title={isEmpty(addOrUpdateData) ? getFormattedMsg('EmptyPalletDelivery.title.create') : getFormattedMsg('EmptyPalletDelivery.title.update')}
        visible={addOrUpdateVis}
        footer={modalAddOrUpdateFoot()}
        onCancel={handleCancelAddOrUpdate}
        destroyOnClose
        width={800}
      >
        <AddOrUpdateForm addOrUpdateData={addOrUpdateData} ref={addOrUpdateForm} />
      </Modal>
    </>
  );
};
export default EmptyPalletDeliveryPage;