import React, { useEffect, useState } from "react";
import { 
  HVLayout,
} from '@hvisions/h-ui';
import { isEmpty } from 'lodash';
import { i18n, withDetail,DetailComponent } from '@hvisions/core';
import MaterialInfoCard from './MaterialInfoCard';
import Head from './Head';

const getFormattedMsg = i18n.getFormattedMsg;

const Detail = ({ goBack, match, location }) => {
  const [materialData, setMaterialData] = useState({});

  useEffect(() => {
    if (isEmpty(location.state)) {
      goBack(match.url);
      return;
    }
    setMaterialData(location.state.materialData)
  }, [location]);

  return (
    <HVLayout style={{ height: 'calc(100% - 35px)' }}>
      <HVLayout.Pane
        style={{ overflow: 'hidden' }}
        height={'auto'}
      >
        <Head materialData={materialData} goBack={goBack} match={match} />
      </HVLayout.Pane>
      <HVLayout.Pane tab >
        <HVLayout.Pane.Tab title={getFormattedMsg('material.label.materialDetail')} name="1">
          <MaterialInfoCard materialData={materialData} />
        </HVLayout.Pane.Tab>
      </HVLayout.Pane>
    </HVLayout>
  );
};

export default DetailComponent(withDetail(Detail, '/material'));