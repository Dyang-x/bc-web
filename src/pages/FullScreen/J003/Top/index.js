import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";
import { isEmpty } from "lodash";

const ContentTwo = ({ newData }) => {

  useEffect(() => {

  }, [newData]);

  return (
    <div
      style={{
        height: '20rem'
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
          <span >{newData != {} && !isEmpty(newData)&&newData.planCode}</span>
          <span >{newData != {} && !isEmpty(newData)&&newData.productNumber}</span>
          <span >{newData != {} && !isEmpty(newData)&&newData.productName}</span>
          <span >{newData != {} && !isEmpty(newData)&&newData.trayNumber}</span>
        </li>
      </div>
    </div>
  );
};

export default ContentTwo;

