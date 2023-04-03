import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from '@hvisions/h-ui';
import styles from './style.scss';
import Item from './Item';

class CardList extends Component {
  static Item = Item;

  render() {
    const {
      span, gutter,
      list, renderItem,
      width, height,
      children,
      onAdd,
    } = this.props;
    if (children) {
      return (
        <Fragment>
          {children}
        </Fragment>
      );
    }
    
    return (
      <Row gutter={gutter} className={styles['heght-style']}>
        {onAdd && (
          <Col span={span} style={{ marginBottom: 10 }}>
            <Item isAdd width={width} height={height} onAdd={onAdd} />
          </Col>
        )}
        {list.map((data, idx) => (
          <Col key={idx} span={span} style={{ marginBottom: 10 }}>
            <Item {...this.props} data={data}>
              {renderItem(data)}
            </Item>
          </Col>
        ))}
      </Row>
    );
  }
}

CardList.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  renderactionsTitle: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gutter: PropTypes.number,
  span: PropTypes.number,
  list: PropTypes.array,
  tools: PropTypes.array,
  children: PropTypes.node,
  renderItem: PropTypes.func,
  renderItemTitle: PropTypes.func,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onItemClick: PropTypes.func
};

CardList.defaultProps = {
  gutter: 30,
  span: 4,
  width: 200,
  height: 200,
};

export default CardList;
