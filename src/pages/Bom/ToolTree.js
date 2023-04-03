/*
 * @Author: Andy
 * @Date: 2019-08-19 10:28:40
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-01 09:17:24
 */
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Button, Tooltip, Modal, notification, Drawer } from '@hvisions/h-ui';
import { i18n } from '@hvisions/core';
import bomService from '~/api/bom';
import BomItemForm from './BomItemForm';
import BomSubItemForm from './BomSubItemForm';
import styles from './ToolTree.scss';
const getFormattedMsg = i18n.getFormattedMsg;
const ButtonGroup = Button.Group;
const ToolTree = ({ selectedTree, refreshTree, treeData}) => {
  const [bomItemVisible, setBomItemVisible] = useState(false);
  const [bomSubItemVisible, setBomSubItemVisible] = useState(false);
  const [bomItemExtendList, setBomItemExtendList] = useState([]);
  const [bomSubItemExtend, setBomSubItemExtend] = useState([]);

  useEffect(() => {
    bomService.getExtendBomItem().then(data => {
      setBomItemExtendList(data);
    });
    bomService.getExtendBomSubItem().then(data => {
      setBomSubItemExtend(data);
    })
  }, []);

  const loadTree = () => {
    if (isEmpty(selectedTree.records) || treeData.bomStatus !== 0) return '';
    if (selectedTree.site.length === 2) {
      // 判断是否为bom;
      return renderButton(false, true, true, true);
    } else if (selectedTree.site.length === 3) {
      // 判断是否为bomitem
      return renderButton(true, false, false, true);
    } else if (selectedTree.site[3] === '0' || selectedTree.site[4] === '0') {
      // 判断是否为物料
      return renderButton(true, true, true, true);
    } else if (selectedTree.site.length === 4 && selectedTree.site[3] !== '0') {
      // 判断是否为subitem
      return renderButton(true, true, true, false);
    }
  };

  const handleDeleteItem = () => {
    Modal.confirm({
      title: `${getFormattedMsg('global.btn.confirm')}${getFormattedMsg('global.btn.delete')}[${selectedTree.title || ''}]?`,
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await bomService.deleteBomItem(selectedTree.records[0]);
          setTimeout(() => {
            refreshTree();
          }, 1000);
          notification.success({
            message: getFormattedMsg('global.notify.deleteSuccess')
          });
        } catch (error) {
          notification.warning({
            message: getFormattedMsg('global.notify.deleteFail'),
            description: error.message
          });
        } finally {
          //
        }
      }
    });
  };

  const handleDeleteSubItem = () => {
    Modal.confirm({
      title: `${getFormattedMsg('global.btn.confirm')}${getFormattedMsg('global.btn.delete')}[${selectedTree.title || ''}]?`,
      okText: getFormattedMsg('global.btn.confirm'),
      cancelText: getFormattedMsg('global.btn.cancel'),
      onOk: async () => {
        try {
          await bomService.deleteBomSubItem(selectedTree.records[0]);
          setTimeout(() => {
            refreshTree();
          }, 1000);
          notification.success({
            message: getFormattedMsg('global.notify.deleteSuccess')
          });
        } catch (error) {
          notification.warning({
            message: getFormattedMsg('global.notify.deleteFail'),
            description: error.message
          });
        } finally {
          //
        }
      }
    });
  };

  const renderButton = (
    bomItemDisable = false,
    bomSubItemDisable = false,
    deleteBOMItemDisable = false,
    deleteBOMSubItemDisable = false
  ) => {
    return (
      <ButtonGroup>
        <Tooltip title={getFormattedMsg('bom.label.addItemBom')}>
          <Button
            type="primary"
            icon="plus-square"
            disabled={bomItemDisable}
            onClick={() => setBomItemVisible(true)}
          />
        </Tooltip>
        <Tooltip title={getFormattedMsg('bom.label.addSubItemBom')}>
          <Button
            type="primary"
            icon="plus-circle"
            disabled={bomSubItemDisable}
            onClick={() => setBomSubItemVisible(true)}
          />
        </Tooltip>
        <Tooltip title={getFormattedMsg('bom.label.deleteItemBom')}>
          <Button
            type="primary"
            icon="delete"
            disabled={deleteBOMItemDisable}
            onClick={() => handleDeleteItem()}
          />
        </Tooltip>
        <Tooltip title={getFormattedMsg('bom.label.deleteSubItemBom')}>
          <Button
            type="primary"
            icon="close"
            disabled={deleteBOMSubItemDisable}
            onClick={() => handleDeleteSubItem()}
          />
        </Tooltip>
      </ButtonGroup>
    );
  };

  return (
    <>
      <div className={styles.TreeContainer}>{loadTree()}</div>
      <Drawer
        title={getFormattedMsg('bom.label.addItemBom')}
        visible={bomItemVisible}
        width={400}
        onClose={() => {
          setBomItemVisible(false);
        }}
      >
        <Drawer.DrawerContent style={{ padding: '20px 0px 0px 0px', height: 'calc( 100% - 50px )'  }}>
          <BomItemForm
            formData={Object.assign(selectedTree, treeData)}
            add
            refreshTree={refreshTree}
            cancelDrawer={() => setBomItemVisible(false)}
            treeData={treeData}
            columns={bomItemExtendList}
          />
        </Drawer.DrawerContent>
      </Drawer>
      <Drawer
        title={getFormattedMsg('bom.label.addSubItemBom')}
        visible={bomSubItemVisible}
        width={400}
        onClose={() => {
          setBomSubItemVisible(false);
        }}
      >
        <Drawer.DrawerContent style={{ padding: '20px 0px 0px 0px', height: 'calc( 100% - 50px )'  }}>
          <BomSubItemForm
            formData={Object.assign(selectedTree, treeData)}
            treeData={treeData}
            add
            refreshTree={refreshTree}
            cancelDrawer={() => setBomSubItemVisible(false)}
            columns={bomSubItemExtend}
          />
        </Drawer.DrawerContent>
      </Drawer>
    </>
  );
};

export default ToolTree;
