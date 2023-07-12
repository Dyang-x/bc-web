import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";

import TopLeft from "../TopLeft/index";
import TopRight from "../TopRight/index";

const ContentTwo = ({ LeftData, RightData }) => {

  return (
    <div
      style={{
        height: '20rem'
      }}
    >
      <div className={styles.Title}>分组统计</div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: "50%", marginRight: '10rem' }}>
          <TopLeft className={styles.left} LeftData={LeftData} />
        </div>
        <div style={{ width: "50%", marginLeft: '10rem' }}>
          <TopRight className={styles.right} RightData={RightData} />
        </div>
      </div>
    </div>
  );
};

export default ContentTwo;

