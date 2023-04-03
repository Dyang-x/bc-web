/*
 * @Author: Andy
 * @Date: 2019-08-20 14:02:48
 * @LastEditors: Andy
 * @LastEditTime: 2019-08-21 09:28:09
 */
import React, { useEffect, useState, useRef } from 'react';
import { Spin } from '@hvisions/h-ui';
import materialService from '~/api/material';
import bomService from '~/api/bom';
import { isEmpty } from 'lodash';
import MaterialForm from './MaterialForm';
import BomForm from './BomForm';
import BomItemForm from './BomItemForm';
import BomSubItemForm from './BomSubItemForm';
const DetailComponent = ({ selectedTree, loadData, refreshTree, detailContentVisible, treeData }) => {
  const [loading, setLoading] = useState(false);
  const [bomVisible, setBomVisible] = useState(false);
  const [bomItemVisible, setBomItemVisible] = useState(false);
  const [bomSubItemVisible, setBomSubItemVisible] = useState(false);
  const [materialFormVisible, setMaterialFormVisible] = useState(false);
  const [materialData, setMaterialData] = useState({});
  const [bomData, setBomData] = useState({});
  const [bomItemData, setBomItemData] = useState({});
  const [bomSubItemData, setBomSubItemData] = useState({});
  const [bomExtendList, setBomExtendList] = useState([]);
  const [bomItemExtendList, setBomItemExtendList] = useState([]);
  const [bomSubItemExtend, setBomSubItemExtend] = useState([]);
  const bomItemRef = useRef();
  const bomSubItemRef = useRef();
  useEffect(() => {
    setLoading(true);
    loadTree();
    if(bomItemRef.current) {
      console.log(bomItemRef.current);
      bomItemRef.current.resetFields();
    }
    if(bomSubItemRef.current) {
      bomSubItemRef.current.resetFields();
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [selectedTree]);

  useEffect(() => {
    if(detailContentVisible) {
      setState();
    }
  }, [detailContentVisible]);


  const loadTree = () => {
    if (isEmpty(selectedTree.records)) return;
    if (selectedTree.site.length === 2) {
      // 判断是否为bom
      bomService.getDetailTree(selectedTree.records[0]).then(data => {
        setBomData(data);
      });
      bomService.getExtendColumns().then(data => {
        setBomExtendList(data);
      });
      setState(true);
    } else if (selectedTree.site.length === 3) {
      // 判断是否为bomitem
      setState(false, true);
      bomService.getBomItem(selectedTree.records[0]).then(data => {
        setBomItemData(data);
      });
      bomService.getExtendBomItem().then(data => {
        setBomItemExtendList(data);
      });
    } else if (selectedTree.site[3] === '0' || selectedTree.site[4] === '0') {
      // 判断是否为物料
      setState(false, false, false, true);
      materialService.getMaterialById(selectedTree.records[0]).then(data => {
        setMaterialData(data);
      });
    } else if (selectedTree.site.length === 4 && selectedTree.site[3] !== '0') {
      // 判断是否为subitem
      setState(false, false, true);
      bomService.getBomSubItem(selectedTree.records[0]).then(data => {
        setBomSubItemData(data);
      });
      bomService.getExtendBomSubItem().then(data => {
        setBomSubItemExtend(data);
      })
    }
  };

  const setState = (
    bomVisible = false,
    bomItemVisible = false,
    subitemVisible = false,
    materilVisible = false
  ) => {
    setBomVisible(bomVisible);
    setBomItemVisible(bomItemVisible);
    setBomSubItemVisible(subitemVisible);
    setMaterialFormVisible(materilVisible);
  };

  const renderForm = () => {
    if (materialFormVisible) {
      return <MaterialForm formData={materialData}  />;
    }
    if (bomVisible) {
      return <BomForm columns={bomExtendList} treeData={treeData} formData={bomData} bottomBar refreshTree={refreshTree} loadData={loadData} cancel={() => setBomVisible(false)} />;
    }
    if (bomItemVisible) {
      return <BomItemForm  columns={bomItemExtendList} ref={bomItemRef} treeData={treeData} formData={bomItemData} refreshTree={refreshTree} loadData={loadData} cancel={() => setBomItemVisible(false)}  />;
    }
    if (bomSubItemVisible) {
      return <BomSubItemForm  columns={bomSubItemExtend} ref={bomSubItemRef} treeData={treeData} formData={bomSubItemData} refreshTree={refreshTree} loadData={loadData} cancel={() => setBomSubItemVisible(false)} />
    }
    return '';
  };

  return (
    <Spin style={{ height: '100vh', width: '100%' }} spinning={loading}>
      <div style={{ height: 'calc(100vh - 250px)' }}>{renderForm()}</div>
    </Spin>
  );
};

export default DetailComponent;
