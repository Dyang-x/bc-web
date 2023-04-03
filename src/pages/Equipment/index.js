import React, { useState, Fragment, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  notification, Modal, Checkbox,
  Drawer, Button, Divider, HTable as Table, Pagination,
  HLayout
} from '@hvisions/h-ui';
import { push as pushState } from 'react-router-redux';
import { chunk, isEmpty, reverse } from 'lodash';
import { i18n, withPermission } from '@hvisions/core';
import {
  ExtendForm,
  ExportButton,
  ImportButton
} from '~/components';
import {
  getEquipmentList,
  getTreeEquipmentList,
  exportEquipment,
  importEquipment,
  getExtendColumns,
  createExtendColumn,
  deleteExtendColumn,
  getEquipmentTypeList,
  getEquipmentImportTemplate,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '~/store/equipment/actions';
import {
  listSelector,
  columnsSelector,
  totalSelector,
  equipmentTypeListAllSelect,
  equipmentTypeTreeSelect,
} from '~/store/equipment/selector';
import { isChineseLocale } from '@hvisions/core/lib/store/session/selector.js';
import { formatExtendFields } from '~/util';
import SearchForm from './SearchForm';
import DetailForm from './DetailForm';
import TypeTree from './TypeTree';
import styles from './style.scss';
const { Pane } = HLayout;

const getFormattedMsg = i18n.getFormattedMsg;
const CheckboxGroup = Checkbox.Group;
const CreateButton = withPermission(Button, 'CREATE');
const ImportsButton = withPermission(ImportButton, 'IMPORT');
const ExportsButton = withPermission(ExportButton, 'EXPORT');
const ExtendButton = withPermission(Button, 'EXTEND');
const DownloadButton = withPermission(ExportButton, 'Download');
const UpdateButton = withPermission('a', 'update');
const DeleteButton = withPermission('a', 'delete');
const DetailButton = withPermission('a', 'detail');
const AddChidrenButton = withPermission('a', 'AddChidrenButton');
let types = [];
let typeListAll = [];
const Equipment = ({
  list,
  total,
  extendColumns,
  isChinese,
  getExtendColumns,
  createExtendColumn,
  deleteExtendColumn,
  typeList, pushState,
  getEquipmentList,
  getTreeEquipmentList,
  exportEquipment,
  importEquipment,
  getEquipmentTypeList,
  typeTree,
  getEquipmentImportTemplate,
  createEquipment,
  updateEquipment,
  deleteEquipment
}) => {
  const [spinStatus, setSpinStatus] = useState(false);
	const [searchTerm, setSearchTerm] = useState({});
	const [formData, setFormData] = useState({});
	const [visible, setVisible] = useState(false);
	const [extendVisible, setExtendVisible] = useState(false);
	const [current, setCurrent] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [parentData, setParentData] = useState({});
	const [height, setHeight] = useState(document.body.clientHeight);
  const [btnLoading, setBtnLoading] = useState(false);
	const [typeId, setTypeId] = useState([]);
	const [tableCols, setTableCols] = useState([]);
  const formDataRef = useRef();

  useEffect(() => {
    try {
      getEquipmentTypeList();
      getExtendColumns();
      loadData();
      window.addEventListener('resize', resizeBind);
    } catch (error) {
      notification.warning({
        description: error.message,
      });
    }
  }, []);

  useEffect(() => {
    setTableCols(columns);
  }, [extendColumns])

  useEffect(() => {
    typeListAll = typeList;
  }, [typeList])

	const columns = 
		[{
      title: '',
      dataIndex: 'aa',
      key: 'aa',
      width: 30
    }, {
      title: getFormattedMsg('global.label.number'),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    }, {
      title: getFormattedMsg('equipment.label.code'),
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
    }, {
      title: getFormattedMsg('equipment.label.name'),
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    }, {
      title: getFormattedMsg('equipment.label.type'),
      dataIndex: 'equipmentTypeName',
      key: 'equipmentTypeName'
    }, {
      title: getFormattedMsg('equipment.label.type_id'),
      dataIndex: 'equipmentModel',
      key: 'equipmentModel'
    }, {
      title: getFormattedMsg('equipment.label.number'),
      dataIndex: 'equipmentSerialNum',
      key: 'equipmentSerialNum'
    }, {
      title: getFormattedMsg('equipment.label.manufacturer'),
      dataIndex: 'manufacturer',
      key: 'manufacturer'
    }, {
      title: getFormattedMsg('equipment.label.present_time'),
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      render: text => (
        text ? moment(text).format('YYYY-MM-DD') : ''
      )
    }, {
      title: getFormattedMsg('equipment.label.service_time'),
      dataIndex: 'useDate',
      key: 'useDate',
      render: text => (
        text ? moment(text).format('YYYY-MM-DD') : ''
			)
    }, {
      title: getFormattedMsg('equipment.label.operation'),
      dataIndex: 'options',
      key: 'options',
      width: 250,
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
      render: (_, record) => [
        <AddChidrenButton href="#" key="AddChidrenButton" onClick={() => onHandleCreate(record)} />,
        <Divider type="vertical" key="divider1" />,
        <UpdateButton key="edit" onClick={onHandleEdit(record)} />,
        <Divider type="vertical" key="divider2" />,
        <DetailButton href="#" key="look" onClick={goDetails(record.id)} />,
        <Divider type="vertical" key="divider" />,
        <DeleteButton href="#" key="remove" onClick={onHandleRemove(record)} />
      ]
    }];

  const resizeBind = () => setHeight(document.body.clientHeight);

  const onColumnChange = checkedValue => {
    const cols = columns;
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

  const onHandleOk = () => {
    const { validateFields, getFieldValue } = formDataRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      await setBtnLoading(true);
      const action = formData.id ? getFormattedMsg('global.btn.modify') : getFormattedMsg('global.btn.create');
      values = formatExtendFields(values, extendColumns);
      const arrivalDate = getFieldValue('arrivalDate') ? moment(getFieldValue('arrivalDate')).format('YYYY-MM-DD 00:00:00') : '';
      const useDate = getFieldValue('useDate') ? moment(getFieldValue('useDate')).format('YYYY-MM-DD 00:00:00') : '';
      try {
        const parent = !parentData || { parentId: parentData.id, parentEquipmentCode: parentData.equipmentCode };
        if (formData.id) {
          await updateEquipment({
            ...formData,
            ...values,
            arrivalDate,
            useDate,
            photoId: isEmpty(values.photoId) ? null : values.photoId[0],
            equipmentTypeId: values.equipmentTypeId[values.equipmentTypeId.length - 1]
          });
        } else {
          await createEquipment({
            ...values,
            ...parent,
            arrivalDate,
            useDate,
            photoId: isEmpty(values.photoId) ? null : values.photoId[0],
            equipmentTypeId: values.equipmentTypeId[values.equipmentTypeId.length - 1]
          });
          if (parent.parentId === undefined) {
            await loadData(typeId, searchTerm, 1, 10);
          }
        }
        await setBtnLoading(false);
				await setVisible(false);
        await setParentData({});
        notification.success({
          message: getFormattedMsg('global.notify.success', { action })
        });
      } catch (err) {
        await setBtnLoading(false);
        notification.warning({
          message: getFormattedMsg('global.notify.fail', { action }),
          description: err.message,
        });
      }
    });
  }

  const onHandleCreate = data => {
    setFormData({});
    setParentData(data || {});
    setVisible(true);
  };

  const onHandleEdit = data => e => {
    e.preventDefault();
    e.stopPropagation()
    types = [];
    renderTypeIds(typeListAll, data.equipmentTypeId);
    setFormData({ ...data, equipmentTypeId: reverse(types) });
    setVisible(true);
  };

  const renderTypeIds = (list, id) => {
    const type = list.find(item => item.id === id);
    if (!isEmpty(type)) {
      if (type.parentId === 0) {
        types = [...types, type.id];
      } else {
        types = [...types, type.id];
        renderTypeIds(list, type.parentId);
      }
    }
  };

  const onHandleRemove = data => e => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.equipmentName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        const action = getFormattedMsg('global.btn.delete');
        try {
          await deleteEquipment(data.id);
          notification.success({
            message: getFormattedMsg('global.notify.success', { action })
          });
        } catch (err) {
          notification.warning({
            message: getFormattedMsg('global.notify.fail', { action }),
            description: err.message,
          });
        }
      }
    });
  };

  const onHandleExpand = async (_, record) => {
    try {
      await getTreeEquipmentList(record.id);
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('message.notify.fail_only'),
        description: err.message,
      });
    }   
  };

  const onHandleExtend = () => setExtendVisible(true);
  
  const onHandleChange = (page, size) => {
		setCurrent(page);
		setPageSize(size);
    loadData(typeId, searchTerm, page, size);
  }

  const onHandleSearch = values => {
		setSearchTerm(values);
		setCurrent(1);
		setPageSize(10);
		loadData(typeId, values, 1, 10);
  };
  
  const loadData = async (id = typeId, values = searchTerm, page = 1, pageSize = 10) => {
    let data = {};
    if (!isEmpty(id)) {
      data = { ...values, equipmentTypeId: id[id.length - 1] };
    } else {
      data = values;
    }
    try {
      await setSpinStatus(true);
      await getEquipmentList(data, page, pageSize);
      await setSpinStatus(false);
    } catch (err) {
      notification.warning({
        description: err.message
      });
    }
  }

  const renderOverlay = () => [
    <CreateButton style={{ marginRight: 10 }} key="create" type="primary" icon="plus" onClick={onHandleCreate} />,
    <ImportsButton style={{ marginRight: 10 }} key="import" icon="upload" onUpload={importEquipment} ImportClose={() => loadData(typeId, searchTerm, 1, 10)} action={getFormattedMsg('equipment.apply.import')} Widget={Button} />,
    <ExportsButton key="exprot" icon="download" onExport={exportEquipment} Widget={Button} />,
    <DownloadButton key="download" icon="download" onExport={getEquipmentImportTemplate} Widget={Button} />,
    <ExtendButton key="extend" icon="apartment" onClick={onHandleExtend} Widget={Button}/>
  ];
  
  const goDetails = record => e => {
    e.preventDefault();
    e.stopPropagation();
    pushState(`/equipment/${record}`);
  };
  
    return (
      <Fragment>
        <div style={{ width: 'calc(100% - 265px)', position: 'absolute', left: 260 }}>
          <HLayout layout="vertical">
            <Pane style={{ overflow: 'hidden' }} height={65}>
              <SearchForm onSearch={onHandleSearch} />
            </Pane>
          </HLayout>
        </div>
        <div style={{ width: 250, position: 'absolute', top: 5, height: 'calc(100% - 10px)' }}>
          <HLayout>
            <Pane
              icon="bars"
              title={getFormattedMsg('equipment.label.equipmentTypeTree')}
              style={{ overflow: 'hidden' }}
              width={250}
            >
              <TypeTree
                loadData={loadData}
                setTypeId={setTypeId}
                typeId={typeId}
                types={typeTree}
              />
            </Pane>
          </HLayout>
        </div>
        <div style={{ width: 'calc(100% - 265px)', position: 'absolute', top: 75, left: 260, height: 'calc(100% - 80px)' }}>
          <HLayout>
            <Pane
              icon="table"
              title={getFormattedMsg('equipment.label.equipmentTable')}
              style={{ overflow: 'hidden' }}
              height={window.innerHeight - 157}
              buttons={renderOverlay()}
            >
              <Table
                rowKey={record => record.id}
                dataSource={list.map((item, index) => ({
                  ...item,
                  serialNumber: (current - 1) * pageSize + ++index
                }))}
                loading={spinStatus}
                columns={tableCols}
                pagination={false}
                onExpand={onHandleExpand}
              />
              <div style={{ margin: '10px 0', textAlign: 'center' }}>
                <Pagination
                  current={current}
                  pageSize={pageSize}
                  showQuickJumper
                  size="small"
                  showSizeChanger
                  total={total}
                  onShowSizeChange={onHandleChange}
                  onChange={onHandleChange}
                  showTotal={(total, range) =>
                    `${getFormattedMsg('global.label.now')} ${range[0]}-${
                      range[1]
                    } ${getFormattedMsg('global.label.item')}  ${getFormattedMsg(
                      'global.label.total'
                    )} ${total} ${getFormattedMsg('global.label.item')} ${getFormattedMsg(
                      'global.label.record'
                    )}`
                  }
                />
              </div>
            </Pane>
          </HLayout>
        </div>
        <Drawer
          width={800}
          placement="right"
          visible={visible}
          title={
            !formData.id
              ? `${getFormattedMsg('global.btn.create')}`
              : `${getFormattedMsg('global.btn.modify')}`
          }
          onClose={() => setVisible(false)}
          destroyOnClose
        >
          <Drawer.DrawerContent>
            <DetailForm
              types={typeTree}
              formData={formData}
              columns={extendColumns}
              isChinese={isChinese}
              ref={formDataRef}
            />
          </Drawer.DrawerContent>
          <Drawer.DrawerBottomBar>
            <Button onClick={() => setVisible(false)}>{getFormattedMsg('global.btn.cancel')}</Button>
            <Button type="primary" loading={btnLoading} onClick={onHandleOk}>{getFormattedMsg('global.btn.save')}</Button>
          </Drawer.DrawerBottomBar>
        </Drawer>
        <Drawer
          width={720}
          placement="right"
          visible={extendVisible}
          title={getFormattedMsg('global.btn.extend')}
          onClose={() => setExtendVisible(false)}
          destroyOnClose
        >
          <Drawer.DrawerContent>
            <ExtendForm
              data={extendColumns}
              getExtendColumns={getExtendColumns}
              createExtendColumn={createExtendColumn}
              deleteExtendColumn={deleteExtendColumn}
              onClose={() => setExtendVisible(false)}
            />
          </Drawer.DrawerContent>
        </Drawer>
      </Fragment>
    );
  };

Equipment.propTypes = {
  isChinese: PropTypes.bool,
  list: PropTypes.array,
  typeTree: PropTypes.array,
  extendColumns: PropTypes.array,
  total: PropTypes.number,
  getEquipmentList: PropTypes.func,
  getTreeEquipmentList: PropTypes.func,
  exportEquipment: PropTypes.func,
  importEquipment: PropTypes.func,
  getEquipmentTypeList: PropTypes.func,
  getExtendColumns: PropTypes.func,
  createExtendColumn: PropTypes.func,
  deleteExtendColumn: PropTypes.func,
  pushState: PropTypes.func,
  typeList: PropTypes.array,
  getEquipmentImportTemplate: PropTypes.func,
  createEquipment: PropTypes.func,
  updateEquipment: PropTypes.func,
  deleteEquipment: PropTypes.func,
};

const mapStateToProps = state => ({
  list: listSelector(state),
  total: totalSelector(state),
  extendColumns: columnsSelector(state),
  typeTree: equipmentTypeTreeSelect(state),
  isChinese: isChineseLocale(),
  typeList: equipmentTypeListAllSelect(state)
});

export default connect(mapStateToProps, {
  pushState,
  getEquipmentList,
  getTreeEquipmentList,
  exportEquipment,
  importEquipment,
  getEquipmentTypeList,
  getExtendColumns,
  createExtendColumn,
  deleteExtendColumn,
  getEquipmentImportTemplate,
  createEquipment,
  updateEquipment,
  deleteEquipment
})(Equipment);
