import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal,  Spin,  Pagination, SearchForm,  Input, Divider ,Drawer,Form,Select} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import { isEmpty } from 'lodash';
import bendingMachineServices from '~/api/bendingMachine';
import TransferBoxServices from '~/api/TransferBox';
import AddOrUpdateForm from './AddOrUpdateForm';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery';
import SurplusForm from './SurplusForm';
import { attributeOne,attributeTwo, BendingStates} from '~/enum/enum';

const getFormattedMsg = i18n.getFormattedMsg;
const { showTotal } = page
const { Pane } = HVLayout;
const { Option } = Select;
const middles =[
  { id: 1, name: 'J002', value: 'J002', },
  { id: 2, name: 'J003', value: 'J003', },
]

const BendingMachineConfiguration = () => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const [addOrUpdateModalVis, setAddOrUpdateModalVis] = useState(false);
  const addOrUpdateForm = useRef();
  const [updateFormData,setUpdateFormData] = useState({})

  const [bindVis,setBindVis] = useState(false)
  const [bindData,setBindData] = useState()
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [transferList, setTransferList] = useState([]);
  const [selectedTransfer,setSelectedTransfer] = useState()

  const [pullVis, setPullVis] = useState(false);
  const [pullData, setPullData] = useState({});
  const [location, setLocation] = useState('J002');

  const [surplusFormVis, setSurplusFormVis] = useState(false);
  const [surplusData, setSurplusData] = useState({});
  const surplusForm = useRef();

  
  
  useEffect(() => {
    loadData(page, pageSize, { ...setSearchValue });
  }, []);

  const columns = [
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.bendingNumber'),
      dataIndex: 'bendingNumber',
      key: 'bendingNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.bendingName'),
      dataIndex: 'bendingName',
      key: 'bendingName',
      align: 'center',
    },
    {
      title: '折弯机状态',
      dataIndex: 'bendingState',
      key: 'bendingState',
      align: 'center',
      render: (text, record, index) => {
        if(text == null){
          return
        }
        return BendingStates[text-1].value
      }
    },
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.attribute'),
      dataIndex: 'attribute',
      key: 'attribute',
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
      // title: getFormattedMsg('BendingMachineConfiguration.title.ifout'),
      title: "是否允许切割未完成出库",
      dataIndex: 'ifout',
      key: 'ifout',
      align: 'center',
      render: (text, record, index) => {
        if (text == true) { return '是'}
        if (text == false) { return '否'}
      }
    },
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.warhouseTime'),
      dataIndex: 'warhouseTime',
      key: 'warhouseTime',
      align: 'center',
    },
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.readyMaterials'),
      dataIndex: 'readyMaterials',
      key: 'readyMaterials',
      align: 'center',
    },
    {
      title: "托盘号",
      dataIndex: 'transferCode',
      key: 'transferCode',
      align: 'center',
    },
    {
      title:getFormattedMsg('BendingMachineConfiguration.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        
        <a key="addTransfer" onClick={() => handlebind(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.addTransfer')}
        </a>,
        <Divider key="divider3" type="vertical" />,
        <a key="unbind" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => handleUnbind(record)}>
          {getFormattedMsg('PalletManagementConnectionPort.button.unbind')}
        </a>,
        <Divider key="divider2" type="vertical" />,

        <a key="shelf" onClick={() => HandlePutOn(record)}>
          托盘上架
        </a>,
        <Divider key="divider4" type="vertical" />,
        <a key="takedown"  onClick={() => HandlePullOff(record)}>
          托盘下架
        </a>,
        <Divider key="divider5" type="vertical" />,
        <a key="surplus"  onClick={() => handleSurplus(record)}>
          余料回库
        </a>,
        <Divider key="divider6" type="vertical" />,


        <a key="update" onClick={()=>handleUpdate(record)}>
          {getFormattedMsg('BendingMachineConfiguration.button.update')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={()=>handleDelete(record)}>
         {getFormattedMsg('BendingMachineConfiguration.button.delete')}
        </a>,
      ],
      width: 500,
      // fixed: 'right'
    }
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    bendingMachineServices
      .getByQuery({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        res.content.map(i => {
          const text = i.attribute
          const arr = text.split(',');
          let array = []
          arr.map(j => {
            const a = Number(j)
            array = [...array, a]
          })
          console.log(array, 'array---');
          i.attributeOne = array
        })
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
    return () => loadData(page, pageSize, { ...searchValue });
  };

  const onShowSizeChange = (p, s) => {
    loadData(p, s,{ ...searchValue});
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    loadData(p, s,{ ...searchValue});
    setPage(p);
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data }
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params });
  };

  const { Table, SettingButton} = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'bendingMachine' }),
    []
  );

  const handleAdd =()=>{
    setAddOrUpdateModalVis(true)
  }

  const handleCancelAddOrUpdate = () => {
    const { resetFields } = addOrUpdateForm.current;
    resetFields();
    setAddOrUpdateModalVis(false)
    setUpdateFormData({})
  }

  const modalAddOrUpdateFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveAddOrUpdate}>
      {getFormattedMsg('BendingMachineConfiguration.button.confirm')}
    </Button>,
    <Button key="cancel" onClick={handleCancelAddOrUpdate}>
      {getFormattedMsg('BendingMachineConfiguration.button.cancel')}
    </Button>
  ]

  const handleSaveAddOrUpdate = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = addOrUpdateForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();

      if(!isEmpty(params.attribute)){
        params.attribute = params.attribute.toString()
      }
      if(updateFormData !={}){
        Object.keys(updateFormData).map(i=>{
          if(params[i] == null){params[i] = updateFormData[i]}
        })
      }
      await bendingMachineServices
      .addOrUpdate(params)
      .then(res => {
        notification.success({
          message: params.id == null?getFormattedMsg('BendingMachineConfiguration.message.addSuccess'):getFormattedMsg('BendingMachineConfiguration.message.updateSuccess')
        });
        loadData(page, pageSize, { ...searchValue })
      })
      .catch(err => {
        notification.warning({
          message: params.id == null?getFormattedMsg('BendingMachineConfiguration.message.addFailure'):getFormattedMsg('BendingMachineConfiguration.message.updateFailure'),
          description: err.message
        });
      });
      handleCancelAddOrUpdate();
    })
  }

  const handleUpdate =(record)=>{
    setAddOrUpdateModalVis(true)
    if(record.ifout != null){
      record.ifout = record.ifout.toString()
    }
    setUpdateFormData(record)
  }

  const handleDelete =(record)=>{
    Modal.confirm({
      title: getFormattedMsg('BendingMachineConfiguration.title.delete'),
      okType: 'danger',
      onOk: async () => {
        await bendingMachineServices
          .deleteById(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('BendingMachineConfiguration.message.deleteSuccess'),
            });
            loadData(page, pageSize, { ...searchValue});
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('BendingMachineConfiguration.message.deleteFailure'),
              description: err.message
            });
          });
      },
      onCancel() { },
    })
  }


  const handlebind=(record)=>{
    setBindVis(true)
    setBindData(record)
    getTransfer();
  }

  const getTransfer = async (searchValue) => {
    //折弯机 绑定 半成品托盘
    await TransferBoxServices.getPage({ code: searchValue, type: 1, page: pageInfo.page - 1, pageSize: pageInfo.pageSize })
      .then(res => {
        setTransferList(res.content);
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };
  
  const bindSave = async () => {
    await bendingMachineServices.addTransfer(bindData.bendingNumber, selectedTransfer)
    .then(res => {
      notification.warning({
        message: getFormattedMsg('PalletManagementConnectionPort.message.bindingSuccess'),
      });
      loadData(page, pageSize, { ...searchValue });
    }).catch(err => {
      notification.warning({
        message: getFormattedMsg('PalletManagementConnectionPort.message.bindingFailure'),
        description: err.message
      });
    });
    bindCancel()
  }

  const bindCancel = () => {
    setBindVis(false)
    setSelectedTransfer()
    setBindData()
  }

  const handleUnbind=(record)=>{
    Modal.confirm({
      title: getFormattedMsg('PalletManagementConnectionPort.title.unbind'),
      okType: 'danger',
      onOk: async () => {
        await bendingMachineServices.deleteTransfer(record.bendingNumber)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagementConnectionPort.message.unbindingSuccess')
            })
            loadData(page, pageSize, { ...searchValue });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagementConnectionPort.message.unbindingFailure'),
              description: err.message
            })
          })
      }
    });
  }

  const HandlePutOn = (record) => {
    setPullVis(true)
    setPullData(record)
    // const data = {
    //   origin: record.readyMaterials,
    //   middle: 'J001',
    //   trayNumber: record.transferCode,
    //   state: 0,
    // }
    // console.log(data,'托盘上架');
    // Modal.confirm({
    //   title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${record.transferCode}?`,
    //   onOk: () => {
    //     addAndUpShelves(data)
    //   }
    // });
  }

  const handleCancelPutOn =()=>{
    setPullVis(false)
    setPullData({})
    setLocation('J002')
  }

  const modalPutOnFoot = () => [
    <Button key="save" type="primary" onClick={handleSavePutOn}>
      {getFormattedMsg('EmptyPalletDelivery.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelPutOn}>
      {getFormattedMsg('EmptyPalletDelivery.button.cancel')}
    </Button>
  ];

  const handleSavePutOn =()=>{
    const data = {
      origin: pullData.readyMaterials,
      middle: location,
      trayNumber: pullData.transferCode,
      state: 0,
    }
    console.log(data,'上架');
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${pullData.transferCode}?`,
      onOk: () => {
        addAndUpShelves(data)
      }
    });
  }

  //托盘上架  新增并上架
  const addAndUpShelves = async (data) => {
    await EmptyPalletsWarehousingApi
      .addAndupShelves(data)
      .then(res => {
        notification.success({
          message: '托盘入库任务生成成功'
        });
        loadData(pageInfo.page, pageInfo.pageSize, searchValue);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }

  const HandlePullOff = (record) => {
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.pullOffPallet')}${record.transferCode}?`,
      onOk: async() => {
        await EmptyPalletDeliveryApi.callTransferOut({qrName:record.transferCode})
        .then(res => {
          notification.success({
            message: '托盘下架成功'
          })
          loadData();
        })
        .catch(err => {
          notification.warning({
            message: '托盘下架失败',
            description: err.message
          })
        })
      }
    });
  }
  
  const handleSurplus =(record)=>{
    setSurplusFormVis(true)
    setSurplusData(record)
  }

  const handleCancelSurplus = () => {
    const { resetFields } = surplusForm.current;
    resetFields();
    setSurplusFormVis(false)
    setSurplusData({})
  }

  const modalAddFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveSurplus}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelSurplus}>
      {getFormattedMsg('SemiFinishedWarehousingReceipt.button.cancel')}
    </Button>
  ];

  const handleSaveSurplus = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = surplusForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if(params.attributeOne.length != 0){
        params.attributeOne = params.attributeOne.toString()
      }else{
        delete params.attributeOne
      }
      console.log(params, 'params');

      await bendingMachineServices
        .addSurplusMaterial(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.addSuccess')
          });
          reFreshFunc()
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.addFailure'),
            description: err.message
          });
        });
      handleCancelSurplus();
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('BendingMachineConfiguration.label.bendingNumber')}
              name="bendingNumber"
            >
              <Input  allowClear placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.bendingNumber')}/>
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <Pane
            icon={<i className="h-visions hv-table" />}
            title={getFormattedMsg('BendingMachineConfiguration.title.information')}
            buttons={[
              <Button key="create" type="primary" onClick={() => handleAdd()}>
                {getFormattedMsg('BendingMachineConfiguration.button.create')}
              </Button>,
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
          </Pane>
      </HVLayout>
      <Drawer title={updateFormData.id == null?getFormattedMsg('BendingMachineConfiguration.title.create'):getFormattedMsg('BendingMachineConfiguration.title.update')} visible={addOrUpdateModalVis} onClose={handleCancelAddOrUpdate} width={500}>
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={addOrUpdateForm} modifyData ={updateFormData}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddOrUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        title={getFormattedMsg('PalletManagementConnectionPort.title.binding')}
        visible={bindVis}
        onOk={bindSave}
        onCancel={bindCancel}
        destroyOnClose
        width={500}
      >
        <Form {...formItemLayout}>
          <Form.Item label={getFormattedMsg('PalletManagementConnectionPort.title.trayNumber')}>
            <Select
              placeholder={getFormattedMsg('PalletManagementConnectionPort.placeholder.transferCode')}
              onSearch={getTransfer}
              showSearch
              filterOption={false}
              onChange={(value) => {
                console.log(value);
                setSelectedTransfer(value)
              }}
            >
              {transferList.map((value, index) => (
                <Option value={value.code} key={value.id}>
                  {value.code} -- {value.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={'托盘上架'}
        visible={pullVis}
        onCancel={handleCancelPutOn}
        footer={modalPutOnFoot()}
        destroyOnClose
      >
        <div style={{display:'flex'}}>
          <div style={{
            width:'15%',
            display: 'flex',
            justifyContent: 'middle',
            alignItems: 'center',
            textAlign:'center',
            }}>
             中间点：
          </div>
          <Select
            placeholder={'请选择中间点'}
            showSearch
            filterOption={false}
            onChange={(e) => {
              setLocation(e)
            }}
            value={location}
          >
            {
              middles.length && middles.map(item => {
                return (<Option key={item.id} value={item.value}>{item.value}</Option>)
              })
            }
          </Select>
        </div>
      </Modal>
      <Drawer 
      title={'余料回库'} 
      visible={surplusFormVis} 
      onClose={handleCancelSurplus} 
      width={500}
      destroyOnClose
      >
        <Drawer.DrawerContent>
          <SurplusForm
            ref={surplusForm}
            modifyData={surplusData}
            attributeOne={attributeOne}
            attributeTwo={attributeTwo}
            // dockingPoints={dockingPoints}
            // sortPositions={sortPositions}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};

export default BendingMachineConfiguration;
