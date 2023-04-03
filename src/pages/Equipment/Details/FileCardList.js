import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Media from 'react-media';
import { i18n } from '@hvisions/core';
import {
  Divider, Icon,
  HLayout
} from '@hvisions/h-ui';
import {
  CardList
} from '~/components';
import styles1 from './style.scss';
const { Pane } = HLayout;
const getFormattedMsg = i18n.getFormattedMsg;

const FileCardList = ({
  fileList, downloadFile, onHandleRemove
}) => {
  const renderCardList = (span, height, list) => {
    const cardHeadStyle = {
      padding: '0.5em 0 0 0.5em',
      background: '#f7f9fa'
    };
    const cardBodyStyle = {
      padding: '0 0.8em',
    };
    return (
      <CardList
        span={span}
        gutter={6}
        list={list}
        width="100%"
        renderItem={renderItem}
        renderItemTitle={renderItemTitle}
        cardHeadStyle={cardHeadStyle}
        cardBodyStyle={cardBodyStyle}
        onFile={downloadFile}
        onRemove={onHandleRemove}
        tools={['search', 'delete']}
        className={styles1['card-list-bg-file']}
        height={height}
      />
    );
  };

  const renderCardItem = (data, title, size = 13) => (
    <Fragment>
      <span style={{ paddingLeft: '0.5em', fontSize: size }}>
        {title + '：'}
      </span>
      <b className={styles1['card-b-style1']}>
        <span style={{ fontSize: size }} className={styles1['card-b-style']}>
          {data || ''}
        </span>
      </b>
    </Fragment>
  );

  const renderItem = data => (
    <Media query={{ maxWidth: 1900 }}>
      {
        matches => {
          if (matches) {
            return (
              <div key={data.id} style={{ marginTop: '1em' }}>
                {renderCardItem(data.fileExtend, getFormattedMsg('file.label.extendNameForFile'))}
                <Divider style={{ margin: '1em 0' }} />
                {renderCardItem(formatFileSize(data.fileSize), getFormattedMsg('file.label.fileSizeForFile'))}
              </div>
            );
          } else {
            return (
              <div key={data.id} style={{ marginTop: '1.8em' }}>
                {renderCardItem(data.fileExtend, getFormattedMsg('file.label.extendNameForFile'), 15)}
                <Divider style={{ margin: '1.8em 0' }} />
                {renderCardItem(formatFileSize(data.fileSize), getFormattedMsg('file.label.fileSizeForFile'), 15)}
              </div>
            );
          }
        } 
      }
    </Media>
  );

  const formatFileSize = fileSize => {
    if (fileSize < 1024) {
      return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
      let temp = fileSize / 1024;
      temp = temp.toFixed(2);
      return temp + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
      let temp = fileSize / (1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'MB';
    } else {
      let temp = fileSize / (1024 * 1024 * 1024);
      temp = temp.toFixed(2);
      return temp + 'GB';
    }
  };

  const renderItemTitle = data => (
    <b key={data.id}>
      <span style={{ fontSize: '14px' }}>
        <Icon style={{ fontSize: '14px', marginRight: '5px' }} type="file-text" />
        {data.fileName}
      </span>
    </b>
  );


  return (
    <HLayout>
      <Pane
        style={{ margin: 5 }}
      >
      <Media query={{ maxWidth: 1900 }}>
        {
          matches => matches ? renderCardList(6, 150, fileList) : renderCardList(4, 200, fileList)
        }
      </Media>
      </Pane>
    </HLayout>
  );
};
 
FileCardList.propTypes = {
  fileList: PropTypes.array,
  onHandleRemove: PropTypes.func,
  downloadFile: PropTypes.func
};

export default FileCardList;
