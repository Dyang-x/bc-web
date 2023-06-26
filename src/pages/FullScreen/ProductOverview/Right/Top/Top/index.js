import React, { useState, useEffect } from 'react';
import styles from './RowOne.scss';
import styled from 'styled-components';
import { notification } from '@hvisions/h-ui';
import RectangleImg from '../../../../assets/slices/Rectangle.svg';
import barpurple from '../../../../assets/slices/barpurple.svg';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import getRingOneChartOpts from './RingOneChart.js';
// 顶部容器
const RectPanel = styled.div`
  width: 49.9rem;
  height: 19.4rem;
  background: url(${RectangleImg}) center center no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightTop = () => {
  const [rawData, setRawData] = useState({});
  useEffect(() => {
    const getData = async () => {
    //   const time = moment().format('YYYY-MM-DD')
    //   axios({
    //     method: 'get',
    //     url: `http://61.181.71.154:29000/yongwei-service/OverviewLargescreenController/getOverview?time=${time}`,
    //   }).then(res => {
    //     setRawData(res.data.data);
    //   }).catch(err => {
    //     notification.warning({
    //       description: err.message
    //     });
    //   });
    };

    getData();
    const refreshData = setInterval(() => {
      getData();
      // }, 1000 * 60 * 30);
    }, 1000 * 5);
    return () => {
      clearInterval(refreshData);
    };
  }, []);

  return (
    <div
      style={{
        marginTop: '1rem',
        // marginTop: '4rem',
        // marginLeft: '4rem',
        // marginRight: '4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <RectPanel>
        <div style={{ width: '80%' }}>
          <div style={{ height: '5.9rem', display: 'flex', flexWrap: 'nowrap' }}>
            <img src={barpurple} alt="" style={{ width: '0.768rem', height: '4.1rem' }} />
            <div
              style={{
                marginLeft: '2.5rem',
                fontSize: '4.3rem',
                fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '5rem'
              }}
            >
              当日成品总产量
            </div>
          </div>
          <div
            style={{
              height: '7.7rem',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                fontSize: '7.7rem',
                fontFamily: 'DINPro-Bold, DINPro',
                fontWeight: '600',
                lineHeight: '7.7rem',
                background: 'linear-gradient(180deg, #CF39F4 0%, #7C38EC 100%)',
                WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                marginLeft: '3.268rem'
              }}
            >
              {rawData?.production}
            </div>
            <div
              style={{
                marginRight: '4rem',
                fontSize: '3.6rem',
                fontFamily: 'DINPro-Bold, DINPro',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '4.2rem'
              }}
            >
              件
            </div>
          </div>
        </div>
      </RectPanel>
      <RectPanel>
        <div style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12.8rem', height: '12.8rem' }}>
            <ReactECharts
              option={getRingOneChartOpts(rawData?.operationRate, '#E4661F', '#F49B33')}
              style={{ width: '100%', height: '100%' }}
            ></ReactECharts>
          </div>
          <div style={{ marginLeft: '3.7rem' }}>
            <div
              style={{
                fontSize: '4.3rem',
                fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '5rem'
              }}
            >
              操业率
            </div>
            <div
              style={{
                fontSize: '7.7rem',
                fontFamily: 'Barlow Condensed-SemiBold, Barlow Condensed',
                fontWeight: '600',
                lineHeight: '7.7rem',
                background: ' linear-gradient(180deg, #E4661F 0%, #F49B33 100%)',
                WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent'
              }}
            >
              {rawData?.operationRate}%
            </div>
          </div>
        </div>
      </RectPanel>
      <RectPanel>
        <div style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12.8rem', height: '12.8rem' }}>
            <ReactECharts
              option={getRingOneChartOpts(rawData?.cropRate, '#1F6EE4', '#00F4FD')}
              style={{ width: '100%', height: '100%' }}
            ></ReactECharts>
          </div>
          <div style={{ marginLeft: '3.7rem' }}>
            <div
              style={{
                fontSize: '4.3rem',
                fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '5rem'
              }}
            >
              稼动率
            </div>
            <div
              style={{
                fontSize: '7.7rem',
                fontFamily: 'Barlow Condensed-SemiBold, Barlow Condensed',
                fontWeight: '600',
                lineHeight: '7.7rem',
                background: ' linear-gradient(180deg, #1F6EE4 0%, #00F4FD 100%)',
                WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent'
              }}
            >
              {rawData?.cropRate}%
            </div>
          </div>
        </div>
      </RectPanel>
      <RectPanel>
        <div style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12.8rem', height: '12.8rem' }}>
            <ReactECharts
              option={getRingOneChartOpts(rawData?.operationRate, '#E4661F', '#F49B33')}
              style={{ width: '100%', height: '100%' }}
            ></ReactECharts>
          </div>
          <div style={{ marginLeft: '3.7rem' }}>
            <div
              style={{
                fontSize: '4.3rem',
                fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '5rem'
              }}
            >
              操业率
            </div>
            <div
              style={{
                fontSize: '7.7rem',
                fontFamily: 'Barlow Condensed-SemiBold, Barlow Condensed',
                fontWeight: '600',
                lineHeight: '7.7rem',
                background: ' linear-gradient(180deg, #E4661F 0%, #F49B33 100%)',
                WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent'
              }}
            >
              {rawData?.operationRate}%
            </div>
          </div>
        </div>
      </RectPanel>
      <RectPanel>
        <div style={{ width: '80%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12.8rem', height: '12.8rem' }}>
            <ReactECharts
              option={getRingOneChartOpts(rawData?.cropRate, '#1F6EE4', '#00F4FD')}
              style={{ width: '100%', height: '100%' }}
            ></ReactECharts>
          </div>
          <div style={{ marginLeft: '3.7rem' }}>
            <div
              style={{
                fontSize: '4.3rem',
                fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                fontWeight: '400',
                color: '#FFFFFF',
                lineHeight: '5rem'
              }}
            >
              稼动率
            </div>
            <div
              style={{
                fontSize: '7.7rem',
                fontFamily: 'Barlow Condensed-SemiBold, Barlow Condensed',
                fontWeight: '600',
                lineHeight: '7.7rem',
                background: ' linear-gradient(180deg, #1F6EE4 0%, #00F4FD 100%)',
                WebkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent'
              }}
            >
              {rawData?.cropRate}%
            </div>
          </div>
        </div>
      </RectPanel>
    </div>
  );
};

export default RightTop;
