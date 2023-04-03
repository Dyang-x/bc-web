/*
 * @Author: Andy
 * @Date: 2019-08-19 10:02:54
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 10:59:46
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  message,
  Modal,
  Input,
  Icon,
  notification,
  Spin,
  Drawer,
  Tabs
} from '@hvisions/h-ui';
import { withPermission, i18n } from '@hvisions/core';
import { connect } from 'react-redux';
import {
  ExportBomAll,
  importBom,
  ExportBomSingle,
  createExtendBomItemColumn,
  createExtendBomSubItemColumn,
  deleteExtendBomItemColumn,
  deleteExtendBomSubItemColumn,
  getExtendColumns,
  getExtendBomSubItem,
  getExtendBomItem,
  createExtendColumn,
  deleteExtendColumn
} from '~/store/bom/actions';
import {
  columnsSelector,
  columnsBomSelector,
  columnsBomSubSelector,
} from '~/store/bom/selector';
import { ImportButton, ExportButton, ExtendForm } from '~/components';
import bomService from '~/api/bom';
import BomForm from './BomForm';
import styles from './ToolList.scss';
const getFormattedMsg = i18n.getFormattedMsg;
const CreateButton = withPermission(Button, 'CREATE');
const EffectiveButton = withPermission(Button, 'EFFECTIVE');
const CopyButton = withPermission(Button, 'COPY');
const ImportBomButton = withPermission(ImportButton, 'IMPORT');
const ExportBomButton = withPermission(Button, 'EXPORT');
const ExtendButton = withPermission(Button, 'EXTEND');
const ToolList = ({
  loadData,
  selectedRow,
  selectedRowKey,
  ExportBomSingle,
  importBom,
  exportBomTemplate,
  extendColumns,
  extendBomColumns,
  extendBomSubColumns,
  getExtendBomItem,
  getExtendBomSubItem,
  createExtendBomItemColumn,
  createExtendBomSubItemColumn,
  deleteExtendBomItemColumn,
  deleteExtendBomSubItemColumn,
  getExtendColumns,
  createExtendColumn,
  deleteExtendColumn,
}) => {
  const bomRef = useRef();
  const [drawerBomVisible, setDrawerBomVisible] = useState(false);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [copyInput, setCopyInput] = useState();
  const [uploading, setUploading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [extendVisible, setExtendVisible] = useState(false);

  useEffect(() => {
    getExtendColumns();
    getExtendBomItem();
    getExtendBomSubItem();
  }, []);

  // 新增BOM
  const handleSubmitBomForm = () => {
    const { resetFields, validateFields } = bomRef.current;
    validateFields(async (err, value) => {
      if (err) return;
      try {
        await setBtnLoading(true);
        await bomService.createBom(value);
        await setDrawerBomVisible(false);
        await resetFields();
        setTimeout(() => {
          loadData();
        }, 1000);
        notification.success({
          message: getFormattedMsg('global.notify.createSuccess')
        });
      } catch (error) {
        notification.warning({
          message: getFormattedMsg('global.notify.createFail'),
          description: error.message
        });
      } finally {
        await setBtnLoading(false);
      }
    });
  };

  // 生效BOM
  const takeEffextBOM = async () => {
    const action = getFormattedMsg('bom.type.tack_effect');
    if (selectedRow.bomName && selectedRow.bomVersions) {
      try {
        await bomService.takeEffectBom(selectedRow.id);
        notification.success({
          message: getFormattedMsg('global.notify.success', { action })
        });
        setTimeout(() => {
          loadData();
        }, 1000);
      } catch (error) {
        notification.warning({
          message: getFormattedMsg('global.notify.fail', { action }),
          description: error.message
        });
      }
    }
  };

  // 复制bom
  const copyBom = () => {
    if (!selectedRow.id || selectedRowKey.length > 1) {
      message.warning(`${getFormattedMsg('bom.validate.placechooseCopy')}`);
      return;
    }
    setCopyModalVisible(true);
  };

  // 提交bom复制表单
  const handleSubmitCopyForm = async () => {
    const action = getFormattedMsg('global.btn.clone');
    if (copyInput) {
      try {
        await bomService.copyNewBom(selectedRow.id, copyInput);
        setCopyModalVisible(false);
        setTimeout(() => {
          loadData();
        }, 1000);
        await setCopyInput('');
        notification.success({
          message: getFormattedMsg('global.notify.success', { action })
        });
      } catch (error) {
        notification.warning({
          message: getFormattedMsg('global.notify.fail', { action }),
          description: error.message
        });
      }
    }
  };

  // 导入bom
  const handleImportBom = async file => {
    try {
      await setUploading(true);
      await importBom(file);
      await setUploading(false);
      await loadData();
    } catch (error) {
      notification.warning({
        message: getFormattedMsg('global.notify.submitFail'),
        description: error.message
      });
    }
  };

  const handleExportBom = () => {
    ExportBomSingle(selectedRowKey);
  };

  return (
    <div className={styles.ListContainer}>
      <CreateButton type="primary" icon="plus" onClick={() => setDrawerBomVisible(true)} />
      <EffectiveButton type="primary" icon="tag" onClick={() => takeEffextBOM()} />
      <CopyButton icon="copy" onClick={() => copyBom()} />
      <ImportBomButton icon="upload" onUpload={handleImportBom} style={{ margin: '0 10px' }} />
      <ExportBomButton icon="download" onClick={handleExportBom} />
      <ExportButton onExport={exportBomTemplate} Widget={Button}>
        <Icon type="download" />
        {getFormattedMsg('bom.action.getBomTempLate')}
      </ExportButton>
      <ExtendButton icon="apartment" onClick={() => setExtendVisible(true)} />
      <Drawer
        title={getFormattedMsg('bom.action.addBom')}
        visible={drawerBomVisible}
        width={400}
        onClose={() => {
          setDrawerBomVisible(false);
        }}
      >
        <Drawer.DrawerContent style={{ padding: '20px 10px' }}>
          <BomForm formData ref={bomRef} columns={extendColumns} />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>
          <Button onClick={() => setDrawerBomVisible(false)}>
            {getFormattedMsg('global.btn.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmitBomForm} loading={btnLoading}>
            {getFormattedMsg('global.btn.save')}
          </Button>
        </Drawer.DrawerBottomBar>
      </Drawer>
      <Drawer visible={extendVisible} width={600} title={getFormattedMsg('message.action.extends')} onClose={() => setExtendVisible(false)}>
        <Drawer.DrawerContent>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={getFormattedMsg('bom.label.bomExtend')} key="1">
            <ExtendForm
              data={extendColumns}
              getExtendColumns={getExtendColumns}
              createExtendColumn={createExtendColumn}
              deleteExtendColumn={deleteExtendColumn}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={getFormattedMsg('bom.label.bomItemExtend')} key="2">
            <ExtendForm
              data={extendBomColumns}
              getExtendColumns={getExtendBomItem}
              createExtendColumn={createExtendBomItemColumn}
              deleteExtendColumn={deleteExtendBomItemColumn}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={getFormattedMsg('bom.label.bomSubItemExtend')} key="3">
            <ExtendForm
              data={extendBomSubColumns}
              getExtendColumns={getExtendBomSubItem}
              createExtendColumn={createExtendBomSubItemColumn}
              deleteExtendColumn={deleteExtendBomSubItemColumn}
            />
          </Tabs.TabPane>
        </Tabs>
        </Drawer.DrawerContent>
      </Drawer>
      <Modal
        title={getFormattedMsg('bom.action.copyBom')}
        visible={copyModalVisible}
        onCancel={() => setCopyModalVisible(false)}
        onOk={handleSubmitCopyForm}
        cancelText={getFormattedMsg('global.btn.cancel')}
        okText={getFormattedMsg('global.btn.confirm')}
      >
        <Input
          placeholder={getFormattedMsg('bom.validate.copyForVersion')}
          prefix={<Icon type="schedule" style={{ color: 'rgba(0,0,0,.25)' }} />}
          onChange={e => setCopyInput(e.target.value)}
          allowClear
        />
      </Modal>
      <Modal
        title={getFormattedMsg('bom.label.fileLoading')}
        visible={uploading}
        footer={null}
        onCancel={() => setUploading(false)}
      >
        <Spin spining={uploading} style={{ width: '100%', height: '100%' }} />
      </Modal>
    </div>
  );
};

const mapStateToProps = state => ({
  extendColumns: columnsSelector(state),
  extendBomColumns: columnsBomSelector(state),
  extendBomSubColumns: columnsBomSubSelector(state),
});

export default connect(
  mapStateToProps,
  {
    ExportBomAll,
    importBom,
    ExportBomSingle,
    getExtendBomItem,
    getExtendBomSubItem,
    createExtendBomItemColumn,
    createExtendBomSubItemColumn,
    deleteExtendBomItemColumn,
    deleteExtendBomSubItemColumn,
    getExtendColumns,
    createExtendColumn,
    deleteExtendColumn,
  }
)(ToolList);
