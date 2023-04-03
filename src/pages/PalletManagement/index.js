import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, notification, Drawer, Select, Button,SearchForm, Pagination, Input, Divider, Checkbox, Modal } from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import { debounce, isEmpty } from 'lodash';
import { CacheTable } from '~/components';
import CardItem from './CardItem/CardItem';
import SelectForm from './SelectForm';
import TransferBoxServices from '~/api/TransferBox';
// import { palletType } from '~/components/palletType';
import { palletType } from '~/enum/enum';
import AddForm from './AddForm';
import SearchForms from './SearchForm';
import EmptyPalletsWarehousingServices from '~/api/EmptyPalletsWarehousing';

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

  const addRef = useRef();
  const selectRef = useRef();
  const searchForm = useRef();

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
        <a key="pullOff" onClick={() => HandlePullOf(record)}>
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
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${record.code}?`,
      onOk: () => {
        notification.warning({ message: '接口' })
      }
    });
  };

  const HandlePullOf = async record => {
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.pullOffPallet')}${record.code}?`,
      onOk: () => {
        notification.warning({ message: '接口' })
      }
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
    notification.warning({ message: '接口' })
  }

  const printBarcodes = () => {
    console.log('selectedDatas', selectedDatas);
    notification.warning({ message: '接口' })
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
              <Button
                key="printBarcodes"
                // h-icon="add"
                type="primary"
                onClick={printBarcodes}
              >
                {getFormattedMsg('PalletManagement.button.printBarcodes')}
              </Button>,
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
    </>
  );
};

export default PalletManagement;
