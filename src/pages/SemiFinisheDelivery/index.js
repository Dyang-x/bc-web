import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Spin, Pagination, SearchForm, DatePicker, Input, Tooltip, List, Select } from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { attributeOne, attributeTwo } from '~/enum/enum';
import SemiFinisheDeliveryPalletSelectionServices from '~/api/SemiFinisheDeliveryPalletSelection';
import OutForm from './OutForm';

const getFormattedMsg = i18n.getFormattedMsg;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { showTotal } = page
const { Pane } = HVLayout;
const dateTime = 'YYYY-MM-DD HH:mm:ss';

const SemiFinisheDeliveryPalletSelection = ({ history }) => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState({ attributeTwo: '切割完工' });
  const [trayNumber, setTrayNumber] = useState([]);
  const [orderDetailData, setOrderDetailData] = useState([]);

  const [outModalVis, setOutModalVis] = useState(false);
  const outForm = useRef();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDatas, setSelectedDatas] = useState([]);

  useEffect(() => {
    loadData(page, pageSize, { ...searchValue });
  }, []);

  const columns = [
    // {
    //   title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.outOrderNumber'),
    //   dataIndex: 'owNumber',
    //   key: 'owNumber',
    //   align: 'center',
    // },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.locationNumber'),
      dataIndex: 'locationNumber',
      key: 'locationNumber',
      align: 'center',
    },
    // {
    //   title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.orderCount'),
    //   dataIndex: 'orderCount',
    //   key: 'orderCount',
    //   align: 'center',
    //   render: (text, record, index) => {
    //     if (text == null) {
    //       return
    //     }
    //     const arr = record.orderNumber.split(',');
    //     const table = <div > <ul style={{ paddingLeft: 15, marginBottom: "0px" }}> {arr.map(item => <li key={item} >{item}</li>)} </ul> </div>
    //     return (
    //       <Tooltip placement="rightTop" title={table} arrowPointAtCenter>
    //         <span>{text}</span>
    //       </Tooltip>
    //     )
    //   }
    // },
    // {
    //   title: '生产订单号',
    //   dataIndex: 'orderNumber',
    //   key: 'orderNumber',
    //   align: 'center',
    // },
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      align: 'center',
    },
    {
      title: '子订单号',
      dataIndex: 'suborderNumber',
      key: 'suborderNumber',
      align: 'center',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      align: 'center',
    },
    {
      title: '产品代码',
      dataIndex: 'productCode',
      key: 'productCode',
      align: 'center',
    },
    {
      title: '产品数量(张)',
      dataIndex: 'productNum',
      key: 'productNum',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.attributeOne'),
      dataIndex: 'attributeOne',
      key: 'attributeOne',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.attributeTwo'),
      dataIndex: 'attributeTwo',
      key: 'attributeTwo',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.intime'),
      dataIndex: 'intime',
      key: 'intime',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.state'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      render: (text, record, index) => {
        // const dataSource = [
        //   { id: 1, trayNumber: 'J004004004004004004', location: 'J004', attributeTwo: 'J004', pickingPoint: 'J004', },
        // ]
        // const table = <div > <ul style={{ paddingLeft: 15, marginBottom: "0px" }}> {dataSource.map(item => <li key={item.id} >{item.trayNumber}</li>)} </ul> </div>

        if (text == 1) {
          return (
            // <Tooltip placement="rightTop" title={table} arrowPointAtCenter>
            <Tooltip placement="rightTop" arrowPointAtCenter>
              <span>{'已占用'}</span>
            </Tooltip>
          )
        }
        if (text == 2) {
          return (
            // <Tooltip placement="rightTop" title={table} arrowPointAtCenter>
            <Tooltip placement="rightTop" arrowPointAtCenter>
              <span>{'未占用'}</span>
            </Tooltip>
          )
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
      align: 'center',
    },
  ];

  //查询页面数据
  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    SemiFinisheDeliveryPalletSelectionServices
      .getByQuery({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setTableData(res.content);
        setTotalPage(res.totalElements);
        setPage(res.pageable.pageNumber + 1)
        setPageSize(res.pageable.pageSize)
        setSelectedRowKeys([])
        setSelectedDatas([])
        setTrayNumber()
        setOrderDetailData([])
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
    // loadData(p, s, { ...setSearchValue });
    loadData(p, s, { ...searchValue });
    setPageSize(s);
  };

  const pageChange = (p, s) => {
    // loadData(p, s, { ...setSearchValue });
    loadData(p, s, { ...searchValue });
    setPage(p);
  };

  //查询按钮
  const handleSearch = data => {
    const params = { ...data }

    if (params.creationTime && params.creationTime.length > 0) {
      params.startTime = moment(params.creationTime[0]).format(dateTime)
      params.endTime = moment(params.creationTime[1]).format(dateTime)
    }
    delete params.creationTime
    if( params.attributeOne != null){
      params.attributeOne = params.attributeOne.toString()
    }
    if( params.attributeOne == ""){
      delete params.attributeOne
    }
    
    setSearchValue({ ...params });
    setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params });
  };

  const { Table: TableL, SettingButton: SettingButtonL } = useMemo(
    () => CacheTable({ columns: columns, scrollHeight: 'calc(100vh - 470px)', key: 'PalletSelection_L' }),
    []
  );

  const onHandleTableSelect = e => {
    if (selectedRowKeys.indexOf(e.id) === -1) {
      setSelectedRowKeys([...selectedRowKeys, e.id])
      setSelectedDatas([...selectedDatas, e])
      setTrayNumber(e.trayNumber)
      setOrderDetailData(e.orderNumber.split(','))
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(i => i != e.id))
      setSelectedDatas(selectedDatas.filter(i => i.id != e.id))
      setTrayNumber()
      setOrderDetailData([])
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

  const handleOut = () => {
    // if (isEmpty(selectedRowKeys)) {
    //   notification.warning({
    //     message: getFormattedMsg('SemiFinisheDeliveryPalletSelection.message.trayNumber')
    //   })
    //   return
    // }
    setOutModalVis(true)
  }

  const handleCancelOut = () => {
    const { resetFields } = outForm.current;
    resetFields();
    setOutModalVis(false)
  }

  const modalOutFoot = () => [
    <Button key="save" type="primary" onClick={handleSaveOut}>
      {getFormattedMsg('SemiFinisheDeliveryPalletSelection.button.save')}
    </Button>,
    <Button key="cancel" onClick={handleCancelOut}>
      {getFormattedMsg('SemiFinisheDeliveryPalletSelection.button.cancel')}
    </Button>
  ]

  const handleSaveOut = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = outForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      console.log(params, 'params');
      // const data ={...params,selectedRowKeys}
      // console.log(data, 'data');

      SemiFinisheDeliveryPalletSelectionServices
        .outStore(params.readyMaterials, selectedRowKeys, params.dockingPoint)
        .then(res => {
          notification.success({
            message: '出库成功',
          });
          loadData(page, pageSize, { ...searchValue });
        })
        .catch(err => {
          setLoading(false);
          notification.warning({
            message: '出库失败',
            description: err.message
          });
        });

      handleCancelOut();
    })
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane height={'auto'}>
          <SearchForm onSearch={handleSearch}>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.orderNumber')}
              name="orderNumber"
            >
              <Input allowClear placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.orderNumber')} />
            </SearchForm.Item>
            <SearchForm.Item
              label={'子订单号'}
              name="suborderNumber"
            >
              <Input allowClear placeholder={'请输入子订单号'} />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.trayNumber')}
              name="trayNumber"
            >
              <Input allowClear placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.trayNumber')} />
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.attributeOne')}
              name="attributeOne"
            >
              <Select
                placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.attributeOne')}
                mode="multiple"
              >
                {attributeOne.map((value, index) => (
                  <Option value={value.value} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.attributeTwo')}
              name="attributeTwo"
              initialValue="切割完工"
            >
              <Select
                placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.attributeTwo')}
              >
                {attributeTwo.map((value, index) => (
                  <Option value={value.value} key={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={getFormattedMsg('SemiFinisheDeliveryPalletSelection.label.creationTime')}
              name="creationTime"
            >
              <RangePicker
                format={dateTime}
                showTime
                style={{ width: '100%' }}
              />
            </SearchForm.Item>
            <SearchForm.Item
              label={'备注'}
              name="description"
            >
              <Input allowClear placeholder={'请输入备注信息'} />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout layout="horizontal">
          <Pane
            icon={<i className="h-visions hv-table" />}
            title={'半成品库存'}
            // buttons={[
            //   <Button key="out" type="primary" onClick={() => handleOut()}>
            //     {getFormattedMsg('SemiFinisheDeliveryPalletSelection.button.out')}
            //   </Button>,
            // ]}
            settingButton={<SettingButtonL />}
            onRefresh={reFreshFunc()}
          >
            <Spin spinning={loading}>
              <TableL
                pagination={false}
                scroll={{ x: 'max-content' }}
                dataSource={tableData.map((i, idx) => ({
                  ...i,
                  serialNumber: (page - 1) * pageSize + ++idx
                }))}
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
          {/* <Pane
            title={getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.tray')+`${trayNumber == null ? '' : trayNumber}` +getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.relatedOrder') }
            // buttons={[
            //   <Input key="input" placeholder ={'请输入订单号'} style={{marginRight:10}}></Input>,
            //   <Button key="out" type="primary" onClick={() => handleSearchDetail()}>
            //     查询
            //   </Button>,
            // ]}
            width={'15%'}
          >
            <List
              dataSource={orderDetailData}
              renderItem={item => (
                <List.Item>
                  {item}
                </List.Item>
              )}
            />
          </Pane> */}
        </HVLayout>
      </HVLayout>
      <Modal
        title={getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.out')}
        visible={outModalVis}
        footer={modalOutFoot()}
        onCancel={handleCancelOut}
        destroyOnClose
        width={500}
      >
        <OutForm ref={outForm} selectedDatas={selectedDatas} />
      </Modal>
    </>
  );
};

export default SemiFinisheDeliveryPalletSelection;
