import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";

const data = [
  { trayNumber: ' 1TPB0001', warehouse: ' 1-1', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0002', warehouse: ' 1-2', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0003', warehouse: ' 1-3', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0004', warehouse: ' 1-4', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0005', warehouse: ' 1-5', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0006', warehouse: ' 1-6', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0007', warehouse: ' 1-7', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0008', warehouse: ' 1-8', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0009', warehouse: ' 1-9', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0010', warehouse: ' 1-10', time: '2020-06-01 10:00:00', },
  { trayNumber: ' 1TPB0011', warehouse: ' 1-11', time: '2020-06-01 10:00:00', },
  // { trayNumber: ' 1TPB0012', warehouse: ' 1-12', time: '2020-06-01 10:00:00', },
  // { trayNumber: ' 1TPB0013', warehouse: ' 1-13', time: '2020-06-01 10:00:00', },
  // { trayNumber: ' 1TPB0014', warehouse: ' 1-14', time: '2020-06-01 10:00:00', },
]

const ContentTwo = ({newDataDetail}) => {
  // 此处data为父组件传过来的数据，为数组格式
  const [list, setList] = useState([]);
  const [isScrolle, setIsScrolle] = useState(true);

  // 滚动速度，值越小，滚动越快
  const speed = 50;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();

  useEffect(() => {
    // console.log('newDataDetail.length',newDataDetail.length);
    // setList(data)
    setList(newDataDetail)    
    setIsScrolle(true)
  }, [newDataDetail]);

  // 开始滚动
  useEffect(() => {

    // if(data.length > 10){
    // // 多拷贝一层，让它无缝滚动
    // childDom2.current.innerHTML = childDom1.current.innerHTML;
    // }

    let timerMid;
    // console.log(isScrolle, 'isScrolle');

    if (isScrolle) {
      timerMid = setInterval(
        () =>
          // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
          warper.current.scrollTop >= childDom1.current.scrollHeight
            ? (warper.current.scrollTop = 0)
            : warper.current.scrollTop++,
        speed
      );
    }
    return () => {
      clearTimeout(timerMid);
    };
  }, [isScrolle]);

  // 鼠标移入div时暂停滚动 鼠标移出div后继续滚动，设置boolean,true为动，false为停
  const hoverHandler = (flag) => setIsScrolle(flag);

  const getRollStyle = () => {
    return 'other'
  }

  return (
    <div
      style={{
        height: '100rem'
      }}
    >
      <div className={styles.Title}>生产订单列表</div>
      <div className={styles.Theader}>
        <div className={styles.tNum}>序号</div>
        <div >托盘号</div>
        <div >料库位置</div>
        <div >入库时间</div>
      </div>
      <div className={styles.parent} ref={warper}>

        <div className={styles.child} ref={childDom1}>
          {list.map((item, index) => (
            <li
              className={styles[getRollStyle(item)]}
              key={index}
              onFocus={() => 0}
              onMouseOver={() => hoverHandler(false)}
              onMouseLeave={() => hoverHandler(true)}
            >
              <span className={styles.num}>{index + 1}</span>
              <span >{item.trayNumber}</span>
              <span >{item.toLocation}</span>
              <span >{item.createTime}</span>
            </li>
          ))}
        </div>
        {/* <div className={styles.child} ref={childDom2}></div> */}
        {
          newDataDetail.length > 11 &&
          <div className={styles.child} ref={childDom2}>
            {list.map((item, index) => (
              <li
                className={styles[getRollStyle(item)]}
                key={index}
                onFocus={() => 0}
                onMouseOver={() => hoverHandler(false)}
                onMouseLeave={() => hoverHandler(true)}
              >
              <span className={styles.num}>{index + 1}</span>
              <span >{item.trayNumber}</span>
              <span >{item.toLocation}</span>
              <span >{item.createTime}</span>
              </li>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default ContentTwo;