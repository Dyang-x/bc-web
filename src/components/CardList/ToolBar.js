import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from '@hvisions/h-ui';
import styles from './style.scss';

const handleClick = (onClick, type) => e => {
  e.preventDefault();
  e.stopPropagation();
  onClick(type);
};

const ToolBar = ({ tools = [], onClick }) => (
  <div className={styles['tool-bar']}>
    {tools.map((type, key) => {
      let titleStr = '';
      switch (type) {
        case 'edit':
          titleStr = '编辑';
          break;
        case 'delete':
          titleStr = '删除';
          break;
        case 'copy':
          titleStr = '复制';
          break;
        case 'search':
          titleStr = '预览';
          break;
        default:
          break;
      }
      return (
        <Tooltip key={key} placement="top" title={titleStr}>
          <Icon
            type={type}
            key={key}
            onClick={handleClick(onClick, type)}
          />
        </Tooltip>
      );
    })
    }
  </div>
);

ToolBar.propTypes = {
  tools: PropTypes.array,
  onClick: PropTypes.func
};

ToolBar.defaultProps = {
  tools: []
};

export default ToolBar;
