import React, { useEffect, useState, useMemo, useRef } from 'react';
// import uuid from 'uuid';
// import { v1 as uuid } from 'uuid';
import { v1 } from 'uuid';
import {
  HVLayout,
  Pagination,
  notification,
  Drawer,
  SearchForm,
  Button,
  Select,Input
} from '@hvisions/h-ui';
import { page, i18n } from '@hvisions/toolkit';
import StockStatisticsService from '~/api/stockStatistics';
import MaterialTable from './table';
import { debounce } from 'lodash';
import { CacheTable } from '~/components';
import MaterialService from '~/api/material';
import WaresLocationService from '~/api/waresLocation';
const getFormattedMsg = i18n.getFormattedMsg;
const { showTotal } = page;
const { Option } = Select;
const StockStatistics = () => {
  const [searchTerm, setSearchTerm] = useState({warehouseId:195});
  const [dataSource, setDataSource] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [modifyData, setModifyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 搜索模块
  const [materialOptions, setMaterialOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [wslOptions, setWslOptions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [searchTerm, pageInfo]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await StockStatisticsService.getMaterialStock({
        ...searchTerm,
        ...pageInfo,
        page: pageInfo.page - 1
      });
      //console.log(res,'getMaterialStock');
      const _cell = page.mergeCell(res.content, 'materialId');
      //console.log(_cell,'_cell');
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
        console.log(_ds,'_ds');
      setDataSource(_ds);
      setTotal(res.totalElements);
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
    setLoading(false);
  };

  const onSearch = values => {
    if(values.receiptCode == ''){
      delete values.receiptCode
    }
    if(values.specification == ''){
      delete values.specification
    }
    if(values.materialType == ''){
      delete values.materialType
    }
    
    setSearchTerm({...searchTerm,...values});
    setPageInfo({ ...pageInfo, page: 1 });
  };

  const onHandleChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
  };

  const columns = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      render: (_, row) => {
        return {
          children: row.materialCode,
          props: {
            rowSpan: row['materialId-rowSpan']
          }
        };
      },
      key: 'materialCode',
      width: 200,
      align: 'center',
      // fixed: 'left'
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      render: (_, row) => {
        return {
          children: row.materialName,
          props: {
            rowSpan: row['materialId-rowSpan']
          }
        };
      },
      key: 'materialName',
      width: 200,
      align: 'center',
      // fixed: 'left'
    },
    {
      title: '总数',
      dataIndex: 'count',
      render: (_, row) => {
        return {
          children: row.count,
          props: {
            rowSpan: row['materialId-rowSpan']
          }
        };
      },
      key: 'count',
      width: 120,
      align: 'center'
    },
    {
      title: '库位名称',
      dataIndex: 'locationName',
      key: 'locationName',
      width: 150,
      align: 'center'
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      align: 'center'
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
      width: 120,
      align: 'center'
    },
    {
      title: '材质',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 200,
      align: 'center'
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
      align: 'center'
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
      width: 120,
      align: 'center'
    },
    {
      title: '宽度',
      dataIndex: 'width',
      key: 'width',
      width: 120,
      align: 'center'
    },
    {
      title: '厚度',
      dataIndex: 'thickness',
      key: 'thickness',
      width: 120,
      align: 'center'
    },
    {
      title: '收料单号',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 200,
      align: 'center'
    },    
    {
      title: '托盘号',
      dataIndex: 'trayNumber',
      key: 'trayNumber',
      width: 200,
      align: 'center'
    },
    
    // {
    //   title: '操作',
    //   key: 'opt',
    //   fixed: 'right',
    //   render: (_, record) => [
    //     <a key="inStorage" onClick={() => onHandleDetail(record)}>
    //       详情
    //     </a>
    //   ],
    //   width: 80,
    //   align: 'center'
    // }
  ];
  const onHandleDetail = record => {
    setDetailVisible(true);
    setModifyData(record);
  };
  const handleCancelDetail = () => {
    setDetailVisible(false);
    setModifyData(null);
  };
  const { Table, SettingButton } = useMemo(
    () => CacheTable({ columns, key: 'wms_stock_statistics' }),
    []
  );

  const drawerFoot = () => [
    <Button key="cancel" onClick={handleCancelDetail}>
      {getFormattedMsg('global.btn.close')}
    </Button>,
  ];

  // 搜索模块
  useEffect(() => {
    loadMaterialData();
    loadWaresLocationData();

    handleSearchLocation()
  }, []);

  const loadMaterialData = async value => {
    // const res = await MaterialService.getMaterial(value);
    const res = await MaterialService.getMaterialOld(value);
    setMaterialOptions(res.content);
  };

  const loadWaresLocationData = async () => {
    const res = await WaresLocationService.findAllByQuery();
    setWslOptions(res);
    setWarehouseOptions(res.filter(_r => _r.parentId === 0));
    // setLocationOptions(res.filter(_w => _w.parentId === 195));
  };
  const onChange = debounce(value => {
    loadMaterialData(value);
  }, 500);

  const onWsChange = value => {
    searchRef?.current?.setFieldsValue({ locationId: undefined });
    setLocationOptions(wslOptions.filter(_w => _w.parentId === value));
  };

  const handleSearchLocation = async (param) => {
    const params = {
      code: param,
      pageSize: 10,
      page: 0,
      parentId:195,
    }
    await WaresLocationService.getLocationByQuery(params).then(res => {
      setLocationOptions(res.content)
    }).catch(err => {
      notification.warning({
        description: err.message
      });
    })
  }

  return (
    <>
      <HVLayout>
        <HVLayout.Pane style={{ overflow: 'hidden' }} height="auto">
          <SearchForm onSearch={onSearch} ref={searchRef}>
            <SearchForm.Item
              label={getFormattedMsg('stockOverview.label.material')}
              name="materialId"
            >
              <Select
                showSearch
                allowClear
                filterOption={false}
                placeholder={getFormattedMsg('stockOverview.validate.material')}
                onSearch={onChange}
              >
                {materialOptions.map(m => (
                  <Option value={m.id} key={m.id}>
                    {m.materialName}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            {/* <SearchForm.Item
              label={getFormattedMsg('stockOverview.label.storage')}
              name="warehouseId"
              initialValue = {195}
            >
              <Select
                // disabled={true}
                allowClear
                placeholder={getFormattedMsg('stockOverview.validate.storage')}
                onChange={onWsChange}
              >
                {warehouseOptions.map(m => (
                  <Option value={m.id} key={m.id}>
                    {m.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item> */}
            <SearchForm.Item
              label={getFormattedMsg('stockOverview.label.location')}
              name="locationId"
              
            >
              <Select 
              onSearch={handleSearchLocation}
              showSearch
              filterOption={false}
              allowClear placeholder={getFormattedMsg('stockOverview.validate.location')}>
                {locationOptions.map(m => (
                  <Option value={m.id} key={m.id}>
                    {m.name}
                  </Option>
                ))}
              </Select>
            </SearchForm.Item>
            <SearchForm.Item
              label={'材质'}
              name="materialType"
            >
              <Input allowClear placeholder={'请输入材质信息'} />
            </SearchForm.Item>
            <SearchForm.Item
              label={'规格'}
              name="specification"
            >
              <Input allowClear placeholder={'请输入规格信息'} />
            </SearchForm.Item>
            <SearchForm.Item
              label={'收料单号'}
              name="receiptCode"
            >
              <Input allowClear placeholder={'请输入收料单号'} />
            </SearchForm.Item>
          </SearchForm>
        </HVLayout.Pane>
        <HVLayout.Pane
          icon={<i className="h-visions hv-table" />}
          title="库存查询"
          settingButton={<SettingButton />}
          onRefresh={loadData}
        >
          <Table
            loading={loading}
            scroll={{ x: 'max-content' }}
            rowKey={record => record.uuid}
            // dataSource={dataSource.map((i, idx) => ({
            //   ...i,
            //   serialNumber: (pageInfo.page - 1) * pageInfo.pageSize + ++idx
            // }))}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            noIndex
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
      <Drawer placement="bottom" height={600} title="详情页" visible={detailVisible} onClose={handleCancelDetail}
        destroyOnClose
        >
        <Drawer.DrawerContent>
          <MaterialTable modifyData={modifyData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{drawerFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};

export default StockStatistics;
