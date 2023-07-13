import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  HVLayout,
  Button,
  notification,
  Modal,
  Spin,
  Divider,
  Drawer,
  HIcon,
  Icon,
  Tooltip
} from '@hvisions/h-ui';
import { i18n } from '@hvisions/toolkit';
import { DetailComponent } from '@hvisions/core';
import styles from './style.scss';
import InfoForm from './InfoForm';
import supplierService from '~/api/supplier';
import AddMatreialForm from './AddMatreialForm';
import { CacheTable } from '~/components';
import waresLocationService from '~/api/waresLocation';
import retrievalApi from '~/api/retrieval';
import StockOutForm from './StockOutForm';

const getFormattedMsg = i18n.getFormattedMsg;
const RetrievalOperate = ({ history, ...props }) => {
  const lineId = props.location.state ? props.location.state.id : '';
  const purchaseNo = props.location.state ? props.location.state.purchaseNo : '';
  const pstate = props.location.state ? props.location.state.state : '';
  const ptype = props.location.state ? props.location.state.type : '';
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [addVisible, setAddVisible] = useState(false);
  const [orderLineId, setOederLineId] = useState(lineId);
  const [purchaseOrderDetail, setPurchaseOrderDetail] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [state, setState] = useState(pstate);
  const [inMaterialList, setInMaterialList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [formData, setFormData] = useState(null);
  const [stockOutVisible, setStockOutVisible] = useState(false);
  const addForm = useRef();
  const formRef = useRef();
  const stockOutForm = useRef();

  const type = [
    { key: 1, value: '手动出库' },
    { key: 2, value: '原料领料出库' },
    { key: 4, value: '半成品领料出库' },
    { key: 13, value: '半成品退料出库' },
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
      <Button onClick={formRef.current?.save} key="b1" type="primary" disabled={state == 1}>
        <HIcon h-type="save" />
        保存
      </Button>,
      <Button type="primary" key="b2" onClick={handleSubmiit} disabled={state == 1 || !orderLineId}>
        出库完成
      </Button>
    ]);
  }, [purchaseOrderDetail, state]);

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
      if (selectedRows[0].stockOutingBatchDtos && selectedRows[0].stockOutingBatchDtos.length > 0) {
        setTableData2(selectedRows[0]['stockOutingBatchDtos']);
      } else {
        setTableData2([]);
      }
    },
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys);
    }
  };
  const onHandlStockOut = record => {
    setAddVisible(true);
    setFormData(record);
  };
  const columns1 = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      render: (_, record) => {
        if (!record.materialCode) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.materialCode}>
        {record.materialCode}
      </Tooltip>);
      },
      width: 150
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      render: (_, record) => {
        if (!record.materialName) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.materialName}>
        {record.materialName}
      </Tooltip>);
      },
      width: 180
    },
    {
      title: '出库数量',
      dataIndex: 'outNum',
      key: 'outNum',
      align: 'center',
      render: (_, record) => {
        if (!record.outNum) {
          return 0;
        }
        return (<Tooltip placement="left" title={record.outNum}>
        {record.outNum}
      </Tooltip>);
      },
      width: 100
    },
    {
      title: '计划数量',
      dataIndex: 'planNum',
      key: 'planNum',
      align: 'center',
      render: (_, record) => {
        if (!record.planNum) {
          return 0;
        }
        return (<Tooltip placement="left" title={record.planNum}>
        {record.planNum}
      </Tooltip>);
      },
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      render: (_, record) => {
        if (!record.description) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.description}>
        {record.description}
      </Tooltip>);
      },
      minWidth: 100
    },

    {
      title: getFormattedMsg('global.label.operation'),
      key: 'opt',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => [
        state != 1 && <a key="out" onClick={() => onHandlStockOut(record)}>
          出库
        </a>,
        state != 1 && <Divider type="vertical" key="divider1" />,
        state != 1 && (
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
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      render: (_, record) => {
        if (!record.batchNumber) {
          return '暂无';
        }
        return (<Tooltip placement="left" title={record.batchNumber}>
        {record.batchNumber}
      </Tooltip>);
      }
      // width:100
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
      key: 'num',
      render: (_, record) => {
        if (!record.num) {
          return 0;
        }
        return (<Tooltip placement="left" title={record.num}>
        {record.num}
      </Tooltip>);
      }
      // width:100
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
      </Tooltip>);
      }
      // width:100
    },

    {
      title: getFormattedMsg('global.label.operation'),
      key: 'opt',
      width: 100,
      align: 'center',
      render: (_, record) => [
        state != 1 && (
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

  const showAddMaterial = () => {
    setAddVisible(true);
  };
  const showOutMaterial = () => {
    setStockOutVisible(true);
  };

  const handleSubmiit = () => {
    Modal.confirm({
      title: getFormattedMsg('是否确认出库操作'),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await retrievalApi
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
      }
    });
  };

  const onHandleInStorage = record => {
    setAddVisible(true);
    setFormData(record);
  };
  const getOrderById = async id => {
    setLoading(true);
    await retrievalApi
      .getOrderById(id)
      .then(res => {
        setPurchaseOrderDetail(res);
        setTableData1(res.stockOutingLineDtos);
        if (selectedRowKeys && selectedRowKeys.length > 0) {
          const data = res.stockOutingLineDtos.filter(item => selectedRowKeys[0] == item.id);
          data.length > 0 && setTableData2(data[0]['stockOutingBatchDtos']);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        notification.warning({
          description: err.message
        });
      });
  };

  const handleCancelAdd = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVisible(false);
    setFormData(null);
  };

  const handleCancelOut = () => {
    setStockOutVisible(false);
  };

  const onHandleDeletePatch = data => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.batchNum }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        await retrievalApi
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
    await retrievalApi
      .createOrderByPurchaseOrder(number)
      .then(res => {
        setPurchaseOrderDetail(res);
        setTableData1(res.stockOutingLineDtos);
        const list = res.stockOutingLineDtos;
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
  const modalOutFoot = () => [
    <Button key="save" type="primary" onClick={onHandleSaveOut}>
      保存
    </Button>,
    // <Button key="save-next" type="primary" onClick={onHandleOutNext}>
    //     继续并下一条
    // </Button>,
    <Button key="cancel" onClick={onHandleCancelOut}>
      取消
    </Button>
  ];
  // 保存添加物料
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
      params.owId = purchaseOrderDetail.id;
      params.owNumber = purchaseOrderDetail.owNumber;
      params.stockType = selectedType
      confirmSave(params);
      onHandleCancel();
    });
  };
  const onHandleSaveOut = () => {
    const { getFieldsValue, validateFields, resetFields } = stockOutForm.current;

    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      params.headerId = orderLineId ? orderLineId : '';
      params.owNumber = purchaseOrderDetail.owNumber;
      params.stockType = selectedType
      confirmSaveOut(params);
      onHandleCancelOut();
    });
  };
  const onHandleNext = () => {
    const { getFieldsValue, resetFields, validateFields, setFieldsValue } = addForm.current;

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
      params.owId = purchaseOrderDetail.id;
      params.owNumber = purchaseOrderDetail.owNumber;
      setFieldsValue({ batchNumber: '', num: '', desc: '', locationId: tempIds });
      confirmSave(params);
      // resetFields()
      // setFormData(null)
    });
  };
  const onHandleOutNext = () => {
    const { getFieldsValue, validateFields, setFieldsValue } = stockOutForm.current;

    validateFields(async (err, values) => {
      if (err) return;
      const params = getFieldsValue();
      params.headerId = orderLineId;
      params.owNumber = purchaseOrderDetail.owNumber;
      setFieldsValue({ materialId: undefined, planNum: '', desc: '' });
      confirmSaveOut(params);
    });
  };
  const onHandleCancel = () => {
    const { resetFields } = addForm.current;
    resetFields();
    setAddVisible(false);
  };
  const onHandleCancelOut = () => {
    const { resetFields } = stockOutForm.current;
    resetFields();
    setStockOutVisible(false);
  };
  const confirmSave = async data => {
    await retrievalApi
      .addStoreManual(data)
      .then(res => {
        notification.success({
          message: '出库成功'
        });
        setOederLineId(res);
        orderLineId ? getOrderById(orderLineId) : getOrderById(res);
        // getOrderById(orderLineId)
      })
      .catch(err => {
        notification.warning({
          description: err.message
        });
      });
  };
  const confirmSaveOut = async data => {
    await retrievalApi
      .createLine(data)
      .then(res => {
        notification.success({
          message: '创建出库清单成功'
        });
        setOederLineId(res);
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
        await retrievalApi
          .deleteLine(record.id)
          .then(() => {
            getOrderById(orderLineId);
            if (record.id == selectedRowKeys[0]) {
              setSelectedRowKeys([]);
              setTableData2([]);
            }
            notification.success({
              message: '删除成功',
              description: '删除出库信息成功'
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
    await retrievalApi
      .createManual()
      .then(res => {
        setPurchaseOrderDetail(res);
        res.id && setOederLineId(res.id);
        // notification.success({
        //     message: "创建出库单成功"
        // });
      })
      .catch(err => {
        notification.warning({
          message: err.message
        });
      });
  };

  // 保存头部信息 saveHeaderInfo
  const onHandleSaveHeader = async data => {
    const params = {
      ...data,
      ...purchaseOrderDetail,
      associateNumber: data && data.associateNumber,
      stockType:data.type,
    };
    await retrievalApi
      .saveHeaderInfo(params)
      .then(res => {
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
  //         pathname: "/retrieval-managerment",
  //     })
  // }
  const onRowClick = record => {
    setCheckedData(record);
    setSelectedRowKeys([record.id]);
    if (record.stockOutingBatchDtos && record.stockOutingBatchDtos.length > 0) {
      setTableData2(record['stockOutingBatchDtos']);
    } else {
      setTableData2([]);
    }
  };
  const { Table: Table1, SettingButton: SettingButton1 } = useMemo(
    () => CacheTable({ columns: columns1, key: 'wms_in_storage_operate_left' }),
    []
  );
  const { Table: Table2, SettingButton: SettingButton2 } = useMemo(
    () => CacheTable({ columns: columns2, key: 'wms_in_storage_operate_right' }),
    []
  );

  return (
    <>
      <HVLayout style={{ height: 'calc(100vh - 135px)' }}>
        <HVLayout.Pane style={{ overflow: 'hidden' }} height={'auto'}>
          <InfoForm
            onHandlecreate={onHandlecreate}
            handleSave={onHandleSaveHeader}
            detail={purchaseOrderDetail}
            supplierList={supplierList}
            // goBack={goBack}
            handleSubmiit={handleSubmiit}
            wrappedComponentRef={formRef}
            type={type}
            setSelectedType={setSelectedType}
          />
        </HVLayout.Pane>
        <HVLayout layout="horizontal">
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title="出库清单"
            buttons={[
              <Button
                key="add"
                type="primary"
                className={styles['center']}
                onClick={showOutMaterial}
                disabled={state == 1 ? true : false}
              >
                <HIcon h-type="add" />
                添加出库清单
              </Button>,
              <Button
                key="out"
                type="primary"
                className={styles['center']}
                onClick={showAddMaterial}
                disabled={state == 1 ? true : false}
              >
                <Icon type="rollback" />
                直接出库
              </Button>
            ]}
            settingButton={<SettingButton1 />}
            onRefresh={() => {
              orderLineId && getOrderById(orderLineId);
            }}
          >
            <Spin spinning={loading}>
              <Table1
                pagination={false}
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
            </Spin>
          </HVLayout.Pane>
          <HVLayout.Pane
            icon={<i className="h-visions hv-table" />}
            title="批次详情"
            // buttons={
            //     [
            //         <Button key="add" type="primary" className={styles['center']} onClick={showAddMaterial} disabled={state == 1 ? true : false}><HIcon h-type="add"/>添加物料</Button>
            //     ]
            // }
            settingButton={<SettingButton2 />}
            onRefresh={() => {
              orderLineId && getOrderById(orderLineId);
            }}
          >
            <Spin spinning={loading}>
              <Table2
                pagination={false}
                // scroll={{ x: 'max-content' }}
                dataSource={tableData2}
                columns={columns2}
                rowKey={record => record.id}
              />
            </Spin>
          </HVLayout.Pane>
        </HVLayout>
      </HVLayout>
      <Drawer title="手动出库操作" visible={addVisible} onClose={handleCancelAdd} width={400}>
        <Drawer.DrawerContent>
          <AddMatreialForm ref={addForm} modifyData={formData} treeData={treeData} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
      <Modal
        title="添加出库单"
        visible={stockOutVisible}
        onCancel={handleCancelOut}
        footer={modalOutFoot()}
      >
        <StockOutForm ref={stockOutForm} modifyData={formData} />
      </Modal>
    </>
  );
};

export default DetailComponent(RetrievalOperate);
