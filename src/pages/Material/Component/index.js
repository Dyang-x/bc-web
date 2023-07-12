import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { i18n, withPermission } from '@hvisions/core';
import {
  HTable,
  Pagination,
  Spin,
  Divider,
  Modal,
  notification,
  HLayout,
  Checkbox,
  Button
} from '@hvisions/h-ui';
import materialService from '~/api/material';
import { getMaterial, getExtendColumns } from '~/store/material/actions';
import { isChineseLocale } from '@hvisions/core/lib/store/session/selector.js';
import { listSelector, totalSelector, columnsSelector } from '~/store/material/selector';
import { chunk, isEmpty } from 'lodash';
import SearchForm from './SearchForm';
import ToolList from './ToolList';
import TypeTree from './TypeTree';
import TypeMenu from './TypeMenu';
import styles from './style.scss';
const UpdateButton = withPermission('a', 'update');
const DeleteButton = withPermission('a', 'delete');
const DetailButton = withPermission('a', 'Detail');
const getFormattedMsg = i18n.getFormattedMsg;
const CheckboxGroup = Checkbox.Group;
const { Pane } = HLayout;
const Index = ({
  getMaterial,
  materialList,
  materialListTotal,
  getExtendColumns,
  extendColumns,
  history,
  isChinese
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 });
  const [searchItem, setSearchItem] = useState({});
  const [modifyVisible, setModifyVisible] = useState(false);
  const [deleteModify, setDeleteModify] = useState(false);
  const [tableCols, setTableCols] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [typeId, setTypeId] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, [pageInfo]);

  const loadData = async () => {
    await setLoading(true);
    await getMaterial({ ...searchItem, materialType: typeId[0] }, pageInfo.page, pageInfo.pageSize);
    await getExtendColumns();
    materialService.getAllMaterialType().then(data => {
      const filterArr = data.filter(node => {
        if (!isEmpty(data)) {
          const children = data.filter(c => c.parentId === node.id);
          node.children = !isEmpty(children) ? children : [];
        }
        return node.parentId === 0;
      });
      setTypeList(filterArr);
    });
    await setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [typeId]);

  useEffect(() => {
    setTableCols(columns);
  }, [extendColumns]);

  const onColumnChange = checkedValue => {
    const cols = columns();
    const [first, last] = chunk(cols, cols.length - 1);
    const addCols = checkedValue.map(cv => {
      const col = extendColumns.find(col => col.columnName === cv);
      return {
        title: col.chName,
        dataIndex: `extend[${cv}]`,
        key: `extend[${cv}]`
      };
    });
    setTableCols(first.concat(addCols).concat(last));
  };

  const handleOnSearch = async value => {
    await setLoading(true);
    await getMaterial({ ...searchItem, materialType: typeId[0], ...value }, 1, pageInfo.pageSize);
    await setSearchItem({
      ...value
    });
    await setLoading(false);
  };

  const chooseRow = (record, _) => {
    setSelectedRowKey([record.id]);
    setSelectedRow(record);
  };

  const handleSelectCheckBox = (keys, records) => {
    setSelectedRow(records[0]);
    setSelectedRowKey(keys);
  };

  const columns = () => {
    return [
      {
        title: getFormattedMsg('global.label.number'),
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text, record, index) => index + 1 + (pageInfo.page - 1) * pageInfo.pageSize
      },
      {
        title: getFormattedMsg('material.label.materialCode'),
        dataIndex: 'materialCode',
        key: 'materialCode'
      },
      {
        title: getFormattedMsg('material.label.materialName'),
        dataIndex: 'materialName',
        key: 'materialName'
      },
      {
        title: getFormattedMsg('material.label.materialType'),
        dataIndex: 'materialTypeName',
        key: 'materialTypeName'
      },
      {
        title: getFormattedMsg('material.label.materialDesc'),
        dataIndex: 'materialDesc',
        key: 'materialDesc'
      },
      {
        title: getFormattedMsg('material.label.materialGroup'),
        dataIndex: 'materialGroupDesc',
        key: 'materialGroupDesc'
      },
      {
        title: getFormattedMsg('material.label.materialUom'),
        dataIndex: 'uomName',
        key: 'uomName'
      },
      // {
      //   title: getFormattedMsg('material.label.materialEigenvalue'),
      //   dataIndex: 'eigenvalue',
      //   key: 'eigenvalue'
      // },
      // {
      //   title: getFormattedMsg('material.label.serialNumberProfileForMaterial'),
      //   dataIndex: 'serialNumberProfile',
      //   key: 'serialNumberProfile',
      //   width: 150,
      //   render: tags =>
      //     tags ? (
      //       <span>{getFormattedMsg('material.label.yes')}</span>
      //     ) : (
      //       <span>{getFormattedMsg('material.label.no')}</span>
      //     )
      // },
      // {
      //   title: getFormattedMsg('material.label.createTimeForMaterial'),
      //   dataIndex: 'createTime',
      //   key: 'createTime',
      //   width: 150
      // },
      {
        title: getFormattedMsg('bom.label.operate'),
        dataIndex: 'operate',
        key: 'operate',
        width: 150,
        filterDropdown: () => {
          const plainOptions = extendColumns.map(col => ({
            label: isChinese ? col.chName : col.enName,
            value: col.columnName
          }));
          return (
            <div className={styles['dynamic-column']}>
              <CheckboxGroup options={plainOptions} onChange={onColumnChange} />
            </div>
          );
        },
        render: (text, record) => [
          <UpdateButton href="#" key="edit" onClick={() => handleEditMaterial(record)} />,
          <Divider type="vertical" key="1" />,
          <DetailButton
            key="property"
            onClick={() =>
              history.push({ pathname: '/material-detail', state: { materialData: record } })
            }
          />,
          <Divider type="vertical" key="2" />,
          <DeleteButton href="#" key="remove" onClick={handleDeleteMaterial(record)} />
        ]
      }
    ];
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    onChange: (value, record) => handleSelectCheckBox(value, record)
  };

  const handlePageInfoChange = async (page, pageSize) => {
    await setLoading(true);
    await setPageInfo({ page, pageSize });
    await setLoading(true);
  };

  const handleEditMaterial = record => {
    setModifyVisible(true);
    setSelectedRow(record);
  };

  const handleDeleteMaterial = record => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: record.materialName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await setDeleteModify(true);
          await materialService.deleteMaterial(record.id);
          await loadData();
          notification.success({
            message: getFormattedMsg('global.notify.deleteSuccess')
          });
        } catch (error) {
          notification.warning({
            message: getFormattedMsg('global.notify.deleteFail'),
            description: error.message
          });
        } finally {
          await setDeleteModify(false);
        }
      }
    });
  };

  return (
    <>
      <div style={{ width: 250, height: 'calc(100vh - 90px)', float: 'left' }}>
        <HLayout layout="vertical">
          <Pane
            icon="bars"
            title={getFormattedMsg('material.label.materialType')}
            style={{ overflow: 'hidden' }}
            width={250}
          >
            <TypeTree types={typeList} setTypeId={setTypeId} typeId={typeId} />
          </Pane>
        </HLayout>
      </div>
      <div
        style={{
          height: 'calc(100vh - 90px)',
          width: 'calc(100% - 255px )',
          float: 'left',
          marginLeft: 5
        }}
      >
        <HLayout layout="vertical">
          <Pane height={65} style={{ overflow: 'hidden' }}>
            <SearchForm onSearch={handleOnSearch} />
          </Pane>
          <Pane
            h-icon="table"
            title={getFormattedMsg('material.label.materilList')}
            style={{ overflow: 'hidden' }}
            buttons={
              <ToolList
                loadData={loadData}
                selectedRow={selectedRow}
                selectedRowKey={selectedRowKey}
                modifyVisible={modifyVisible}
                setModifyVisible={condition => setModifyVisible(condition)}
              />
            }
          >
            <Spin spinning={loading}>
              <HTable
                onRow={(record, rowKey) => ({
                  onClick: () => chooseRow(record, rowKey)
                })}
                rowKey={record => record.id}
                dataSource={materialList}
                columns={tableCols}
                pagination={false}
                filterMultiple={false}
                // rowSelection={rowSelection}
              />
              <div style={{ margin: '10px 0', textAlign: 'center' }}>
                <Pagination
                  current={pageInfo.page}
                  pageSize={pageInfo.pageSize}
                  pageSizeOptions={['10', '20', '30']}
                  showQuickJumper
                  size="small"
                  total={materialListTotal}
                  showSizeChanger
                  onShowSizeChange={handlePageInfoChange}
                  onChange={handlePageInfoChange}
                  showTotal={(total, range) =>
                    `${getFormattedMsg('global.label.now')} ${range[0]}-${
                      range[1]
                    } ${getFormattedMsg('message.label.item')}  ${getFormattedMsg(
                      'global.label.total'
                    )} ${total} ${getFormattedMsg('message.label.item')} ${getFormattedMsg(
                      'global.label.record'
                    )}`
                  }
                />
              </div>
            </Spin>
          </Pane>
        </HLayout>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  materialList: listSelector(state),
  materialListTotal: totalSelector(state),
  extendColumns: columnsSelector(state),
  isChinese: isChineseLocale()
});

export default connect(mapStateToProps, {
  getMaterial,
  getExtendColumns
})(Index);
