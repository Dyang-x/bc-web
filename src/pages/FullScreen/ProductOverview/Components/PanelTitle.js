import React from 'react';
import blockHeader from '../../assets/slices/blockHeader.svg';

import { DatePicker } from '@hvisions/h-ui';

const { MonthPicker } = DatePicker;

const PanelTitle = ({ title }) => {
  return (
    <div>
      <div
        style={{
          width: '61rem',
          height: '6.4rem',
          marginLeft: '2rem',
          marginTop: '2rem',
          marginRight: '2rem',
          background: `url(${blockHeader}) center center no-repeat`,
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontSize: '3.8rem',
            fontFamily: 'Alibaba PuHuiTi-Medium, Alibaba PuHuiTi',
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: '4.5rem',
            marginLeft: '2.7rem',

            // 
          }}
        >
          {title}
        </div>

      </div>
      <MonthPicker
        style={{
          marginLeft: 'auto',
          justifyContent: 'flex-end',
          background: 'transport'
        }}
        placeholder="请选择月份"
      />
    </div>
  );
};

export default PanelTitle;
