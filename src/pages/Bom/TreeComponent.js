/*
 * @Author: Andy
 * @Date: 2019-08-19 11:13:24
 * @LastEditors: Andy
 * @LastEditTime: 2019-09-11 16:45:46
 */
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Tree, Icon, Spin } from '@hvisions/h-ui';
import { isEmpty, get as _get } from 'lodash';
import styles from './TreeComponent.scss';
const { TreeNode } = Tree;
const TreeComponent = ({ data, handleSelectTree, resetDetailContent }) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadData();
  }, [data]);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const renderTreeNodes = node => {
    if (node === '') {
      return '';
    }
    if (node.objectType === 509 && node.bomItemDTOS.length === 0) {
      return <TreeNode icon={<Icon type="file-done" />} title={node.bomName} key={node.id} />;
    }

    return (
      <TreeNode icon={<i className="icon icon-folder" />} title={node.bomName} key={node.id}>
        {!isEmpty(node.bomItemDTOS) &&
          node.bomItemDTOS.map((node, index) => (
            <TreeNode
              icon={<i className="icon icon-folder" />}
              title={node.bomItemName}
              key={node.id}
            >
              <TreeNode
                icon={<i className="icon icon-box" />}
                title={node.materialName}
                key={node.materialsId}
              />
              {!isEmpty(node.substituteItemDTOS) &&
                node.substituteItemDTOS.map(node => (
                  <TreeNode
                    icon={<i className="icon icon-folder" />}
                    title={node.substituteItemName}
                    key={node.id}
                  >
                    {
                      <TreeNode
                        icon={<i className="icon icon-box" />}
                        title={node.materialName}
                        key={node.materialsId}
                      />
                    }
                  </TreeNode>
                ))}
            </TreeNode>
          ))}
      </TreeNode>
    );
  };

  const handleSelect = (selectedKeys, e) => {
    const key = _get(e, 'node.props.pos', 0).split('-');
    const title = _get(e, 'node.props.title');
    handleSelectTree({ records: selectedKeys, site: key, title  });
    resetDetailContent();
  }

  return (
    <div className={classnames([styles.container, styles.bomTree ])}>
      <Spin spinning={loading}>
        <Tree showLine showIcon onSelect={handleSelect}>
          {renderTreeNodes(data)}
        </Tree>
      </Spin>
    </div>
  );
};

export default TreeComponent;
