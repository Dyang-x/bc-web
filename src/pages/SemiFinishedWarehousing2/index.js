import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import moment from 'moment';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery';
import SemiFinishedWarehousingReceiptApi from '~/api/SemiFinishedWarehousingReceipt';
import PickTrayTable from './PickTrayTable';
import CallTrayForm from './CallTrayForm';
import AddOrUpdateForm from './AddOrUpdateForm';
import { isEmpty } from 'lodash';
import { attributeOne,attributeTwo,dockingPoints,sortPositions } from '~/enum/enum';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { showTotal } = page;

const SemiFinishedWarehousingReceipt = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const state = {
    0: '新建', 2: '已完成'
  }
  const [selectedstatus, setSelectedstatus] = useState('0');

  const [addVis, setAddVis] = useState(false);
  const [addData, setAddData] = useState({});
  const addForm = useRef();

  const [updateVis, setUpdateVis] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const updateForm = useRef();

  const [attributeOneState, setAttributeOneState] = useState(false);
  const [attributeTwoState, setAttributeTwoState] = useState(false);

  const [callTrayVis, setCallTrayVis] = useState(false);
  const callTrayForm = useRef();

  const [pickTrayVis, setPickTrayVis] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDatas, setSelectedDatas] = useState([]);

  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.receiptNumber'),
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.creator'),
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.updateCreator'),
      dataIndex: 'updateCreator',
      key: 'updateCreator',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.attributeOne'),
      dataIndex: 'attributeOne',
      key: 'attributeOne',
      align: 'center',
      // render: (text, record, index) => {
      //   if(text == null){
      //     return
      //   }
      //   let array = []
      //   const arr = text.split(',');
      //   arr.map(i => {
      //     array = [...array, attributeOne[i - 1].name]
      //   })
      //   return array.toString()
      // }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.orderCount'),
      dataIndex: 'orderCount',
      key: 'orderCount',
      align: 'center',
      render: (text, record, index) => {
        if(text == null){
          return
        }
        const arr = record.orderNumber.split(',');
        const table = <div > <ul style={{paddingLeft:15,marginBottom:"0px"}}> {arr.map(item => <li key={item} >{item}</li>)} </ul> </div>
        return (
          <Tooltip placement="rightTop" title={table} arrowPointAtCenter>
            <span>{text}</span>
          </Tooltip>
        )
      }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.attributeTwo'),
      dataIndex: 'attributeTwo',
      key: 'attributeTwo',
      align: 'center',
      // render:(text,record,index)=>{
      //   if(text == null){
      //     return
      //   }
      //   return attributeTwo[text - 1].name
      // }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.dockingPoint'),
      dataIndex: 'dockingPoint',
      key: 'dockingPoint',
      align: 'center',
      // render:(text,record,index)=>{
      //   if(text == null){
      //     return
      //   }
      //   return dockingPoints[text - 1].name
      // }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.sortPosition'),
      dataIndex: 'sortPosition',
      key: 'sortPosition',
      align: 'center',
      // render: (text, record, index) => {
      //   if(text == null){
      //     return
      //   }
      //     return sortPositions[text - 1].name
      // }
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.operation'),
      key: 'opt',
      align: 'center',
      width: 200,
      render: (_, record) => [
        <a key="update" onClick={() => handleUpdate(record)}>
          {getFormattedMsg('SemiFinishedWarehousingReceipt.button.update')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleDelete(record)}>
          {getFormattedMsg('SemiFinishedWarehousingReceipt.button.delete')}
        </a>,
        <Divider key="divider2" type="vertical" />,
        <a key="warehousing" type="primary" onClick={() => handleWarehousing(record)} >
          {getFormattedMsg('SemiFinishedWarehousingReceipt.button.warehousing')}
        </a>
      ],
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    SemiFinishedWarehousingReceiptApi
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
    setPageSize(s);
  };

  const pageChange = (p, s) => {
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
    setAddVis(true)
  }

  const handleCancelAdd = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVis(false)
    setAttributeOneState(false)
    setAttributeTwoState(false)
  }

  const modalAddFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveAdd}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAdd}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const handleSaveAdd = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();

      if(params.attributeOne.length != 0){
        params.attributeOne = params.attributeOne.toString()
      }else{
        delete params.attributeOne
      }
      console.log(params, 'params');
      await SemiFinishedWarehousingReceiptApi
        .bindSemiMaterial(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.addSuccess')
          });
          loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.addFailure'),
            description: err.message
          });
        });
      handleCancelAdd();
    });
  }

  const handleUpdate = (record) => {
    console.log(record,'handleUpdate  record');
    setAttributeOneState(record.attributeoneState)
    setAttributeTwoState(record.attributetwoState)
    setUpdateVis(true)
    setUpdateData(record)
  }

  const handleCancelUpdate = () => {
    const { resetFields } = updateForm.current;
    resetFields();
    setUpdateVis(false)
    setUpdateData(null)
  }

  const modalUpdateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveUpdate}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelUpdate}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const HandleSaveUpdate = () => {
    const { getFieldsValue, validateFields ,setFieldsValue} = updateForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if(!isEmpty(params.attributeOne)){
        params.attributeOne = params.attributeOne.toString()
      }
      Object.keys(params).map(i => {
        updateData[i] = params[i]
      })
      await SemiFinishedWarehousingReceiptApi
        .updateSemiMaterial(updateData)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.updateSuccess'),
          });
          loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.updateFailure'),
            description: err.message
          });
        });
        handleCancelUpdate();
    });
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.operation.delete'),
      okType: 'danger',
      onOk: async () => {
        await SemiFinishedWarehousingReceiptApi
          .deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.deleteSuccess'),
            });
            loadData(page, pageSize, { ...searchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.deleteFailure'),
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }

  const handleCallTray = () => {
    setCallTrayVis(true)
  }

  const handleCancelCallTray = () => {
    const { resetFields } = callTrayForm.current;
    resetFields();
    setCallTrayVis(false)
    handleCancelPickTray()
  }

  const modalCallTrayFoot = () => [
    <Button key="call" type="primary" onClick={handleSaveCallTray}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.call')}
    </Button>,
    <Button key="cancel" onClick={handleCancelCallTray}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.cancel')}
    </Button>
  ]

  const handleSaveCallTray = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = callTrayForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log(params, 'params');
      //  接口  空托盘出库

      if (!isEmpty(selectedRowKeys)) {
        //托盘出库   托盘下架  新增
        const data = {
          trayNumber: selectedDatas[0].code,
          inType: 8, //半成品托盘出库
          state: 0,
          destination: params.sortPosition,
          middle: params.dockingPoint,
        }
        await EmptyPalletDeliveryApi.saveOrUpdate(data)
          .then(res => {
            notification.success({
              message: '托盘出库任务创建成功'
            });
            // loadData(page, pageSize, { ...searchValue, state: selectedstatus });
            handleCancelCallTray();
          })
          .catch(err => {
            notification.warning({
              description: err.message
            });
          })
        return
      }
      const data = {
        destination: params.sortPosition,
        middle: params.dockingPoint,
        taskType: 8, //半成品托盘出库
        transferType: 1 //半成品托盘
      }
      await EmptyPalletDeliveryApi.autoTransferOut(data)
        .then(res => {
          notification.success({
            message: '托盘自动出库成功'
          });
          loadData(page, pageSize, { ...searchValue, state: selectedstatus });
        })
        .catch(err => {
          notification.warning({
            description: err.message
          });
        })
      handleCancelCallTray();
    })
  }

  const handlePickTray = () => {
    setPickTrayVis(true)
  }

  const handleCancelPickTray = () => {
    setPickTrayVis(false)
    setSelectedRowKeys([])
  }

  const modalPickTrayFoot = () => [
    <Button key="takeOff" type="primary" onClick={handleSavePickTray}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.takeOff')}
    </Button>,
    <Button key="cancel" onClick={handleCancelPickTray} style={{ marginRight: 30 }}>
      {getFormattedMsg('RawMaterialWarehousingReceipt.button.cancel')}
    </Button>
  ]

  const handleSavePickTray = () => {
    console.log(selectedRowKeys);
    console.log(selectedDatas);

    //调用托盘出库  下架
    if (isEmpty(selectedRowKeys)) {
      notification.warning({
        message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.pickTray'),
      })
      return
    }
    setCallTrayVis(true)
  }

  const handleWarehousing =(record)=>{
    Modal.confirm({
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.message.warehousing'),
      onOk: async () => {
        await SemiFinishedWarehousingReceiptApi
          .inStore(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.warehousingSuccess'),
            });
            loadData(page, pageSize, { ...searchValue, state: selectedstatus });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.warehousingFailure'),
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
              label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.receiptNumber')}
              name="receiptNumber"
            >
              <Input
                placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.receiptNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.trayNumber')}
              name="trayNumber"
            >
              <Input
                placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.trayNumber')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinishedWarehousingReceipt.label.creationTime')}
              name="creationTime"
            >
              <RangePicker
                placeholder={getFormattedMsg('SemiFinishedWarehousingReceipt.placeholder.creationTime')}
                format={dateTime}
                showTime
                style={{ width: '100%' }}
              />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title={getFormattedMsg('SemiFinishedWarehousingReceipt.title.tableName')}
          buttons={[
            <Button key="add" type="primary" onClick={() => handleAdd()}>
              {getFormattedMsg('SemiFinishedWarehousingReceipt.button.add')}
            </Button>,
            <Button key="callTray" type="primary" onClick={() => handleCallTray()} >
              {getFormattedMsg('SemiFinishedWarehousingReceipt.button.callTray')}
            </Button>,
            <Button key="pickTray" type="primary" onClick={() => handlePickTray()} >
              {getFormattedMsg('SemiFinishedWarehousingReceipt.button.pickTray')}
            </Button>,
            // <Button key="warehousing" type="primary"  onClick={() => handleWarehousing()} >
            //   {getFormattedMsg('SemiFinishedWarehousingReceipt.button.warehousing')}
            // </Button>
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
      <Drawer title={getFormattedMsg('SemiFinishedWarehousingReceipt.title.addOrder')} visible={addVis} onClose={handleCancelAdd} width={500}>
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={addForm}
            attributeOneState={attributeOneState}
            attributeTwoState={attributeTwoState}
            setAttributeOneState={setAttributeOneState}
            setAttributeTwoState={setAttributeTwoState}
            attributeOne={attributeOne}
            attributeTwo={attributeTwo}
            // dockingPoints={dockingPoints}
            // sortPositions={sortPositions}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Drawer title={getFormattedMsg('SemiFinishedWarehousingReceipt.button.update')} visible={updateVis} onClose={handleCancelUpdate} width={500}>
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={updateForm}
            modifyData={updateData}
            attributeOneState={attributeOneState}
            attributeTwoState={attributeTwoState}
            setAttributeOneState={setAttributeOneState}
            setAttributeTwoState={setAttributeTwoState}
            attributeOne={attributeOne}
            attributeTwo={attributeTwo}
            // dockingPoints={dockingPoints}
            // sortPositions={sortPositions}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        key={Math.random()}
        title={getFormattedMsg('SemiFinishedWarehousingReceipt.button.callTray')}
        visible={callTrayVis}
        footer={modalCallTrayFoot()}
        onCancel={handleCancelCallTray}
        width={500}
      >
        <CallTrayForm ref={callTrayForm} selectedDatas={selectedDatas} />
      </Modal>
      <Modal
        // key={Math.random()}
        // title={getFormattedMsg('SemiFinishedWarehousingReceipt.button.pickTray')}
        visible={pickTrayVis}
        // footer={modalPickTrayFoot()}
        footer={null}
        onCancel={handleCancelPickTray}
        width={800}
        bodyStyle={{
          paddingTop:0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
        }}
      >
        <PickTrayTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} setSelectedDatas={setSelectedDatas} modalPickTrayFoot={modalPickTrayFoot}/>
      </Modal>


    </>
  );
};
export default SemiFinishedWarehousingReceipt;
