import React from 'react';
import { Page, createBlock } from '@needle/kernel';
import { TBLayout, SearchBlock } from '@needle/block';
import {
  Input,
  Select,
  Button,
  Divider,
  DatePicker,
  notification,
  Modal,
  Pagination,
  Badge,
} from '@hvisions/h-ui';
import { withPermission } from '@hvisions/core';
import { CacheTable } from '~/components';
import { i18n, page } from '@hvisions/toolkit';
import { isEmpty } from 'lodash';
import adjustService from '~/api/adjust';

const { RangePicker } = DatePicker;
const { Option } = Select;
const getFormattedMsg = i18n.getFormattedMsg;
const searchBlock = createBlock(SearchBlock);
let layout;
const CreateButton = withPermission(Button, 'CREATE');
const DeleteButton = withPermission('a', 'DELETE');

const color = {
  新建: 'processing',
  完成: 'success'
};

export default class Adjust extends Page {
  constructor(props) {
    super(TBLayout, props, {});
  }
  state = {
    searchItem: {},
    pageInfo: { page: 1, size: 10 },
    tableData: [],
    tableTotal: 0,
    loading: false
  };
  created() {
    layout = this.getLayout();
    const tableCols = [
      {
        title: getFormattedMsg('wms.label.code'),
        dataIndex: 'code',
        key: 'code',
        width: 200
      },
      {
        title: getFormattedMsg('wms.label.status'),
        dataIndex: 'state',
        align: 'center',
        width: 100,
        render: e => <Badge status={color[e]} text={e || ''} />,
        key: 'state'
      },
      {
        title: getFormattedMsg('wms.label.adjustTime'),
        dataIndex: 'completeTime',
        align: 'center',
        width: 170,
        key: 'completeTime'
      },
      {
        title: getFormattedMsg('wms.label.createUserName'),
        dataIndex: 'createUserName',
        align: 'center',
        width: 120,
        key: 'createUserName'
      },
      {
        title: getFormattedMsg('wms.label.options'),
        dataIndex: 'option',
        key: 'option',
        align: 'center',
        width: 120,
        render: (_, record) => [
          <a key="detail" onClick={this.handleDetail(record)}>
            {getFormattedMsg('global.btn.detail')}
          </a>,
          <Divider type="vertical" key="divider1" />,
          <DeleteButton
            key="delete"
            onClick={this.handleDelete(record)}
            style={{ color: 'var(--ne-delete-button-font)' }}
          >
            {getFormattedMsg('global.btn.delete')}
          </DeleteButton>
        ]
      }
    ];
    const { Table, SettingButton } = CacheTable({ columns: tableCols, scrollHeight: 'calc(100vh - 430px)', key: 'wms_adjust' });
    layout.setBlock('top', searchBlock);
    layout.setNode('bottom', () => (
      <Table
        dataSource={this.state.tableData.map((i, idx) => ({
          ...i,
          serialNumber: (this.state.pageInfo.page - 1) * this.state.pageInfo.size + ++idx
        }))}
        loading={this.state.loading}
        rowKey="id"
        columns={tableCols}
      />
    ));
    layout.setOptions({
      top: { height: 'auto' },
      bottom: {
        title: getFormattedMsg('wms.label.adjustOrder'),
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
            onShowSizeChange={this.handlePaginationChange}
            onChange={this.handlePaginationChange}
            showTotal={page.showTotal}
          />
        ),
        buttons: () => (
          <CreateButton type="primary" onClick={this.handleSave} h-icon="add">
            {getFormattedMsg('global.btn.create')}
          </CreateButton>
        )
      }
    });
    /**
     * 查询框
     */
    searchBlock.setConfig({
      formItems: [
        {
          label: getFormattedMsg('wms.label.code'),
          component: <Input allowClear placeholder={getFormattedMsg('wms.validate.code')} />,
          key: 'code'
        },
        {
          label: getFormattedMsg('wms.label.createTime'),
          component: <RangePicker allowClear showTime style={{ width: '100%' }} />,
          key: 'createTime'
        },
        {
          label: getFormattedMsg('wms.label.status'),
          component: (
            <Select placeholder={getFormattedMsg('wms.validate.status')} allowClear>
              <Option value="新建">{getFormattedMsg('wms.label.new')}</Option>
              <Option value="完成">{getFormattedMsg('wms.label.complete')}</Option>
            </Select>
          ),
          key: 'state'
        }
      ]
    });
  }

  handleDetail = record => async e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.history.push({ pathname: '/adjust-order/detail', state: { info: record } });
  };

  handleSave = () => {
    this.props.history.push({ pathname: '/adjust-order/detail'})
    // adjustService
    //   .create({})
    //   .then(record => {
    //     this.props.history.push({ pathname: '/adjust-order/detail', state: { info: record } });
    //   })
    //   .catch(error => {
    //     notification.warning({
    //       message: '操作失败',
    //       description: error.message
    //     });
    //   });
  };

  handleDelete = record => async e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: `确认删除【${record.code}】?`,
      content: '',
      onOk: async () => {
        try {
          await adjustService.deleteAdjustOrder(record.id);
          await this.loadData();
          notification.success({
            message: '删除成功!'
          });
        } catch (error) {
          notification.error({
            message: '删除失败!',
            description: error.message
          });
        }
      }
    });
  };

  loadData = async () => {
    const { searchItem, pageInfo } = this.state;
    this.setState({ loading: true });
    await adjustService
      .getPage({
        ...searchItem,
        page: pageInfo.page - 1,
        pageSize: pageInfo.size,
        sort: true,
        sortCol: 'create_time',
        direction: false
      })
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

  handleSearch = values => {
    if (values.createTime !== undefined && !isEmpty(values.createTime)) {
      values.finishStart = values.createTime[0].format('YYYY-MM-DD HH:mm:ss');
      values.finishEnd = values.createTime[1].format('YYYY-MM-DD HH:mm:ss');
    } else {
      delete values.finishStart;
      delete values.finishEnd;
    }
    delete values.createTime;
    // if (values.finishTime !== undefined && !isEmpty(values.finishTime)) {
    //   values.finishStart = values.finishTime[0].format('YYYY-MM-DD HH:mm:ss');
    //   values.finishEnd = values.finishTime[1].format('YYYY-MM-DD HH:mm:ss');
    // } else {
    //   delete values.finishStart;
    //   delete values.finishEnd;
    // }
    // delete values.finishTime;
    this.setState({ searchItem: values, pageInfo: { page: 1, size: 10 } }, this.loadData);
  };

  handlePaginationChange = (page, size) => {
    this.setState({ pageInfo: { page, size } }, this.loadData);
  };

  mounted() {
    this.loadData();
    this.on('onSearch', this.handleSearch);
  }

  beforeDestroy() {
    this.off('onSearch', this.handleSearch);
  }
}
