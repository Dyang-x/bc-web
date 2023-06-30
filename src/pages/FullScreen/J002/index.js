import React, { useEffect, useCallback, useState ,Component} from 'react';
import { HVLayout, Button, Icon } from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';
import { IndexPageStyle, IndexPageContent } from './container';
import { useResizeDetector } from 'react-resize-detector';
 
 import OverView from './Overview/index';

const { Pane } = HVLayout;

const J002OverView = ({cHeight}) => {
   

  return (
      <HVLayout >
           <OverView/>
      </HVLayout>
  );
};

export default J002OverView;
