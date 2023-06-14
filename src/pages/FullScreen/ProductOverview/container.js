import styled from 'styled-components';
import rectSmallBorder from '../assets/slices/rectSmallBorder.svg';
import rectMediumBorder from '../assets/slices/rectMediumBorder.svg';

import rectLargeBorder from '../assets/slices/rectLargeBorder.svg';

// 页面全局样式
export const IndexPageStyle = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0px;
  padding: 0;
  background-size: cover;
`;
// 中间容器样式
export const IndexPageContent = styled.div`
  margin-left: 6.7rem;
  margin-right: 6.7rem;
`;

// 中间左容器样式
export const IndexPageLeft = styled.div`
color: #ffffff;
background-color: #159F5D;
  display: inline;
  float: left
`;

// 中间右容器样式
export const IndexPageRight = styled.div`
color: #000000;
background-color: #DC5347;
  display: inline;
  float: left
`;

// 页面全局样式
export const SmallRect = styled.div`
  width: 90rem;
  height: 100%;
  background: url(${rectSmallBorder}) center center no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
`;
// 中间容器样式
export const MeduimRect = styled.div`
  width: 183.6rem;
  height: 100%;
  background: url(${rectMediumBorder}) center center no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
`;

export const LargeRect = styled.div`
  width: 278.5rem;
  height: 100%;
  background: url(${rectLargeBorder}) center center no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
`;