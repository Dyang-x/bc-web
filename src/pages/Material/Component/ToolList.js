import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withPermission, i18n } from '@hvisions/core';
import { isEmpty } from 'lodash';
import { Button, notification, Drawer, Icon } from '@hvisions/h-ui';
import materilService from '~/api/material';
import { ExportButton, ImportButton, ExtendForm } from '~/components';
import {
  exportMaterial,
  importMaterial,
  createExtendColumn,
  deleteExtendColumn,
  getMaterialsImportTemplate
} from '~/store/material/actions';
import { formatExtendFields } from '~/util';
import { getBom } from '~/store/bom/actions';
import { listSelector } from '~/store/bom/selector';
import MateialForm from './MateialForm';
const getFormattedMsg = i18n.getFormattedMsg;
const CreateButton = withPermission(Button, 'CREATE');
const ImportsButton = withPermission(ImportButton, 'IMPORT');
const ExportsButton = withPermission(ExportButton, 'EXPORT');
const ExtendButton = withPermission(ExportButton, 'EXTEND');
const ToolList = ({
  loadData,
  exportMaterial,
  importMaterial,
  selectedRow = {},
  getBom,
  modifyVisible,
  setModifyVisible,
  createExtendColumn,
  deleteExtendColumn,
  getMaterialsImportTemplate
}) => {
  const materilFormRef = useRef();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [extendVisible, setExtendVisible] = useState(false);
  const [extendColumns, setExtendColumns] = useState([]);
  const [fileId, setFileId] = useState(undefined);
  const [btnLoading, setBtnLoading] = useState(false);
  const handleSubmitMaterialForm = () => {
    const { validateFields, resetFields } = materilFormRef.current;
    validateFields(async (err, value) => {
      if (err) return;
      value = formatExtendFields(value, extendColumns);
      value.photoId = fileId || undefined;
      await setBtnLoading(true);
      if (!modifyVisible) {
        await materilService
          .createMaterial({
            ...value,
            materialType: value.materialType[value.materialType.length - 1]
          })
          .then(() => {
            notification.success({
              message: `${
                modifyVisible
                  ? getFormattedMsg('global.notify.modifySuccess')
                  : getFormattedMsg('global.notify.createSuccess')
              }`
            });
            loadData();
            setFileId(undefined);
            setDrawerVisible(false);
          })
          .catch(err => {
            notification.warning({
              message: `${
                modifyVisible
                  ? getFormattedMsg('global.notify.modifyFail')
                  : getFormattedMsg('global.notify.createFail')
              }`,
              description: err.message
            });
          });
      } else {
        await materilService
          .updateMaterial({
            ...selectedRow,
            ...value,
            materialType: value.materialType[value.materialType.length - 1]
          })
          .then(() => {
            notification.success({
              message: `${
                modifyVisible
                  ? getFormattedMsg('global.notify.modifySuccess')
                  : getFormattedMsg('global.notify.createSuccess')
              }`
            });
            loadData();
            setFileId(undefined);
            setDrawerVisible(false);
          })
          .catch(err => {
            notification.warning({
              message: `${
                modifyVisible
                  ? getFormattedMsg('global.notify.modifyFail')
                  : getFormattedMsg('global.notify.createFail')
              }`,
              description: err.message
            });
          });
      }
      await setBtnLoading(false);
    });
  };

  useEffect(() => {
    getBom();
    getExtendColumns();
  }, []);

  const getExtendColumns = () => {
    materilService.getExtendColumns().then(data => {
      setExtendColumns(data);
    });
  };

  useEffect(() => {
    if (!modifyVisible) return;
    setDrawerVisible(true);
  }, [modifyVisible]);

  useEffect(() => {
    if (drawerVisible) return;
    setModifyVisible(false);
  }, [drawerVisible]);

  const importMaterialBom = async file => {
    try {
      const data = await importMaterial(file);
      if (!isEmpty(data.errorLines)) {
        notification.warning({
          description: JSON.stringify(data.errorLines)
        });
      }
      await loadData();
    } catch (error) {
      notification.warning({
        description: error.message
      });
    }
  };

  return (
    <div>
      <CreateButton
        h-icon="add"
        type="primary"
        onClick={() => setDrawerVisible(true)}
      ></CreateButton>
      <ImportsButton
        icon="upload"
        onUpload={importMaterialBom}
        action="导入"
        style={{ margin: '0 10px' }}
      ></ImportsButton>
      <ExportsButton onExport={exportMaterial} onUpload icon="download"></ExportsButton>
      <ExtendButton icon="apartment" onClick={() => setExtendVisible(true)}></ExtendButton>
      <ExportButton onExport={getMaterialsImportTemplate} Widget={Button}>
        <Icon type="download" />
        {getFormattedMsg('bom.action.getBomTempLate')}
      </ExportButton>
      <Drawer
        title={`${
          modifyVisible
            ? getFormattedMsg('global.btn.modify') + getFormattedMsg('material.label.material')
            : getFormattedMsg('global.btn.create') + getFormattedMsg('material.label.material')
        }`}
        width={800}
        visible={drawerVisible}
        destroyOnClose
        onClose={() => {
          setDrawerVisible(false);
        }}
      >
        <Drawer.DrawerContent style={{ padding: '20px 10px' }}>
          <MateialForm
            formData={modifyVisible ? selectedRow : ''}
            ref={materilFormRef}
            setFileId={setFileId}
            fileId={fileId}
            columns={extendColumns}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>
          <Button
            onClick={() => {
              setDrawerVisible(false);
            }}
          >
            {getFormattedMsg('global.btn.cancel')}
          </Button>
          <Button type="primary" loading={btnLoading} onClick={() => handleSubmitMaterialForm()}>
            {getFormattedMsg('global.btn.save')}
          </Button>
        </Drawer.DrawerBottomBar>
      </Drawer>
      <Drawer
        title={getFormattedMsg('message.action.extends')}
        visible={extendVisible}
        destroyOnClose
        onClose={() => setExtendVisible(false)}
        width={700}
      >
        <Drawer.DrawerContent style={{ padding: '20px 10px' }}>
          <ExtendForm
            data={extendColumns}
            getExtendColumns={getExtendColumns}
            createExtendColumn={createExtendColumn}
            deleteExtendColumn={deleteExtendColumn}
            onClose={() => setExtendVisible(false)}
          />
        </Drawer.DrawerContent>
        <Drawer.DrawerBottomBar>
          <Button onClick={() => setExtendVisible(false)}>
            {getFormattedMsg('global.btn.close')}
          </Button>
        </Drawer.DrawerBottomBar>
      </Drawer>
    </div>
  );
};
const mapStateToProps = state => ({
  bomList: listSelector(state)
});

export default connect(mapStateToProps, {
  exportMaterial,
  importMaterial,
  getBom,
  deleteExtendColumn,
  createExtendColumn,
  getMaterialsImportTemplate
})(ToolList);
