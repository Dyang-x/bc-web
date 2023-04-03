/*
 * @Author: Andy
 * @Date: 2019-08-14 16:20:37
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 18:12:48
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  HTable,
  Pagination,
  Modal,
  notification,
  Spin,
  HLayout,
} from '@hvisions/h-ui';
import { i18n, withPermission } from '@hvisions/core';
import bomService from '~/api/bom';
import { getBom, exportBomTemplate } from '~/store/bom/actions';
import { listSelector, totalSelector } from '~/store/bom/selector';
import SearchForm from './SearchForm';
import ToolList from './ToolList';
import ToolTree from './ToolTree';
import TreeComponent from './TreeComponent';
import DetailComponent from './DetailComponent';
const getFormattedMsg = i18n.getFormattedMsg;
const DeleteButtonA = withPermission('a', 'DELETE');
const { Pane } = HLayout;
const Index = ({ getBom, list, total, exportBomTemplate }) => {
  const [treeData, setTreeData] = useState({});
  const [searchItem, setSearchItem] = useState({});
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [selectedTree, setSelectedTree] = useState({ records: [], site: [] });
  const [detailContentVisible, setDetailContentVisible] = useState(false);
  useEffect(() => {
    loadData();
  }, [pageInfo]);

  const loadData = async () => {
    await setLoading(true);
    await getBom(searchItem, pageInfo.page, pageInfo.pageSize);
    await setLoading(false);
    setSelectedRow({});
    setSelectedRowKey([]);
    setSelectedTree({ records: [], site: [] });
  };

  const column = () => [
    {
      title: getFormattedMsg('global.label.number'),
      dataIndex: 'index',
      key: 'index',
      width: 80,
      need: true,
      render: (text, record, index) => index + 1 + (pageInfo.page - 1) * pageInfo.pageSize
    },
    {
      title: getFormattedMsg('bom.label.bomCode'),
      dataIndex: 'bomCode',
      key: 'bomCode',
    },
    {
      title: getFormattedMsg('bom.label.name'),
      dataIndex: 'bomName',
      key: 'bomName',
    },
    {
      title: getFormattedMsg('bom.label.version'),
      dataIndex: 'bomVersions',
      key: 'bomVersions',
    },
    {
      title: getFormattedMsg('bom.label.status'),
      dataIndex: 'bomStatus',
      key: 'bomStatus',
      width: 80,
      render: status => {
        switch (status) {
          case 0:
            return getFormattedMsg('bom.type.new');
          case 1:
            return getFormattedMsg('bom.type.tack_effect');
          case 2:
            return getFormattedMsg('bom.type.pigeonhole');
          default:
            break;
        }
      }
    },
    {
      title: getFormattedMsg('bom.label.operate'),
      dataIndex: 'options',
      width: 80,
      fixed: 'right',
      key: 'options',
      render: (text, record) => [
        <DeleteButtonA href="#" key="remove" onClick={handleDeleteBom(record)} />
      ]
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    onChange: (value, record) => handleSelectCheckBox(value, record)
  };

  const handleSelectCheckBox = (keys, records) => {
    setSelectedRow(records[0]);
    setSelectedRowKey(keys);
  };

  const chooseRow = (record, rowKey) => {
    setSelectedRowKey([record.id]);
    setSelectedRow(record);
    bomService.getBomItemBomSubItemById(record.id).then(data => {
      setTreeData(data);
    });
  };

  const refreshTree = () => {
    bomService.getBomItemBomSubItemById(selectedRow.id).then(data => {
      setTreeData(data);
    });
    setDetailContentVisible(true);
  };

  const handleSearch = async value => {
    await setLoading(true);
    await setSearchItem(value);
    await getBom(value, pageInfo.page, pageInfo.pageSize);
    await setLoading(false);
  };

  const handlePageInfoChange = (page, pageSize) => {
    setPageInfo({ page, pageSize });
  };

  const handleDeleteBom = record => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: `${getFormattedMsg('global.btn.confirm')}${getFormattedMsg('global.btn.delete')}[${record.bomName}]?`,
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await bomService.deleteBom(record.id);
          setTimeout(() => {
            loadData();
          }, 1000);
          notification.success({
            message: getFormattedMsg('global.notify.deleteSuccess')
          });
        } catch (error) {
          notification.warning({
            message: getFormattedMsg('global.notify.deleteFail'),
            description: error.message
          });
        }
      }
    });
  };


  return (
    <>
    <div style={{ height: 65, width: '100%' }}>
      <HLayout layout="vertical">
        <Pane height={65} style={{ overflow: 'hidden' }}>
          <SearchForm onSearch={handleSearch} />
        </Pane>
      </HLayout>
      </div>
      <div style={{ width: '100%', height: 'calc(100vh - 155px)' }}>
      <HLayout layout="horizontal">
        <Pane
          icon="table"
          title={getFormattedMsg('bom.label.bomTable')}
          style={{
            margin: '5px 0 0 0',
            padding: 0,
            overflow: 'auto'
          }}
          width={document.body.clientWidth/2}
          buttons={
            <ToolList
              loadData={loadData}
              selectedRowKey={selectedRowKey}
              selectedRow={selectedRow}
              exportBomTemplate={exportBomTemplate}
            />
          }
        >
          <Spin spinning={loading}>
            <HTable
              columns={column()}
              dataSource={list}
              pagination={false}
              rowKey={record => record.id}
              filterMultiple
              rowSelection={rowSelection}
              onRow={(record, rowKey) => ({
                onClick: () => chooseRow(record, rowKey)
              })}
            />
          </Spin>
          <div style={{ margin: '10px 0', textAlign: 'center' }}>
            <Pagination
              current={pageInfo.page}
              pageSize={pageInfo.pageSize}
              pageSizeOptions={['10', '20', '30']}
              showQuickJumper
              size="small"
              total={total}
              showSizeChanger
              onShowSizeChange={handlePageInfoChange}
              onChange={handlePageInfoChange}
              showTotal={(total, range) =>
                `${getFormattedMsg('message.label.now')} ${range[0]}-${range[1]} ${getFormattedMsg(
                  'message.label.item'
                )}  ${getFormattedMsg('message.label.total')} ${total} ${getFormattedMsg(
                  'message.label.item'
                )} ${getFormattedMsg('message.label.record')}`
              }
            />
          </div>
        </Pane>

        <Pane
          buttons={<ToolTree  treeData={treeData} selectedTree={selectedTree} refreshTree={refreshTree} />}
          icon="branches"
          title={getFormattedMsg('bom.label.bomInfo')}
          style={{ margin: '5px 0 0 5px', padding: 0 }}
          width={280}
        >
          <TreeComponent
            data={treeData}
            selectedTree={selectedTree}
            handleSelectTree={value => setSelectedTree(value)}
            resetDetailContent={() => setDetailContentVisible(false)}
          />
        </Pane>

        <Pane
          icon="edit"
          title={getFormattedMsg('bom.label.bomEdit')}
          style={{ margin: '5px 0 0 5px', padding: 0 }}
        >
          <DetailComponent
            detailContentVisible={detailContentVisible}
            refreshTree={refreshTree}
            selectedTree={selectedTree}
            loadData={loadData}
            treeData={treeData}
          />
        </Pane>
      </HLayout>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  list: listSelector(state),
  total: totalSelector(state)
});

export default connect(
  mapStateToProps,
  {
    getBom,
    exportBomTemplate
  }
)(Index);
