import React from 'react';
import { Page, createBlock } from '@needle/kernel';
import {
  Input,
  Divider,
  Select,
  Button,
  Radio,
  Cascader,
  Modal,
  notification,
  Menu,
  Icon,
  Dropdown,
  Spin,
  Pagination,
  ImageUpload, HVTable
} from '@hvisions/h-ui';
import fileService from '~/api/equipmentManage/file';
import { LRtbLayout, SearchBlock, FormBlock, ExtendFormBlock } from '@needle/block';
import { isEmpty } from 'lodash';
import { formatExtendFields } from '~/util';
import { page, i18n, session } from '@hvisions/toolkit';
import { ImportButton, ExportButton, CacheTable } from '~/components';
import materialApi from '~/api/material';
import { withPermission } from '@hvisions/core';
import TypeTree from './TypeTree';


import { Table } from '@hvisions/h-ui';
import styles from './style.scss'

const columns1111 = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'John',
        value: 'John',
      },
    ],
    onFilter: (value, record) => record.name.indexOf(value) === 0,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
];

const data11111 = [];
for (let i = 0; i < 100; i++) {
  data11111.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  });
}

const isChinese = session.getLocale();
const apiAddress = session.getApiAddress();

const searchBlock = createBlock(SearchBlock);
const formBlock = createBlock(FormBlock);

const extendForm = createBlock(ExtendFormBlock);

const getFormattedMsg = i18n.getFormattedMsg;
let layout;
const CreateButton = withPermission(Button, 'CREATE');
const ImportsButton = withPermission(ImportButton, 'IMPORT');
const ExportsButton = withPermission(ExportButton, 'EXPORT');
const ExtendButton = withPermission('a', 'EXTEND');
const UpdateButton = withPermission('a', 'update');
const DeleteButton = withPermission('a', 'delete');
const DetailButton = withPermission('a', 'Detail');
export default class Material extends Page {
  constructor(props) {
    super(LRtbLayout, props, {});
  }

  state = {
    searchData: {},
    pageInfo: { page: 1, size: 10 },
    extendList: [],
    formData: {},
    typeId: [],
    groupList: [],
    typeList: [],
    unit: [],
    tableData: [],
    tableTotal: 0,
    loading: false
  };
  get tableCols() {
    return [
      {
        title: getFormattedMsg('material.label.materialCode'),
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 150
      },
      {
        title: '11111',
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 150
      },
      {
        title: getFormattedMsg('material.label.materialName'),
        dataIndex: 'materialName',
        key: 'materialName',
        width: 200
      },
      {
        title: getFormattedMsg('material.label.materialType'),
        dataIndex: 'materialTypeName',
        key: 'materialTypeName',
        minWidth: 150
      },
      {
        title: getFormattedMsg('material.label.materialDesc'),
        dataIndex: 'materialDesc',
        key: 'materialDesc',
        width: 200
      },
      {
        title: getFormattedMsg('material.label.materialGroup'),
        dataIndex: 'materialGroupDesc',
        key: 'materialGroupDesc',
        width: 150
      },
      {
        title: getFormattedMsg('material.label.materialUom'),
        dataIndex: 'uomName',
        key: 'uomName',
        width: 150
      },
      {
        title: getFormattedMsg('material.label.materialEigenvalue'),
        dataIndex: 'eigenvalue',
        key: 'eigenvalue',
        hidden: true,
        width: 150
      },
      {
        title: getFormattedMsg('material.label.serialNumberProfileForMaterial'),
        dataIndex: 'serialNumberProfile',
        key: 'serialNumberProfile',
        width: 150,
        hidden: true,
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
        key: 'createTime',
        width: 150,
        hidden: true
      },
      {
        title: getFormattedMsg('bom.label.operate'),
        dataIndex: 'opt',
        key: 'opt',
        align: 'center',
        width: 160,
        fixed: 'right',
        render: (text, record) => [
          <UpdateButton href="#" key="edit" onClick={this.onHandleOpenForm(record)} />,
          <Divider type="vertical" key="1" />,
          <DetailButton
            key="property"
            onClick={() =>
              this.props.history.push({
                pathname: '/material/detail',
                state: { materialData: record }
              })
            }
          />,
          <Divider type="vertical" key="2" />,
          <DeleteButton
            href="#"
            key="remove"
            style={{ color: 'var(--ne-delete-button-font)' }}
            onClick={this.handleDeleteMaterial(record)}
          />
        ]
      }
    ];
  }

  created() {
    layout = this.getLayout();
    layout.setBlock('rightTop', searchBlock); // 将SearchBlock装载到TBLayout的top区域
    layout.setNode('left', () => (
      <TypeTree
        types={this.state.typeList}
        setTypeId={e => this.setState({ typeId: e }, this.loadData)}
        typeId={this.state.typeId}
      />
    ));
    layout.setOptions({
      left: {
        title: getFormattedMsg('material.label.materialType'),
        width: 300,
        ['h-icon']: 'tree'
      },
      right: {
        top: { height: 'auto' },
        bottom: {
          title: getFormattedMsg('material.label.materilList'),
          ['h-icon']: 'table',
          onRefresh: () => this.loadData(),
          buttons: () => (
            <>
              <CreateButton h-icon="add" type="primary" onClick={this.onHandleOpenForm({})} />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <ImportsButton
                        Widget="a"
                        style={{ color: '#333' }}
                        icon="upload"
                        onUpload={this.importMaterialBom}
                        action="导入"
                      ></ImportsButton>
                    </Menu.Item>
                    <Menu.Item>
                      <ExportsButton
                        Widget="a"
                        onExport={materialApi.exportMaterial}
                        icon="download"
                      ></ExportsButton>
                    </Menu.Item>
                    <Menu.Item>
                      <ExtendButton
                        Widget="a"
                        icon="apartment"
                        onClick={this.onHandleExtendFrom.bind(this)}
                      />
                    </Menu.Item>
                    <Menu.Item>
                      <ExportButton
                        icon="download"
                        Widget="a"
                        onExport={materialApi.getMaterialsImportTemplate}
                      >
                        {getFormattedMsg('bom.action.getBomTempLate')}
                      </ExportButton>
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomCenter"
              >
                <Button h-icon="more-action">
                  <span>更多</span>
                  <Icon style={{ marginLeft: 5 }} type="down" />
                </Button>
              </Dropdown>
            </>
          ),
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
      }
    });

    searchBlock.setConfig({
      formItems: [
        {
          label: getFormattedMsg('material.label.materialCode'),
          component: (
            <Input
              allowClear
              placeholder={getFormattedMsg('material.validate.placeholderForCode')}
            />
          ),
          key: 'materialCode'
        },
        {
          label: getFormattedMsg('material.label.materialName'),
          component: (
            <Input
              allowClear
              placeholder={getFormattedMsg('material.validate.placeholderForName')}
            />
          ),
          key: 'materialName'
        },
        {
          label: getFormattedMsg('material.label.materialGroup'),
          component: () => (
            <Select
              showSearch
              optionFilterProp="children"
              allowClear
              placeholder={getFormattedMsg('material.validate.placeholderForColumnGroup')}
            >
              {this.state.groupList.map(value => (
                <Select.Option value={value.id} key={value.id}>
                  {`${value.groupCode}/${value.groupName}`}
                </Select.Option>
              ))}
            </Select>
          ),
          key: 'materialGroup'
        }
      ]
    });

    formBlock.setConfig({
      columns: 2,
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      formItems: [
        {
          emptyValue: '',
          label: getFormattedMsg('material.label.materialCode'),
          component: () => {
            const data = formBlock.getConfig();
            return (
              <Input
                disabled={data.dataSource.id !== undefined}
                placeholder={getFormattedMsg('material.validate.placeholderForCode')}
              />
            );
          },
          key: 'materialCode',
          rules: [
            { required: true, message: getFormattedMsg('material.validate.placeholderForCode') },
            {
              max: 50,
              message: '物料编码不能大于50字符'
            }
          ]
        },
        {
          emptyValue: 1,
          label: getFormattedMsg('material.label.materialEigenvalue'),
          component: () => {
            const data = formBlock.getConfig();
            return (
              <Input
                disabled={data.dataSource.id !== undefined}
                placeholder={getFormattedMsg('material.validate.placeholderForeigenvalue')}
              />
            );
          },
          key: 'eigenvalue',
          rules: [
            {
              required: true,
              message: getFormattedMsg('material.validate.placeholderForeigenvalue')
            }
          ]
        },
        {
          emptyValue: '',
          label: getFormattedMsg('material.label.materialName'),
          component: (
            <Input placeholder={getFormattedMsg('material.validate.placeholderForName')} />
          ),
          key: 'materialName',
          rules: [
            { required: true, message: getFormattedMsg('material.validate.placeholderForName') },
            {
              max: 50,
              message: '物料名称不能大于50字符'
            }
          ]
        },
        {
          emptyValue: undefined,
          label: getFormattedMsg('material.label.materialUom'),
          component: () => (
            <Select placeholder={getFormattedMsg('material.validate.placeholderForColumnUom')}>
              {this.state.unit.map(value => (
                <Select.Option value={value.id} key={value.id}>
                  {value.symbol + '/' + value.description}
                </Select.Option>
              ))}
            </Select>
          ),
          key: 'uom',
          rules: [
            {
              required: true,
              message: getFormattedMsg('material.validate.placeholderForColumnUom')
            }
          ]
        },
        {
          emptyValue: [],
          label: getFormattedMsg('material.label.materialType'),
          component: () => (
            <Cascader
              options={this.state.typeList}
              fieldNames={{ label: 'materialTypeName', value: 'id', children: 'children' }}
              changeOnSelect
              placeholder={getFormattedMsg('material.validate.placeholderForColumnType')}
            ></Cascader>
          ),
          key: 'materialType',
          rules: [
            {
              required: true,
              message: getFormattedMsg('material.validate.placeholderForColumnType')
            }
          ]
        },
        {
          emptyValue: undefined,
          label: getFormattedMsg('material.label.materialGroup'),
          component: () => (
            <Select
              showSearch
              optionFilterProp="children"
              allowClear
              placeholder={getFormattedMsg('material.validate.placeholderForColumnGroup')}
            >
              {this.state.groupList.map(value => (
                <Select.Option value={value.id} key={value.id}>
                  {`${value.groupCode}/${value.groupName}`}
                </Select.Option>
              ))}
            </Select>
          ),
          key: 'materialGroup'
        },
        {
          emptyValue: false,
          label: getFormattedMsg('material.label.serialNumberProfileForMaterial'),
          component: (
            <Radio.Group name="radiogroup">
              <Radio value={true}>{getFormattedMsg('global.judge.yes')}</Radio>
              <Radio value={false}>{getFormattedMsg('global.judge.no')}</Radio>
            </Radio.Group>
          ),
          key: 'serialNumberProfile'
        },
        {
          emptyValue: '',
          label: getFormattedMsg('material.label.materialDesc'),
          component: (
            <Input.TextArea placeholder={getFormattedMsg('material.validate.placeholderForDesc')} />
          ),
          key: 'materialDesc'
        },
        {
          emptyValue: undefined,
          label: getFormattedMsg('material.label.materialPic'),
          component: () => <ImageUpload apiAddress={apiAddress} uploadApi={e => fileService.uploadFile(e)} />,
          key: 'photoId'
        }
      ]
    });

    this.modifyDrawerKey = layout.createDrawer('modify-drawer', formBlock, {
      width: 760,
      footer: (
        <>
          <Button key="cancel" onClick={() => layout.closeDrawer(this.modifyDrawerKey)}>
            {getFormattedMsg('global.btn.cancel')}
          </Button>
          <Button type="primary" onClick={this.handleSave}>
            {getFormattedMsg('global.btn.save')}
          </Button>
        </>
      ),
      destroyOnClose: true
    });

    this.extendDrawerKey = layout.createDrawer('extend-modify-drawer', extendForm, {
      footer: (
        <>
          <Button key="cancel" onClick={() => layout.closeDrawer(this.extendDrawerKey)}>
            {getFormattedMsg('global.btn.close')}
          </Button>
        </>
      ),
      destroyOnClose: true,
      width: 800
    });
  }

  handleDeleteMaterial = record => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: record.materialName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await materialApi
          .deleteMaterial(record.id)
          .then(() => {
            this.loadData();
            notification.success({
              message: getFormattedMsg('global.notify.deleteSuccess')
            });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('global.notify.deleteFail'),
              description: err.message
            });
          });
      }
    });
  };

  importMaterialBom = async file => {
    await materialApi
      .importMaterial(file)
      .then(data => {
        if (!isEmpty(data.errorLines)) {
          notification.warning({
            description: JSON.stringify(data.errorLines)
          });
        }
        this.loadData();
      })
      .catch(error => {
        notification.warning({
          description: error.message
        });
      });
  };

  onHandleOpenForm = (record = {}) => async e => {
    e.preventDefault();
    e.stopPropagation();
    if (record.materialType) {
      await materialApi.getMaterialTypeArrByNodeId(record.materialType).then(data => {
        record.materialType = data;
      });
    }
    formBlock.setConfig({
      dataSource: record
    });
    layout.openDrawer(this.modifyDrawerKey, {
      title: isEmpty(record)
        ? `${getFormattedMsg('global.btn.create')}物料`
        : `${getFormattedMsg('global.btn.modify')}物料`
    });
  };

  /**
   * 扩展字段
   */

  onHandleExtendFrom() {
    const layout = this.getLayout();
    layout.openDrawer(this.extendDrawerKey, { title: '扩展字段' });
  }

  /**
   * 保存用户信息
   */
  handleSave = () => {
    formBlock.submit(async (err, values) => {
      if (err) return;
      if (!values) return;
      values = formatExtendFields(values, this.state.extendList);
      if (values.id) {
        await materialApi
          .updateMaterial({
            ...values,
            materialType: values.materialType[values.materialType.length - 1]
          })
          .then(() => {
            notification.success({
              message: `${
                values.id
                  ? getFormattedMsg('global.notify.modifySuccess')
                  : getFormattedMsg('global.notify.createSuccess')
              }`
            });
            this.loadData();
            this.getLayout().closeDrawer(this.modifyDrawerKey);
          })
          .catch(err => {
            notification.warning({
              message: `${
                values.id
                  ? getFormattedMsg('global.notify.modifyFail')
                  : getFormattedMsg('global.notify.createFail')
              }`,
              description: err.message
            });
          });
      } else {
        await materialApi
          .createMaterial({
            ...values,
            materialType: values.materialType[values.materialType.length - 1]
          })
          .then(() => {
            notification.success({
              message: `${
                values.id
                  ? getFormattedMsg('global.notify.modifySuccess')
                  : getFormattedMsg('global.notify.createSuccess')
              }`
            });
            this.loadData();
            this.getLayout().closeDrawer(this.modifyDrawerKey);
          })
          .catch(err => {
            notification.warning({
              message: `${
                values.id
                  ? getFormattedMsg('global.notify.modifyFail')
                  : getFormattedMsg('global.notify.createFail')
              }`,
              description: err.message
            });
          });
      }
    });
  };

  loadData = async () => {
    const { searchData, pageInfo, typeId } = this.state;
    await this.setState({ loading: true });
    await materialApi
      .getMaterialByNameOrCode({
        ...searchData,
        page: pageInfo.page - 1,
        pageSize: pageInfo.size,
        materialType: typeId[0]
      })
      .then(result => {
        this.setState({ tableData: result.content, tableTotal: result.totalElements });
      })
      .catch(err => {
        notification.error({
          description: err.message
        });
      });
    await this.setState({ loading: false });
  };

  loadExtendData = async () => {
    await materialApi
      .getExtendColumns()
      .then(result => {
        this.setState({ extendList: result });

        formBlock.setExtendFormItems(result);
        extendForm.setConfig({
          dataSource: result,
          createFunc: e => materialApi.createMaterialExtend(e),
          getExtendFunc: this.loadExtendData,
          deleteFunc: e => materialApi.deleteMaterialExtend(e)
        });
        const { Table, SettingButton } = CacheTable({
          columns: this.tableCols
            .slice(0, -1)
            .concat(
              result.map(i => {
                return {
                  title: isChinese ? i.chName : i.enName,
                  dataIndex: `extend[${i.columnName}]`,
                  hidden: true,
                  key: `extend[${i.columnName}]`,
                  width: 120
                };
              })
            )
            .concat(this.tableCols.slice(-1)),
          key: 'base_material'
        });
        layout.setNode('rightBottom', () => (
          <Spin spinning={this.state.loading}>
           {/* <Table
    columns={columns1111}
    dataSource={data11111}
    bordered
    size="middle"
    scroll={{ x: '130%', y: 240 }}
  /> */}
            <Table
            // className ={stl}
              dataSource={this.state.tableData.map((i, idx) => ({
                ...i,
                serialNumber: (this.state.pageInfo.page - 1) * this.state.pageInfo.size + ++idx
              }))}
              scroll={{ x: 'max-content' }}
              rowKey="id"
              columns={this.tableCols
                .slice(0, -1)
                .concat(
                  result.map(i => {
                    return {
                      title: isChinese ? i.chName : i.enName,
                      dataIndex: `extend[${i.columnName}]`,
                      hidden: true,
                      key: `extend[${i.columnName}]`,
                      width: 120
                    };
                  })
                )
                .concat(this.tableCols.slice(-1))}
            />
          </Spin> 
        ));
        layout.setOptions({
          right: {
            ...layout.getOptions().right,
            bottom: { ...layout.getOptions().right.bottom, settingButton: () => <SettingButton /> }
            // bottom: { ...layout.getOptions().right.bottom }
          }
        });
      })
      .catch(err => {
        notification.error({
          description: err.message
        });
      });
  };

  onHandleSearch = values => {
    this.setState({ searchData: values, pageInfo: { page: 1, size: 10 } }, this.loadData);
  };

  onHandlePaginationChange = (page, size) => {
    this.setState({ pageInfo: { page, size } }, this.loadData);
  };

  loadOtherData = () => {
    materialApi
      .getAllMaterialGroup()
      .then(res => {
        this.setState({ groupList: res });
      })
      .catch(err => {
        notification.error({
          description: err.message
        });
      });

    materialApi
      .getAllMaterialType()
      .then(data => {
        const filterArr = data.filter(node => {
          if (!isEmpty(data)) {
            const children = data.filter(c => c.parentId === node.id);
            node.children = !isEmpty(children) ? children : [];
          }
          return node.parentId === 0;
        });
        this.setState({ typeList: filterArr });
      })
      .catch(err => {
        notification.error({
          description: err.message
        });
      });

    materialApi
      .getAllUnit()
      .then(res => {
        this.setState({ unit: res });
      })
      .catch(err => {
        notification.error({
          description: err.message
        });
      });
  };

  mounted() {
    this.loadData();
    this.loadExtendData();
    this.loadOtherData();
    // 监听搜索事件
    searchBlock.on('onSearch', this.onHandleSearch);
    this.on('onPaginationChange', this.onHandlePaginationChange);
  }

  beforeDestroy() {
    // 销毁监听搜索事件
    searchBlock.off('onSearch', this.onHandleSearch);
    this.off('onPaginationChange', this.onHandlePaginationChange);
  }
}

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { HVLayout, Button, notification, Modal, Divider, Spin, Radio, Pagination, SearchForm, DatePicker, Input, Tooltip, Drawer } from '@hvisions/h-ui';
// import { i18n, page } from '@hvisions/toolkit';
// // import styles from './style.scss';
// import { CacheTable } from '~/components';
// import moment from 'moment';
// import EmptyPalletDelivery from '~/api/EmptyPalletDelivery';
// import { isEmpty } from 'lodash';
// import { taskType } from '~/enum/enum';

// import { Table } from '@hvisions/h-ui';
// import styles from './style.scss'

// const getFormattedMsg = i18n.getFormattedMsg;
// const { showTotal } = page;

// const EmptyPalletDeliveryPage = ({ history }) => {
//   const [tableData, setTableData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPage, setTotalPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState(null);

//   const state = {
//     0: '新建', 1: '下架中', 2: '已完成'
//   }
//   const [selectedstatus, setSelectedstatus] = useState('0');

//   const [addOrUpdateVis, setAddOrUpdateVis] = useState(false);
//   const [addOrUpdateData, setAddOrUpdateData] = useState({});
//   const addOrUpdateForm = useRef();



//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//       width: 100,
//       fixed: 'left',
//       filters: [
//         {
//           text: 'Joe',
//           value: 'Joe',
//         },
//         {
//           text: 'John',
//           value: 'John',
//         },
//       ],
//       onFilter: (value, record) => record.name.indexOf(value) === 0,
//     },
//     {
//       title: 'Other',
//       children: [
//         {
//           title: 'Age',
//           dataIndex: 'age',
//           key: 'age',
//           width: 200,
//           sorter: (a, b) => a.age - b.age,
//         },
//         {
//           title: 'Address',
//           children: [
//             {
//               title: 'Street',
//               dataIndex: 'street',
//               key: 'street',
//               width: 200,
//             },
//             {
//               title: 'Block',
//               children: [
//                 {
//                   title: 'Building',
//                   dataIndex: 'building',
//                   key: 'building',
//                   width: 100,
//                 },
//                 {
//                   title: 'Door No.',
//                   dataIndex: 'number',
//                   key: 'number',
//                   width: 100,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       title: 'Company',
//       children: [
//         {
//           title: 'Company Address',
//           dataIndex: 'companyAddress',
//           key: 'companyAddress',
//           width: 200,
//         },
//         {
//           title: 'Company Name',
//           dataIndex: 'companyName',
//           key: 'companyName',
//         },
//       ],
//     },
//     {
//       title: 'Gender',
//       dataIndex: 'gender',
//       key: 'gender',
//       width: 80,
//       fixed: 'right',
//     },
//   ];

//   const data = [];
//   for (let i = 0; i < 100; i++) {
//     data.push({
//       key: i,
//       name: 'John Brown',
//       age: i + 1,
//       street: 'Lake Park',
//       building: 'C',
//       number: 2035,
//       companyAddress: 'Lake Street 42',
//       companyName: 'SoftLake Co',
//       gender: 'M',
//     });
//   }

//   return (
//     <>
//       <HVLayout>
 
//         <HVLayout.Pane
//           icon={<i className="h-visions hv-table" />}
//           title={getFormattedMsg('EmptyPalletDelivery.title.tableName')}
         
//         >
 
//  <Table
//     columns={columns}
//     dataSource={data}
//     bordered
//     size="middle"
//     scroll={{ x: '130%', y: 240 }}
//   />,
//         </HVLayout.Pane>
//       </HVLayout>
//     </>
//   );
// };
// export default EmptyPalletDeliveryPage;