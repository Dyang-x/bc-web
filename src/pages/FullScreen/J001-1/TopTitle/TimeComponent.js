import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
const TimeComponent = () => {
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
    <>
      <div
        style={{
          height: '8rem',
          fontSize: '8rem',
          lineHeight: '8rem',
          marginLeft: '2rem'
        }}
      >
        {time.format('HH:mm:ss')}
      </div>
      <div
        style={{
          height: '8rem',
          fontSize: '3.3rem',
          fontFamily: 'DINPro-Bold, DINPro',
          fontWeight: 'bold',
          color: '#FFFFFF',
          lineHeight: '4.2rem',
          marginLeft: '2.1rem'
        }}
      >
        {time.format('dddd')} <br />
        {time.format('YYYY/MM/DD')}
      </div>
    </>
  );
};

export default TimeComponent;
