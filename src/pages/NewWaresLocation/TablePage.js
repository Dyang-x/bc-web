import React, { useState, useEffect, useRef } from 'react';
import { Button, notification, Divider, Modal, DetachTable } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import waresLocationService from '~/api/waresLocation';
import RuleForm from './RuleForm';
const getFormattedMsg = i18n.getFormattedMsg;

let pid = undefined;
const TablePage = ({ id, visible_, setVisible_, formData_, setFormData_ }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const columns = [
    {
      title: getFormattedMsg('waresLocation.label.materialName'),
      dataIndex: 'materialName'
    },
    {
      title: getFormattedMsg('waresLocation.label.materialCode'),
      dataIndex: 'materialCode'
    },
    {
      title: getFormattedMsg('waresLocation.label.storeSafety'),
      dataIndex: 'storeMin'
    },
    {
      title: getFormattedMsg('waresLocation.label.storeMax'),
      dataIndex: 'storeMax'
    },
    {
      title: getFormattedMsg('waresLocation.label.unit'),
      dataIndex: 'unit'
    },
    {
      title: getFormattedMsg('waresLocation.label.remark'),
      dataIndex: 'remark'
    },
    {
      title: getFormattedMsg('global.label.operation'),
      dataIndex: 'opt',
      width: 120,
      render: (_, record) => [
        <a key="edit" onClick={onHandleEdit(record)}>
          {getFormattedMsg('global.btn.modify')}
        </a>,
        <Divider type="vertical" key="divider" />,
        <a
          key="delete"
          onClick={onHandleRemove(record)}
          style={{ color: 'var(--ne-delete-button-font)' }}
        >
          {getFormattedMsg('global.btn.delete')}
        </a>
      ]
    }
  ];

  useEffect(() => {
    loadMaterialData();
  }, []);

  useEffect(() => {
    pid = id;
    loadData();
  }, [id]);

  const loadMaterialData = async () => {
    await waresLocationService
      .getAllMaterials()
      .then(result => {
        setMaterialList(result);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };

  const onHandleRemove = data => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.materialName || '' }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await waresLocationService.deleteLocationRule(data.id);
          await loadData();
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

  const loadData = async () => {
    if (pid === undefined) {
      return;
    }
    setLoading(true);
    await waresLocationService
      .getRuleByLocationId(pid)
      .then(result => {
        setList(result);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
    setLoading(false);
  };

  const onHandleEdit = record => e => {
    e.preventDefault();
    e.stopPropagation();
    setFormData_(record);
    setVisible_(true);
  };

  const modalFoot = () => [
    <Button key="cancel" onClick={() => setVisible_(false)}>
      {getFormattedMsg('global.btn.cancel')}
    </Button>,
    <Button key="save" loading={btnLoading} type="primary" onClick={onHandleOk}>
      {getFormattedMsg('global.btn.save')}
    </Button>
  ];

  const onHandleOk = () => {
    const { validateFields } = formRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      setBtnLoading(true);
      const material = materialList.find(i => i.id === values.materialId);
      values.materialCode = material ? material.materialCode : '';
      values.materialName = material ? material.materialName : '';
      if (formData_.id) {
        await waresLocationService
          .updateLocationRule({ ...formData_, ...values })
          .then(() => {
            notification.success({
              message: '修改成功'
            });
            loadData();
            setVisible_(false);
            setFormData_({});
          })
          .catch(error => {
            notification.warning({
              message: '修改失败',
              description: error.message
            });
          });
      } else {
        await waresLocationService
          .createLocationRule({ ...values, locationId: pid })
          .then(() => {
            notification.success({
              message: '新增成功'
            });
            loadData();
            setVisible_(false);
            setFormData_({});
          })
          .catch(error => {
            notification.warning({
              message: '新增失败',
              description: error.message
            });
          });
      }
      setBtnLoading(false);
    });
  };

  const { Table } = DetachTable(columns);
  return (
    <>
      <Table dataSource={list} loading={loading} rowKey="id" columns={columns} />
      <Modal
        visible={visible_}
        destroyOnClose
        onCancel={() => setVisible_(false)}
        title={
          formData_.id
            ? `${getFormattedMsg('global.btn.modify')}存储规则`
            : `${getFormattedMsg('global.btn.create')}存储规则`
        }
        footer={modalFoot()}
        width={500}
      >
        <RuleForm materialList={materialList} formData={formData_} ref={formRef} />
      </Modal>
    </>
  );
};

export default TablePage;
