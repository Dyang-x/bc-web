import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import MaterialService from '~/api/material';
import { withPermission } from '@hvisions/core';
import { isChineseLocale } from '@hvisions/core/lib/store/session/selector.js';
import {
  addClassToMaterial,
  addPropertyToMaterials,
  findByMaterialId,
  deletePropertyToMaterials,
  removeClassToMaterial,
  findPropertyByMaterialId,
  updateMaterialProperty
} from '~/api/materialProperties';
import { Descriptions, Divider, notification, Modal, Button, HVTable, HIcon } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import MaterialPropertyForm from './MaterialPropertyForm';

const getFormattedMsg = i18n.getFormattedMsg;
const isChinese = isChineseLocale();
const UpdateButton = withPermission('a', 'update_detail');
const DeleteButton = withPermission('a', 'delete_detail');
const CreateButton = withPermission(Button, 'CREATE_detail');
const MaterialInfoCard = ({ materialData }) => {
  const [columns, setColumns] = useState({});
  const [list, setList] = useState([]);
  const [list_, setList_] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});

  const formRef = useRef(null);

  useEffect(() => {
    getExtend();
  }, []);

  useEffect(() => {
    if (isEmpty(materialData)) return;
    loadData();
    loadDataClass();
  }, [materialData]);

  const loadDataClass = async () => {
    await findByMaterialId(materialData.id)
      .then(items => {
        setList_(items);
      })
      .catch(err => {
        notification.warning({
          message: err.message
        });
      });
  };

  const loadData = async () => {
    await setLoading(true);
    await findPropertyByMaterialId(materialData.id)
      .then(items => {
        setList(items);
      })
      .catch(err => {
        notification.warning({
          message: err.message
        });
      });
    await setLoading(false);
  };

  const getExtend = () => {
    MaterialService.getExtendColumns()
      .then(item => {
        setColumns(item);
      })
      .catch(err => {
        notification.warning({
          message: getFormattedMsg('global.notify.fail_only'),
          description: err.message
        });
      });
  };

  const renderExtendCard = () => {
    return (
      <Descriptions bordered>
        {!isEmpty(columns) &&
          columns.map((item, index) => (
            <Descriptions.Item key={index} label={isChinese ? item.chName : item.enName}>
              {materialData.extend[item.columnName]}
            </Descriptions.Item>
          ))}
      </Descriptions>
    );
  };

  const renderCard = () => (
    <Descriptions bordered column={3} style={{ marginBottom: 30 }}>
      <Descriptions.Item label={getFormattedMsg('material.label.materialGroup')}>
        {materialData.materialGroupDesc}
      </Descriptions.Item>
      <Descriptions.Item label={getFormattedMsg('material.label.materialUom')}>
        {materialData.uomName}
      </Descriptions.Item>
      <Descriptions.Item label={getFormattedMsg('material.label.materialEigenvalue')}>
        {materialData.eigenvalue}
      </Descriptions.Item>
      <Descriptions.Item label={getFormattedMsg('material.label.serialNumberProfileForMaterial')}>
        {materialData.serialNumberProfile
          ? getFormattedMsg('material.label.yes')
          : getFormattedMsg('material.label.no')}
      </Descriptions.Item>
      <Descriptions.Item label={getFormattedMsg('material.label.createTimeForMaterial')}>
        {materialData.createTime}
      </Descriptions.Item>
      <Descriptions.Item label={getFormattedMsg('material.label.materialDesc')}>
        {materialData.materialDesc}
      </Descriptions.Item>
    </Descriptions>
  );

  const temp = {}; // 当前重复的值,支持多列
  const mergeCells = (text, array, columns) => {
    let i = 0;
    if (text !== temp[columns]) {
      temp[columns] = text;
      array.forEach(item => {
        if (item.classId === temp[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };

  const temp1 = {}; // 当前重复的值,支持多列
  const mergeCells1 = (text, array, columns) => {
    let i = 0;
    if (text === null) {
      return 1;
    }
    if (text !== temp1[columns]) {
      temp1[columns] = text;
      array.forEach(item => {
        if (item.classId === temp1[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };

  const temp2 = {}; // 当前重复的值,支持多列
  const mergeCells2 = (text, array, columns) => {
    let i = 0;
    if (text === null) {
      return 1;
    }
    if (text !== temp2[columns]) {
      temp2[columns] = text;
      array.forEach(item => {
        if (item.classId === temp2[columns]) {
          i += 1;
        }
      });
    }
    return i;
  };

  const columns_ = [
    {
      title: getFormattedMsg('materialProperties.label.propertyCode'),
      dataIndex: 'code'
    },
    {
      title: getFormattedMsg('materialProperties.label.propertyName'),
      dataIndex: 'name'
    },
    {
      title: getFormattedMsg('materialProperties.label.value'),
      dataIndex: 'value',
      width: 150
    },
    {
      title: getFormattedMsg('materialProperties.label.code'),
      dataIndex: 'classCode',
      render: (text, record) => {
        const obj = {
          children: text || '-',
          props: {}
        };
        obj.props.rowSpan = mergeCells(record.classId, list, 'classId');
        return obj;
      }
    },
    {
      title: getFormattedMsg('materialProperties.label.name'),
      dataIndex: 'className',
      render: (text, record) => {
        const obj = {
          children: text || '-',
          props: {}
        };
        obj.props.rowSpan = mergeCells2(record.classId, list, 'classId');
        return obj;
      }
    },
    {
      title: '操作',
      colSpan: 0,
      width: 80,
      dataIndex: 'options',
      render: (_, item) => [
        <UpdateButton
          style={item.isConst ? { color: 'rgba(0,0,0,.65)', opacity: 0.4 } : {}}
          key="update"
          href="#"
          onClick={onEdit(item)}
        />
      ]
    },
    {
      title: '操作',
      dataIndex: 'optionsClass',
      colSpan: 2,
      width: 80,
      render: (_, record) => {
        const obj = {
          children:
            record.classId !== null ? (
              <DeleteButton
                style={{ color: 'var(--ne-delete-button-font)' }}
                key="delete1"
                href="#"
                onClick={onRemove(record)}
              />
            ) : (
              <DeleteButton
                style={{ color: 'var(--ne-delete-button-font)' }}
                key="delete"
                href="#"
                onClick={onRemoveOne(record)}
              />
            ),
          props: {}
        };
        obj.props.rowSpan = mergeCells1(record.classId, list, 'classId');
        return obj;
      }
    }
  ];

  const onEdit = item => e => {
    e.preventDefault();
    e.stopPropagation();
    if (isEmpty(materialData)) {
      notification.warning({
        message: '无物料信息'
      });
      return;
    }
    if (item.isConst) {
      notification.warning({
        message: '该属性为常量类型，不可修改'
      });
      return;
    }
    setIsEdit(true);
    setFormData(item);
    setIsCreate(true);
    setVisible(true);
  };

  const onCreate = () => e => {
    e.preventDefault();
    e.stopPropagation();
    if (isEmpty(materialData)) {
      notification.warning({
        message: '无物料信息'
      });
      return;
    }
    setIsEdit(false);
    setFormData({});
    setIsCreate(true);
    setVisible(true);
  };

  const onRemoveOne = item => e => {
    e.preventDefault();
    e.stopPropagation();
    //console.log(item.classId);
    if (item.classId !== null) {
      notification.warning({
        message: '有类型信息，不可删除'
      });
      return;
    }
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: item.name }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        try {
          await deletePropertyToMaterials(item.id);
          await loadData();
          notification.success({
            message: getFormattedMsg('global.notify.success', { action })
          });
        } catch (err) {
          notification.warning({
            message: getFormattedMsg('global.notify.fail', { action }),
            description: err.message
          });
        }
      }
    });
  };

  const onRemove = item => e => {
    e.preventDefault();
    e.stopPropagation();
    if (item.classId === null) {
      notification.warning({
        message: '无类型信息，不可删除'
      });
      return;
    }
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: item.classCode }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        try {
          await removeClassToMaterial(item.classId, materialData.id);
          await loadData();
          await loadDataClass();
          notification.success({
            message: getFormattedMsg('global.notify.success', { action })
          });
        } catch (err) {
          notification.warning({
            message: getFormattedMsg('global.notify.fail', { action }),
            description: err.message
          });
        }
      }
    });
  };

  const modalFoot = () => [
    <Button key="cancel" onClick={() => setVisible(false)}>
      {getFormattedMsg('global.btn.cancel')}
    </Button>,
    <Button key="save" loading={btnLoading} type="primary" onClick={onHandleOk}>
      {getFormattedMsg('global.btn.save')}
    </Button>
  ];

  const onHandleOk = () => {
    if (isEmpty(materialData)) {
      notification.warning({
        message: '无物料信息'
      });
      return;
    }
    const { validateFields } = formRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      const action = formData.id
        ? getFormattedMsg('global.btn.modify')
        : getFormattedMsg('global.btn.create');
      await setBtnLoading(true);
      if (!isCreate) {
        await addClassToMaterial(values.id, materialData.id)
          .then(() => {
            loadData();
            loadDataClass();
            setVisible(false);
            notification.success({
              message: getFormattedMsg('global.notify.success', { action })
            });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('global.notify.fail', { action }),
              description: err.message
            });
          });
      } else {
        await addPropertyToMaterials({ ...formData, ...values, materialId: materialData.id })
          .then(() => {
            setVisible(false);
            loadData();
            notification.success({
              message: getFormattedMsg('global.notify.success', { action })
            });
          })
          .catch(err => {
            notification.warning({
              message: getFormattedMsg('global.notify.fail', { action }),
              description: err.message
            });
          });
      }

      await setBtnLoading(false);
    });
  };

  const onChangeTab = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreate(!isCreate);
  };

  return (
    <>
      <div style={{ marginBottom: 'var(--ne-basic-space)' }}>
        <HIcon h-type="attribute"></HIcon>
        {getFormattedMsg('material.label.materialInfo')}
      </div>
      {!isEmpty(materialData) && renderCard()}

      <div style={{ marginBottom: 'var(--ne-basic-space)' }}>
        <HIcon h-type="attribute"></HIcon>
        {getFormattedMsg('material.label.materialExcute')}
      </div>
      {!isEmpty(materialData) && renderExtendCard()}

      <div
        style={{
          marginBottom: 'var(--ne-button-space)',
          marginTop: 'var(--ne-basic-space)',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HIcon h-type="attribute"></HIcon>
          {'自定义属性'}
        </div>
        <div>
          <CreateButton h-icon="add" type="primary" onClick={onCreate()} />
          <Button
            icon="reload"
            onClick={() => {
              if (isEmpty(materialData)) return;
              loadData();
              loadDataClass();
            }}
            style={{ marginLeft: 'var(--ne-button-space)' }}
          ></Button>
        </div>
      </div>
      <HVTable
        bordered
        rowKey={record => record.id}
        dataSource={list.map((item, index) => ({
          ...item,
          serialNumber: ++index
        }))}
        loading={loading}
        columns={columns_}
        pagination={false}
      />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose
        title={
          <>
            <span>
              {isCreate ? (isEdit ? '修改自定义属性' : '新增自定义属性') : '选择自定义属性'}
            </span>
            {!isEdit && (
              <>
                <Divider type="vertical" />
                <a href="#" style={{ fontSize: 12 }} onClick={onChangeTab}>
                  {!isCreate ? '新增自定义属性' : '选择自定义属性'}
                </a>
              </>
            )}
          </>
        }
        footer={modalFoot()}
      >
        <MaterialPropertyForm
          formData={formData}
          items={list_.map(i => i.id)}
          isCreate={isCreate}
          ref={formRef}
        />
      </Modal>
    </>
  );
};

MaterialInfoCard.propTypes = {
  materialData: PropTypes.object
};

export default MaterialInfoCard;
