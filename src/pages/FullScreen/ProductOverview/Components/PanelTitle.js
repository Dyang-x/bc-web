import React from 'react';
import blockHeader from '../../assets/slices/blockHeader.svg';

import { DatePicker } from '@hvisions/h-ui';
import styles from './style.scss';

const { MonthPicker } = DatePicker;

const PanelTitle = ({ title }) => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
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
      {/* <MonthPicker
        className={styles.monthPicker}
        style={{
          marginLeft: '2rem',
          marginTop: '2rem',
          marginRight: '2rem',
        }}
        placeholder="请选择月份"
        allowClear={false}
      /> */}
    </div>
  );
};

export default PanelTitle;
