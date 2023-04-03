import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
// import styles from './style.scss';
import { CacheTable } from '~/components';
import moment from 'moment';
import RawMaterialWarehousingReceiptApi from '~/api/RawMaterialWarehousingReceipt';
import UpdateForm from './UpdateForm';
import ManualTable from './ManualTable';
import BindingForm from './BindingForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { showTotal } = page;

const RawMaterialWarehousingReceipt = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const state = {
    0: '新建', 1: '称重中', 2: '已完成'
  }
  const [selectedstatus, setSelectedstatus] = useState('0');

  const [updateVis, setUpdateVis] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const updateRef = useRef();

  const [manualVis, setManualVis] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const manualRef = useRef();

  const [bindingVis, setBindingVis] = useState(false);
  const bindingForm = useRef();

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.receiptNumber'),
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.lineNumber'),
      dataIndex: 'lineNumber',
      key: 'lineNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.creator'),
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.associatedNumber'),
      dataIndex: 'associatedNumber',
      key: 'associatedNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.number'),
      dataIndex: 'number',
      key: 'number',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.specifications'),
      dataIndex: 'specifications',
      key: 'specifications',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.actualWeight'),
      dataIndex: 'actualWeight',
      key: 'actualWeight',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.actualNumber'),
      dataIndex: 'actualNumber',
      key: 'actualNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.realityMaterialCode'),
      dataIndex: 'realityMaterialCode',
      key: 'realityMaterialCode',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.realityMaterialName'),
      dataIndex: 'realityMaterialName',
      key: 'realityMaterialName',
      align: 'center',
    },
    {
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="update" onClick={() => handleUpdate(record)}>
          {getFormattedMsg('RawMaterialWarehousingReceipt.button.update')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
          {getFormattedMsg('RawMaterialWarehousingReceipt.button.delete')}
        </a>
      ],
      // width: 80,
      // fixed: 'right'
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    RawMaterialWarehousingReceiptApi
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

    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime)
      params.endTime = moment(params.creationTime[1]).format(dateTime)
    }
    delete params.creationTime
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

  const handleUpdate = (record) => {
    setUpdateVis(true)
    setUpdateData(record)
  }

  const handleCancelUpdate = () => {
    const { resetFields } = updateRef.current;
    resetFields();
    setUpdateVis(false)
    setUpdateData(null)
  }

  const modalUpdateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveUpdate}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelUpdate}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const HandleSaveUpdate = () => {
    const { getFieldsValue, validateFields ,setFieldsValue} = updateRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      Object.keys(params).map(i => {
        if (i == 'createTime') {
          updateData[i] = moment(params[i], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
          return
        }
        updateData[i] = params[i]
      })
      await RawMaterialWarehousingReceiptApi
        .updateRawMaterial(updateData)
        .then(res => {
          notification.success({
            message: getFormattedMsg('RawMaterialWarehousingReceipt.message.updateSuccess')
          });
          loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
        handleCancelUpdate();
    });
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('RawMaterialWarehousingReceipt.operation.delete'),
      onOk: async () => {
        await RawMaterialWarehousingReceiptApi
          .deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('RawMaterialWarehousingReceipt.message.deleteSuccess')
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

  const handleWeighing = async () => {
    notification.warning({ message: '没有接口' })
    // await RawMaterialWarehousingReceiptApi
    // .getWeigh(record.id)
    // .then(res => {
    //   notification.success({
    //     message: '称重成功'
    //   });
    //   loadData(page, pageSize, { ...searchValue, state: selectedstatus });
    // })
    // .catch(err => {
    //   notification.warning({
    //     description: err.message
    //   });
    // });
  }

  const handleAutomatic = async () => {
    notification.warning({ message: '没有接口' })
  }

  const handleManual = () => {
    setManualVis(true)
  }

  const handleCancelManual = () => {
    setManualVis(false)
    // setModifyData(null)
  }

  const modalManualFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveManual}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelManual}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const handleSaveManual = () => {
    notification.warning({ message: '没有接口' })
  }

  const handleBinding = () => {
    setBindingVis(true)
  }

  const handleCancelBinding = () => {
    const { resetFields } = bindingForm.current;
    resetFields();
    setBindingVis(false)
  }

  const modalBindingFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveBinding}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelBinding}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const HandleSaveBinding = () => {
    const { getFieldsValue, validateFields } = bindingForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await RawMaterialWarehousingReceiptApi
        .bindRawMaterial(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('RawMaterialWarehousingReceipt.message.bindingSuccess')
          });
          //    loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        });
      handleCancelBinding();
    });
  }

  const handleWarehousing = async () => {
    notification.warning({ message: '没有接口' })
    // await RawMaterialWarehousingReceiptApi
    // .inStore(record.id)
    // .then(res => {
    //   notification.success({
    //     message: '入库成功'
    //   });
    //   loadData(page, pageSize, { ...searchValue, state: selectedstatus });
    // })
    // .catch(err => {
    //   notification.warning({
    //     description: err.message
    //   });
    // });
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('RawMaterialWarehousingReceipt.label.orderNumber')}
              name="receiptNumber"
            >
              <Input
                placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.placeholder.orderNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('RawMaterialWarehousingReceipt.label.trayNumber')}
              name="trayNumber"
            >
              <Input
                placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.placeholder.trayNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('RawMaterialWarehousingReceipt.label.creationTime')}
              name="creationTime"
            >
              <RangePicker
                placeholder={getFormattedMsg('RawMaterialWarehousingReceipt.placeholder.creationTime')}
                format={dateTime}
                showTime
                style={{ width: '100%' }}
              />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('RawMaterialWarehousingReceipt.title.tableName')}
          buttons={[
            <Button key="weighing" type="primary" onClick={() => handleWeighing()} >
              {getFormattedMsg('RawMaterialWarehousingReceipt.button.weighing')}
            </Button>,
            <Button key="automatic" type="primary" onClick={() => handleAutomatic()} >
              {getFormattedMsg('RawMaterialWarehousingReceipt.button.automatic')}
            </Button>,
            <Button key="manual" type="primary" onClick={() => handleManual()} >
              {getFormattedMsg('RawMaterialWarehousingReceipt.button.manual')}
            </Button>,
            <Button key="binding" type="primary" onClick={() => handleBinding()}>
              {getFormattedMsg('RawMaterialWarehousingReceipt.button.binding')}
            </Button>,
            <Button key="warehousing" type="primary" onClick={() => handleWarehousing()} >
              {getFormattedMsg('RawMaterialWarehousingReceipt.button.warehousing')}
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
      <Drawer title={getFormattedMsg('RawMaterialWarehousingReceipt.title.update')} visible={updateVis} onClose={handleCancelUpdate} width={500}>
        <Drawer.DrawerContent>
          <UpdateForm ref={updateRef} updateData={updateData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        title={getFormattedMsg('RawMaterialWarehousingReceipt.title.manual')}
        visible={manualVis}
        footer={modalManualFoot()}
        onCancel={handleCancelManual}
        destroyOnClose
        width={800}
      >
        <ManualTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
      </Modal>
      <Modal
        title={getFormattedMsg('RawMaterialWarehousingReceipt.title.binding')}
        visible={bindingVis}
        footer={modalBindingFoot()}
        onCancel={handleCancelBinding}
        destroyOnClose
        width={800}
      >
        <BindingForm ref={bindingForm} />
      </Modal>
    </>
  );
};
export default RawMaterialWarehousingReceipt;
