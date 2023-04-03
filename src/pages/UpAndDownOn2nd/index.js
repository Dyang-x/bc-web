import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Divider,
  Drawer,
  notification,
  Modal,
  Pagination,
  Tooltip,
  HLayout,
  Button
} from '@hvisions/h-ui';
import MaterialService from '~/api/material';
import { ExportButton, ImportButton } from '~/components';
import SearchForm from './SearchForm';
import MaterialForm from './MaterialForm';
import { i18n } from '@hvisions/toolkit';
import { withPermission } from '@hvisions/core';
const { getFormattedMsg } = i18n;
const { Pane } = HLayout;
const CreateButton = withPermission(Button, 'CREATE');
const ImportsButton = withPermission(ImportButton, 'IMPORT');
const ExportsButton = withPermission(ExportButton, 'EXPORT');
const UpdateButton = withPermission('a', 'update');
const DeleteButton = withPermission('a', 'delete');

class Material extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 10,
      searchTerm: {},
      formData: {},
      visible: false,
      tableCols: this.columns,
      selectedRowKeys: [],
      list: [],
      totoal: 0,
      unitList: []
    };
  }

  async componentDidMount() {
    await this.loadData();
    await this.handlegetAllUnits();
  }

  // 表格的column
  get columns() {
    return [
      {
        title: getFormattedMsg('material.label.codeForMaterial'),
        dataIndex: 'materialCode',
        key: 'materialCode'
      },
      {
        title: getFormattedMsg('material.label.nameForMaterial'),
        dataIndex: 'materialName',
        key: 'materialName'
      },
      {
        title: getFormattedMsg('material.label.groupForMaterial'),
        dataIndex: 'materialTypeDes',
        key: 'materialTypeDes'
      },
      {
        title: getFormattedMsg('material.label.descForMaterial'),
        dataIndex: 'materialDesc',
        key: 'materialDesc',
        render: item => {
          if (item.length < 6) return item;
          const desc = item.slice(0, 6);
          return <Tooltip placement="topLeft" title={item}>{`${desc}...`}</Tooltip>;
        }
      },
      {
        title: getFormattedMsg('material.label.typeForMaterial'),
        dataIndex: 'materialGroup',
        key: 'materialGroup',
        render: group => {
          let name = '';
          switch (group) {
            case 1:
              name = '原料';
              break;
            case 2:
              name = '辅料';
              break;
            case 3:
              name = '成品';
              break;
            case 4:
              name = '副成品';
              break;
            case 5:
              name = '半成品';
              break;
            default:
              break;
          }
          return name;
        }
      },
      {
        title: getFormattedMsg('material.label.uomForMaterial'),
        dataIndex: 'uomName',
        key: 'uomName'
      },
      {
        title: getFormattedMsg('material.label.eigenvalueForMaterial'),
        dataIndex: 'eigenvalue',
        key: 'eigenvalue'
      },
      {
        title: getFormattedMsg('material.label.serialNumberProfileForMaterial'),
        dataIndex: 'serialNumberProfile',
        key: 'serialNumberProfile',
        render: tags =>
          tags ? (
            <span>{getFormattedMsg('material.label.yes')}</span>
          ) : (
            <span>{getFormattedMsg('material.label.no')}</span>
          )
      },
      {
        title: getFormattedMsg('material.label.createTimeForMaterial'),
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: getFormattedMsg('material.label.operate'),
        dataIndex: 'options',
        width: 150,
        key: 'options',
        render: (text, record) => [
          <UpdateButton href="#" key="edit" onClick={this.onHandleEdit(record)} />,
          <Divider type="vertical" key="1" />,
          <DeleteButton href="#" key="remove" onClick={this.handleDelete(record)} />
        ]
      }
    ];
  }

    // 初始化物料表格数据
    loadData = (page = 1, pageSiz = 10) => {
      const { searchTerm, pageSize } = this.state;
      if (pageSiz == 10) {
        pageSiz = pageSize;
      }
      try {
        MaterialService.getMaterial(searchTerm, page, pageSiz).then(data => {
          this.setState({ list: data.content, total: data.totalElements });
        });
      } catch (err) {
        notification.warning({
          message: getFormattedMsg('message.notify.fail'),
          description: err.message
        });
      }
    };

    // 新增物料侧滑窗口
    onHandleCreate = () => {
      this.setState({
        formData: {},
        drawerTitle: getFormattedMsg('material.label.materialManage'),
        visible: true
      });
    };


     // 新增和更新物料信息
  onHandleOk = () => {
    const { validateFields } = this.form;
    const { formData } = this.state;
    validateFields(async (err, value) => {
      if (err) return;
      const { current, pageSize } = this.state;
      try {
        if (formData.id) {
          await MaterialService.updateMaterial({ ...formData, ...value });
        } else {
          await MaterialService.createMaterial(value);
        }
        this.setState({ visible: false });
        this.loadData(current, pageSize);
        notification.success({
          message: getFormattedMsg('global.notify.submitSuccess')
        });
      } catch (err) {
        notification.warning({
          message: getFormattedMsg('global.notify.submitFail'),
          description: err.message
        });
      }
    });
  };

  // 删除物料
  handleDelete = data => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.materialCode }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          const { current, pageSize } = this.state;
          await MaterialService.deleteMaterial(data.id);
          await this.loadData(current, pageSize);
          notification.success({
            message: getFormattedMsg('global.notify.deleteSuccess')
          });
        } catch (err) {
          notification.warning({
            message: getFormattedMsg('global.notify.deleteFail'),
            description: err.message
          });
        }
      }
    });
  };

  // 修改物料信息
  onHandleEdit = data => e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      drawerTitle: getFormattedMsg('material.action.modify'),
      formData: data,
      visible: true,
      isMaterialForm: true
    });
  };



  // 获取物料所有的计量单位
  handlegetAllUnits = () => {
    try {
      MaterialService.getAllUnit().then(data => {
        this.setState({
          unitList: data
        });
      });
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  };


  // 选择某一行数据
  chooseRow = record => {
    this.setState({ selectedRowKeys: [record.id] });
  };

  // 分页变化
  onHandleChange = (page, size) => {
    this.setState({ current: page, pageSize: size });
    this.loadData(page, size);
  };

  // 根据物料编码以及名称查询物料信息
  onHandleSearch = values =>
    this.setState({ searchTerm: values, current: 1, pageSize: 10 }, this.loadData);

  // 导出
  exportMaterial = () => {
    return MaterialService.exportMaterial();
  };

  // 导入
  importMaterial = file => {
    MaterialService.importMaterial(file);
  };

  render() {
    const { isChinese } = this.props;
    const {
      pageSize,
      formData,
      current,
      visible,
      drawerTitle,
      tableCols,
      selectedRowKeys,
      list,
      total,
      unitList
    } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
    };

    return (
      <>
        <HLayout>
          <Pane height={65}>
            <SearchForm onSearch={this.onHandleSearch} />
          </Pane>
          <Pane
            icon="table"
            title={getFormattedMsg('material.label.materilList')}
            style={{ overflow: 'hidden' }}
            buttons={[
              <CreateButton
                onClick={this.onHandleCreate}
                style={{ marginLeft: 10 }}
                key={0}
                type="primary"
                icon="plus"
              />,
              <ExportsButton
                key={1}
                onExport={this.exportMaterial}
                style={{ marginRight: 10 }}
                icon="download"
              />,
              <ImportsButton
                onUpload={this.importMaterial}
                action={getFormattedMsg('material.action.import')}
                key={2}
                style={{ marginRight: 10 }}
                icon="upload"
              />
            ]}
          >
            <Table
              onRow={(record, rowKey) => ({
                onClick: this.chooseRow.bind(this, record, rowKey)
              })}
              rowSelection={rowSelection}
              rowKey={record => record.id}
              dataSource={list}
              columns={tableCols}
              filterMultiple={false}
              pagination={false}
            />
            <div style={{ margin: 10, textAlign: 'center' }}>
              <Pagination
                current={current}
                pageSize={pageSize}
                showQuickJumper
                size="small"
                showSizeChanger
                total={total}
                onShowSizeChange={this.onHandleChange}
                onChange={this.onHandleChange}
                showTotal={(total, range) =>
                  `${getFormattedMsg('global.label.now')} ${range[0]}-${range[1]} ${getFormattedMsg(
                    'global.label.item'
                  )}  ${getFormattedMsg('global.label.total')} ${total} ${getFormattedMsg(
                    'global.label.item'
                  )} ${getFormattedMsg('global.label.record')}`
                }
              />
            </div>
          </Pane>
        </HLayout>
        <Drawer
          width={800}
          visible={visible}
          title={drawerTitle}
          onClose={() => this.setState({ visible: false })}
        >
          <Drawer.DrawerContent>
            <MaterialForm
              formData={formData}
              setFileid={value => this.setState({ fileId: value })}
              onOk={this.onHandleOk}
              ref={node => (this.form = node)}
              onClose={() => this.setState({ visible: false })}
              isChinese={isChinese}
              unitlist={unitList}
            />
          </Drawer.DrawerContent>
          <Drawer.DrawerBottomBar>
            <Button onClick={() => this.setState({ visible: false })}>
              {getFormattedMsg('material.action.cancel')}
            </Button>
            <Button type="primary" onClick={this.onHandleOk}>
              {getFormattedMsg('material.action.save')}
            </Button>
          </Drawer.DrawerBottomBar>
        </Drawer>
      </>
    );
  }
}

Material.propTypes = {
  getMaterial: PropTypes.func,
  createMaterial: PropTypes.func,
  updateMaterial: PropTypes.func,
  getAllUnit: PropTypes.func,
  total: PropTypes.number,
  deleteMaterial: PropTypes.func,
  importMaterial: PropTypes.func,
  unitList: PropTypes.array,
  list: PropTypes.array,
  isChinese: PropTypes.bool
};

export default Material;
