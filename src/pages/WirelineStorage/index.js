import React, { useState, useEffect, useRef, useMemo } from 'react';
import {  HVLayout,  Button,  notification,  Modal,  Spin,  Pagination,  SearchForm,  DatePicker,  Input,  Drawer,Divider} from '@hvisions/h-ui';
import { Menu, Dropdown, Icon } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import moment from 'moment';
import SurplusMaterialApi from '~/api/SurplusMaterial'; 

import LineEdgeLibraryApi from '~/api/LineEdgeLibraryController';
import EmptyPalletsWarehousingApi from '~/api/EmptyPalletsWarehousing';
import { withPermission } from '@hvisions/core';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const dateTime = 'YYYY-MM-DD HH:mm:ss';
const { showTotal } = page;

const PutOnButton = withPermission('a', 'PutOn');
const RelieveOccupationButton = withPermission('a', 'RelieveOccupation');
const UpButton = withPermission('a', 'Up');
const DownButton = withPermission('a', 'Down');
const MaterialReturnButton = withPermission('a', 'MaterialReturn');
const UpdateButton = withPermission('a', 'Update');

const WirelineStorage = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [addVis, setAddVis] = useState(false);
  const addForm = useRef();

  useEffect(() => {
    // loadData(page, pageSize, { ...setSearchValue });
    loadData({ ...setSearchValue });
  }, []);

  const columns = [
    {
      // title: '切割机',
      title: getFormattedMsg('WirelineStorage.title.cuttingMachine'),
      dataIndex: 'cuttingMachine',
      key: 'cuttingMachine',
      align: 'center',
      width:100,
    },
    {
      // title: '材料名称',
      title: getFormattedMsg('WirelineStorage.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
      width:100,
    },
    {
      // title: '材料编码',
      title: getFormattedMsg('WirelineStorage.title.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
      width:100,
    },
    {
      // title: '材料大小 X',
      title: getFormattedMsg('WirelineStorage.title.materialSizeX'),
      dataIndex: 'materialSizeX',
      key: 'materialSizeX',
      align: 'center',
      width:100,
    },
    {
      // title: '材料大小 Y',
      title: getFormattedMsg('WirelineStorage.title.materialSizeY'),
      dataIndex: 'materialSizeY',
      key: 'materialSizeY',
      align: 'center',
      width:100,
    },
    {
      // title: '材料厚度',
      title: getFormattedMsg('WirelineStorage.title.materialThickness'),
      dataIndex: 'materialThickness',
      key: 'materialThickness',
      align: 'center',
      width:100,
    },
    {
      // title: '出库总数(张)',
      title: getFormattedMsg('WirelineStorage.title.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width:110,
    },
    {
      // title: '剩余数量(张)',
      title: getFormattedMsg('WirelineStorage.title.remainderNum'),
      dataIndex: 'remainderNum',
      key: 'remainderNum',
      align: 'center',
      width:110,
    },
    {
      // title: '使用状态',
      title: getFormattedMsg('WirelineStorage.title.useState'),
      dataIndex: 'useState',
      key: 'useState',
      align: 'center',
      width:100,
    },
    {
      // title: '托盘号',
      title: getFormattedMsg('WirelineStorage.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
      width:100,
    },
    {
      // title: '托盘位置',
      title: getFormattedMsg('WirelineStorage.title.trayLocation'),
      dataIndex: 'trayLocation',
      key: 'trayLocation',
      align: 'center',
      render: (text, record, index) => {
        return (text ? '上料口' : '接驳口')
      },
      width:100,
    },
    {
      // title: '托盘交接位',
      title: getFormattedMsg('WirelineStorage.title.fromLocation'),
      dataIndex: 'fromLocation',
      key: 'fromLocation',
      align: 'center',
      width:100,
    },
    {
      // title: '托盘到达位',
      title: getFormattedMsg('WirelineStorage.title.toLocation'),
      dataIndex: 'toLocation',
      key: 'toLocation',
      align: 'center',
      width:100,
    },
    {
      // title: '位置名称',
      title: getFormattedMsg('WirelineStorage.title.locationName'),
      dataIndex: 'locationName',
      key: 'locationName',
      align: 'center',
      width:100,
    },
    // {
    //   title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
    //   key: 'opt',
    //   align: 'center',
    //   width: 500,
    //   fixed:'right',
    //   render: (_, record) => [
    //     <a key="PutOn" onClick={() => handlePutOn(record)}>
    //       {/* 上架 */}
    //       {getFormattedMsg('WirelineStorage.button.handlePutOn')}
    //     </a>,
    //     <Divider key="divider1" type="vertical" />,
    //     <a key="Up" onClick={() => handleUp(record)}>
    //       {/* 数量+1 */}
    //       {getFormattedMsg('WirelineStorage.button.handleUp')}
    //     </a>,
    //     <Divider key="divider2" type="vertical" />,
    //     <a key="Down" onClick={() => handleDown(record)}>
    //       {/* 数量-1 */}
    //       {getFormattedMsg('WirelineStorage.button.handleDown')}
    //     </a>,
    //     <Divider key="divider3" type="vertical" />,
    //     <a key="MaterialReturn" onClick={() => handMaterialReturn(record)}>
    //       {/* 手动剩余物料退库 */}
    //       {getFormattedMsg('WirelineStorage.button.handMaterialReturn')}
    //     </a>,
    //     <Divider key="divider4" type="vertical" />,
    //     <a key="updateHighLevel" onClick={() => updateHighLevel(record)}>
    //       {/* 更新上下料数据 */}
    //       {getFormattedMsg('WirelineStorage.button.updateHighLevel')}
    //     </a>,
    //     <Divider key="divider5" type="vertical" />,
    //     <a key="relieveOccupation" onClick={() => relieveOccupation(record)}>
    //       {/* 解除占用 */}
    //       {getFormattedMsg('WirelineStorage.button.relieveOccupation')}
    //     </a>,
    //   ],
    // }
    {
      title: getFormattedMsg('RawMaterialDeliveryOrderManagement.title.operation'),
      key: 'opt',
      align: 'center',
      width: 250,
      fixed:'right',
      render: (_, record) => [
        <PutOnButton key="PutOn" onClick={() => handlePutOn(record)}>
          {/* 上架 */}
          {getFormattedMsg('WirelineStorage.button.handlePutOn')}
        </PutOnButton>,
        <Divider key="divider1" type="vertical" />,
        <RelieveOccupationButton key="relieveOccupation" onClick={() => relieveOccupation(record)}>
          {/* 解除占用 */}
          {getFormattedMsg('WirelineStorage.button.relieveOccupation')}
        </RelieveOccupationButton>,
        <Divider key="divider2" type="vertical" />,
        <Dropdown key="dropdown" overlay={menu(record)} placement="bottomLeft">
          <a className="ant-dropdown-link" href="#">
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      ],
    }
  ]
  
  const menu = record => (
    <Menu>
      <Menu.Item>
        <UpButton key="Up" onClick={() => handleUp(record)}>
          {/* 数量+1 */}
          {getFormattedMsg('WirelineStorage.button.handleUp')}
        </UpButton>
      </Menu.Item>
      <Menu.Item>
      <DownButton key="Down" onClick={() => handleDown(record)}>
          {/* 数量-1 */}
          {getFormattedMsg('WirelineStorage.button.handleDown')}
        </DownButton>
      </Menu.Item>
      <Menu.Item>
      <MaterialReturnButton key="MaterialReturn" onClick={() => handMaterialReturn(record)}>
          {/* 手动剩余物料退库 */}
          {getFormattedMsg('WirelineStorage.button.handMaterialReturn')}
        </MaterialReturnButton>
      </Menu.Item>
      <Menu.Item >
      <UpdateButton key="updateHighLevel" onClick={() => updateHighLevel(record)}>
          {/* 更新上下料数据 */}
          {getFormattedMsg('WirelineStorage.button.updateHighLevel')}
        </UpdateButton>
      </Menu.Item>
    </Menu>
  );
  //查询页面数据
  const loadData = async ( searchValue) => {
    setLoading(true);
    // LineEdgeLibraryApi.getByQuery({ ...searchValue, page: page - 1, pageSize })
    LineEdgeLibraryApi.getByQuery({ ...searchValue})
      .then(res => {
        // setTableData(res.content);
        // setTotalPage(res.totalElements);
        // setPage(res.pageable.pageNumber + 1);
        // setPageSize(res.pageable.pageSize);
        //console.log(res,'res');
        setTableData(res);
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
    // return () => loadData(page, pageSize, { ...searchValue });
    return () => loadData({ ...searchValue });
  };

  // const onShowSizeChange = (p, s) => {
  //   loadData(p, s, { ...searchValue });
  //   setPageSize(s);
  // };

  // const pageChange = (p, s) => {
  //   loadData(p, s, { ...searchValue });
  //   setPage(p);
  // };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data };
    
    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime);
      params.endTime = moment(params.creationTime[1]).format(dateTime);
    }
    delete params.creationTime;
    Object.keys(params).map(i=>{
      if(params[i] == undefined ||params[i] == ""){
        delete params[i]
      }
    })
    //console.log(params,'params');

    setSearchValue({ ...params });
    // setPage(1);
    // setPageSize(10);
    // loadData(1, 10, { ...params });
    loadData({ ...params });
  };

  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, scrollHeight: 'calc(100vh - 470px)', key: 'wms_wireline_storage' }),
    []
  );

  const handlePutOn = (record) => {
    const data = {
      origin: record.toLocation,
      middle: record.fromLocation,
      trayNumber: record.trayNumber,
      state: 0,
    }
    //console.log(data,'上架');
    Modal.confirm({
      title: `${getFormattedMsg('PalletManagement.title.putOnPallet')}${record.trayNumber}?`,
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
          // message: '托盘入库任务生成成功'
          message: getFormattedMsg('WirelineStorage.message.addAndupShelves')
        });
        // reFreshFunc()
        loadData({ ...searchValue })
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  }

  const handleUp = (record) => {
    const addremove  = "%2B1"
    Modal.confirm({
      // title: `确认托盘${record.trayNumber}数量+1 ?`,
      title: `${ getFormattedMsg('WirelineStorage.message.handle')}${record.trayNumber}${ getFormattedMsg('WirelineStorage.button.handleUp')} ?`,
      onOk: async() => {
        await LineEdgeLibraryApi.updateRemainderNum(record.locationName ,addremove,record.cuttingMachine )
        .then(res => {
          notification.success({
            // message: '数量增加成功',
            message: getFormattedMsg('WirelineStorage.message.addSuccess'),
          })
        // reFreshFunc()
        loadData({ ...searchValue })
        })
        .catch(err => {
          notification.warning({
            // message: '数量增加失败',
            message: getFormattedMsg('WirelineStorage.message.addFailure'),
            description: err.message
          })
        })
      }
    });
  }

  const handleDown = (record) => {
    const addremove  = "-1"
    Modal.confirm({
      // title: `确认托盘${record.trayNumber}数量-1 ?`,
      title: `${ getFormattedMsg('WirelineStorage.message.handle')}${record.trayNumber}${ getFormattedMsg('WirelineStorage.button.handleDown')} ?`,
      onOk: async() => {
        await LineEdgeLibraryApi.updateRemainderNum(record.locationName ,addremove,record.cuttingMachine )
        .then(res => {
          notification.success({
            // message: '数量减少成功'
            message: getFormattedMsg('WirelineStorage.message.removeSuccess'),
          })
        // reFreshFunc()
        loadData({ ...searchValue })
        })
        .catch(err => {
          notification.warning({
            // message: '数量减少失败',
            message: getFormattedMsg('WirelineStorage.message.removeFailure'),
            description: err.message
          })
        })
      }
    });
  }

  const handMaterialReturn =async(record)=>{
    await LineEdgeLibraryApi.handMaterialReturn(record.id )
        .then(res => {
          notification.success({
            // message: '物料退库成功'
            message: getFormattedMsg('WirelineStorage.message.returnSuccess'),
          })
        // reFreshFunc()
        loadData({ ...searchValue })
        })
        .catch(err => {
          notification.warning({
            // message: '物料退库失败',
            message: getFormattedMsg('WirelineStorage.message.returnFailure'),
            description: err.message
          })
        })
  }

  const updateHighLevel =async(record)=>{
    await LineEdgeLibraryApi.updateHighLevel(record.id )
        .then(res => {
          notification.success({
            // message: '数据更新成功'
            message: getFormattedMsg('WirelineStorage.message.updateSuccess'),
          })
        // reFreshFunc()
        loadData({ ...searchValue })
        })
        .catch(err => {
          notification.warning({
            // message: '数据更新失败',
            message: getFormattedMsg('WirelineStorage.message.updateFailure'),
            description: err.message
          })
        })
  }

  const relieveOccupation =async(record)=>{
    await LineEdgeLibraryApi.relieveOccupation(record.fromLocation ,0 )
    .then(res => {
      notification.success({
        // message: '物料解除占用成功'
        message: getFormattedMsg('WirelineStorage.message.relieveSuccess'),
      })
        // reFreshFunc()
        loadData({ ...searchValue })
    })
    .catch(err => {
      notification.warning({
        // message: '物料解除占用失败',
        message: getFormattedMsg('WirelineStorage.message.relieveFailure'),
        description: err.message
      })
    })
  }

  // const handleAdd = () => {
  //   setAddVis(true);
  // };

  // const handleCancelAdd = () => {
  //   const { resetFields } = addForm.current;
  //   resetFields();
  //   setAddVis(false);
  // };

  // const modalAddFoot = () => [
  //   <Button key="save" type="primary" onClick={handleSaveAdd}>
  //     {getFormattedMsg('SurplusInStorage.button.save')}
  //   </Button>,
  //   <Button key="cancel" onClick={handleCancelAdd}>
  //     {getFormattedMsg('SurplusInStorage.button.cancel')}
  //   </Button>
  // ];

  // const handleSaveAdd = () => {
  //   const { getFieldsValue, validateFields, setFieldsValue } = addForm.current;
  //   validateFields(async (err, values) => {
  //     if (err) return;
  //     const params = getFieldsValue();
  //     await SurplusMaterialApi
  //       .addSurplus(params)
  //       .then(res => {
  //         notification.success({
  //           message: getFormattedMsg('SurplusInStorage.message.addSuccess')
  //         });
  //         loadData(page, pageSize, { ...searchValue});
  //       })
  //       .catch(err => {
  //         notification.warning({
  //           message: getFormattedMsg('SurplusInStorage.message.addFailure'),
  //           description: err.message
  //         });
  //       });
  //     handleCancelAdd();
  //   });
  // };

  // const handleDelete = record => {
  //   Modal.confirm({
  //     title: getFormattedMsg('SurplusInStorage.operation.delete'),
  //     okType: 'danger',
  //     onOk: async () => {
  //       await SurplusMaterialApi
  //         .deleteById(record.id)
  //         .then(res => {
  //           notification.success({
  //             message: getFormattedMsg('SurplusInStorage.message.deleteSuccess'),
  //           });
  //           loadData(page, pageSize, { ...searchValue});
  //         })
  //         .catch(err => {
  //           notification.warning({
  //             message: getFormattedMsg('SurplusInStorage.message.deleteFailure'),
  //             description: err.message
  //           });
  //         });
  //     },
  //     onCancel() {}
  //   });
  // };

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              // label={'切割机'}
              label={getFormattedMsg('WirelineStorage.label.cuttingMachine')}
              name="cuttingMachine"
            >
              <Input
                // placeholder={'请输入切割机信息'}
                placeholder={getFormattedMsg('WirelineStorage.placeholder.cuttingMachine')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              // label={'任务号'}
              label={getFormattedMsg('WirelineStorage.label.taskCode')}
              name="taskCode"
            >
              <Input
                // placeholder={'请输入任务号'}
                placeholder={getFormattedMsg('WirelineStorage.placeholder.taskCode')}
                allowClear
              />
            </SearchForm.Item>
            <SearchForm.Item
              // label={'托盘号'}
              label={getFormattedMsg('WirelineStorage.label.trayNumber')}
              name="trayNumber"
            >
              <Input
                // placeholder={'请输入托盘号'}
                placeholder={getFormattedMsg('WirelineStorage.placeholder.trayNumber')}
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
          // title={'原料暂存库'}          
          title={getFormattedMsg('WirelineStorage.title.tableName')}
          buttons={[ ]}
          settingButton={<SettingButton />}
          onRefresh={reFreshFunc()}
        >
          <Spin spinning={loading}>
            <Table
              pagination={false}
              scroll={{ x: 'max-content' }}
              dataSource={tableData}
              columns={columns}
              rowKey={record => record.id}
            />
          </Spin>
        </HVLayout.Pane>
      </HVLayout>
    </>
  );
};
export default WirelineStorage;
