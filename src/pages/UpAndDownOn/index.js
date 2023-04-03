import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HVLayout, notification, Select, Button, Pagination, Modal } from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import { CacheTable } from '~/components';
import CardItem from './CardItem/CardItem';
import TransferBoxServices from '~/api/TransferBox';

const getFormattedMsg = i18n.getFormattedMsg;
const { showTotal } = page
const PalletManagement = () => {
  const processType = [
    { id: 0, name: '上料', value: '上料', },
    { id: 1, name: '下料', value: '下料', }
  ]
  const [searchValue, setSearchValue] = useState({});
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [selectedType, setSelectedType] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedDatas, setSelectedDatas] = useState([]);
  const [processTypeList, setProcessTypeList] = useState(processType);

  useEffect(() => {

  }, []);

  const columns = [
    {
      title: getFormattedMsg('UpAndDown.title.station'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.cuttingMachine'),
      dataIndex: 'locationName',
      key: 'locationName',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.trayNumber'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.status'),
      dataIndex: 'location',
      key: 'location',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.whether'),
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: getFormattedMsg('UpAndDown.title.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      align: 'center',
    },
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

  //刷新按钮
  const reFreshFunc = () => {
    const pageInfos = {
      page: 1,
      pageSize: 10
    }
    setPageInfo(pageInfos)
    loadData(pageInfos.page, pageInfos.pageSize, searchValue);
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

  const handleChooseProcessType = record => {
    console.log('record', record);
    const type = record.id;
    setSelectedType(type)
    setSearchValue({type: type })
    loadData(pageInfo.page, pageInfo.pageSize, { type: type });
  }

  const handleClear = record => {
    Modal.confirm({
      title: `${getFormattedMsg('UpAndDown.title.clear')}`,
      okType: 'danger',
      onOk: async () => {
        notification.warning({ message: '接口' })
      }
    });
  };

  return (
    <>
      <HVLayout layout="horizontal">
        <HVLayout.Pane
          title={getFormattedMsg('UpAndDown.title.processType')}
          width={200}
        >
          <CardItem dataArr={processTypeList} handleSubmitChooseItem={handleChooseProcessType} />
        </HVLayout.Pane>
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title={getFormattedMsg('UpAndDown.title.processDetails')}
            buttons={[
              <Button
                key="clear"
                type="primary"
                onClick={handleClear}
              >
                {getFormattedMsg('UpAndDown.button.clear')}
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
    </>
  );
};

export default PalletManagement;
