import React from 'react';
import { Tree as TreeComponent, Icon } from '@hvisions/h-ui';
import { isEmpty, cloneDeep } from 'lodash';

const Tree = ({ treeData, setTreeSelectItem, treeNodLoadData }) => {
  const renderTreeNodes = nodes =>
    nodes.map(node => {
      if (isEmpty(node.children)) {
        return (
          <TreeComponent.TreeNode
            icon={({ expanded }) => <Icon type={!expanded ? 'folder' : 'folder-open'} />}
            title={node.code + '(' + node.name + ')'}
            key={node.id}
            item-data={node}
            isLeaf={false}
          />
        );
      }
      return (
        <TreeComponent.TreeNode
          icon={({ expanded }) => <Icon type={!expanded ? 'folder' : 'folder-open'} />}
          title={node.code + '(' + node.name + ')'}
          key={node.id}
          item-data={node}
        >
          {renderTreeNodes(node.children)}
        </TreeComponent.TreeNode>
      );
    });

  const onHandleSelect = (_, item) => {
    if (item.selected) {
      setTreeSelectItem(item.node.props['item-data']);
    } else {
      setTreeSelectItem({});
    }
  };

  const formatNodes = list =>
    list.filter(n => {
      const children = list.filter(c => c.parentId === n.id);
      n.children = !isEmpty(children) ? children : n.children;
      return n.parentId === 0;
    });

  return (
    <TreeComponent defaultExpandAll loadData={treeNodLoadData} onSelect={onHandleSelect} showIcon>
      {treeData && renderTreeNodes(formatNodes(cloneDeep(treeData)))}
    </TreeComponent>
  );
};

export default Tree;
