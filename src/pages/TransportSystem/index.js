// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer ,Select,Badge} from '@hvisions/h-ui';
// import { i18n, page } from '@hvisions/toolkit';
// // import styles from './style.scss';
// import { CacheTable } from '~/components';
// import moment from 'moment';
// import { session } from '@hvisions/toolkit';
// import EmptyPalletsWarehousing from '~/api/EmptyPalletsWarehousing';
// import { isEmpty } from 'lodash';
// import { TransportTaskType } from '~/enum/enum';

// const getFormattedMsg = i18n.getFormattedMsg;
// const { RangePicker } = DatePicker;
// const dateTime = 'YYYY-MM-DD HH:mm:ss';
// const { showTotal } = page;
// const { Option } = Select;
// const { Pane } = HVLayout;

// const TransportSystem = ({ history }) => {
//   const [tableData, setTableData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPage, setTotalPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState(null);
//   const [nowTab, setNowTab] = useState(0);

//   const   state = {
//     0: '排队中', 1: '运行中', 2: '异常', 3: '已完成'
//   }
//   const [selectedstatus, setSelectedstatus] = useState('0');

//   const [addOrUpdateVis, setAddOrUpdateVis] = useState(false);
//   const [addOrUpdateData, setAddOrUpdateData] = useState({});
//   const addOrUpdateForm = useRef();


//   useEffect(() => {
//     loadData(page, pageSize, { ...setSearchValue, state: selectedstatus });
//   }, []);

//   const columns = useMemo(() => {
//     return [
//     {
//       title: '任务号',
//       dataIndex: 'taskCode',
//       key: 'taskCode',
//       align: 'center',
//     },
//     {
//       title: '优先级',
//       dataIndex: 'priority',
//       key: 'priority',
//       align: 'center',
//     },
//     {
//       title: '托盘号',
//       dataIndex: 'transferCode',
//       key: 'transferCode',
//       align: 'center',
//     },
//     {
//       title: '类型',
//       dataIndex: 'taskType',
//       key: 'taskType',
//       align: 'center',
//     },
//     {
//       title: '目标位置',
//       dataIndex: 'toLocation',
//       key: 'toLocation',
//       align: 'center',
//     },
//     {
//       title: '原位置',
//       dataIndex: 'fromLocation',
//       key: 'fromLocation',
//       align: 'center',
//     },
//     {
//       title: '主任务号',
//       dataIndex: 'overviewCode',
//       key: 'overviewCode',
//       align: 'center',
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'createTime',
//       key: 'createTime',
//       align: 'center',
//     },
//     {
//       title: '业务类型',
//       dataIndex: '111',
//       key: '111',
//       align: 'center',
//     },
//     {
//       title: '操作人',
//       dataIndex: '222',
//       key: '222',
//       align: 'center',
//     },
//   ];
// }, []);

//   //查询页面数据
//   const loadData = async (page, pageSize, searchValue) => {
//     // setLoading(true);
//     // EmptyPalletsWarehousing
//     //   .getByQuery({ ...searchValue, page: page - 1, pageSize })
//     //   .then(res => {
//     //     setTableData(res.content);
//     //     setTotalPage(res.totalElements);
//     //     setPage(res.pageable.pageNumber + 1)
//     //     setPageSize(res.pageable.pageSize)
//     //     setLoading(false);
//     //   })
//     //   .catch(err => {
//     //     setLoading(false);
//     //     notification.warning({
//     //       message: getFormattedMsg('global.notify.fail'),
//     //       description: err.message
//     //     });
//     //   });
//   };

//   //刷新按钮
//   const reFreshFunc = () => {
//     return () => loadData(page, pageSize, { ...searchValue, state: selectedstatus });
//   };

//   const onShowSizeChange = (p, s) => {
//     loadData(p, s, { ...searchValue, state: selectedstatus });
//     setPageSize(s);
//   };

//   const pageChange = (p, s) => {
//     loadData(p, s, { ...searchValue, state: selectedstatus });
//     setPage(p);
//   };

//   const handleChangeStatus = e => {
//     setTableData([]);
//     console.log('e.target.value',e.target.value);
//     setSelectedstatus(e.target.value);
//     setPage(1);
//     loadData(1, pageSize, { ...searchValue, state: e.target.value });
//   };

//   //查询按钮
//   const handleSearch = data => {
//     const params = { ...data }
//     setSearchValue({ ...params });
//     setPage(1);
//     setPageSize(10);
//     loadData(1, 10, { ...params, state: selectedstatus });
//   };

//   const { Table, SettingButton } = useMemo(
//     () => CacheTable({ columns:columns, scrollHeight: 'calc(100vh - 470px)', key: 'transportSystem' }),
//     [nowTab]
//   );

//   const renderTable = useMemo(() => {
//     return (
//       <>
//         <Pane.Content>
//           <Spin spinning={loading}>
//             <Table
//               pagination={false}
//               scroll={{ x: 'max-content' }}
//               dataSource={tableData.map((i, idx) => ({
//                 ...i,
//                 serialNumber: (page - 1) * pageSize + ++idx
//               }))}
//               columns={columns}
//               rowKey={record => record.id}
//             />
//           </Spin>
//         </Pane.Content>
//         {/* <Pane.BottomBar>
//           <Pagination
//             onShowSizeChange={onShowSizeChange}
//             current={page}
//             onChange={pageChange}
//             defaultCurrent={page}
//             total={totalPage}
//             size="small"
//             showSizeChanger
//             showQuickJumper
//             showTotal={showTotal}
//             pageSize={pageSize}
//           />
//         </Pane.BottomBar> */}
//       </>
//     );
//   }, [loading, tableData, page, pageSize, totalPage]);

//   return (
//     <>
//       <HVLayout>
//         <Pane height={'auto'}>
//           <SearchForm onSearch={handleSearch}>
//             <SearchForm.Item
//               label={'任务类型'}
//               name="attributeTwo"
//             >
//               <Select
//                 placeholder={'请选择任务类型'}
//               >
//                 {TransportTaskType.map((value, index) => (
//                   <Option value={value.id} key={value.id}>
//                     {value.name}
//                   </Option>
//                 ))}
//               </Select>
//             </SearchForm.Item>
//             <SearchForm.Item
//               label={'时间'}
//               name="creationTime"
//             >
//               <RangePicker
//                 format={dateTime}
//                 showTime
//                 style={{ width: '100%' }}
//               />
//             </SearchForm.Item>
//           </SearchForm>
//         </Pane>
//         <Pane
//           icon={<i className="h-visions hv-table" />}
//           title="任务详情"
//           tab
//           buttons={
//             <>
//             {nowTab == 0 && <Button key="adjust" type="primary">调整优先级</Button>}
//             {nowTab == 0 && <Button key="pause" type="primary">暂停</Button>}
//             {nowTab == 0 && <Button key="delete" type="primary">删除</Button>}
    
//             {nowTab == 2 && <Button key="Manual" type="primary">手动下发</Button>}
//             {nowTab == 2 && <Button key="Modified" type="primary">修改托盘</Button>}
//             {nowTab == 2 && <Button key="rollback" type="primary">回退</Button>}
//             {nowTab == 2 && <Button key="complete" type="primary">完成</Button>}
//           </>
//           }
//           onTabChange={e => {
//             console.log(e,'e');
//             setNowTab(+e);
//             if (e === '0') {
//               handleSearch({ state: '' });
//               return;
//             }
//             // handleSearch({ state: e });
//           }}
//         >
//           <Pane.Tab
//             title="排队中"
//             name={0}
//             isComponent
//             settingButton={<SettingButton/>}
//             onRefresh={()=>handleSearch(0)}
//             >
//               {renderTable}
//             </Pane.Tab>
//             <Pane.Tab
//             title="运行中"
//               name={1}
//               isComponent
//               settingButton={<SettingButton/>}
//               onRefresh={()=>handleSearch(1)}
//             >
//               {renderTable}
//             </Pane.Tab>
//             <Pane.Tab
//             title="异常"
//               name={2}
//               isComponent
//               settingButton={<SettingButton/>}
//               onRefresh={()=>handleSearch(2)}
//             >
//               {renderTable}
//             </Pane.Tab>
//             <Pane.Tab
//             title="已完成"
//               name={3}
//               onRefresh={()=>handleSearch(3)}
//               settingButton={<SettingButton/>}
//               isComponent
//             >
//               {renderTable}
//             </Pane.Tab>
//             <Pane.BottomBar>
//           <Pagination
//             onShowSizeChange={onShowSizeChange}
//             current={page}
//             onChange={pageChange}
//             defaultCurrent={page}
//             total={totalPage}
//             size="small"
//             showSizeChanger
//             showQuickJumper
//             showTotal={showTotal}
//             pageSize={pageSize}
//           />
//         </Pane.BottomBar>
//         </Pane>

//       </HVLayout>
//     </>
//   );
// };
// export default TransportSystem;

import React, { useEffect, useState, useMemo, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { HVLayout, Steps, HIcon, Icon, Row, Col, Pagination, Spin, DetachTable, Badge,Select, Input, notification, Divider, Dropdown, Modal, Menu, Button } from '@hvisions/h-ui';
import Core from '@hvisions/core';
import { i18n, page } from '@hvisions/toolkit';
import { withPermission } from '@hvisions/core';
import { CacheTable } from '~/components';

const { Step } = Steps;
const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { Option } = Select;
const { showTotal } = page

const StartButton = withPermission('a', 'START');
const StopButton = withPermission('a', 'STOP');
const ContinueButton = withPermission('a', 'CONTINUE');
const EndButton = withPermission('a', 'END');
const ChangeButton = withPermission('a', 'CHANGE');

const Index = ({ history }) => {
  const [areaList, setAreaList] = useState([]);
  const [cellList, setCellList] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [total, setTotal] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [searchItem, setSearchItem] = useState({ state: '' });
  const [formData, setFormData] = useState({});
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [selectedEqu, setSelectedEqu] = useState({});
  const [spinning, setSpinning] = useState(false);
  const [nowTab, setNowTab] = useState(0);
  const [taskCount, setTaskCount] = useState({ 未就绪: 0, 已就绪: 0, 运行中: 0 });
  const [checkTreeItem, setCheckTreeItem] = useState(null)
  const [userList, setUserList] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [nextOperationVisible, setNextOperationVisible] = useState(false);
  const [nextOptionList, setNextOptionList] = useState({
    选择工序: [{ label: 'OP010', data: { code: '8cdqewwe' } }]
  });
  const changeEquRef = useRef();
  const nextOptionRef = useRef();

  // const [switchPage, setSwitchPage] = useState(1)
  const [switchPage, setSwitchPage] = useState(3)
  const [isWith, setIsWith] = useState(false)

  const [keepData, setKeepData] = useState({})

  const [selectedRows,setSelectedRows] = useState([])

  useEffect(() => {

  }, []);


  const columns = useMemo(() => {
    return [
      {
        title: getFormattedMsg('workOrder.label.workOrder'),
        dataIndex: 'operationCode',
        key: 'operationCode',
        width: 150,
      },
      {
        title: getFormattedMsg('workOrder.label.wordOrderNumber'),
        dataIndex: 'workOrderCode',
        key: 'workOrderCode',
        width: 200,
      },
      {
        title: getFormattedMsg('workOrder.label.workOrderCount'),
        dataIndex: 'workOrderQuantity',
        key: 'workOrderQuantity',
        align: 'center',
        width: 100,
      },
      {
        title: getFormattedMsg('workOrder.label.workStatus'),
        dataIndex: 'state',
        key: 'state',
        width: 100,
        align: 'center',
      },
      {
        title: getFormattedMsg('material.label.codeForMaterial'),
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 150,
      },
      {
        title: getFormattedMsg('material.label.nameForMaterial'),
        dataIndex: 'materialName',
        key: 'materialName',
        width: 200,
      },

      {
        title: '规格',
        dataIndex: 'specifications',
        key: 'specifications',
        width: 100,
      },
      {
        title: '分切工位',
        dataIndex: 'station',
        key: 'station',
        width: 100,
      },
      {
        title: '工位总数',
        dataIndex: 'stationCount',
        key: 'stationCount',
        width: 100,
      },
      {
        title: '需求分类',
        dataIndex: 'srcDocNo',
        key: 'srcDocNo',
        width: 100,
      },

      {
        title: getFormattedMsg('schedulement.label.shift'),
        dataIndex: 'shiftName',
        key: 'shiftName',
        width: 100,
      },
      {
        title: getFormattedMsg('schedulement.label.crew'),
        dataIndex: 'crewName',
        key: 'crewName',
        width: 100,
      },
      {
        title: getFormattedMsg('workOrder.label.StartTime'),
        dataIndex: 'startTime',
        key: 'startTime',
        align: 'center',
        width: 170,
      },
      {
        title: getFormattedMsg('workOrder.label.EndTime'),
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
        minWidth: 170,
      },
      {
        title: "当前执行人",
        dataIndex: 'taskUserName',
        key: 'taskUserName',
        align: 'center',
        width: 120,
      },
      {
        title: "是否已分配",
        dataIndex: 'isAssign',
        key: 'isAssign',
        align: 'center',
        width: 120,
        render: (_, record) => {
          if (record.isAssign) {
            return <span>已分配</span>
          } else {
            return <span>未分配</span>
          }
        }
      },
      {
        title: getFormattedMsg('global.label.operation'),
        dataIndex: 'options',
        key: 'options',
        align: 'center',
        width: 180,
        fixed: 'right',
      }
    ];
  }, [pageInfo]);

  const { Table, SettingButton} = useMemo(() => CacheTable({ columns: columns, scrollHeight: 'calc(100vh - 480px)', key: `TransportSystem` }), [nowTab]);

  const renderTable = useMemo(() => {
    return (
      <>
        <Pane.Content>
          <Spin spinning={spinning}>
            <Table
              rowKey={record => record.id}
              dataSource={workOrderList.map((i, idx) => ({
                ...i,
                serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
              }))}
              columns={columns}
              filterMultiple={false}
              pagination={false}
              scroll={{ x: 'max-content'}}
            />
            </Spin>
          </Pane.Content>
          <Pane.BottomBar>
            <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                pageSizeOptions={['10', '20', '30']}
                size="small"
                total={total}
                showSizeChanger
                showTotal={(total, range) => showTotal(total, range)}
              />
          </Pane.BottomBar>
      </>
    );
  }, [workOrderList, pageInfo, total, selectedRowKeys,spinning]);

  const refreshTable = () => {

  }
  return (
    <>
      <HVLayout>

        <Pane
          tab
          TabChange={e => {
            setNowTab(+e);
          }}
        >
          <Pane.Tab
            title="全部"
            name="0"
            isComponent
            settingButton={<SettingButton />}
          >
            {renderTable}
          </Pane.Tab>

          <Pane.Tab
            title={
              <Badge
                count={taskCount['已就绪']}
                offset={[18, 0]}
                style={{ backgroundColor: '#2db7f5' }}
              >
                <span>已就绪</span>
              </Badge>
            }
            name={2}
            isComponent
            settingButton={<SettingButton />}
          >
            <Pane.Content>
              <Spin spinning={spinning}>
                <Table
                  rowKey={record => record.id}
                  dataSource={workOrderList.map((i, idx) => ({
                    ...i,
                    serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
                  }))}
                  columns={columns}
                  filterMultiple={false}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </Spin>
            </Pane.Content>
            <Pane.BottomBar>
              <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                pageSizeOptions={['10', '20', '30']}
                size="small"
                total={total}
                showSizeChanger
                showTotal={(total, range) => showTotal(total, range)}
              />
            </Pane.BottomBar>
          </Pane.Tab>

          <Pane.Tab
            title={
              <Badge
                count={taskCount['运行中']}
                offset={[18, 0]}
                style={{ backgroundColor: '#108ee9' }}
              >
                <span>运行中</span>
              </Badge>
            }
            name={3}
            settingButton={<SettingButton />}
            isComponent
          >
            <Pane.Content>
              <Spin spinning={spinning}>
                <Table
                  rowKey={record => record.id}
                  dataSource={workOrderList.map((i, idx) => ({
                    ...i,
                    serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
                  }))}
                  columns={columns}
                  filterMultiple={false}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </Spin>
            </Pane.Content>
            <Pane.BottomBar>
              <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                pageSizeOptions={['10', '20', '30']}
                size="small"
                total={total}
                showSizeChanger
                showTotal={(total, range) => showTotal(total, range)}
              />
            </Pane.BottomBar>
          </Pane.Tab>
          <Pane.Tab
            title={
              <Badge
                count={taskCount['未就绪']}
                offset={[18, 0]}
                style={{ backgroundColor: '#52c41a' }}
              >
                <span>未就绪</span>
              </Badge>
            }
            name={1}
            isComponent
            settingButton={<SettingButton />}
          >
            <Pane.Content>
              <Spin spinning={spinning}>
                <Table
                  rowKey={record => record.id}
                  dataSource={workOrderList.map((i, idx) => ({
                    ...i,
                    serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
                  }))}
                  columns={columns}
                  filterMultiple={false}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </Spin>
            </Pane.Content>
            <Pane.BottomBar>
              <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                pageSizeOptions={['10', '20', '30']}
                size="small"
                total={total}
                showSizeChanger
                showTotal={(total, range) => showTotal(total, range)}
              />
            </Pane.BottomBar>
          </Pane.Tab>

          <Pane.Tab title="已完成"
            name={5}
            isComponent
            settingButton={<SettingButton />}
          // forceRender
          >
            <Pane.Content>
              <Spin spinning={spinning}>
                <Table
                  rowKey={record => record.id}
                  dataSource={workOrderList.map((i, idx) => ({
                    ...i,
                    serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
                  }))}
                  columns={columns}
                  filterMultiple={false}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </Spin>
            </Pane.Content>
            <Pane.BottomBar>
              <Pagination
                current={pageInfo.page}
                pageSize={pageInfo.pageSize}
                showQuickJumper
                pageSizeOptions={['10', '20', '30']}
                size="small"
                total={total}
                showSizeChanger
                showTotal={(total, range) => showTotal(total, range)}
              />
            </Pane.BottomBar>
          </Pane.Tab>
        </Pane>
      </HVLayout>
    </>
  );
};

Index.propTypes = {
  history: PropTypes.object
};

export default Index;
