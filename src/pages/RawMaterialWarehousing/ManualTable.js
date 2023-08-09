import React, { useState, useEffect } from 'react';
import { Table, notification, HVLayout, Pagination } from '@hvisions/h-ui'
import { page, i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';
import StockStatisticsService from '~/api/stockStatistics';
import { v1 } from 'uuid';

const { getFormattedMsg } = i18n;
const { showTotal } = page

const ManualTable = ({
  selectedRowKeys, setSelectedRowKeys, setSelectedDatas, modalManualFoot
}) => {
  const [searchValue, setSearchValue] = useState({ type: 0 });
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // const columns = [
  //   {
  //     title: getFormattedMsg('PalletManagementStockLevel.title.trayNumber'),
  //     dataIndex: 'code',
  //     key: 'code',
  //     align: 'center',
  //   },
  //   // {
  //   //   title: getFormattedMsg('PalletManagementStockLevel.title.taskStatus'),
  //   //   dataIndex: 'taskStatus',
  //   //   key: 'taskStatus',
  //   //   align: 'center',
  //   // },
  //   {
  //     title: getFormattedMsg('PalletManagement.title.location'),
  //     dataIndex: 'location',
  //     key: 'location',
  //     align: 'center',
  //   },
  //   {
  //     title: getFormattedMsg('PalletManagementStockLevel.title.palletStatus'),
  //     dataIndex: 'state',
  //     key: 'state',
  //     align: 'center',
  //   },
  // ]
  const columns = [
    {
      // title: '托盘号',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.trayNumber'),
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      width: 120,
      align: 'center'
    },
    {
      // title: '物料名称',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      width: 120,
      align: 'center',
    },
    {
      // title: '库位名称',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.locationName'),
      dataIndex: 'locationName',
      key: 'locationName',
      width: 120,
      align: 'center'
    },
    {
      // title: '库存数量',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center'
    },
    {
      // title: '状态',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.state'),
      dataIndex: 'state',
      key: 'state',
      width: 120,
      align: 'center'
    },
    {
      // title: '单位',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.unitName'),
      dataIndex: 'unitName',
      key: 'unitName',
      width: 120,
      align: 'center'
    },
    {
      // title: '材质',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.materialType'),
      dataIndex: 'materialType',
      key: 'materialType',
      width: 200,
      align: 'center'
    },
    {
      // title: '规格',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.specification'),
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
      align: 'center'
    },
    {
      // title: '长度',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.length'),
      dataIndex: 'length',
      key: 'length',
      width: 120,
      align: 'center'
    },
    {
      // title: '宽度',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.width'),
      dataIndex: 'width',
      key: 'width',
      width: 120,
      align: 'center'
    },
    {
      // title: '厚度',
      title: getFormattedMsg('RawMaterialWarehousingReceipt.title.thickness'),
      dataIndex: 'thickness',
      key: 'thickness',
      width: 120,
      align: 'center'
    },
  ]

  // useEffect(() => {
  // loadData(pageInfo.page, pageInfo.pageSize, { type: 0 });
  // }, [])

  useEffect(() => {
    loadData();
  }, [pageInfo]);

  // const loadData = async (page, pageSize, searchValue) => {
  //   setLoading(true);
  //   //console.log({ ...searchValue, page: page - 1, pageSize });
  //   await TransferBoxServices.getPage({ ...searchValue, page: page - 1, pageSize })
  //     .then(res => {
  //       setDataSource(res.content);
  //       setTotal(res.totalElements);
  //       const pageInfos = {
  //         page: res.pageable.pageNumber + 1,
  //         pageSize: res.pageable.pageSize
  //       }
  //       setPageInfo(pageInfos)
  //     }).catch(err => {
  //       notification.warning({
  //         message: getFormattedMsg('global.notify.fail'),
  //         description: err.message
  //       });
  //     });
  //   setLoading(false);
  // };

  const loadData = async () => {
    const searchTerm = { warehouseId: 195 }
    setLoading(true);
    const res = await StockStatisticsService.getMaterialStock({
      ...searchTerm,
      ...pageInfo,
      page: pageInfo.page - 1
    });
    const _cell = page.mergeCell(res.content, 'materialId');
    const _ds = _cell
      .map(__c => {
        const count = __c.reduce((_p, _c) => _p + _c.quantity, 0);
        return __c.map(_temp => ({
          ..._temp,
          uuid: v1(),
          count
        }));
      })
      .flat(1);
    //console.log(_ds, '_ds');
    setDataSource(_ds);
    setTotal(res.totalElements);

    setLoading(false);
  };

  // const onHandleChange = (page, pageSize) => {
  //   setPageInfo({ page, pageSize });
  //   loadData(page, pageSize, { type: 0 });
  // };
  const onHandleChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
  };

  const onHandleTableSelect = e => {
    setSelectedRowKeys([e.uuid])
    setSelectedDatas([e])
  };

  return (
    <HVLayout >
      <HVLayout.Pane
        title={getFormattedMsg('RawMaterialWarehousingReceipt.title.manual')}
        buttons={modalManualFoot()}
      >
        <Table
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record.uuid}
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
  )
}

export default ManualTable
