import React, { Fragment } from 'react';
import { Tree, Icon } from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import styles from './menu.scss';
const { TreeNode } = Tree;
const MaterialTypeTree = ({ setTypeId, typeId, types }) => {
  const renderTreeNodes = nodes =>
    nodes.map(node => {
      if (isEmpty(node.children)) {
        return (
          <TreeNode
            title={
              <Fragment>
                <Icon type="tag" />
                <span style={{ marginLeft: 10 }}>{node.materialTypeName}</span>
              </Fragment>
            }
            key={node.id}
          />
        );
      }
      return (
        <TreeNode
          title={
            <Fragment>
              <Icon type="tag" />
              <span style={{ marginLeft: 10 }}>{node.materialTypeName}</span>
            </Fragment>
          }
          key={node.id}
        >
          {renderTreeNodes(node.children)}
        </TreeNode>
      );
    });

  const onHandleSelect = e => {
    setTypeId(e);
  };

  return (
    <Tree onSelect={onHandleSelect} selectedKeys={typeId} className={styles.Menu}>
      {types && renderTreeNodes(types)}
    </Tree>
  );
};
export default MaterialTypeTree;
