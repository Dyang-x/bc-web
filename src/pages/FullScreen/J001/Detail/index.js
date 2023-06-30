import React, { useEffect, useCallback, useState, Component } from 'react';
import { HVLayout, Button, Icon ,Input} from '@hvisions/h-ui';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import styles from './style.scss';

const { Pane } = HVLayout;

const Detail = ({ cHeight }) => {


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
                    <div className={styles.value} >M10000000044</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >托盘号：</div>
                    <div className={styles.value} >1TPB0001</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >品号：</div>
                    <div className={styles.value} >040100200001</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >品名：</div>
                    <div className={styles.value} >链板排屑器</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >原始库位：</div>
                    <div className={styles.value} >7-1</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >目标库位：</div>
                    <div className={styles.value} >C001</div>
                </div>
            </div>
        </div>

    );
};

export default Detail;
