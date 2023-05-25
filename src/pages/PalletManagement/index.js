import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, notification, Drawer, Select, Button,SearchForm, Pagination, Input, Divider, Modal } from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import CardItem from './CardItem/CardItem';
import SelectForm from './SelectForm';
import TransferBoxServices from '~/api/TransferBox';
import { palletType } from '~/enum/enum';
import AddForm from './AddForm';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery';
import PullOnForm from './PullOnForm';
import PullOffForm from './PullOffForm';
import PrintService from '~/api/print';
import { isEmpty, set } from 'lodash';
import ModalQR from './ModalQR';
import { imageToZ64 } from "./imageToZ64";

const getFormattedMsg = i18n.getFormattedMsg;
const { Option } = Select;
const { showTotal } = page
const PalletManagement = () => {
  const [searchValue, setSearchValue] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [addFormVis, setAddFormVis] = useState(false);
  const [bindingVisible, setBindingVisible] = useState(false);
  const [selectedType, setSelectedType] = useState();
  // const [code, setCode] = useState('');
  // const [modifyData, setModifyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDatas, setSelectedDatas] = useState([]);

  const [palletTypeList, setPalletTypeList] = useState(palletType);
  const [bindingData, setBindingData] = useState({});

  const [pullFormVis, setPullFormVis] = useState(false);
  const [pullType, setPullType] = useState();
  const [pullFormData, setPullFormData] = useState({});

  const [modalVis, setModalVis] = useState(false);

  const addRef = useRef();
  const selectRef = useRef();
  const searchForm = useRef();
  const pullForm = useRef();

  useEffect(() => {

  }, []);

  const columns = [
    {
      title: getFormattedMsg('PalletManagement.title.code'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagement.title.locationName'),
      dataIndex: 'locationName',
      key: 'locationName',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagement.title.state'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagement.title.location'),
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagement.title.weight'),
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagement.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="putOn" onClick={() => HandlePutOn(record)}>
          {getFormattedMsg('PalletManagement.button.putOn')}
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="pullOff" onClick={() => HandlePullOff(record)}>
          {getFormattedMsg('PalletManagement.button.pullOff')}
        </a>,
        <Divider key="divider2" type="vertical" />,
        <a key="binding" onClick={() => HandleBinding(record)}>
          {getFormattedMsg('PalletManagement.button.binding')}
        </a>,
        <Divider key="divider3" type="vertical" />,
        <a key="unbind" onClick={() => HandleUnbind(record)}>
          {getFormattedMsg('PalletManagement.button.unbind')}
        </a>,
        <Divider key="divider4" type="vertical" />,
        <a key="delete" style={{ color: 'var(--ne-delete-button-font)', cursor: 'pointer' }} onClick={() => HandleDelete(record)}>
          {getFormattedMsg('PalletManagement.button.delete')}
        </a>
      ],
      width: 300,
    }
  ];

  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    console.log({ ...searchValue, page: page - 1, pageSize });
    await TransferBoxServices.getPage({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setDataSource(res.content);
        setTotal(res.totalElements);
        const pageInfos = {
          page: res.pageable.pageNumber + 1,
          pageSize: res.pageable.pageSize
        }
        setPageInfo(pageInfos)
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
    setLoading(false);
  };

  const handleSearch = (values) => {
    const { getFieldsValue, validateFields } = searchForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      const searchValues = { ...searchValue, ...params }
      console.log(searchValues, 'searchValues');
      if (selectedType == null) {
        return
      }
      setSearchValue(searchValues)
      loadData(pageInfo.page, pageInfo.pageSize, searchValues)
    })
  }

  //刷新按钮
  const reFreshFunc = () => {
    const pageInfos = {
      page: 1,
      pageSize: 10
    }
    setPageInfo(pageInfos)
    loadData(pageInfos.page, pageInfos.pageSize, searchValue);
  };

  const HandlePutOn = record => {
    // if(record.locationCode == null){
    //     notification.warning({ message: '未绑定库位' })
    //     return
    // }
    // Modal.confirm({
    //   title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${record.code}?`,
    //   onOk: async() => {
    //     const data = {
    //       origin:'J001',
    //       destination:record.locationCode,
    //       trayNumber:record.code,
    //       state:0
    //     }
    //     await EmptyPalletsWarehousingApi
    //     .saveOrUpdate(data)
    //     .then(res => {
    //       notification.success({
    //         message: '空托入库任务生成成功'
    //       });
    //       loadData(pageInfo.page, pageInfo.pageSize, searchValue);
    //     })
    //     .catch(err => {
    //       notification.warning({
    //         description: err.message
    //       });
    //     });
    //   }
    // });
    setPullFormVis(true)
    setPullType(1)
    setPullFormData(record)
  };

  const HandlePullOff = record => {
    // if (record.location != "在库") {
    //   notification.warning({ message: '托盘未完成上架' })
    //   return
    // }
    // Modal.confirm({
    //   title: `${getFormattedMsg('PalletManagement.title.pullOffPallet')}${record.code}?`,
    //   onOk: async () => {
    //     // { id: 6, name: '原料托盘出库', value: '原料托盘出库', },
    //     // { id: 8, name: '半成品托盘出库', value: '半成品托盘出库', },
    //     const data = {
    //       inType: selectedType == 0 ? 6 : 8,
    //       trayNumber: record.code,
    //       state: 0,
    //     }
    //     console.log(data, 'data');
    //     await EmptyPalletDeliveryApi
    //       .saveOrUpdate(data)
    //       .then(res => {
    //         notification.success({
    //           message: '空托出库任务生成成功'
    //         });
    //         loadData(pageInfo.page, pageInfo.pageSize, searchValue);
    //       })
    //       .catch(err => {
    //         notification.warning({
    //           description: err.message
    //         });
    //       });
    //   }
    // });
    setPullFormVis(true)
    setPullType(2)
    setPullFormData(record)
  }

  const handleCancelPull = () => {
    const { resetFields } = pullForm.current;
    resetFields();
    setPullFormVis(false)
    setPullFormData({})
  }

  const modalPullFoot = () => [
    <Button key="save" type="primary" onClick={HandleSavePull}>
      {getFormattedMsg('EmptyPalletDelivery.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelPull}>
      {getFormattedMsg('EmptyPalletDelivery.button.cancel')}
    </Button>
  ];

  const HandleSavePull = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = pullForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      params.transferType = pullFormData.type
      console.log('params', params);

      //上架
      if (pullType == 1) {
        // { id: 5, name: '原料托盘回库', value: '原料托盘回库', },
        // { id: 7, name: '半成品托盘回库', value: '半成品托盘回库', },
        params.taskType = pullFormData.type ==1?5:7
        Modal.confirm({
          title: `确认上架托盘${pullFormData.code}?`,
          onOk: async () => {
            await EmptyPalletsWarehousingApi
              .autoTransferIn(params)
              .then(res => {
                notification.success({
                  message: '托盘上架成功'
                });
                // loadData(pageInfo.page, pageInfo.pageSize, searchValue);
              })
              .catch(err => {
                notification.warning({
                  description: err.message
                });
              });
          }
        });
      }

      //下架
      if (pullType == 2) {
        // { id: 6, name: '原料托盘出库', value: '原料托盘出库', },
        // { id: 8, name: '半成品托盘出库', value: '半成品托盘出库', },
        params.taskType = pullFormData.type ==1?6:8
        Modal.confirm({
          title: `确认下架托盘${pullFormData.code}?`,
          onOk: async () => {
            await EmptyPalletDeliveryApi
              // .saveOrUpdate(data)
              .autoTransferOut(params)
              .then(res => {
                notification.success({
                  message: '托盘下架成功'
                });
                // loadData(pageInfo.page, pageInfo.pageSize, searchValue);
              })
              .catch(err => {
                notification.warning({
                  description: err.message
                });
              });
          }
        });
      }
      handleCancelPull();
    });
  };

  const HandleUnbind = record => {
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.unbindPallet')}${record.code}?`,
      okType: 'danger',
      onOk: async () => {
        await TransferBoxServices.unLockLocation(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagement.message.unBindingSuccess')
            })
            loadData(pageInfo.page, pageInfo.pageSize, searchValue);
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagement.message.unBindingFailure'),
              description: err.message
            })
          })
      }
    });
  };

  const HandleDelete = record => {
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.deletePallet')}${record.code}?`,
      okType: 'danger',
      onOk: async () => {
        await TransferBoxServices.deleteBox(record.id)
          .then(res => {
            notification.success({
              message: getFormattedMsg('PalletManagement.message.deleteSuccess')
            })
            loadData(pageInfo.page, pageInfo.pageSize, { type: selectedType });
            const { resetFields } = searchForm.current;
            resetFields()
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('PalletManagement.message.deleteFailure'),
              description: err.message
            })
          })
      }
    });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, key: 'pallet-management-connection-port' }),
    []
  );

  const onHandleChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
    loadData(page, pageSize, { type: selectedType });
  };

  const onHandleTableSelect = e => {
    if (selectedRowKeys.indexOf(e.id) === -1) {
      setSelectedRowKeys([...selectedRowKeys, e.id])
      setSelectedDatas([...selectedDatas, e])
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(i => i != e.id))
      setSelectedDatas(selectedDatas.filter(i => i.id != e.id))
    }
  };

  const onHandleTableSelectAll = (e, a) => {
    if (e) {
      setSelectedRowKeys(a.map(i => i.id))
      setSelectedDatas(a.map(i => i))
    } else {
      setSelectedRowKeys([])
      setSelectedDatas([])
    }
  };

  const handleChoosePalletType = record => {
    console.log('record', record);
    const type = record.id;
    setSelectedType(type)
    
    const { getFieldsValue, resetFields, validateFields, setFieldsValue } = searchForm.current;
    resetFields()

    setSearchValue({type: type })
    loadData(pageInfo.page, pageInfo.pageSize, { type: type });
  }

  const printLabel = () => {
    console.log('selectedDatas', selectedDatas);
    if (isEmpty(selectedDatas)) {
      notification.warning({ message: '请勾选需要打印标签的托盘' })
      return
    }
    setModalVis(true)
  };

  const print = () => {
    let datas = [];
    selectedDatas.map(i => {
      const data = {
        value: i.code
      };
      datas = [...datas, data];
    });

    const printData = {
      data: datas,
      printTemplateCode: "TM-2",
      printerCode: "printer-1"
    };

    console.log('printData', printData);

    PrintService.print(printData)
      .then(res => {
        notification.success({
          message: '打印成功'
        });
        setSelectedDatas([])
        reFreshFunc()
      })
      .catch(error => {
        notification.warning({
          message: '打印失败',
          description: error.message
        });
      });
  }

  const handleCreate = () => {
    setAddFormVis(true)
  }

  const handleCancelCreate = () => {
    setAddFormVis(false)
  }

  const modalCreateFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveCreate}>
      {getFormattedMsg('PalletManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelCreate}>
    {getFormattedMsg('PalletManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveCreate = () => {
    const { getFieldsValue, validateFields, resetFields } = addRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log(params, 'HandleSaveCreate');
      await TransferBoxServices.createBox(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('PalletManagement.message.addSuccess')
          })
          const pageInfos = {
            page: 1,
            pageSize: 10
          }
          setPageInfo(pageInfos)
          loadData(pageInfos.page, pageInfos.pageSize, { type: selectedType });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('PalletManagement.message.addFailure'),
            description: err.message
          })
        })
      resetFields()
      handleCancelCreate()
    });

  }

  const HandleSaveAndHandlePutOn = () => {
    const { getFieldsValue, validateFields, resetFields } = addRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log(params, 'HandleSaveAndHandlePutOn');

      resetFields()
      handleCancelCreate()
    });
  }

  const HandleBinding = record => {
    setBindingVisible(true)
    setBindingData(record)
  };

  const handleCancelBinding = () => {
    setBindingVisible(false)
  }

  const modalBindingFoot = () => [
    <Button key="save" type="primary" onClick={HandleSaveBinding}>
      {getFormattedMsg('PalletManagement.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelBinding}>
      {getFormattedMsg('PalletManagement.button.cancel')}
    </Button>
  ];

  const HandleSaveBinding = () => {
    const { getFieldsValue, validateFields, resetFields } = selectRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      await TransferBoxServices.lockLocation(params.locationId, bindingData.id)
        .then(res => {
          notification.success({
            message: getFormattedMsg('PalletManagement.message.bindingSuccess')
          })
          loadData(pageInfo.page, pageInfo.pageSize, { type: selectedType });
        })
        .catch(err => {
          notification.warning({
            message: getFormattedMsg('PalletManagement.message.bindingFailure'),
            description: err.message
          })
        })
        resetFields()
      handleCancelBinding()
    });

  }

  const HandleBindingSaveAndHandlePutOn = () => {
    const { getFieldsValue, validateFields, resetFields } = selectRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log(params, 'HandleSaveAndHandlePutOn');

      resetFields()
      handleCancelCreate()
    });
  }



  const modalPrintFoot = () => [
    <Button key="save" type="primary" onClick={handleSavePrint}>
      打印
    </Button>,
    <Button key="cancel" onClick={handleCancelPrint}>
      {getFormattedMsg('PalletManagement.button.cancel')}
    </Button>
  ];

  const handleSavePrint =()=>{
    let datas = []
    selectedDatas.map(i=>{
      const data ={}
      data.code = i.code
      const div = document.getElementById(i.code)
      // console.log('div', div);
      const img = div.getElementsByTagName('img')
      // console.log('img[0]', img[0]);
      const res = imageToZ64(img[0]);
      // console.log('res', res);
      // console.log('res---------------------', res.z64.substring(5,res.z64.length));
      const zpl_ = ` ^XA^LH0,0^FWN^PON^PMN^LRN ^FO10,10^GFA,${res.length},${res.length},${res.rowlen},${res.z64}^XZ`;
      console.log(zpl_);
      const zpl = res.z64
      console.log(zpl);
      data.value = zpl
      datas =[...datas,data]
    })
    console.log(datas,'datas');

    const printData = {
      data: datas,
      printTemplateCode: "TM-2",
      printerCode: "printer-1"
    };

    console.log('printData', printData);

    PrintService.print(printData)
      .then(res => {
        notification.success({
          message: '打印成功'
        });
      })
      .catch(error => {
        notification.warning({
          message: '打印失败',
          description: error.message
        });
      });
    handleCancelPrint()
    reFreshFunc()
  }

  const handleCancelPrint =()=>{
    setModalVis(false)
     setSelectedRowKeys([]);
     setSelectedDatas([]);
  }

  
  return (
    <>
      <HVLayout layout="horizontal">
        <HVLayout.Pane
          title={getFormattedMsg('PalletManagement.label.type')}
          width={200}
        >
          <CardItem dataArr={palletTypeList} handleSubmitChooseItem={handleChoosePalletType} />
        </HVLayout.Pane>
        <HVLayout >
          <HVLayout.Pane height={'auto'}>
            <SearchForm onSearch={handleSearch} ref={searchForm}>
              <SearchForm.Item
                label={getFormattedMsg('PalletManagement.label.code')}
                name="code"
              >
                <Input
                  placeholder={getFormattedMsg('PalletManagement.message.code')}
                  allowClear
                  disabled={selectedType==null}
                />
              </SearchForm.Item>
            </SearchForm>
          </HVLayout.Pane>
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title={getFormattedMsg('PalletManagement.title.tableName')}
            buttons={[
              <Button
                key="printLabel"
                // h-icon="add"
                type="primary"
                onClick={printLabel}
              >
                {getFormattedMsg('PalletManagement.button.printLabel')}
              </Button>,
              // <Button
              //   key="printBarcodes"
              //   // h-icon="add"
              //   type="primary"
              //   onClick={printBarcodes}
              // >
              //   {getFormattedMsg('PalletManagement.button.printBarcodes')}
              // </Button>,
              <Button
                key="add"
                h-icon="add"
                type="primary"
                onClick={handleCreate}
              >
                {getFormattedMsg('PalletManagement.button.add')}
              </Button>
            ]}
            settingButton={<SettingButton />}
            onRefresh={reFreshFunc}
          >
            <Table
              loading={loading}
              pagination={false}
              scroll={{ x: 'max-content' }}
              dataSource={dataSource}
              columns={columns}
              rowKey={record => record.id}
              rowSelection={{
                onSelect: onHandleTableSelect,
                onSelectAll: onHandleTableSelectAll,
                selectedRowKeys: selectedRowKeys
              }}
              onRow={record => {
                return {
                  onClick: () => onHandleTableSelect(record)
                };
              }}
            />
            <HVLayout.Pane.BottomBar>
              <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                size="small"
                total={total}
                showSizeChanger
                onShowSizeChange={onHandleChange}
                onChange={onHandleChange}
                showTotal={(total, range) => showTotal(total, range)}
              />
            </HVLayout.Pane.BottomBar>
          </HVLayout.Pane>
        </HVLayout>
      </HVLayout>
      <Drawer title={getFormattedMsg('PalletManagement.title.add')} visible={addFormVis} onClose={handleCancelCreate} width={500}>
        <Drawer.DrawerContent>
          <AddForm
            ref={addRef}
            palletTypeList={palletTypeList}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalCreateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        title={getFormattedMsg('PalletManagement.title.binding')}
        visible={bindingVisible}
        onCancel={handleCancelBinding}
        footer={modalBindingFoot()}
      >
        <SelectForm
          ref={selectRef}
        />
      </Modal>
      <Modal
        title={pullType ==1 ?'托盘上架':'托盘下架'}
        visible={pullFormVis}
        footer={modalPullFoot()}
        onCancel={handleCancelPull}
        destroyOnClose
        width={800}
      >
        {pullType ==1 ?<PullOnForm ref={pullForm}/>:<PullOffForm ref={pullForm} />}
      </Modal>



      <Modal
        title={'打印列表'}
        visible={modalVis}
        onCancel={handleCancelPrint}
        destroyOnClose
        footer={modalPrintFoot()}
        // width={800}
      >
        <ModalQR value={selectedDatas}/>
      </Modal>
    </>
  );
};

export default PalletManagement;
