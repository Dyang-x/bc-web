import React, { useState, useEffect, useRef } from 'react';
import { HVLayout, Table, Pagination, notification, Form, Input, Select,Checkbox, DatePicker, Divider, InputNumber, Cascader } from '@hvisions/h-ui'
import {  page,i18n } from '@hvisions/toolkit';
import TransferBoxServices from '~/api/TransferBox';
import {sortPositions } from '~/enum/enum';

const { getFormattedMsg } = i18n;
const { showTotal } = page
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const PickTrayTable = ({
  selectedRowKeys, setSelectedRowKeys,setSelectedDatas,modalPickTrayFoot
}) => {

  const [materialList, setMaterialList] = useState([])

  const [searchValue, setSearchValue] = useState({type: 0});
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.trayNumber'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.location'),
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: getFormattedMsg('SemiFinishedWarehousingReceipt.title.attributeTwo'),
      dataIndex: 'attributeTwo',
      key: 'attributeTwo',
      align: 'center',
    },
    {
      title: '原捡料点',
      dataIndex: 'sortPosition',
      key: 'sortPosition',
      align: 'center',
      render: (text, record, index) => {
        if(text == null){
          return
        }
          return sortPositions[text - 1].name
      }
    },
  ]
  
  useEffect(() => {
    //查询  接口 在 托盘管理  半成品
    loadData(pageInfo.page, pageInfo.pageSize, { type: 1 });
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

  const onHandleChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
    loadData(page, pageSize, { type: 1 });
  };

  const onHandleTableSelect = e => {
    setSelectedRowKeys([e.id])
    setSelectedDatas([e])
  };

  const PickTrayData = async (page, pageSize, searchValue) => {

    console.log({ ...searchValue, page: page - 1, pageSize });
    await TransferBoxServices.getPage({ ...searchValue, page: page - 1, pageSize })
      .then(res => {
        setDataSource(res.content);
        // setTotal(res.totalElements);
        // const pageInfos = {
        //   page: res.pageable.pageNumber + 1,
        //   pageSize: res.pageable.pageSize
        // }
        // setPageInfo(pageInfos)
      }).catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail'),
          description: err.message
        });
      });
  };

  const rowSelection = {
    hideDefaultSelections: false,
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      setSelectedDatas([record])
    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
      
    }
  };

  const onRowClick = record => {
    setSelectedRowKeys([record.id]);
    setSelectedDatas([record])
  };

  return (
    <HVLayout >
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

export default PickTrayTable
