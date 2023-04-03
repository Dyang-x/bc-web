  import React from 'react';
  import { Tree } from '@hvisions/h-ui';
  import { isEmpty } from 'lodash';
  import styles from './style.scss';
  const { TreeNode } = Tree;
const EquipmentTypeTree = ({ loadData, setTypeId, typeId, types }) => {
  const renderTreeNodes = nodes => nodes.map(node => {
    if (isEmpty(node.children)) {
      return <TreeNode title={node.equipmentTypeName} key={node.id} />;
    }
    return (
      <TreeNode title={node.equipmentTypeName} key={node.id}>
        {renderTreeNodes(node.children)}
      </TreeNode>
    );
  });
  
  const onHandleSelect = e => {
    setTypeId(e);
    loadData(e);
  };

  return (
    <Tree
      onSelect={onHandleSelect}
      selectedKeys={typeId}
    >
      {types && renderTreeNodes(types)}
    </Tree>
  );
};
export default EquipmentTypeTree;
  