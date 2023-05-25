import React, { useState, useEffect, useRef, useMemo } from 'react';
import {  HVLayout,  Button,  notification,  Modal,  Spin,  Pagination,  SearchForm,  DatePicker,  Input,  Drawer} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import moment from 'moment';
import SurplusMaterialApi from '~/api/SurplusMaterial';
import AddOrUpdateForm from './AddOrUpdateForm';
import { dockingPoints, sortPositions } from '~/enum/enum';


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
  const [addVis, setAddVis] = useState(false);
  const addForm = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('SurplusInStorage.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.cuttingMachine'),
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.materialSizeX'),
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center'
    },
    {
      title:getFormattedMsg('SurplusInStorage.title.materialSizeY'),
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.materialSpecs'),
      dataIndex: 'materialSpecs',
      key: 'materialSpecs',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.materialThickness'),
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.fromLocation'),
      dataIndex: 'fromLocation',
      key: 'fromLocation',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.middle'),
      dataIndex: 'middle',
      key: 'middle',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.toLocation'),
      dataIndex: 'toLocation',
      key: 'toLocation',
      align: 'center'
    },
    {
      title: getFormattedMsg('SurplusInStorage.title.operation'),
      key: 'opt',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a
          key="delete"
          style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }}
          onClick={() => handleDelete(record)}
        >
          {getFormattedMsg('SurplusInStorage.button.delete')}
        </a>,
      ]
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    SurplusMaterialApi.getByQuery({ ...searchValue, page: page - 1, pageSize })
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
    return () => loadData(page, pageSize, { ...searchValue });
  };

  const onShowSizeChange = (p, s) => {
    loadData(p, s, { ...searchValue });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    loadData(p, s, { ...searchValue });
    setPage(p);
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data };
    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime);
      params.endTime = moment(params.creationTime[1]).format(dateTime);
    }
    delete params.creationTime;
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_surplus_inStorage' }),
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
      await SurplusMaterialApi
        .addSurplus(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SurplusInStorage.message.addSuccess')
          });
          loadData(page, pageSize, { ...searchValue});
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SurplusInStorage.message.addFailure'),
            description: err.message
          });
        });
      handleCancelAdd();
    });
  };

  const handleDelete = record => {
    Modal.confirm({
      title: getFormattedMsg('SurplusInStorage.operation.delete'),
      okType: 'danger',
      onOk: async () => {
        await SurplusMaterialApi
          .deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('SurplusInStorage.message.deleteSuccess'),
            });
            loadData(page, pageSize, { ...searchValue});
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('SurplusInStorage.message.deleteFailure'),
              description: err.message
            });
          });
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
              label={getFormattedMsg('SurplusInStorage.label.cuttingMachine')}
              name="cuttingMachine"
            >
              <Input
                placeholder={getFormattedMsg('SurplusInStorage.placeholder.cuttingMachine')}
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
    </>
  );
};
export default SurplusInStorage;
