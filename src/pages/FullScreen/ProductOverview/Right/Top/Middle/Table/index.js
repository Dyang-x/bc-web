import React, { useEffect, useRef, useState } from "react";
import styles from "./style.scss";
import { Progress } from "antd";

const data = [
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已拖期', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已拖期', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '进行中', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '进行中', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '待开工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已拖期', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已拖期', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '进行中', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '进行中', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已拖期', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
  { name1: ' 2023033001', name2: ' 上刮式滚', name3: ' GW001', name4: ' 10', name5: ' 0', name6: ' 03-01 08:00', name7: ' 03-01 17:00', name8: ' 03-01 08:00', name9: ' 03-01 17:00', name10: '已完工', name11: ' 10/10', name12: ' 5/5', name13: ' 2023-03-01', },
]



const Carousel = ({usedHeight}) => {
  // 此处data为父组件传过来的数据，为数组格式
  const [list] = useState(data);
  const [isScrolle, setIsScrolle] = useState(true);

  // 滚动速度，值越小，滚动越快
  const speed = 100;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();

  // 开始滚动
  useEffect(() => {
    // 多拷贝一层，让它无缝滚动
    childDom2.current.innerHTML = childDom1.current.innerHTML;
    let timer;
    if (isScrolle) {
      timer = setInterval(
        () =>
          // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
          warper.current.scrollTop >= childDom1.current.scrollHeight
            ? (warper.current.scrollTop = 0)
            : warper.current.scrollTop++,
        speed
      );
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isScrolle]);

  // 鼠标移入div时暂停滚动 鼠标移出div后继续滚动，设置boolean,true为动，false为停
  const hoverHandler = (flag) => setIsScrolle(flag);

  const getRank = (value) => {
    return value && value !== "-"
      ? `${Number((Number(value) * 100).toFixed(2))}%`
      : "-";
  };

  const getColor = (value) => {
    const num = Number((Number(value) * 100).toFixed(2));
    if (num >= 90) {
      return "color";
    } else if (num >= 80 && num < 90) {
      return "color1";
    } else if (num < 80) {
      return "color2";
    } else {
      return "";
    }
  };

  const getRollStyle = (item) => {
    const name10 = item.name10
    if (name10 == '已拖期') {
      return 'overdue'
    }
    if (name10 == '进行中') {
      return 'doing'
    }
    return 'other'
  }

  return (
    <div 
    // className={styles.Table} 
    style={{
      // height:usedHeight*0.35
      height:'80.2rem'
    }} 
    >
      <div className={styles.Theader}>
        <div className={styles.tNum}>序号</div>
        <div >生产订单</div>
        <div >产品名称</div>
        <div >班组</div>
        <div >计划数量</div>
        <div >完工数量</div>
        <div >计划开始时间</div>
        <div >计划结束时间</div>
        <div >实际开始</div>
        <div >实际结束</div>
        <div >业务状态</div>
        <div >外购齐套性</div>
        <div >自制齐套性</div>
        <div >交货期</div>
      </div>
      <div className={styles.parent} ref={warper}>

        <div className={styles.child} ref={childDom1}>
          {list.map((item, index) => (
            <li
              // className={styles.deviceListItem}
              className={styles[getRollStyle(item)]}
              key={index}
              onFocus={() => 0}
              onMouseOver={() => hoverHandler(false)}
              onMouseLeave={() => hoverHandler(true)}
            >
              <span className={styles.num}>{index}</span>
              <span >{item.name1}</span>
              <span >{item.name2}</span>
              <span >{item.name3}</span>
              <span >{item.name4}</span>
              <span >{item.name5}</span>
              <span >{item.name6}</span>
              <span >{item.name7}</span>
              <span >{item.name8}</span>
              <span >{item.name9}</span>
              <span className={styles.state}>{item.name10}</span>
              <span >{item.name11}</span>
              <span >{item.name12}</span>
              <span >{item.name13}</span>
            </li>
          ))}
        </div>
        <div className={styles.child} ref={childDom2}></div>
      </div>
    </div>
  );
};

export default Carousel;

