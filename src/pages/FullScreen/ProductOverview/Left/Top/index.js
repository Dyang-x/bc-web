import React, { useState, useEffect } from 'react';
import PanelTitle from '../../Components/PanelTitle';
import ReactECharts from 'echarts-for-react';
import { LargeRect } from '../../container';

import { DatePicker } from '@hvisions/h-ui';
import styles from './style.scss';
const { MonthPicker } = DatePicker;

const ContentOne = ({ usedHeight }) => {
    const [time, setTime] = useState([]);
    const [passRate, setPassRate] = useState([]);
    const [acount, setAcount] = useState([]);

    useEffect(() => {
        const res = [
            {
                time: "06-01",
                passRate: 105,
                acount: 102
            },
            {
                time: "06-02",
                passRate: 180,
                acount: 166
            },
            {
                time: "06-03",
                passRate: 169,
                acount: 167
            },
            {
                "time": "06-04",
                "passRate": 130,
                "acount": 130
            },
            {
                "time": "06-05",
                "passRate": 159,
                "acount": 155
            },
            {
                "time": "06-06",
                "passRate": 158,
                "acount": 149
            },
            {
                "time": "06-07",
                "passRate": 183,
                "acount": 173
            },
            {
                "time": "06-08",
                "passRate": 187,
                "acount": 183
            },
            {
                "time": "06-09",
                "passRate": 176,
                "acount": 175
            },
            {
                "time": "06-10",
                "passRate": 147,
                "acount": 139
            },
            {
                "time": "06-11",
                "passRate": 115,
                "acount": 110
            }
        ]
        const time = res.map(i => {
            return i.time
        })
        setTime(time)
        const passRate = res.map(i => {
            return i.passRate
        })
        setPassRate(passRate)
        const acount = res.map(i => {
            return i.acount
        })
        setAcount(acount)

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
            title: {
                text: '一次交检合格率',
                textStyle: {
                    // fontSize: '2.5rem',
                    // fontFamily: 'Alibaba PuHuiTi-Regular, Alibaba PuHuiTi',
                    // fontWeight: 400,
                    color: '#FFFFFF',
                    
                },
                top: '5%',
                left: '4%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  crossStyle: {
                    color: '#999'
                  }
                }
              },
            legend: {
                top: '5%',
                right: '5%',
                // type: 'scroll',
                // // orient: 'vertical',  //纵向
                // orient: 'horizontal',  //横向
                // x: 'right',
                data: ['产品数量', '合格率', '合格数量'],
                textStyle: {
                    // fontSize: '2.5rem',
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
                    name: '产品数量',
                    type: 'bar',
                    barWidth: '10rem', //柱条宽度
                    data: dataValues1,
                    // label: {
                    //     //文本标签的样式
                    //     show: true,
                    //     color: '#fff', //文字的颜色
                    //     // position: 'top', //文字的位置
                    //     position: 'insideRight', //文字的位置
                    //     fontSize: 2.4 * window.rem + 'px'
                    // },
                    itemStyle: {
                        //图形的样式
                        borderRadius: [20, 20, 20, 20],
                        color: {
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
                        }
                    }
                },
                {
                    name: '合格数量',
                    type: 'bar',
                    barWidth: '10rem', //柱条宽度
                    data: dataValues1,
                    // label: {
                    //     //文本标签的样式
                    //     show: true,
                    //     color: '#fff', //文字的颜色
                    //     // position: 'top', //文字的位置
                    //     position: 'insideRight', //文字的位置
                    //     fontSize: 2.4 * window.rem + 'px'
                    // },
                    itemStyle: {
                        //图形的样式
                        borderRadius: [20, 20, 20, 20],
                        color: {
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
                        }
                    }

                },
                {
                    name: '合格率',
                    yAxisIndex: '0',
                    type: 'line',
                    data: dataValues2,
                    smooth:true,
                    // label: {
                    //     //文本标签的样式
                    //     show: true,
                    //     color: '#fff', //文字的颜色
                    //     position: 'insideBottomLeft', //文字的位置
                    //     fontSize: 2.4 * window.rem + 'px'
                    // },
                    lineStyle: {
                        color: {
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
                        }
                    }
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
                // height: usedHeight * 0.3
                height: '60rem'
            }}
        >
            <LargeRect style={{ flex: '1', }}>
                <PanelTitle title="质量数据" style={{ width: '100%', }} />
                <MonthPicker
                    className={styles.monthPicker}
                    style={{
                        marginLeft: '75rem',
                        marginTop: '2rem',
                        marginRight: '2rem',
                        position: 'fixed',
                    }}
                    placeholder="请选择月份"
                    allowClear={false}
                />
                <div style={{ flex: '1', width: '100%', overflow: 'hidden' }}>
                    <ReactECharts
                        option={getDailyProductionChart(time, passRate, acount)}
                        style={{ width: '100%', height: '100%' }}
                    ></ReactECharts>
                </div>
            </LargeRect>
        </div>
    );
};

export default ContentOne;
