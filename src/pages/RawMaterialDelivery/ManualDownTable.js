import React, { useState, useEffect } from 'react';
import { Table, notification, HVLayout, Pagination, Radio } from '@hvisions/h-ui'
import { page, i18n } from '@hvisions/toolkit';
import stockService from '~/api/stock';
import LineEdgeLibraryApi from '~/api/LineEdgeLibraryController';

const { getFormattedMsg } = i18n;
const { showTotal } = page

const ManualDownTable = ({
  ManualDownData, ManualDownSelected,
  setManualDownSelected, modalManualDownFoot
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [tableData, setTableData] = useState([]);

  const [defaultLine, setDefaultLine] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: getFormattedMsg('stock.label.locationName'),
      dataIndex: 'locationDescription',
    },
    {
      title: getFormattedMsg('stock.label.materialBatchNum'),
      dataIndex: 'materialBatchNum',
    },
    {
      title: getFormattedMsg('stock.label.preMaterialBatchNum'),
      dataIndex: 'preMaterialBatchNum',
    },
    {
      title: getFormattedMsg('stock.label.materialCode'),
      dataIndex: 'materialCode',
    },
    {
      title: getFormattedMsg('stock.label.materialName'),
      dataIndex: 'materialName',
    },
    {
      title: getFormattedMsg('stock.label.unit'),
      dataIndex: 'unitName',
    },
    {
      title: getFormattedMsg('stock.label.quantity'),
      dataIndex: 'quantity',
    },
    {
      title: getFormattedMsg('stock.label.frozen'),
      dataIndex: 'frozen',
      render: (text) => <div>{text ? "冻结" : "正常"}</div>
    },
    {
      title: getFormattedMsg('stock.label.occupied'),
      dataIndex: 'usedCount',
    }
  ]

  useEffect(() => {
    loadData(pageInfo.page, pageInfo.pageSize, ManualDownData.cuttingMachine);
    // loadData(pageInfo.page, pageInfo.pageSize);
    // loadData_({ cuttingMachine: ManualDownData.cuttingMachine })
    console.log(ManualDownSelected, 'ManualDownSelected');
  }, [ManualDownData])

  const loadData = async (page, pageSize, cuttingMachine) => {

    let stockId = 0
    let lineId = 0

    setLoading(true);
    await stockService
      .getAllByQuery({
        page: page - 1,
        pageSize,
        locationId: 195
      })
      .then(res => {
        setDataSource(res.content);
        setTotal(res.totalElements);
        const pageInfos = {
          page: res.pageable.pageNumber + 1,
          pageSize: res.pageable.pageSize
        }
        setPageInfo(pageInfos)
        const data = res.content[0].id
        console.log(data, 'data');
        setSelectedRowKeys([data])
        stockId = data
        // setManualDownSelected({ ...ManualDownSelected, stockId: data })
      })
      .catch(err => {
        notification.warning({
          message: err.message
        });
      });
    setLoading(false);

    await LineEdgeLibraryApi.getByQuery({ cuttingMachine: cuttingMachine })
      .then(res => {
        setTableData(res);
        console.log(res[0].id, typeof res[0].id, 'res[0].id');
        const data = res[0].id
        setDefaultLine(data)
        lineId = data
        // setManualDownSelected({ ...ManualDownSelected, lineId: res[0].id })
      })
      .catch(err => {
        setLoading(false);
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
      console.log('{ stockId: stockId, lineId: lineId }',{ stockId: stockId, lineId: lineId });
    setManualDownSelected({ stockId: stockId, lineId: lineId })
  }


  // const loadData = async (page, pageSize) => {
  //   console.log(ManualDownSelected, 'ManualDownSelected11');
  //   setLoading(true);
  //   await stockService
  //     .getAllByQuery({
  //       page: page - 1,
  //       pageSize,
  //       locationId: 195
  //     })
  //     .then(res => {
  //       setDataSource(res.content);
  //       setTotal(res.totalElements);
  //       const pageInfos = {
  //         page: res.pageable.pageNumber + 1,
  //         pageSize: res.pageable.pageSize
  //       }
  //       setPageInfo(pageInfos)
  //       const data =res.content[0].id
  //       console.log(data, 'data');
  //       setSelectedRowKeys([data])
  //       setManualDownSelected({ ...ManualDownSelected, stockId: data })
  //     })
  //     .catch(err => {
  //       notification.warning({
  //         message: err.message
  //       });
  //     });
  //   setLoading(false);
  // };

  // const loadData_ = async (searchValue) => {
  //   console.log(ManualDownSelected, 'ManualDownSelected22');
  //   LineEdgeLibraryApi.getByQuery({ ...searchValue })
  //     .then(res => {
  //       setTableData(res);
  //       console.log(res[0].id,typeof res[0].id , 'res[0].id');
  //       setDefaultLine(res[0].id)
  //       setManualDownSelected({ ...ManualDownSelected, lineId: res[0].id })

  //     })
  //     .catch(err => {
  //       setLoading(false);
  //       notification.warning({
  //         message: getFormattedMsg('global.notify.fail'),
  //         description: err.message
  //       });
  //     });
  // };

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
    // setManualDownSelected(e)
    console.log('库存id e.id', e.id);
    setManualDownSelected({ ...ManualDownSelected, stockId: e.id })
    setSelectedRowKeys([e.id])
  };

  return (
    <HVLayout >
      <HVLayout.Pane
        title={'手动下架'}
        buttons={modalManualDownFoot()}
      >
        <HVLayout.Pane
          title={'线边库选择'}
        >
          <Radio.Group
            onChange={(e) => {
              console.log('线边库id e.target.value', e.target.value);
              setManualDownSelected({ ...ManualDownSelected, lineId: e.target.value })
              setDefaultLine(e.target.value)
            }}
            value={defaultLine}
          >
            {tableData.map(i => {
              return <Radio key={i.id} value={i.id}>{i.toLocation}</Radio>
            })}
          </Radio.Group>
        </HVLayout.Pane>
        <HVLayout.Pane
          title={'库存选择'}
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
              hideDefaultSelections: true,
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
      </HVLayout.Pane>
    </HVLayout>
  )
}

export default ManualDownTable
