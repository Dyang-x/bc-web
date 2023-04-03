import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Media from 'react-media';
import {
  Icon, notification, Divider, Pagination, HLayout
} from '@hvisions/h-ui';
import {
  CardList
} from '~/components';
import { getHistoryByEquipmentId } from '~/store/equipmentManage/inspectItem/inspectItemPlan/actions';
import { historyListSelector, historyTotalSelector } from '~/store/equipmentManage/inspectItem/inspectItemPlan/selector';
import styles1 from './style.scss';
import { i18n } from '@hvisions/core';
const { Pane } = HLayout;

const getFormattedMsg = i18n.getFormattedMsg;
const LubricationCard = ({
  getHistoryByEquipmentId, list, total,
  equipmentId
}) => {
  const [pageSize, setPageSize] = useState(12);
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = (page = 1, pageSize = 12) => {
    try {
      getHistoryByEquipmentId({ equipmentId }, page, pageSize);
    } catch (err) {
      notification.warning({
        message: getFormattedMsg('global.notify.fail'),
        description: err.message,
      });
    }
  };

  const onHandleChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
    loadData(page, size);
  };

  const renderCardList = (span, height, list) => {
    const cardHeadStyle = {
      padding: '0.5em 0 0 0.5em',
      background: '#f7f9fa'
    };
    const cardBodyStyle = {
      padding: '0 0.8em',
    };
    return (
      <CardList
        span={span}
        gutter={6}
        list={list}
        width="100%"
        renderItem={renderItem}
        renderItemTitle={renderItemTitle}
        cardHeadStyle={cardHeadStyle}
        cardBodyStyle={cardBodyStyle}
        className={styles1['card-list-bg-file']}
        height={height}
      />
    );
  };
  
  const renderCardItem = (data, title, size = 13) => (
    <Fragment>
      <span style={{ paddingLeft: '0.5em', fontSize: size }}>
        {title + '：'}
      </span>
      <b className={styles1['card-b-style1']}>
        <span style={{ fontSize: size }} className={styles1['card-b-style']}>
          {data || ''}
        </span>
      </b>
    </Fragment>
  );

  const renderItem = data => (
    <Media query={{ maxWidth: 1900 }}>
      {
        matches => {
          if (matches) {
            return (
              <div key={data.id} style={{ marginTop: '1em' }}>
              {renderCardItem(data.assigneeName, getFormattedMsg('equipment.label.executive'))}
                <Divider style={{ margin: '1em 0' }} />
                {renderCardItem(data.startTime, getFormattedMsg('equipment.label.startTime'))}
                <Divider style={{ margin: '1em 0' }} />
                {renderCardItem(data.endTime, getFormattedMsg('equipment.label.endTime'))}
              </div>
            );
          } else {
            return (
              <div key={data.id} style={{ marginTop: '1.2em' }}>
              {renderCardItem(data.assigneeName, getFormattedMsg('equipment.label.executive'))}
                <Divider style={{ margin: '1em 0' }} />
                {renderCardItem(data.startTime, getFormattedMsg('equipment.label.startTime'))}
                <Divider style={{ margin: '1em 0' }} />
                {renderCardItem(data.endTime, getFormattedMsg('equipment.label.endTime'))}
              </div>
            );
          }
        } 
      }
    </Media>
  );

  const renderItemTitle = data => (
    <b key={data.id}>
      <span style={{ fontSize: '14px' }}>
        <Icon style={{ fontSize: '14px', marginRight: '5px' }} type="file-text" />
        {data.processDefinitionName}
      </span>
    </b>
  );

  return (
    <Fragment>
      <HLayout>
        <Pane
        >
          <Media query={{ maxWidth: 1900 }}>
            {
              matches => matches ? renderCardList(6, 200, list) : renderCardList(4, 200, list)
            }
          </Media>
          <div style={{ margin: '10px 0', textAlign: 'center' }}>
            <Pagination 
              current={current}
              pageSize={pageSize}
              showQuickJumper
              size="small"
              showSizeChanger
              defaultPageSize={12}
              pageSizeOptions={[12, 24, 36, 48]}
              total={total}
              onShowSizeChange={onHandleChange}
              onChange={onHandleChange}
              showTotal={(total, range) => `${getFormattedMsg('global.label.now')} ${range[0]}-${range[1]} ${getFormattedMsg('global.label.item')}  ${getFormattedMsg('global.label.total')} ${total} ${getFormattedMsg('global.label.item')} ${getFormattedMsg('global.label.record')}`}
            />
          </div>
        </Pane>
      </HLayout>
    </Fragment>
  );
};

LubricationCard.propTypes = {
  list: PropTypes.array,
  total: PropTypes.number,
  getHistoryByEquipmentId: PropTypes.func,
  equipmentId: PropTypes.number
};

const mapStateToProps = state => ({
  list: historyListSelector(state),
  total: historyTotalSelector(state),
});

export default connect(mapStateToProps, {
  getHistoryByEquipmentId
})(LubricationCard);
