import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  DatePicker,
  Input,
  Tooltip,
  Drawer
} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
// import styles from './style.scss';
import { CacheTable } from '~/components';
import moment from 'moment';
import { session } from '@hvisions/toolkit';
import SemiFinishedWarehousingReceiptApi from '~/api/SemiFinishedWarehousingReceipt';
import AddOrUpdateForm from './AddOrUpdateForm';
import { forIn, isEmpty, map } from 'lodash';
// import { attributeOne,attributeTwo,dockingPoints,sortPositions } from '~/enum/semiFinished';
import { attributeOne, attributeTwo, dockingPoints, sortPositions } from '~/enum/enum';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { showTotal } = page;

const SurplusInStorage = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const state = {
    0: '新建',
    1: '转运中',
    2: '已完成'
  };
  const [selectedstatus, setSelectedstatus] = useState('0');

  const [addVis, setAddVis] = useState(false);
  const addForm = useRef();

  const [updateVis, setUpdateVis] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const updateForm = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('SurplusInStorage.title.receiptNumber'),
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.creator'),
      dataIndex: 'creator',
      key: 'creator',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.updateCreator'),
      dataIndex: 'updateCreator',
      key: 'updateCreator',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.orderCount'),
      dataIndex: 'orderCount',
      key: 'orderCount',
      align: 'center',
      render: (text, record, index) => {
        const dataSource = [
          {
            id: 1,
            trayNumber: 'J004004004004004004',
            location: 'J004',
            attributeTwo: 'J004',
            pickingPoint: 'J004'
          }
        ];
        const table = (
          <div>
            {' '}
            <ul style={{ paddingLeft: 15, marginBottom: '0px' }}>
              {' '}
              {dataSource.map(item => (
                <li key={item.id}>{item.trayNumber}</li>
              ))}{' '}
            </ul>{' '}
          </div>
        );
        return (
          <Tooltip placement="rightTop" title={table} arrowPointAtCenter>
            <span>{text}</span>
          </Tooltip>
        );
      }
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.attributeThree'),
      dataIndex: 'attributeThree',
      key: 'attributeThree',
      align: 'center',
      render: (text, record, index) => {
        if (text == null) {
          return;
        }
        return attributeTwo[text - 1].name;
      }
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.dockingPoint'),
      dataIndex: 'dockingPoint',
      key: 'dockingPoint',
      align: 'center',
      render: (text, record, index) => {
        if (text == null) {
          return;
        }
        return dockingPoints[text - 1].name;
      }
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.sortPosition'),
      dataIndex: 'sortPosition',
      key: 'sortPosition',
      align: 'center',
      render: (text, record, index) => {
        if (text == null) {
          return;
        }
        return sortPositions[text - 1].name;
      }
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.operation'),
      key: 'opt',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a key="update" onClick={() => handleUpdate(record)}>
          {getFormattedMsg('SurplusInStorage.button.update')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a
          key="delete"
          style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }}
          onClick={() => handleDelete(record)}
        >
          {getFormattedMsg('SurplusInStorage.button.delete')}
        </a>,
        <Divider key="divider2" type="vertical" />,
        <a key="warehousing" type="primary" onClick={() => handleWarehousing(record)}>
          {getFormattedMsg('SurplusInStorage.button.warehousing')}
        </a>
      ]
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    SemiFinishedWarehousingReceiptApi.getByQuery({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setTableData(res.content);
        setTotalPage(res.totalElements);
        setPage(res.pageable.pageNumber + 1);
        setPageSize(res.pageable.pageSize);
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
    const params = { ...data };

    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime);
      params.endTime = moment(params.creationTime[1]).format(dateTime);
    }
    delete params.creationTime;
    console.log('params', params);

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

  const handleAdd = () => {
    setAddVis(true);
  };

  const handleCancelAdd = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVis(false);
  };

  const modalAddFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveAdd}>
      {getFormattedMsg('SurplusInStorage.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdd}>
      {getFormattedMsg('SurplusInStorage.button.cancel')}
    </Button>
  ];

  const handleSaveAdd = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (!isEmpty(params.attributeOne)) {
        params.attributeOne = params.attributeOne.toString();
      }
      console.log(params, 'params');
      // await SemiFinishedWarehousingReceiptApi
      //   .bindSemiMaterial(params)
      //   .then(res => {
      //     notification.success({
      //       message: getFormattedMsg('SurplusInStorage.message.addSuccess')
      //     });
      //     loadData(page, pageSize, { ...searchValue, state: selectedstatus });
      //   })
      //   .catch(err => {
      //     notification.warning({
      //       message: getFormattedMsg('SurplusInStorage.message.addFailure'),
      //       description: err.message
      //     });
      //   });
      handleCancelAdd();
    });
  };

  const handleUpdate = record => {
    console.log(record, 'handleUpdate  record');
    setUpdateVis(true);
    setUpdateData(record);
  };

  const handleCancelUpdate = () => {
    const { resetFields } = updateForm.current;
    resetFields();
    setUpdateVis(false);
    setUpdateData(null);
  };

  const modalUpdateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveUpdate}>
      {getFormattedMsg('SurplusInStorage.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelUpdate}>
      {getFormattedMsg('SurplusInStorage.button.cancel')}
    </Button>
  ];

  const HandleSaveUpdate = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = updateForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (!isEmpty(params.attributeOne)) {
        params.attributeOne = params.attributeOne.toString();
      }
      Object.keys(params).map(i => {
        updateData[i] = params[i];
      });
      notification.warning({
        message: '没有接口'
      });
      // await SemiFinishedWarehousingReceiptApi
      //   .updateSemiMaterial(updateData)
      //   .then(res => {
      //     notification.success({
      //       message: getFormattedMsg('SurplusInStorage.message.updateSuccess'),
      //     });
      //     loadData(page, pageSize, { ...searchValue, state: selectedstatus });
      //   })
      //   .catch(err => {
      //     notification.warning({
      //       message: getFormattedMsg('SurplusInStorage.message.updateFailure'),
      //       description: err.message
      //     });
      //   });
      handleCancelUpdate();
    });
  };

  const handleDelete = record => {
    Modal.confirm({
      title: getFormattedMsg('SurplusInStorage.operation.delete'),
      okType: 'danger',
      onOk: async () => {
        notification.warning({
          message: '没有接口'
        });
        // await SemiFinishedWarehousingReceiptApi
        //   .deleteById(record.id)
        //   .then(res => {
        //     notification.success({
        //       message: getFormattedMsg('SurplusInStorage.message.deleteSuccess'),
        //     });
        //     loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        //   })
        //   .catch(err => {
        //     notification.warning({
        //       message: getFormattedMsg('SurplusInStorage.message.deleteFailure'),
        //       description: err.message
        //     });
        //   });
      },
      onCancel() {}
    });
  };

  const handleWarehousing = record => {
    Modal.confirm({
      title: getFormattedMsg('SurplusInStorage.message.warehousing'),
      onOk: async () => {
        notification.warning({
          message: '没有接口'
        });
        // await SemiFinishedWarehousingReceiptApi
        //   .inStore(record.id)
        //   .then(res => {
        //     notification.success({
        //       message: getFormattedMsg('SurplusInStorage.message.warehousingSuccess'),
        //     });
        //     loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        //   })
        //   .catch(err => {
        //     notification.warning({
        //       message: getFormattedMsg('SurplusInStorage.message.warehousingFailure'),
        //       description: err.message
        //     });
        //   });
      },
      onCancel() {}
    });
  };

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('SurplusInStorage.label.receiptNumber')}
              name="receiptNumber"
            >
              <Input
                placeholder={getFormattedMsg('SurplusInStorage.placeholder.receiptNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SurplusInStorage.label.trayNumber')}
              name="trayNumber"
            >
              <Input
                placeholder={getFormattedMsg('SurplusInStorage.placeholder.trayNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SurplusInStorage.label.creationTime')}
              name="creationTime"
            >
              <RangePicker
                placeholder={getFormattedMsg('SurplusInStorage.placeholder.creationTime')}
                format={dateTime}
                showTime
                style={{ width: '100%' }}
              />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('SurplusInStorage.title.tableName')}
          buttons={[
            <Button key="add" type="primary" onClick={() => handleAdd()}>
              {getFormattedMsg('SurplusInStorage.button.add')}
            </Button>
          ]}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
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
      <Drawer
        title={getFormattedMsg('SurplusInStorage.title.addOrder')}
        visible={addVis}
        onClose={handleCancelAdd}
        width={500}
      >
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={addForm}
            dockingPoints={dockingPoints}
            sortPositions={sortPositions}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Drawer
        title={getFormattedMsg('SurplusInStorage.button.update')}
        visible={updateVis}
        onClose={handleCancelUpdate}
        width={500}
      >
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={updateForm}
            modifyData={updateData}
            dockingPoints={dockingPoints}
            sortPositions={sortPositions}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};
export default SurplusInStorage;
