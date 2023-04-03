import React, { Fragment, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { 
  notification, Drawer,
  Modal, Button, HLayout
} from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import { push as pushState } from 'react-router-redux';
import { connect } from 'react-redux';
import { getEquipmentById, getExtendColumns, getFileIdsByEquipmentId, createEquipmentFile, deleteEquipmentFileByEIdAndFileId } from '~/store/equipment/actions';
import { equipmentInfoSelector, columnsSelector, fileIdsSelector } from '~/store/equipment/selector';
import { fileListSelector, typeListSelector } from '~/store/file/selector';
import { getFileDetailBatch, downloadFile, getAllType, uploadFile } from '~/store/file/actions';
import styles from '../style.scss';
import styles1 from './style.scss';
import FileForm from './FileForm';
import Evenv from './Evenv';
import MaintenanceCard from './MaintenanceCard';
import EquipmentInfoCard from './EquipmentInfoCard';
import MaintainCard from './MaintainCard';
import FileCardList from './FileCardList';
import LubricationCard from './LubricationCard';
import RunStatus from './RunStatus';
import InspectItemCard from './InspectItemCard';
import { i18n } from '@hvisions/core';
const { Pane } = HLayout;
const getFormattedMsg = i18n.getFormattedMsg;
const Details = ({
  pushState, equipmentId, getEquipmentById,
  equipmentInfo, getExtendColumns, columns, getFileIdsByEquipmentId,
  getFileDetailBatch, fileList, downloadFile, createEquipmentFile,
  typeList, fileIds, deleteEquipmentFileByEIdAndFileId,
  getAllType, uploadFile
}) => {
  const [equipment, setEquipment] = useState({});
  const [fileVisible, setFileVisible] = useState(false);
  const [tabKeys1, setTabKeys1] = useState(1);
  const [tabKeys2, setTabKeys2] = useState(1);
  const [tabKeys3, setTabKeys3] = useState(1);
  const [tabKeys4, setTabKeys4] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tabKey, setTabKey] = useState(1);
  const formRef = useRef();
  useEffect(() => {
    try {
      getEquipmentById(equipmentId);
      getExtendColumns();
      getAllType();
      getFileIdsByEquipmentId1(equipmentId);
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('message.notify.fail_only'),
        description: err.message,
      });
    }
  }, []);
  

  useEffect(() => {
    try {
      getFileDetailBatch(fileIds);
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('message.notify.fail_only'),
        description: err.message,
      });
    }
  }, [fileIds]);

  
  const getFileIdsByEquipmentId1 = async id => {
    try {
      await getFileIdsByEquipmentId(id);
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('message.notify.fail_only'),
        description: err.message,
      });
    }
  };

  useEffect(() => {
    try {
      if (!isEmpty(equipmentInfo)) {
        setEquipment(equipmentInfo);
      }
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('message.notify.fail_only'),
        description: err.message,
      });
    }
  }, [equipmentInfo]);

  const goback = () => {
    pushState('/equipment');
  };
  
  const btnStyle = {
    float: 'right',
    marginTop: -100
  };

  const onHandleRemove = data => {
    const action = getFormattedMsg('global.btn.delete');
    Modal.confirm({
      title: getFormattedMsg('global.confirm.confirmDelete', { name: data.fileName }),
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await deleteEquipmentFileByEIdAndFileId(equipmentId, data.id);
          await getFileIdsByEquipmentId1(equipmentId);
          notification.success({
            message: getFormattedMsg('global.notify.success', { action })
          });
        } catch (error) {
          notification.warning({
            message: getFormattedMsg('global.notify.fail', { action }),
            description: error.message,
          });
        }
      }
    });
  };
  
  const onHandleOk = () => {
    const { validateFields } = formRef.current;
    validateFields(async (err, values) => {
      if (err) return;
      await setBtnLoading(true);
      const action = getFormattedMsg('global.btn.create');
      try {
        await createEquipmentFile({ equipmentId, fileIds: values.file });
        await getFileIdsByEquipmentId1(equipmentId);
        await setBtnLoading(false);
        await setFileVisible(false);
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
  };

  const tabsOnChange = e => {
    setTabKey(+e);
    switch (e) {
      case '5':
        setTabKeys1(tabKeys1 + 1);
        break;
      case '6':
        setTabKeys2(tabKeys2 + 1);
        break;
      case '7':
        setTabKeys3(tabKeys3 + 1);
        break;
      case '8':
        setTabKeys4(tabKeys4 + 1);
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <div>
        <HLayout>
          <Pane
            style={{ overflow: 'hidden' }}
            height={120}
          >
            <div style={{ display: 'flex' }}>
              <div className={styles1['img-style']}>
                {equipment.photoId && <img style={{ height: 90, width: 90 }} alt={getFormattedMsg('equipment.label.photo')} src={`http://${process.env.__API_HOST__}:${process.env.__API_PORT__}/file-management/file/downloadFile/${equipment.photoId}`} />}
              </div>
              <div style={{ marginLeft: 40 }}>
                <footer className={styles['top1-footer']}>
                  {!isEmpty(equipment) && equipment.equipmentName}
                </footer>
              </div>
            </div>
            <Button icon="rollback" style={btnStyle} onClick={goback}>{getFormattedMsg('global.btn.back')}</Button>
          </Pane>
        </HLayout>
      </div>
      <div>
        <HLayout>
          <Pane
            tab
            height={window.innerHeight - 210}
            onTabChange={tabsOnChange}
            buttons={tabKey === 2 ? <Button icon="plus" type="primary" onClick={() => setFileVisible(true)}>{getFormattedMsg('global.btn.create')}</Button> : ''}
          >
            <Pane.Tab title={getFormattedMsg('equipment.label.equipmentInfo')} name="1">
              <EquipmentInfoCard equipment={equipment} columns={columns} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.fileManage')} name="2">
              <FileCardList downloadFile={downloadFile} fileList={fileList} setFileVisible={setFileVisible} onHandleRemove={onHandleRemove} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.startStatus')} name="3">
              <RunStatus equipment={equipmentInfo} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.eventManage')} name="4">
              <Evenv equipment={equipmentInfo} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.maintenanceInfo')} name="5">
              <MaintenanceCard equipmentId={equipmentInfo.id} key={tabKeys1} /> 
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.maintainInfo')} name="6">
            <MaintainCard equipmentId={equipmentInfo.id} key={tabKeys2} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.lubricationInfo')} name="7">
            <LubricationCard equipmentId={equipmentInfo.id} key={tabKeys3} />
            </Pane.Tab>
            <Pane.Tab title={getFormattedMsg('equipment.label.inspectItemInfo')} name="8">
            <InspectItemCard equipmentId={equipmentInfo.id} key={tabKeys4} />
            </Pane.Tab>
          </Pane>
        </HLayout>
      </div>
      <Drawer
        visible={fileVisible}
        destroyOnClose
        width={600}
        title={getFormattedMsg('global.btn.create')}
        onClose={() => setFileVisible(false)}
      >
        <Drawer.DrawerContent>
          <FileForm typeList={typeList} ref={formRef} uploadFile={uploadFile} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>
          <Button onClick={() => setFileVisible(false)}>{getFormattedMsg('global.btn.cancel')}</Button>
          <Button type="primary" loading={btnLoading} onClick={onHandleOk} style={{ marginLeft: '10px' }}>{getFormattedMsg('global.btn.save')}</Button>
        </Drawer.DrawerBottomBar>
      </Drawer>
    </Fragment>
  );
};

Details.propTypes = {
  pushState: PropTypes.func,
  equipmentId: PropTypes.string,
  getEquipmentById: PropTypes.func,
  equipmentInfo: PropTypes.object,
  getExtendColumns: PropTypes.func,
  columns: PropTypes.array,
  getFileDetailBatch: PropTypes.func,
  fileList: PropTypes.array,
  getFileIdsByEquipmentId: PropTypes.func,
  downloadFile: PropTypes.func,
  createEquipmentFile: PropTypes.func,
  typeList: PropTypes.array,
  getAllType: PropTypes.func,
  uploadFile: PropTypes.func,
  fileIds: PropTypes.array,
  deleteEquipmentFileByEIdAndFileId: PropTypes.func
};

const mapStateToProps = (state, props) => ({
  equipmentId: props.match.params.id,
  equipmentInfo: equipmentInfoSelector(state),
  columns: columnsSelector(state),
  fileList: fileListSelector(state),
  typeList: typeListSelector(state),
  fileIds: fileIdsSelector(state)
});

export default connect(mapStateToProps, {
  pushState,
  getEquipmentById,
  getExtendColumns,
  getFileIdsByEquipmentId,
  getFileDetailBatch,
  downloadFile,
  createEquipmentFile,
  getAllType,
  uploadFile,
  deleteEquipmentFileByEIdAndFileId,
})(Details);
