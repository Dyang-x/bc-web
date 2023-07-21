import React from 'react';
import { Page, createBlock } from '@needle/kernel';
import {
  Cascader,
  notification,
  Input,
  Select,
  DatePicker,
  Spin,
  Pagination
} from '@hvisions/h-ui';
import { i18n, page } from '@hvisions/toolkit';
import { TBLayout, TableBlock, SearchBlock } from '@needle/block';
import materialService from '~/api/material';
import { CacheTable } from '~/components';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import waresLocationService from '~/api/waresLocation';
import stockService from '~/api/stock';

const tableBlock = createBlock(TableBlock);
const searchBlock = createBlock(SearchBlock);

const { RangePicker } = DatePicker;
const getFormattedMsg = i18n.getFormattedMsg;
let layout;

export default class StockLog extends Page {
  constructor(props) {
    super(TBLayout, props, {});
    this.lastFetchId = 0;
    this.materialSearch = debounce(this.materialSearch, 500);
  }

  state = {
    searchData: {},
    pageInfo: { page: 1, size: 10 },
    data: [],
    fetching: false,
    options: [],
    tableData: [],
    tableTotal: 0,
    loading: false
  };

  created() {
    layout = this.getLayout();
    layout.setBlock('top', searchBlock);
    const tableCols = [
      {
        title: getFormattedMsg('stock.label.materialCode'),
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 150,
        fixed: 'left'
      },
      {
        title: getFormattedMsg('deliver.label.materialBatchNum'),
        dataIndex: 'materialBatchNum',
        key: 'materialBatchNum',
        width: 200
      },
      {
        title: getFormattedMsg('stock.label.materialName'),
        dataIndex: 'materialName',
        key: 'materialName',
        width: 200
      },
      {
        title: getFormattedMsg('stock.label.quantity'),
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
        width: 100
      },
      {
        title: getFormattedMsg('stock.label.unit'),
        dataIndex: 'unitName',
        align: 'center',
        key: 'unitName',
        width: 100
      },
      // {
      //   title: getFormattedMsg('stockLog.label.locationCode'),
      //   dataIndex: 'locationCode',
      //   key: 'locationCode'
      // },
      {
        title: getFormattedMsg('locationWarning.label.locationName'),
        dataIndex: 'locationName',
        key: 'locationName',
        width: 160
      },
      {
        title: getFormattedMsg('stockLog.label.operation'),
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 160
      },
      {
        title: getFormattedMsg('stockLog.label.orderCode'),
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: 200
      },
      {
        title: getFormattedMsg('stockLog.label.time'),
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        width: 170
      },
      {
        title: getFormattedMsg('stockLog.label.description'),
        dataIndex: 'description',
        key: 'description',
        minWidth: 200
      },
      {
        title: getFormattedMsg('stockLog.label.operator'),
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 100,
        fixed: 'right'
      }
    ];

    const { Table, SettingButton } = CacheTable({
      columns: tableCols,
      scrollHeight: 'calc( 100vh - 480px )',
      key: 'wms_stock_log'
    });

    layout.setNode('bottom', () => (
      <Table
        dataSource={this.state.tableData.map((i, idx) => ({
          ...i,
          serialNumber: (this.state.pageInfo.page - 1) * this.state.pageInfo.size + ++idx
        }))}
        loading={this.state.loading}
        rowKey="id"
        columns={tableCols}
        scroll={{ x: 'max-content' }}
      />
    ));
    layout.setOptions({
      top: { height: 'auto' },
      bottom: {
        title: getFormattedMsg('stockLog.label.LogList'),
        icon: <i className="h-visions hv-table" />,
        settingButton: <SettingButton />,
        onRefresh: this.loadData,
        bottomBar: () => (
          <Pagination
            showQuickJumper
            showSizeChanger
            current={this.state.pageInfo.page}
            pageSize={this.state.pageInfo.size}
            total={this.state.tableTotal}
            size="small"
            onShowSizeChange={this.onHandlePaginationChange}
            onChange={this.onHandlePaginationChange}
            showTotal={page.showTotal}
          />
        )
      }
    });
    searchBlock.setConfig({
      formItems: [
        {
          label: getFormattedMsg('stockLog.label.meterial_'),
          component: () => (
            <Select
              allowClear
              placeholder={getFormattedMsg('stock.validate.placeholderForMaterial')}
              showSearch
              onSearch={this.materialSearch}
              notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
              filterOption={false}
            >
              {this.state.data.map(d => (
                <Select.Option key={d.value} value={d.value}>
                  {d.text}
                </Select.Option>
              ))}
            </Select>
          ),
          key: 'materialId'
        },
        {
          label: getFormattedMsg('freeze.label.stock'),
          component: () => (
            <Cascader
              style={{ width: '100%' }}
              options={this.state.options}
              loadData={this.loadTreeSelectData}
              placeholder={getFormattedMsg('freeze.validate.placeholderForOrderStock')}
              changeOnSelect
            />
          ),
          key: 'locationId'
        },
        {
          label: getFormattedMsg('stockLog.label.operation'),
          component: (
            <Input
              placeholder={getFormattedMsg('stockLog.validate.placeholderForOperation')}
              allowClear
            />
          ),
          key: 'operation'
        },
        {
          label: getFormattedMsg('stockLog.label.orderCode'),
          component: (
            <Input placeholder={getFormattedMsg('stockLog.validate.orderCode')} allowClear />
          ),
          key: 'orderCode'
        },
        {
          label: getFormattedMsg('stockLog.label.time'),
          component: <RangePicker style={{ width: '100%' }} showTime allowClear />,
          key: 'time'
        }
      ]
    });
  }

  loadTreeSelectData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    await waresLocationService
      .getLocationByQuery({ pageSize: 100000, parentId: targetOption.value })
      .then(result => {
        if (isEmpty(result.content)) {
          targetOption.isLeaf = true;
        } else {
          targetOption.loading = false;
          // targetOption.children = result.content.map(i => ({
          //   label: i.code,
          //   value: i.id,
          //   isLeaf: false
          // }));
          targetOption.children = result.content.map(i => ({
            label: i.name,
            value: i.id,
            isLeaf: false
          }));
        }
        targetOption.loading = false;
      });
    await this.setState({
      options: [...this.state.options]
    });
  };

  loadTreeData = async (parentId = 0) => {
    await waresLocationService.getLocationByQuery({ pageSize: 100000, parentId }).then(result => {
      this.setState({
        // options: result.content.map(i => ({
        //   label: i.code,
        //   value: i.id,
        //   isLeaf: false
        // }))
        options: result.content.map(i => ({
          label: i.name,
          value: i.id,
          isLeaf: false
        }))        
      });
    });
  };

  loadData = async () => {
    const { searchData, pageInfo } = this.state;
    this.setState({ loading: true });
    await stockService
      .getHistoryByQuery({ ...searchData, page: pageInfo.page - 1, pageSize: pageInfo.size })
      .then(result => {
        this.setState({ tableData: result.content, tableTotal: result.totalElements });
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
    this.setState({ loading: false });
  };

  mounted() {
    this.loadData();
    this.materialSearch('');
    this.loadTreeData();
    this.event();
  }

  onHandleSearch = values => {
    if (values.time !== undefined && !isEmpty(values.time)) {
      values.beginDate = moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
      values.endDate = moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
      delete values.beginDate;
      delete values.endDate;
    }
    delete values.time;
    if (values.locationId) {
      values.locationId = values.locationId[values.locationId.length - 1];
    } else {
      delete values.locationId;
    }
    this.setState({ searchData: values, pageInfo: { page: 1, size: 10 } }, this.loadData);
  };

  materialSearch = async value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    // await materialService.getMaterial(value, null).then(res => {
      await materialService.getMaterialOld(value, null).then(res => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const data = res.content.map(i => ({
        text: `${i.materialCode} ${i.materialName}`,
        value: i.id
      }));
      this.setState({ data, fetching: false });
    });
  };

  onHandlePaginationChange = (page, size) => {
    this.setState({ pageInfo: { page, size } }, this.loadData);
  };

  event() {
    this.on('onSearch', this.onHandleSearch);
  }

  beforeDestroy() {
    this.off('onSearch', this.onHandleSearch);
  }
}
