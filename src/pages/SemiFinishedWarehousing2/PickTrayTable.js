import React, { useState, useEffect, useRef } from 'react';
import { HVLayout, Table, Pagination, notification, Form, Input, Select, Tooltip, SearchForm, Divider, InputNumber, Button } from '@hvisions/h-ui'
import { page, i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';
import { sortPositions } from '~/enum/enum';
import SemiFinisheDeliveryPalletSelectionServices from '~/api/SemiFinisheDeliveryPalletSelection';
import style from './style.scss'

const { getFormattedMsg } = i18n;
const { showTotal } = page
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PickTrayTable = ({
  selectedRowKeys, setSelectedRowKeys, setSelectedDatas, modalPickTrayFoot
}) => {

  const [searchValue, setSearchValue] = useState({
    // cuttingName: "切割机2",
    attributeTwo: '切割未完工'
  });
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [orderNumber, setOrderNumber] = useState('');


  const columns = [
    {
      // title: '订单号',
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.label.orderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinisheDeliveryPalletSelection.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      align: 'center',
    },
    {
      // title: '产品名称',
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.label.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
    {
      // title: '产品代码',
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.label.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      align: 'center',
    },
    {
      // title: '产品数量(张)',
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.label.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
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
      // title: '备注',
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.label.desc'),
      dataIndex: 'desc',
      key: 'desc',
      align: 'center',
    },
  ]


  useEffect(() => {
    loadData(page, pageSize, searchValue);
  }, [])

  const loadData = async (page, pageSize, searchValue) => {
    setLoading(true);
    SemiFinisheDeliveryPalletSelectionServices
      .getByQuery({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setDataSource(res.content);
        setTotal(res.totalElements);
        setPage(res.pageable.pageNumber + 1)
        setPageSize(res.pageable.pageSize)
      })
      .catch(err => {
        setLoading(false);
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
    // //console.log({ ...searchValue, page: page - 1, pageSize });
    // await TransferBoxServices.getPage({ ...searchValue, page: page - 1, pageSize })
    //   .then(res => {
    //     setDataSource(res.content);
    //     setTotal(res.totalElements);
    //     const pageInfos = {
    //       page: res.pageable.pageNumber + 1,
    //       pageSize: res.pageable.pageSize
    //     }
    //     setPageInfo(pageInfos)
    //   }).catch(err => {
    //     notification.warning({
    //       message: getFormattedMsg('global.notify.fail'),
    //       description: err.message
    //     });
    //   });
    setLoading(false);
  };

  //查询按钮
  const handleSearch = () => {
    const params = { ...searchValue }
    if (params.orderNumber != null) {
      delete params.orderNumber
    }
    if (orderNumber != '') {
      params.orderNumber = orderNumber
    }
    //console.log(params, 'params');

    setSearchValue({ ...params});
    // setPage(1);
    setPageSize(10);
    loadData(1, 10, { ...params});
  };

  const onHandleChange = (page, pageSize) => {
    loadData(page, pageSize, { ...searchValue });
    setPage(page);
  };

  const onHandleTableSelect = e => {
    setSelectedRowKeys([e.id])
    setSelectedDatas([e])
  };

  return (
    <HVLayout >
      <HVLayout.Pane height={'auto'}>
            <Input 
            allowClear 
            placeholder={getFormattedMsg('SemiFinisheDeliveryPalletSelection.placeholder.orderNumber')} 
            onChange={e=>{setOrderNumber(e.target.value)}}
            style={{width:'25rem'}}
            />
            {/* <Button onClick={handleSearch} style={{margin:'0px 30px'}} type='primary'>查询</Button> */}
            <Button onClick={handleSearch} style={{margin:'0px 30px'}} type='primary'>{getFormattedMsg('SemiFinishedWarehousingReceipt.button.searchB')}</Button>
      </HVLayout.Pane>
      <HVLayout.Pane
        title={getFormattedMsg('SemiFinishedWarehousingReceipt.button.pickTray')}
        buttons={modalPickTrayFoot()}
      >
        <Table
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={{
            type: 'radio',
            onSelect: onHandleTableSelect,
            selectedRowKeys: selectedRowKeys,
            hideDefaultSelections: true,
          }}
          onRow={record => {
            return {
              onClick: () => onHandleTableSelect(record)
            };
          }}
        />
        <HVLayout.Pane.BottomBar>
          <Pagination
            // current={pageInfo.page}
            current={page}
            // pageSize={pageInfo.pageSize}
            pageSize={pageSize}
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
  )
}

export default PickTrayTable
