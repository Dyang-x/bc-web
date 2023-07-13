import React, { useState, useEffect, useMemo } from 'react';
import {
  HVLayout,
  Button,
  notification,
  Modal,
  Divider,
  Radio,
  Pagination,
  Input,
  DatePicker,
  SearchForm,
  Tooltip, Select
} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import retrievalApi from '~/api/retrieval';
import moment from 'moment';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { Pane } = HVLayout;
const { showTotal } = page;

const RetrievalManagerment = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedstatus, setSelectedstatus] = useState('0');
  const [searchValue, setSearchValue] = useState(null);
  const [putInStoragestate, setPutInStoragestate] = useState({
    0: '出库中',
    1: '已完成',
    2: '全部'
  });

  const type = [
    { key: 1, value: '手动出库' },
    { key: 2, value: '原料领料出库' },
    { key: 4, value: '半成品领料出库' },
    { key: 13, value: '半成品退料出库' },
  ]

  useEffect(() => {
    loadTableData(page, pageSize, { ...setSearchValue, status: selectedstatus });
  }, []);

  const columns = [
    {
      title: '出库单号',
      dataIndex: 'owNumber',
      key: 'owNumber',
      render: (_, record) => {
        if (!record.owNumber) {
          return '暂无';
        }
        return (
          <Tooltip placement="left" title={record.owNumber}>
            {record.owNumber}
          </Tooltip>
        )
      },
      width: 200
    },

    {
      title: '出库类型',
      dataIndex: 'stockType',
      key: 'type',
      render: (_, record) => {
        if (!record.stockType) {
          return '暂无';
        }
        if (record.stockType == 1) {
          return (
            <Tooltip placement="left" title={record.stockType}>
              手动出库
            </Tooltip>
          )
        }
        if (record.stockType == 2) {
          return (
            <Tooltip placement="left" title={record.stockType}>
              原料领料出库
            </Tooltip>
          )
        }
        if (record.stockType == 4) {
          return (
            <Tooltip placement="left" title={record.stockType}>
              半成品领料出库
            </Tooltip>
          )
        }
        if (record.stockType == 13) {
          return (
            <Tooltip placement="left" title={record.stockType}>
              半成品退料出库
            </Tooltip>
          )
        }
      },
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: text => {
        if (text == 0) {
          return '出库中';
        }
        if (text == 1) {
          return '已完成';
        }
      },
      width: 150
    },

    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      align: 'center',
      render: (_, record) => {
        if (!record.operatorName) {
          return '暂无';
        }
        return (
          <Tooltip placement="left" title={record.operatorName}>
            {record.operatorName}
          </Tooltip>
        )
          ;
      },
      width: 200
    },

    {
      title: '出库时间',
      dataIndex: 'outStockTime',
      key: 'outStockTime',
      align: 'center',
      render: (_, record) => {
        if (!record.outStockTime) {
          return '暂无';
        }
        return (
          <Tooltip placement="left" title={record.outStockTime}>
            {record.outStockTime}
          </Tooltip>
        )
      },
      width: 170
    },
    {
      title: '关联单号',
      dataIndex: 'associateNumber',
      key: 'associateNumber',
      render: (_, record) => {
        if (!record.associateNumber) {
          return '暂无';
        }
        return (
          <Tooltip placement="left" title={record.associateNumber}>
            {record.associateNumber}
          </Tooltip>
        )
      },
      width: 200
    },
    {
      title: getFormattedMsg('global.label.operation'),
      dataIndex: 'opt',
      key: 'opt',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (_, record) => [
        record.status == 0 && [
          <a key="complete" onClick={() => onHandlCompleted(record)}>
            出库完成
          </a>,
          <Divider type="vertical" key="divider1" />
        ],
        <a key="detail" onClick={() => onHandleDetail(record)}>
          {getFormattedMsg('global.btn.detail')}
        </a>,
        record.status == 0 && [
          <Divider type="vertical" key="divider2" />,
          //   <a key="download" onClick={() => onHandleDownload(record)}>
          //     下载
          //   </a>,
          //   <Divider type="vertical" key="divider3" />,
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
      pathname: '/retrieval-managerment/retrieval-operate',
      state: {
        state: 0
      }
    });
  };

  const onHandleDetail = record => {
    history.push({
      pathname: '/retrieval-managerment/retrieval-operate',
      state: {
        purchaseNo: record.receiptNumber,
        id: record.id,
        state: record.status,
        type: record.stockType,
      }
    });
  };

  const handleSearch = data => {
    const params = { ...data }
    if (params.outStockTime && params.outStockTime.length > 0) {
      params.startTime = moment(params.outStockTime[0]).format(dateTime)
      params.endTime = moment(params.outStockTime[1]).format(dateTime)
    }
    setSearchValue({ ...params, status: selectedstatus });
    setPage(1);
    setPageSize(10);
    loadTableData(1, 10, { ...params, status: selectedstatus == 2 ? '' : selectedstatus });
  };
  const handleChangeStatus = e => {
    setSelectedstatus(e.target.value);
    setPage(1);
    // setPageSize(10);
    loadTableData(1, pageSize, {
      ...searchValue,
      status: e.target.value == 2 ? '' : e.target.value
    });
  };
  const loadTableData = (page, pageSize, searchValue) => {
    setLoading(true);
    const params = {
      ...searchValue,
      page: page - 1,
      pageSize
    };
    retrievalApi
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
    loadTableData(p, s, { ...setSearchValue, status: selectedstatus == 2 ? '' : selectedstatus });
    setPageSize(s);
  };
  const pageChange = (p, s) => {
    loadTableData(p, s, { ...setSearchValue, status: selectedstatus == 2 ? '' : selectedstatus });
    setPage(p);
  };
  const onHandlCompleted = record => {
    Modal.confirm({
      title: getFormattedMsg(`是否确认出库【${record.owNumber}】`),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await handleInStore(record.id);
      }
    });
  };
  const handleInStore = id => {
    retrievalApi
      .onInStore(id)
      .then(res => {
        notification.success({
          message: '操作成功'
        });
        loadTableData(page, pageSize, {
          ...setSearchValue,
          status: selectedstatus == '2' ? '' : selectedstatus
        });
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.submitFail'),
          description: err.message
        });
      });
  };
  const onHandleDownload = () => { };
  const onHandleDelete = record => {
    //deleteRetrievalById
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: record.owNumber }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await retrievalApi
          .deleteRetrievalById(record.id)
          .then(() => {
            loadTableData(page, pageSize, {
              ...setSearchValue,
              status: selectedstatus == '2' ? '' : selectedstatus
            });
            notification.success({
              message: '删除成功',
              description: '删除出库单成功'
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
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_retrieval_management' }),
    []
  );

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item label={getFormattedMsg('retrieval.label.owNumber')} name="owNumber">
              <Input placeholder="请输入出库单号" allowClear />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('retrieval.label.outStockTime')}
              name="outStockTime"
            >
              <RangePicker format={dateTime} showTime />
            </SearchForm.Item>
            <SearchForm.Item label={'出库单类型'} name="type">
              <Select
                placeholder="请选择出库单类型"
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
          title="手动出库列表"
          buttons={[
            <Button key="add" h-icon="add" type="primary" onClick={showAddPurcase}>
              物料出库
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
            </Radio.Group>
          </div>
          <Table
            loading={loading}
            pagination={false}
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
export default RetrievalManagerment;
