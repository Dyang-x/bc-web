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
                    <div className={styles.label} >采购单号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.purchaseOrderNumber}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >采购批号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.purchaseBatchNumber}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >物料编码：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.materialCode}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >物料名称：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.materialName}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >材质：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.materialType}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >规格：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.specification}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >重量(kg)：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.weight}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >数量(张)：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.number}</div>
                </div>
            </div>
            <div className={styles.body}>
                <div >
                    <div className={styles.label} >托盘号：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.trayNumber}</div>
                </div>
                <div style={{ width:'5rem'}}></div>
                <div >
                    <div className={styles.label} >料库位置：</div>
                    <div className={styles.value} >{detailData!={}&&detailData.location}</div>
                </div>
            </div>
        </div>

    );
};

export default Detail;
