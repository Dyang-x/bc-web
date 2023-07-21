import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isEmpty, debounce, unionBy, lte } from 'lodash';
import {
  HVLayout,
  Button,
  notification,
  Modal,
  Divider,
  Drawer,
  Spin,
  Descriptions
} from '@hvisions/h-ui';
import { DetailComponent } from '@hvisions/core';
import { i18n, tree } from '@hvisions/toolkit';
import Api from '~/api/adjust';
import waresLocationService from '~/api/waresLocation';
import DetailForm from './DetailForm';
import materialService from '~/api/material';
import { CacheTable } from '~/components';
import styles from './style.scss';
import { v1 } from 'uuid';

const { formatTree } = tree;
const { Pane } = HVLayout;
const getFormattedMsg = i18n.getFormattedMsg;
let lastFetchId = 0;
const Detail = ({ location, history, ...props }) => {
  const [data, setData] = useState({});
  const [summaryList, setSummaryList] = useState([]);
  const [detailList, setDetailList] = useState([]);
  const [locationTree, setLocationTree] = useState([]);
  const [visible, setVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [materialList, setMaterialList] = useState([]);
  const [fetching, setFetching] = useState(false);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [lineId, setLineId] = useState('');
  const goBack = () => history.goBack();

  const createOrderId = () => {
    Api.create({})
      .then(res => {
        setData(res);
      })
      .catch(error => {
        notification.warning({
          message: '操作失败',
          description: error.message
        });
      });
  };

  useEffect(() => {
    // if (isEmpty(location.state)) {
    //   goBack();
    // }
    loadTreeData();
    materialSearch('');
    !location.state && createOrderId();
    if (location.state) {
      loadData(location.state.info.id);
      setData(location.state.info);
    }
  }, [location]);

  useEffect(() => {
    props.setButtons(
      <Button
        disabled={data.state === '完成'}
        type="primary"
        icon="check"
        onClick={() => handleConfirm(data.id)}
      >
        {data.state === '完成' ? '已完成' : '完成'}
      </Button>
    );
  }, [data]);

  const loadTreeData = async () => {
    await waresLocationService
      .findAllByQuery()
      .then(result => {
        setLocationTree(formatTree(result));
      })
      .catch(err => {
        notification.warning({
          message: '查询失败',
          description: err.message
        });
      });
  };

  const materialSearch = async value => {
    lastFetchId += 1;
    const fetchId = lastFetchId;
    setMaterialList([]);
    setFetching(true);
    // await materialService.getMaterial(value, null).then(res => {
    const values = { keyWord: value }
    await materialService.getMaterial(values).then(res => {
      if (fetchId !== lastFetchId) {
        return;
      }
      const data = res.content.map(i => ({
        text: i.materialName,
        value: i.id,
        showValue: i.materialName + " -- " + i.extend.specification + " -- " + i.extend.materialType,
      }));
      setMaterialList(data);
      setFetching(false);
    });
  };

  const materialSearch_ = debounce(materialSearch, 500);

  const loadData = (id) => {
    setLoading(true);
    Api.summary(id)
      .then(res => {
        setSummaryList(res);
        setLoading(false);
      })
      .catch(err => {
        notification.warning({
          message: '查询失败',
          description: err.message
        });
        setLoading(false);
      });
    Api.getLine(id)
      .then(res => {
        setDetailList(res);
        setLoading(false);
      })
      .catch(err => {
        notification.warning({
          message: '查询失败',
          description: err.message
        });
        setLoading(false);
      });
  };

  const headerComponent = useMemo(() => {
    if (isEmpty(data)) return null;
    return (
      <Descriptions column={3} bordered>
        <Descriptions.Item label="调整单号">{data.code || ''}</Descriptions.Item>
        <Descriptions.Item label="调整时间">{data.createTime || ''}</Descriptions.Item>
        <Descriptions.Item label="操作人">{data.createUserName || ''}</Descriptions.Item>
      </Descriptions>
    );
  }, [data]);

  const handleConfirm = () => {
    Modal.confirm({
      title: `确认完成?`,
      content: '',
      onOk: async () => {
        await Api.confirm(lineId)
          .then(() => {
            notification.success({
              message: '完成成功'
            });
            goBack();
          })
          .catch(error => {
            notification.warning({
              message: '完成失败',
              description: error.message
            });
          });
      }
    });
  };

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   width: 70,
    //   fixed: 'left',
    //   render: (_, __, idx) => idx + 1,
    //   key:'id'
    // },
    {
      title: getFormattedMsg('wms.label.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 150,
      fixed: 'left'
    },
    {
      title: getFormattedMsg('wms.label.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      width: 150
    },
    {
      title: '调整后库存',
      align: 'center',
      dataIndex: 'after',
      key: 'after',
      width: 100
    },
    {
      title: '调整前库存',
      align: 'center',
      dataIndex: 'previous',
      key: 'previous',
      width: 100
    },
    {
      title: '调整库存',
      align: 'center',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    }
  ];

  const columns_ = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   width: 70,
    //   fixed: 'left',
    //   render: (_, __, idx) => idx + 1,
    //   key:'id',
    //   align:'center'
    // },
    {
      title: '仓库',
      dataIndex: 'locationName',
      width: 120,
      key: 'locationName',
      fixed: 'left'
    },
    // {
    //   title: getFormattedMsg('wms.label.materialBatchNum'),
    //   dataIndex: 'materialBatchNum',
    //   key: 'materialBatchNum',
    //   width: 120
    // },
    {
      title: getFormattedMsg('wms.label.materialCode'),
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 100
    },
    {
      title: getFormattedMsg('wms.label.materialName'),
      dataIndex: 'materialName',
      key: 'materialName',
      width: 100
    },
    {
      title: '调整后数量',
      dataIndex: 'after',
      width: 100,
      align: 'center',
      key: 'after'
    },
    {
      title: '调整前数量',
      dataIndex: 'origin',
      align: 'center',
      width: 100,
      key: 'origin'
    },
    {
      title: '调整数量',
      dataIndex: 'quantity',
      align: 'center',
      width: 100,
      key: 'quantity'
    },
    {
      title: '原因',
      dataIndex: 'description',
      width: 200,
      key: 'description'
    },
    data.state !== '完成'
      ? {
          title: '操作',
          align: 'center',
          width: 120,
          fixed: 'right',
          render: (_, record) => [
            <a href="" key="edit" onClick={handleOpenForm(record)}>
              修改
            </a>,
            <Divider type="vertical" key="divider" />,
            <a
              key="delete"
              onClick={onHandleDelete(record)}
              style={{ color: 'var(--ne-delete-button-font)' }}
            >
              删除
            </a>
          ],
          key: 'option'
        }
      : {}
  ];

  const handleOpenForm = (record = {}) => async e => {
    e.preventDefault();
    e.stopPropagation();
    setFormData(record);
    if (record.id) {
      const extend = {}
      await materialService.getMaterial({ materialCode: record.materialCode }).then(res => {
        extend.specification = res.content[0].extend.specification
        extend.materialType = res.content[0].extend.materialType
      });

      if (extend.specification == undefined) {
        extend.specification = ' '
      }
      if (extend.materialType == undefined) {
        extend.materialType = ' '
      }
      setMaterialList(e =>
        unionBy(
          [
            {
              value: record.materialId,
              text: record.materialName,
              showValue: record.materialName + " -- " + extend.specification + " -- " + extend.materialType,
            },
            ...e
          ],
          'value'
        )
      );
      // materialSearch(record.materialCode)
    }
    setVisible(true);
  };

  const onHandleDelete = (record = {}) => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: `确认删除【${record.materialBatchNum}】?`,
      content: '',
      onOk: async () => {
        await Api.deleteLine(record.id)
          .then(() => {
            notification.success({
              message: '删除成功'
            });
            lineId ? loadData(lineId) : loadData(location.state.info.id);
          })
          .catch(err => {
            notification.error({
              message: '删除失败',
              description: err.message
            });
          });
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
    const { validateFields } = formRef.current;
    validateFields(async (err, value) => {
      if (err) {
        return;
      }
      setBtnLoading(true);
      if (!formData.id) {
        value = {
          ...value,
          materialBatchNum:v1(),
          deliverOrderId: data.id,
          locationId: value.locationId[value.locationId.length - 1],
          code: data.code
        };
      } else {
        value = { ...formData, ...value };
      }
      await Api.createLine(value)
        .then(res => {
          setLineId(res);
          getHeader(res);
          setVisible(false);
          notification.success({
            message: formData.id ? '修改成功' : '新增成功'
          });
          loadData(res);
        })
        .catch(err => {
          notification.error({
            message: formData.id ? '修改失败' : '新增失败',
            description: err.message
          });
        });
      setBtnLoading(false);
    });
  };

  const { Table: Table1, SettingButton: SettingButton1 } = useMemo(
    () => CacheTable({ columns, key: 'wms_adjust_detail_left' }),
    []
  );
  const { Table: Table2, SettingButton: SettingButton2 } = useMemo(
    () => CacheTable({ columns: columns_, key: 'wms_in_storage_operate_right' }),
    []
  );

  const getHeader = id => {
    Api.getHeader(id)
      .then(res => {
        setData(res);
      })
      .catch(err => {
        notification.error({
          message: '获取信息失败',
          description: err.message
        });
      });
  };

  return (
    <>
      <HVLayout style={{ height: 'calc(100vh - 135px)' }}>
        <HVLayout.Pane className={styles.header} height={'auto'}>
          {headerComponent}
        </HVLayout.Pane>
        <HVLayout layout="horizontal">
          <HVLayout.Pane
            title="库存调整记录"
            buttons={
              <Button
                disabled={data.state === '完成'}
                h-icon="add"
                type="primary"
                onClick={handleOpenForm()}
              >
                新增调整
              </Button>
            }
            settingButton={<SettingButton1 />}
            onRefresh={loadData}
          >
            <Spin spinning={loading}>
              <Table1
                dataSource={summaryList}
                columns={columns}
                rowKey="materialId"
                pagination={false}
                scroll={{ x: 'max-content' }}
                // noIndex={true}
                isDraggable
              />
            </Spin>
          </HVLayout.Pane>
          <HVLayout.Pane title="调整详情" settingButton={<SettingButton2 />} onRefresh={loadData}>
            <Spin spinning={loading}>
              <Table2
                dataSource={detailList}
                columns={columns_}
                rowKey="id"
                pagination={false}
                scroll={{ x: 'max-content' }}
                // noIndex={true}
                isDraggable
              />
            </Spin>
          </HVLayout.Pane>
        </HVLayout>
      </HVLayout>
      <Drawer
        visible={visible}
        destroyOnClose
        onClose={() => setVisible(false)}
        title="物料调整"
        width={600}
      >
        <Drawer.DrawerContent>
          <DetailForm
            materialSearch={materialSearch_}
            fetching={fetching}
            materialList={materialList}
            locationTree={locationTree}
            formData={formData}
            ref={formRef}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>{modalFoot()}</Drawer.DrawerBottomBar>
      </Drawer>
    </>
  );
};

export default DetailComponent(Detail);
