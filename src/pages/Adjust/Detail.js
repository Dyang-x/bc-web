import React from 'react';
import { createBlock, Page } from '@needle/kernel';
import { ButtonListBlock, FormBlock, TableBlock, OLayout } from '@needle/block';
import {
  Button,
  Input,
  notification,
  Modal,
  InputNumber,
  Select,
  Cascader
} from '@hvisions/h-ui';
import { i18n , withPermission} from '@hvisions/core';
import { tree } from '@hvisions/toolkit';
import adjustService from '~/api/adjust';
import waresLocationService from '~/api/waresLocation';
import materialService from '~/api/material';
const { formatTree } = tree;
const tableBlock = createBlock(TableBlock);
const formBlock = createBlock(FormBlock);
const buttonListBlock = createBlock(ButtonListBlock);

const getFormattedMsg = i18n.getFormattedMsg;
let layout;

const CreateButton = withPermission(Button, 'Create_Detail');
const ConfirmButton = withPermission(Button, 'Confirm_Detail');
const DeleteButton = withPermission('a', 'Delete_Detail');


export default class Detail extends Page {
  constructor(props) {
    super(OLayout, props, {});
  }

  state = {
    btnLoading: false,
    data: [],
    fetching: false,
    status: {},
    selectedRowKeys: []
  };
  created() {
    layout = this.getLayout();
    layout.setBlock('middle', tableBlock);
    layout.setBlock('tool', buttonListBlock);
    layout.setOptions({ title: getFormattedMsg('wms.label.detail'), height: 600 });

    buttonListBlock.setConfig({
      dataSource: [
        {
          component: (
            <CreateButton type="primary" icon="plus" onClick={this.handleCreate()}>
              {getFormattedMsg('global.btn.create')}
            </CreateButton>
          ),
          key: 'create'
        },
        {
          component: (
            <ConfirmButton type="primary" onClick={this.handleConfirm()}>
              {getFormattedMsg('wms.label.confirm')}
            </ConfirmButton>
          ),
          key: 'confirm'
        }
      ]
    });
    tableBlock.setConfig({
      filterColumn: 'opt',
      sequence: true,
      key: 'wms_adjust_detail'
    });
    tableBlock.setColumns([
      {
        title: getFormattedMsg('wms.label.materialCode'),
        dataIndex: 'materialCode',
        width: 100
      },
      {
        title: getFormattedMsg('wms.label.materialName'),
        dataIndex: 'materialName',
        width: 100
      },
      {
        title: getFormattedMsg('wms.label.materialBatchNum'),
        dataIndex: 'materialBatchNum',
        width: 150
      },
      {
        title: getFormattedMsg('wms.label.locationName'),
        dataIndex: 'locationName',
        width: 100
      },
      {
        title: getFormattedMsg('wms.label.quantity'),
        dataIndex: 'quantity',
        width: 70
      },
      {
        title: getFormattedMsg('wms.label.description'),
        dataIndex: 'description',
        width: 150
      },
      {
        title: getFormattedMsg('global.label.operation'),
        dataIndex: 'opt',
        width: 80,
        render: (_, record) => [
          <DeleteButton key="delete" onClick={this.onHandleRemove(record)}>
            {getFormattedMsg('global.btn.delete')}
          </DeleteButton>
        ]
      }
    ]);

    formBlock.setConfig({
      columns: 1,
      formItems: [
        {
          label: '库位',
          key: 'locationId',
          component: <></>,
          rules: [
            {
              required: true,
              message: '请选择库位'
            }
          ]
        },
        {
          label: '物料批次',
          key: 'materialBatchNum',
          component: <Input placeholder="请输入物料批次" />,
          rules: [
            {
              required: true,
              message: '请输入物料批次'
            }
          ]
        },
        {
          label: '物料',
          key: 'materialId',
          component: <></>,
          rules: [
            {
              required: true,
              message: '请输入物料'
            }
          ]
        },
        {
          label: '增减数量',
          key: 'quantity',
          component: <InputNumber placeholder="请填写数量" />,
          rules: [
            {
              required: true,
              message: '请输入增减数量'
            }
          ]
        },
        {
          label: '原因',
          key: 'description',
          component: <Input placeholder="请填写原因" />
        }
      ]
    });

    this.detailDrawerKey = layout.createDrawer('detail-form', formBlock, {
      destroyOnClose: true,
      footer: (
        <>
          <Button key="cancel" onClick={() => layout.closeDrawer(this.detailDrawerKey)}>
            {getFormattedMsg('global.btn.cancel')}
          </Button>
          <Button type="primary" loading={this.state.btnLoading} onClick={() => this.handleSave()}>
            {getFormattedMsg('global.btn.save')}
          </Button>
        </>
      )
    });
  }

  mounted() {
    this.loadListById();
    this.loadTreeData();
    this.loadMaterial();
  }

  /**
   * 根据调整单id获取调整单每一项列表
   */

  loadListById = () => {
    adjustService.getLine(this.props.id).then(data => {
      tableBlock.setDataSource(data);
    });
  };

  /**
   * 初始化库位的数据
   */

  loadTreeData = async () => {
    await waresLocationService.findAllByQuery().then(result => {
      formBlock.setComponent(
        'locationId',
        <Cascader
          fieldNames={{ label: 'name', value: 'id' }}
          changeOnSelect
          options={formatTree(result)}
          placeholder="请选择储位"
        />
      );
    });
  };

  /**
   * 初始化下拉框的数据
   */
  loadMaterial = async () => {
    await materialService.findByQuery({ pageSize: 1000 }).then(data => {
      formBlock.setComponent(
        'materialId',
        <Select
          showSearch
          placeholder="请选择物料"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {data.content.map(item => (
            <Select.Option key={item.id} value={item.id} opt={item}>
              {item.materialName}
            </Select.Option>
          ))}
        </Select>
      );
    });
  };

  /**
   * 提交修改明细信息
   */

  handleSave = () => {
    formBlock.submit(async (err, value) => {
      if (err) {
        try {
          const obj = Object.assign(value, {
            deliverOrderId: this.props.id,
            locationId: value.locationId[0]
          });
          await adjustService.createLine(obj);
          await this.loadListById();
          layout.closeDrawer(this.detailDrawerKey);
          notification.success({
            message: '新增成功'
          });
        } catch (error) {
          notification.error({
            message: '新增失败',
            description: error.message
          });
        }
      }
    });
  };

  onHandleRemove = record => e => {
    e.preventDefault();
    e.stopPropagation();
    const _this = this;
    Modal.confirm({
      title: `确认删除?`,
      content: '',
      onOk: async () => {
        try {
          await adjustService.deleteLine(record.id);
          await _this.loadListById();
          notification.success({
            message: '删除成功'
          });
        } catch (error) {
          notification.error({
            message: '删除失败',
            description: error.message
          });
        }
      }
    });
  };

  handleCreate = () => e => {
    e.preventDefault();
    e.stopPropagation();
    formBlock.setDataSource({});
    layout.openDrawer(this.detailDrawerKey, {
      title: '新增明细'
    });
  };
  handleConfirm = () => e => {
    e.preventDefault();
    e.stopPropagation();
    adjustService.confirm(this.props.id)
      .then(() => {
        notification.success({
          message: "提交成功"
        });
        layout.closeDrawer(this.detailDrawerKey)
      })
      .catch(error => {
        notification.warning({
          message: '操作失败',
          description: error.message
        })
      });
  }
}
