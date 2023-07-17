import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, DetachTable, Modal, Spin, HIcon, Tooltip } from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import { DetailComponent } from '@hvisions/core';
import InfoForm from './InfoForm';
import { CacheTable } from '~/components';
import supplierService from '~/api/supplier';
import AddMatreialForm from './AddMatreialForm';
import putInStoragApi from '~/api/putInStorage';
import waresLocationService from '~/api/waresLocation';
import { isEmpty } from 'lodash';

const getFormattedMsg = i18n.getFormattedMsg;
const ManualInStorageOperate = props => {
  const lineId = props.location.state ? props.location.state.id : '';
  const purchaseNo = props.location.state ? props.location.state.purchaseNo : '';
  const pstate = props.location.state ? props.location.state.state : '';
  const ptype = props.location.state ? props.location.state.type : '';
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [supplierList, setSupplierList] = useState([]);
  const [addVisible, setAddVisible] = useState(false);
  const [orderLineId, setOrderLineId] = useState(lineId);
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [state, setState] = useState(pstate);

  const [inMaterialList, setInMaterialList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [formData, setFormData] = useState(null);
  const addForm = useRef();
  const formRef = useRef();

  const type = [
    { key: 2, value: '手动入库' },
    { key: 1, value: '原料采购入库' },
    { key: 3, value: '半成品生产入库' },
    { key: 9, value: '半成品余料回库' },
    { key: 10, value: '原料余料回库' },
    { key: 11, value: '原料退料入库' },
  ]
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    if (orderLineId) {
      getOrderById(orderLineId);
    } else {
      createOrderId();
    }

    loadTreerData();
    // getSupplierByQuery();
  }, []);

  useEffect(() => {
    props.setButtons([
      <Button
        type="primary"
        key="1"
        onClick={formRef.current?.save}
        disabled={state != 1}
      >
        <HIcon h-type="save" />
        保存
      </Button>,
      <Button type="primary" key="2" onClick={handleSubmiit} disabled={!orderLineId || state != 1}>
        <HIcon h-type="save" />确认入库
      </Button>,
      <Button type="primary" key="2" onClick={handleInShelf} disabled={!orderLineId || state != 1}>
        上架
      </Button>
    ]);
  }, [purchaseOrderDetail, state, orderLineId]);

  const rowSelection = {
    hideDefaultSelections: false,
    type: 'radio',
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      const data = [];
      for (let i = 0; i < selectedRows.length; i++) {
        data.push(selectedRows[i].id);
      }
      setCheckedIds(data);
      setCheckedData(selectedRows);
      if (selectedRows[0].details && selectedRows[0].details.length > 0) {
        setTableData2(selectedRows[0]['details']);
      } else {
        setTableData2([]);
      }
    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };
  const columns1 = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      render: (_, record) => {
        if (!record.materialCode) {
          return '暂无';
        } else {
          return (<Tooltip placement="left" title={record.materialCode}>
          {record.materialCode}
        </Tooltip>)
        }
      },
      width: 100
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      render: (_, record) => {
        if (!record.materialName) {
          return '暂无';
        } else {
          return (<Tooltip placement="left" title={record.materialName}>
          {record.materialName}
        </Tooltip>)
        }
      },
      width: 100
    },
    {
      title: '入库数量',
      dataIndex: 'inNuber',
      key: 'inNuber',
      render: (_, record) => {
        if (!record.inNuber) {
          return '0';
        }
        return (<Tooltip placement="left" title={`${record.inNuber}`}>
        {`${record.inNuber}`}
      </Tooltip>);
      },
      width: 100
    },
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    //   key: 'state',
    //   render: (_, record) => {
    //     if (!record.state) {
    //       return '暂无';
    //     }
    //     return `${record.state}`;
    //   },
    //   width: 80
    // },

    {
      title: getFormattedMsg('global.label.operation'),
      key: 'opt',
      width: 80,
      fixed: 'right',
      render: (_, record) => [
        state == 1 && (
          <a
            key="edit"
            onClick={() => onHandleDeleteOrder(record)}
            style={{ color: 'var(--ne-delete-button-font)' }}
          >
            删除
          </a>
        )
      ]
    }
  ];

  const columns2 = [
    {
      title: '批次号',
      dataIndex: 'batchNum',
      key: 'batchNum',
      render: (_, record) => {
        if (!record.batchNum) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.batchNum}>
        {record.batchNum}
      </Tooltip>)
      },
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
      render: (_, record) => {
        if (!record.number) {
          return '0';
        }
        return (<Tooltip placement="left" title={record.number}>
        {record.number}
      </Tooltip>)
      },
      width: 100
    },
    {
      title: '库位',
      dataIndex: 'locationName',
      key: 'locationName',
      render: (_, record) => {
        if (!record.locationName) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.locationName}>
        {record.locationName}
      </Tooltip>)
      },
      width: 100
    },

    {
      title: getFormattedMsg('global.label.operation'),
      key: 'opt',
      width: 80,
      // fixed: 'right',
      render: (_, record) => [
        state == 1 && (
          <a
            key="edit"
            onClick={() => onHandleDeletePatch(record)}
            style={{ color: 'var(--ne-delete-button-font)' }}
          >
            删除
          </a>
        )
      ]
    }
  ];

  const handleInShelf =()=>{
    Modal.confirm({
      title:'确认开始上架?',
      onOk:async ()=>{
        await putInStoragApi
        .inShelf(purchaseOrderDetail.id)
        .then(() => {
          notification.success({
            message: '物料开始上架'
          });
        })
        .catch(err => {
          notification.warning({
            message: '提交失败',
            description: err.message
          });
        });
      },
      oncancel(){}
    })
  }

  const showAddMaterial = () => {
    setAddVisible(true);
  };

  const handleSubmiit = async () => {
    await putInStoragApi
      .handleInStore(purchaseOrderDetail.id)
      .then(() => {
        notification.success({
          message: '提交成功'
        });
      })
      .catch(err => {
        notification.warning({
          message: '提交失败',
          description: err.message
        });
      });
  };

  const onHandleInStorage = record => {
    setAddVisible(true);
    setFormData(record);
  };
  const getOrderById = async id => {
    setLoading(true);
    await putInStoragApi
      .getOrderById(id)
      .then(res => {
        setPurchaseOrderDetail(res);
        setTableData1(res.lines);
        if (selectedRowKeys && selectedRowKeys.length > 0) {
          const data = res.lines.filter(item => selectedRowKeys[0] == item.id);
          if (data.length > 0) {
            setTableData2(data[0]['details']);
          } else {
            setTableData2([])
          }
        }
        const list = res.lines;
        const tempList = [];
        for (let i = 0; i < list.length; i++) {
          tempList.push({
            id: list[i]['id'],
            materialId: list[i]['materialId'],
            materialName: list[i]['materialName']
          });
        }
        setInMaterialList(tempList);
        setLoading(false);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
        setLoading(false);
      });
  };
  const handleCancelAdd = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVisible(false);
    setFormData(null);
  };

  const onHandleDeletePatch = data => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.batchNum }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await putInStoragApi
          .deleteDetail(data.id)
          .then(() => {
            getOrderById(orderLineId);
            notification.success({
              message: '删除成功',
              description: '删除批次信息成功'
            });
          })
          .catch(err => {
            notification.warning({
              message: '删除失败',
              description: err.message
            });
          });
      }
    });
  };
  const createOrderByPurchaseOrder = async number => {
    await putInStoragApi
      .createOrderByPurchaseOrder(number)
      .then(res => {

        setPurchaseOrderDetail(res);
        setTableData1(res.lines);
        const list = res.lines;
        const tempList = [];
        for (let i = 0; i < list.length; i++) {
          tempList.push({
            id: list[i]['id'],
            materialId: list[i]['materialId'],
            materialName: list[i]['materialName']
          });
        }
        setInMaterialList(tempList);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };
  const onHandlecreate = data => {
    const number = data.purchaseOrderNum;
    createOrderByPurchaseOrder(number);
  };

  const loadTreerData = async () => {
    await waresLocationService
      .findAllByQuery()
      .then(res => {
        setTreeData(res);
      })
      .catch(err => {
        notification.warning({
          message: '库位获取失败',
          description: err.message
        });
      });
  };
  const modalFoot = () => [
    <Button key="save" type="primary" onClick={onHandleSave}>
      保存
    </Button>,
    <Button key="save-next" type="primary" onClick={onHandleNext}>
      继续并下一条
    </Button>,
    <Button key="cancel" onClick={onHandleCancel}>
      取消
    </Button>
  ];
  const onHandleSave = data => {
    const { getFieldsValue, validateFields } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (params.locationId.length < 2) {
        notification.warning({
          message: '请选择库位'
        });
        return;
      }
      params.locationId = params.locationId.pop();
      params.headerId = purchaseOrderDetail.id;
      params.receiptNumber = purchaseOrderDetail.receiptNumber
      params.type = selectedType
      confirmSave(params);
      onHandleCancel();
    });
  };
  const onHandleNext = () => {
    const { getFieldsValue, resetFields, setFieldsValue, validateFields } = addForm.current;
    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      if (params.locationId.length < 2) {
        notification.warning({
          message: '请选择库位'
        });
        return;
      }
      const tempIds = [...params.locationId];
      params.locationId = params.locationId.pop();
      params.headerId = purchaseOrderDetail.id;
      params.receiptNumber = purchaseOrderDetail.receiptNumber
      params.type = selectedType
      confirmSave(params);
      // // resetFields()
      // setFormData(null)
      setFieldsValue({ batchNum: '', quantity: '', locationId: tempIds });
    });
  };
  const onHandleCancel = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVisible(false);
  };
  const confirmSave = async data => {
    await putInStoragApi
      .addStoreManual(data)
      .then(res => {
        notification.success({
          message: '添加物料成功'
        });
        setOrderLineId(res)
        orderLineId ? getOrderById(orderLineId) : getOrderById(res);
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };
  const onHandleDeleteOrder = record => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: record.materialName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await putInStoragApi
          .deleteLine(record.id)
          .then(() => {
            getOrderById(orderLineId);
            // if (record.id == selectedRowKeys[0]) {
            setSelectedRowKeys([]);
            setTableData2([]);
            // }
            notification.success({
              message: '删除成功',
              description: '删除入库信息成功'
            });
          })
          .catch(err => {
            notification.warning({
              message: '删除失败',
              description: err.message
            });
          });
      }
    });
  };
  // // 获取供应商
  // const getSupplierByQuery = async () => {
  //   await supplierService
  //     .getSupplierByQuery({ pageSize: 1000000 })
  //     .then(res => {
  //       setSupplierList(res.content);
  //     })
  //     .catch(err => {
  //       notification.warning({
  //         description: err.message
  //       });
  //     });
  // };
  const createOrderId = async () => {
    await putInStoragApi
      .createManual()
      .then(res => {
        setPurchaseOrderDetail(res);
        res.id && setOrderLineId(res.id);
        // notification.success({
        //   message: '创建入库单成功'
        // });
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };

  // 保存头部信息 saveHeaderInfo
  const onHandleSaveHeader = async data => {
    const params = {
      ...data,
      ...purchaseOrderDetail,
      supplierId: data && data.supplierId,
      type:data.type,
    };
    await putInStoragApi
      .saveHeaderInfo(params)
      .then(res => {
        getOrderById(res)
        setOrderLineId(res)
        setSelectedType(data.type)
        notification.success({
          message: '保存成功'
        });
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };
  // const goBack = () => {
  //     history.push({
  //         pathname: "/manual-putInStorage",
  //     })
  // }

  const onRowClick = record => {
    setCheckedData(record);
    setSelectedRowKeys([record.id]);
    if (record.details && record.details.length > 0) {
      setTableData2(record['details']);
    } else {
      setTableData2([]);
    }
  };
  const { Table: Table1, SettingButton: SettingButton1 } = useMemo(
    () => CacheTable({ columns: columns1, key: 'wms_manual_in_storage_operate_left' }),
    []
  );
  const { Table: Table2, SettingButton: SettingButton2 } = useMemo(
    () => CacheTable({ columns: columns2, key: 'wms_manual_in_storage_operate_right' }),
    []
  );
  return (
    <>
      <HVLayout>
        <HVLayout.Pane style={{ overflow: 'hidden' }} height={'auto'}>
          <InfoForm
            onHandlecreate={onHandlecreate}
            handleSave={onHandleSaveHeader}
            detail={purchaseOrderDetail}
            // supplierList={supplierList}
            // goBack={goBack}
            handleSubmiit={handleSubmiit}
            wrappedComponentRef={formRef}
            state={state}
            type={type}
            setSelectedType={setSelectedType}
          />
        </HVLayout.Pane>
        <HVLayout layout="horizontal">
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title="入库清单"
            buttons={[
              <Button
                key="add"
                type="primary"
                h-icon="add"
                onClick={showAddMaterial}
                disabled={state != 1 ? true : false}
              >
                添加物料
              </Button>
            ]}
            settingButton={<SettingButton1 />}
            onRefresh={() => getOrderById(orderLineId)}
          >
            <Table1
              pagination={false}
              loading={loading}
              scroll={{ x: 'max-content' }}
              dataSource={tableData1}
              columns={columns1}
              rowKey={record => record.id}
              rowSelection={rowSelection}
              onRow={record => {
                return {
                  onClick: () => {
                    onRowClick(record);
                  }
                };
              }}
            />
          </HVLayout.Pane>
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title="批次详情"
            settingButton={<SettingButton2 />}
            onRefresh={() => getOrderById(orderLineId)}
          >
            <Table2
              loading={loading}
              pagination={false}
              // scroll={{ x: 'max-content' }}
              dataSource={tableData2}
              columns={columns2}
              rowKey={record => record.id}
            />
          </HVLayout.Pane>
        </HVLayout>
      </HVLayout>
      <Modal
        title="入库操作"
        visible={addVisible}
        onCancel={handleCancelAdd}
        footer={modalFoot()}
        width={500}
      >
        <AddMatreialForm
          ref={addForm}
          modifyData={formData}
          inMaterialList={inMaterialList}
          treeData={treeData}
        />
      </Modal>
    </>
  );
};

export default DetailComponent(ManualInStorageOperate);
