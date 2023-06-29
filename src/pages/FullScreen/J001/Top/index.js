import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";

const ContentTwo = ({newData}) => {

  useEffect(() => {
    
  }, [newData]);

  return (
    <div 
    style={{
      height:'20rem'
    }} 
    >
      <div className={styles.Title}>生产订单数量</div>
      <div className={styles.Theader}>
        <div >生产订单号</div>
        <div >品号</div>
        <div >品名</div>
        <div >托盘数量</div>
      </div>
 
        <div className={styles.child} >
            <li
              className={styles['other']}
            >
              <span >{newData.number}</span>
              <span >{newData.name}</span>
              <span >{newData.type}</span>
              <span >{newData.count}</span>
            </li>
  
        </div>
 
    </div>
  );
};

export default ContentTwo;

