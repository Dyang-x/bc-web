import React, { useState, useEffect } from 'react';
import PanelTitle from '../../Components/PanelTitle';
import ReactECharts from 'echarts-for-react';
import { LargeRect } from '../../container';
import icon1 from "../../../assets/slices/yw/ERP.png";
import icon2 from "../../../assets/slices/yw/MES.png";
import icon3 from "../../../assets/slices/yw/overview.png";
import icon4 from "../../../assets/slices/yw/report.png";
import icon5 from "../../../assets/slices/yw/video.png";

const ContentOne = ({ usedHeight }) => {
    const [icon1Data, setIcon1Data] = useState();
    const [icon2Data, setIcon2Data] = useState();
    const [icon3Data, setIcon3Data] = useState();
    const [icon4Data, setIcon4Data] = useState();
    const [icon5Data, setIcon5Data] = useState();
    const [icon6Data, setIcon6Data] = useState();

    useEffect(() => {
        setIcon1Data(534)
        setIcon2Data(87643)
        setIcon3Data(3442)
        setIcon4Data(1142341)
        setIcon5Data(65)
        setIcon6Data(423)

        // const getData = () => {
        //   console.log('4444');
        //   productService
        //     .getMouth()
        //     .then(res => {
        //       if(res!= null){
        //         const time = res.map(i=>{
        //           return i.time
        //         })
        //         setTime(time)
        //         const passRate = res.map(i=>{
        //           return i.passRate
        //         })
        //         setPassRate(passRate)
        //         const acount = res.map(i=>{
        //           return i.acount
        //         })
        //         setAcount(acount)
        //       }

        //     })
        //     .catch(err => {
        //       notification.warning({
        //         description: err.message
        //       });
        //     });
        // };
        // getData();
        const refreshData = setInterval(() => {
            //   getData();
        }, 1000 * 5);
        return () => {
            clearInterval(refreshData);
        };
    }, []);

    const getDailyProductionChart = (groups, dataValues1, dataValues2) => {
        const option = {
            grid: {
                left: '10%',
                right: '5%',
                top: '25%',
                bottom: '25%'
                // containLabel: true
            },
            legend: {
                top: 0,
                type: 'scroll',
                // orient: 'vertical',  //纵向
                orient: 'horizontal',  //横向
                x: 'right',
                data: ['产成品数量', 'A格品数量'],
                textStyle: {
                    fontSize: '2.5rem',
                    fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                    fontWeight: 400,
                    color: '#FFFFFF',
                }
            },
            xAxis: [
                {
                    type: "category",
                    data: groups,
                    axisLabel: {
                        //坐标轴标签样式
                        color: '#fff',
                        fontSize: 2.4 * window.rem + 'px',
                        rotate: 45,
                        interval: 0
                    },
                    axisTick: {
                        //刻度线
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    // name: 'Precipitation',
                    // min: 0,
                    // max: 250,
                    // interval: 50,
                    splitLine: {
                        //网格线
                        show: false
                    },
                    axisLine: {
                        //坐标轴线
                        show: true
                    },
                    axisLabel: {
                        //坐标轴标签样式
                        color: '#fff',
                        fontSize: 2.4 * window.rem + 'px'
                    },
                    position: "left",
                },
            ],
            series: [
                {
                    name: '产成品数量',
                    type: 'bar',
                    barWidth: '10rem', //柱条宽度
                    data: dataValues1,
                    label: {
                        //文本标签的样式
                        show: true,
                        color: '#fff', //文字的颜色
                        // position: 'top', //文字的位置
                        position: 'insideRight', //文字的位置
                        fontSize: 2.4 * window.rem + 'px'
                    },
                    itemStyle: {
                        //图形的样式
                        borderRadius: [20, 20, 20, 20],
                        color: dataItem => {
                            if (dataItem.dataIndex % 2 == 1) {
                                return {
                                    //渐变色配置
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(46, 210, 245, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(106, 216, 223, 0.38)'
                                        }
                                    ],
                                    global: false
                                };
                            } else {
                                return {
                                    //渐变色配置
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: 'rgba(46, 90, 245, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(82, 80, 184, 0.38)'
                                        }
                                    ],
                                    global: false
                                };
                            }
                        }
                    }
                },
                {
                    name: 'A格品数量',
                    yAxisIndex: '0',
                    type: 'line',
                    data: dataValues2,
                    label: {
                        //文本标签的样式
                        show: true,
                        color: '#fff', //文字的颜色
                        position: 'insideBottomLeft', //文字的位置
                        fontSize: 2.4 * window.rem + 'px'
                    },
                },
            ]
        };
        return option;
    };

    return (
        <div
            style={{
                marginTop: '4rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                // height: usedHeight * 0.6
                height: '110rem'
            }}
        >
            <LargeRect style={{ flex: '1', }}>
                <PanelTitle title="核心产品" style={{ width: '100%', }} />
 
                <div
                    style={{
                        display: 'flex',
                        height:usedHeight * 0.6*0.32,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ textAlign: "center"  ,width: '50%', }}>
                        <img
                            src={icon1}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon1Data}
                        </div>
                    </div>
                    <div style={{ textAlign: "center" ,width: '50%',}}>
                        <img
                            src={icon2}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon2Data}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        height:usedHeight * 0.6*0.32,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ textAlign: "center"  ,width: '50%',}}>
                        <img
                            src={icon3}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon3Data}
                        </div>
                    </div>
                    <div style={{ textAlign: "center" ,width: '50%',}}>
                        <img
                            src={icon4}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon4Data}
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        height:usedHeight * 0.6*0.32,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ textAlign: "center"  ,width: '50%',}}>
                        <img
                            src={icon5}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon5Data}
                        </div>
                    </div>
                    <div style={{ textAlign: "center" ,width: '50%',}}>
                        <img
                            src={icon1}
                            alt=""
                            style={{
                                backgroundColor: "transparent",
                                height: usedHeight  * 0.12,
                            }}
                        />
                        <div
                            className="r-text"
                            style={{
                                textAlign: "center",
                                fontSize: 25,
                                fontWeight: 500,
                                height: usedHeight * 0.03,
                                color: "#fff",
                            }}
                        >
                            入库数量:       {icon6Data}
                        </div>
                    </div>
                </div>
 
            </LargeRect>
        </div>
    );
};

export default ContentOne;
