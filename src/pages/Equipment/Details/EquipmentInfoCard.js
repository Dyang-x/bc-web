import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { i18n } from '@hvisions/core';
import { isChineseLocale } from '@hvisions/core/lib/store/session/selector.js';
import {
  Card, HLayout
} from '@hvisions/h-ui';
const getFormattedMsg = i18n.getFormattedMsg;
const { Pane } = HLayout;
const isChinese = isChineseLocale();
const EquipmentInfoCard = ({
  columns, equipment
}) => {
  const gridStyle = {
    width: '22%',
    textAlign: 'left',
    height: '48px',
    lineHeight: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };

  const gridStyle1 = {
    width: '55.3%',
    textAlign: 'left',
    height: '48px',
    lineHeight: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };
  
  const gridStyleTitle = {
    width: '11.3%',
    textAlign: 'left',
    backgroundColor: '#fafafc',
    color: '#74777a',
    fontWeight: 400,
    height: '48px',
    lineHeight: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  const renderExtendCard = data => {
    let width = { width: '22%' };
    switch (columns.length % 3) {
      case 1:
        width = { width: '88.6%' };
        break;
      case 2:
        width = { width: '55.3%' };
        break;
      default:
        break;
    }
    return (
      <Card style={{ border: 'none', padding: 5 }}>
        {!isEmpty(columns) && (columns.map((item, index) => {
          if (columns.length === (index + 1)) {
            return [
              <Card.Grid key={index} style={gridStyleTitle}>{isChinese ? item.chName : item.enName}</Card.Grid>,
              <Card.Grid key={index + '1'} style={{ ...gridStyle, ...width }}>{data.extend[item.columnName]}</Card.Grid>
            ];
          } else {
            return [
              <Card.Grid key={index} style={gridStyleTitle}>{isChinese ? item.chName : item.enName}</Card.Grid>,
              <Card.Grid key={index + '1'} style={gridStyle}>{data.extend[item.columnName]}</Card.Grid>
            ];
          }
        }))}
      </Card>
    );
  };

  const renderCard = data => (
    <Card style={{ border: 'none', padding: 5}}>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.code')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.equipmentCode}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.name')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.equipmentName}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.type')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.equipmentTypeName}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.type_id')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.equipmentModel}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.number')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.equipmentSerialNum}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.manufacturer')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.manufacturer}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.present_time')}</Card.Grid>
      <Card.Grid style={gridStyle}>{data.arrivalDate}</Card.Grid>
      <Card.Grid style={gridStyleTitle}>{getFormattedMsg('equipment.label.service_time')}</Card.Grid>
      <Card.Grid style={gridStyle1}>{data.useDate}</Card.Grid>
    </Card>
  );

  return (
    <HLayout>
      <Pane
        title={getFormattedMsg('equipment.label.equipmentDetail')}
        icon="table"
        style={{ overflow: 'hidden' }}
      >
        {!isEmpty(equipment) && renderCard(equipment)}
      </Pane>
      <Pane
        title={getFormattedMsg('equipment.label.equipmentExcute')}
        icon="table"
        style={{ overflow: 'hidden' }}
      >
        {!isEmpty(equipment) && renderExtendCard(equipment)}
      </Pane>
    </HLayout>
  );
};
 
EquipmentInfoCard.propTypes = {
  columns: PropTypes.array,
  equipment: PropTypes.object,
};

export default EquipmentInfoCard;
