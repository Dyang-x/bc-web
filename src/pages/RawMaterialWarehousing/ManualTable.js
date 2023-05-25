import React, { useState, useEffect } from 'react';
import { Table,notification,HVLayout, Pagination } from '@hvisions/h-ui'
import {  page,i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';

const { getFormattedMsg } = i18n;
const { showTotal } = page

const ManualTable = ({
  selectedRowKeys, setSelectedRowKeys,setSelectedDatas,modalManualFoot
}) => {
  const [searchValue, setSearchValue] = useState({type: 0});
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.trayNumber'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.taskStatus'),
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      align: 'center',
    },
    {
      title: getFormattedMsg('PalletManagementStockLevel.title.palletStatus'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
    },
  ]

  useEffect(() => {
    loadData(pageInfo.page, pageInfo.pageSize, { type: 0 });
  }, [])

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

  // const rowSelection = {
  //   hideDefaultSelections: false,
  //   type: 'radio',
  //   onSelect: (record, selected, selectedRows, nativeEvent) => {

  //   },
  //   selectedRowKeys,
  //   onChange: selectedRowKeys => {
  //     setSelectedRowKeys(selectedRowKeys);
  //   }
  // };

  // const onRowClick = record => {
  //   setSelectedRowKeys([record.id]);
  // };

  const onHandleChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
    loadData(page, pageSize, { type: 0 });
  };

  const onHandleTableSelect = e => {
    setSelectedRowKeys([e.id])
    setSelectedDatas([e])
  };

  return (
    <HVLayout >
          <HVLayout.Pane
          title={getFormattedMsg('RawMaterialWarehousingReceipt.title.manual')}
          buttons={modalManualFoot()}
            // buttons={[
              // <Button
              //   key="printLabel"
              //   // h-icon="add"
              //   type="primary"
              //   onClick={printLabel}
              // >
              //   {getFormattedMsg('PalletManagement.button.printLabel')}
              // </Button>,
              // <Button
              //   key="printBarcodes"
              //   // h-icon="add"
              //   type="primary"
              //   onClick={printBarcodes}
              // >
              //   {getFormattedMsg('PalletManagement.button.printBarcodes')}
              // </Button>,
              // <Button
              //   key="add"
              //   h-icon="add"
              //   type="primary"
              //   onClick={handleCreate}
              // >
              //   {getFormattedMsg('PalletManagement.button.add')}
              // </Button>
            // ]}
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
  //   <Table
  //   pagination={false}
  //   scroll={{ x: 'max-content' }}
  //   dataSource={dataSource}
  //   columns={columns}
  //   rowKey={record => record.id}
  //   rowSelection={rowSelection}
  //   onRow={record => {
  //     return {
  //       onClick: () => {
  //         onRowClick(record);
  //       }
  //     };
  //   }}
  // />
  )
}

export default ManualTable
