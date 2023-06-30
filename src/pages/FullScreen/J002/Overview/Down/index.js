import React, { useState, useEffect } from 'react';
import { Icon, Button } from '@hvisions/h-ui';
import styles from './style.scss';

const ContentThree = ({others}) => {
    // const [time, setTime] = useState(moment(new Date()).locale('en'));
    useEffect(() => {
    //     const updateTime = setInterval(() => {
    //         setTime(moment(new Date()).locale('en'));
    //     }, 1000);
    //     return () => {
    //         clearInterval(updateTime);
    //     };
    }, []);

    const getStatus =(others)=>{
        if(others.status ==1){
            return <Button className={styles[getColor(others.status)]}>手动</Button>
        }
        if(others.status ==2){
            return <Button className={styles[getColor(others.status)]}>自动</Button>
        }
        if(others.status ==3){
            return <Button className={styles[getColor(others.status)]}>故障</Button>
        }
    }

    const getColor = (value) => {
        if(value ==1){
            return "manual";
        }
        if(value ==1){
            return "auto";
        }
        if(value ==1){
            return "breakdown";
        }
      };

    return (
        <div className={styles.Title}>
            <div className={styles.num} >B型空托：{others.empty}</div>
            <div className={styles.num} >B型满托：{others.full}</div>
            <div className={styles.status} >库区状态：{getStatus(others)}</div>
        </div>
    );
};

export default ContentThree;
