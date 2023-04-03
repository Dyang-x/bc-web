import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HVLayout, Button, notification, Modal, Tooltip, Divider, Card, DetachTable, Spin, Pagination } from '@hvisions/h-ui';
import { withPermission } from '@hvisions/core';
import { i18n, page } from '@hvisions/toolkit';
import RuleForm from './RuleForm1';
import WaresLocationForm from './WaresLocationForm';
import { CacheTable } from '~/components';
import waresLocationService from '~/api/waresLocation';
import { addClassToUser, deletePropertyById, removeClassToUser, addPropertyToUser, updateUserProperty, findPropertyByUserId } from '~/api/waresProperties';
import { get as _get, isEmpty, values } from 'lodash';
import styles from './style.scss';
import classnames from 'classnames';
import LocationForm from './LocationForm';


const UpdateButton = withPermission('a', 'update_detail');
const DeleteButton = withPermission('a', 'delete_detail');
const CreateButton = withPermission(Button, 'CREATE_detail');
const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HVLayout;
const { showTotal } = page;
const PlusButtonL = withPermission(Button, 'Plus');
const EditButtonL = withPermission(Button, 'Edit');
const SyncButtonL = withPermission(Button, 'Sync');
const DeleteButtonL = withPermission(Button, 'Delete');

const WaresLocation = () => {
  const [treeList, setTreeList] = useState([]);
  const [waresList, setWaresList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [formData, setFormData] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pIdx, setPIdx] = useState();
  const [cIdx, setCIdx] = useState();
  const [selectedWaresItem, setSelectedWaresItem] = useState({});
  const [locationItem, setLocationItem] = useState({});
  const formRef = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const [visibleWares, setVisibleWares] = useState(false);
  const [visibleLocation, setVisibleLocation] = useState(false);

  const [weighingThickness, setWeighingThickness] = useState([true]);
  const [selection, setSelection] = useState([1]);
  const [heightLimit, setHeightLimit] = useState([90]);

  useEffect(() => {
    loadTreeData(page, pageSize);
  }, []);

  const loadTreeData = async (page, pageSize, parentId = 0) => {
    const data = {
      page: page - 1,
      pageSize: pageSize,
    }
    await waresLocationService.getLocationByQuery({ ...data, parentId }).then(result => {
      setTotalPage(result.totalElements);
      setPage(result.pageable.pageNumber + 1)
      setPageSize(result.pageable.pageSize)
      if (parentId == 0) {
        setWaresList(result.content);
      } else {
        setLocationList(result.content);
      }
    });
  };

  const renderTooltip = (str, title) => <Tooltip title={title}>{str}</Tooltip>;

  const columns = [
    {
      title: getFormattedMsg('newWaresLocation.title.weighingThickness'),
      dataIndex: 'weighingThickness',
      key: 'weighingThickness',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (text == true) { return '是' }
        if (text == false) { return '否' }
        const weighingThicknesss = [
          { label: '是', value: true },
          { label: '否', value: false },
        ];
      }
    },
    {
      title:getFormattedMsg('newWaresLocation.title.selection'),
      dataIndex: 'selection',
      key: 'selection',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (text == 1) { return '左' }
        if (text == 2) { return '右' }
        const selections = [
          { label: '左', value: 1 },
          { label: '右', value: 2 },
        ];
      }
    },
    {
      title: getFormattedMsg('newWaresLocation.title.heightLimit'),
      dataIndex: 'heightLimit',
      key: 'heightLimit',
      align: 'center',
      width: 100
    },
    {
      title: getFormattedMsg('newWaresLocation.title.xcoordinate'),
      dataIndex: 'xcoordinate',
      key: 'xcoordinate',
      align: 'center',
      width: 100
    },
    {
      title: getFormattedMsg('newWaresLocation.title.ycoordinate'),
      dataIndex: 'ycoordinate',
      key: 'ycoordinate',
      align: 'center',
      width: 100
    },
  ];

  const { Table, SettingButton } = useMemo(
    () =>
      CacheTable({
        columns,
        scrollHeight: 'calc(100vh - 245px)',
        key: 'wms_wares_location'
      }),
    []
  );

  const onWeighingThicknessChange = (index) => {
    const selectData = [...weighingThickness];
    if (index.length === 0) {
      setWeighingThickness(selectData);
    } else {
      const tmpArr = index?.filter(item => {
        return selectData.indexOf(item) === -1;
      });
      setWeighingThickness(tmpArr);
    }
  }

  const onSelectionChange = (index) => {
    const selectData = [...selection];
    if (index.length === 0) {
      setSelection(selectData);
    } else {
      const tmpArr = index?.filter(item => {
        return selectData.indexOf(item) === -1;
      });
      setSelection(tmpArr);
    }
  }

  const onHeightLimitChange = (index) => {
    const selectData = [...heightLimit];
    if (index.length === 0) {
      setHeightLimit(selectData);
    } else {
      const tmpArr = index?.filter(item => {
        return selectData.indexOf(item) === -1;
      });
      setHeightLimit(tmpArr);
    }
  }

  const handleChooseItem = (index, item) => {
    setPIdx(index);
    setCIdx();
    loadTreeData(1, 10, item.id);
    setPage(1);
    setPageSize(10);
    setSelectedWaresItem(item);
    setSelectedItem(item);
    setLocationItem({});
    setList([]);
  };

  const onHandleCreateWares = type => {
    setFormData({});
    setVisibleWares(true);
  };

  const onHandleUpdateWares = type => {
    setFormData(selectedItem);
    setVisibleWares(true);
  };

  const onHandleDeleteWares = type => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', {
        name: selectedWaresItem.name
      }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        await waresLocationService
          .deleteWareLocation(selectedItem.id)
          .then(() => {
            setLocationList([]);
            setList([]);

            loadTreeData(1, 10);
            setPage(1);
            setPageSize(10);

            setPIdx();
            setSelectedWaresItem({});
            setSelectedItem({});
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
    });
  };

  const modalWaresFoot = () => [
    <Button key="cancel" onClick={waresCancel} >
      {getFormattedMsg('global.btn.cancel')}
    </Button>,
    <Button key="save" loading={btnLoading} type="primary" onClick={waresSave}>
      {getFormattedMsg('global.btn.save')}
    </Button>
  ];

  const waresSave = () => {
    const { getFieldsValue, validateFields } = formRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      await setBtnLoading(true);
      if (formData.id) {
        await waresLocationService
          .updateWaresLocation({ ...formData, ...values })
          .then(result => {
            notification.success({
              message: getFormattedMsg('newWaresLocation.notification.updateSuccess')
            });
            setVisibleWares(false);
            setVisibleLocation(false);
            setLocationList([]);
            setList([]);

            loadTreeData(1, 10);
            setPage(1);
            setPageSize(10);

            setPIdx();
            setSelectedWaresItem({});
            setSelectedItem({});
          })
          .catch(error => {
            notification.warning({
              message: getFormattedMsg('newWaresLocation.notification.updateFailure'),
              description: error.message
            });
          });
      } else {
        await waresLocationService
          .createWaresLocation({
            ...values,
            parentId: 0,
            ruleDTOS: []
          })
          .then(result => {
            notification.success({
              message: getFormattedMsg('newWaresLocation.notification.addSuccess')
            });
            setVisibleWares(false);
            setVisibleLocation(false);
            setLocationList([]);
            setList([]);

            loadTreeData(1, 10);
            setPage(1);
            setPageSize(10);

            setPIdx();
            setSelectedWaresItem({});
            setSelectedItem({});
          })
          .catch(error => {
            notification.warning({
              message: getFormattedMsg('newWaresLocation.notification.addFailure'),
              description: error.message
            });
          });
      }
      await setBtnLoading(false);
    });
  }

  const waresCancel = () => {
    setVisibleWares(false)
    setVisibleLocation(false)
    setWeighingThickness([true])
    setSelection([1])
    setHeightLimit([90])
  }

  const handleChooseLocationItem = (index, item) => {
    setCIdx(index);
    setLocationItem(item);
    setSelectedItem(item);
    setLoading(true);
    if (isEmpty(item)) {
      setList([]);
      return;
    }
    setList([item]);
    setLoading(false);
  };

  const onHandleCreateLocation = type => {
    setFormData({});
    setVisibleLocation(true);
  };

  const onHandleUpdateLocation = type => {
    setFormData(selectedItem);
    setVisibleLocation(true);
  };

  const onHandleDeleteLocation = type => {
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', {
        name: locationItem.name
      }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        await waresLocationService
          .deleteWareLocation(selectedItem.id)
          .then(() => {
            loadTreeData(page, pageSize, selectedWaresItem.id);
            setCIdx();
            setLocationItem({});
            setSelectedItem(selectedWaresItem);
            setList([]);
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
    });
  };

  const modalLocationFoot = () => [
    <Button key="cancel" onClick={locationCancel} >
      {getFormattedMsg('global.btn.cancel')}
    </Button>,
    <Button key="save" loading={btnLoading} type="primary" onClick={locationSave}>
      {getFormattedMsg('global.btn.save')}
    </Button>
  ];

  const locationSave = () => {
    const { getFieldsValue, validateFields } = formRef.current;
    validateFields(async (err, values) => {
      if (values.weighingThickness != null) { values.weighingThickness = weighingThickness.toString() }
      if (values.selection != null) { values.selection = selection.toString() }
      if (values.heightLimit != null) { values.heightLimit = heightLimit.toString() }
      if (err) return;
      await setBtnLoading(true);
      if (formData.id) {
        await waresLocationService
          .updateWaresLocation({ ...formData, ...values })
          .then(result => {
            notification.success({
              message: getFormattedMsg('newWaresLocation.notification.updateSuccess'),
            });
            setVisibleWares(false);
            setVisibleLocation(false);

            loadTreeData(page, pageSize, selectedWaresItem.id)
            // setCIdx();
            setLocationItem({});
            setSelectedItem(selectedWaresItem);
            setList([result])
          })
          .catch(error => {
            notification.warning({
              message: getFormattedMsg('newWaresLocation.notification.updateFailure'),
              description: error.message
            });
          });
      } else {
        await waresLocationService
          .createWaresLocation({
            ...values,
            parentId: selectedWaresItem.id || 0,
            ruleDTOS: []
          })
          .then(result => {
            notification.success({
              message: getFormattedMsg('newWaresLocation.notification.addSuccess')
            });
            setVisibleWares(false);
            setVisibleLocation(false);

            loadTreeData(1, 10, selectedWaresItem.id)
            setPage(1);
            setPageSize(10);
            
            setCIdx();
            setLocationItem({});
            setSelectedItem(selectedWaresItem);
          })
          .catch(error => {
            notification.warning({
              message: getFormattedMsg('newWaresLocation.notification.addFailure'),
              description: error.message
            });
          });
      }
      await setBtnLoading(false);
    });
  }

  const locationCancel = () => {
    setVisibleWares(false)
    setVisibleLocation(false)
    setWeighingThickness([true])
    setSelection([1])
    setHeightLimit([90])
  }

  const onShowSizeChange = (p, s) => {
    loadTreeData(page, s, selectedWaresItem.id)
    setCIdx();
    setList([])
    setPageSize(s);
  };
  const pageChange = (p, s) => {
    loadTreeData(p, pageSize, selectedWaresItem.id)
    setCIdx();
    setList([])
    setPage(p);
  };

  return (
    <>
      <HVLayout layout="horizontal">
        <HVLayout.Pane
          width={300}
          title={getFormattedMsg('waresLocation.label.storingsLocation')}
          h-icon="tree"
          buttons={
            <Button.Group>
              {renderTooltip(
                <Button type="primary" h-icon="add" onClick={() => onHandleCreateWares('wares')} />,
                getFormattedMsg('global.btn.create')
              )}
              {renderTooltip(
                <Button
                  style={{ display: isEmpty(selectedWaresItem) ? 'none' : '' }}
                  h-icon="edit"
                  onClick={() => onHandleUpdateWares('wares')}
                />,
                getFormattedMsg('global.btn.modify')
              )}
              {renderTooltip(
                <Button
                  style={{ display: isEmpty(selectedWaresItem) ? 'none' : '' }}
                  h-icon="delete"
                  onClick={() => onHandleDeleteWares('wares')}
                />,
                getFormattedMsg('global.btn.delete')
              )}
            </Button.Group>
          }
        >
          <div>
            {waresList &&
              waresList.length > 0 &&
              waresList.map((item, index) => (
                <Card
                  key={item.id}
                  hoverable
                  className={classnames(styles['card-item'], { [styles.choose]: index === pIdx })}
                  onClick={() => handleChooseItem(index, item)}
                >
                  <span>
                    {item.code} &nbsp;&nbsp; {item.name}
                  </span>
                </Card>
              ))}
          </div>
        </HVLayout.Pane>
        <HVLayout.Pane
          width={300}
          title={getFormattedMsg('waresLocation.label.warehouseLocation')}
          h-icon="tree"
          buttons={
            <Button.Group>
              {renderTooltip(
                <Button
                  type="primary"
                  h-icon="add"
                  style={{ display: isEmpty(selectedWaresItem) ? 'none' : '' }}
                  onClick={() => onHandleCreateLocation('location')}
                />,
                getFormattedMsg('global.btn.create')
              )}
              {renderTooltip(
                <Button
                  style={{ display: isEmpty(locationItem) ? 'none' : '' }}
                  h-icon="edit"
                  onClick={() => onHandleUpdateLocation('location')}
                />,
                getFormattedMsg('global.btn.modify')
              )}
              {renderTooltip(
                <Button
                  style={{ display: isEmpty(locationItem) ? 'none' : '' }}
                  h-icon="delete"
                  onClick={() => onHandleDeleteLocation('location')}
                />,
                getFormattedMsg('global.btn.delete')
              )}
            </Button.Group>
          }
        >
          <div>
            {locationList &&
              locationList.length > 0 &&
              locationList.map((item, index) => (
                <Card
                  key={item.id}
                  hoverable
                  className={classnames(styles['card-item'], { [styles.choose]: index === cIdx })}
                  onClick={() => handleChooseLocationItem(index, item)}
                >
                  <span>
                    {item.code} &nbsp;&nbsp; {item.name}
                  </span>
                </Card>
              ))}
          </div>
          <Pane.BottomBar>
            <Pagination
              onShowSizeChange={onShowSizeChange}
              current={page}
              onChange={pageChange}
              defaultCurrent={page}
              total={totalPage}
              // size="small"
              simple
              showSizeChanger
              // showQuickJumper
              // showTotal={(total, range) => showTotal(total, range)}
              pageSize={pageSize}
            />
          </Pane.BottomBar>
        </HVLayout.Pane>
        <HVLayout>
          <HVLayout.Pane
            title={getFormattedMsg('newWaresLocation.title.attribute')}
            icon={<i className="h-visions hv-table" />}
            settingButton={<SettingButton />}
          >
            <Spin spinning={loading}>
              <Table dataSource={list} rowKey="id" columns={columns} />
            </Spin>
          </HVLayout.Pane>
        </HVLayout>
      </HVLayout>
      <Modal
        visible={visibleWares}
        destroyOnClose
        onCancel={waresCancel}
        title={
          formData.id
            ? `${getFormattedMsg('global.btn.modify')}${getFormattedMsg('newWaresLocation.title.positions')}`
            : `${getFormattedMsg('global.btn.create')}${getFormattedMsg('newWaresLocation.title.positions')}`
        }
        footer={modalWaresFoot()}
        width={500}
      >
        <WaresLocationForm
          formData={formData}
          ref={formRef}
        />
      </Modal>
      <Modal
        visible={visibleLocation}
        destroyOnClose
        onCancel={locationCancel}
        title={
          formData.id
            ? `${getFormattedMsg('global.btn.modify')}${getFormattedMsg('newWaresLocation.title.location')}`
            : `${getFormattedMsg('global.btn.create')}${getFormattedMsg('newWaresLocation.title.location')}`
        }
        footer={modalLocationFoot()}
        width={500}
      >
        <LocationForm
          formData={formData}
          ref={formRef}
          onWeighingThicknessChange={onWeighingThicknessChange}
          setWeighingThickness={setWeighingThickness}
          weighingThickness={weighingThickness}
          onSelectionChange={onSelectionChange}
          setSelection={setSelection}
          selection={selection}
          onHeightLimitChange={onHeightLimitChange}
          setHeightLimit={setHeightLimit}
          heightLimit={heightLimit}
        />
      </Modal>
    </>
  );
};

export default WaresLocation;