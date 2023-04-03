import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Tooltip, Icon } from '@hvisions/h-ui';
import classnames from 'classnames';
import styles from './CardItem.scss';
const CardItem = ({ dataArr, handleSubmitChooseItem }) => {
  const [idx, setIdx] = useState();

  const handleChooseItem = (index, item) => {
    setIdx(index);
    handleSubmitChooseItem(item);
  }

  useEffect(() => {
    setIdx();
  }, [dataArr]);

  const renderItem = (item, index) => {
    return (
      <Card key={item.id} hoverable className={classnames(styles['card-item'], { [styles.choose] : index === idx })} onClick={() => handleChooseItem(index, item)}>
        <Tooltip title={item.name || item.equipmentName}>
          <span>{item.name ? item.name.slice(0, 5) : item.equipmentName.slice(0, 5)}</span>
          <Icon type="check-circle"  />
        </Tooltip>
      </Card>
    );
  };

  return <div>{dataArr.map((item, index) => renderItem(item, index))}</div>;
};

CardItem.propTypes = {
  dataArr: PropTypes.array,
  handleSubmitChooseItem: PropTypes.func
}

export default CardItem;
