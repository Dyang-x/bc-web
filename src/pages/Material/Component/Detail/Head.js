import React, { useEffect, useState } from 'react';
import { Divider } from '@hvisions/h-ui';
import { getApiAddress } from '@hvisions/toolkit/lib/session';
import { i18n } from '@hvisions/toolkit';

const getFormattedMsg = i18n.getFormattedMsg;
const api = getApiAddress();
const Head = ({ materialData, goBack, match }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        fontFamily: 'var(--ne-basic-font-family)'
      }}
    >
      <div style={{ margin: '0 var(--ne-basic-space)' }}>
        <div style={{ fontSize: 'var(--ne-basic-font-size)', color: 'var(--ne-basic-title-font)' }}>
          {getFormattedMsg('material.label.materialName')}
        </div>
        <div style={{ fontSize: 'var(--ne-statistics-font-size)' }}>
          {materialData.materialName}
        </div>
      </div>
      <Divider type="verticle" style={{ height: 'auto' }} />
      <div style={{ margin: '0 var(--ne-basic-space)' }}>
        <div style={{ fontSize: 'var(--ne-basic-font-size)', color: 'var(--ne-basic-title-font)' }}>
          {getFormattedMsg('material.label.materialCode')}
        </div>
        <div style={{ fontSize: 'var(--ne-statistics-font-size)' }}>
          {materialData.materialCode}
        </div>
      </div>
      <Divider type="verticle" style={{ height: 'auto' }} />
      <div style={{ margin: '0 var(--ne-basic-space)' }}>
        <div style={{ fontSize: 'var(--ne-basic-font-size)', color: 'var(--ne-basic-title-font)' }}>
          {getFormattedMsg('material.label.materialType')}
        </div>
        <div style={{ fontSize: 'var(--ne-statistics-font-size)' }}>
          {materialData.materialTypeName}
        </div>
      </div>
    </div>
  );
};

export default Head;
