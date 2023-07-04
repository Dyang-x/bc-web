import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";
import { isEmpty } from "lodash";

const ContentTwo = ({ newData }) => {
  const [listL, setListL] = useState([]);
  const [listR, setListR] = useState([]);

  useEffect(() => {
    console.log('newData', newData);

    const group = (array = [], subGroupLength = 0) => {
      let index = 0;
      const newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    }

    // const datas = [
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "总量" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "12mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "10mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "8mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "6mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "5mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "3mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "2.5mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "2.3mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "2.0mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "1.5mm" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "镀锌板" },
    //   { trayNumber: 20, weight: 123.4567, number: 360, mgroup: "不锈钢" }
    // ]

    // console.log('20111', group(datas, 7))
    const data = group(newData, 7)
    setListL(data[0])
    setListR(data[1])
  }, [newData]);

  return (
    <div
      style={{
        height: '20rem'
      }}
    >
      <div className={styles.Title}>分组统计</div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: "50%", marginRight: '10rem' }}>
          <div className={styles.Theader}>
            <div className={styles.tNum}>序号</div>
            <div >分组项</div>
            <div >托盘数量</div>
            <div >总重量(kg)</div>
            <div >总数量(张)</div>
          </div>
          <div className={styles.parent}>
            <div className={styles.child}>
              {!isEmpty(listL) && listL.map((item, index) => (
                <li
                  className={styles['other']}
                  key={index}
                >
                  <span className={styles.num}>{index + 1}</span>
                  <span >{item.mgroup}</span>
                  <span >{item.trayNumber}</span>
                  <span >{item.weight}</span>
                  <span >{item.number}</span>
                </li>
              ))}
            </div>
          </div>
        </div>
        <div style={{ width: "50%", marginLeft: '10rem' }}>
          <div className={styles.Theader}>
            <div className={styles.tNum}>序号</div>
            <div >分组项</div>
            <div >托盘数量</div>
            <div >总重量(kg)</div>
            <div >总数量(张)</div>
          </div>
          <div className={styles.parent}>
            <div className={styles.child}>
              {!isEmpty(listR) && listR.map((item, index) => (
                <li
                  className={styles['other']}
                  key={index}
                >
                  <span className={styles.num}>{index + 7}</span>
                  <span >{item.mgroup}</span>
                  <span >{item.trayNumber}</span>
                  <span >{item.weight}</span>
                  <span >{item.number}</span>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentTwo;

