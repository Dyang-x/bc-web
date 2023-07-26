import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Spin, Pagination, SearchForm, Input, Divider, Drawer, Form, Select } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import { isEmpty } from 'lodash';
import bendingMachineServices from '~/api/bendingMachine';
import TransferBoxServices from '~/api/TransferBox';
import AddOrUpdateForm from './AddOrUpdateForm';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import EmptyPalletDeliveryApi from '~/api/EmptyPalletDelivery';
import { attributeOne, attributeTwo, BendingStates } from '~/enum/enum';

import PickTray from './PickTray/index';
import PullOff from './PullOff/index';
import SurplusForm from './SurplusForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { showTotal } = page
const { Pane } = HVLayout;
const { Option } = Select;
const middles = [
  { id: 1, name: 'J002', value: 'J002', },
  { id: 2, name: 'J003', value: 'J003', },
]

const BendingMachine = ({ bendingNumber, tableName }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({ bendingNumber: bendingNumber });

  const [pickVis, setPickVis] = useState(false)
  const [pickData, setPickData] = useState({})
  const [attributeOne, setAttributeOne] = useState([]);
  const [attributeTwo, setAttributeTwo] = useState('');

  const [pullOffVis, setPullOffVis] = useState(false);
  const [pullOffData, setPullOffData] = useState({});

  const [addOrUpdateModalVis, setAddOrUpdateModalVis] = useState(false);
  const addOrUpdateForm = useRef();
  const [updateFormData, setUpdateFormData] = useState({})

  const [pullVis, setPullVis] = useState(false);
  const [pullData, setPullData] = useState({});
  const [location, setLocation] = useState('J003');

  const [surplusFormVis, setSurplusFormVis] = useState(false);
  const [surplusData, setSurplusData] = useState({});
  const surplusForm = useRef();



  useEffect(() => {
    loadData(page, pageSize, { ...searchValue });
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
        if (text == null) {
          return
        }
        return BendingStates[text - 1].value
      }
    },
    {
      title: getFormattedMsg('BendingMachineConfiguration.title.attribute'),
      dataIndex: 'attribute',
      key: 'attribute',
      align: 'center',
    },
    {
      title: "是否允许切割未完成出库",
      dataIndex: 'ifout',
      key: 'ifout',
      align: 'center',
      render: (text, record, index) => {
        if (text == true) { return '是' }
        if (text == false) { return '否' }
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
      title: getFormattedMsg('BendingMachineConfiguration.title.operation'),
      key: 'opt',
      align: 'center',
      render: (_, record) => [
        <a key="pick" onClick={() => handlePick(record)}>
          托盘拣选
        </a>,
        <Divider key="divider4" type="vertical" />,
        <a key="takedown" onClick={() => HandlePullOff(record)}>
          托盘下架
        </a>,
        <Divider key="divider1" type="vertical" />,
        <a key="shelf" onClick={() => HandlePutOn(record)}>
          空托上架
        </a>,
        <Divider key="divider5" type="vertical" />,
        <a key="surplus" onClick={() => handleSurplus(record)}>
          未完工回库
        </a>,
        <Divider key="divider6" type="vertical" />,
        <a key="update" onClick={() => handleUpdate(record)}>
          {getFormattedMsg('BendingMachineConfiguration.button.update')}
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
        // res.content.map(i => {
        //   const text = i.attribute
        //   const arr = text.split(',');
        //   let array = []
        //   arr.map(j => {
        //     const a = Number(j)
        //     array = [...array, a]
        //   })
        //   i.attributeOne = array
        // })
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
    loadData(p, s, { ...searchValue });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    loadData(p, s, { ...searchValue });
    setPage(p);
  };

  // //查询按钮
  // const handleSearch = data => {
  //   const params = { ...data }
  //   setSearchValue({ ...params });
  //   setPage(1);
  //   setPageSize(10);
  //   loadData(1, 10, { ...params });
  // };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'bendingMachine' }),
    []
  );

  const handlePick = (record) => {
    setPickVis(true)
    setPickData(record)
    const attributeOne = record.attribute

    let array = []
    const arr = attributeOne.split(',');
    arr.map(i => {
      array = [...array, i]
    })
    setAttributeOne(array)
    setAttributeTwo('切割完工')
  }

  const handleCancelPick = () => {
    setPickVis(false)
    setPickData({})
    setAttributeOne([])
    setAttributeTwo('')
  }

  const HandlePullOff = (record) => {
    setPullOffVis(true)
    setPullOffData(record)
  }

  const handleCancelPullOff = () => {
    setPullOffVis(false)
    setPullOffData({})
  }


  const handleUpdate = (record) => {
    setAddOrUpdateModalVis(true)
    if (record.ifout != null) {
      record.ifout = record.ifout.toString()
    }
    setUpdateFormData(record)
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

      if (!isEmpty(params.attribute)) {
        params.attribute = params.attribute.toString()
      }
      if (updateFormData != {}) {
        Object.keys(updateFormData).map(i => {
          if (params[i] == null) { params[i] = updateFormData[i] }
        })
      }
      await bendingMachineServices
        .addOrUpdate(params)
        .then(res => {
          notification.success({
            message: params.id == null ? getFormattedMsg('BendingMachineConfiguration.message.addSuccess') : getFormattedMsg('BendingMachineConfiguration.message.updateSuccess')
          });
          loadData(page, pageSize, { ...searchValue })
        })
        .catch(err => {
          notification.warning({
            message: params.id == null ? getFormattedMsg('BendingMachineConfiguration.message.addFailure') : getFormattedMsg('BendingMachineConfiguration.message.updateFailure'),
            description: err.message
          });
        });
      handleCancelAddOrUpdate();
    })
  }

  const HandlePutOn = (record) => {
    setPullVis(true)
    setPullData(record)
  }

  const handleCancelPutOn = () => {
    setPullVis(false)
    setPullData({})
    setLocation('J003')
  }

  const modalPutOnFoot = () => [
    <Button key="save" type="primary" onClick={handleSavePutOn}>
      {getFormattedMsg('EmptyPalletDelivery.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelPutOn}>
      {getFormattedMsg('EmptyPalletDelivery.button.cancel')}
    </Button>
  ];

  const handleSavePutOn = () => {
    const data = {
      origin: pullData.readyMaterials,
      middle: location,
      trayNumber: pullData.transferCode,
      state: 0,
    }
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
        loadData(page, pageSize, { ...searchValue });
        handleCancelPutOn()
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }


  const handleSurplus = (record) => {
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
      if (params.attributeOne.length != 0) {
        params.attributeOne = params.attributeOne.toString()
      } else {
        delete params.attributeOne
      }
      
      await bendingMachineServices
        .addSurplusMaterial(params)
        .then(res => {
          notification.success({
            message: getFormattedMsg('SemiFinishedWarehousingReceipt.message.addSuccess')
          });
          loadData(page, pageSize, { ...searchValue });
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

  return (
    <>
      <HVLayout>
        {/* <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('BendingMachineConfiguration.label.bendingNumber')}
              name="bendingNumber"
            >
              <Input  allowClear placeholder={getFormattedMsg('BendingMachineConfiguration.placeholder.bendingNumber')}/>
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane> */}
        <Pane
          icon={<i className="h-visions hv-table" />}
          title={tableName}
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
      <Drawer
        className='pickDrawer'
        title={'托盘拣选'}
        visible={pickVis}
        onClose={handleCancelPick}
        width={window.innerWidth * 0.8}
        bodyStyle={{ height: document.body.clientHeight - 55 }}
        destroyOnClose
      >
        <PickTray
          modifyData={pickData}
          attribute1={attributeOne}
          attribute2={attributeTwo}
        />
      </Drawer>
      <Drawer
        className='pullOffDrawer'
        title={'托盘下架'}
        visible={pullOffVis}
        onClose={handleCancelPullOff}
        width={window.innerWidth * 0.8}
        bodyStyle={{ height: document.body.clientHeight - 55 }}
        destroyOnClose
      >
        <PullOff pullOffData={pullOffData} handleCancelPullOff={handleCancelPullOff}/>
      </Drawer>
      <Modal
        title={'托盘上架'}
        visible={pullVis}
        onCancel={handleCancelPutOn}
        footer={modalPutOnFoot()}
        destroyOnClose
      >
        <div style={{ display: 'flex' }}>
          <div style={{
            width: '15%',
            display: 'flex',
            justifyContent: 'middle',
            alignItems: 'center',
            textAlign: 'center',
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
      {/* <Drawer 
      title={'未完工回库'} 
      visible={surplusFormVis} 
      onClose={handleCancelSurplus} 
      width={500}
      >
        <Drawer.DrawerContent>
          <SurplusForm
            ref={surplusForm}
            modifyData={surplusData}
            attributeOne={attributeOne}
            attributeTwo={attributeTwo}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddFoot()}</Drawer.DrawerBottomBar>
      </Drawer> */}
      <Modal
        title={'未完工回库'}
        visible={surplusFormVis}
        onCancel={handleCancelSurplus}
        footer={modalAddFoot()}
        destroyOnClose
        width={800}
      >
        <SurplusForm
          ref={surplusForm}
          modifyData={surplusData}
          attributeOne={attributeOne}
          attributeTwo={attributeTwo}
        />
      </Modal>

      <Drawer
        title={updateFormData.id == null ? getFormattedMsg('BendingMachineConfiguration.title.create') : getFormattedMsg('BendingMachineConfiguration.title.update')}
        visible={addOrUpdateModalVis}
        onClose={handleCancelAddOrUpdate}
        width={500}
        destroyOnClose
      >
        <Drawer.DrawerContent>
          <AddOrUpdateForm
            ref={addOrUpdateForm} modifyData={updateFormData}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalAddOrUpdateFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};

export default BendingMachine;
