import React, { useEffect, useCallback, useState ,Component} from 'react';
import { HVLayout, Button, Icon } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent } from './container';
import { useResizeDetector } from 'react-resize-detector';
 
 

const { Pane } = HVLayout;

const J003OverView = ({cHeight}) => {
   

  return (
      <HVLayout autoScroll style={{ backgroundColor: '#CCCCCC', margin: 0, padding: 0, height: '100%', position: "fixed" }}>
           
      </HVLayout>
  );
};

export default J003OverView;
