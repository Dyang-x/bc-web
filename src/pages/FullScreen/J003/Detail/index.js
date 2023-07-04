import React, { useEffect, useCallback, useState, Component } from 'react';
import { HVLayout, Button, Icon ,Input} from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';

const { Pane } = HVLayout;

const Detail = ({ detailData }) => {


    return (
        <div
            style={{
                height: '120rem'
            }}
        >
            <div className={styles.title}>当前库位信息</div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >生产单号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.planCode}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >托盘号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.trayNumber}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >品号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.productNumber}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >品名：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.productName}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >原始库位：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.fromLocation}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >目标库位：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.toLocation}</div>
                </div>
            </div>
        </div>

    );
};

export default Detail;
