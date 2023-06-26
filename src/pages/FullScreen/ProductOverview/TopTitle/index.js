import React, { useState, useEffect } from 'react';
import { TopTitleDiv } from './style';
import { Icon, Divider } from '@hvisions/h-ui';
import styles from './style.scss';
import moment from 'moment';
import TimeComponent from './TimeComponent';
const TopTitle = () => {
  const [time, setTime] = useState(moment(new Date()).locale('en'));
  useEffect(() => {
    const updateTime = setInterval(() => {
      setTime(moment(new Date()).locale('en'));
    }, 1000);
    return () => {
      clearInterval(updateTime);
    };
  }, []);
  return (
    <TopTitleDiv>
      <div className={styles.topDiv}></div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '9rem'
        }}
        className={styles.topDiv}
      >
        <div
          style={{
            fontSize: '9rem',
            fontFamily: 'PangMenZhengDao-Regular, PangMenZhengDao',
            fontWeight: '400',
            color: '#5CEBFF',
            letterSpacing: '0.5rem',
            verticalAlign: 'text-top',
            marginLeft: '3rem'
          }}
        >
          {/* 永威(天津)科技 */}
        </div>
        <Divider
          type="vertical"
          style={{
            height: '4.5rem',
            fontSize: '8rem',
            lineHeight: '6rem',
            marginLeft: '2.8rem',
            backgroundColor: '#5CEBFF'
          }}
        />
        <div
          style={{
            fontSize: '9rem',
            fontFamily: 'PangMenZhengDao-Regular, PangMenZhengDao',
            fontWeight: '400',
            color: '#FCFCFC',
            letterSpacing: '0.5rem',
            verticalAlign: 'text-top',
            marginLeft: '3rem'
          }}
        >
          生产总览
        </div>
      </div>
      <div
        className={styles.topDiv}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          color: '#FCFCFC',
          marginRight: '6rem',
          height: '100%',
          width: '100rem',
        }}
      >
        <TimeComponent />
      </div>
    </TopTitleDiv>
  );
};

export default TopTitle;
