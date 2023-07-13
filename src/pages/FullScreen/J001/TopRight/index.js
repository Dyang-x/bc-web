import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";
import { isEmpty } from "lodash";

const TopRight = ({RightData}) => {
  // 此处data为父组件传过来的数据，为数组格式
  const [list, setList] = useState([]);
  const [isScrolle, setIsScrolle] = useState(true);

  // 滚动速度，值越小，滚动越快
  const speed = 50;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();

  useEffect(() => {
    setList(RightData)    
    setIsScrolle(true)
  }, [RightData]);

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
        height: '65rem'
      }}
    >
      <div className={styles.Theader}>
      <div className={styles.tNum}>序号</div>
            <div >特殊规格分组</div>
            <div >托盘数量</div>
            <div >总重量(kg)</div>
            <div >总数量(张)</div>
      </div>
      <div className={styles.parent} ref={warper}>

        <div className={styles.child} ref={childDom1}>
          {!isEmpty(list) &&list.map((item, index) => (
            <li
              className={styles[getRollStyle(item)]}
              key={index}
              onFocus={() => 0}
              onMouseOver={() => hoverHandler(false)}
              onMouseLeave={() => hoverHandler(true)}
            >
                  <span className={styles.num}>{index + 1}</span>
                  <span >{item.mgroup}</span>
                  <span >{item.trayNumber}</span>
                  <span >{item.weight}</span>
                  <span >{item.number}</span>
            </li>
          ))}
        </div>
        {
          RightData.length > 7 &&
          <div className={styles.child} ref={childDom2}>
             {!isEmpty(list) &&list.map((item, index) => (
            <li
              className={styles[getRollStyle(item)]}
              key={index}
              onFocus={() => 0}
              onMouseOver={() => hoverHandler(false)}
              onMouseLeave={() => hoverHandler(true)}
            >
                  <span className={styles.num}>{index + 1}</span>
                  <span >{item.mgroup}</span>
                  <span >{item.trayNumber}</span>
                  <span >{item.weight}</span>
                  <span >{item.number}</span>
            </li>
          ))}
        </div>
        }
      </div>
    </div>
  );
};

export default TopRight;