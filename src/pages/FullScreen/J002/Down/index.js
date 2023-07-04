import React, { useState, useEffect } from 'react';
import { Icon, Button } from '@hvisions/h-ui';
import styles from './style.scss';

const ContentThree = ({ trayCount, rbgStatus }) => {
    // const [time, setTime] = useState(moment(new Date()).locale('en'));
    useEffect(() => {
        //     const updateTime = setInterval(() => {
        //         setTime(moment(new Date()).locale('en'));
        //     }, 1000);
        //     return () => {
        //         clearInterval(updateTime);
        //     };
    }, []);

    const getStatus = (rbgStatus) => {
        // console.log('others.rbgStatus',others.rbgStatus);
        if (rbgStatus == "手动") {
            return <Button className={styles["manual"]}>手动</Button>
        }
        if (rbgStatus == "自动") {
            return <Button className={styles["auto"]}>自动</Button>
        }
        if (rbgStatus == "异常") {
            return <Button className={styles["breakdown"]}>故障</Button>
        }
    }

    return (
        <div className={styles.Title}>
            <div className={styles.num} >A型空托：{trayCount.aemptyCount}</div>
            <div className={styles.num} >A型满托：{trayCount.afullCount}</div>
            <div className={styles.num} >B型空托：{trayCount.bemptyCount}</div>
            <div className={styles.num} >B型满托：{trayCount.bfullCount}</div>
            <div className={styles.status} >库区状态：{getStatus(rbgStatus)}</div>
        </div>
    );
};

export default ContentThree;
