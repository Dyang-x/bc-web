import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";
import { isEmpty } from "lodash";

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
      <div className={styles.Title}>托盘列表</div>
      <div className={styles.Theader}>
        <div className={styles.tNum}>序号</div>
        <div >物料编码</div>
        <div style={{width:"30%"}}>名称</div>
        <div style={{width:"40%"}}>采购单号</div>
        <div style={{width:"30%"}}>材质</div>
        <div style={{width:"35%"}}>规格</div>
        <div style={{width:"20%"}}>张数</div>
        <div >重量(kg)</div>
        <div >托盘号</div>
        <div >位置</div>
        <div style={{width:"30%"}}>入库时间</div>
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
              <span >{item.materialCode}</span>
              <span style={{width:"30%"}}>{item.materialName}</span>
              <span style={{width:"40%"}}>{item.purchaseOrderNumber}</span>
              <span style={{width:"30%"}}>{item.materialType}</span>
              <span style={{width:"35%"}}>{item.specification}</span>
              <span style={{width:"20%"}}>{item.number}</span>
              <span >{item.weight}</span>
              <span >{item.trayNumber}</span>
              <span >{item.location}</span>
              <span style={{width:"30%"}}>{item.createTime}</span>
            </li>
          ))}
        </div>
        {
          newDataDetail.length > 8 &&
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
              <span >{item.materialCode}</span>
              <span >{item.materialName}</span>
              <span >{item.purchaseOrderNumber}</span>
              <span >{item.materialType}</span>
              <span >{item.specification}</span>
              <span >{item.number}</span>
              <span >{item.weight}</span>
              <span >{item.trayNumber}</span>
              <span >{item.location}</span>
              <span className={styles.createTime}>{item.createTime}</span>
            </li>
          ))}
        </div>
        }
      </div>
    </div>
  );
};

export default ContentTwo;