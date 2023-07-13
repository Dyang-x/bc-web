import React, { useState, useEffect, useMemo } from 'react';
import {
  HVLayout,
  Button,
  notification,
  Modal,
  Divider,
  Spin,
  Radio,
  Pagination,
  SearchForm,
  Input,
  DatePicker,
  Tooltip, Select
} from '@hvisions/h-ui';
import { CacheTable } from '~/components';
import { i18n, page } from '@hvisions/toolkit';
import styles from './style.scss';
import putInStoragApi from '~/api/putInStorage';
import moment from 'moment';

const getFormattedMsg = i18n.getFormattedMsg;
// const Import = withPermission(Button, 'icon');
const { Pane } = HVLayout;
const { showTotal } = page;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const ManualPutInStorage = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchaseState, setPurchaseState] = useState({});
  const [selectedstatus, setSelectedstatus] = useState('1');
  const [searchValue, setSearchValue] = useState(null);
  const [putInStoragestate, setPutInStoragestate] = useState({
    1: '执行中',
    2: '已完成',
    3: '全部',
  });
  // const [putInStoragestate, setPutInStoragestate] = useState([
  //   {key:1 ,status:1 ,name:'执行中'},
  //   {key:2 ,status:4 ,name:'上架中'},
  //   {key:3 ,status:2 ,name:'已完成'},
  //   {key:4 ,status:3 ,name:'全部'},
  // ]);

  const type = [
    { key: 2, value: '手动入库' },
    { key: 1, value: '原料采购入库' },
    { key: 3, value: '半成品生产入库' },
    { key: 9, value: '半成品余料回库' },
    { key: 10, value: '原料余料回库' },
  ]

  useEffect(() => {
    loadTableData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      title: '入库单号',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      render: (_, record) => {
        if (!record.receiptNumber) {
          return '暂无';
        } else {
          return (
            <Tooltip placement="left" title={record.receiptNumber}>
              {record.receiptNumber}
            </Tooltip>
          );
        }
      },
      width: 200
    },
    {
      title: '入库类型',
      dataIndex: 'type',
      key: 'type',
      render: (_, record) => {
        if (!record.type) {
          return '暂无';
        }
        if (record.type == 1) {
          return (
            <Tooltip placement="left" title={record.type}>
              原料采购入库
            </Tooltip>
          )
        }
        if (record.type == 2) {
          return (
            <Tooltip placement="left" title={record.type}>
              手动入库
            </Tooltip>
          )
        }
        if (record.type == 3) {
          return (
            <Tooltip placement="left" title={record.type}>
              半成品生产入库
            </Tooltip>
          )
        }
        if (record.type == 9) {
          return (
            <Tooltip placement="left" title={record.type}>
              半成品余料回库
            </Tooltip>
          )
        }
        if (record.type == 10) {
          return (
            <Tooltip placement="left" title={record.type}>
              原料余料回库
            </Tooltip>
          )
        }

      },
      width: 150
    },
    // {
    //   title: getFormattedMsg('procurement.label.supplier'),
    //   dataIndex: 'supplierName',
    //   key: 'supplierName',
    //   render: (_, record) => {
    //     if (!record.supplierName) {
    //       return '暂无';
    //     } else {
    //       return (
    //         <Tooltip placement="left" title={record.supplierName}>
    //           {record.supplierName}
    //         </Tooltip>
    //       );
    //     }
    //   },
    //   width: 200
    // },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render: text => {
        if (text == 1) {
          return '执行中';
        }
        if (text == 2) {
          return '已完成';
        }
      },
      width: 150
    },
    {
      title: '托盘号',
      dataIndex: 'trayNumber',
      align: 'center',
      key: 'trayNumber',
      render: (_, record) => {
        if (!record.trayNumber) {
          return '暂无';
        } else {
          return (
            <Tooltip placement="left" title={record.trayNumber}>
              {record.trayNumber}
            </Tooltip>
          );
        }
      },
      width: 150
    },
    
    {
      title: '操作人',
      dataIndex: 'operator',
      align: 'center',
      key: 'operator',
      render: (_, record) => {
        if (!record.operator) {
          return '暂无';
        } else {
          return (
            <Tooltip placement="left" title={record.operator}>
              {record.operator}
            </Tooltip>
          );
        }
      },
      width: 200
    },
    {
      title: '收货时间',
      dataIndex: 'actualInTime',
      align: 'center',
      key: 'actualInTime',
      render: (_, record) => {
        if (!record.actualInTime) {
          return '暂无';
        } else {
          return (
            <Tooltip placement="left" title={record.actualInTime}>
              {record.actualInTime}
            </Tooltip>
          );
        }
      },
      width: 170
    },
    {
      title: getFormattedMsg('global.label.operation'),
      key: 'opt',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        record.state == 1 && (
          <a key="inStorage" onClick={() => onHandleInStorage(record)}>
            确认入库
          </a>
        ),
        record.state == 1 && <Divider type="vertical" key="divider1" />,
        <a key="detail" onClick={() => onHandleDetail(record)}>
          {getFormattedMsg('global.btn.detail')}
        </a>,
        record.state == 1 && [
          <Divider type="delete" key="divider2" />,
          <a
            key="delete"
            onClick={() => onHandleDelete(record)}
            style={{ color: 'var(--ne-delete-button-font)' }}
          >
            删除
          </a>
        ]
      ]
    }
  ];

  const showAddPurcase = () => {
    history.push({
      pathname: '/manual-putInStorage/manual-inStorage-operate',
      state: { state: 1 }
    });
  };

  const onHandleDetail = record => {
    history.push({
      pathname: '/manual-putInStorage/manual-inStorage-operate',
      state: {
        purchaseNo: record.receiptNumber,
        id: record.id,
        state: record.state,
        type: record.type,
      }
    });
  };

  const handleSearch = data => {
    const params = { ...data }
    if (params.deliveryDate && params.deliveryDate.length > 0) {
      params.startTime = moment(params.deliveryDate[0]).format(dateTime)
      params.endTime = moment(params.deliveryDate[1]).format(dateTime)
    }
    setSearchValue({ ...params, state: selectedstatus });
    setPage(1);
    setPageSize(10);
    loadTableData(1, 10, { ...params, state: selectedstatus == 3 ? '' : selectedstatus });
  };
  const handleChangeStatus = e => {
    setSelectedstatus(e.target.value);
    setPage(1);
    // setPageSize(10);
    loadTableData(1, pageSize, {
      ...searchValue,
      state: e.target.value == 3 ? '' : e.target.value
    });
  };
  const loadTableData = (page, pageSize, searchValue) => {
    setLoading(true);
    const params = {
      ...searchValue,
      page: page - 1,
      pageSize,
      // type: '2'
    };
    putInStoragApi
      .getQueryList(params)
      .then(res => {
        setTableData(res.content);
        setTotalPage(res.totalElements);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        notification.warning({
          message: getFormattedMsg('global.notify.submitFail'),
          description: err.message
        });
      });
  };
  const onShowSizeChange = (p, s) => {
    loadTableData(p, s, { ...setSearchValue, state: selectedstatus == 3 ? '' : selectedstatus });
    setPageSize(s);
  };
  const pageChange = (p, s) => {
    loadTableData(p, s, { ...setSearchValue, state: selectedstatus == 3 ? '' : selectedstatus });
    setPage(p);
  };
  const onHandleInStorage = record => {
    Modal.confirm({
      title: getFormattedMsg(`是否确认入库【${record.receiptNumber}】`),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await handleInStore(record.id);
      }
    });
  };
  const handleInStore = id => {
    putInStoragApi
      .onInStore(id)
      .then(res => {
        notification.success({
          message: '入库成功'
        });
        loadTableData(page, pageSize, {
          ...setSearchValue,
          state: selectedstatus == '3' ? '' : selectedstatus
        });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.submitFail'),
          description: err.message
        });
      });
  };
  const onHandleDelete = record => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', {
        name: record.receiptNumber
      }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await putInStoragApi
          .deleteOrder(record.id)
          .then(() => {
            notification.success({
              message: '删除成功',
              description: '删除入库单成功'
            });
            loadTableData(page, pageSize, {
              ...setSearchValue,
              state: selectedstatus == '3' ? '' : selectedstatus
            });
          })
          .catch(err => {
            notification.warning({
              message: '删除失败',
              description: err.message
            });
          });
      }
    });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ scrollHeight: 'calc(100vh - 470px)', key: 'wms_manual_put_in_storage', columns }),
    []
  );

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('procurement.label.putInstorage')}
              name="receiptNumber"
            >
              <Input placeholder="请输入入库单号" allowClear />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('procurement.label.actualDeliveryDate')}
              name="deliveryDate"
            >
              <RangePicker
                format={dateTime}
                placeholder={['起始时间', '结束时间']}
                style={{ width: '100%' }}
                showTime
              />
            </SearchForm.Item>
            <SearchForm.Item label={'入库单类型'} name="type" >
              <Select
                placeholder="请选择入库单类型"
              >
                {
                  type.map(item => {
                    return (<Option key={item.key} value={item.key} >{item.value}</Option>)
                  })
                }
              </Select>
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title="手动入库表"
          buttons={[
            <Button
              key="add"
              h-icon="add"
              type="primary"
              className={styles['center']}
              onClick={showAddPurcase}
            >
              新增入库
            </Button>
          ]}
          settingButton={<SettingButton />}
          onRefresh={() => handleSearch(searchValue)}
        >
          <div style={{ marginBottom: '12px' }}>
            <Radio.Group defaultValue={selectedstatus} onChange={handleChangeStatus} size="large">
              {putInStoragestate &&
                Object.keys(putInStoragestate).map(item => {
                  return (
                    <Radio.Button key={item} value={item}>
                      {putInStoragestate[item]}
                    </Radio.Button>
                  );
                })}
              {/* {putInStoragestate &&
                putInStoragestate.map(item => {
                  return (
                    <Radio.Button key={item.key} value={item.status}>
                      {item.name}
                    </Radio.Button>
                  );
                })} */}
            </Radio.Group>
          </div>
          <Table
            pagination={false}
            loading={loading}
            scroll={{ x: 'max-content' }}
            dataSource={tableData.map((i, idx) => ({
              ...i,
              serialNumber: (page - 1) * pageSize + ++idx
            }))}
            columns={columns}
            rowKey={record => record.id}
          />
          <Pane.BottomBar>
            <Pagination
              onShowSizeChange={onShowSizeChange}
              current={page}
              onChange={pageChange}
              defaultCurrent={page}
              total={totalPage}
              size="small"
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => showTotal(total, range)}
              pageSize={pageSize}
            />
          </Pane.BottomBar>
        </HVLayout.Pane>
      </HVLayout>
    </>
  );
};
export default ManualPutInStorage;
