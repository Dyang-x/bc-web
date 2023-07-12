import React from 'react';
import { Menu, Icon } from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import styles from './menu.scss';
const { SubMenu } = Menu;
const TypeMenu = ({ types, setTypeId }) => {
  const renderMenu = item => {
    if (!isEmpty(item.children)) {
      return (
        <SubMenu
          key={item.id}
          title={
            <div style={{ color: '#333' }} onClick={() => handleClick(item)}>
              <Icon type="select" />
              <span>{item.materialTypeName}</span>
            </div>
          }
          style={{ paddingLeft: 10 }}
        >
          {item.children.map(item => renderMenu(item))}
        </SubMenu>
      );
    }
    return (
      <Menu.Item key={item.id} onClick={() => handleClick(item)}>
        <Icon type="tag" />
        {item.materialTypeName}
      </Menu.Item>
    );
  };

  const handleClick = e => {
    setTypeId([e.id]);
  };

  return (
    <div className={styles.Menu}>
      <Menu mode="inline">{types.map(item => renderMenu(item))}</Menu>
    </div>
  );
};

export default TypeMenu;
